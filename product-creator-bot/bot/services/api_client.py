"""API client module for interacting with the e-commerce backend."""

from __future__ import annotations

import time
from typing import Any, Dict, Optional
from urllib.parse import urljoin

import requests


class ApiClientError(RuntimeError):
    """Raised when the API returns an unexpected response."""


class ApiClient:
    """Handles HTTP interactions with the e-commerce API."""

    RETRY_DELAYS = (2, 4, 8)

    def __init__(self, base_url: str, api_key: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.bearer_token: Optional[str] = None
        self._session = requests.Session()

    def _build_headers(self, include_auth: bool = True) -> Dict[str, str]:
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "apikey": self.api_key,
        }
        if include_auth:
            if not self.bearer_token:
                raise ApiClientError("توکن احراز هویت در دسترس نیست.")
            headers["Authorization"] = f"Bearer {self.bearer_token}"
        return headers

    def _request(
        self,
        method: str,
        endpoint: str,
        *,
        include_auth: bool = True,
        retries: int = 3,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        url = urljoin(f"{self.base_url}/", endpoint.lstrip("/"))
        headers = kwargs.pop("headers", {})
        headers = {**self._build_headers(include_auth=include_auth), **headers}

        attempt = 0
        while True:
            try:
                response = self._session.request(
                    method,
                    url,
                    headers=headers,
                    timeout=30,
                    **kwargs,
                )
            except requests.RequestException as exc:
                if attempt >= retries:
                    raise ApiClientError(f"خطای شبکه در برقراری ارتباط با سرور: {exc}") from exc
                time.sleep(self.RETRY_DELAYS[min(attempt, len(self.RETRY_DELAYS) - 1)])
                attempt += 1
                continue

            if 500 <= response.status_code < 600:
                if attempt >= retries:
                    raise ApiClientError(
                        f"سرور در حال حاضر پاسخگو نیست (کد {response.status_code})."
                    )
                time.sleep(self.RETRY_DELAYS[min(attempt, len(self.RETRY_DELAYS) - 1)])
                attempt += 1
                continue

            if response.status_code >= 400:
                detail = self._safe_json(response)
                raise ApiClientError(
                    f"درخواست ناموفق بود (کد {response.status_code}): {detail}"
                )

            return self._safe_json(response)

    @staticmethod
    def _safe_json(response: requests.Response) -> Dict[str, Any]:
        try:
            return response.json()
        except ValueError as exc:
            raise ApiClientError("پاسخ سرور قابل تجزیه نیست.") from exc

    def authenticate(self, contact: str, password: str) -> bool:
        payload = {"contact": contact, "password": password, "method": "bearer"}
        data = self._request(
            "POST",
            "/api/v1/user/sessions",
            include_auth=False,
            json=payload,
        )
        token = data.get("token")
        if not token:
            raise ApiClientError("توکن دسترسی از پاسخ سرور دریافت نشد.")
        self.bearer_token = token
        return True

    def get_brands(self) -> Dict[str, Any]:
        return self._request("GET", "/api/v1/manage/products/brands")

    def suggest_brands(self, brief: str, count: int = 10) -> Dict[str, Any]:
        payload = {"brief": brief, "count": count}
        return self._request(
            "POST", "/api/v1/manage/products/brands/suggest", json=payload
        )

    def brief_brand(self, content: str) -> Dict[str, Any]:
        payload = {"content": content}
        return self._request(
            "POST", "/api/v1/manage/products/brands/brief", json=payload
        )

    def create_brand(self, title: str, description: str) -> Dict[str, Any]:
        payload = {"status": "active", "title": title, "description": description}
        return self._request(
            "POST", "/api/v1/manage/products/brands", json=payload
        )

    def create_brand_snippet(self, title: str, description: str) -> Dict[str, Any]:
        payload = {"title": title, "description": description}
        return self._request(
            "POST", "/api/v1/manage/products/brands/snippet", json=payload
        )

    def get_categories(self, parent_id: Optional[int] = None) -> Dict[str, Any]:
        params = {"parentID": parent_id} if parent_id is not None else None
        return self._request(
            "GET",
            "/api/v1/manage/products/categories",
            params=params,
        )

    def get_nested_categories(self, parent_id: Optional[int] = None) -> Dict[str, Any]:
        return self.get_categories(parent_id)

    def suggest_categories(self, brief: str, count: int = 10) -> Dict[str, Any]:
        payload = {"brief": brief, "count": count}
        return self._request(
            "POST", "/api/v1/manage/products/categories/suggest", json=payload
        )

    def brief_category(self, content: str) -> Dict[str, Any]:
        payload = {"content": content}
        return self._request(
            "POST", "/api/v1/manage/products/categories/brief", json=payload
        )

    def create_category(
        self, title: str, description: str, parent_id: Optional[int] = None
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {"status": "active", "title": title, "description": description}
        if parent_id is not None:
            payload["parentID"] = parent_id
        return self._request(
            "POST", "/api/v1/manage/products/categories", json=payload
        )

    def create_category_snippet(self, title: str, description: str) -> Dict[str, Any]:
        payload = {"title": title, "description": description}
        return self._request(
            "POST", "/api/v1/manage/products/categories/snippet", json=payload
        )

    def get_attributes(self) -> Dict[str, Any]:
        return self._request("GET", "/api/v1/manage/products/attributes")

    def create_attribute(
        self,
        title: str,
        parent_id: Optional[int] = None,
        *,
        status: str = "active",
        filter_status: str = "active",
        description: str = "",
        color: Optional[str] = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "status": status,
            "filterStatus": filter_status,
            "title": title,
            "description": description,
        }
        if parent_id is not None:
            payload["parentID"] = parent_id
        if color is not None:
            payload["color"] = color
        return self._request(
            "POST", "/api/v1/manage/products/attributes", json=payload
        )

    def find_route(self, path: str) -> Dict[str, Any]:
        params = {"path": path}
        return self._request(
            "GET", "/api/v1/manage/routes/find", params=params
        )

    def grab_file(self, parent_id: int, url: str, name: str) -> Dict[str, Any]:
        payload = {"parentID": parent_id, "url": url, "name": name}
        return self._request(
            "POST", "/api/v1/manage/files/grab", json=payload
        )

    def brief_product(self, content: str) -> Dict[str, Any]:
        payload = {"content": content}
        return self._request(
            "POST", "/api/v1/manage/products/brief", json=payload
        )

    def sanitize_content(self, content: str) -> Dict[str, Any]:
        payload = {"content": content}
        return self._request(
            "POST", "/api/v1/manage/products/sanitize", json=payload
        )

    def create_product_snippet(self, title: str, description: str) -> Dict[str, Any]:
        payload = {"title": title, "description": description}
        return self._request(
            "POST", "/api/v1/manage/products/snippet", json=payload
        )

    def update_snippet(
        self,
        snippet_type: str,
        reference_id: int,
        title: str,
        description: str,
        canonical_url: str,
        robots: str = "index",
    ) -> Dict[str, Any]:
        payload = {
            "type": snippet_type,
            "referenceID": reference_id,
            "title": title,
            "description": description,
            "robots": robots,
            "canonicalUrl": canonical_url,
        }
        return self._request(
            "PUT", "/api/v1/manage/snippets", json=payload
        )

    def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        return self._request(
            "POST", "/api/v1/manage/products", json=product_data
        )

    def update_product(self, product_id: int, payload: Dict[str, Any]) -> Dict[str, Any]:
        return self._request(
            "PUT", f"/api/v1/manage/products/{product_id}", json=payload
        )

    # --------------------------------------------------------------------- #
    # Post management
    # --------------------------------------------------------------------- #
    def list_posts(self, size: int = 250) -> Dict[str, Any]:
        params = {"size": size}
        return self._request("GET", "/api/v1/manage/posts", params=params)

    def create_post(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return self._request("POST", "/api/v1/manage/posts", json=payload)
