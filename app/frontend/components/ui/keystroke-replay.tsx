import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface KeystrokeEvent {
  id: number
  event_type: 'keydown' | 'keyup'
  key_code: number
  character: string | null
  timestamp: string
  sequence_number: number
  document_position?: number
}

interface KeystrokeReplayProps {
  keystrokes: KeystrokeEvent[]
  title: string
  finalContent: string
  className?: string
}

export function KeystrokeReplay({ keystrokes, title, finalContent, className }: KeystrokeReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayContent, setDisplayContent] = useState("")
  const [playbackSpeed, setPlaybackSpeed] = useState(2) // 2x speed by default
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Filter and sort keystrokes for playback
  const playableKeystrokes = keystrokes
    .filter(k => k.event_type === 'keydown' && k.character)
    .sort((a, b) => a.sequence_number - b.sequence_number)

  const totalKeystrokes = playableKeystrokes.length

  useEffect(() => {
    if (isPlaying && currentIndex < totalKeystrokes) {
      const keystroke = playableKeystrokes[currentIndex]
      const baseDelay = 100 // Base delay between keystrokes in ms
      const delay = baseDelay / playbackSpeed

      intervalRef.current = setTimeout(() => {
        if (keystroke.character) {
          if (keystroke.key_code === 8) { // Backspace
            setDisplayContent(prev => prev.slice(0, -1))
          } else {
            setDisplayContent(prev => prev + keystroke.character)
          }
        }
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
  }, [isPlaying, currentIndex, playableKeystrokes, playbackSpeed, totalKeystrokes])

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
    // Rebuild content up to this point
    let content = ""
    for (let i = 0; i < newIndex && i < playableKeystrokes.length; i++) {
      const keystroke = playableKeystrokes[i]
      if (keystroke.character) {
        if (keystroke.key_code === 8) {
          content = content.slice(0, -1)
        } else {
          content += keystroke.character
        }
      }
    }
    setDisplayContent(content)
  }

  const handleSkipBack = () => {
    const newIndex = Math.max(currentIndex - 10, 0)
    setCurrentIndex(newIndex)
    // Rebuild content up to this point
    let content = ""
    for (let i = 0; i < newIndex && i < playableKeystrokes.length; i++) {
      const keystroke = playableKeystrokes[i]
      if (keystroke.character) {
        if (keystroke.key_code === 8) {
          content = content.slice(0, -1)
        } else {
          content += keystroke.character
        }
      }
    }
    setDisplayContent(content)
  }

  const getProgress = () => {
    return totalKeystrokes > 0 ? (currentIndex / totalKeystrokes) * 100 : 0
  }

  const formatTime = (index: number) => {
    const seconds = Math.floor(index * 0.1) // Approximate time based on keystroke rate
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
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No keystroke data available for replay</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Keystroke Replay: {title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{currentIndex} / {totalKeystrokes} keystrokes</span>
          <span>{formatTime(currentIndex)} elapsed</span>
          <span>{playbackSpeed}x speed</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkipBack}
            disabled={currentIndex === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            onClick={handlePlayPause}
            disabled={currentIndex >= totalKeystrokes}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkipForward}
            disabled={currentIndex >= totalKeystrokes}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Speed:</span>
          {[0.5, 1, 2, 4, 8].map(speed => (
            <Button
              key={speed}
              variant={playbackSpeed === speed ? "default" : "outline"}
              size="sm"
              onClick={() => setPlaybackSpeed(speed)}
              className="text-xs px-2"
            >
              {speed}x
            </Button>
          ))}
        </div>

        <Separator />

        {/* Content Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Real-time Content</h4>
            <span className="text-xs text-muted-foreground">
              {displayContent.length} characters
            </span>
          </div>
          <div 
            ref={contentRef}
            className="border rounded-lg p-4 bg-muted/30 min-h-[200px] max-h-[300px] overflow-y-auto font-mono text-sm whitespace-pre-wrap"
          >
            {displayContent || <span className="text-muted-foreground italic">Start playback to see content...</span>}
            {isPlaying && <span className="animate-pulse">|</span>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm font-medium">{totalKeystrokes}</p>
            <p className="text-xs text-muted-foreground">Total Keystrokes</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{finalContent.length}</p>
            <p className="text-xs text-muted-foreground">Final Characters</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {totalKeystrokes > 0 ? Math.round((finalContent.length / totalKeystrokes) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Efficiency</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {Math.round(totalKeystrokes / Math.max(finalContent.split(' ').length, 1))}
            </p>
            <p className="text-xs text-muted-foreground">Keys/Word</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}