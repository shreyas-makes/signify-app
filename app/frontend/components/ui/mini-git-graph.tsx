import { router } from '@inertiajs/react'
import type { KeyboardEvent } from 'react'
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
  keystrokeUrl?: string
  ariaLabel?: string
  label?: string
  ctaText?: string
  graphClassName?: string
}

export function MiniGitGraph({ 
  keystrokes, 
  width = 320,
  height = 160,
  className = "",
  keystrokeUrl,
  ariaLabel,
  label = 'Keystroke activity',
  ctaText = 'View details ↗',
  graphClassName = '',
}: MiniGitGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(width)
  const isInteractive = Boolean(keystrokeUrl)

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

  const navigateToKeystrokes = () => {
    if (!keystrokeUrl) {
      return
    }

    router.visit(keystrokeUrl)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigateToKeystrokes()
    }
  }

  const getBarcodeColor = (intensity: number, index: number) => {
    if (intensity === 0) return '#ffffff' // White for no activity
    
    // Create more visual variance by combining intensity with positional variation
    const baseRatio = Math.log(intensity + 1) / Math.log(maxIntensity + 1)
    
    // Add subtle positional variance to create more interesting patterns
    const positionVariance = (index % 7) * 0.15 // Cycle through 7 different variance levels
    const adjustedRatio = Math.min(1, baseRatio + positionVariance * (1 - baseRatio))
    
    // More granular color steps for better variance
    if (adjustedRatio > 0.85) return '#000000'      // Pure black
    if (adjustedRatio > 0.7) return '#1a1a1a'       // Very dark gray
    if (adjustedRatio > 0.55) return '#333333'      // Dark gray
    if (adjustedRatio > 0.4) return '#4d4d4d'       // Medium-dark gray
    if (adjustedRatio > 0.25) return '#666666'      // Medium gray
    if (adjustedRatio > 0.15) return '#808080'      // Medium-light gray
    if (adjustedRatio > 0.05) return '#999999'      // Light gray
    return '#b3b3b3'                                // Very light gray
  }

  const getBarWidth = (intensity: number) => {
    if (intensity === 0) return 1 // Minimum width for empty periods
    
    // Variable width based on intensity (2-8px range)
    const ratio = Math.log(intensity + 1) / Math.log(maxIntensity + 1)
    return Math.max(2, Math.min(8, Math.ceil(2 + (ratio * 6))))
  }

  // Calculate barcode dimensions
  const barSpacing = 1
  const topPadding = 6
  const bottomPadding = 6
  const barHeight = Math.max(0, height - (topPadding + bottomPadding))
  const barY = topPadding // Top margin
  
  // Calculate total width needed and scale if necessary
  const totalWidthNeeded = bars.reduce((acc, intensity) => acc + getBarWidth(intensity) + barSpacing, 0)
  const scaleX = totalWidthNeeded > resolvedWidth ? resolvedWidth / totalWidthNeeded : 1
  
  // For shorter content, add horizontal centering and gentle spacing expansion
  const isShortContent = totalWidthNeeded < resolvedWidth * 0.6 && bars.length > 0
  const spacingMultiplier = isShortContent ? Math.min(2.5, resolvedWidth / totalWidthNeeded) : 1
  const expandedWidth = totalWidthNeeded * spacingMultiplier
  const leftOffset = isShortContent ? Math.max(0, (resolvedWidth - expandedWidth) / 2) : 0

  return (
    <div
      ref={containerRef}
      className={[
        'group relative w-full transition',
        isInteractive && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        className,
      ].filter(Boolean).join(' ')}
      onClick={navigateToKeystrokes}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel}
    >
      <div className="flex items-center justify-between text-[0.5rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground/60">
        <span>{label}</span>
        {isInteractive && ctaText ? (
          <span className="opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
            {ctaText}
          </span>
        ) : null}
      </div>

      <div
        className={[
          'mt-2 w-full overflow-hidden rounded-xl border border-[#eadfce] bg-white',
          graphClassName,
        ].filter(Boolean).join(' ')}
        style={{ height }}
      >
        {keystrokes.length === 0 ? (
          <div 
            className="flex h-full w-full items-center justify-center text-[0.65rem] text-muted-foreground/80"
          >
            No data
          </div>
        ) : (
          <svg 
            width="100%" 
            height="100%"
            viewBox={`0 0 ${resolvedWidth} ${height}`}
            preserveAspectRatio="none"
            className="block w-full"
          >
            {/* Barcode bars */}
            {(() => {
              let currentX = leftOffset
              return bars.map((intensity, index) => {
                const barWidth = getBarWidth(intensity) * scaleX
                const adjustedSpacing = (barSpacing * scaleX * spacingMultiplier)
                const x = currentX
                currentX += barWidth + adjustedSpacing
                
                return (
                  <rect
                    key={index}
                    x={x}
                    y={barY}
                    width={Math.max(0.5, barWidth)} // Ensure minimum visibility
                    height={barHeight}
                    fill={getBarcodeColor(intensity, index)}
                    rx={0} // Sharp corners for barcode appearance
                  />
                )
              })
            })()}
          </svg>
        )}
      </div>
    </div>
  )
}
