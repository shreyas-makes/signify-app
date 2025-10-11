import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Keystroke } from '@/types'

// Shared heatmap calculation logic (DRY principle)
function calculateHeatmapGrid(
  keystrokes: Keystroke[], 
  containerWidth: number, 
  isMini: boolean = false
) {
  if (keystrokes.length === 0) {
    return { 
      bins: [], 
      maxIntensity: 1, 
      colsPerRow: isMini ? 20 : 40, 
      numRows: isMini ? 2 : 4, 
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
  
  // Calculate optimal grid to fill the available space
  const minCellSize = isMini ? 6 : 8 // Smaller minimum for mini view
  const targetCols = Math.floor(containerWidth / minCellSize)
  const targetRows = isMini ? 4 : 6 // Responsive rows for both mini and main
  const totalCells = targetCols * targetRows
  
  // Calculate interval that will distribute keystrokes across all cells
  let intervalMs = Math.max(1000, Math.ceil(totalDuration / totalCells)) // At least 1 second intervals
  
  // Adjust interval to create meaningful time units
  let timeUnit: string
  if (intervalMs < 5000) { // < 5 seconds
    intervalMs = Math.max(1000, Math.ceil(intervalMs / 1000) * 1000) // Round to nearest second
    timeUnit = 'second'
  } else if (intervalMs < 60000) { // < 1 minute  
    intervalMs = Math.ceil(intervalMs / 5000) * 5000 // Round to nearest 5 seconds
    timeUnit = intervalMs === 5000 ? '5sec' : `${intervalMs/1000}sec`
  } else if (intervalMs < 300000) { // < 5 minutes
    intervalMs = Math.ceil(intervalMs / 15000) * 15000 // Round to nearest 15 seconds
    timeUnit = `${intervalMs/1000}sec`
  } else { // >= 5 minutes
    intervalMs = Math.ceil(intervalMs / 60000) * 60000 // Round to nearest minute
    timeUnit = intervalMs === 60000 ? 'minute' : `${intervalMs/60000}min`
  }
  
  // Recalculate grid based on actual interval
  const actualTotalIntervals = Math.ceil(totalDuration / intervalMs)
  const colsPerRow = Math.min(targetCols, Math.max(isMini ? 10 : 20, actualTotalIntervals))
  const numRows = Math.max(1, Math.ceil(actualTotalIntervals / colsPerRow))
  const totalBins = colsPerRow * numRows
  
  // Create bins for the calculated grid
  const intensityBins = new Array(totalBins).fill(0)
  
  // Group keystrokes into time intervals
  for (const ks of sortedKeystrokes) {
    const keystrokeTime = new Date(ks.timestamp).getTime()
    const intervalsSinceStart = Math.floor((keystrokeTime - startTime) / intervalMs)
    const binIndex = Math.min(intervalsSinceStart, totalBins - 1)
    
    if (binIndex >= 0 && binIndex < totalBins) {
      intensityBins[binIndex]++
    }
  }

  return {
    bins: intensityBins,
    maxIntensity: Math.max(...intensityBins, 1),
    colsPerRow,
    numRows,
    timeUnit,
    intervalMs,
    startTime,
  }
}

export function GitCommitGraph({
  keystrokes,
  className = ""
}: {
  keystrokes: Keystroke[],
  className?: string
}) {
  if (keystrokes.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          No keystroke data available for visualization.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle>Writing Pattern Analysis</CardTitle>
        <CardDescription>A visual signature of the writing process.</CardDescription>
      </CardHeader>
      <HeatmapView keystrokes={keystrokes} />
    </Card>
  )
}

// --- Heatmap View Component --- //

function HeatmapView({ keystrokes }: { keystrokes: Keystroke[] }) {
  const [tooltip, setTooltip] = useState<{ visible: boolean, content: string, x: number, y: number } | null>(null)
  const [containerWidth, setContainerWidth] = useState(800)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect container width for responsive sizing
  useLayoutEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 32) // Account for padding
      }
    }
    
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const { bins, maxIntensity, colsPerRow, numRows, timeUnit, intervalMs, startTime } = useMemo(() => {
    return calculateHeatmapGrid(keystrokes, containerWidth, false) // Use shared logic for main component
  }, [keystrokes, containerWidth])

  const getHeatmapColor = (intensity: number) => {
    if (intensity === 0) return 'hsl(0 0% 98%)'; // Very light gray for empty cells
    
    // Use logarithmic scaling for better visual distribution
    const ratio = Math.log(intensity + 1) / Math.log(maxIntensity + 1)
    
    // Monochrome grayscale palette (lighter to darker)
    const lightness = Math.max(15, 95 - (ratio * 80)) // From 95% to 15% lightness
    return `hsl(0 0% ${lightness}%)`;
  }

  // Calculate responsive cell dimensions - make strips instead of squares
  const cellWidth = Math.floor(containerWidth / colsPerRow)
  const cellHeight = Math.max(120, Math.min(40, cellWidth * 2)) // Taller strips, 2x width ratio
  const svgHeight = cellHeight * numRows + 50 // More space for labels and padding
  const svgWidth = cellWidth * colsPerRow

  const handleMouseOver = (e: React.MouseEvent, index: number, intensity: number) => {
    const col = index % colsPerRow
    const row = Math.floor(index / colsPerRow)
    const timestamp = startTime + (index * intervalMs)
    const date = new Date(timestamp)
    
    let timeLabel: string
    if (timeUnit === 'minute') {
      timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (timeUnit === 'hour') {
      timeLabel = `${date.getHours()}:00`
    } else {
      timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' })
    }
    
    const rect = e.currentTarget.getBoundingClientRect()

    setTooltip({
      visible: true,
      content: `${intensity} keystrokes at ${timeLabel}`,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <CardContent className="p-4 sm:p-6 relative" ref={containerRef}>
      <div className="relative w-full pb-6">
        <svg 
          width="100%"
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="rounded-lg border border-border/50"
          preserveAspectRatio="none"
        >
          <g onMouseLeave={() => setTooltip(null)}>
            {/* Time labels on x-axis */}
            {Array.from({ length: colsPerRow }, (_, i) => {
              const x = (i * cellWidth) + (cellWidth / 2)
              const labelInterval = Math.max(1, Math.floor(colsPerRow / 10)) // Show ~10 labels max
              const shouldShowLabel = i % labelInterval === 0
              
              if (!shouldShowLabel) return null
              
              // Calculate actual time for this column
              const timeAtColumn = startTime + (i * intervalMs)
              const elapsed = timeAtColumn - startTime
              
              let label: string
              if (intervalMs < 60000) { // Less than 1 minute intervals
                const seconds = Math.floor(elapsed / 1000)
                label = `${seconds}s`
              } else { // Minute or larger intervals
                const minutes = Math.floor(elapsed / 60000)
                label = minutes === 0 ? '0m' : `${minutes}m`
              }
              
              return (
                <text
                  key={`time-${i}`}
                  x={x}
                  y={svgHeight - 8}
                  fontSize="9"
                  fill="hsl(var(--muted-foreground))"
                  textAnchor="middle"
                >
                  {label}
                </text>
              )
            })}
            
            {/* Row labels on y-axis */}
            {Array.from({ length: Math.min(numRows, 10) }, (_, i) => (
              <text
                key={`row-${i}`}
                x="-8"
                y={(i * cellHeight) + (cellHeight / 2) + 3}
                fontSize="9"
                fill="hsl(var(--muted-foreground))"
                textAnchor="end"
              >
                {i}
              </text>
            ))}
            
            {/* Heatmap cells */}
            {bins.map((intensity, index) => {
              const col = index % colsPerRow
              const row = Math.floor(index / colsPerRow)
              const x = col * cellWidth
              const y = row * cellHeight
              return (
                <rect
                  key={index}
                  x={x}
                  y={y}
                  width={cellWidth}
                  height={cellHeight}
                  fill={getHeatmapColor(intensity)}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.25"
                  className="transition-all hover:opacity-80 hover:stroke-foreground cursor-pointer"
                  onMouseOver={(e) => handleMouseOver(e, index, intensity)}
                />
              )
            })}
          </g>
        </svg>
        {tooltip && tooltip.visible && (
          <div
            className="absolute z-10 bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 pointer-events-none shadow-lg border"
            style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
      <HeatmapLegend />
    </CardContent>
  )
}

function HeatmapLegend() {
  const legendColors = [
    'hsl(0 0% 98%)', // Very light gray (empty)
    'hsl(0 0% 80%)', // Light gray
    'hsl(0 0% 60%)', // Medium gray
    'hsl(0 0% 40%)', // Dark gray
    'hsl(0 0% 20%)', // Very dark gray
  ]

  return (
    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
      <span>Less</span>
      <div className="flex gap-px border border-border rounded">
        {legendColors.map((color, index) => (
          <div
            key={index}
            className="w-3 h-3 border-r border-border last:border-r-0"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span>More</span>
    </div>
  )
}
