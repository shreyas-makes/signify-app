import { useEffect, useMemo, useRef, useState } from 'react'

import type { Keystroke } from '@/types'

interface BarcodeData {
  bars: number[]
  maxIntensity: number
  totalBars: number
  timeUnit: string
  intervalMs: number
  startTime: number
}

// Barcode calculation logic for keystroke visualization
function calculateBarcodeData(
  keystrokes: Keystroke[], 
  containerWidth: number
): BarcodeData {
  if (keystrokes.length === 0) {
    return { 
      bars: [], 
      maxIntensity: 1, 
      totalBars: 60,
      timeUnit: 'second',
      intervalMs: 1000,
      startTime: Date.now()
    };
  }
  
  // Sort keystrokes by timestamp (convert ISO strings to milliseconds)
  const sortedKeystrokes = [...keystrokes].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const startTime = new Date(sortedKeystrokes[0].timestamp).getTime()
  const endTime = new Date(sortedKeystrokes[sortedKeystrokes.length - 1].timestamp).getTime()
  const totalDuration = endTime - startTime
  
  // Calculate optimal number of bars for barcode appearance (60-120 bars)
  const minBarWidth = 2 // Minimum bar width in pixels
  const barSpacing = 1 // Space between bars
  const maxBars = Math.floor(containerWidth / (minBarWidth + barSpacing))
  const targetBars = Math.max(60, Math.min(120, maxBars))
  
  // Calculate time interval per bar
  let intervalMs = Math.max(500, Math.ceil(totalDuration / targetBars)) // At least 500ms intervals
  
  // Adjust interval to create meaningful time units
  let timeUnit: string
  if (intervalMs < 2000) { // < 2 seconds
    intervalMs = Math.max(500, Math.ceil(intervalMs / 500) * 500) // Round to nearest 500ms
    timeUnit = intervalMs === 1000 ? 'second' : `${intervalMs}ms`
  } else if (intervalMs < 10000) { // < 10 seconds
    intervalMs = Math.ceil(intervalMs / 1000) * 1000 // Round to nearest second
    timeUnit = intervalMs === 1000 ? 'second' : `${intervalMs/1000}sec`
  } else if (intervalMs < 60000) { // < 1 minute  
    intervalMs = Math.ceil(intervalMs / 5000) * 5000 // Round to nearest 5 seconds
    timeUnit = `${intervalMs/1000}sec`
  } else { // >= 1 minute
    intervalMs = Math.ceil(intervalMs / 15000) * 15000 // Round to nearest 15 seconds
    timeUnit = `${intervalMs/1000}sec`
  }
  
  // Calculate actual number of bars based on interval
  const actualTotalBars = Math.ceil(totalDuration / intervalMs)
  const finalBars = Math.min(actualTotalBars, targetBars)
  
  // Create intensity array for bars
  const intensityBars = Array.from({ length: finalBars }, () => 0)
  
  // Group keystrokes into time intervals
  for (const ks of sortedKeystrokes) {
    const keystrokeTime = new Date(ks.timestamp).getTime()
    const intervalsSinceStart = Math.floor((keystrokeTime - startTime) / intervalMs)
    const barIndex = Math.min(intervalsSinceStart, finalBars - 1)
    
    if (barIndex >= 0 && barIndex < finalBars) {
      intensityBars[barIndex]++
    }
  }

  return {
    bars: intensityBars,
    maxIntensity: intensityBars.length > 0 ? Math.max(1, ...intensityBars) : 1,
    totalBars: finalBars,
    timeUnit,
    intervalMs,
    startTime,
  }
}

interface MiniGitGraphProps {
  keystrokes: Keystroke[]
  width?: number
  height?: number
  className?: string
}

export function MiniGitGraph({ 
  keystrokes, 
  width = 320,
  height = 160,
  className = ""
}: MiniGitGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(width)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const element = containerRef.current
    if (!element) {
      return
    }

    const updateWidth = (nextWidth: number) => {
      const normalizedWidth = Math.max(1, Math.floor(nextWidth || width))
      setContainerWidth((prev) => (Math.abs(prev - normalizedWidth) > 1 ? normalizedWidth : prev))
    }

    updateWidth(element.clientWidth)

    if ('ResizeObserver' in window && typeof window.ResizeObserver === 'function') {
      const observer = new window.ResizeObserver((entries) => {
        for (const entry of entries) {
          updateWidth(entry.contentRect.width)
        }
      })

      observer.observe(element)
      return () => observer.disconnect()
    }

    const handleResize = () => updateWidth(element.clientWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [width])

  const resolvedWidth = containerWidth

  const { bars, maxIntensity } = useMemo<BarcodeData>(() => {
    return calculateBarcodeData(keystrokes, resolvedWidth)
  }, [keystrokes, resolvedWidth])

  const getBarcodeColor = (intensity: number) => {
    if (intensity === 0) return '#ffffff' // White for no activity
    
    // High contrast black/gray scheme for barcode appearance
    const ratio = Math.log(intensity + 1) / Math.log(maxIntensity + 1)
    if (ratio > 0.7) return '#000000'      // Black for high intensity
    if (ratio > 0.4) return '#333333'      // Dark gray for medium-high
    if (ratio > 0.2) return '#666666'      // Medium gray for medium
    return '#999999'                       // Light gray for low intensity
  }

  const getBarWidth = (intensity: number) => {
    if (intensity === 0) return 1 // Minimum width for empty periods
    
    // Variable width based on intensity (2-8px range)
    const ratio = Math.log(intensity + 1) / Math.log(maxIntensity + 1)
    return Math.max(2, Math.min(8, Math.ceil(2 + (ratio * 6))))
  }

  // Calculate barcode dimensions
  const barSpacing = 1
  const barHeight = height - 16 // Leave margins top/bottom
  const barY = 8 // Top margin
  
  // Calculate total width needed and scale if necessary
  const totalWidthNeeded = bars.reduce((acc, intensity) => acc + getBarWidth(intensity) + barSpacing, 0)
  const scaleX = totalWidthNeeded > resolvedWidth ? resolvedWidth / totalWidthNeeded : 1

  return (
    <div ref={containerRef} className={`block w-full ${className}`}>
      {keystrokes.length === 0 ? (
        <div 
          className="flex h-full w-full items-center justify-center rounded border border-border/20 bg-muted/30 text-xs text-muted-foreground"
          style={{ minHeight: height }}
        >
          No data
        </div>
      ) : (
        <svg 
          width="100%" 
          height={height}
          viewBox={`0 0 ${resolvedWidth} ${height}`}
          preserveAspectRatio="none"
          className="block w-full rounded border border-border/20"
          style={{ background: '#fafafa' }} // Light background for contrast
        >
          {/* Barcode bars */}
          {(() => {
            let currentX = 0
            return bars.map((intensity, index) => {
              const barWidth = getBarWidth(intensity) * scaleX
              const x = currentX
              currentX += barWidth + (barSpacing * scaleX)
              
              return (
                <rect
                  key={index}
                  x={x}
                  y={barY}
                  width={Math.max(0.5, barWidth - (barSpacing * scaleX))} // Ensure minimum visibility
                  height={barHeight}
                  fill={getBarcodeColor(intensity)}
                  rx={0} // Sharp corners for barcode appearance
                />
              )
            })
          })()}
        </svg>
      )}
    </div>
  )
}
