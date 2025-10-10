import { useCallback, useRef, useState } from 'react'

export interface KeystrokeEvent {
  eventType: 'keydown' | 'keyup'
  keyCode: number
  character: string | null
  timestamp: number
  sequenceNumber: number
  cursorPosition: number
}

interface UseKeystrokeCaptureOptions {
  onKeystroke?: (keystroke: KeystrokeEvent) => void
  enabled?: boolean
}

export function useKeystrokeCapture(options: UseKeystrokeCaptureOptions = {}) {
  const { onKeystroke, enabled = true } = options
  
  const [keystrokes, setKeystrokes] = useState<KeystrokeEvent[]>([])
  const sequenceRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const targetElementRef = useRef<HTMLElement | null>(null)

  const captureKeystroke = useCallback((event: KeyboardEvent, eventType: 'keydown' | 'keyup') => {
    if (!enabled) return

    // Initialize start time on first keystroke
    startTimeRef.current ??= Date.now()

    // Get cursor position if possible
    let cursorPosition = 0
    if (targetElementRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        cursorPosition = range.startOffset
      }
    }

    // Determine character value
    let character: string | null = null
    if (eventType === 'keydown') {
      if (event.key.length === 1) {
        // Printable character
        character = event.key
      } else if (event.key === 'Backspace') {
        character = '\b'
      } else if (event.key === 'Delete') {
        character = '\x7f'
      } else if (event.key === 'Enter') {
        character = '\n'
      } else if (event.key === 'Tab') {
        character = '\t'
      }
    }

    const keystroke: KeystrokeEvent = {
      eventType,
      keyCode: event.keyCode || event.which,
      character,
      timestamp: Date.now() - startTimeRef.current,
      sequenceNumber: sequenceRef.current++,
      cursorPosition
    }

    setKeystrokes(prev => [...prev, keystroke])
    console.log('Keystroke captured:', keystroke)
    onKeystroke?.(keystroke)
  }, [enabled, onKeystroke])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    captureKeystroke(event, 'keydown')
  }, [captureKeystroke])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    captureKeystroke(event, 'keyup')
  }, [captureKeystroke])

  const preventPaste = useCallback((event: ClipboardEvent) => {
    event.preventDefault()
    console.warn('Paste operation blocked to ensure keystroke verification')
    
    // You could show a user-friendly message here
    if (typeof window !== 'undefined') {
      alert('Pasting is not allowed in order to maintain keystroke verification integrity.')
    }
  }, [])

  const preventDrop = useCallback((event: DragEvent) => {
    event.preventDefault()
    console.warn('Drop operation blocked to ensure keystroke verification')
  }, [])

  const attachToElement = useCallback((element: HTMLElement | null) => {
    // Remove previous listeners
    if (targetElementRef.current) {
      targetElementRef.current.removeEventListener('keydown', handleKeyDown)
      targetElementRef.current.removeEventListener('keyup', handleKeyUp)
      targetElementRef.current.removeEventListener('paste', preventPaste)
      targetElementRef.current.removeEventListener('drop', preventDrop)
    }

    // Attach new listeners
    if (element && enabled) {
      console.log('Attaching keystroke listeners to element:', element.tagName)
      element.addEventListener('keydown', handleKeyDown)
      element.addEventListener('keyup', handleKeyUp)
      element.addEventListener('paste', preventPaste)
      element.addEventListener('drop', preventDrop)
      element.addEventListener('dragover', (e) => e.preventDefault())
      targetElementRef.current = element
    }
  }, [handleKeyDown, handleKeyUp, preventPaste, preventDrop, enabled])

  const clearKeystrokes = useCallback(() => {
    setKeystrokes([])
    sequenceRef.current = 0
    startTimeRef.current = null
  }, [])

  const getKeystrokesForTransmission = useCallback(() => {
    return keystrokes.map(keystroke => ({
      event_type: keystroke.eventType,
      key_code: keystroke.keyCode,
      character: keystroke.character,
      timestamp: keystroke.timestamp,
      sequence_number: keystroke.sequenceNumber,
      cursor_position: keystroke.cursorPosition
    }))
  }, [keystrokes])

  return {
    keystrokes,
    attachToElement,
    clearKeystrokes,
    getKeystrokesForTransmission,
    keystrokeCount: keystrokes.length
  }
}