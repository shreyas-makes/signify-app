const statusEl = document.getElementById("status")
const apiBaseUrlInput = document.getElementById("apiBaseUrl")
const saveSettingsBtn = document.getElementById("saveSettings")
const connectBtn = document.getElementById("connect")
const disconnectBtn = document.getElementById("disconnect")
const errorEl = document.getElementById("error")

async function loadSettings() {
  const response = await chrome.runtime.sendMessage({ type: "getSettings" })
  if (!response?.ok) return

  const { apiBaseUrl, apiToken } = response.settings
  apiBaseUrlInput.value = apiBaseUrl
  statusEl.textContent = apiToken ? "Connected" : "Not connected"
  disconnectBtn.style.display = apiToken ? "block" : "none"
}

function showError(message) {
  errorEl.textContent = message || ""
}

saveSettingsBtn.addEventListener("click", async () => {
  const apiBaseUrl = apiBaseUrlInput.value.trim()
  if (!apiBaseUrl) {
    showError("Enter a Signify server URL.")
    return
  }

  await chrome.runtime.sendMessage({ type: "setApiBaseUrl", apiBaseUrl })
  showError("")
  loadSettings()
})

connectBtn.addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage({ type: "getSettings" })
  if (!response?.ok) return

  const apiBaseUrl = response.settings.apiBaseUrl
  const redirectUri = `chrome-extension://${chrome.runtime.id}/auth.html`
  const state = crypto.getRandomValues(new Uint32Array(2)).join("-")

  await chrome.storage.local.set({ pendingAuthState: state })

  const authUrl = `${apiBaseUrl}/extension/auth?state=${encodeURIComponent(
    state
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`

  chrome.tabs.create({ url: authUrl })
})

disconnectBtn.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "clearAuth" })
  showError("")
  loadSettings()
})

loadSettings().catch(() => {
  statusEl.textContent = "Unable to read settings."
})
