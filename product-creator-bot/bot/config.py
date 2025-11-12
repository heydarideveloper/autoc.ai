"""Configuration helpers for the product creator bot."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

_ENV_PATH = Path(__file__).resolve().parent / ".env"
if _ENV_PATH.exists():
    load_dotenv(dotenv_path=_ENV_PATH)
else:
    load_dotenv()


def _get_env(name: str, default: str = "") -> str:
    value = os.getenv(name, default)
    return value if value is not None else default


TELEGRAM_BOT_TOKEN = _get_env("TELEGRAM_BOT_TOKEN")
GPT_API_KEY = _get_env("GPT_API_KEY")
DEFAULT_PORTAL_BASE_URL = _get_env("PORTAL_BASE_URL", "https://portal.ir")
BACKEND_BASE_URL = _get_env("NEST_API_URL", "http://localhost:3000")
BACKEND_API_KEY = _get_env("BACKEND_API_KEY")
