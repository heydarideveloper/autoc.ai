"""Post creation pipeline for generating auxiliary content."""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, List, Optional

from telegram.ext import ContextTypes

from .api_client import ApiClientError
from .gpt_service import GptClient, GptClientError
from .helpers import deduplicate_keywords, looks_like_duplicate, slugify

logger = logging.getLogger(__name__)


async def run(
    context: ContextTypes.DEFAULT_TYPE,
    product_id: str,
    product_slug: str,
    product_info: Optional[Dict[str, Any]] = None,
) -> None:
    """Execute post-creation jobs such as article generation and publication."""

    api_client = context.user_data.get("api_client")
    if not api_client:
        logger.debug("Skipping post creation tasks; api_client not set.")
        return

    gpt_client = _get_gpt_client(context)
    if not gpt_client:
        logger.debug("Skipping post creation tasks; GPT client not configured.")
        return

    product_info = product_info or {}
    existing_posts = await _fetch_existing_posts(api_client)
    existing_titles = [item.get("title", "") for item in existing_posts]
    existing_slugs = [item.get("slug", "") for item in existing_posts]

    article_payload = {
        "product": product_info,
        "productId": product_id,
        "productSlug": product_slug,
    }

    try:
        article = await asyncio.to_thread(
            gpt_client.generate_blog_article,
            article_payload,
            existing_titles,
        )
    except GptClientError as exc:
        logger.warning("Failed to generate blog article for product %s: %s", product_id, exc)
        return

    article_title = (article.get("title") or product_info.get("title") or "مقاله جدید").strip()
    article_slug = article.get("slug") or slugify(article_title)
    article_slug = _ensure_unique_slug(article_slug, existing_slugs)
    content_html = article.get("content_html") or article.get("content")
    if not content_html:
        logger.debug("GPT did not return content for product %s", product_id)
        return

    summary = article.get("summary") or product_info.get("description", "")[:300]
    combined_keywords = deduplicate_keywords([
        *(article.get("keywords", []) or []),
        *(product_info.get("keywords", []) or []),
    ])

    post_payload = {
        "title": article_title,
        "status": "published",
        "content": content_html,
        "description": summary,
        "metaTitle": article.get("meta_title", article_title),
        "metaDescription": summary,
        "slug": article_slug,
        "productId": product_id,
        "keywords": combined_keywords,
        "tags": combined_keywords[:10],
        "internalLinks": [product_info.get("product_link")],
    }

    try:
        response = await asyncio.to_thread(api_client.create_post, post_payload)
        logger.info(
            "Generated blog post for product %s (post_id=%s)",
            product_id,
            response.get("postID") or response.get("id"),
        )
    except ApiClientError as exc:
        logger.warning("Publishing blog article failed for product %s: %s", product_id, exc)


async def _fetch_existing_posts(api_client) -> List[Dict[str, Any]]:
    try:
        response = await asyncio.to_thread(api_client.list_posts, 250)
    except ApiClientError as exc:
        logger.debug("Unable to fetch existing posts: %s", exc)
        return []

    return response.get("posts") or response.get("items") or []


def _ensure_unique_slug(candidate: str, existing_slugs: List[str]) -> str:
    slug = candidate
    counter = 2
    while any(looks_like_duplicate(slug, [item]) for item in existing_slugs):
        slug = f"{candidate}-{counter}"
        counter += 1
    return slug


def _get_gpt_client(context: ContextTypes.DEFAULT_TYPE) -> Optional[GptClient]:
    bot_data = context.application.bot_data
    client = bot_data.get("gpt_client")
    if isinstance(client, GptClient):
        return client
    return None
