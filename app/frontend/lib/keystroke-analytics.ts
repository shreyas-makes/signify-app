import type { Keystroke, TimelineEvent, TypingStatistics } from '@/types'

export function calculateTypingStatistics(
  keystrokes: Keystroke[],
  wordCount = 0
): TypingStatistics {
  if (keystrokes.length === 0) {
    return {
      total_keystrokes: 0,
      average_wpm: 0,
      total_time_seconds: 0,
      pause_count: 0,
      backspace_count: 0,
      correction_count: 0
    }
  }

  const firstTimestamp = keystrokes[0].timestamp
  const lastTimestamp = keystrokes[keystrokes.length - 1].timestamp
  const totalTimeMs = lastTimestamp - firstTimestamp
  const totalTimeSeconds = totalTimeMs / 1000

  const backspaceCount = keystrokes.filter(k => k.key_code === 8).length
  const correctionCount = keystrokes.filter(k => k.event_type === 'keydown' && k.key_code === 8).length

  let pauseCount = 0
  for (let i = 1; i < keystrokes.length; i++) {
    const timeDiff = keystrokes[i].timestamp - keystrokes[i - 1].timestamp
    if (timeDiff > 2000) {
      pauseCount++
    }
  }

  const averageWpm = totalTimeSeconds > 0 && wordCount > 0
    ? (wordCount / totalTimeSeconds) * 60
    : 0

  return {
    total_keystrokes: keystrokes.length,
    average_wpm: Math.round(averageWpm),
    total_time_seconds: Math.round(totalTimeSeconds),
    pause_count: pauseCount,
    backspace_count: backspaceCount,
    correction_count: correctionCount
  }
}

export function buildTimelineEvents(keystrokes: Keystroke[], limit = 500): TimelineEvent[] {
  const events: TimelineEvent[] = []
  let currentEvent: TimelineEvent | null = null
  const sampleKeystrokes = keystrokes.slice(0, limit)

  for (let i = 0; i < sampleKeystrokes.length; i++) {
    const keystroke = sampleKeystrokes[i]
    const nextKeystroke = sampleKeystrokes[i + 1]

    if (keystroke.event_type === 'keydown') {
      if (keystroke.key_code === 8) {
        events.push({
          timestamp: keystroke.timestamp,
          type: 'correction'
        })
      } else {
        if (!currentEvent || currentEvent.type !== 'typing') {
          currentEvent = {
            timestamp: keystroke.timestamp,
            type: 'typing',
            keystrokes: 1
          }
          events.push(currentEvent)
        } else {
          currentEvent.keystrokes = (currentEvent.keystrokes ?? 0) + 1
        }
      }

      if (nextKeystroke) {
        const timeDiff = nextKeystroke.timestamp - keystroke.timestamp
        if (timeDiff > 2000) {
          events.push({
            timestamp: keystroke.timestamp + 100,
            type: 'pause',
            duration: timeDiff
          })
          currentEvent = null
        }
      }
    }
  }

  return events
}

export function rebuildContentFromKeystrokes(keystrokes: Keystroke[]): string {
  const sorted = [...keystrokes].sort((a, b) => a.sequence_number - b.sequence_number)
  let content = ""

  for (const keystroke of sorted) {
    if (keystroke.event_type !== 'keydown') continue

    const position = typeof keystroke.cursor_position === 'number'
      ? Math.max(0, Math.min(keystroke.cursor_position, content.length))
      : content.length

    if (keystroke.key_code === 8) {
      if (position === 0) continue
      const removeIndex = position > 0 ? position - 1 : 0
      content = content.slice(0, removeIndex) + content.slice(removeIndex + 1)
      continue
    }

    if (keystroke.key_code === 46) {
      content = content.slice(0, position) + content.slice(position + 1)
      continue
    }

    const character = normalizeCharacter(keystroke)
    if (!character) continue

    content = content.slice(0, position) + character + content.slice(position)
  }

  return content
}

function normalizeCharacter(keystroke: Keystroke): string {
  const directChar = keystroke.character ?? ''
  if (directChar.length === 1) {
    if (directChar === '\r') return '\n'
    return directChar
  }

  const descriptiveChar = directChar.trim().toLowerCase()
  if (descriptiveChar) {
    if (descriptiveChar === 'space' || descriptiveChar === 'spacebar' || descriptiveChar === ' ') {
      return ' '
    }
    if (descriptiveChar === 'tab') {
      return '\t'
    }
    if (descriptiveChar === 'enter' || descriptiveChar === 'return' || descriptiveChar === 'newline') {
      return '\n'
    }
  }

  switch (keystroke.key_code) {
    case 13:
      return '\n'
    case 9:
      return '\t'
    case 32:
      return ' '
    default:
      return directChar.length === 1 ? directChar : ''
  }
}
