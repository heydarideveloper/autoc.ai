"""Excel bulk import conversation handlers."""

from __future__ import annotations

import asyncio
import json
import logging
import re
import tempfile
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd
from telegram import Message, Update
from telegram.ext import (
    CallbackQueryHandler,
    CommandHandler,
    ConversationHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

from .. import constants
from ..keyboards import excel_confirmation_keyboard
from ..services.api_client import ApiClientError
from ..services.helpers import deduplicate_keywords, looks_like_duplicate, normalize_keyword, slugify
from ..services.image_service import get_clean_images
from ..services.pricing_service import get_competitive_pricing
from ..services.gpt_service import GptClientError
from .feedback import show_feedback_request
from .new_product import (
    _create_product_from_payload,
    _get_api_client,
    _get_gpt_client,
    _build_snippet_canonical,
    _compose_variant_title,
)

logger = logging.getLogger(__name__)


def build_conversation() -> ConversationHandler:
    return ConversationHandler(
        entry_points=[
            CallbackQueryHandler(
                start_excel_import,
                pattern=rf"^{constants.MENU_CALLBACK_PREFIX}\|import_excel$",
            )
        ],
        states={
            constants.AWAIT_FILE: [MessageHandler(filters.Document.ALL, handle_excel_file)],
            constants.CONFIRM_ANALYSIS: [CallbackQueryHandler(handle_excel_confirmation, pattern=rf"^{constants.EXCEL_CALLBACK_PREFIX}\|")],
        },
        fallbacks=[CommandHandler("cancel", cancel_excel_import)],
        conversation_timeout=constants.EXCEL_CONVERSATION_TIMEOUT,
        name=constants.EXCEL_IMPORT_CONV,
        persistent=False,
    )


async def start_excel_import(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()

    features = context.user_data.get("features", [])
    if constants.FEATURE_IMPORT_EXCEL not in features:
        await query.edit_message_text(
            "دسترسی به ایمپورت اکسل برای حساب شما فعال نیست. لطفاً ابتدا پلن مناسب را فعال کنید."
        )
        return ConversationHandler.END

    if "api_client" not in context.user_data:
        await query.edit_message_text("برای استفاده از این قابلیت ابتدا احراز هویت را کامل کنید.")
        return ConversationHandler.END

    context.user_data["excel"] = {}
    await query.edit_message_text("فایل اکسل یا CSV محصولات را ارسال کن (حداکثر ۱۰هزار ردیف).")
    return constants.AWAIT_FILE


async def handle_excel_file(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    message = update.message
    if not message or not message.document:
        await message.reply_text("برای ادامه باید فایل اکسل یا CSV ارسال کنید.")
        return constants.AWAIT_FILE

    document = message.document
    filename = document.file_name or "products.xlsx"
    extension = Path(filename).suffix.lower()

    if extension not in {".xlsx", ".xls", ".csv"}:
        await message.reply_text("فرمت فایل پشتیبانی نمی‌شود. لطفاً xlsx، xls یا csv ارسال کن.")
        return constants.AWAIT_FILE

    temp_dir = Path(tempfile.mkdtemp(prefix="excel_import_"))
    temp_path = temp_dir / f"source{extension}"

    try:
        file_resource = await document.get_file()
        await file_resource.download_to_drive(custom_path=str(temp_path))
    except Exception as exc:
        logger.exception("Failed to download excel file: %s", exc)
        await message.reply_text("دانلود فایل با خطا مواجه شد. لطفاً دوباره تلاش کن.")
        return constants.AWAIT_FILE

    status_msg = await message.reply_text("در حال خواندن فایل...")

    try:
        dataframe = await asyncio.to_thread(_load_dataframe, temp_path)
    except Exception as exc:
        await _delete_message_safe(status_msg)
        await message.reply_text(f"خواندن فایل امکان‌پذیر نبود: {exc}")
        _cleanup_excel_temp(context, str(temp_path))
        return constants.AWAIT_FILE

    try:
        column_meta = _detect_dataframe_columns(dataframe)
    except ValueError as exc:
        await _delete_message_safe(status_msg)
        await message.reply_text(f"تشخیص ستون‌های فایل امکان‌پذیر نبود: {exc}")
        _cleanup_excel_temp(context, str(temp_path))
        return constants.AWAIT_FILE

    rows = _prepare_dataframe_rows(dataframe, column_meta)
    gpt_client = _get_gpt_client(context)

    status_msg = await _edit_or_reply(status_msg, message, "در حال تجمیع اطلاعات و ارسال به GPT...")

    analysis_mode = "gpt"
    try:
        grouped_parents = await asyncio.to_thread(
            gpt_client.group_excel_products,
            rows,
        )
    except GptClientError as exc:
        logger.warning("GPT grouping failed: %s", exc)
        status_msg = await _edit_or_reply(status_msg, message, "تحلیل هوشمند در دسترس نیست؛ در حال استفاده از روش جایگزین...")
        grouped_parents = await asyncio.to_thread(_fallback_grouping_from_dataframe, dataframe, column_meta)
        analysis_mode = "fallback"

    _hydrate_grouped_parents(rows, grouped_parents, column_meta)

    if not grouped_parents:
        await _delete_message_safe(status_msg)
        await message.reply_text("هیچ محصولی در فایل شناسایی نشد. لطفاً فایل را بررسی کن.")
        _cleanup_excel_temp(context, str(temp_path))
        return constants.AWAIT_FILE

    payload = context.user_data.setdefault("excel", {})
    payload["file_path"] = str(temp_path)
    payload["grouped_parents"] = grouped_parents
    payload["column_meta"] = column_meta

    await _delete_message_safe(status_msg)

    parent_count = len(grouped_parents)
    variant_count = sum(len(parent.get("variants", [])) for parent in grouped_parents)
    sample_parent = grouped_parents[0] if grouped_parents else {}
    sample_text = json.dumps(sample_parent, ensure_ascii=False, indent=2)

    summary_lines = [
        "تحلیل فایل با موفقیت انجام شد ✅",
        f"• محصولات اصلی شناسایی شده: {parent_count}",
        f"• مجموع متغیرها: {variant_count}",
        "\nنمونه ساختار یکی از محصولات:",
        f"<pre>{sample_text}</pre>",
        "آیا فرآیند ایجاد این محصولات را شروع کنم؟",
    ]
    if analysis_mode == "fallback":
        summary_lines.insert(1, "• توجه: تحلیل هوشمند GPT در دسترس نبود و از روش ساده جایگزین استفاده شد.")

    await message.reply_html("\n".join(summary_lines), reply_markup=excel_confirmation_keyboard())
    return constants.CONFIRM_ANALYSIS


async def handle_excel_confirmation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()

    decision = (query.data or "").split("|", 1)[-1]
    payload = context.user_data.get("excel", {})
    grouped_parents = payload.get("grouped_parents", [])

    if decision == "confirm":
        await query.edit_message_text("ایمپورت آغاز شد! پس از پایان به اطلاع می‌رسانم.")
        await _perform_bulk_import(query, context, grouped_parents)
    else:
        await query.edit_message_text("فرآیند ایمپورت لغو شد. هر زمان خواستی می‌توانی دوباره فایل را ارسال کنی.")

    _cleanup_excel_temp(context, payload.get("file_path"))
    context.user_data.pop("excel", None)
    return ConversationHandler.END


async def cancel_excel_import(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    payload = context.user_data.pop("excel", {})
    _cleanup_excel_temp(context, payload.get("file_path"))
    await update.message.reply_text("ایمپورت متوقف شد. هر زمان خواستی دوباره شروع کن.")
    return ConversationHandler.END


async def _perform_bulk_import(query_owner, context: ContextTypes.DEFAULT_TYPE, grouped_parents: List[Dict[str, Any]]) -> None:
    message = query_owner.message
    if not message:
        return

    if not grouped_parents:
        await message.reply_text("ساختاری برای ایجاد محصول یافت نشد.")
        return

    api_client = _get_api_client(context)
    gpt_client = _get_gpt_client(context)

    try:
        brands_response = await asyncio.to_thread(api_client.get_brands)
    except ApiClientError as exc:
        await message.reply_text(f"دریافت فهرست برندها با خطا مواجه شد: {exc}")
        return

    brand_cache = {
        brand.get("brandID"): brand
        for brand in (brands_response.get("brands") or brands_response.get("items") or [])
        if brand.get("brandID")
    }

    try:
        category_index = await asyncio.to_thread(_build_category_index, api_client)
    except ApiClientError as exc:
        await message.reply_text(f"دریافت فهرست دسته‌بندی‌ها با خطا مواجه شد: {exc}")
        return

    previous_payload = context.user_data.get("new_product")
    created_products: List[Dict[str, str]] = []
    failed_products: List[str] = []

    for parent in grouped_parents:
        progress_msg = await message.reply_text(f"در حال پردازش «{parent.get('parent_title', 'محصول')}»...")
        try:
            result = await _process_parent_group(
                message,
                context,
                api_client,
                gpt_client,
                brand_cache,
                category_index,
                parent,
            )
            created_products.append(result)
        except Exception as exc:  # noqa: BLE001
            logger.exception("Bulk import failed for %s", parent.get("parent_title"), exc_info=exc)
            failed_products.append(f"{parent.get('parent_title', 'محصول ناشناخته')}: {exc}")
        finally:
            if previous_payload is not None:
                context.user_data["new_product"] = previous_payload
            else:
                context.user_data.pop("new_product", None)
            await _delete_message_safe(progress_msg)

    summary_lines = []
    if created_products:
        summary_lines.append(f"✅ {len(created_products)} محصول با موفقیت ایجاد شد:")
        public_base = context.user_data.get("public_base_url", "").rstrip("/")
        for item in created_products[:10]:
            slug = item.get("slug")
            link = f"{public_base}/product/{slug}" if public_base and slug else "(لینکی در دسترس نیست)"
            summary_lines.append(f"• {item.get('title')} — {link}")
    if failed_products:
        summary_lines.append("❗ موارد ناموفق:")
        summary_lines.extend(f"• {item}" for item in failed_products[:10])
    if not summary_lines:
        summary_lines.append("هیچ محصولی ایجاد نشد.")

    await message.reply_text("\n".join(summary_lines))
    if created_products:
        await show_feedback_request(message, context, constants.FEEDBACK_CONTEXT_IMPORT)


def _cleanup_excel_temp(context: ContextTypes.DEFAULT_TYPE, file_path: str | None) -> None:
    if not file_path:
        return
    path = Path(file_path)
    try:
        if path.exists():
            path.unlink()
        parent = path.parent
        if parent.exists() and parent.is_dir() and not any(parent.iterdir()):
            parent.rmdir()
    except OSError:
        logger.debug("Failed to clean temp file %s", file_path)


async def _process_parent_group(
    message: Message,
    context: ContextTypes.DEFAULT_TYPE,
    api_client,
    gpt_client,
    brand_cache: Dict[Any, Dict[str, Any]],
    category_index: Dict[str, Dict[str, Any]],
    parent: Dict[str, Any],
) -> Dict[str, str]:
    parent_title = (parent.get("parent_title") or "").strip()
    if not parent_title:
        raise ValueError("عنوان محصول اصلی مشخص نیست.")

    variants = parent.get("variants") or []
    if not variants:
        raise ValueError("هیچ متغیری برای محصول یافت نشد.")

    brand_hint = (parent.get("brand") or "").strip()
    category_hints = parent.get("category_hints") or []

    brand_info = await _resolve_brand(api_client, brand_cache, brand_hint, context)
    category_ids, category_titles = await _resolve_categories(
        api_client,
        category_index,
        parent_title,
        category_hints,
        context,
    )

    content_bundle = await _generate_content_bundle(
        gpt_client,
        parent_title,
        brand_info,
        category_titles,
    )

    extra_terms: List[str] = []
    if brand_info.get("title"):
        extra_terms.append(str(brand_info.get("title")))
    extra_terms.extend(content_bundle["keywords"][:3])
    image_urls = get_clean_images(content_bundle["optimized_title"], limit=8, extra_keywords=extra_terms)
    selected_images = list(range(min(len(image_urls), 5)))

    variant_payloads, pricing, competitor, average_cost = await _build_variant_payloads(
        gpt_client,
        variants,
        parent_title,
        margin=20,
    )

    bulk_payload = {
        "name": parent_title,
        "brand_id": brand_info.get("brandID"),
        "brand": brand_info,
        "selected_categories": category_ids,
        "selected_category_titles": category_titles,
        "purchase_price": average_cost,
        "profit_margin": 20,
        "pricing": pricing,
        "competitor_data": competitor,
        "enriched": content_bundle["enriched"],
        "optimized_title": content_bundle["optimized_title"],
        "keywords": content_bundle["keywords"],
        "slug": content_bundle["slug"],
        "attributes": content_bundle["attributes"],
        "highlights": content_bundle["highlights"],
        "image_urls": image_urls,
        "selected_images": selected_images,
        "variants_payload": variant_payloads,
    }

    context.user_data["new_product"] = bulk_payload
    success = await _create_product_from_payload(message, context, bulk_payload, notify=False)
    if not success:
        raise ValueError("ایجاد محصول ناموفق بود")

    return {
        "title": content_bundle["optimized_title"],
        "slug": bulk_payload.get("created_product_slug") or bulk_payload.get("slug"),
    }


async def _resolve_brand(
    api_client,
    brand_cache: Dict[Any, Dict[str, Any]],
    brand_hint: str,
    context: ContextTypes.DEFAULT_TYPE,
) -> Dict[str, Any]:
    if not brand_hint:
        return {}

    for brand in brand_cache.values():
        if looks_like_duplicate(brand_hint, [brand.get("title", "")]):
            return brand

    suggestions: List[Dict[str, Any]] = []
    try:
        response = await asyncio.to_thread(api_client.suggest_brands, brand_hint)
        suggestions = response.get("brands") or response.get("items") or []
    except ApiClientError as exc:
        logger.debug("Brand suggestion failed for %s: %s", brand_hint, exc)

    for suggestion in suggestions:
        title = (suggestion.get("title") or brand_hint).strip()
        if not title:
            continue
        suggestion_id = suggestion.get("brandID") or suggestion.get("id")
        if suggestion_id:
            suggestion_id = int(suggestion_id)
            brand = brand_cache.get(suggestion_id)
            if not brand:
                brand = {"brandID": suggestion_id, "title": title}
                brand_cache[suggestion_id] = brand
            return brand

        description = suggestion.get("description") or title
        try:
            brief = await asyncio.to_thread(api_client.brief_brand, title)
            description = brief.get("content", description)
        except ApiClientError:
            pass
        try:
            created = await asyncio.to_thread(api_client.create_brand, title, description)
        except ApiClientError as exc:
            logger.debug("Brand creation from suggestion failed for %s: %s", title, exc)
            continue
        brand_id = created.get("brandID")
        if not brand_id:
            continue
        snippet = await asyncio.to_thread(api_client.create_brand_snippet, title, description)
        await asyncio.to_thread(
            api_client.update_snippet,
            "productBrand",
            brand_id,
            snippet.get("title", title),
            snippet.get("description", description),
            _build_snippet_canonical(context, "brand", snippet.get("slug")),
        )
        brand_info = {"brandID": int(brand_id), "title": title}
        brand_cache[int(brand_id)] = brand_info
        return brand_info

    description = brand_hint
    try:
        brief = await asyncio.to_thread(api_client.brief_brand, brand_hint)
        description = brief.get("content", brand_hint)
    except ApiClientError:
        pass
    try:
        created = await asyncio.to_thread(api_client.create_brand, brand_hint, description)
    except ApiClientError as exc:
        logger.warning("ایجاد برند %s ناموفق بود: %s", brand_hint, exc)
        return {}
    brand_id = created.get("brandID")
    if not brand_id:
        return {}
    snippet = await asyncio.to_thread(api_client.create_brand_snippet, brand_hint, description)
    await asyncio.to_thread(
        api_client.update_snippet,
        "productBrand",
        brand_id,
        snippet.get("title", brand_hint),
        snippet.get("description", description),
        _build_snippet_canonical(context, "brand", snippet.get("slug")),
    )
    brand_info = {"brandID": int(brand_id), "title": brand_hint}
    brand_cache[int(brand_id)] = brand_info
    return brand_info


async def _resolve_categories(
    api_client,
    category_index: Dict[str, Dict[str, Any]],
    parent_title: str,
    hints: List[str],
    context: ContextTypes.DEFAULT_TYPE,
) -> tuple[List[int], List[str]]:
    search_terms = [term for term in hints if term] or [parent_title]
    for term in search_terms:
        try:
            response = await asyncio.to_thread(api_client.suggest_categories, term)
        except ApiClientError as exc:
            logger.debug("Category suggestion failed for %s: %s", term, exc)
            continue
        items = response.get("categories") or response.get("items") or []
        for item in items:
            title = (item.get("title") or "").strip()
            if not title:
                continue
            normalized = normalize_keyword(title)
            existing = category_index.get(normalized)
            if existing:
                return [int(existing["categoryID"])], [existing.get("title", title)]

            parent_id = item.get("parentID")
            description = item.get("description") or title
            try:
                created = await asyncio.to_thread(
                    api_client.create_category,
                    title,
                    description,
                    int(parent_id) if parent_id else None,
                )
            except ApiClientError as exc:
                logger.debug("Category creation failed for %s: %s", title, exc)
                continue
            category_id = created.get("categoryID")
            if not category_id:
                continue
            snippet = await asyncio.to_thread(api_client.create_category_snippet, title, description)
            await asyncio.to_thread(
                api_client.update_snippet,
                "productCategory",
                category_id,
                snippet.get("title", title),
                snippet.get("description", description),
                _build_snippet_canonical(context, "category", snippet.get("slug")),
            )
            category_index[normalized] = {"categoryID": int(category_id), "title": title}
            return [int(category_id)], [title]
    return [], []


def _build_category_index(api_client) -> Dict[str, Dict[str, Any]]:
    index: Dict[str, Dict[str, Any]] = {}

    def walk(parent_id: Optional[int] = None) -> None:
        try:
            response = api_client.get_categories(parent_id)
        except ApiClientError:
            return
        categories = response.get("categories") or response.get("items") or []
        for item in categories:
            category_id = item.get("categoryID") or item.get("id")
            title = item.get("title")
            if not category_id or not title:
                continue
            normalized = normalize_keyword(title)
            if normalized not in index:
                index[normalized] = {"categoryID": int(category_id), "title": title}
                walk(int(category_id))

    walk()
    return index


async def _generate_content_bundle(
    gpt_client,
    product_name: str,
    brand_info: Dict[str, Any],
    category_titles: List[str],
) -> Dict[str, Any]:
    try:
        content = await asyncio.to_thread(
            gpt_client.generate_product_content,
            product_name,
            brand_info,
            {"titles": category_titles},
        )
    except GptClientError as exc:
        logger.warning("bulk content generation failed for %s: %s", product_name, exc)
        fallback = await asyncio.to_thread(
            gpt_client.enrich_product_description,
            product_name,
            brand_info,
            {"titles": category_titles},
        )
        content = {
            "title": product_name,
            "description": fallback.get("description", product_name),
            "keywords": [],
            "slug": slugify(product_name),
            "attributes": [
                {"title": key, "value": value}
                for key, value in (fallback.get("specs") or {}).items()
                if key and value
            ],
            "highlights": fallback.get("highlights", []),
        }

    optimized_title = content.get("title") or product_name
    keywords = deduplicate_keywords(content.get("keywords", []))
    slug_value = content.get("slug") or slugify(optimized_title)
    attributes = [
        {"title": item.get("title"), "value": item.get("value")}
        for item in content.get("attributes", [])
        if item and item.get("title") and item.get("value")
    ]

    return {
        "enriched": {
            **content,
            "attributes": attributes,
            "keywords": keywords,
            "slug": slug_value,
        },
        "optimized_title": optimized_title,
        "keywords": keywords,
        "slug": slug_value,
        "attributes": attributes,
        "highlights": content.get("highlights", []),
    }


async def _build_variant_payloads(
    gpt_client,
    variants: List[Dict[str, Any]],
    parent_title: str,
    *,
    margin: float,
) -> tuple[List[Dict[str, Any]], Dict[str, Any], Dict[str, Any], int]:
    payloads: List[Dict[str, Any]] = []
    reference_pricing: Dict[str, Any] = {}
    reference_competitor: Dict[str, Any] = {}
    total_cost = 0.0
    count = 0
    used_titles: set[str] = set()
    parent_normalized = normalize_keyword(parent_title)

    for item in variants:
        variant_title = (item.get("title") or "").strip() or "متغیر بدون نام"
        normalized_title = normalize_keyword(variant_title)
        if normalized_title == parent_normalized:
            variant_title = f"{variant_title} #{count + 1}"
            normalized_title = normalize_keyword(variant_title)
        if normalized_title in used_titles:
            variant_title = f"{variant_title} #{len(used_titles) + 1}"
            normalized_title = normalize_keyword(variant_title)
        used_titles.add(normalized_title)
        stock_raw = item.get("stock")
        stock = int(_extract_numeric_value(stock_raw, default=0))
        if stock < 0:
            stock = 0

        cost = _extract_numeric_value(item.get("cost"), default=0)
        if cost <= 0:
            raise ValueError(
                f"قیمت خرید برای متغیر «{variant_title}» در محصول «{parent_title}» یافت نشد. "
                "لطفاً ستون قیمت خرید را در فایل بررسی کن."
            )
        total_cost += cost
        count += 1

        pricing_bundle = await asyncio.to_thread(
            get_competitive_pricing,
            gpt_client,
            variant_title,
            cost,
            margin,
        )
        pricing = pricing_bundle.get("pricing", {})
        competitor = pricing_bundle.get("competitor", {})
        if not reference_pricing:
            reference_pricing = pricing
            reference_competitor = competitor

        final_price = int(pricing.get("final_price") or cost or 0)
        if final_price <= 0:
            final_price = int(cost) or 1
        compare_price = int(pricing.get("compare_price") or max(final_price, cost) * 1.1)
        if compare_price <= final_price:
            compare_price = final_price + max(int(final_price * 0.1), 1)

        payloads.append(
            {
                "status": "active",
                "title": variant_title,
                "cost": int(cost),
                "price": final_price,
                "comparePrice": compare_price,
                "stock": stock,
                "tax": 9,
                "tracking": True,
            }
        )

    avg_cost = int(total_cost / count) if count else 0
    if avg_cost <= 0:
        avg_cost = 1
    if not reference_pricing:
        reference_pricing = {"final_price": avg_cost, "compare_price": int(avg_cost * 1.1)}
    if not reference_competitor:
        reference_competitor = {"average_price": avg_cost}

    return payloads, reference_pricing, reference_competitor, avg_cost


def _load_dataframe(file_path: Path) -> pd.DataFrame:
    suffix = file_path.suffix.lower()
    if suffix in {".xlsx", ".xlsm"}:
        return pd.read_excel(file_path, engine="openpyxl")
    if suffix == ".xls":
        return pd.read_excel(file_path, engine="xlrd")
    if suffix == ".csv":
        return pd.read_csv(file_path)
    raise ValueError("فرمت فایل پشتیبانی نمی‌شود.")


async def _delete_message_safe(message: Optional[Message]) -> None:
    if not message:
        return
    try:
        await message.delete()
    except Exception:
        pass


async def _edit_or_reply(status_msg: Optional[Message], base_message: Message, text: str) -> Message:
    if status_msg:
        try:
            await status_msg.edit_text(text)
            return status_msg
        except Exception:
            pass
    return await base_message.reply_text(text)


def _fallback_grouping_from_dataframe(df: pd.DataFrame, meta: Dict[str, Optional[str]]) -> List[Dict[str, Any]]:
    df = df.fillna("")
    product_column = meta.get("product")
    stock_column = meta.get("stock")
    cost_column = meta.get("cost")
    sku_column = meta.get("sku")

    parents: Dict[str, Dict[str, Any]] = {}
    for _, row in df.iterrows():
        title = str(row.get(product_column, "")).strip()
        if not title:
            continue
        parent = parents.setdefault(
            title,
            {
                "parent_title": title,
                "variants": [],
            },
        )
        stock_value = _extract_numeric_value(row.get(stock_column), default=0)
        cost_value = _extract_numeric_value(row.get(cost_column), default=0)
        variant = {
            "title": title,
            "stock": int(stock_value),
            "cost": float(cost_value),
        }
        if sku_column:
            variant["sku"] = str(row.get(sku_column, "")).strip()
        parent["variants"].append(variant)

    return list(parents.values())


def _guess_product_column(columns: List[str]) -> str:
    lowered = [(col or "").strip().lower() for col in columns]
    for keyword in ("product", "name", "title", "محصول", "نام", "عنوان"):
        for index, value in enumerate(lowered):
            if keyword in value:
                return columns[index]
    return columns[0]


def _find_first_column(columns: List[str], candidates: List[str]) -> Optional[str]:
    lowered = [(col or "").strip().lower() for col in columns]
    for keyword in candidates:
        indicator = keyword.lower()
        for index, value in enumerate(lowered):
            if indicator in value:
                return columns[index]
    return None


def _extract_numeric_value(value: Any, default: float = 0) -> float:
    if value is None:
        return float(default)
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip().replace(",", "")
    try:
        return float(text)
    except ValueError:
        numbers = re.findall(r"[0-9.]+", text)
        if numbers:
            try:
                return float(numbers[0])
            except ValueError:
                return float(default)
    return float(default)


def _detect_dataframe_columns(df: pd.DataFrame) -> Dict[str, Optional[str]]:
    columns = [str(col) for col in df.columns]
    if not columns:
        raise ValueError("ستونی در فایل یافت نشد.")

    product_column = _guess_product_column(columns)
    if not product_column:
        raise ValueError("ستون عنوان محصول یافت نشد.")

    stock_column = _find_first_column(columns, ["stock", "quantity", "inventory", "موجودی"])
    cost_column = _find_first_column(columns, ["cost", "price", "purchase", "قیمت خرید", "هزینه", "خرید"])
    sku_column = _find_first_column(columns, ["sku", "کد", "شناسه", "کد کالا"])

    attribute_candidates = [
        col
        for col in columns
        if col not in {product_column, stock_column, cost_column, sku_column}
    ]

    return {
        "product": product_column,
        "stock": stock_column,
        "cost": cost_column,
        "sku": sku_column,
        "attributes": attribute_candidates,
    }


def _prepare_dataframe_rows(df: pd.DataFrame, meta: Dict[str, Optional[str]]) -> List[Dict[str, Any]]:
    records = df.fillna("").to_dict(orient="records")
    rows: List[Dict[str, Any]] = []

    product_column = meta.get("product")
    sku_column = meta.get("sku")

    for idx, record in enumerate(records):
        value = str(record.get(product_column, "")).strip()
        record["__row_index"] = idx
        record["__raw_title"] = value
        record["__normalized_title"] = normalize_keyword(value) if value else ""
        if sku_column:
            sku_value = str(record.get(sku_column, "")).strip()
            record["__normalized_sku"] = normalize_keyword(sku_value) if sku_value else ""
        rows.append(record)

    return rows


def _hydrate_grouped_parents(
    rows: List[Dict[str, Any]],
    grouped_parents: List[Dict[str, Any]],
    meta: Dict[str, Optional[str]],
) -> None:
    if not grouped_parents:
        return

    product_column = meta.get("product")
    stock_column = meta.get("stock")
    cost_column = meta.get("cost")
    sku_column = meta.get("sku")
    attribute_columns = meta.get("attributes", [])

    rows_by_title: Dict[str, List[Dict[str, Any]]] = {}
    rows_by_sku: Dict[str, List[Dict[str, Any]]] = {}
    for row in rows:
        normalized_title = row.get("__normalized_title")
        if normalized_title:
            rows_by_title.setdefault(normalized_title, []).append(row)
        normalized_sku = row.get("__normalized_sku")
        if normalized_sku:
            rows_by_sku.setdefault(normalized_sku, []).append(row)

    for parent in grouped_parents:
        parent_title = (parent.get("parent_title") or "").strip()
        parent_normalized = normalize_keyword(parent_title)
        for index, variant in enumerate(parent.get("variants", []), start=1):
            original_title = (variant.get("title") or "").strip()
            normalized_variant = normalize_keyword(original_title)

            candidates = rows_by_title.get(normalized_variant, [])
            if not candidates and sku_column:
                sku_value = str(variant.get("sku", "")).strip()
                if sku_value:
                    candidates = rows_by_sku.get(normalize_keyword(sku_value), [])
            if not candidates:
                candidates = _best_row_match(normalized_variant or parent_normalized, rows_by_title)

            matched_row = candidates[0] if candidates else None
            if matched_row:
                variant["__source_row_index"] = matched_row.get("__row_index")

                if stock_column:
                    stock_value = _extract_numeric_value(matched_row.get(stock_column), default=variant.get("stock", 0))
                    if stock_value > 0:
                        variant["stock"] = int(stock_value)

                if cost_column:
                    cost_value = _extract_numeric_value(matched_row.get(cost_column), default=variant.get("cost", 0))
                    if cost_value > 0:
                        variant["cost"] = float(cost_value)

                if sku_column and not variant.get("sku"):
                    sku_value = str(matched_row.get(sku_column, "")).strip()
                    if sku_value:
                        variant["sku"] = sku_value

                attributes = variant.get("attributes", []) or []
                existing_titles = {normalize_keyword(attr.get("title", "")) for attr in attributes}
                for column in attribute_columns:
                    value = str(matched_row.get(column, "")).strip()
                    if not value:
                        continue
                    normalized_attr = normalize_keyword(column)
                    if normalized_attr in existing_titles:
                        continue
                    attributes.append({"title": column, "value": value})
                    existing_titles.add(normalized_attr)
                if attributes:
                    variant["attributes"] = attributes

            if not variant.get("title") or normalized_variant == parent_normalized:
                attributes = variant.get("attributes", [])
                tokens = [
                    f"{attr.get('title')}: {attr.get('value')}"
                    for attr in attributes
                    if attr.get("title") and attr.get("value")
                ][:3]
                if tokens:
                    variant["title"] = "، ".join(tokens)
                else:
                    variant["title"] = _compose_variant_title(
                        {"optimized_title": parent_title, "name": parent_title},
                        attributes,
                        index=index,
                    )


def _best_row_match(
    normalized_variant: str,
    rows_by_title: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    if normalized_variant and normalized_variant in rows_by_title:
        return rows_by_title[normalized_variant]

    best_ratio = 0.0
    best_rows: List[Dict[str, Any]] = []
    for key, candidates in rows_by_title.items():
        if not key:
            continue
        ratio = SequenceMatcher(None, normalized_variant, key).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_rows = candidates

    return best_rows if best_ratio >= 0.6 else []
