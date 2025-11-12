const form = document.querySelector("#config-form");
const statusEl = document.querySelector("#status");

async function loadConfig() {
  const result = await chrome.storage.sync.get({
    backendUrl: "",
    portalUrl: "https://portal.ir",
    token: "",
  });
  form.backendUrl.value = result.backendUrl || "";
  form.portalUrl.value = result.portalUrl || "https://portal.ir";
  form.token.value = result.token || "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const backendUrl = form.backendUrl.value.trim();
  const portalUrl = form.portalUrl.value.trim();
  const token = form.token.value.trim();

  await chrome.storage.sync.set({ backendUrl, portalUrl, token });
  statusEl.textContent = "تنظیمات با موفقیت ذخیره شد.";
  statusEl.style.color = "#059669";
  setTimeout(() => (statusEl.textContent = ""), 3000);
});

loadConfig();

