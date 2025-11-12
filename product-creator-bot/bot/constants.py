"""Central constants used across bot modules."""

from __future__ import annotations

# Feature flags exposed by the backend subscription API
FEATURE_MANUAL_PRODUCT = "CAN_CREATE_MANUAL_PRODUCT"
FEATURE_IMPORT_EXCEL = "CAN_IMPORT_EXCEL"

FEATURE_LABELS = {
    FEATURE_MANUAL_PRODUCT: "ایجاد دستی محصول",
    FEATURE_IMPORT_EXCEL: "ایمپورت از فایل اکسل",
}

# Conversation names
START_CONV = "start-conversation"
NEW_PRODUCT_CONV = "new-product-conversation"
EXCEL_IMPORT_CONV = "excel-import-conversation"

# Conversation state enums for onboarding/authentication
ASK_DOMAIN, ASK_PHONE, ASK_PASSWORD = range(10, 13)

# Manual product creation states
(
    GET_NAME,
    SELECT_BRAND,
    SELECT_BRAND_SUGGESTION,
    SELECT_CATEGORY,
    HANDLE_CATEGORY_ACTION,
    ENRICH_DATA,
    GET_PURCHASE_PRICE,
    HANDLE_IMAGE_SELECTION,
    CONFIRM_CREATION,
) = range(100, 109)

# Excel import states
AWAIT_FILE, CONFIRM_ANALYSIS = range(200, 202)

# Callback prefixes
MENU_CALLBACK_PREFIX = "menu"
FEEDBACK_CALLBACK_PREFIX = "feedback"
EXCEL_CALLBACK_PREFIX = "excel"
BRAND_SUGGEST_CALLBACK = "brand_suggest"
BRAND_SUGGEST_OPTION_PREFIX = "brand_suggestion"
CATEGORY_SUGGEST_CALLBACK = "cat_suggest"
CATEGORY_SUGGEST_OPTION_PREFIX = "cat_suggestion"
IMAGE_SELECT_CALLBACK = "img"

# Feedback contexts
FEEDBACK_CONTEXT_PRODUCT = "product_creation"
FEEDBACK_CONTEXT_IMPORT = "excel_import"

# Misc timings
CONVERSATION_TIMEOUT = 1200
EXCEL_CONVERSATION_TIMEOUT = 900
