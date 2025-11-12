"""Manual product creation conversation handlers."""

from __future__ import annotations

import asyncio
import json
import logging
import os
import uuid
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, InputMediaPhoto, Message, Update
from telegram.ext import (
    CallbackQueryHandler,
    CommandHandler,
    ConversationHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

from .. import config, constants
from ..keyboards import (
    brand_keyboard,
    brand_suggestions_keyboard,
    category_suggestions_keyboard,
    image_keyboard,
)
from ..services.api_client import ApiClient, ApiClientError
from ..services.gpt_service import GptClient, GptClientError
from ..services.image_service import get_clean_images
from ..services.pricing_service import get_competitive_pricing
from ..services.post_creation_tasks import run as run_post_creation_tasks
from ..services.helpers import deduplicate_keywords, looks_like_duplicate, normalize_keyword, slugify
from .feedback import show_feedback_request
from ..services.backend_client import get_backend_client

logger = logging.getLogger(__name__)


def build_conversation() -> ConversationHandler:
    return ConversationHandler(
        entry_points=[
            CallbackQueryHandler(
                start_new_product,
                pattern=rf"^{constants.MENU_CALLBACK_PREFIX}\|new_product$",
            )
        ],
        states={
            constants.GET_NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_product_name)],
            constants.SELECT_BRAND: [
                CallbackQueryHandler(handle_brand_callback),
            ],
            constants.SELECT_BRAND_SUGGESTION: [
                CallbackQueryHandler(
                    handle_brand_suggestion_choice,
                    pattern=rf"^{constants.BRAND_SUGGEST_OPTION_PREFIX}\|",
                ),
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_new_brand_name),
            ],
            constants.SELECT_CATEGORY: [
                CallbackQueryHandler(handle_category_navigation),
            ],
            constants.HANDLE_CATEGORY_ACTION: [
                CallbackQueryHandler(handle_category_navigation),
                CallbackQueryHandler(
                    handle_category_suggestion_choice,
                    pattern=rf"^{constants.CATEGORY_SUGGEST_OPTION_PREFIX}\|",
                ),
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_category_manual_entry),
            ],
            constants.ENRICH_DATA: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_profit_margin)],
            constants.GET_PURCHASE_PRICE: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_purchase_price)],
            constants.HANDLE_IMAGE_SELECTION: [
                CallbackQueryHandler(handle_image_selection),
                CommandHandler("skip", skip_images),
            ],
            constants.CONFIRM_CREATION: [CallbackQueryHandler(handle_creation_confirmation)],
        },
        fallbacks=[CommandHandler("cancel", cancel_creation)],
        conversation_timeout=constants.CONVERSATION_TIMEOUT,
        name=constants.NEW_PRODUCT_CONV,
        persistent=False,
    )


@dataclass
class CategoryNode:
    category_id: int
    title: str
    children: List["CategoryNode"]

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> "CategoryNode":
        return CategoryNode(
            category_id=int(data.get("categoryID", 0)),
            title=str(data.get("title", "نامشخص")),
            children=[CategoryNode.from_dict(child) for child in data.get("children", [])],
        )


async def start_new_product(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()

    features = context.user_data.get("features", [])
    if constants.FEATURE_MANUAL_PRODUCT not in features:
        await query.edit_message_text(
            "دسترسی شما به ایجاد محصول فعال نیست. لطفاً پلن خود را ارتقا دهید."
        )
        return ConversationHandler.END

    if "api_client" not in context.user_data:
        await query.edit_message_text("ابتدا با دستور /start احراز هویت را کامل کنید.")
        return ConversationHandler.END

    context.user_data["new_product"] = {
        "step_message_id": query.message.message_id if query.message else None,
    }

    await query.edit_message_text("نام محصولی که می‌خواهی بسازی چیست؟")
    return constants.GET_NAME


async def handle_product_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    product_name = (update.message.text or "").strip()
    if not product_name:
        await update.message.reply_text("نام محصول نمی‌تواند خالی باشد.")
        return constants.GET_NAME

    payload = context.user_data.setdefault("new_product", {})
    payload["name"] = product_name

    api_client = _get_api_client(context)
    try:
        brands_response = await asyncio.to_thread(api_client.get_brands)
    except ApiClientError as exc:
        await update.message.reply_text(f"دریافت فهرست برندها با خطا مواجه شد: {exc}")
        return constants.GET_NAME

    brands = brands_response.get("brands") or brands_response.get("items") or []
    payload["available_brands"] = {brand.get("brandID"): brand for brand in brands if brand.get("brandID")}

    if not brands:
        await update.message.reply_text(
            "هیچ برندی یافت نشد. نام برند جدید را تایپ کن تا برایت ایجاد کنیم."
        )
        return constants.SELECT_BRAND_SUGGESTION

    await update.message.reply_text(
        "برند محصول را انتخاب کن یا روی دکمه پیشنهاد برند جدید بزن.",
        reply_markup=brand_keyboard(brands),
    )
    return constants.SELECT_BRAND


async def handle_brand_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    payload = context.user_data.get("new_product", {})

    data = query.data or ""
    if data == constants.BRAND_SUGGEST_CALLBACK:
        await _show_brand_suggestions(query, context)
        return constants.SELECT_BRAND_SUGGESTION

    _, brand_id_str = data.split("|", 1)
    brand_id = int(brand_id_str)
    payload["brand_id"] = brand_id
    brand_info = payload.get("available_brands", {}).get(brand_id, {})
    payload["brand"] = brand_info

    await query.edit_message_text("حاشیه سود مورد نظرت را به درصد وارد کن (مثلاً 20).")
    return constants.ENRICH_DATA


async def handle_brand_suggestion_choice(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    payload = context.user_data.setdefault("new_product", {})

    data = (query.data or "")
    parts = data.split("|", 1)
    if len(parts) != 2:
        await query.answer("گزینه نامعتبر است.")
        return constants.SELECT_BRAND_SUGGESTION

    key = parts[1]
    if key == "manual":
        await query.edit_message_text("نام برند مورد نظرت را تایپ کن تا بررسی کنیم.")
        return constants.SELECT_BRAND_SUGGESTION
    if key == "back":
        brands_map = payload.get("available_brands", {})
        brands = list(brands_map.values())
        if brands:
            await query.edit_message_text(
                "برند محصول را انتخاب کن یا از پیشنهادها استفاده کن.",
                reply_markup=brand_keyboard(brands),
            )
            return constants.SELECT_BRAND
        await query.edit_message_text("هنوز برندی ثبت نشده است. نام برند را تایپ کن.")
        return constants.SELECT_BRAND_SUGGESTION

    try:
        index = int(key)
    except ValueError:
        await query.answer("گزینه نامعتبر است.")
        return constants.SELECT_BRAND_SUGGESTION

    suggestions: List[Dict[str, Any]] = payload.get("brand_suggestions", [])
    if index < 0 or index >= len(suggestions):
        await query.answer("گزینه نامعتبر است.")
        return constants.SELECT_BRAND_SUGGESTION

    suggestion = suggestions[index]
    brand_title = (suggestion.get("title") or "").strip()
    if not brand_title:
        await query.edit_message_text("عنوان برند پیشنهادی خالی بود. لطفاً نام برند را تایپ کن.")
        return constants.SELECT_BRAND_SUGGESTION

    try:
        brand_info, created = await _create_or_select_brand(context, brand_title, suggestion=suggestion)
    except ApiClientError as exc:
        await query.edit_message_text(f"ایجاد یا انتخاب برند با خطا مواجه شد: {exc}")
        return constants.SELECT_BRAND_SUGGESTION

    payload["brand_id"] = brand_info.get("brandID")
    payload["brand"] = brand_info
    message_text = (
        f"برند «{brand_info.get('title', brand_title)}» افزودیم و برای محصول انتخاب شد."
        if created
        else f"برند «{brand_info.get('title', brand_title)}» برای محصول انتخاب شد."
    )
    await query.edit_message_text(message_text + "\nحاشیه سود مورد نظرت را به درصد وارد کن (مثلاً 20).")
    return constants.ENRICH_DATA


async def handle_new_brand_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    brand_title = (update.message.text or "").strip()
    if not brand_title:
        await update.message.reply_text("نام برند باید وارد شود.")
        return constants.SELECT_BRAND_SUGGESTION

    payload = context.user_data.setdefault("new_product", {})
    try:
        brand_info, created = await _create_or_select_brand(context, brand_title)
    except ApiClientError as exc:
        await update.message.reply_text(f"ایجاد یا انتخاب برند با خطا مواجه شد: {exc}")
        return constants.SELECT_BRAND_SUGGESTION

    payload["brand_id"] = brand_info.get("brandID")
    payload["brand"] = brand_info

    await update.message.reply_text(
        (
            f"برند «{brand_info.get('title', brand_title)}» ثبت شد. حالا حاشیه سود مورد نظر را به درصد وارد کن."
            if created
            else f"برند «{brand_info.get('title', brand_title)}» از قبل وجود داشت و انتخاب شد. حاشیه سود مورد نظر را وارد کن."
        )
    )
    return constants.ENRICH_DATA


async def handle_profit_margin(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    text = (update.message.text or "").replace("%", "").strip()
    try:
        margin = float(text)
    except ValueError:
        await update.message.reply_text("فقط عدد درصد را وارد کن.")
        return constants.ENRICH_DATA

    payload = context.user_data.setdefault("new_product", {})
    payload["profit_margin"] = margin

    api_client = _get_api_client(context)
    try:
        categories_resp = await asyncio.to_thread(api_client.get_categories)
    except ApiClientError as exc:
        await update.message.reply_text(f"دریافت دسته‌بندی‌ها با خطا مواجه شد: {exc}")
        return constants.ENRICH_DATA

    categories = categories_resp.get("categories") or categories_resp.get("items") or []
    if not categories:
        await update.message.reply_text("هیچ دسته‌بندی‌ای یافت نشد. لطفاً برای ادامه با پشتیبانی تماس بگیر.")
        return ConversationHandler.END

    root = CategoryNode(category_id=0, title="همه دسته‌ها", children=[CategoryNode.from_dict(cat) for cat in categories])
    payload["category_tree"] = root
    payload["category_stack"] = [0]
    payload["category_paths"] = {0: [0]}
    _register_category_paths(root, [0], payload["category_paths"])
    payload["selected_category_titles"] = []

    keyboard = _category_keyboard(
        root.children,
        payload.get("selected_categories", []),
        root.category_id,
    )
    await update.message.reply_text(
        "دسته‌بندی مناسب را انتخاب کن. می‌توانی با دکمه‌ها بین زیرمجموعه‌ها حرکت کنی.",
        reply_markup=keyboard,
    )
    return constants.SELECT_CATEGORY


async def handle_category_navigation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    payload = context.user_data.setdefault("new_product", {})
    data = query.data or ""

    if data.startswith(f"{constants.CATEGORY_SUGGEST_CALLBACK}|"):
        _, parent_str = data.split("|", 1)
        parent_id = int(parent_str)
        payload["pending_category_parent"] = parent_id
        await _show_category_suggestions(query, context, parent_id)
        return constants.HANDLE_CATEGORY_ACTION

    if data.startswith("cat_nav|"):
        category_id = int(data.split("|", 1)[1])
        await _ensure_category_children(context, category_id)
        payload.setdefault("category_stack", []).append(category_id)
        payload["pending_category_parent"] = category_id
        current = _current_category_node(payload)
        if not current.children:
            _record_category_selection(payload, category_id)
            await query.edit_message_text("دسته‌بندی انتخاب شد. لطفاً قیمت خرید محصول را وارد کن.")
            await _run_enrichment_flow(update, context)
            return constants.GET_PURCHASE_PRICE
        await query.edit_message_text(
            "دسته‌بندی مناسب را انتخاب کن.",
            reply_markup=_category_keyboard(
                current.children,
                payload.get("selected_categories", []),
                current.category_id,
            ),
        )
        return constants.SELECT_CATEGORY

    if data == "cat_back":
        stack = payload.setdefault("category_stack", [])
        if len(stack) > 1:
            stack.pop()
        payload["pending_category_parent"] = stack[-1] if stack else 0
        current = _current_category_node(payload)
        await query.edit_message_text(
            "دسته‌بندی مناسب را انتخاب کن.",
            reply_markup=_category_keyboard(
                current.children,
                payload.get("selected_categories", []),
                current.category_id,
            ),
        )
        return constants.SELECT_CATEGORY

    if data.startswith("cat_select|"):
        category_id = int(data.split("|", 1)[1])
        _record_category_selection(payload, category_id)
        await query.edit_message_text("دسته‌بندی انتخاب شد. اکنون لطفاً قیمت خرید محصول را وارد کن.")
        await _run_enrichment_flow(update, context)
        return constants.GET_PURCHASE_PRICE

    if data == "cat_done":
        selected = payload.get("selected_categories", [])
        if not selected:
            await query.answer("ابتدا یک دسته‌بندی انتخاب کن.")
            return constants.SELECT_CATEGORY
        await query.edit_message_text("دسته‌بندی ثبت شد. قیمت خرید را وارد کن.")
        await _run_enrichment_flow(update, context)
        return constants.GET_PURCHASE_PRICE

    await query.answer("گزینه نامعتبر است.")
    return constants.SELECT_CATEGORY


async def handle_category_suggestion_choice(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    payload = context.user_data.setdefault("new_product", {})

    data = (query.data or "").split("|")
    if len(data) != 3:
        await query.answer("گزینه نامعتبر است.")
        return constants.HANDLE_CATEGORY_ACTION

    _, parent_str, key = data
    parent_id = int(parent_str)
    payload["pending_category_parent"] = parent_id

    if key == "manual":
        await query.edit_message_text("نام دسته‌بندی جدید را بنویس تا برایت ایجاد کنیم.")
        return constants.HANDLE_CATEGORY_ACTION
    if key == "back":
        node = _find_category_node(payload, parent_id) or payload.get("category_tree")
        if not node:
            await query.edit_message_text("بازگشت به فهرست دسته‌بندی‌ها امکان‌پذیر نبود.")
            return constants.SELECT_CATEGORY
        await query.edit_message_text(
            "دسته‌بندی مناسب را انتخاب کن.",
            reply_markup=_category_keyboard(
                node.children,
                payload.get("selected_categories", []),
                node.category_id,
            ),
        )
        return constants.SELECT_CATEGORY

    try:
        index = int(key)
    except ValueError:
        await query.answer("گزینه نامعتبر است.")
        return constants.HANDLE_CATEGORY_ACTION

    suggestions_map: Dict[int, List[Dict[str, Any]]] = payload.get("category_suggestions", {})
    suggestions = suggestions_map.get(parent_id, [])
    if index < 0 or index >= len(suggestions):
        await query.answer("گزینه نامعتبر است.")
        return constants.HANDLE_CATEGORY_ACTION

    suggestion = suggestions[index]
    title = (suggestion.get("title") or "").strip()
    if not title:
        await query.edit_message_text("عنوان دسته‌بندی پیشنهادی خالی بود. لطفاً نام دیگری وارد کن.")
        return constants.HANDLE_CATEGORY_ACTION

    try:
        node = await _create_or_select_category(context, parent_id, title, suggestion=suggestion)
    except ApiClientError as exc:
        await query.edit_message_text(f"ایجاد یا انتخاب دسته‌بندی با خطا مواجه شد: {exc}")
        return constants.HANDLE_CATEGORY_ACTION

    payload.pop("pending_category_parent", None)
    _record_category_selection(payload, node.category_id)
    await query.edit_message_text("دسته‌بندی ثبت شد. لطفاً قیمت خرید محصول را وارد کن.")
    await _run_enrichment_flow(update, context)
    return constants.GET_PURCHASE_PRICE


async def handle_category_manual_entry(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    text = (update.message.text or "").strip()
    if not text:
        await update.message.reply_text("نام دسته‌بندی نمی‌تواند خالی باشد.")
        return constants.HANDLE_CATEGORY_ACTION

    payload = context.user_data.setdefault("new_product", {})
    parent_id = int(payload.get("pending_category_parent", 0) or 0)

    try:
        node = await _create_or_select_category(context, parent_id, text)
    except ApiClientError as exc:
        await update.message.reply_text(f"ایجاد یا انتخاب دسته‌بندی با خطا مواجه شد: {exc}")
        return constants.HANDLE_CATEGORY_ACTION

    payload.pop("pending_category_parent", None)
    _record_category_selection(payload, node.category_id)
    await update.message.reply_text("دسته‌بندی ثبت شد. لطفاً قیمت خرید محصول را وارد کن.")
    await _run_enrichment_flow(update, context)
    return constants.GET_PURCHASE_PRICE


async def handle_purchase_price(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    payload = context.user_data.setdefault("new_product", {})
    price_text = (update.message.text or "").replace(",", "").strip()
    if not price_text.isdigit():
        await update.message.reply_text("قیمت خرید را فقط به صورت عددی وارد کن.")
        return constants.GET_PURCHASE_PRICE

    purchase_price = int(price_text)
    payload["purchase_price"] = purchase_price

    gpt_client = _get_gpt_client(context)
    margin = payload.get("profit_margin", 20)
    pricing_bundle = await asyncio.to_thread(
        get_competitive_pricing,
        gpt_client,
        payload.get("optimized_title", payload.get("name")),
        purchase_price,
        margin,
    )

    pricing = pricing_bundle.get("pricing", {})
    payload["pricing"] = pricing
    payload["competitor_data"] = pricing_bundle.get("competitor", {})

    average_price = int(payload["competitor_data"].get("average_price", purchase_price))
    final_price = pricing.get("final_price", purchase_price)

    summary = (
        f"قیمت خرید: {purchase_price:,} تومان\n"
        f"میانگین قیمت رقبا: {average_price:,} تومان\n"
        f"قیمت نهایی پیشنهادی: {final_price:,} تومان"
    )
    await update.message.reply_text("نتیجه محاسبات قیمت:\n" + summary)

    image_urls = payload.get("image_urls", [])
    if image_urls:
        media_group = [
            InputMediaPhoto(media=url, caption=f"تصویر {idx + 1}") for idx, url in enumerate(image_urls[:10])
        ]
        try:
            await update.message.reply_media_group(media_group)
        except Exception as exc:
            logger.debug("Failed to send media group: %s", exc)

    await update.message.reply_text(
        "لینک‌های تصاویر پیشنهادی را می‌بینی. با دکمه‌ها می‌توانی انتخاب کنی یا /skip را بزن تا بدون تصویر ادامه دهیم.",
        reply_markup=image_keyboard(image_urls, payload.get("selected_images", [])),
    )
    return constants.HANDLE_IMAGE_SELECTION


async def handle_image_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    payload = context.user_data.setdefault("new_product", {})
    data = query.data or ""

    if data.startswith(f"{constants.IMAGE_SELECT_CALLBACK}_toggle"):
        index = int(data.split("|", 1)[1])
        selected = payload.setdefault("selected_images", [])
        if index in selected:
            selected.remove(index)
        else:
            selected.append(index)
        await query.edit_message_reply_markup(
            reply_markup=image_keyboard(payload.get("image_urls", []), selected)
        )
        return constants.HANDLE_IMAGE_SELECTION

    if data == f"{constants.IMAGE_SELECT_CALLBACK}_done":
        await query.edit_message_text("تا چند لحظه دیگر خلاصه محصول را می‌بینی.")
        await _prepare_confirmation(query.message, context)
        return constants.CONFIRM_CREATION

    if data == f"{constants.IMAGE_SELECT_CALLBACK}_skip":
        payload["selected_images"] = []
        await query.edit_message_text("تصویری انتخاب نشد. خلاصه محصول آماده می‌شود.")
        await _prepare_confirmation(query.message, context)
        return constants.CONFIRM_CREATION

    await query.answer("گزینه معتبر نیست.")
    return constants.HANDLE_IMAGE_SELECTION


async def skip_images(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    payload = context.user_data.setdefault("new_product", {})
    payload["selected_images"] = []
    await update.message.reply_text("خلاصه محصول آماده می‌شود.")
    await _prepare_confirmation(update.message, context)
    return constants.CONFIRM_CREATION


async def handle_creation_confirmation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    data = query.data or ""

    if data.endswith("yes"):
        await query.edit_message_text("در حال ایجاد محصول...")
        payload = context.user_data.get("new_product", {})
        success = await _create_product_from_payload(query.message, context, payload)
        if success:
            await show_feedback_request(query.message, context, constants.FEEDBACK_CONTEXT_PRODUCT)
        context.user_data.pop("new_product", None)
        return ConversationHandler.END

    await query.edit_message_text("فرآیند ایجاد محصول لغو شد.")
    context.user_data.pop("new_product", None)
    return ConversationHandler.END


async def cancel_creation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data.pop("new_product", None)
    await update.message.reply_text("فرآیند ایجاد محصول لغو شد. هر زمان خواستی دوباره شروع کن.")
    return ConversationHandler.END


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------


def _get_api_client(context: ContextTypes.DEFAULT_TYPE) -> ApiClient:
    api_client = context.user_data.get("api_client")
    if not api_client:
        raise ApiClientError("ارتباط با سرور برقرار نشده است.")
    return api_client


def _get_gpt_client(context: ContextTypes.DEFAULT_TYPE) -> GptClient:
    bot_data = context.application.bot_data
    if "gpt_client" not in bot_data:
        bot_data["gpt_client"] = GptClient(config.GPT_API_KEY)
    return bot_data["gpt_client"]


def _category_keyboard(children: List[CategoryNode], selected: List[int], current_id: int) -> InlineKeyboardMarkup:
    buttons: List[List[InlineKeyboardButton]] = []
    for child in children:
        if child.children:
            buttons.append([
                InlineKeyboardButton(f"📁 {child.title}", callback_data=f"cat_nav|{child.category_id}"),
            ])
        else:
            prefix = "✅" if child.category_id in selected else "⬜"
            buttons.append([
                InlineKeyboardButton(f"{prefix} {child.title}", callback_data=f"cat_select|{child.category_id}"),
            ])
    buttons.append([
        InlineKeyboardButton("✨ پیشنهاد زیر‌دسته جدید", callback_data=f"{constants.CATEGORY_SUGGEST_CALLBACK}|{current_id}"),
    ])
    buttons.append([
        InlineKeyboardButton("✅ تایید و ادامه", callback_data="cat_done"),
    ])
    buttons.append([
        InlineKeyboardButton("🔙 بازگشت", callback_data="cat_back"),
    ])
    return InlineKeyboardMarkup(buttons)


def _current_category_node(payload: Dict[str, Any]) -> CategoryNode:
    stack = payload.setdefault("category_stack", [0])
    node: CategoryNode = payload["category_tree"]
    for category_id in stack[1:]:
        node = _find_node_by_id(node, category_id)
    return node


async def _ensure_category_children(context: ContextTypes.DEFAULT_TYPE, category_id: int) -> None:
    payload = context.user_data.setdefault("new_product", {})
    api_client = _get_api_client(context)
    root: CategoryNode = payload["category_tree"]

    try:
        node = _find_node_by_id(root, category_id)
    except LookupError:
        return
    if node.children:
        return

    response = await asyncio.to_thread(api_client.get_categories, category_id)
    children = response.get("categories") or response.get("items") or []
    node.children.extend([CategoryNode.from_dict(child) for child in children])

    paths = payload.setdefault("category_paths", {0: [0]})
    current_path = paths.get(category_id, [0])
    _register_category_paths(node, current_path, paths)


def _find_node_by_id(node: CategoryNode, target_id: int) -> CategoryNode:
    if node.category_id == target_id:
        return node
    for child in node.children:
        try:
            return _find_node_by_id(child, target_id)
        except LookupError:
            continue
    raise LookupError(target_id)


def _register_category_paths(node: CategoryNode, current_path: List[int], paths: Dict[int, List[int]]) -> None:
    for child in node.children:
        child_path = current_path + [child.category_id]
        paths[child.category_id] = child_path
        _register_category_paths(child, child_path, paths)


def _category_titles_for_id(payload: Dict[str, Any], category_id: int) -> List[str]:
    paths = payload.get("category_paths", {})
    path = paths.get(category_id, [])
    if not path:
        return []
    root: CategoryNode = payload["category_tree"]
    titles: List[str] = []
    node = root
    for part in path[1:]:
        node = _find_node_by_id(node, part)
        titles.append(node.title)
    return titles


def _record_category_selection(payload: Dict[str, Any], category_id: int) -> None:
    payload["selected_categories"] = [category_id]
    payload["selected_category_titles"] = _category_titles_for_id(payload, category_id)


def _match_existing_brand(available: Dict[Any, Dict[str, Any]], title: str) -> Optional[Dict[str, Any]]:
    if not available:
        return None
    for brand in available.values():
        if looks_like_duplicate(title, [brand.get("title", "")]):
            return brand
    return None


async def _show_brand_suggestions(query, context: ContextTypes.DEFAULT_TYPE) -> None:
    payload = context.user_data.setdefault("new_product", {})
    api_client = _get_api_client(context)
    product_name = payload.get("name") or ""

    try:
        response = await asyncio.to_thread(api_client.suggest_brands, product_name or "محصول")
    except ApiClientError as exc:
        await query.edit_message_text(
            f"دریافت پیشنهاد برند با خطا مواجه شد: {exc}\n"
            "نام برند را به صورت دستی تایپ کن."
        )
        payload["brand_suggestions"] = []
        return

    suggestions = response.get("brands") or response.get("items") or []
    payload["brand_suggestions"] = suggestions
    if suggestions:
        await query.edit_message_text(
            "یکی از برندهای پیشنهادی زیر را انتخاب کن یا نام دیگری بنویس.",
            reply_markup=brand_suggestions_keyboard(suggestions),
        )
    else:
        await query.edit_message_text("هیچ پیشنهادی برای برند یافت نشد. لطفاً نام برند را تایپ کن.")


async def _create_or_select_brand(
    context: ContextTypes.DEFAULT_TYPE,
    brand_title: str,
    *,
    suggestion: Optional[Dict[str, Any]] = None,
) -> tuple[Dict[str, Any], bool]:
    payload = context.user_data.setdefault("new_product", {})
    available = payload.setdefault("available_brands", {})
    trimmed_title = brand_title.strip()

    existing = _match_existing_brand(available, trimmed_title)
    if existing:
        return existing, False

    api_client = _get_api_client(context)

    suggestion_brand_id = None
    if suggestion:
        suggestion_brand_id = suggestion.get("brandID") or suggestion.get("id")
        if suggestion_brand_id:
            suggestion_brand_id = int(suggestion_brand_id)

    if suggestion_brand_id:
        existing = available.get(suggestion_brand_id)
        if not existing:
            existing = {
                "brandID": suggestion_brand_id,
                "title": suggestion.get("title", trimmed_title),
            }
            available[suggestion_brand_id] = existing
        return existing, False

    description = ""
    if suggestion:
        description = suggestion.get("description") or ""
    if not description:
        brief_response = await asyncio.to_thread(api_client.brief_brand, trimmed_title)
        description = brief_response.get("content", trimmed_title)

    create_response = await asyncio.to_thread(api_client.create_brand, trimmed_title, description)
    brand_id = create_response.get("brandID")
    if not brand_id:
        raise ApiClientError("شناسه برند جدید دریافت نشد.")

    snippet_response = await asyncio.to_thread(api_client.create_brand_snippet, trimmed_title, description)
    await asyncio.to_thread(
        api_client.update_snippet,
        "productBrand",
        brand_id,
        snippet_response.get("title", trimmed_title),
        snippet_response.get("description", description),
        _build_snippet_canonical(context, "brand", snippet_response.get("slug")),
    )

    brand_info = {"brandID": int(brand_id), "title": trimmed_title}
    available[int(brand_id)] = brand_info
    return brand_info, True


def _build_snippet_canonical(context: ContextTypes.DEFAULT_TYPE, entity: str, slug_value: Optional[str]) -> str:
    public_base = context.user_data.get("public_base_url", "").rstrip("/")
    if not public_base:
        return ""
    if not slug_value:
        return public_base
    entity = entity.lower()
    if entity == "brand":
        path = "brand"
    elif entity == "category":
        path = "category"
    else:
        path = entity
    return f"{public_base}/{path}/{slug_value}"


def _find_category_node(payload: Dict[str, Any], category_id: int) -> Optional[CategoryNode]:
    try:
        return _find_node_by_id(payload["category_tree"], category_id)
    except LookupError:
        return None


def _find_category_by_title(payload: Dict[str, Any], title: str, parent_id: Optional[int] = None) -> Optional[CategoryNode]:
    normalized = normalize_keyword(title)
    if parent_id in (None, 0):
        return _search_category_node(payload["category_tree"], normalized)
    parent_node = _find_category_node(payload, parent_id)
    if not parent_node:
        return None
    return _search_category_node(parent_node, normalized)


def _search_category_node(node: CategoryNode, normalized: str) -> Optional[CategoryNode]:
    if normalize_keyword(node.title) == normalized:
        return node
    for child in node.children:
        result = _search_category_node(child, normalized)
        if result is not None:
            return result
    return None


def _append_category_node(payload: Dict[str, Any], parent_id: int, node: CategoryNode) -> None:
    root: CategoryNode = payload["category_tree"]
    paths = payload.setdefault("category_paths", {0: [0]})

    if parent_id in (None, 0):
        root.children.append(node)
        base_path = [0, node.category_id]
    else:
        parent_node = _find_category_node(payload, parent_id)
        if parent_node is None:
            parent_node = root
        parent_node.children.append(node)
        parent_path = paths.get(parent_id, [0])
        base_path = parent_path + [node.category_id]

    paths[node.category_id] = base_path
    _register_category_paths(node, base_path, paths)


async def _show_category_suggestions(query, context: ContextTypes.DEFAULT_TYPE, parent_id: int) -> None:
    payload = context.user_data.setdefault("new_product", {})
    api_client = _get_api_client(context)

    parent_titles = _category_titles_for_id(payload, parent_id)
    brief = " ".join(parent_titles + [payload.get("name", "")]).strip() or payload.get("name", "")

    try:
        response = await asyncio.to_thread(api_client.suggest_categories, brief or "محصول")
    except ApiClientError as exc:
        await query.edit_message_text(
            f"دریافت پیشنهاد دسته‌بندی با خطا مواجه شد: {exc}\n"
            "نام دسته‌بندی را به صورت دستی تایپ کن.",
        )
        payload.setdefault("category_suggestions", {})[parent_id] = []
        return

    suggestions = response.get("categories") or response.get("items") or []
    payload.setdefault("category_suggestions", {})[parent_id] = suggestions

    if suggestions:
        await query.edit_message_text(
            "یکی از دسته‌بندی‌های پیشنهادی را انتخاب کن یا نام جدیدی وارد کن.",
            reply_markup=category_suggestions_keyboard(parent_id, suggestions),
        )
    else:
        await query.edit_message_text("هیچ دسته‌بندی پیشنهادی یافت نشد. نام دسته‌بندی را تایپ کن.")


async def _create_or_select_category(
    context: ContextTypes.DEFAULT_TYPE,
    parent_id: int,
    title: str,
    *,
    suggestion: Optional[Dict[str, Any]] = None,
) -> CategoryNode:
    payload = context.user_data.setdefault("new_product", {})
    trimmed_title = title.strip()

    existing = _find_category_by_title(payload, trimmed_title, parent_id)
    if existing:
        return existing

    api_client = _get_api_client(context)

    suggestion_category_id = None
    if suggestion:
        suggestion_category_id = suggestion.get("categoryID") or suggestion.get("id")
        if suggestion_category_id:
            suggestion_category_id = int(suggestion_category_id)

    if suggestion_category_id:
        node = _find_category_node(payload, suggestion_category_id)
        if node is None:
            node = CategoryNode(
                category_id=suggestion_category_id,
                title=suggestion.get("title", trimmed_title),
                children=[],
            )
            _append_category_node(payload, parent_id, node)
        return node

    description = ""
    if suggestion:
        description = suggestion.get("description") or ""
    if not description:
        brief = await asyncio.to_thread(api_client.brief_category, trimmed_title)
        description = brief.get("content", trimmed_title)

    create_response = await asyncio.to_thread(
        api_client.create_category,
        trimmed_title,
        description,
        parent_id if parent_id else None,
    )
    category_id = create_response.get("categoryID")
    if not category_id:
        raise ApiClientError("شناسه دسته‌بندی جدید دریافت نشد.")

    snippet_response = await asyncio.to_thread(
        api_client.create_category_snippet,
        trimmed_title,
        description,
    )
    await asyncio.to_thread(
        api_client.update_snippet,
        "productCategory",
        category_id,
        snippet_response.get("title", trimmed_title),
        snippet_response.get("description", description),
        _build_snippet_canonical(context, "category", snippet_response.get("slug")),
    )

    node = CategoryNode(category_id=int(category_id), title=trimmed_title, children=[])
    _append_category_node(payload, parent_id, node)
    return node


def _coerce_keywords_list(raw_keywords: Any) -> List[str]:
    if isinstance(raw_keywords, list):
        return [str(item).strip() for item in raw_keywords if str(item).strip()]
    if isinstance(raw_keywords, str):
        return [part.strip() for part in raw_keywords.split(",") if part.strip()]
    return []


def _merge_attributes(primary: List[Dict[str, Any]], secondary: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    merged: List[Dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for source in (primary, secondary):
        for item in source:
            title = (item or {}).get("title")
            value = (item or {}).get("value")
            if not title or not value:
                continue
            key = (normalize_keyword(title), normalize_keyword(str(value)))
            if key in seen:
                continue
            seen.add(key)
            merged.append({"title": title, "value": value})
    return merged


IMPORTANT_ATTRIBUTE_KEYS = {
    "سایز",
    "اندازه",
    "مدل",
    "رنگ",
    "وزن",
    "ابعاد",
    "ظرفیت",
    "گارانتی",
    "پکیج",
    "بسته",
}

IMPORTANT_ATTRIBUTE_KEYS_NORMALIZED = {normalize_keyword(key) for key in IMPORTANT_ATTRIBUTE_KEYS}


def _compose_variant_title(payload: Dict[str, Any], attributes: List[Dict[str, Any]], *, index: int = 1) -> str:
    tokens: List[str] = []
    for attribute in attributes:
        title = (attribute or {}).get("title")
        value = (attribute or {}).get("value")
        if not title or not value:
            continue
        normalized_title = normalize_keyword(title)
        if normalized_title in IMPORTANT_ATTRIBUTE_KEYS_NORMALIZED:
            tokens.append(f"{title}: {value}")
        elif any(keyword in normalized_title for keyword in ("size", "model", "color", "weight")):
            tokens.append(f"{title}: {value}")
        if len(tokens) >= 3:
            break

    if tokens:
        return "، ".join(tokens)

    optimized_title = payload.get("optimized_title") or payload.get("name") or "محصول"
    return f"{optimized_title} | تنوع {index}"


def _safe_numeric(value: Any, default: float) -> float:
    if value is None:
        return float(default)
    if isinstance(value, (int, float)):
        return float(value)
    try:
        return float(str(value).replace(",", "").strip())
    except (ValueError, AttributeError):
        return float(default)


def _normalize_variant_bundle(
    variants: List[Dict[str, Any]],
    payload: Dict[str, Any],
    purchase_price: float,
    default_price: float,
    default_compare: float,
) -> List[Dict[str, Any]]:
    normalized: List[Dict[str, Any]] = []
    seen_titles: set[str] = set()
    base_attributes = payload.get("attributes", [])

    for idx, variant in enumerate(variants, start=1):
        attributes = variant.get("attributes") or base_attributes
        title = (variant.get("title") or "").strip()
        if not title:
            title = _compose_variant_title(payload, attributes, index=idx)
        normalized_title = normalize_keyword(title)
        if normalized_title in seen_titles:
            title = f"{title} #{idx}"
            normalized_title = normalize_keyword(title)
        seen_titles.add(normalized_title)

        cost = int(max(_safe_numeric(variant.get("cost") or variant.get("purchase_price"), purchase_price), 1))
        price = int(max(_safe_numeric(variant.get("price") or variant.get("final_price"), default_price), 1))
        compare_price = int(
            max(
                _safe_numeric(
                    variant.get("comparePrice") or variant.get("compare_price"),
                    default_compare,
                ),
                price + 1,
            )
        )
        if compare_price <= price:
            compare_price = price + max(int(price * 0.1), 1)
        stock = int(max(_safe_numeric(variant.get("stock"), 0), 0))

        normalized.append(
            {
                "status": variant.get("status", "active") or "active",
                "title": title,
                "cost": cost,
                "price": price,
                "comparePrice": compare_price,
                "stock": stock,
                "tax": int(_safe_numeric(variant.get("tax"), 9)),
                "tracking": bool(variant.get("tracking", True)),
            }
        )

    return normalized


def _is_duplicate_slug_error(exc: ApiClientError) -> bool:
    text = str(exc)
    return "slug" in text and ("تکراری" in text or "duplicate" in text.lower())


def _generate_unique_slug(base_slug: str, attempt: int) -> str:
    candidate = f"{base_slug}-{attempt}"
    return slugify(candidate)


async def _run_enrichment_flow(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    payload = context.user_data.setdefault("new_product", {})
    message = update.effective_message
    if message:
        await message.reply_text("در حال آماده‌سازی توضیحات و داده‌های محصول...")

    gpt_client = _get_gpt_client(context)
    brand_info = payload.get("brand", {})
    category_info = {"titles": payload.get("selected_category_titles", [])}
    try:
        enriched = await asyncio.to_thread(
            gpt_client.generate_product_content,
            payload["name"],
            brand_info,
            category_info,
        )
    except GptClientError as exc:
        await message.reply_text(f"دریافت محتوای محصول با خطا مواجه شد: {exc}")
        fallback = await asyncio.to_thread(
            gpt_client.enrich_product_description,
            payload["name"],
            brand_info,
            category_info,
        )
        enriched = {
            "title": payload.get("name"),
            "description": fallback.get("description", payload.get("name")),
            "keywords": [],
            "slug": slugify(payload.get("name", "")),
            "attributes": [
                {"title": key, "value": value}
                for key, value in (fallback.get("specs") or {}).items()
                if key and value
            ],
            "highlights": fallback.get("highlights", []),
        }

    optimized_title = enriched.get("title") or payload.get("name")
    keywords = deduplicate_keywords(enriched.get("keywords", []))
    slug_value = enriched.get("slug") or slugify(optimized_title)
    attributes = [
        {
            "title": item.get("title"),
            "value": item.get("value"),
        }
        for item in enriched.get("attributes", [])
        if item and item.get("title") and item.get("value")
    ]

    payload["enriched"] = {
        **enriched,
        "attributes": attributes,
        "keywords": keywords,
        "slug": slug_value,
    }
    payload["optimized_title"] = optimized_title
    payload["keywords"] = keywords
    payload["slug"] = slug_value
    payload["attributes"] = attributes
    payload["highlights"] = enriched.get("highlights", [])

    extra_terms: List[str] = []
    if brand_info.get("title"):
        extra_terms.append(str(brand_info.get("title")))
    extra_terms.extend(keywords[:3])

    image_results = get_clean_images(optimized_title or payload.get("name", ""), limit=10, extra_keywords=extra_terms)
    payload["image_urls"] = image_results


async def _prepare_confirmation(message: Message, context: ContextTypes.DEFAULT_TYPE) -> None:
    payload = context.user_data.setdefault("new_product", {})
    pricing = payload.get("pricing", {})
    optimized_title = payload.get("optimized_title", payload.get("name"))
    slug_value = payload.get("slug", "")
    keywords = payload.get("keywords", [])
    highlights_text = "\n".join(f"• {item}" for item in payload.get("highlights", []))
    final_price = pricing.get("final_price", payload.get("purchase_price", 0))

    summary_lines = [
        "جزئیات محصول آمادهٔ ایجاد:",
        f"**عنوان:** {optimized_title}",
        f"**اسلاگ پیشنهادی:** {slug_value}",
        f"**قیمت نهایی:** {final_price:,} تومان",
        f"**تعداد تصاویر پیشنهادی:** {len(payload.get('image_urls', []))}",
    ]
    if keywords:
        summary_lines.append("**کلمات کلیدی:** " + "، ".join(keywords[:6]))
    if highlights_text:
        summary_lines.append("هایلایت‌ها:\n" + highlights_text)

    summary = "\n".join(summary_lines)

    keyboard = InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton("✅ بله، ایجاد کن", callback_data="confirm|yes"),
                InlineKeyboardButton("❌ لغو", callback_data="confirm|no"),
            ]
        ]
    )
    await message.reply_text(summary, reply_markup=keyboard)


async def _create_product_from_payload(
    message: Message,
    context: ContextTypes.DEFAULT_TYPE,
    payload: Dict[str, Any],
    *,
    notify: bool = True,
) -> bool:
    api_client = _get_api_client(context)

    pricing = payload.get("pricing", {})
    enriched = payload.get("enriched", {})
    selected_categories = payload.get("selected_categories", [])
    selected_images = payload.get("selected_images", [])
    image_urls = payload.get("image_urls", [])
    optimized_title = payload.get("optimized_title", payload.get("name"))
    keywords = payload.get("keywords", [])
    slug_value = payload.get("slug") or slugify(optimized_title or payload.get("name", ""))
    category_titles = payload.get("selected_category_titles", [])
    purchase_price = int(payload.get("purchase_price", 0) or 0)
    final_price = int(pricing.get("final_price") or purchase_price or 0)
    compare_price = int(pricing.get("compare_price") or max(final_price, purchase_price) * 1.1)

    sanitize = await asyncio.to_thread(api_client.sanitize_content, enriched.get("description", payload.get("name")))
    product_payload = sanitize.get("product", {})
    sanitized_title = product_payload.get("title") or optimized_title or payload.get("name")
    sanitized_description = product_payload.get("description") or enriched.get("description", "")
    attributes = _merge_attributes(product_payload.get("attributes") or [], payload.get("attributes", []))
    sanitized_slug = product_payload.get("slug")
    if sanitized_slug:
        slug_value = sanitized_slug
    sanitized_keywords = _coerce_keywords_list(product_payload.get("keywords"))
    if sanitized_keywords:
        keywords = deduplicate_keywords([*keywords, *sanitized_keywords])
    payload["keywords"] = keywords
    payload["attributes"] = attributes
    payload["slug"] = slug_value

    attribute_ids: List[int] = []
    try:
        existing_attributes = await asyncio.to_thread(api_client.get_attributes)
    except ApiClientError as exc:
        await message.reply_text(f"دریافت ویژگی‌ها با خطا مواجه شد: {exc}")
        return False

    attribute_map = existing_attributes.get("attributes") or []
    parent_lookup = {item.get("title"): item for item in attribute_map}

    for attribute in attributes:
        title = attribute.get("title")
        value = attribute.get("value")
        if not title or not value:
            continue

        parent = parent_lookup.get(title)
        if not parent:
            try:
                parent = await asyncio.to_thread(api_client.create_attribute, title)
            except ApiClientError:
                continue
            parent_lookup[title] = parent

        child = next((item for item in parent.get("children", []) if item.get("title") == value), None)
        if not child:
            try:
                child = await asyncio.to_thread(api_client.create_attribute, value, parent.get("attributeID"))
            except ApiClientError:
                continue
            parent.setdefault("children", []).append(child)

        child_id = child.get("attributeID")
        if child_id:
            attribute_ids.append(child_id)

    image_payloads: List[Dict[str, Any]] = []
    if selected_images:
        try:
            uploads_route = await asyncio.to_thread(api_client.find_route, "/uploads")
            uploads_parent = uploads_route.get("route", {}).get("value")
        except ApiClientError:
            uploads_parent = None

        if uploads_parent:
            for idx in selected_images:
                if idx >= len(image_urls):
                    continue
                url = image_urls[idx]
                parsed_path = urlparse(url).path
                ext = os.path.splitext(parsed_path)[1] or ".jpg"
                unique_name = f"image_{uuid.uuid4().hex}{ext}"
                try:
                    grab = await asyncio.to_thread(api_client.grab_file, uploads_parent, url, unique_name)
                    path = grab.get("path")
                    if path:
                        image_payloads.append(
                            {"path": path, "title": f"{optimized_title} - تصویر {idx + 1}"}
                        )
                    else:
                        image_payloads.append(
                            {"path": path, "title": f"{optimized_title} - تصویر {idx + 1}"}
                        )
                except ApiClientError:
                    continue

    variant_bundle = payload.get("variants_payload")
    sanitized_variants = product_payload.get("variants") or []
    if variant_bundle:
        variants_payload = _normalize_variant_bundle(
            variant_bundle,
            payload,
            purchase_price or 1,
            final_price or max(purchase_price, 1),
            compare_price or max(final_price, purchase_price, 1),
        )
    elif sanitized_variants:
        variants_payload = _normalize_variant_bundle(
            sanitized_variants,
            payload,
            purchase_price or 1,
            final_price or max(purchase_price, 1),
            compare_price or max(final_price, purchase_price, 1),
        )
    else:
        default_title = _compose_variant_title(payload, attributes, index=1)
        variants_payload = [
            {
                "status": "active",
                "title": default_title,
                "cost": max(purchase_price, 1),
                "price": max(final_price, max(purchase_price, 1)),
                "comparePrice": max(compare_price, max(final_price, purchase_price) + 1),
                "stock": int(payload.get("purchase_stock", 100) or 100),
                "tax": 9,
                "tracking": True,
            }
        ]

    base_slug = slugify(slug_value or optimized_title or payload.get("name", ""))
    slug_candidate = base_slug or slugify(uuid.uuid4().hex[:12])
    product_data = {
        "brandID": payload.get("brand_id"),
        "categoriesID": selected_categories,
        "attributesID": attribute_ids,
        "type": "physical",
        "status": "active",
        "title": sanitized_title,
        "description": sanitized_description,
        "keywords": ", ".join(keywords),
        "image": image_payloads[0]["path"] if image_payloads else "",
        "price": final_price,
        "comparePrice": compare_price,
        "images": image_payloads,
        "variants": variants_payload,
        "slug": slug_candidate,
    }

    max_slug_attempts = 6
    attempt = 0
    while attempt < max_slug_attempts:
        product_data["slug"] = slug_candidate
        try:
            create_response = await asyncio.to_thread(api_client.create_product, product_data)
            payload["slug"] = slug_candidate
            break
        except ApiClientError as exc:
            if _is_duplicate_slug_error(exc):
                attempt += 1
                slug_candidate = _generate_unique_slug(base_slug, attempt)
                continue
            preview = json.dumps(product_data, ensure_ascii=False)
            if len(preview) > 3000:
                preview = preview[:3000] + "…"
            await message.reply_text(f"ایجاد محصول با خطا مواجه شد: {exc}\n{preview}")
            return False
    else:
        await message.reply_text(
            "ایجاد محصول به دلیل تکراری بودن آدرس (slug) امکان‌پذیر نشد. "
            "لطفاً عنوان یا اسلاگ محصول را تغییر دهید."
        )
        return False

    product_id = create_response.get("productID")
    if not product_id:
        await message.reply_text("محصول ایجاد شد اما شناسه بازنگشت.")
        return False

    snippet_response = await asyncio.to_thread(
        api_client.create_product_snippet,
        sanitized_title,
        sanitized_description,
    )
    product_slug = snippet_response.get("slug", slug_candidate)
    product_keywords = snippet_response.get("keywords", "")

    await asyncio.to_thread(
        api_client.update_snippet,
        "product",
        product_id,
        snippet_response.get("title", sanitized_title),
        snippet_response.get("description", sanitized_description),
        f"{context.user_data.get('public_base_url', '').rstrip('/')}/product/{product_slug}" if product_slug else context.user_data.get("public_base_url", ""),
    )

    public_base = context.user_data.get("public_base_url", "")
    product_link = (
        f"{public_base.rstrip('/')}/product/{product_slug}"
        if product_slug
        else public_base
    )
    await message.reply_text(
        f"محصول «{sanitized_title}» با موفقیت ایجاد شد! 🎉\nلینک محصول: {product_link}"
    )
    logger.info("Manual product creation completed (product_id=%s)", product_id)
    if notify:
        await _notify_product_created(message, context, str(product_id), sanitized_title)
    await run_post_creation_tasks(
        context,
        str(product_id),
        product_slug or slug_value,
        {
            "title": sanitized_title,
            "description": sanitized_description,
            "keywords": keywords,
            "categories": category_titles,
            "brand": payload.get("brand"),
            "product_link": product_link,
        },
    )
    payload["created_product_slug"] = product_slug or slug_value
    payload["created_product_id"] = str(product_id)
    return True


async def _notify_product_created(message: Message, context: ContextTypes.DEFAULT_TYPE, product_id: str, product_title: str) -> None:
    backend_base = config.BACKEND_BASE_URL
    if not backend_base:
        return

    phone = context.user_data.get("auth", {}).get("phone") or context.user_data.get("phone")
    if not phone and message and message.from_user:
        profile_map = context.application.bot_data.get("user_profiles", {})
        phone = profile_map.get(message.from_user.id, {}).get("phone")

    if not phone:
        return

    try:
        client = get_backend_client()
        await asyncio.to_thread(client.notify_product_created, phone, product_id, product_title)
    except Exception as exc:
        logger.debug("Failed to notify backend about product creation: %s", exc)
