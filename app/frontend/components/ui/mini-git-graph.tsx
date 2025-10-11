import { useMemo } from 'react'

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

interface MiniGitGraphProps {
  keystrokes: Keystroke[]
  width?: number
  height?: number
  className?: string
}

export function MiniGitGraph({ 
  keystrokes, 
  width = 320,
  height = 80,
  className = ""
}: MiniGitGraphProps) {
  const { bins, maxIntensity, colsPerRow, numRows } = useMemo(() => {
    return calculateHeatmapGrid(keystrokes, width, true) // Use shared logic with mini flag
  }, [keystrokes, width])

  const getHeatmapColor = (intensity: number) => {
    if (intensity === 0) return 'hsl(0 0% 96%)'
    
    const ratio = Math.log(intensity + 1) / Math.log(maxIntensity + 1)
    const lightness = Math.max(20, 85 - (ratio * 65))
    return `hsl(0 0% ${lightness}%)`
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

  // Calculate responsive cell dimensions - same as main heatmap with multiple rows
  const cellWidth = Math.floor(width / colsPerRow)
  const cellHeight = Math.max(12, Math.min(20, Math.floor((height - 12) / numRows))) // Responsive height based on rows
  const svgHeight = cellHeight * numRows + 12 // Account for margins
  const svgWidth = cellWidth * colsPerRow

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={width} 
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="block rounded-md border border-border/30"
      >
        {/* Heatmap cells - same logic as main component */}
        {bins.map((intensity, index) => {
          const col = index % colsPerRow
          const row = Math.floor(index / colsPerRow)
          const x = col * cellWidth
          const y = row * cellHeight + 6 // Top margin
          
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
            />
          )
        })}
      </svg>
    </div>
  )
}