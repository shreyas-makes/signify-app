import { useState } from 'react'

import type { GitCommit } from '@/types'

interface GitNodeProps {
  commit: GitCommit
  size?: number
  onClick?: (commit: GitCommit) => void
  onHover?: (commit: GitCommit | null, event?: React.MouseEvent) => void
  isActive?: boolean
}

export function GitNode({ 
  commit, 
  size = 12, 
  onClick, 
  onHover, 
  isActive = false 
}: GitNodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getNodeColor = () => {
    // Enhanced gradient colors based on intensity
    const intensityFactor = Math.min(1, commit.intensity / 2)
    
    switch (commit.type) {
      case 'typing': {
        // Green gradient from light to vibrant based on intensity
        const greenSat = 50 + (intensityFactor * 30)
        const greenLight = isActive ? 45 : 55 - (intensityFactor * 10)
        return `hsl(142, ${greenSat}%, ${greenLight}%)`
      }
      case 'pause': {
        // Amber gradient
        const amberSat = 70 + (intensityFactor * 20)
        const amberLight = isActive ? 50 : 60 - (intensityFactor * 10)
        return `hsl(45, ${amberSat}%, ${amberLight}%)`
      }
      case 'correction': {
        // Red gradient
        const redSat = 60 + (intensityFactor * 25)
        const redLight = isActive ? 45 : 55 - (intensityFactor * 10)
        return `hsl(0, ${redSat}%, ${redLight}%)`
      }
      case 'milestone': {
        // Blue gradient
        const blueSat = 65 + (intensityFactor * 25)
        const blueLight = isActive ? 40 : 50 - (intensityFactor * 10)
        return `hsl(217, ${blueSat}%, ${blueLight}%)`
      }
      default:
        return '#6b7280'
    }
  }

  const getNodeStroke = () => {
    if (isActive || isHovered) return '#ffffff'
    return 'rgba(255, 255, 255, 0.8)'
  }

  const getNodeRadius = () => {
    // Enhanced size calculation based on keystrokes and intensity
    const keystrokeMultiplier = Math.max(0.8, Math.min(2.5, Math.sqrt(commit.keystrokes) / 5))
    const intensityMultiplier = Math.max(0.7, Math.min(2, commit.intensity))
    const baseRadius = (size / 2) * keystrokeMultiplier * intensityMultiplier
    
    if (isActive || isHovered) {
      return baseRadius * 1.3
    }
    return baseRadius
  }

  const handleClick = () => {
    if (onClick) {
      onClick(commit)
    }
  }

  const handleMouseEnter = (event: React.MouseEvent) => {
    setIsHovered(true)
    if (onHover) {
      onHover(commit, event)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (onHover) {
      onHover(null)
    }
  }

  return (
    <g
      className="git-node cursor-pointer transition-all duration-300"
      transform={`translate(${commit.position.x}, ${commit.position.y})`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Enhanced outer glow with multiple rings */}
      {(isActive || isHovered) && (
        <>
          <circle
            r={getNodeRadius() + 8}
            fill={getNodeColor()}
            opacity={0.15}
            className="animate-pulse"
          />
          <circle
            r={getNodeRadius() + 4}
            fill={getNodeColor()}
            opacity={0.25}
            className="animate-pulse"
          />
        </>
      )}
      
      {/* Background shadow for depth */}
      <circle
        r={getNodeRadius()}
        fill="rgba(0, 0, 0, 0.1)"
        transform="translate(1, 1)"
      />
      
      {/* Main node circle with enhanced styling */}
      <circle
        r={getNodeRadius()}
        fill={getNodeColor()}
        stroke={getNodeStroke()}
        strokeWidth={commit.intensity > 1.5 ? 3 : 2}
        className="transition-all duration-300"
        style={{
          filter: isActive || isHovered 
            ? 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))' 
            : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        }}
      />
      
      {/* Inner intensity ring for high-activity commits */}
      {commit.intensity > 1.8 && (
        <circle
          r={getNodeRadius() * 0.6}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth={1}
          className="animate-pulse"
        />
      )}
      
      {/* Inner core for very high-intensity commits */}
      {commit.intensity > 2.2 && (
        <circle
          r={getNodeRadius() * 0.3}
          fill="rgba(255, 255, 255, 0.9)"
          className="animate-pulse"
        />
      )}
      
      {/* Special marker for milestone commits */}
      {commit.type === 'milestone' && (
        <circle
          r={getNodeRadius() * 0.4}
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth={1.5}
        />
      )}
    </g>
  )
}