"""Main menu renderer and callback dispatcher."""

from __future__ import annotations

from typing import Sequence

from telegram import Update
from telegram.ext import CallbackQueryHandler, ContextTypes

from .. import constants
from ..keyboards import build_main_menu


async def show_main_menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    features: Sequence[str] = context.user_data.get("features", [])
    keyboard = build_main_menu(features)

    if update.callback_query:
        query = update.callback_query
        await query.answer()
        await query.edit_message_text("What would you like to do?", reply_markup=keyboard)
    elif update.message:
        await update.message.reply_text("What would you like to do?", reply_markup=keyboard)


def build_menu_callback_handler() -> CallbackQueryHandler:
    return CallbackQueryHandler(handle_menu_callback, pattern=rf"^{constants.MENU_CALLBACK_PREFIX}\|")


async def handle_menu_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await show_main_menu(update, context)
