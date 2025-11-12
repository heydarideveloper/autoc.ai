"""Start command onboarding and authentication conversation."""

from __future__ import annotations

import asyncio
import logging
from typing import Optional
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from telegram import Update
from telegram.ext import CommandHandler, ConversationHandler, ContextTypes, MessageHandler, filters

from .. import config
from .. import constants
from ..services.api_client import ApiClient, ApiClientError
from ..services.backend_client import BackendClientError, SubscriptionStatus, get_backend_client
from ..services.logic import format_phone_number
from .menu import show_main_menu

logger = logging.getLogger(__name__)


def build_conversation() -> ConversationHandler:
    return ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            constants.ASK_DOMAIN: [MessageHandler(filters.TEXT & ~filters.COMMAND, collect_domain)],
            constants.ASK_PHONE: [MessageHandler(filters.TEXT & ~filters.COMMAND, collect_phone)],
            constants.ASK_PASSWORD: [MessageHandler(filters.TEXT & ~filters.COMMAND, validate_credentials)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
        conversation_timeout=constants.CONVERSATION_TIMEOUT,
        name=constants.START_CONV,
        persistent=False,
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    if context.user_data.get("is_authenticated"):
        await show_main_menu(update, context)
        return ConversationHandler.END

    auth_state = context.user_data.setdefault("auth", {})
    onboarding_seen = auth_state.get("onboarding_shown", False)
    auth_state.clear()
    if not onboarding_seen:
        auth_state["onboarding_shown"] = True
        await update.message.reply_text(
            "Welcome to the AI Product Assistant!\n"
            "1. Register on our website: http://localhost:3000\n"
            "2. Install our Chrome Extension for the best experience: https://chrome.google.com/webstore\n\n"
            "Please enter the domain of your store (مثال: nirox.ir):"
        )
    else:
        auth_state["onboarding_shown"] = onboarding_seen
        await update.message.reply_text("لطفاً دامنه فروشگاه خود را وارد کن (مثال: nirox.ir):")
    return constants.ASK_DOMAIN


async def collect_domain(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    domain_raw = update.message.text if update.message else ""
    try:
        base_origin = _normalize_domain(domain_raw)
        api_key = await _fetch_api_key(base_origin)
    except ValueError as exc:
        await update.message.reply_text(str(exc))
        return constants.ASK_DOMAIN
    except Exception as exc:
        logger.exception("Failed to fetch api key from %s: %s", domain_raw, exc)
        await update.message.reply_text(
            "دریافت کلید API از وب‌سایت با مشکل مواجه شد. لطفاً نشانی وب‌سایت را بررسی کن و دوباره وارد کن."
        )
        return constants.ASK_DOMAIN

    auth_state = context.user_data.setdefault("auth", {})
    auth_state["api_base_url"] = base_origin
    auth_state["public_base_url"] = base_origin
    auth_state["api_key"] = api_key

    await update.message.reply_text("حالا شماره تلفنی که با آن ثبت‌نام کرده‌ای را وارد کن:")
    return constants.ASK_PHONE


async def collect_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    phone_raw = update.message.text if update.message else ""
    try:
        phone = format_phone_number(phone_raw)
    except ValueError:
        await update.message.reply_text("شماره تلفن معتبر نیست. لطفاً دوباره تلاش کن.")
        return constants.ASK_PHONE

    context.user_data.setdefault("auth", {})["phone"] = phone
    await update.message.reply_text("رمز عبور خود را وارد کن.")
    return constants.ASK_PASSWORD


async def validate_credentials(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    password = update.message.text if update.message else ""
    auth_state = context.user_data.get("auth", {})
    phone = auth_state.get("phone")
    if not phone:
        await update.message.reply_text("ابتدا شماره تلفن را وارد کن.")
        return constants.ASK_PHONE

    api_base_url = auth_state.get("api_base_url")
    api_key = auth_state.get("api_key")
    if not api_base_url or not api_key:
        await update.message.reply_text("ابتدا دامنه فروشگاه را وارد کن.")
        return constants.ASK_DOMAIN

    await update.message.reply_text("Authenticating, please wait...")

    subscription = await _check_subscription(context, phone)
    if subscription is None or not subscription.is_active:
        await update.message.reply_text(
            "اشتراک شما فعال نیست. ابتدا در وب‌سایت ثبت‌نام و پلن مناسب را فعال کنید: https://localhost:3000/register"
        )
        return ConversationHandler.END

    api_client = ApiClient(api_base_url, api_key)
    try:
        await asyncio.to_thread(api_client.authenticate, phone, password)
    except ApiClientError as exc:
        await update.message.reply_text(
            f"احراز هویت ناموفق بود: {exc}\nلطفاً شماره یا رمز را بررسی کنید."
        )
        return constants.ASK_PASSWORD

    _update_bot_data(update, context, phone, subscription)
    context.user_data.update(
        {
            "is_authenticated": True,
            "features": subscription.features,
            "api_client": api_client,
            "api_base_url": api_base_url,
            "public_base_url": auth_state.get("public_base_url", api_base_url),
            "password": password,
        }
    )

    await update.message.reply_text("ورود موفقیت‌آمیز بود ✅")
    await show_main_menu(update, context)
    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data.pop("auth", None)
    await update.message.reply_text("فرآیند احراز هویت لغو شد.")
    return ConversationHandler.END


async def _check_subscription(context: ContextTypes.DEFAULT_TYPE, phone: str) -> Optional[SubscriptionStatus]:
    backend_base = config.BACKEND_BASE_URL
    if not backend_base:
        logger.warning("BACKEND_BASE_URL is not configured; skipping subscription check.")
        return SubscriptionStatus(is_active=True, features=[constants.FEATURE_MANUAL_PRODUCT])

    client = get_backend_client()
    try:
        subscription = await asyncio.to_thread(client.subscription_check, phone)
    except BackendClientError as exc:
        logger.warning("Subscription check failed: %s", exc)
        return None
    return subscription


async def _fetch_api_key(base_url: str) -> str:
    response = await asyncio.to_thread(requests.get, base_url, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    html_tag = soup.find("html")
    if not html_tag or not html_tag.has_attr("data-apikey"):
        raise ValueError("مشخصه data-apikey در صفحه اصلی یافت نشد.")
    return html_tag["data-apikey"]


def _normalize_domain(user_input: str) -> str:
    if not user_input:
        raise ValueError("دامنه باید وارد شود.")
    candidate = user_input.strip()
    if not candidate.startswith(("http://", "https://")):
        candidate = f"https://{candidate}"
    parsed = urlparse(candidate)
    if not parsed.scheme or not parsed.netloc:
        raise ValueError("دامنه واردشده معتبر نیست. لطفاً فقط نام دامنه را وارد کن.")
    return f"{parsed.scheme}://{parsed.netloc}"


def _update_bot_data(update: Update, context: ContextTypes.DEFAULT_TYPE, phone: str, subscription: SubscriptionStatus) -> None:
    user = update.effective_user
    if not user:
        return

    feature_map = context.application.bot_data.setdefault("feature_map", {})
    feature_map[user.id] = subscription.features

    profile_map = context.application.bot_data.setdefault("user_profiles", {})
    profile_map[user.id] = {"phone": phone}

    if not subscription.features:
        context.user_data.setdefault("features", []).clear()
    else:
        context.user_data["features"] = subscription.features

    if constants.FEATURE_MANUAL_PRODUCT not in subscription.features:
        logger.info("Manual product feature not enabled for user %s", user.id)
