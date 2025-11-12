"""Utilities for scraping product images from prioritized sources."""

from __future__ import annotations

import logging
import re
from typing import Dict, Iterable, List, Optional, Set

import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS

LOGGER = logging.getLogger(__name__)

SEARCH_URL = "https://www.google.com/search"
IMAGE_EXT_PATTERN = re.compile(r"\.(?:jpe?g|png|gif|webp)(?:\?.*)?$", re.IGNORECASE)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
}


def _http_get(url: str, params: Optional[Dict[str, str]] = None) -> str:
    response = requests.get(url, headers=HEADERS, params=params, timeout=15)
    response.raise_for_status()
    return response.text


def _looks_like_image(url: str) -> bool:
    return bool(IMAGE_EXT_PATTERN.search(url))


def _extract_google_results(html: str, limit: int, site: Optional[str]) -> List[str]:
    soup = BeautifulSoup(html, "html.parser")
    results: List[str] = []

    for container in soup.select("div.isv-r"):
        url = container.get("data-ou") or container.get("data-href")
        if not url or not isinstance(url, str) or not url.startswith("http"):
            continue
        if site and site not in url:
            continue
        if "gstatic.com" in url:
            continue
        if not _looks_like_image(url):
            continue
        results.append(url)
        if len(results) >= limit:
            return results

    if len(results) < limit:
        for script_match in re.findall(r'"(https?://[^"\\]+)"', html):
            url = script_match
            if not url.startswith("http"):
                continue
            if site and site not in url:
                continue
            if "gstatic.com" in url:
                continue
            if not _looks_like_image(url):
                continue
            results.append(url)
            if len(results) >= limit:
                break

    return results


def _google_images(query: str, limit: int, site: Optional[str] = None) -> List[str]:
    if limit <= 0:
        return []
    search_query = f"site:{site} {query}" if site else query
    params = {"q": search_query, "tbm": "isch", "hl": "fa"}
    try:
        html = _http_get(SEARCH_URL, params=params)
    except Exception as exc:
        LOGGER.debug("Google image fetch failed (%s): %s", site or "general", exc)
        return []
    return _extract_google_results(html, limit, site)


def _duckduckgo_images(query: str, limit: int) -> List[str]:
    results: List[str] = []
    if limit <= 0:
        return results
    try:
        with DDGS() as ddgs:
            for item in ddgs.images(query, max_results=limit, type_image="photo"):
                url = item.get("image") or item.get("url")
                if not isinstance(url, str) or not url.startswith("http"):
                    continue
                if "gstatic.com" in url:
                    continue
                if not _looks_like_image(url):
                    continue
                results.append(url)
                if len(results) >= limit:
                    break
    except Exception as exc:
        LOGGER.debug("DuckDuckGo fetch failed: %s", exc)
    return results


def _deduplicate(urls: Iterable[str]) -> List[str]:
    cleaned: List[str] = []
    seen: Set[str] = set()
    for url in urls:
        if not isinstance(url, str) or not url.startswith("http"):
            continue
        normalized = re.sub(r"\?.*", "", url)
        if normalized in seen:
            continue
        seen.add(normalized)
        cleaned.append(url)
    return cleaned


def search_images(query: str, max_results: int = 10) -> List[str]:
    """Search prioritized providers for product images."""
    results: List[str] = []
    ordered_sources = (
        lambda q, limit: _google_images(q, limit, "digikala.com"),
        lambda q, limit: _google_images(q, limit, "torob.com"),
        lambda q, limit: _google_images(q, limit, None),
        lambda q, limit: _duckduckgo_images(q, limit),
    )
    for source in ordered_sources:
        remaining = max_results - len(results)
        if remaining <= 0:
            break
        urls = source(query, remaining)
        results.extend(urls)
    return _deduplicate(results)[:max_results]
