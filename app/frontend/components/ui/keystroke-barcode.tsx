import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Keystroke } from "@/types"

import { MiniGitGraph } from "./mini-git-graph"

interface KeystrokeBarcodeProps {
  keystrokes: Keystroke[]
  keystrokeUrl?: string
  className?: string
}

// Simple barcode calculation for minimal view
function calculateMinimalBarcode(keystrokes: Keystroke[], maxBars = 40) {
  if (keystrokes.length === 0) {
    return { bars: [], maxIntensity: 1 }
  }

  const sorted = [...keystrokes].sort((a, b) => a.timestamp - b.timestamp)
  const startTime = sorted[0].timestamp
  const endTime = sorted[sorted.length - 1].timestamp
  const totalDuration = endTime - startTime

  const intervalMs = Math.max(1000, totalDuration / maxBars)
  const bars = new Array(maxBars).fill(0)

  for (const keystroke of sorted) {
    const intervalIndex = Math.floor((keystroke.timestamp - startTime) / intervalMs)
    const barIndex = Math.min(intervalIndex, maxBars - 1)
    if (barIndex >= 0) {
      bars[barIndex]++
    }
  }

  return {
    bars,
    maxIntensity: Math.max(...bars, 1)
  }
}


function EnhancedBarcode({ keystrokes }: { keystrokes: Keystroke[] }) {
  const { bars, maxIntensity } = calculateMinimalBarcode(keystrokes, 120) // More bars for wider space
  
  if (keystrokes.length === 0) {
    return (
      <div className="flex h-8 items-center justify-center rounded border border-border/20 bg-muted/10 text-sm text-muted-foreground">
        No keystroke data available
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-green-600">
        <span className="font-medium">{keystrokes.length.toLocaleString()} verified keystrokes</span>
        <span className="text-green-500">Human-authored content</span>
      </div>
      <div className="flex h-8 items-center gap-0.5 rounded border border-green-300/30 bg-white/60 px-3 py-1">
        {bars.map((intensity, index) => {
          const height = intensity === 0 ? 2 : Math.max(2, Math.min(24, (intensity / maxIntensity) * 24))
          const opacity = intensity === 0 ? 0.1 : Math.max(0.4, Math.min(1, intensity / maxIntensity))
          
          return (
            <div
              key={index}
              className="w-0.5 bg-green-700"
              style={{
                height: `${height}px`,
                opacity
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

function IntermediateStats({ keystrokes }: { keystrokes: Keystroke[] }) {
  if (keystrokes.length === 0) return null

  const sorted = [...keystrokes].sort((a, b) => a.timestamp - b.timestamp)
  const totalDuration = sorted[sorted.length - 1].timestamp - sorted[0].timestamp
  const backspaceCount = keystrokes.filter(k => k.key_code === 8).length
  const correctionRatio = backspaceCount / keystrokes.length

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  const stats = [
    { label: "Keystrokes", value: keystrokes.length.toLocaleString() },
    { label: "Duration", value: formatDuration(totalDuration) },
    { label: "Corrections", value: `${Math.round(correctionRatio * 100)}%` },
    { label: "Avg WPM", value: Math.round((keystrokes.length / 5) / (totalDuration / 60000)) }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-lg font-semibold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-muted/30 p-4">
        <div className="mb-2 text-sm font-medium text-foreground">Writing Pattern</div>
        <MiniGitGraph keystrokes={keystrokes} height={80} />
      </div>
    </div>
  )
}

export function KeystrokeBarcode({ keystrokes, keystrokeUrl, className = "" }: KeystrokeBarcodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`not-prose ${className}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 px-6 py-4">
          <div className="flex-1">
            <EnhancedBarcode keystrokes={keystrokes} />
          </div>
          
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-3 text-green-600 hover:bg-green-100 hover:text-green-700"
              >
                {isExpanded ? (
                  <>
                    <ChevronDown className="mr-1 h-3 w-3" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronRight className="mr-1 h-3 w-3" />
                    View Pattern
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            
            {keystrokeUrl && (
              <Button 
                asChild
                variant="ghost" 
                size="sm"
                className="h-8 px-3 text-green-600 hover:bg-green-100 hover:text-green-700"
              >
                <a href={keystrokeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Full Timeline
                </a>
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent>
          <Card className="mt-3 border-green-200">
            <CardContent className="p-4">
              <IntermediateStats keystrokes={keystrokes} />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}