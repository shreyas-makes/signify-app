import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Keystroke } from "@/types"

interface KeystrokeBarcodeProps {
  keystrokes: Keystroke[]
  keystrokeUrl?: string
  className?: string
}

// Enhanced barcode calculation for expanded view
function calculateEnhancedBarcode(keystrokes: Keystroke[], maxBars = 120) {
  if (keystrokes.length === 0) {
    return { bars: [], maxIntensity: 1, totalDuration: 0, startTime: 0 }
  }

  const sorted = [...keystrokes].sort((a, b) => a.timestamp - b.timestamp)
  const startTime = sorted[0].timestamp
  const endTime = sorted[sorted.length - 1].timestamp
  const totalDuration = endTime - startTime

  const intervalMs = Math.max(500, totalDuration / maxBars) // Smaller intervals for more detail
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
    maxIntensity: Math.max(...bars, 1),
    totalDuration,
    startTime
  }
}


function EnhancedBarcode({ keystrokes }: { keystrokes: Keystroke[] }) {
  const { bars, maxIntensity, totalDuration } = calculateEnhancedBarcode(keystrokes, 120)
  
  if (keystrokes.length === 0) {
    return (
      <div className="flex h-16 items-center justify-center rounded border border-border/20 bg-muted/10 text-sm text-muted-foreground">
        No keystroke data available
      </div>
    )
  }


  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-green-600">{keystrokes.length.toLocaleString()} verified keystrokes</span>
      </div>
      
      {/* Enhanced barcode visualization */}
      <div className="space-y-3">
        <div className="flex h-16 w-full items-center overflow-hidden rounded-lg border border-green-300/30 bg-white/60 px-3 py-2">
          <div className="flex h-full w-full items-center">
            {bars.map((intensity, index) => {
              const height = intensity === 0 ? 3 : Math.max(3, Math.min(48, (intensity / maxIntensity) * 48))
              const opacity = intensity === 0 ? 0.1 : Math.max(0.4, Math.min(1, intensity / maxIntensity))
              const barWidth = `${100 / bars.length}%` // Distribute evenly across full width
              
              return (
                <div
                  key={index}
                  className="bg-green-700 transition-all hover:bg-green-600"
                  style={{
                    height: `${height}px`,
                    opacity,
                    width: barWidth
                  }}
                  title={`${intensity} keystrokes in this interval`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}


export function KeystrokeBarcode({ keystrokes, keystrokeUrl, className = "" }: KeystrokeBarcodeProps) {
  return (
    <div className={`not-prose w-full ${className}`}>
      <div className="w-full overflow-hidden rounded-lg border border-green-200 bg-green-50">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
          <div className="min-w-0 flex-1">
            <EnhancedBarcode keystrokes={keystrokes} />
          </div>
          
          {keystrokeUrl && (
            <div className="flex flex-shrink-0 items-start">
              <Button 
                asChild
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-green-600 hover:bg-green-100 hover:text-green-700"
                title="View Full Timeline"
              >
                <a href={keystrokeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}