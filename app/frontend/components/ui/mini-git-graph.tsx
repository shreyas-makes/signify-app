import { useMemo } from 'react'

import type { Keystroke } from '@/types'

// Barcode calculation logic for keystroke visualization
function calculateBarcodeData(
  keystrokes: Keystroke[], 
  containerWidth: number
) {
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
  const maxBarWidth = 8 // Maximum bar width in pixels
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
  const intensityBars = new Array(finalBars).fill(0)
  
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
    maxIntensity: Math.max(...intensityBars, 1),
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
  const { bars, maxIntensity, totalBars } = useMemo(() => {
    return calculateBarcodeData(keystrokes, width)
  }, [keystrokes, width])

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

  if (keystrokes.length === 0) {
    return (
      <div 
        className={`inline-flex items-center justify-center text-xs text-muted-foreground bg-muted/30 rounded ${className}`}
        style={{ width, height }}
      >
        No data
      </div>
    )
  }

  // Calculate barcode dimensions
  const barSpacing = 1
  const barHeight = height - 16 // Leave margins top/bottom
  const barY = 8 // Top margin
  
  // Calculate total width needed and scale if necessary
  const totalWidthNeeded = bars.reduce((acc, intensity) => acc + getBarWidth(intensity) + barSpacing, 0)
  const scaleX = totalWidthNeeded > width ? width / totalWidthNeeded : 1

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={width} 
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block rounded border border-border/20"
        style={{ background: '#fafafa' }} // Light background for contrast
      >
        {/* Barcode bars */}
        {bars.map((intensity, index) => {
          const barWidth = getBarWidth(intensity) * scaleX
          const x = bars.slice(0, index).reduce((acc, prevIntensity) => 
            acc + (getBarWidth(prevIntensity) * scaleX) + (barSpacing * scaleX), 0
          )
          
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
        })}
      </svg>
    </div>
  )
}