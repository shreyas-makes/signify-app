import { useMemo } from 'react'

import { processKeystrokesToGitGraph } from '@/lib/keystroke-to-git'
import type { GitCommit, GitBranch, Keystroke } from '@/types'

interface MiniGitGraphProps {
  keystrokes: Keystroke[]
  width?: number
  height?: number
  className?: string
}

export function MiniGitGraph({ 
  keystrokes, 
  width = 160, // Increased for better prominence
  height = 50,  // Increased for better visual impact
  className = ""
}: MiniGitGraphProps) {
  // Generate enhanced mini pattern for visual prominence
  const enhanceMiniPattern = (
    originalCommits: GitCommit[], 
    _originalBranches: GitBranch[], 
    w: number, 
    h: number
  ): { commits: GitCommit[]; branches: GitBranch[] } => {
    let commits = [...originalCommits]
    
    // If we have too few commits for visual impact, generate synthetic pattern
    if (commits.length < 5) {
      const padding = 12
      const availableWidth = w - (padding * 2)
      const availableHeight = h - 16
      
      // Create 6-8 commits in artistic pattern regardless of input data
      const targetCommits = Math.max(6, Math.min(8, keystrokes.length > 50 ? 8 : 6))
      const enhancedCommits: GitCommit[] = []
      
      for (let i = 0; i < targetCommits; i++) {
        const progress = i / (targetCommits - 1)
        
        // Multi-lane positioning for visual interest
        const lane = Math.floor(Math.sin(i * 1.2) * 2) + 1 // 0-2 lanes
        const laneHeight = availableHeight / 3
        
        // Calculate positions with artistic variation
        let x = padding + (progress * availableWidth)
        let y = padding + (lane * laneHeight) + Math.sin(i * 0.8) * 6
        
        // Add organic curves and flow
        x += Math.sin(progress * Math.PI * 1.5) * 8
        y += Math.cos(progress * Math.PI * 2) * 4
        
        // Ensure bounds
        x = Math.max(padding, Math.min(w - padding, x))
        y = Math.max(padding, Math.min(h - 8, y))
        
        // Determine commit type based on pattern for visual variety
        let type: GitCommit['type'] = 'typing'
        if (i === 0) type = 'milestone'
        else if (i === targetCommits - 1) type = 'milestone' 
        else if (i % 3 === 2) type = 'pause'
        else if (i % 4 === 1) type = 'correction'
        
        // Calculate intensity for visual variety
        const intensity = 0.8 + Math.sin(i * 1.1) * 0.6 + Math.random() * 0.3
        
        enhancedCommits.push({
          id: `mini-${i}`,
          timestamp: Date.now() + (i * 1000),
          type,
          keystrokes: Math.floor(5 + Math.random() * 15),
          duration: 500 + Math.random() * 1000,
          position: { x, y },
          branches: [],
          intensity: Math.max(0.5, Math.min(2.5, intensity))
        })
      }
      
      commits = enhancedCommits
    } else {
      // Enhance existing commits for better mini display
      commits = commits.map(commit => ({
        ...commit,
        intensity: Math.max(1.2, commit.intensity), // Boost for visibility
        position: {
          x: Math.max(8, Math.min(w - 8, commit.position.x)),
          y: Math.max(8, Math.min(h - 8, commit.position.y))
        }
      }))
    }
    
    // Generate enhanced branches
    const branches: GitBranch[] = []
    for (let i = 0; i < commits.length - 1; i++) {
      const current = commits[i]
      const next = commits[i + 1]
      
      let branchType: GitBranch['type'] = 'main'
      if (current.type === 'correction' || next.type === 'correction') {
        branchType = 'correction'
      } else if (current.type === 'milestone' || next.type === 'milestone') {
        branchType = 'merge'
      }
      
      branches.push({
        id: `mini-branch-${i}`,
        fromCommit: current.id,
        toCommit: next.id,
        type: branchType,
        intensity: (current.intensity + next.intensity) / 2
      })
    }
    
    return { commits, branches }
  }

  // Enhanced processing for mini graph with guaranteed visual prominence
  const { commits, branches } = useMemo(() => {
    const processed = processKeystrokesToGitGraph(keystrokes, { 
      maxCommits: 8, // Optimal for mini display
      pauseThreshold: 300, // Even more sensitive for mini graphs
      width, 
      height 
    })
    
    // Ensure minimum visual complexity for prominence
    return enhanceMiniPattern(processed.commits, processed.branches, width, height)
  }, [keystrokes, width, height])

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'typing':
        return '#22c55e'
      case 'pause':
        return '#fbbf24'
      case 'correction':
        return '#ef4444'
      case 'milestone':
        return '#3b82f6'
      default:
        return '#9ca3af'
    }
  }

  const getBranchColor = (type: string) => {
    switch (type) {
      case 'main':
        return '#22c55e'
      case 'correction':
        return '#ef4444'
      case 'merge':
        return '#3b82f6'
      default:
        return '#9ca3af'
    }
  }

  const generateSimplePath = (fromX: number, fromY: number, toX: number, toY: number) => {
    const deltaX = toX - fromX
    const controlX1 = fromX + deltaX * 0.3
    const controlX2 = toX - deltaX * 0.3
    
    return `M ${fromX} ${fromY} C ${controlX1} ${fromY} ${controlX2} ${toY} ${toX} ${toY}`
  }

  if (commits.length === 0) {
    return (
      <div 
        className={`inline-flex items-center justify-center text-xs text-gray-400 ${className}`}
        style={{ width, height }}
      >
        No data
      </div>
    )
  }

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={width} 
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block rounded-md overflow-hidden"
      >
        {/* Enhanced mini background */}
        <defs>
          <linearGradient id="miniBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.9"/>
          </linearGradient>
        </defs>
        
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#miniBg)"
          rx="4"
        />
        
        {/* Enhanced branches with improved prominence */}
        {branches.map(branch => {
          const fromCommit = commits.find(c => c.id === branch.fromCommit)
          const toCommit = commits.find(c => c.id === branch.toCommit)
          
          if (!fromCommit || !toCommit) return null
          
          const strokeWidth = Math.max(1.8, branch.intensity * 2) // Increased thickness
          
          return (
            <g key={branch.id}>
              {/* Branch shadow for depth */}
              <path
                d={generateSimplePath(
                  fromCommit.position.x + 0.5,
                  fromCommit.position.y + 0.5,
                  toCommit.position.x + 0.5,
                  toCommit.position.y + 0.5
                )}
                stroke="rgba(0, 0, 0, 0.15)"
                strokeWidth={strokeWidth + 0.5}
                fill="none"
                strokeLinecap="round"
              />
              {/* Main branch line */}
              <path
                d={generateSimplePath(
                  fromCommit.position.x,
                  fromCommit.position.y,
                  toCommit.position.x,
                  toCommit.position.y
                )}
                stroke={getBranchColor(branch.type)}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={0.9}
                strokeLinecap="round"
              />
            </g>
          )
        })}
        
        {/* Enhanced commit nodes with improved prominence */}
        {commits.map(commit => {
          const nodeSize = Math.max(3, Math.min(6, commit.intensity * 2.5)) // Increased minimum size
          const glowRadius = nodeSize + 2
          
          return (
            <g key={commit.id}>
              {/* Outer glow for prominence */}
              <circle
                cx={commit.position.x}
                cy={commit.position.y}
                r={glowRadius}
                fill={getNodeColor(commit.type)}
                opacity={0.2}
              />
              {/* Shadow for depth */}
              <circle
                cx={commit.position.x + 0.8}
                cy={commit.position.y + 0.8}
                r={nodeSize}
                fill="rgba(0, 0, 0, 0.2)"
              />
              {/* Main node with enhanced styling */}
              <circle
                cx={commit.position.x}
                cy={commit.position.y}
                r={nodeSize}
                fill={getNodeColor(commit.type)}
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth={1.2}
              />
              {/* Inner highlight for high-intensity commits */}
              {commit.intensity > 1.5 && (
                <circle
                  cx={commit.position.x}
                  cy={commit.position.y}
                  r={nodeSize * 0.4}
                  fill="rgba(255, 255, 255, 0.7)"
                />
              )}
            </g>
          )
        })}
        
        {/* Enhanced timeline with gradient */}
        <defs>
          <linearGradient id="miniTimeline" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.6"/>
            <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.6"/>
          </linearGradient>
        </defs>
        <line
          x1={8}
          y1={height - 6}
          x2={width - 8}
          y2={height - 6}
          stroke="url(#miniTimeline)"
          strokeWidth={1.5}
          opacity={0.7}
        />
      </svg>
    </div>
  )
}