"""Pricing utilities for determining competitive product prices."""

from __future__ import annotations

import logging
from typing import Any, Dict

from .gpt_service import GptClient, GptClientError
from .logic import calculate_prices

logger = logging.getLogger(__name__)


def get_competitive_pricing(
    gpt_client: GptClient,
    product_name: str,
    purchase_price: float,
    profit_margin: float,
) -> Dict[str, Any]:
    """Fetch competitor information and derive price suggestions.

    Returns a dict containing the raw competitor payload as well as the
    calculated pricing structure (base, target, final, compare).
    """

    competitor_info: Dict[str, Any]
    try:
        competitor_info = gpt_client.find_competitor_prices(product_name)
    except GptClientError as exc:
        logger.warning("Competitor price lookup failed for %s: %s", product_name, exc)
        competitor_info = {}

    average_price = competitor_info.get("average_price")
    if not isinstance(average_price, (int, float)):
        average_price = purchase_price

    pricing = calculate_prices(int(purchase_price), int(average_price), profit_margin)
    return {
        "competitor": competitor_info,
        "pricing": pricing,
    }
