"""Image processing service for product visuals."""

from __future__ import annotations

import logging
from typing import Iterable, List

from . import image_scraper

logger = logging.getLogger(__name__)


def get_clean_images(product_title: str, *, limit: int = 5, extra_keywords: Iterable[str] | None = None) -> List[str]:
    """Return a list of image URLs suitable for upload.

    This function currently relies on the existing search logic and acts as the
    abstraction layer for future watermark-removal or quality filters.
    """

    query_parts = [product_title.strip()]
    if extra_keywords:
        query_parts.extend(str(item).strip() for item in extra_keywords if item)
    query = " ".join(part for part in query_parts if part)
    if not query:
        return []

    try:
        raw_urls = image_scraper.search_images(query, max_results=limit * 2)
    except Exception as exc:  # pragma: no cover - network variability
        logger.warning("Image search failed for %s: %s", product_title, exc)
        return []

    cleaned: List[str] = []
    for url in raw_urls:
        if len(cleaned) >= limit:
            break
        if _is_supported_format(url):
            cleaned.append(url)
    return cleaned


def _is_supported_format(url: str) -> bool:
    lowered = url.lower()
    return lowered.endswith((".jpg", ".jpeg", ".png", ".webp"))


def remove_watermark(url: str) -> str:
    """Placeholder hook for future watermark removal pipeline."""
    logger.debug("Watermark removal not yet implemented for %s", url)
    return url
