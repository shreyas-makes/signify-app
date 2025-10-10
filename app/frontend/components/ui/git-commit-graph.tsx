import { useMemo, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GitBranch } from '@/components/ui/git-branch'
import { GitNode } from '@/components/ui/git-node'
import { processKeystrokesToGitGraph } from '@/lib/keystroke-to-git'
import type { GitCommit, Keystroke } from '@/types'

interface GitCommitGraphProps {
  keystrokes: Keystroke[]
  width?: number
  height?: number
  interactive?: boolean
  showStats?: boolean
  className?: string
}

interface CommitTooltip {
  commit: GitCommit
  visible: boolean
  x: number
  y: number
}

export function GitCommitGraph({ 
  keystrokes, 
  width = 800, 
  height = 250,
  interactive = true,
  showStats = true,
  className = ""
}: GitCommitGraphProps) {
  const [activeCommit, setActiveCommit] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<CommitTooltip | null>(null)

  // Responsive adjustments based on width
  const isCompact = width < 600
  const maxCommits = isCompact ? 25 : 50
  const nodeSize = isCompact ? 12 : 16

  // Process keystrokes into git graph
  const { commits, branches } = useMemo(() => {
    return processKeystrokesToGitGraph(keystrokes, { 
      maxCommits, 
      width, 
      height 
    })
  }, [keystrokes, width, height, maxCommits])

  const stats = useMemo(() => {
    if (commits.length === 0) return null
    
    const typingCommits = commits.filter(c => c.type === 'typing').length
    const correctionCommits = commits.filter(c => c.type === 'correction').length
    const pauseCommits = commits.filter(c => c.type === 'pause').length
    const milestoneCommits = commits.filter(c => c.type === 'milestone').length
    
    return {
      total: commits.length,
      typing: typingCommits,
      corrections: correctionCommits,
      pauses: pauseCommits,
      milestones: milestoneCommits
    }
  }, [commits])

  const handleCommitClick = (commit: GitCommit) => {
    if (!interactive) return
    setActiveCommit(activeCommit === commit.id ? null : commit.id)
  }

  const handleCommitHover = (commit: GitCommit | null, event?: React.MouseEvent) => {
    if (!interactive || !commit || !event) {
      setTooltip(null)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      commit,
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    })
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(1)}s`
  }

  if (commits.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-gray-500">
          No keystroke data available for visualization
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {showStats && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Git-Style Commit Graph</span>
            {stats && (
              <div className="flex items-center gap-4 text-sm font-normal">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  {stats.typing} typing
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  {stats.corrections} corrections
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  {stats.pauses} pauses
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  {stats.milestones} milestones
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-4 relative">
        <div className="relative overflow-visible">
          <svg 
            width={width} 
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="border rounded-lg"
            onMouseLeave={() => setTooltip(null)}
            style={{ overflow: 'visible' }}
          >
            {/* Enhanced artistic background with gradients and patterns */}
            <defs>
              {/* Artistic grid pattern */}
              <pattern id="artisticGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="#e5e7eb" opacity="0.3"/>
                <path d="M 0 30 L 60 30 M 30 0 L 30 60" stroke="#f3f4f6" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
              
              {/* Radial gradient for depth */}
              <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#fafafa" stopOpacity="1"/>
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="1"/>
              </radialGradient>
              
              {/* Activity-based color zones */}
              <linearGradient id="activityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.6"/>
                <stop offset="50%" stopColor="#f0f9ff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fefce8" stopOpacity="0.6"/>
              </linearGradient>
              
              {/* Timeline gradient */}
              <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#64748b" stopOpacity="1"/>
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.8"/>
              </linearGradient>
            </defs>
            
            {/* Multi-layered artistic background */}
            <rect width="100%" height="100%" fill="url(#backgroundGradient)" />
            <rect width="100%" height="100%" fill="url(#activityGradient)" />
            <rect width="100%" height="100%" fill="url(#artisticGrid)" />
            
            {/* Render branches first (behind nodes) */}
            {branches.map(branch => (
              <GitBranch
                key={branch.id}
                branch={branch}
                commits={commits}
                isActive={activeCommit === branch.fromCommit || activeCommit === branch.toCommit}
              />
            ))}
            
            {/* Render commit nodes */}
            {commits.map(commit => (
              <GitNode
                key={commit.id}
                commit={commit}
                size={nodeSize}
                isActive={activeCommit === commit.id}
                onClick={handleCommitClick}
                onHover={handleCommitHover}
              />
            ))}
            
            {/* Enhanced timeline axis with artistic styling */}
            <line
              x1={30}
              y1={height - 25}
              x2={width - 30}
              y2={height - 25}
              stroke="url(#timelineGradient)"
              strokeWidth={2}
              opacity={0.6}
            />
            
            
            {/* Enhanced time markers with better sizing */}
            {commits.length > 1 && (
              <>
                <g>
                  <circle cx={40} cy={height - 25} r="2" fill="#64748b" opacity="0.6"/>
                  <text
                    x={40}
                    y={height - 8}
                    fontSize="8"
                    fill="#475569"
                    textAnchor="start"
                    fontWeight="500"
                  >
                    Start: {formatTimestamp(commits[0].timestamp)}
                  </text>
                </g>
                <g>
                  <circle cx={width - 40} cy={height - 25} r="2" fill="#64748b" opacity="0.6"/>
                  <text
                    x={width - 40}
                    y={height - 8}
                    fontSize="8"
                    fill="#475569"
                    textAnchor="end"
                    fontWeight="500"
                  >
                    End: {formatTimestamp(commits[commits.length - 1].timestamp)}
                  </text>
                </g>
              </>
            )}
          </svg>
          
          {/* Tooltip */}
          {tooltip && tooltip.visible && (
            <div
              className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none max-w-xs"
              style={{
                left: Math.min(tooltip.x + 10, width - 200),
                top: Math.max(tooltip.y - 10, 0),
                transform: tooltip.y > 100 ? 'translateY(-100%)' : 'translateY(10px)'
              }}
            >
              <div className="font-semibold capitalize">{tooltip.commit.type} Session</div>
              <div>Keystrokes: {tooltip.commit.keystrokes}</div>
              <div>Duration: {formatDuration(tooltip.commit.duration)}</div>
              <div>Intensity: {tooltip.commit.intensity.toFixed(1)}</div>
              <div>Time: {formatTimestamp(tooltip.commit.timestamp)}</div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-4 text-xs text-gray-600">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Active typing sessions
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              Correction bursts
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              Thinking pauses
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Writing milestones
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}