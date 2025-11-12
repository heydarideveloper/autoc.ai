"""Utility helpers shared across bot services."""

from __future__ import annotations

import re
import unicodedata
from typing import Iterable, Set


SLUG_PATTERN = re.compile(r"[^a-z0-9-]+")


def slugify(value: str, *, max_length: int = 120) -> str:
    """Generate a URL-friendly slug from a Persian or Latin string."""
    normalized = unicodedata.normalize("NFKD", value or "").strip().lower()
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = ascii_text.replace(" ", "-")
    slug = SLUG_PATTERN.sub("", ascii_text)
    slug = re.sub(r"-+", "-", slug).strip("-")
    if len(slug) > max_length:
        slug = slug[:max_length].rstrip("-")
    return slug or "item"


def normalize_keyword(value: str) -> str:
    """Normalize keyword entries for deduplication purposes."""
    return unicodedata.normalize("NFKC", value or "").strip().lower()


def deduplicate_keywords(keywords: Iterable[str]) -> list[str]:
    """Remove duplicate keywords while preserving order."""
    seen: Set[str] = set()
    unique: list[str] = []
    for keyword in keywords:
        normalized = normalize_keyword(keyword)
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        unique.append(keyword.strip())
    return unique


def looks_like_duplicate(title: str, existing_titles: Iterable[str]) -> bool:
    """Check whether a title already exists in a case-insensitive manner."""
    normalized = normalize_keyword(title)
    for item in existing_titles:
        if normalize_keyword(item) == normalized:
            return True
    return False
