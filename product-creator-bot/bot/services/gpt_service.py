"""Client abstractions for interacting with the GPT API."""

from __future__ import annotations

import json
import time
from typing import Any, Dict, List, Optional

import requests


class GptClientError(RuntimeError):
    """Raised when the GPT API call fails."""


class GptClient:
    """Encapsulates GPT API calls for content enrichment."""

    API_URL = "https://api.openai.com/v1/chat/completions"
    DEFAULT_MODEL = "gpt-4.1-mini"
    RETRY_DELAYS = (2, 4, 8)

    def __init__(self, api_key: str, model: Optional[str] = None) -> None:
        self.api_key = api_key
        self.model = model or self.DEFAULT_MODEL
        self._session = requests.Session()

    def _post_chat(
        self,
        messages: List[Dict[str, str]],
        *,
        response_format: Optional[Dict[str, str]] = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
        }
        if response_format is not None:
            payload["response_format"] = response_format

        attempt = 0
        while True:
            try:
                response = self._session.post(
                    self.API_URL,
                    headers=headers,
                    json=payload,
                    timeout=45,
                )
            except requests.RequestException as exc:
                if attempt >= len(self.RETRY_DELAYS):
                    raise GptClientError(f"ارتباط با سرویس GPT برقرار نشد: {exc}") from exc
                time.sleep(self.RETRY_DELAYS[attempt])
                attempt += 1
                continue

            if response.status_code >= 500:
                if attempt >= len(self.RETRY_DELAYS):
                    raise GptClientError(
                        f"سرویس GPT در حال حاضر پاسخگو نیست (کد {response.status_code})."
                    )
                time.sleep(self.RETRY_DELAYS[attempt])
                attempt += 1
                continue

            if response.status_code >= 400:
                raise GptClientError(
                    f"درخواست به سرویس GPT با خطا مواجه شد (کد {response.status_code}): {response.text}"
                )

            try:
                return response.json()
            except ValueError as exc:
                raise GptClientError("پاسخ دریافتی از GPT معتبر نیست.") from exc

    @staticmethod
    def _extract_content(data: Dict[str, Any]) -> str:
        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as exc:
            raise GptClientError("ساختار پاسخ GPT غیرمنتظره است.") from exc

    @staticmethod
    def _parse_json_content(content: str) -> Dict[str, Any]:
        try:
            return json.loads(content)
        except json.JSONDecodeError as exc:
            raise GptClientError("پاسخ GPT در قالب JSON معتبر نیست.") from exc

    def enrich_product_description(
        self,
        product_name: str,
        brand_info: Dict[str, Any],
        category_info: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Generate detailed Persian product description and specs."""
        system_prompt = (
            "شما یک دستیار بازاریابی فارسی‌زبان هستید که باید توضیحات محصول ایجاد کند."
            " پاسخ باید کاملاً فارسی و حرفه‌ای باشد."
        )
        user_prompt = (
            f"لطفاً برای محصول «{product_name}» یک توضیح کامل بازاریابی تولید کن. "
            "از منابع معتبر وب استفاده کن و مشخصات فنی دقیق را نیز به‌صورت ساختارمند ارائه بده. "
            "اطلاعات برند و دسته‌بندی به شرح زیر است:\n"
            f"- برند: {json.dumps(brand_info, ensure_ascii=False)}\n"
            f"- دسته‌بندی‌ها: {json.dumps(category_info, ensure_ascii=False)}\n"
            "خروجی را به صورت JSON با کلیدهای زیر برگردان:\n"
            "description: متن کامل بازاریابی\n"
            "highlights: آرایه‌ای از نکات کلیدی\n"
            "specs: شامل وزن (weight)، طول (length_cm)، عرض (width_cm)، ارتفاع (height_cm)،"
            " و سایر ویژگی‌های مهم در قالب کلید/مقدار."
        )
        data = self._post_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )
        content = self._extract_content(data)
        return self._parse_json_content(content)

    def generate_product_content(
        self,
        product_name: str,
        brand_info: Dict[str, Any],
        category_info: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Produce optimized title, description, keywords, slug, and attributes."""

        system_prompt = (
            "تو یک کارشناس بازاریابی و سئو فارسی‌زبان هستی که باید برای محصولات فروشگاهی"
            " محتوای کامل و ساختارمند تولید کند. خروجی باید ۱۰۰٪ فارسی باشد."
        )
        user_prompt = (
            "برای محصول زیر اطلاعات جامع تولید کن و همه خروجی‌ها را به صورت JSON برگردان:\n"
            f"محصول: {product_name}\n"
            f"برند: {json.dumps(brand_info, ensure_ascii=False)}\n"
            f"دسته‌بندی‌ها: {json.dumps(category_info, ensure_ascii=False)}\n"
            "خروجی باید شامل کلیدهای زیر باشد:\n"
            "title: عنوان بهینه‌شده برای SEO\n"
            "description: توضیحات کامل و جذاب محصول\n"
            "keywords: لیستی از کلمات کلیدی (حداقل ۶ مورد)\n"
            "slug: اسلاگ پیشنهادی برای URL\n"
            "attributes: آرایه‌ای از آیتم‌ها با ساختار {\"title\": \"نام ویژگی\", \"value\": \"مقدار\"}\n"
            "highlights: لیستی از نکات کلیدی کوتاه"
        )
        data = self._post_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        content = self._extract_content(data)
        return self._parse_json_content(content)

    def group_excel_products(
        self,
        rows: List[Dict[str, Any]],
        *,
        max_rows: int = 120,
    ) -> List[Dict[str, Any]]:
        """Cluster spreadsheet rows into parent products with variant metadata."""

        if not rows:
            return []

        trimmed = rows[:max_rows]
        payload_text = json.dumps(trimmed, ensure_ascii=False)
        system_prompt = (
            "تو یک کارشناس مدیریت کاتالوگ هستی که باید داده‌های اکسل فارسی را تحلیل کند."
            " خروجی باید ساختارمند و قابل پردازش باشد."
        )
        user_prompt = (
            "داده‌های زیر مربوط به ردیف‌های اکسل محصولات هستند. آن‌ها را تحلیل کن و"
            " حاصل را در قالب JSON زیر برگردان:\n"
            "[\n"
            "    {\n"
            "        \"parent_title\": \"...\",\n"
            "        \"brand\": \"پیشنهاد برند یا خالی\",\n"
            "        \"category_hints\": [\"کلمه کلیدی دسته ۱\", \"کلمه کلیدی دسته ۲\"],\n"
            "        \"variants\": [\n"
            "            {\"title\": \"عنوان کامل ردیف\", \"stock\": عدد, \"cost\": عدد, \"sku\": \"در صورت وجود\"},\n"
            "            ...\n"
            "        ]\n"
            "    }\n"
            "]\n"
            "قواعد مهم:\n"
            "1. ردیف‌هایی که فقط در ویژگی‌هایی مثل سایز، رنگ یا مدل تفاوت دارند باید در یک parent قرار بگیرند.\n"
            "2. فیلد cost باید عددی باشد (در صورت نبود، مقدار 0).\n"
            "3. اگر ستونی برای موجودی وجود ندارد، مقدار stock را 0 قرار بده.\n"
            "4. category_hints را بر اساس منطق محصول پر کن (حداکثر 3 مورد).\n"
            "5. خروجی باید JSON معتبری باشد و توضیح اضافه نباید داشته باشد.\n\n"
            f"داده‌ها:\n{payload_text}"
        )

        data = self._post_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        content = self._extract_content(data)
        parsed = self._parse_json_content(content)
        if isinstance(parsed, dict):
            return parsed.get("items") or parsed.get("parents") or []
        return parsed

    def generate_blog_article(
        self,
        product_payload: Dict[str, Any],
        existing_titles: List[str],
    ) -> Dict[str, Any]:
        """Produce a SEO-focused blog article in HTML."""

        titles_block = "\n".join(f"- {title}" for title in existing_titles if title)
        if not titles_block:
            titles_block = "(هیچ عنوانی وجود ندارد)"

        system_prompt = (
            "تو یک نویسنده متخصص سئو هستی که باید مقالات وبلاگی فارسی تولید کند."
            " متن خروجی باید ساختارمند، با تیترهای H2/H3 و کاملاً فارسی باشد."
        )
        user_prompt = (
            "براساس اطلاعات محصول زیر یک مقاله کامل تولید کن. خروجی JSON با کلیدهای"
            " title, summary, content_html, slug, keywords و meta_title باشد."
            " الزامات:\n"
            "1. در متن، به شکل طبیعی به لینک محصول و دسته‌بندی‌های مربوطه ارجاع بده.\n"
            "2. از تکرار عناوین موجود زیر جلوگیری کن:\n"
            f"{titles_block}\n"
            "3. محتوا باید حداقل 700 کلمه باشد و از لیست‌ها و پاراگراف‌های کوتاه استفاده کند.\n"
            f"اطلاعات محصول:\n{json.dumps(product_payload, ensure_ascii=False)}"
        )

        data = self._post_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.5,
        )
        content = self._extract_content(data)
        return self._parse_json_content(content)

    def find_competitor_prices(self, product_name: str) -> Dict[str, Any]:
        system_prompt = (
            "تو یک تحلیلگر بازار فارسی‌زبان هستی. قیمت‌های اعلامی باید به تومان باشد."
        )
        user_prompt = (
            f"کمترین و بیشترین قیمت محصول «{product_name}» را در سایت‌های torob.ir و digikala.com"
            " جستجو کن و میانگین قیمت را محاسبه کن. پاسخ را در قالب JSON با کلیدهای زیر بده:\n"
            "min_price, max_price, average_price، و یک فیلد evidence که شامل خلاصه‌ی منابع باشد."
        )
        data = self._post_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )
        content = self._extract_content(data)
        return self._parse_json_content(content)

    def find_product_images(self, product_name: str) -> Dict[str, Any]:
        system_prompt = (
            "تو یک دستیار تحقیقاتی هستی که باید برای محصولات تصاویر مناسب پیدا کند."
        )
        user_prompt = (
            f"از Google Images حداقل پنج لینک مستقیم و بدون واترمارک برای محصول «{product_name}» "
            "پیدا کن. فقط URLهای معتبر HTTPS را برگردان. پاسخ JSON با کلید image_urls "
            "که یک آرایه از رشته‌ها است ارائه بده. اگر لینکی با فرمت مناسب پیدا نشد،"
            " آرایه خالی برگردان و دلیل را در فیلد optional_note بنویس."
        )
        data = self._post_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )
        content = self._extract_content(data)
        return self._parse_json_content(content)
