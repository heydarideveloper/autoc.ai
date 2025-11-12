"""Business logic helpers for the product creator bot."""

from __future__ import annotations

import re
from typing import Dict


def format_phone_number(phone: str) -> str:
    """Normalize Iranian phone numbers to the +98 international format."""
    digits = re.sub(r"\D", "", phone or "")
    if not digits:
        raise ValueError("شماره تلفن معتبر وارد نشده است.")

    if digits.startswith("98"):
        local_part = digits[2:]
    elif digits.startswith("0"):
        local_part = digits[1:]
    elif digits.startswith("9"):
        local_part = digits
    else:
        local_part = digits

    normalized = f"+98{local_part}"
    return normalized


def calculate_prices(purchase_price: int, avg_competitor_price: int, profit_margin: float) -> Dict[str, int]:
    """Calculate pricing strategy values."""
    if purchase_price < 0:
        raise ValueError("قیمت خرید نمی‌تواند منفی باشد.")
    if avg_competitor_price < 0:
        raise ValueError("میانگین قیمت رقبا نمی‌تواند منفی باشد.")

    margin_factor = 1 + (profit_margin / 100.0)
    base_price = int(round((purchase_price + 100_000) * margin_factor))
    target_price = int(round(avg_competitor_price * 0.98))
    final_price = max(base_price, target_price)
    compare_price = int(round(final_price * 1.1))

    return {
        "base_price": base_price,
        "target_price": target_price,
        "final_price": final_price,
        "compare_price": compare_price,
    }
