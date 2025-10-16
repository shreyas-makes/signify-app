import { type MouseEvent as ReactMouseEvent, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { GitBranch, GitCommit, Keystroke } from '@/types'

// Shared heatmap calculation logic (DRY principle)
function calculateHeatmapGrid(
  keystrokes: Keystroke[],
  containerWidth: number,
  isMini = false,
) {
  if (keystrokes.length === 0) {
    return {
      bins: [],
      maxIntensity: 1,
      colsPerRow: isMini ? 20 : 40,
      numRows: isMini ? 2 : 4,
      timeUnit: 'second',
      intervalMs: 1000,
      startTime: Date.now(),
    }
  }

  const sortedKeystrokes = [...keystrokes].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
  const startTime = new Date(sortedKeystrokes[0].timestamp).getTime()
  const endTime = new Date(sortedKeystrokes[sortedKeystrokes.length - 1].timestamp).getTime()
  const totalDuration = endTime - startTime

  const minCellSize = isMini ? 6 : 8
  const targetCols = Math.floor(containerWidth / minCellSize)
  const targetRows = isMini ? 3 : 5
  const totalCells = targetCols * targetRows

  let intervalMs = Math.max(1000, Math.ceil(totalDuration / totalCells))

  let timeUnit: string
  if (intervalMs < 5000) {
    intervalMs = Math.max(1000, Math.ceil(intervalMs / 1000) * 1000)
    timeUnit = 'second'
  } else if (intervalMs < 60000) {
    intervalMs = Math.ceil(intervalMs / 5000) * 5000
    timeUnit = intervalMs === 5000 ? '5sec' : `${intervalMs / 1000}sec`
  } else if (intervalMs < 300000) {
    intervalMs = Math.ceil(intervalMs / 15000) * 15000
    timeUnit = `${intervalMs / 1000}sec`
  } else {
    intervalMs = Math.ceil(intervalMs / 60000) * 60000
    timeUnit = intervalMs === 60000 ? 'minute' : `${intervalMs / 60000}min`
  }

  const actualTotalIntervals = Math.ceil(totalDuration / intervalMs)
  const colsPerRow = Math.min(targetCols, Math.max(isMini ? 10 : 20, actualTotalIntervals))
  const numRows = Math.max(1, Math.ceil(actualTotalIntervals / colsPerRow))
  const totalBins = colsPerRow * numRows

  const intensityBins: number[] = Array.from({ length: totalBins }, () => 0)

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
  width = 780,
  height = 280,
  interactive = true,
  showStats = true,
  className = '',
}: {
  keystrokes: Keystroke[]
  width?: number
  height?: number
  interactive?: boolean
  showStats?: boolean
  className?: string
}) {
  if (keystrokes.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle>Writing Pattern Analysis</CardTitle>
          <CardDescription>A visual signature of the writing process.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          No keystroke data available for visualization.
        </CardContent>
      </Card>
    )
  }

  const analysis = useMemo(
    () => analyzeKeystrokes(keystrokes, width, height),
    [keystrokes, width, height],
  )

  return (
    <Card className={className}>
      <CardHeader className="pb-4 space-y-1">
        <CardTitle>Writing Pattern Analysis</CardTitle>
        <CardDescription>{analysis.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-foreground">Keystroke Heatmap</span>
            <span className="text-xs text-muted-foreground">
              Intensity is normalized per time interval to highlight bursts.
            </span>
          </div>
          <HeatmapView keystrokes={analysis.sortedKeystrokes} />
        </section>
        {showStats && <StatsGrid analysis={analysis} />}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <TimelineGraph
            commits={analysis.commits}
            branches={analysis.branches}
            width={width}
            height={height}
            interactive={interactive}
          />
          <PatternInsights insights={analysis.insights} />
        </div>
      </CardContent>
    </Card>
  )
}

interface TypingSegment {
  index: number
  start: number
  end: number
  duration: number
  keystrokes: number
  backspaces: number
  correctionRatio: number
  intensity: number
}

interface WritingAnalysis {
  sortedKeystrokes: Keystroke[]
  totalKeystrokes: number
  totalDurationMs: number
  activeDurationMs: number
  pauseDurations: number[]
  longestPauseMs: number
  averageWpm: number
  averageKeystrokesPerMin: number
  backspaceCount: number
  correctionRatio: number
  segments: TypingSegment[]
  commits: GitCommit[]
  branches: GitBranch[]
  insights: string[]
  summary: string
}

function StatsGrid({ analysis }: { analysis: WritingAnalysis }) {
  const stats = [
    {
      label: 'Active Typing',
      value: formatDuration(analysis.activeDurationMs),
      descriptor: `${analysis.segments.length} burst${analysis.segments.length === 1 ? '' : 's'}`,
    },
    {
      label: 'Average Pace',
      value: `${Math.round(analysis.averageWpm)} wpm`,
      descriptor: `${Math.round(analysis.averageKeystrokesPerMin)} keys/min`,
    },
    {
      label: 'Backspace Ratio',
      value: `${Math.round(analysis.correctionRatio * 100)}%`,
      descriptor: `${analysis.backspaceCount} corrections`,
    },
    {
      label: 'Pause Count',
      value: `${analysis.pauseDurations.length}`,
      descriptor: analysis.pauseDurations.length
        ? `Longest ${formatDuration(analysis.longestPauseMs)}`
        : 'Minimal long pauses',
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-muted/40 p-4 transition-colors">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {stat.label}
          </p>
          <p className="text-lg font-semibold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.descriptor}</p>
        </div>
      ))}
    </div>
  )
}

function PatternInsights({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <p className="text-sm font-medium text-foreground">Session Notes</p>
      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
        {insights.map((insight, index) => (
          <div key={index} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineGraph({
  commits,
  branches,
  width,
  height,
  interactive,
}: {
  commits: GitCommit[]
  branches: GitBranch[]
  width: number
  height: number
  interactive: boolean
}) {
  const [activeCommit, setActiveCommit] = useState<GitCommit | null>(commits[0] ?? null)

  if (commits.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        Not enough keystrokes to render the timeline yet.
      </div>
    )
  }

  const safeHeight = Math.max(height, 220)
  const baselineY = safeHeight - 60

  const {
    correctionIntensityByCommit,
    pacePoints,
    pacePath,
    paceAreaPath,
    maxPace,
    pauseMarkers,
  } = useMemo(() => {
    const correctionMap = new Map<string, number>()
    for (const branch of branches) {
      if (branch.type !== 'correction') continue
      const existing = correctionMap.get(branch.toCommit) ?? 0
      correctionMap.set(branch.toCommit, Math.max(existing, branch.intensity))
    }

    const paceBase = Math.max(60, baselineY - 52)
    const paceAmplitude = Math.min(48, Math.max(24, baselineY * 0.18))
    const paceValues = commits.map((commit) => {
      const pace = commit.duration > 0 ? (commit.keystrokes / commit.duration) * 60000 : 0
      return { id: commit.id, x: commit.position.x, pace }
    })
    const maxPaceValue = paceValues.reduce((max, value) => Math.max(max, value.pace), 0)
    const pacePointsComputed = paceValues.map((value) => ({
      ...value,
      y:
        paceBase -
        (maxPaceValue > 0 ? (value.pace / maxPaceValue) * paceAmplitude : 0),
    }))
    const pacePathValue = pacePointsComputed.length
      ? pacePointsComputed
          .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
          .join(' ')
      : ''
    const paceAreaValue =
      pacePointsComputed.length > 1
        ? [
            `M ${pacePointsComputed[0].x} ${paceBase}`,
            ...pacePointsComputed.map((point) => `L ${point.x} ${point.y}`),
            `L ${pacePointsComputed[pacePointsComputed.length - 1].x} ${paceBase}`,
            'Z',
          ].join(' ')
        : ''

    const pauseMarkersList: {
      id: string
      x: number
      height: number
      radius: number
      pause: number
      fromId: string
      toId: string
      opacity: number
    }[] = []

    commits.forEach((commit, index) => {
      if (index === 0) return
      const prev = commits[index - 1]
      const prevEnd = prev.timestamp + prev.duration
      const pause = Math.max(0, commit.timestamp - prevEnd)
      if (pause <= 0) return
      const midX = (prev.position.x + commit.position.x) / 2
      const height = Math.min(36, 8 + Math.log1p(pause / 800) * 12)
      const radius = Math.min(6, 2.5 + pause / 4000)
      const opacity = Math.min(0.85, 0.35 + pause / 15000)
      pauseMarkersList.push({
        id: `pause-${prev.id}-${commit.id}`,
        x: midX,
        height,
        radius,
        pause,
        fromId: prev.id,
        toId: commit.id,
        opacity,
      })
    })

    return {
      correctionIntensityByCommit: correctionMap,
      pacePoints: pacePointsComputed,
      pacePath: pacePathValue,
      paceAreaPath: paceAreaValue,
      maxPace: maxPaceValue,
      pauseMarkers: pauseMarkersList,
    }
  }, [branches, commits, baselineY])

  const getCommitColor = (commit: GitCommit) => {
    if (commit.type === 'correction') return 'hsl(var(--destructive))'
    if (commit.type === 'milestone') return 'hsl(var(--secondary))'
    return 'hsl(var(--primary))'
  }

  const handleEnter = (commit: GitCommit) => {
    if (!interactive) return
    setActiveCommit(commit)
  }

  const handleLeave = () => {
    if (!interactive) return
    setActiveCommit(commits[0] ?? null)
  }

  const activeCommitIndex = activeCommit ? commits.findIndex((commit) => commit.id === activeCommit.id) : -1
  const previousCommit = activeCommitIndex > 0 ? commits[activeCommitIndex - 1] : null
  const pauseBeforeActive =
    activeCommit && previousCommit
      ? Math.max(0, activeCommit.timestamp - (previousCommit.timestamp + previousCommit.duration))
      : 0
  const activePace =
    activeCommit && activeCommit.duration > 0
      ? (activeCommit.keystrokes / activeCommit.duration) * 60000
      : 0
  const activeCorrectionRatio =
    activeCommit && correctionIntensityByCommit.has(activeCommit.id)
      ? correctionIntensityByCommit.get(activeCommit.id) ?? 0
      : activeCommit && activeCommit.type === 'correction'
        ? Math.min(0.36 + activeCommit.intensity * 0.4, 0.82)
        : 0
  const estimatedBackspaces =
    activeCommit && activeCorrectionRatio > 0
      ? Math.max(1, Math.round(activeCommit.keystrokes * activeCorrectionRatio))
      : 0

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          width="100%"
          height={safeHeight}
          viewBox={`0 0 ${width} ${safeHeight}`}
          className="w-full overflow-visible"
        >
          <line
            x1={0}
            x2={width}
            y1={baselineY}
            y2={baselineY}
            stroke="hsl(var(--border))"
            strokeDasharray="6 6"
          />

          {commits.slice(1).map((commit, index) => {
            const prev = commits[index]
            return (
              <line
                key={`${commit.id}-link`}
                x1={prev.position.x}
                y1={prev.position.y}
                x2={commit.position.x}
                y2={commit.position.y}
                stroke="hsl(var(--border))"
                strokeWidth={1.5}
              />
            )
          })}

          {branches.map((branch) => {
            const fromCommit = commits.find((commit) => commit.id === branch.fromCommit)
            const toCommit = commits.find((commit) => commit.id === branch.toCommit)
            if (!fromCommit || !toCommit) return null

            const controlX = (fromCommit.position.x + toCommit.position.x) / 2
            const controlY = branch.type === 'correction' ? baselineY - 50 : baselineY - 20
            const strokeColor =
              branch.type === 'correction' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'

            return (
              <path
                key={branch.id}
                d={`M ${fromCommit.position.x} ${fromCommit.position.y} Q ${controlX} ${controlY} ${toCommit.position.x} ${toCommit.position.y}`}
                stroke={strokeColor}
                strokeWidth={0.75 + branch.intensity * 1.5}
                fill="none"
                strokeDasharray="4 4"
              />
            )
          })}

          {maxPace > 0 && paceAreaPath && (
            <path
              d={paceAreaPath}
              fill="hsl(var(--secondary))"
              opacity={0.08}
            />
          )}

          {maxPace > 0 && pacePath && (
            <path
              d={pacePath}
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth={1.4}
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.65}
            />
          )}

          {maxPace > 0 &&
            pacePoints.map((point) => {
              const isActive = activeCommit?.id === point.id
              return (
                <circle
                  key={`pace-${point.id}`}
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 3.5 : 2}
                  fill="hsl(var(--secondary))"
                  opacity={isActive ? 0.9 : 0.5}
                />
              )
            })}

          {pauseMarkers.map((marker) => {
            const isActivePause = activeCommit?.id === marker.toId
            const strokeOpacity = isActivePause ? Math.min(1, marker.opacity + 0.2) : marker.opacity
            return (
              <g key={marker.id} className="pointer-events-none">
                <line
                  x1={marker.x}
                  x2={marker.x}
                  y1={baselineY}
                  y2={baselineY + marker.height}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1.1}
                  strokeDasharray="2 3"
                  strokeOpacity={strokeOpacity}
                />
                <circle
                  cx={marker.x}
                  cy={baselineY + marker.height}
                  r={marker.radius}
                  fill="hsl(var(--muted-foreground))"
                  opacity={strokeOpacity}
                />
              </g>
            )
          })}

          {commits.map((commit, index) => {
            const radius = 6 + commit.intensity * 6
            const color = getCommitColor(commit)
            const isActive = activeCommit?.id === commit.id
            const correctionLevel =
              correctionIntensityByCommit.get(commit.id) ??
              (commit.type === 'correction' ? Math.min(0.36 + commit.intensity * 0.4, 0.82) : 0)
            const correctionRadius = radius + 4 + correctionLevel * 6
            return (
              <g
                key={commit.id}
                onMouseEnter={() => handleEnter(commit)}
                onMouseLeave={handleLeave}
                className={interactive ? 'cursor-pointer' : undefined}
              >
                {correctionLevel > 0 && (
                  <circle
                    cx={commit.position.x}
                    cy={commit.position.y}
                    r={correctionRadius}
                    fill="none"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={1 + correctionLevel * 2}
                    strokeOpacity={isActive ? 0.85 : 0.5}
                  />
                )}
                <line
                  x1={commit.position.x}
                  y1={commit.position.y}
                  x2={commit.position.x}
                  y2={baselineY}
                  stroke={color}
                  strokeWidth={1}
                  strokeDasharray="2 4"
                  opacity={isActive ? 0.85 : 0.55}
                />
                <circle
                  cx={commit.position.x}
                  cy={commit.position.y}
                  r={radius}
                  fill={color}
                  opacity={isActive ? 1 : 0.75}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
                <text
                  x={commit.position.x}
                  y={commit.position.y - radius - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill="hsl(var(--muted-foreground))"
                >
                  {index + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="rounded-lg border bg-muted/20 p-3 text-xs sm:text-sm">
        {interactive && activeCommit ? (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-foreground">
            <span className="font-medium">
              Burst {commits.findIndex((commit) => commit.id === activeCommit.id) + 1}
            </span>
            <span>{activeCommit.keystrokes} keystrokes</span>
            <span>{formatDuration(activeCommit.duration)}</span>
            <span>{Math.round(activePace || 0)} wpm pace</span>
            <span>Pause {formatDuration(pauseBeforeActive)}</span>
            <span>
              {Math.round(activeCorrectionRatio * 100)}% corrections
              {estimatedBackspaces > 0 ? ` (~${estimatedBackspaces})` : ''}
            </span>
            <span>
              {new Date(activeCommit.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            {interactive
              ? 'Hover over each point to inspect writing bursts and pauses.'
              : 'Writing bursts visualized along the session timeline.'}
          </span>
        )}
      </div>
    </div>
  )
}

function analyzeKeystrokes(keystrokes: Keystroke[], graphWidth: number, graphHeight: number): WritingAnalysis {
  const sorted = [...keystrokes].sort((a, b) => a.timestamp - b.timestamp)
  const totalKeystrokes = sorted.length
  const totalDurationMs = Math.max(sorted[sorted.length - 1].timestamp - sorted[0].timestamp, 0)
  const gapThreshold = 7000

  const segments: TypingSegment[] = []
  const pauseDurations: number[] = []
  let backspaceCount = 0

  const createSegment = (index: number, start: number): TypingSegment => ({
    index,
    start,
    end: start,
    duration: 0,
    keystrokes: 0,
    backspaces: 0,
    correctionRatio: 0,
    intensity: 0,
  })

  let currentSegment = createSegment(0, sorted[0].timestamp)
  let lastTimestamp = sorted[0].timestamp

  sorted.forEach((keystroke, idx) => {
    if (idx > 0) {
      const gap = keystroke.timestamp - lastTimestamp
      if (gap > gapThreshold) {
        currentSegment.end = lastTimestamp
        currentSegment.duration = Math.max(currentSegment.end - currentSegment.start, 0)
        segments.push(currentSegment)
        pauseDurations.push(gap)
        currentSegment = createSegment(segments.length, keystroke.timestamp)
      }
    }

    currentSegment.keystrokes += 1
    if (keystroke.key_code === 8) {
      currentSegment.backspaces += 1
      backspaceCount += 1
    }

    lastTimestamp = keystroke.timestamp
  })

  currentSegment.end = lastTimestamp
  currentSegment.duration = Math.max(currentSegment.end - currentSegment.start, 0)
  segments.push(currentSegment)

  const activeDurationMs = segments.reduce((total, segment) => total + segment.duration, 0)
  const longestPauseMs = pauseDurations.length ? Math.max(...pauseDurations) : 0
  const averageKeystrokesPerMin =
    totalDurationMs > 0 ? (totalKeystrokes / totalDurationMs) * 60000 : totalKeystrokes
  const averageWpm =
    totalDurationMs > 0 ? (totalKeystrokes / 5 / totalDurationMs) * 60000 : totalKeystrokes / 5
  const correctionRatio = totalKeystrokes > 0 ? backspaceCount / totalKeystrokes : 0

  const maxSegmentKeystrokes = Math.max(...segments.map((segment) => segment.keystrokes), 1)
  const safeHeight = Math.max(graphHeight, 220)
  const baselineY = safeHeight - 60
  const amplitude = Math.max(40, Math.min(120, baselineY - 40))
  const spacing = graphWidth / Math.max(segments.length, 1)
  const xOffset = spacing / 2

  segments.forEach((segment) => {
    segment.correctionRatio = segment.keystrokes > 0 ? segment.backspaces / segment.keystrokes : 0
    segment.intensity = segment.keystrokes / maxSegmentKeystrokes
  })

  const commits: GitCommit[] = segments.map((segment, index) => {
    const type: GitCommit['type'] =
      index === 0 ? 'milestone' : segment.correctionRatio > 0.18 ? 'correction' : 'typing'

    return {
      id: `commit-${index}`,
      timestamp: segment.start,
      type,
      keystrokes: segment.keystrokes,
      duration: segment.duration,
      position: {
        x: Math.max(24, index * spacing + xOffset),
        y: Math.max(32, baselineY - segment.intensity * amplitude),
      },
      branches: [],
      intensity: segment.intensity,
    }
  })

  const branches: GitBranch[] = segments.reduce<GitBranch[]>((acc, segment, index) => {
    if (index === 0) return acc
    if (segment.correctionRatio > 0.18) {
      acc.push({
        id: `branch-${index}`,
        fromCommit: commits[index - 1].id,
        toCommit: commits[index].id,
        type: 'correction',
        intensity: segment.correctionRatio,
      })
    }
    return acc
  }, [])

  const summary = generateSummary(totalDurationMs, segments.length, correctionRatio)
  const insights = generateInsights({
    segments,
    pauseDurations,
    averageWpm,
    correctionRatio,
    backspaceCount,
    totalDurationMs,
  })

  return {
    sortedKeystrokes: sorted,
    totalKeystrokes,
    totalDurationMs,
    activeDurationMs,
    pauseDurations,
    longestPauseMs,
    averageWpm,
    averageKeystrokesPerMin,
    backspaceCount,
    correctionRatio,
    segments,
    commits,
    branches,
    insights,
    summary,
  }
}

function generateSummary(totalDurationMs: number, segmentCount: number, correctionRatio: number) {
  if (totalDurationMs <= 0) {
    return 'Keystrokes captured — ready to reveal the writing rhythm.'
  }

  const totalMinutes = totalDurationMs / 60000

  if (segmentCount <= 1 && totalMinutes < 5) {
    return 'A focused burst of writing with hardly any breaks.'
  }

  if (segmentCount > 4) {
    return 'Multi-burst drafting session with regular reflection pauses.'
  }

  if (correctionRatio > 0.22) {
    return 'Revision-heavy draft with deliberate pacing.'
  }

  if (totalMinutes > 20) {
    return 'Extended drafting session with balanced pacing.'
  }

  return 'Steady drafting rhythm with natural pauses.'
}

interface InsightParams {
  segments: TypingSegment[]
  pauseDurations: number[]
  averageWpm: number
  correctionRatio: number
  backspaceCount: number
  totalDurationMs: number
}

function generateInsights({
  segments,
  pauseDurations,
  averageWpm,
  correctionRatio,
  backspaceCount,
  totalDurationMs,
}: InsightParams) {
  const insights: string[] = []

  if (segments.length > 0) {
    const peakSegment = segments.reduce(
      (best, segment) => (segment.keystrokes > best.keystrokes ? segment : best),
      segments[0],
    )

    insights.push(
      `Burst ${peakSegment.index + 1} packed ${peakSegment.keystrokes} keys in ${formatDuration(peakSegment.duration)}.`,
    )
  }

  if (pauseDurations.length > 0) {
    const longestPause = Math.max(...pauseDurations)
    const averagePause = pauseDurations.reduce((total, pause) => total + pause, 0) / pauseDurations.length
    insights.push(
      `Pauses averaged ${formatDuration(averagePause)} (longest ${formatDuration(longestPause)}).`,
    )
  } else if (totalDurationMs > 0) {
    insights.push('No pauses longer than seven seconds detected — continuous flow.')
  }

  if (correctionRatio > 0.22) {
    insights.push(
      `Editing-heavy session: ${Math.round(correctionRatio * 100)}% corrections (${backspaceCount} backspaces).`,
    )
  } else if (correctionRatio < 0.05 && backspaceCount > 0) {
    insights.push('Clean drafting with minimal corrections needed.')
  }

  if (averageWpm >= 40) {
    insights.push(`Fast cadence at roughly ${Math.round(averageWpm)} WPM.`)
  } else if (averageWpm < 20 && totalDurationMs > 0) {
    insights.push(`Deliberate pace around ${Math.max(1, Math.round(averageWpm))} WPM.`)
  }

  if (insights.length === 0) {
    insights.push('Keystroke data captured — add more typing to surface richer insights.')
  }

  if (insights.length < 3 && segments.length > 0) {
    insights.push(
      `Session spanned ${segments.length} burst${segments.length === 1 ? '' : 's'} over ${formatDuration(totalDurationMs)}.`,
    )
  }

  return insights.slice(0, 4)
}

function formatDuration(ms: number) {
  if (!ms || ms < 0) return '0s'

  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes}m`
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
  }

  return `${seconds}s`
}

function HeatmapView({ keystrokes }: { keystrokes: Keystroke[] }) {
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(720)

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const stripePaddingX = 18
  const stripePaddingTop = 14
  const availableWidth = Math.max(containerWidth - stripePaddingX * 2, 1)
  const { bins, maxIntensity, intervalMs, startTime } = useMemo(() => {
    return calculateHeatmapGrid(keystrokes, availableWidth, false)
  }, [keystrokes, availableWidth])
  const stripeTrackHeight = Math.min(92, Math.max(58, Math.round(availableWidth * 0.11)))
  const stripeInnerPadding = Math.min(24, Math.max(14, Math.round(stripeTrackHeight * 0.28)))
  const stripeDrawHeight = Math.max(20, stripeTrackHeight - stripeInnerPadding)
  const stripeDrawOffset = stripePaddingTop + Math.round((stripeTrackHeight - stripeDrawHeight) / 2)
  const axisOffset = 32
  const baselineY = stripePaddingTop + stripeTrackHeight + 8
  const svgWidth = availableWidth + stripePaddingX * 2
  const svgHeight = baselineY + axisOffset

  const barcodeData = useMemo(() => {
    if (bins.length === 0) {
      return {
        stripes: [] as {
          intensity: number
          total: number
          startIndex: number
          endIndex: number
        }[],
        adjustedMaxIntensity: 1,
      }
    }

    const minStripeWidth = 7
    const maxStripeCount = Math.max(28, Math.floor(availableWidth / minStripeWidth))
    const groupSize = Math.max(1, Math.ceil(bins.length / maxStripeCount))

    const stripes = []
    for (let i = 0; i < bins.length; i += groupSize) {
      const slice = bins.slice(i, i + groupSize)
      const intensity = Math.max(...slice)
      const total = slice.reduce((sum, value) => sum + value, 0)
      stripes.push({
        intensity,
        total,
        startIndex: i,
        endIndex: Math.min(i + groupSize - 1, bins.length - 1),
      })
    }

    const adjustedMaxIntensity = Math.max(
      ...stripes.map((stripe) => stripe.intensity),
      maxIntensity,
      1,
    )

    return { stripes, adjustedMaxIntensity }
  }, [availableWidth, bins, maxIntensity])

  const getStripeColor = (intensity: number, adjustedMaxIntensity: number) => {
    if (intensity <= 0) return 'hsl(0 0% 94%)'
    const ratio = Math.log(intensity + 1) / Math.log(adjustedMaxIntensity + 1)
    const lightness = Math.max(18, 90 - ratio * 70)
    return `hsl(0 0% ${lightness}%)`
  }

  const stripeGap =
    barcodeData.stripes.length > 80 ? 0 : barcodeData.stripes.length > 40 ? 0.75 : 1.35
  const stripeWidth =
    barcodeData.stripes.length === 0
      ? availableWidth
      : Math.max(
          3,
          (availableWidth - stripeGap * Math.max(barcodeData.stripes.length - 1, 0)) /
            barcodeData.stripes.length,
        )

  const totalDurationMs = bins.length * intervalMs

  const formatRelative = (elapsedMs: number) => {
    if (elapsedMs < 60000) {
      const seconds = Math.max(0, Math.round(elapsedMs / 1000))
      return `${seconds}s`
    }

    if (elapsedMs < 3600000) {
      const minutes = Math.floor(elapsedMs / 60000)
      const seconds = Math.round((elapsedMs % 60000) / 1000)
      if (seconds === 0) return `${minutes}m`
      return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
    }

    const hours = Math.floor(elapsedMs / 3600000)
    const minutes = Math.round((elapsedMs % 3600000) / 60000)
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const axisTicks = useMemo(() => {
    const tickCount = Math.min(7, Math.max(3, Math.floor(availableWidth / 110)))
    return Array.from({ length: tickCount + 1 }, (_, index) => {
      const ratio = tickCount === 0 ? 0 : index / tickCount
      const elapsed = ratio * totalDurationMs
      const x = stripePaddingX + ratio * availableWidth
      return {
        x,
        label: formatRelative(elapsed),
      }
    })
  }, [availableWidth, totalDurationMs])

  const handleMouseOver = (
    event: ReactMouseEvent<SVGRectElement>,
    stripe: (typeof barcodeData.stripes)[number],
  ) => {
    const startOffset = stripe.startIndex * intervalMs
    const endOffset = (stripe.endIndex + 1) * intervalMs
    const startLabel = formatRelative(startOffset)
    const endLabel = formatRelative(endOffset)
    const timeDescriptor =
      totalDurationMs < 3600000
        ? `${startLabel} – ${endLabel}`
        : `${new Date(startTime + startOffset).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}`

    const targetRect = event.currentTarget.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()

    setTooltip({
      visible: true,
      content: `${stripe.total} keystrokes • ${timeDescriptor}`,
      x: containerRect ? event.clientX - containerRect.left : event.clientX - targetRect.left,
      y: containerRect ? event.clientY - containerRect.top : event.clientY - targetRect.top,
    })
  }

  const activeTooltip = tooltip?.visible ? tooltip : null

  return (
    <div className="relative rounded-2xl border border-border/70 bg-gradient-to-b from-card via-card/70 to-muted/40 p-3 shadow-sm sm:p-4">
      <div className="rounded-[20px] border border-border/60 bg-background/95 px-4 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] sm:px-6 sm:py-8">
        <div ref={containerRef} className="relative w-full">
          <svg
            width="100%"
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="heatmap-gloss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsla(0, 0%, 100%, 0.35)" />
                <stop offset="45%" stopColor="hsla(0, 0%, 100%, 0.08)" />
                <stop offset="100%" stopColor="hsla(0, 0%, 100%, 0)" />
              </linearGradient>
            </defs>
            <rect
              x={stripePaddingX}
              y={stripePaddingTop}
              width={availableWidth}
              height={stripeTrackHeight}
              rx={12}
              fill="hsl(var(--muted)/0.35)"
              stroke="hsl(var(--border))"
              strokeWidth="0.75"
            />
            <rect
              x={stripePaddingX + 1.5}
              y={stripePaddingTop + 1.5}
              width={Math.max(0, availableWidth - 3)}
              height={Math.max(0, stripeTrackHeight - 3)}
              rx={10}
              fill="url(#heatmap-gloss)"
            />
            <g onMouseLeave={() => setTooltip(null)}>
              {barcodeData.stripes.map((stripe, index) => {
                const columnWidth = stripeWidth
                const columnInset =
                  columnWidth >= 14 ? 6 : columnWidth >= 10 ? 4 : columnWidth >= 7 ? 3 : columnWidth >= 5 ? 2 : 1
                const paintedWidth = Math.max(1.5, columnWidth - columnInset)
                const insetOffset = Math.max(0, (columnWidth - paintedWidth) / 2)
                const x =
                  stripePaddingX +
                  index * (columnWidth + stripeGap) +
                  insetOffset
                return (
                  <rect
                    key={index}
                    x={x}
                    y={stripeDrawOffset}
                    width={paintedWidth}
                    height={stripeDrawHeight}
                    rx={paintedWidth < 6 ? 0 : 1}
                    fill={getStripeColor(stripe.intensity, barcodeData.adjustedMaxIntensity)}
                    className="cursor-pointer transition-opacity duration-150 hover:opacity-90"
                    shapeRendering="crispEdges"
                    onMouseOver={(event) => handleMouseOver(event, stripe)}
                  />
                )
              })}
            </g>
            <line
              x1={stripePaddingX}
              x2={stripePaddingX + availableWidth}
              y1={baselineY}
              y2={baselineY}
              stroke="hsl(var(--border))"
              strokeWidth="0.75"
            />
            {axisTicks.map((tick, index) => (
              <g key={index}>
                <line
                  x1={tick.x}
                  x2={tick.x}
                  y1={baselineY}
                  y2={baselineY + 6}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.75"
                />
                <text
                  x={tick.x}
                  y={baselineY + 20}
                  fontSize="10"
                  fill="hsl(var(--muted-foreground))"
                  textAnchor="middle"
                >
                  {tick.label}
                </text>
              </g>
            ))}
          </svg>
          {activeTooltip && (
            <div
              className="absolute z-10 whitespace-nowrap rounded-md bg-popover px-3 py-2 text-xs font-medium text-popover-foreground shadow-xl ring-1 ring-border"
              style={{
                left: Math.max(12, Math.min(Math.max(12, containerWidth - 168), activeTooltip.x + 16)),
                top: Math.max(12, activeTooltip.y + 18),
              }}
            >
              {activeTooltip.content}
            </div>
          )}
        </div>
        <HeatmapLegend />
      </div>
    </div>
  )
}

function HeatmapLegend() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
      <span>Less</span>
      <div
        className="h-3 w-32 rounded-full border border-border/80"
        style={{
          background:
            'linear-gradient(90deg, hsl(0 0% 94%) 0%, hsl(0 0% 70%) 45%, hsl(0 0% 18%) 100%)',
        }}
      />
      <span>More</span>
    </div>
  )
}
