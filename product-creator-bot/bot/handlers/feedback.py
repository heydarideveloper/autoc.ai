"""Feedback prompt handlers."""

from __future__ import annotations

import asyncio
import logging

from telegram import Message, Update
from telegram.ext import CallbackQueryHandler, ContextTypes

from .. import config, constants
from ..keyboards import build_feedback_keyboard
from ..services.backend_client import BackendClientError, get_backend_client

logger = logging.getLogger(__name__)


def build_callback_handler() -> CallbackQueryHandler:
    return CallbackQueryHandler(handle_feedback_callback, pattern=rf"^{constants.FEEDBACK_CALLBACK_PREFIX}\|")


async def show_feedback_request(message: Message, context: ContextTypes.DEFAULT_TYPE, operation_context: str) -> None:
    try:
        await message.reply_text(
            "از این تجربه راضی بودی؟ بازخوردت به ما کمک می‌کند بهتر شویم.",
            reply_markup=build_feedback_keyboard(operation_context),
        )
    except Exception as exc:
        logger.debug("Failed to send feedback prompt: %s", exc)


async def handle_feedback_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()

    data = (query.data or "").split("|", 2)
    if len(data) < 3:
        await query.edit_message_text("بازخورد دریافت شد.")
        return

    _, decision, feedback_context = data
    is_positive = decision == "yes"

    phone = _lookup_user_phone(update, context)
    if not phone:
        await query.edit_message_text("بازخورد ثبت شد، اما شماره کاربر یافت نشد.")
        return

    if not config.BACKEND_BASE_URL:
        await query.edit_message_text("بازخورد ثبت شد (اتصال به بک‌اند پیکربندی نشده است).")
        return

    client = get_backend_client()
    try:
        await asyncio.to_thread(client.send_feedback, phone, is_positive, feedback_context)
        await query.edit_message_text("ممنون بابت بازخوردت! 🙏")
    except BackendClientError as exc:
        logger.warning("Failed to send feedback: %s", exc)
        await query.edit_message_text("ارسال بازخورد با خطا مواجه شد، لطفاً بعداً تلاش کن.")


def _lookup_user_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> str | None:
    phone = context.user_data.get("auth", {}).get("phone") or context.user_data.get("phone")
    if phone:
        return phone

    user = update.effective_user
    if not user:
        return None

    profile_map = context.application.bot_data.get("user_profiles", {})
    profile = profile_map.get(user.id)
    if not profile:
        return None

    return profile.get("phone")
