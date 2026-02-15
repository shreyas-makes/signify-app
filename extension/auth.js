const statusEl = document.getElementById("status")
const errorEl = document.getElementById("error")

function setStatus(message) {
  statusEl.textContent = message
}

function setError(message) {
  errorEl.textContent = message
}

async function exchangeCode() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get("code")
  const state = params.get("state")
  const redirectUri = `chrome-extension://${chrome.runtime.id}/auth.html`

  if (!code) {
    setError("Missing authorization code.")
    return
  }

  setStatus("Finalizing connection…")

  const response = await chrome.runtime.sendMessage({
    type: "exchangeAuthCode",
    code,
    state,
    redirectUri,
  })

  if (!response?.ok) {
    setError(response?.error || "Unable to connect.")
    return
  }

  setStatus("Connected! You can close this tab.")
}

exchangeCode().catch(() => {
  setError("Unexpected error during authorization.")
})
