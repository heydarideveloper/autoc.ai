"""Client for interacting with the Nest.js feature backend."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List

import requests

from .. import config


class BackendClientError(RuntimeError):
    """Raised when the backend API request fails."""


@dataclass
class SubscriptionStatus:
    is_active: bool
    features: List[str]
    user_id: str | None = None
    portal_base_url: str | None = None
    public_base_url: str | None = None


class BackendClient:
    """Lightweight HTTP client for backend endpoints."""

    def __init__(self, base_url: str, api_key: str | None = None) -> None:
        self._base_url = base_url.rstrip("/")
        self._api_key = api_key or ""
        self._session = requests.Session()

    def _headers(self) -> Dict[str, str]:
        headers = {
            "Accept": "application/json",
        }
        if self._api_key:
            headers["x-api-key"] = self._api_key
        return headers

    def subscription_check(self, phone: str) -> SubscriptionStatus:
        try:
            response = self._session.get(
                f"{self._base_url}/subscription/check",
                params={"phone": phone},
                headers=self._headers(),
                timeout=15,
            )
        except requests.RequestException as exc:
            raise BackendClientError("ارتباط با سرویس اشتراک برقرار نشد.") from exc

        if response.status_code >= 500:
            raise BackendClientError("سرور اشتراک در حال حاضر در دسترس نیست.")
        if response.status_code == 404:
            return SubscriptionStatus(is_active=False, features=[])
        if response.status_code >= 400:
            raise BackendClientError(f"درخواست اشتراک با خطا مواجه شد ({response.status_code}).")

        try:
            data = response.json()
        except ValueError as exc:
            raise BackendClientError("پاسخ اشتراک قابل خواندن نبود.") from exc

        return SubscriptionStatus(
            is_active=bool(data.get("isActive")),
            features=[str(item) for item in data.get("features", []) if isinstance(item, str)],
            user_id=data.get("userId"),
            portal_base_url=data.get("portalBaseUrl"),
            public_base_url=data.get("publicBaseUrl"),
        )

    def send_feedback(self, phone: str, is_positive: bool, context: str) -> None:
        payload = {"phone": phone, "isPositive": is_positive, "context": context}
        self._post("/feedback/bot", payload)

    def notify_product_created(self, phone: str, product_id: str, product_title: str) -> None:
        payload = {"phone": phone, "productId": product_id, "productTitle": product_title}
        self._post("/notifications/trigger-product-created", payload)

    def _post(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = self._session.post(
                f"{self._base_url}{endpoint}",
                headers={**self._headers(), "Content-Type": "application/json"},
                json=payload,
                timeout=20,
            )
        except requests.RequestException as exc:
            raise BackendClientError("اتصال به سرویس بک‌اند برقرار نشد.") from exc

        if response.status_code >= 500:
            raise BackendClientError("سرویس بک‌اند در دسترس نیست.")
        if response.status_code >= 400:
            raise BackendClientError(
                f"درخواست ناموفق بود ({response.status_code}): {response.text}"
            )

        if response.status_code == 204:
            return {}

        try:
            return response.json()
        except ValueError:
            return {}


def get_backend_client() -> BackendClient:
    return BackendClient(config.BACKEND_BASE_URL, config.BACKEND_API_KEY)
