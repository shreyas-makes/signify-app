import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface KeystrokeEvent {
  id: number
  event_type: 'keydown' | 'keyup'
  key_code: number
  character: string | null
  timestamp: number | string
  sequence_number: number
  cursor_position?: number
  cursorPosition?: number
  document_position?: number
}

interface KeystrokeReplayProps {
  keystrokes: KeystrokeEvent[]
  title: string
  finalContent: string
  className?: string
}

const toNumber = (value: number | string | null | undefined): number | null => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value
  }
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

const toNumericTimestamp = (value: number | string | null | undefined): number | null => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value
  }
  if (typeof value === "string") {
    const numeric = Number(value)
    if (!Number.isNaN(numeric)) {
      return numeric
    }
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

export function KeystrokeReplay({ keystrokes, title, finalContent, className }: KeystrokeReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayContent, setDisplayContent] = useState("")
  const [playbackSpeed, setPlaybackSpeed] = useState(2) // 2x speed by default
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const normalizeCharacter = useCallback((keystroke: KeystrokeEvent): string => {
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
      if (
        descriptiveChar === 'enter' ||
        descriptiveChar === 'return' ||
        descriptiveChar === 'newline'
      ) {
        return '\n'
      }
    }

    const keyCode = typeof keystroke.key_code === 'string' ? parseInt(keystroke.key_code, 10) : keystroke.key_code

    switch (keyCode) {
      case 13:
        return '\n'
      case 9:
        return '\t'
      case 32:
        return ' '
      default:
        return directChar.length === 1 ? directChar : ''
    }
  }, [])

  const playableKeystrokes = useMemo(() => {
    const sorted = [...keystrokes].sort((a, b) => a.sequence_number - b.sequence_number)
    const sanitized: KeystrokeEvent[] = []
    const lastAcceptedByKey = new Map<string, { timestamp: number | null, sequence: number }>()

    // Deduplicate noisy capture data that records the same keydown multiple times within the same instant
    for (const entry of sorted) {
      if (entry.event_type !== 'keydown') {
        continue
      }

      const normalizedKeyCode = toNumber(entry.key_code) ?? entry.key_code
      const normalizedEntry: KeystrokeEvent = {
        ...entry,
        key_code: normalizedKeyCode,
      }

      const normalizedCharacter = normalizeCharacter(normalizedEntry)
      const timestampValue = toNumericTimestamp(entry.timestamp)
      const keySignature = `${normalizedEntry.key_code}:${normalizedCharacter}`
      const lastAccepted = lastAcceptedByKey.get(keySignature)

      const hasSameTimestamp =
        normalizedCharacter &&
        lastAccepted &&
        timestampValue !== null &&
        lastAccepted.timestamp !== null &&
        timestampValue === lastAccepted.timestamp

      const sequenceGap = lastAccepted
        ? normalizedEntry.sequence_number - lastAccepted.sequence
        : Number.POSITIVE_INFINITY

      const shouldDeduplicate =
        Boolean(normalizedCharacter) &&
        Boolean(lastAccepted) &&
        hasSameTimestamp &&
        sequenceGap >= 0 &&
        sequenceGap <= 2

      if (shouldDeduplicate) {
        continue
      }

      sanitized.push(normalizedEntry)

      if (normalizedCharacter) {
        lastAcceptedByKey.set(keySignature, {
          timestamp: timestampValue,
          sequence: normalizedEntry.sequence_number,
        })
      } else {
        lastAcceptedByKey.delete(keySignature)
      }
    }

    return sanitized
  }, [keystrokes, normalizeCharacter])

  const totalKeystrokes = playableKeystrokes.length
  const finalWordCount = useMemo(() => {
    const trimmed = finalContent.trim()
    if (!trimmed) return 0
    return trimmed.split(/\s+/).length
  }, [finalContent])
  const keysPerWord = finalWordCount > 0 ? Math.round(totalKeystrokes / finalWordCount) : totalKeystrokes

  const hasValidCursorData = useMemo(() => {
    // Check if keystroke data has meaningful cursor positioning
    // If most keystrokes have position 0, likely test/legacy data
    const positions = playableKeystrokes.map(k => k.cursor_position ?? k.cursorPosition ?? k.document_position ?? 0)
    const nonZeroPositions = positions.filter(p => p > 0).length
    return nonZeroPositions > positions.length * 0.1 // At least 10% should have non-zero positions
  }, [playableKeystrokes])

  const findCursorPosition = useCallback((keystroke: KeystrokeEvent, contentLength: number) => {
    const rawPosition =
      keystroke.cursor_position ??
      keystroke.cursorPosition ??
      keystroke.document_position

    if (typeof rawPosition !== "number" || Number.isNaN(rawPosition)) {
      return contentLength // Append by default
    }

    // If we don't have valid cursor data, use append-only behavior for text construction
    if (!hasValidCursorData) {
      return contentLength
    }

    return Math.max(0, Math.min(rawPosition, contentLength))
  }, [hasValidCursorData])

  const applyKeystroke = useCallback((content: string, keystroke: KeystrokeEvent) => {
    const position = findCursorPosition(keystroke, content.length)

    if (keystroke.key_code === 8 || keystroke.character === "\b") {
      // Backspace removes the character before the cursor
      if (position === 0) return content
      const removeIndex = position > 0 ? position - 1 : 0
      return content.slice(0, removeIndex) + content.slice(removeIndex + 1)
    }

    if (keystroke.key_code === 46 || keystroke.character === "\x7f") {
      // Delete removes the character at the cursor
      return content.slice(0, position) + content.slice(position + 1)
    }

    const normalizedCharacter = normalizeCharacter(keystroke)
    if (!normalizedCharacter) {
      return content
    }

    return content.slice(0, position) + normalizedCharacter + content.slice(position)
  }, [findCursorPosition, normalizeCharacter])

  const productiveKeystrokes = useMemo(() => {
    if (playableKeystrokes.length === 0) return 0

    let content = ""
    let productive = 0
    // Treat efficiency as share of keystrokes that actually expanded the document

    for (const keystroke of playableKeystrokes) {
      const nextContent = applyKeystroke(content, keystroke)

      if (nextContent.length > content.length) {
        productive++
      }

      content = nextContent
    }

    return productive
  }, [applyKeystroke, playableKeystrokes])

  const efficiency = totalKeystrokes > 0
    ? Math.min(Math.floor((productiveKeystrokes / totalKeystrokes) * 100), 99)
    : 0

  const rebuildContent = useCallback((limit: number) => {
    let content = ""
    for (let i = 0; i < limit && i < playableKeystrokes.length; i++) {
      content = applyKeystroke(content, playableKeystrokes[i])
    }
    return content
  }, [applyKeystroke, playableKeystrokes])

  useEffect(() => {
    if (isPlaying && currentIndex < totalKeystrokes) {
      const keystroke = playableKeystrokes[currentIndex]
      const baseDelay = 100 // Base delay between keystrokes in ms
      const delay = baseDelay / playbackSpeed

      intervalRef.current = setTimeout(() => {
        setDisplayContent(prev => applyKeystroke(prev, keystroke))
        setCurrentIndex(prev => prev + 1)
      }, delay)
    } else if (currentIndex >= totalKeystrokes) {
      setIsPlaying(false)
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [applyKeystroke, isPlaying, currentIndex, playableKeystrokes, playbackSpeed, totalKeystrokes])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentIndex(0)
    setDisplayContent("")
  }

  const handleSkipForward = () => {
    const newIndex = Math.min(currentIndex + 10, totalKeystrokes)
    setCurrentIndex(newIndex)
    setDisplayContent(rebuildContent(newIndex))
  }

  const handleSkipBack = () => {
    const newIndex = Math.max(currentIndex - 10, 0)
    setCurrentIndex(newIndex)
    setDisplayContent(rebuildContent(newIndex))
  }

  const getProgress = () => {
    return totalKeystrokes > 0 ? (currentIndex / totalKeystrokes) * 100 : 0
  }

  const formatTime = (index: number) => {
    if (totalKeystrokes === 0 || index === 0) return "0:00"

    const clampedIndex = Math.min(index, totalKeystrokes - 1)
    const firstTimestamp = Number(playableKeystrokes[0]?.timestamp ?? 0)
    const currentTimestamp = Number(playableKeystrokes[clampedIndex]?.timestamp ?? 0)
    const elapsedMs = Math.max(0, currentTimestamp - firstTimestamp)
    const seconds = Math.floor(elapsedMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Auto-scroll to bottom as content grows
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [displayContent])

  if (totalKeystrokes === 0) {
    return (
      <Card className={cn("shadow-sm ring-1 ring-border/40", className)}>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No keystroke data available for replay</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("shadow-sm ring-1 ring-border/40 ", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Live Keystroke Replay
            </CardTitle>
            <p className="text-sm text-muted-foreground">Rebuilding &ldquo;{title}&rdquo; keystroke-by-keystroke</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{currentIndex.toLocaleString()} / {totalKeystrokes.toLocaleString()} keys</span>
            <span>{formatTime(currentIndex)} elapsed</span>
            <span>{playbackSpeed}× speed</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
            <span>Replay Progress</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-300 ease-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkipBack}
            disabled={currentIndex === 0}
            className="bg-muted text-foreground hover:bg-muted/80"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            disabled={currentIndex >= totalKeystrokes}
            className={cn(
              "bg-muted text-foreground hover:bg-muted/80",
              isPlaying && "ring-1 ring-foreground"
            )}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkipForward}
            disabled={currentIndex >= totalKeystrokes}
            className="bg-muted text-foreground hover:bg-muted/80"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-background text-foreground hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Speed:</span>
          {[0.5, 1, 2, 4, 8].map(speed => (
            <Button
              key={speed}
              variant="outline"
              size="sm"
              onClick={() => setPlaybackSpeed(speed)}
              className={cn(
                "text-xs px-2 bg-background text-foreground hover:bg-muted",
                playbackSpeed === speed && "bg-muted text-foreground font-medium"
              )}
            >
              {speed}x
            </Button>
          ))}
        </div>

        <Separator />

        {/* Content Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Real-time Content</h4>
            <span className="text-xs text-muted-foreground">
              {displayContent.length} characters
            </span>
          </div>
          <div 
            ref={contentRef}
            className="rounded-lg border border-border bg-white p-4 font-mono text-sm shadow-sm whitespace-pre-wrap min-h-[220px] max-h-[320px] overflow-y-auto"
          >
            {displayContent || <span className="text-muted-foreground italic">Start playback to see content...</span>}
            {isPlaying && <span className="animate-pulse">|</span>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 text-center sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted p-3">
            <p className="text-sm font-semibold text-foreground">
              {totalKeystrokes.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Keystrokes</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-3">
            <p className="text-sm font-semibold text-foreground">
              {finalContent.length.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Final Characters</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-3">
            <p className="text-sm font-semibold text-foreground">
              {efficiency}%
            </p>
            <p className="text-xs text-muted-foreground">Efficiency</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-3">
            <p className="text-sm font-semibold text-foreground">
              {keysPerWord.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Keys/Word</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
