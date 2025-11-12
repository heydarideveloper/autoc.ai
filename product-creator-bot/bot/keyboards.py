"""Inline keyboard builders for the Telegram bot."""

from __future__ import annotations

from typing import Iterable, List, Sequence

from telegram import InlineKeyboardButton, InlineKeyboardMarkup

from . import constants


def build_main_menu(features: Sequence[str]) -> InlineKeyboardMarkup:
    buttons: List[List[InlineKeyboardButton]] = [
        [InlineKeyboardButton("➕ ایجاد محصول تک", callback_data=f"{constants.MENU_CALLBACK_PREFIX}|new_product")]
    ]
    if constants.FEATURE_IMPORT_EXCEL in features:
        buttons.append(
            [InlineKeyboardButton("📄 ایمپورت از اکسل", callback_data=f"{constants.MENU_CALLBACK_PREFIX}|import_excel")]
        )
    return InlineKeyboardMarkup(buttons)


def build_feedback_keyboard(operation_context: str) -> InlineKeyboardMarkup:
    prefix = constants.FEEDBACK_CALLBACK_PREFIX
    return InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton("👍 عالی بود", callback_data=f"{prefix}|yes|{operation_context}"),
                InlineKeyboardButton("👎 نیاز به بهبود دارد", callback_data=f"{prefix}|no|{operation_context}"),
            ]
        ]
    )


def brand_keyboard(brands: Iterable[dict]) -> InlineKeyboardMarkup:
    buttons: List[List[InlineKeyboardButton]] = []
    for brand in brands:
        brand_id = brand.get("brandID")
        title = brand.get("title", "بدون نام")
        if brand_id is None:
            continue
        buttons.append([
            InlineKeyboardButton(title, callback_data=f"brand|{brand_id}"),
        ])
    buttons.append([
        InlineKeyboardButton("✨ پیشنهاد برند جدید", callback_data=constants.BRAND_SUGGEST_CALLBACK),
    ])
    return InlineKeyboardMarkup(buttons)


def brand_suggestions_keyboard(suggestions: Sequence[dict]) -> InlineKeyboardMarkup:
    buttons: List[List[InlineKeyboardButton]] = []
    for index, item in enumerate(suggestions):
        title = item.get("title") or "برند پیشنهادی بدون نام"
        buttons.append(
            [
                InlineKeyboardButton(
                    title,
                    callback_data=f"{constants.BRAND_SUGGEST_OPTION_PREFIX}|{index}",
                )
            ]
        )
    buttons.append(
        [
            InlineKeyboardButton(
                "✍️ خودم برند دیگری می‌نویسم",
                callback_data=f"{constants.BRAND_SUGGEST_OPTION_PREFIX}|manual",
            )
        ]
    )
    buttons.append(
        [
            InlineKeyboardButton(
                "↩️ برگشت به فهرست برندها",
                callback_data=f"{constants.BRAND_SUGGEST_OPTION_PREFIX}|back",
            )
        ]
    )
    return InlineKeyboardMarkup(buttons)


def category_suggestions_keyboard(parent_id: int, suggestions: Sequence[dict]) -> InlineKeyboardMarkup:
    buttons: List[List[InlineKeyboardButton]] = []
    for index, item in enumerate(suggestions):
        title = item.get("title") or "دسته‌بندی پیشنهادی بدون نام"
        buttons.append(
            [
                InlineKeyboardButton(
                    title,
                    callback_data=f"{constants.CATEGORY_SUGGEST_OPTION_PREFIX}|{parent_id}|{index}",
                )
            ]
        )
    buttons.append(
        [
            InlineKeyboardButton(
                "✍️ خودم دسته‌بندی جدید می‌نویسم",
                callback_data=f"{constants.CATEGORY_SUGGEST_OPTION_PREFIX}|{parent_id}|manual",
            )
        ]
    )
    buttons.append(
        [
            InlineKeyboardButton(
                "↩️ بازگشت به فهرست قبلی",
                callback_data=f"{constants.CATEGORY_SUGGEST_OPTION_PREFIX}|{parent_id}|back",
            )
        ]
    )
    return InlineKeyboardMarkup(buttons)


def image_keyboard(urls: Sequence[str], selected_indices: Sequence[int]) -> InlineKeyboardMarkup:
    buttons: List[List[InlineKeyboardButton]] = []
    selected = set(selected_indices)
    for idx, url in enumerate(urls):
        prefix = "✅" if idx in selected else "⬜"
        row = [InlineKeyboardButton(f"{prefix} تصویر {idx + 1}", callback_data=f"{constants.IMAGE_SELECT_CALLBACK}_toggle|{idx}")]
        if url.startswith("http"):
            row.append(InlineKeyboardButton("🔍 پیش‌نمایش", url=url))
        buttons.append(row)
    buttons.append([
        InlineKeyboardButton("✅ تایید تصاویر انتخاب شده", callback_data=f"{constants.IMAGE_SELECT_CALLBACK}_done"),
    ])
    buttons.append([
        InlineKeyboardButton("⏭ ادامه بدون انتخاب تصویر", callback_data=f"{constants.IMAGE_SELECT_CALLBACK}_skip"),
    ])
    return InlineKeyboardMarkup(buttons)


def excel_confirmation_keyboard() -> InlineKeyboardMarkup:
    prefix = constants.EXCEL_CALLBACK_PREFIX
    return InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton("بله، ادامه بده ✅", callback_data=f"{prefix}|confirm"),
                InlineKeyboardButton("خیر، لغو کن ❌", callback_data=f"{prefix}|cancel"),
            ]
        ]
    )
