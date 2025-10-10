import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface UsePastePreventionOptions {
  enabled?: boolean
  onPasteAttempt?: (event: Event) => void
  detectRapidInput?: boolean
  rapidInputThreshold?: number // words per minute threshold
}

interface PasteAttemptData {
  timestamp: number
  eventType: string
  keyCode?: string
  detail?: string
}

export function usePastePrevention(options: UsePastePreventionOptions = {}) {
  const {
    enabled = true,
    onPasteAttempt,
    detectRapidInput = true,
    rapidInputThreshold = 200 // 200 WPM is very fast typing
  } = options

  const attachedElements = useRef<Set<HTMLElement>>(new Set())
  const pasteAttempts = useRef<PasteAttemptData[]>([])
  const typingStats = useRef({
    lastInputTime: 0,
    inputCount: 0,
    windowStart: 0
  })

  const logPasteAttempt = useCallback((eventType: string, detail?: string, keyCode?: string) => {
    const attempt: PasteAttemptData = {
      timestamp: Date.now(),
      eventType,
      keyCode,
      detail
    }
    
    pasteAttempts.current.push(attempt)
    
    // Keep only last 50 attempts to prevent memory issues
    if (pasteAttempts.current.length > 50) {
      pasteAttempts.current = pasteAttempts.current.slice(-50)
    }

    console.warn('Paste attempt blocked:', attempt)
    
    if (onPasteAttempt) {
      const syntheticEvent = new CustomEvent('paste-attempt', { detail: attempt })
      onPasteAttempt(syntheticEvent)
    }
  }, [onPasteAttempt])

  const showPasteBlockedMessage = useCallback((method: string) => {
    toast.error('Paste blocked to ensure authenticity', {
      description: `${method} pasting is disabled. Please type your content manually to verify human authorship.`,
      duration: 4000
    })
  }, [])

  const detectSuspiciousInput = useCallback((inputLength: number) => {
    const now = Date.now()
    const stats = typingStats.current

    // Reset window if more than 1 minute has passed
    if (now - stats.windowStart > 60000) {
      stats.windowStart = now
      stats.inputCount = 0
    }

    stats.inputCount += inputLength
    stats.lastInputTime = now

    // Calculate WPM (assuming 5 characters per word)
    const timeElapsed = (now - stats.windowStart) / 1000 / 60 // minutes
    const wordsTyped = stats.inputCount / 5
    const wpm = timeElapsed > 0 ? wordsTyped / timeElapsed : 0

    if (wpm > rapidInputThreshold && timeElapsed > 0.1) { // At least 6 seconds of typing
      logPasteAttempt('suspicious-rapid-input', `${Math.round(wpm)} WPM detected`)
      toast.warning('Unusually fast input detected', {
        description: 'Please maintain natural typing speed to ensure authenticity.',
        duration: 3000
      })
    }
  }, [rapidInputThreshold, logPasteAttempt])

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    const { key, ctrlKey, metaKey, shiftKey, code } = event
    
    // Detect paste shortcuts
    if ((ctrlKey || metaKey) && key.toLowerCase() === 'v') {
      event.preventDefault()
      event.stopPropagation()
      logPasteAttempt('keyboard-shortcut', 'Ctrl/Cmd+V', code)
      showPasteBlockedMessage('Keyboard shortcut')
      return false
    }

    // Detect other potentially dangerous shortcuts
    if ((ctrlKey || metaKey) && (key.toLowerCase() === 'a' && shiftKey)) {
      // Ctrl+Shift+A might be used for paste in some contexts
      event.preventDefault()
      event.stopPropagation()
      logPasteAttempt('keyboard-shortcut', 'Ctrl/Cmd+Shift+A', code)
      showPasteBlockedMessage('Keyboard shortcut')
      return false
    }
  }, [enabled, logPasteAttempt, showPasteBlockedMessage])

  // Paste event handler
  const handlePaste = useCallback((event: ClipboardEvent) => {
    if (!enabled) return

    event.preventDefault()
    event.stopPropagation()
    logPasteAttempt('paste-event', 'Direct paste event')
    showPasteBlockedMessage('Direct')
    return false
  }, [enabled, logPasteAttempt, showPasteBlockedMessage])

  // Context menu handler
  const handleContextMenu = useCallback(() => {
    if (!enabled) return

    // Allow context menu but log it for monitoring
    logPasteAttempt('context-menu', 'Right-click context menu opened')
  }, [enabled, logPasteAttempt])

  // Drag and drop handlers
  const handleDragOver = useCallback((event: DragEvent) => {
    if (!enabled) return
    
    event.preventDefault()
    event.stopPropagation()
  }, [enabled])

  const handleDrop = useCallback((event: DragEvent) => {
    if (!enabled) return

    event.preventDefault()
    event.stopPropagation()
    logPasteAttempt('drag-drop', 'File/text drop attempt')
    showPasteBlockedMessage('Drag and drop')
    return false
  }, [enabled, logPasteAttempt, showPasteBlockedMessage])

  // Input event handler for rapid input detection
  const handleInput = useCallback((event: Event) => {
    if (!enabled || !detectRapidInput) return

    const target = event.target as HTMLTextAreaElement | HTMLInputElement
    if (target && 'value' in target) {
      const currentLength = target.value.length
      const previousLength = target.dataset.previousLength ? parseInt(target.dataset.previousLength, 10) : 0
      const inputLength = Math.abs(currentLength - previousLength)
      
      if (inputLength > 10) { // Significant input change
        detectSuspiciousInput(inputLength)
      }
      
      target.dataset.previousLength = currentLength.toString()
    }
  }, [enabled, detectRapidInput, detectSuspiciousInput])

  // Mouse event handler for middle-click paste
  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (!enabled) return

    // Middle mouse button (wheel click) - common paste method on Linux
    if (event.button === 1) {
      event.preventDefault()
      event.stopPropagation()
      logPasteAttempt('middle-click', 'Middle mouse button paste attempt')
      showPasteBlockedMessage('Middle-click')
      return false
    }
  }, [enabled, logPasteAttempt, showPasteBlockedMessage])

  // Attach event listeners to an element
  const attachToElement = useCallback((element: HTMLElement) => {
    if (!element || attachedElements.current.has(element)) return

    attachedElements.current.add(element)

    // Add all event listeners
    element.addEventListener('keydown', handleKeyDown, { capture: true })
    element.addEventListener('paste', handlePaste, { capture: true })
    element.addEventListener('contextmenu', handleContextMenu)
    element.addEventListener('dragover', handleDragOver, { capture: true })
    element.addEventListener('drop', handleDrop, { capture: true })
    element.addEventListener('input', handleInput)
    element.addEventListener('mouseup', handleMouseUp, { capture: true })

    // Disable autocomplete and similar features
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.setAttribute('autocomplete', 'off')
      element.setAttribute('spellcheck', 'false')
      element.setAttribute('autocorrect', 'off')
      element.setAttribute('autocapitalize', 'off')
    }

    console.log('Paste prevention attached to element:', element.tagName)
  }, [handleKeyDown, handlePaste, handleContextMenu, handleDragOver, handleDrop, handleInput, handleMouseUp])

  // Detach event listeners from an element
  const detachFromElement = useCallback((element: HTMLElement) => {
    if (!element || !attachedElements.current.has(element)) return

    attachedElements.current.delete(element)

    element.removeEventListener('keydown', handleKeyDown, { capture: true })
    element.removeEventListener('paste', handlePaste, { capture: true })
    element.removeEventListener('contextmenu', handleContextMenu)
    element.removeEventListener('dragover', handleDragOver, { capture: true })
    element.removeEventListener('drop', handleDrop, { capture: true })
    element.removeEventListener('input', handleInput)
    element.removeEventListener('mouseup', handleMouseUp, { capture: true })

    console.log('Paste prevention detached from element:', element.tagName)
  }, [handleKeyDown, handlePaste, handleContextMenu, handleDragOver, handleDrop, handleInput, handleMouseUp])

  // Global paste prevention (catches attempts outside the editor)
  useEffect(() => {
    if (!enabled) return

    const globalKeyHandler = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event
      if ((ctrlKey || metaKey) && key.toLowerCase() === 'v') {
        // Only prevent if focus is on our attached elements
        const activeElement = document.activeElement as HTMLElement
        if (activeElement && attachedElements.current.has(activeElement)) {
          event.preventDefault()
          event.stopPropagation()
          logPasteAttempt('global-keyboard-shortcut', 'Global Ctrl/Cmd+V')
          showPasteBlockedMessage('Keyboard shortcut')
        }
      }
    }

    const globalPasteHandler = (event: ClipboardEvent) => {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && attachedElements.current.has(activeElement)) {
        event.preventDefault()
        event.stopPropagation()
        logPasteAttempt('global-paste-event', 'Global paste event')
        showPasteBlockedMessage('Global paste')
      }
    }

    document.addEventListener('keydown', globalKeyHandler, { capture: true })
    document.addEventListener('paste', globalPasteHandler, { capture: true })

    return () => {
      document.removeEventListener('keydown', globalKeyHandler, { capture: true })
      document.removeEventListener('paste', globalPasteHandler, { capture: true })
    }
  }, [enabled, logPasteAttempt, showPasteBlockedMessage])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      attachedElements.current.forEach(element => {
        detachFromElement(element)
      })
      attachedElements.current.clear()
    }
  }, [detachFromElement])

  // Get paste attempt logs
  const getPasteAttempts = useCallback(() => {
    return [...pasteAttempts.current]
  }, [])

  // Clear paste attempt logs
  const clearPasteAttempts = useCallback(() => {
    pasteAttempts.current = []
  }, [])

  return {
    attachToElement,
    detachFromElement,
    getPasteAttempts,
    clearPasteAttempts,
    pasteAttemptCount: pasteAttempts.current.length
  }
}