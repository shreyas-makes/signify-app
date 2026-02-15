const DEFAULT_API_BASE_URL = "http://localhost:3000"

async function getSettings() {
  const stored = await chrome.storage.local.get(["apiBaseUrl", "apiToken", "pendingAuthState"])
  return {
    apiBaseUrl: stored.apiBaseUrl || DEFAULT_API_BASE_URL,
    apiToken: stored.apiToken || null,
    pendingAuthState: stored.pendingAuthState || null,
  }
}

async function setApiBaseUrl(apiBaseUrl) {
  await chrome.storage.local.set({ apiBaseUrl })
  return { apiBaseUrl }
}

async function clearAuth() {
  await chrome.storage.local.remove(["apiToken", "pendingAuthState"])
  return { apiToken: null }
}

async function exchangeAuthCode({ code, state, redirectUri }) {
  const { apiBaseUrl, pendingAuthState } = await getSettings()

  if (!code) {
    return { ok: false, error: "Missing authorization code." }
  }

  if (pendingAuthState && state && pendingAuthState !== state) {
    return { ok: false, error: "State mismatch. Please retry authorization." }
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/extension_tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, state, redirect_uri: redirectUri }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { ok: false, error: payload.error || "Failed to exchange auth code." }
  }

  if (!payload.api_token) {
    return { ok: false, error: "Missing API token in response." }
  }

  await chrome.storage.local.set({ apiToken: payload.api_token, pendingAuthState: null })
  return { ok: true, apiToken: payload.api_token }
}

async function createVerification(payload) {
  const { apiBaseUrl, apiToken } = await getSettings()

  if (!apiToken) {
    return { ok: false, error: "Missing API token. Connect the extension first." }
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/verifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { ok: false, error: data.error || "Verification failed.", details: data.details }
  }

  return { ok: true, data }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return

  switch (message.type) {
    case "getSettings":
      getSettings().then((settings) => sendResponse({ ok: true, settings }))
      return true
    case "setApiBaseUrl":
      setApiBaseUrl(message.apiBaseUrl).then((settings) => sendResponse({ ok: true, settings }))
      return true
    case "clearAuth":
      clearAuth().then((result) => sendResponse({ ok: true, result }))
      return true
    case "exchangeAuthCode":
      exchangeAuthCode(message).then((result) => sendResponse(result))
      return true
    case "createVerification":
      createVerification(message.payload).then((result) => sendResponse(result))
      return true
    default:
      break
  }
})
