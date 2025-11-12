/* eslint-disable no-undef */
importScripts("vendor/socket.io.min.js");

const DEFAULT_PORTAL_URL = "https://portal.ir";
let socket = null;
let config = {
  backendUrl: "http://localhost:3000",
  portalUrl: DEFAULT_PORTAL_URL,
  token: "",
};

const notificationCache = new Map();

const hasSidePanel = Boolean(chrome.sidePanel?.setOptions);

chrome.runtime.onInstalled.addListener(() => {
  if (hasSidePanel) {
    chrome.sidePanel.setOptions({ path: "sidepanel.html" });
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
  initialize();
});

chrome.runtime.onStartup.addListener(() => {
  initialize();
});

if (hasSidePanel) {
  chrome.action.onClicked.addListener(async () => {
    try {
      await chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
    } catch (err) {
      console.warn("Failed to open side panel", err);
    }
  });
} else {
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "https://web.telegram.org/k/#@product-creator-bot" });
  });
}

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex !== 0) {
    return;
  }
  const payload = notificationCache.get(notificationId);
  if (!payload) {
    return;
  }
  const destination = `${config.portalUrl.replace(/\/$/, "")}/admin/products?keywords=${encodeURIComponent(
    payload.productId,
  )}`;
  chrome.tabs.create({ url: destination });
  chrome.notifications.clear(notificationId);
});

chrome.notifications.onClosed.addListener((notificationId) => {
  notificationCache.delete(notificationId);
});

chrome.storage.onChanged.addListener(() => {
  initialize();
});

async function initialize() {
  config = await loadConfig();
  connectSocket();
}

async function loadConfig() {
  const stored = await chrome.storage.sync.get({
    backendUrl: "",
    portalUrl: DEFAULT_PORTAL_URL,
    token: "",
  });
  return {
    backendUrl: stored.backendUrl || "",
    portalUrl: stored.portalUrl || DEFAULT_PORTAL_URL,
    token: stored.token || "",
  };
}

function connectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  if (!config.backendUrl || !config.token) {
    console.info("Backend URL or token missing, skipping WebSocket connection.");
    return;
  }

  socket = io(config.backendUrl, {
    transports: ["websocket"],
    auth: { token: config.token },
  });

  socket.on("connect", () => {
    console.info("Connected to notifications gateway.");
  });

  socket.on("connect_error", (error) => {
    console.warn("Notifications connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.info("Notifications disconnected:", reason);
  });

  socket.on("product-created", (payload) => {
    handleProductCreated(payload);
  });
}

async function handleProductCreated(payload) {
  if (!payload || !payload.productId) {
    return;
  }

  const notificationId = `product-${payload.productId}-${Date.now()}`;
  notificationCache.set(notificationId, payload);

  await chrome.notifications.create(notificationId, {
    type: "basic",
    title: "محصول جدید آماده است",
    message: payload.productTitle || "محصول بدون عنوان",
    iconUrl: "icons/icon128.png",
    buttons: [{ title: "مشاهده و ویرایش" }],
    priority: 2,
  });
}

