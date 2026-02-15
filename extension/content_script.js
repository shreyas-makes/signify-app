const TEXTBOX_SELECTOR = 'div[role="textbox"][data-testid^="tweetTextarea_"]'
const FALLBACK_SELECTOR = 'form [role="textbox"][contenteditable="true"]'
const UI_ID = "signify-extension-ui"
const BYLINE_PREFIX = "Proof of human authorship: "

const trackingState = {
  composer: null,
  hasTyped: false,
  startAt: null,
  keystrokes: [],
  pasteCount: 0,
  lastSequence: 0,
  lastPasteAt: 0,
  isSubmitting: false,
}

function isTweetComposer(element) {
  if (!element) return false
  return Boolean(
    element.closest('[data-testid="tweetComposer"]') ||
      element.closest('form[data-testid="tweetForm"]')
  )
}

function findComposer() {
  const primary = Array.from(document.querySelectorAll(TEXTBOX_SELECTOR))
  const primaryEditable = primary.find((el) => el.isContentEditable && isTweetComposer(el))
  if (primaryEditable) return primaryEditable

  const fallback = document.querySelector(FALLBACK_SELECTOR)
  if (fallback && fallback.isContentEditable && isTweetComposer(fallback)) return fallback

  return null
}

function ensureUi(composer) {
  if (!composer || document.getElementById(UI_ID)) return

  const container = document.createElement("div")
  container.id = UI_ID
  container.style.marginTop = "8px"
  container.style.gap = "8px"
  container.style.alignItems = "center"
  container.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, sans-serif"
  container.style.fontSize = "12px"
  container.style.color = "#536471"
  container.style.display = "flex"
  container.style.display = "none"

  const button = document.createElement("button")
  button.type = "button"
  button.textContent = "Signify"
  button.style.background = "#0f1419"
  button.style.color = "#fff"
  button.style.border = "none"
  button.style.borderRadius = "999px"
  button.style.padding = "6px 14px"
  button.style.cursor = "pointer"
  button.style.fontSize = "12px"
  button.style.fontWeight = "600"
  button.style.display = "inline-flex"
  button.style.alignItems = "center"
  button.style.gap = "6px"

  const status = document.createElement("span")
  status.textContent = "Signify active in this box only"
  status.title =
    "We collect only: content hash, typing timing, paste count, total keystrokes, and draft duration."

  const feedback = document.createElement("span")
  feedback.style.color = "#b5473a"
  feedback.style.marginLeft = "8px"
  feedback.style.display = "none"

  button.addEventListener("click", async () => {
    if (trackingState.isSubmitting) return
    feedback.style.display = "none"
    const hasToken = await ensureAuthStatus()
    if (!hasToken) {
      feedback.textContent = "Connect the extension in the popup first."
      feedback.style.display = "inline"
      return
    }

    await submitVerification(composer, feedback)
  })

  container.appendChild(button)
  container.appendChild(status)
  container.appendChild(feedback)

  const parent = composer.parentElement
  if (parent) {
    parent.appendChild(container)
  }
}

function showUi() {
  const ui = document.getElementById(UI_ID)
  if (ui) ui.style.display = "flex"
}

function hideUi() {
  const ui = document.getElementById(UI_ID)
  if (ui) ui.style.display = "none"
}

function resetTracking() {
  trackingState.hasTyped = false
  trackingState.startAt = null
  trackingState.keystrokes = []
  trackingState.pasteCount = 0
  trackingState.lastSequence = 0
  trackingState.lastPasteAt = 0
  trackingState.isSubmitting = false
  hideUi()
}

function recordKeystroke(eventType, event) {
  if (!trackingState.startAt) trackingState.startAt = Date.now()

  trackingState.lastSequence += 1

  const textLength = trackingState.composer?.innerText?.length || 0
  const key = event?.key || ""
  const character = key.length === 1 ? key : ""

  trackingState.keystrokes.push({
    event_type: eventType,
    key_code: event?.code || key || "unknown",
    character,
    timestamp: Date.now(),
    sequence_number: trackingState.lastSequence,
    cursor_position: textLength,
  })
}

function handleKeydown(event) {
  if (!trackingState.composer || event.isComposing) return
  recordKeystroke("keydown", event)
  trackingState.hasTyped = true
  showUi()
}

function handleInput(event) {
  if (!trackingState.composer) return
  if (event?.inputType === "insertFromPaste") {
    const now = Date.now()
    if (now - trackingState.lastPasteAt > 250) {
      trackingState.pasteCount += 1
      recordKeystroke("paste", event)
      trackingState.lastPasteAt = now
    }
  }
  trackingState.hasTyped = true
  showUi()
}

function handlePaste(event) {
  if (!trackingState.composer) return
  trackingState.pasteCount += 1
  recordKeystroke("paste", event)
  trackingState.lastPasteAt = Date.now()
  trackingState.hasTyped = true
  showUi()
}

function attachListeners(composer) {
  if (!composer) return

  composer.addEventListener("keydown", handleKeydown)
  composer.addEventListener("input", handleInput)
  composer.addEventListener("paste", handlePaste)
  composer.addEventListener("blur", () => {
    if (!composer.innerText) resetTracking()
  })
}

function detachListeners(composer) {
  if (!composer) return
  composer.removeEventListener("keydown", handleKeydown)
  composer.removeEventListener("input", handleInput)
  composer.removeEventListener("paste", handlePaste)
}

async function ensureAuthStatus() {
  const response = await chrome.runtime.sendMessage({ type: "getSettings" })
  return Boolean(response?.settings?.apiToken)
}

async function sha256(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

function buildStats(startAt, endAt) {
  const durationMs = startAt && endAt ? Math.max(0, endAt - startAt) : 0
  return {
    total_keystrokes: trackingState.keystrokes.length,
    duration_ms: durationMs,
    paste_count: trackingState.pasteCount,
  }
}

async function submitVerification(composer, feedbackEl) {
  if (!composer) return
  const content = composer.innerText || ""

  if (!content.trim()) {
    feedbackEl.textContent = "Type something before verifying."
    feedbackEl.style.display = "inline"
    return
  }

  const existingByline = content.includes("signifywriting.com/p/")
  if (existingByline) {
    feedbackEl.textContent = "A Signify byline is already included."
    feedbackEl.style.display = "inline"
    return
  }

  trackingState.isSubmitting = true

  const startAt = trackingState.startAt || Date.now()
  const endAt = Date.now()
  const contentHash = await sha256(content)

  const payload = {
    verification: {
      platform: "twitter",
      content_hash: contentHash,
      keystroke_stats: buildStats(startAt, endAt),
      paste: {
        occurred: trackingState.pasteCount > 0,
        count: trackingState.pasteCount,
      },
      start_at: new Date(startAt).toISOString(),
      end_at: new Date(endAt).toISOString(),
      keystrokes: trackingState.keystrokes,
    },
  }

  const response = await chrome.runtime.sendMessage({
    type: "createVerification",
    payload,
  })

  trackingState.isSubmitting = false

  if (!response?.ok) {
    feedbackEl.textContent = response?.error || "Verification failed."
    feedbackEl.style.display = "inline"
    return
  }

  const publicUrl = response.data?.public_url
  if (!publicUrl) {
    feedbackEl.textContent = "Verification created, but no URL returned."
    feedbackEl.style.display = "inline"
    return
  }

  const byline = `${BYLINE_PREFIX}${publicUrl.replace(/^https?:\/\//, "")}`
  insertByline(composer, byline)
  resetTracking()
}

function insertByline(composer, byline) {
  const text = composer.innerText || ""
  const spacer = text.endsWith(" ") ? "" : " "
  composer.focus()
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(composer)
  range.collapse(false)
  if (selection) {
    selection.removeAllRanges()
    selection.addRange(range)
  }

  document.execCommand("insertText", false, `${spacer}${byline}`)
}

function refreshComposer() {
  const nextComposer = findComposer()

  if (nextComposer !== trackingState.composer) {
    detachListeners(trackingState.composer)
    trackingState.composer = nextComposer
    resetTracking()
    if (trackingState.composer) {
      attachListeners(trackingState.composer)
      ensureUi(trackingState.composer)
    }
  }
}

const observer = new MutationObserver(() => {
  refreshComposer()
})

observer.observe(document.body, { childList: true, subtree: true })
refreshComposer()
