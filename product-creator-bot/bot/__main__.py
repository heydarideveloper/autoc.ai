"""Entry point for running the Telegram bot package."""

from __future__ import annotations

import logging
import sys

from telegram.ext import Application, CommandHandler, ConversationHandler, ContextTypes
from telegram.ext import _applicationbuilder, _updater

from . import config
from .handlers.feedback import build_callback_handler as build_feedback_handler
from .handlers.import_excel import build_conversation as build_excel_conversation
from .handlers.menu import build_menu_callback_handler
from .handlers.new_product import build_conversation as build_new_product_conversation
from .handlers.start import build_conversation as build_start_conversation


def main() -> None:
    """Configure and start the Telegram bot."""
    original_updater = _updater.Updater

    class PatchedUpdater(original_updater):  # type: ignore[misc, override]
        __slots__ = original_updater.__slots__ + ("_Updater__polling_cleanup_cb",)

    _updater.Updater = PatchedUpdater  # type: ignore[assignment]
    if hasattr(_applicationbuilder, "Updater"):
        _applicationbuilder.Updater = PatchedUpdater  # type: ignore[assignment]

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    token = config.TELEGRAM_BOT_TOKEN
    if not token:
        logging.error("توکن ربات تلگرام تنظیم نشده است.")
        sys.exit(1)

    application = (
        Application.builder()
        .token(token)
        .concurrent_updates(True)
        .build()
    )

    application.add_handler(build_start_conversation())
    application.add_handler(build_new_product_conversation())
    application.add_handler(build_excel_conversation())
    application.add_handler(build_feedback_handler())
    application.add_handler(build_menu_callback_handler())
    application.add_handler(CommandHandler("cancel", _cancel_command))

    logging.info("ربات فعال شد و در حال گوش دادن به رویدادها است.")
    application.run_polling(stop_signals=None)


async def _cancel_command(update, context: ContextTypes.DEFAULT_TYPE) -> int:
    if update.message:
        await update.message.reply_text("فرآیند جاری لغو شد. هر زمان خواستی دوباره شروع کن.")
    context.user_data.clear()
    return ConversationHandler.END


if __name__ == "__main__":
    main()
