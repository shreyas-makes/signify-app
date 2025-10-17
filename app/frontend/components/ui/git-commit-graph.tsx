import { type MouseEvent as ReactMouseEvent, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'

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

function getDisplayDuration(duration: number, keystrokes: number) {
  if (!Number.isFinite(duration) || duration < 0) return 0
  const perKeyFloor = keystrokes > 0 ? keystrokes * 140 : 0
  const minimum = Math.max(600, Math.min(4000, perKeyFloor || 900))
  return Math.max(duration, minimum)
}

function computePaceWpm(duration: number, keystrokes: number) {
  const effectiveDuration = getDisplayDuration(duration, keystrokes)
  if (effectiveDuration <= 0) return 0
  const words = keystrokes / 5
  return (words / effectiveDuration) * 60000
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
            timeline={analysis.timeline}
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
  displayDuration: number
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
  timeline: {
    start: number
    end: number
  }
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
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground" />
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
  timeline,
}: {
  commits: GitCommit[]
  branches: GitBranch[]
  width: number
  height: number
  interactive: boolean
  timeline: {
    start: number
    end: number
  }
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
  const trackY = baselineY + 16
  const svgId = useId()
  const paceGradientId = `${svgId}-pace-gradient`
  const [activePause, setActivePause] = useState<{
    from: GitCommit
    to: GitCommit
    pause: number
    fromIndex: number
    toIndex: number
  } | null>(null)
  const commitById = useMemo(() => {
    return commits.reduce((map, commit) => {
      map.set(commit.id, commit)
      return map
    }, new Map<string, GitCommit>())
  }, [commits])
  const [minCommitX, maxCommitX] = useMemo(() => {
    if (commits.length === 0) return [0, width]
    let minX = commits[0].position.x
    let maxX = commits[0].position.x
    for (const commit of commits) {
      minX = Math.min(minX, commit.position.x)
      maxX = Math.max(maxX, commit.position.x)
    }
    return [minX, maxX]
  }, [commits, width])

  const {
    correctionIntensityByCommit,
    pacePoints,
    pacePath,
    paceAreaPath,
    maxPace,
    pauseBands,
    pacePointMap,
    paceTicks,
  } = useMemo(() => {
    const correctionMap = new Map<string, number>()
    for (const branch of branches) {
      if (branch.type !== 'correction') continue
      const existing = correctionMap.get(branch.toCommit) ?? 0
      correctionMap.set(branch.toCommit, Math.max(existing, branch.intensity))
    }

    const paceBase = Math.max(60, baselineY - 52)
    const paceAmplitude = Math.min(40, Math.max(22, baselineY * 0.16))
    const paceValues = commits.map((commit) => {
      const pace = computePaceWpm(commit.duration, commit.keystrokes)
      return {
        id: commit.id,
        x: commit.position.x,
        pace,
      }
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

    const pauseBandsRaw: {
      id: string
      x: number
      width: number
      centerX: number
      pause: number
      fromId: string
      toId: string
      fromIndex: number
      toIndex: number
      intensity: number
    }[] = []
    let longestPause = 0

    commits.forEach((commit, index) => {
      if (index === 0) return
      const prev = commits[index - 1]
      const prevEnd = prev.timestamp + prev.duration
      const pause = Math.max(0, commit.timestamp - prevEnd)
      if (pause <= 0) return
      const leftX = Math.min(prev.position.x, commit.position.x)
      const spanWidth = Math.max(12, Math.abs(commit.position.x - prev.position.x))
      const centerX = leftX + spanWidth / 2
      pauseBandsRaw.push({
        id: `pause-${prev.id}-${commit.id}`,
        x: leftX,
        width: spanWidth,
        centerX,
        pause,
        fromId: prev.id,
        toId: commit.id,
        fromIndex: index - 1,
        toIndex: index,
        intensity: 0,
      })
      longestPause = Math.max(longestPause, pause)
    })

    const normalizedPauseBands = pauseBandsRaw.map((band) => ({
      ...band,
      intensity: longestPause > 0 ? Math.max(0.3, band.pause / longestPause) : 0.3,
    }))

    const pacePointEntries = pacePointsComputed.map((point) => [point.id, point] as const)
    const paceTickEntries =
      maxPaceValue > 0
        ? [0.5, 1]
            .map((ratio) => {
              const value = Math.round(maxPaceValue * ratio)
              const y =
                paceBase -
                (maxPaceValue > 0 ? ratio * paceAmplitude : 0)
              return { value, y }
            })
            .filter((tick, index, arr) => index === arr.length - 1 || tick.value > 0)
        : []

    return {
      correctionIntensityByCommit: correctionMap,
      pacePoints: pacePointsComputed,
      pacePath: pacePathValue,
      paceAreaPath: paceAreaValue,
      maxPace: maxPaceValue,
      pauseBands: normalizedPauseBands,
      pacePointMap: new Map(pacePointEntries),
      paceTicks: paceTickEntries,
    }
  }, [branches, commits, baselineY])

  const getCommitColor = (commit: GitCommit) => {
    if (commit.type === 'correction') return 'hsl(var(--foreground))'
    if (commit.type === 'milestone') return 'hsl(var(--foreground) / 0.6)'
    return 'hsl(var(--foreground) / 0.45)'
  }

  const handleEnter = (commit: GitCommit) => {
    if (!interactive) return
    setActiveCommit(commit)
    setActivePause(null)
  }

  const handleLeave = () => {
    if (!interactive) return
    setActiveCommit(commits[0] ?? null)
  }

  const handlePauseEnter = (
    fromCommit: GitCommit,
    toCommit: GitCommit,
    pause: number,
    fromIndex: number,
    toIndex: number,
  ) => {
    if (!interactive) return
    setActivePause({ from: fromCommit, to: toCommit, pause, fromIndex, toIndex })
    setActiveCommit(null)
  }

  const handlePauseLeave = () => {
    if (!interactive) return
    setActivePause(null)
    setActiveCommit(commits[0] ?? null)
  }

  const activeCommitIndex = activeCommit ? commits.findIndex((commit) => commit.id === activeCommit.id) : -1
  const previousCommit = activeCommitIndex > 0 ? commits[activeCommitIndex - 1] : null
  const pauseBeforeActive =
    activeCommit && previousCommit
      ? Math.max(0, activeCommit.timestamp - (previousCommit.timestamp + previousCommit.duration))
      : 0
  const activePace =
    activeCommit ? computePaceWpm(activeCommit.duration, activeCommit.keystrokes) : 0
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
  const activePauseResumePace =
    activePause ? computePaceWpm(activePause.to.duration, activePause.to.keystrokes) : 0
  const activeBurstLabel = activeCommitIndex >= 0 ? `#${activeCommitIndex + 1}` : '—'

  const axisTicks = useMemo(() => {
    if (!timeline || maxCommitX <= minCommitX) return []
    const span = Math.max(timeline.end - timeline.start, 1)
    const horizontalSpan = Math.max(maxCommitX - minCommitX, 1)
    const tickCount = Math.min(5, Math.max(2, Math.floor(width / 220)))
    const ticks: { x: number; label: string }[] = []
    for (let i = 0; i < tickCount; i++) {
      const ratio = tickCount === 1 ? 0 : i / (tickCount - 1)
      const x = minCommitX + ratio * horizontalSpan
      const offsetMs = ratio * span
      const label = i === 0 ? '0s' : formatDuration(offsetMs)
      ticks.push({ x, label })
    }
    return ticks
  }, [timeline, minCommitX, maxCommitX, width])

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          width="100%"
          height={safeHeight}
          viewBox={`0 0 ${width} ${safeHeight}`}
          className="w-full overflow-visible"
        >
          <defs>
            <linearGradient id={paceGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.22" />
              <stop offset="70%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line
            x1={0}
            x2={width}
            y1={baselineY}
            y2={baselineY}
            stroke="hsl(var(--border))"
            strokeWidth={1}
            strokeOpacity={0.35}
            strokeDasharray="4 6"
          />
          <line
            x1={Math.max(12, minCommitX - 24)}
            x2={Math.min(width - 12, maxCommitX + 24)}
            y1={trackY}
            y2={trackY}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeOpacity={0.18}
            strokeLinecap="round"
          />

          {axisTicks.map((tick, index) => (
            <g key={`axis-tick-${index}`} pointerEvents="none">
              <line
                x1={tick.x}
                x2={tick.x}
                y1={trackY - 4}
                y2={trackY + 4}
                stroke="hsl(var(--border))"
                strokeWidth={1}
                strokeOpacity={0.5}
              />
            </g>
          ))}

          {maxPace > 0 &&
            paceTicks.map((tick, index) => (
              <g key={`pace-tick-${index}`} className="pointer-events-none">
                <line
                  x1={Math.max(0, minCommitX - 36)}
                  x2={Math.min(width, maxCommitX + 36)}
                  y1={tick.y}
                  y2={tick.y}
                  stroke="hsl(var(--border))"
                  strokeDasharray="4 6"
                  strokeOpacity={0.28}
                />
              </g>
            ))}

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
                strokeWidth={1.4}
                strokeOpacity={0.5}
              />
            )
          })}

          {branches.map((branch) => {
            const fromCommit = commits.find((commit) => commit.id === branch.fromCommit)
            const toCommit = commits.find((commit) => commit.id === branch.toCommit)
            if (!fromCommit || !toCommit) return null

            const controlX = (fromCommit.position.x + toCommit.position.x) / 2
            const controlY = branch.type === 'correction' ? baselineY - 44 : baselineY - 28
            const strokeColor =
              branch.type === 'correction'
                ? 'hsl(var(--foreground) / 0.65)'
                : 'hsl(var(--muted-foreground))'

            return (
              <path
                key={branch.id}
                d={`M ${fromCommit.position.x} ${fromCommit.position.y} Q ${controlX} ${controlY} ${toCommit.position.x} ${toCommit.position.y}`}
                stroke={strokeColor}
                strokeWidth={0.8 + branch.intensity}
                strokeOpacity={branch.type === 'correction' ? 0.75 : 0.45}
                fill="none"
                strokeDasharray="3 5"
              />
            )
          })}

          {maxPace > 0 && paceAreaPath && (
            <path
              d={paceAreaPath}
              fill={`url(#${paceGradientId})`}
              opacity={1}
              pointerEvents="none"
            />
          )}

          {maxPace > 0 && pacePath && (
            <path
              d={pacePath}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1.4}
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.65}
              pointerEvents="none"
            />
          )}

          {maxPace > 0 &&
            pacePoints.map((point) => {
              const commit = commitById.get(point.id)
              if (!commit) return null
              const isActive = activeCommit?.id === point.id
              const isLinkedToPause =
                activePause?.from?.id === point.id || activePause?.to?.id === point.id
              return (
                <g
                  key={`pace-${point.id}`}
                  onMouseEnter={() => handleEnter(commit)}
                  onMouseLeave={handleLeave}
                  className={interactive ? 'cursor-pointer' : undefined}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 6 : 5}
                    fill="transparent"
                    opacity={0}
                    pointerEvents="all"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 3.5 : 2.4}
                    fill="hsl(var(--muted-foreground))"
                    opacity={isActive ? 0.95 : isLinkedToPause ? 0.75 : 0.5}
                    pointerEvents="none"
                  />
                </g>
              )
            })}

          {pauseBands.map((band) => {
            const fromCommit = commitById.get(band.fromId)
            const toCommit = commitById.get(band.toId)
            if (!fromCommit || !toCommit) return null
            const isActivePause =
              activePause?.from?.id === fromCommit.id && activePause?.to?.id === toCommit.id
            const rectHeight = 4
            const rectY = trackY - rectHeight / 2
            const highlightWidth = Math.min(
              Math.max(28, Math.log1p(band.pause / 800) * 26),
              Math.max(48, width * 0.22),
            )
            const rectX = Math.max(16, Math.min(band.centerX - highlightWidth / 2, width - highlightWidth - 16))
            const rectOpacityBase = 0.16 + band.intensity * 0.2
            const rectOpacity = isActivePause ? Math.min(0.85, rectOpacityBase + 0.2) : rectOpacityBase
            const connectorOpacity = isActivePause ? 0.5 : 0.25
            const labelOpacity = isActivePause ? 0.85 : 0.55
            return (
              <g
                key={band.id}
                onMouseEnter={() =>
                  handlePauseEnter(fromCommit, toCommit, band.pause, band.fromIndex, band.toIndex)
                }
                onMouseLeave={handlePauseLeave}
                className={interactive ? 'cursor-pointer' : undefined}
              >
                <line
                  x1={fromCommit.position.x}
                  x2={toCommit.position.x}
                  y1={trackY}
                  y2={trackY}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={isActivePause ? 1.1 : 0.75}
                  strokeOpacity={connectorOpacity}
                />
                <rect
                  x={rectX}
                  y={rectY}
                  width={highlightWidth}
                  height={rectHeight}
                  rx={4}
                  ry={4}
                  fill="hsl(var(--muted-foreground))"
                  opacity={rectOpacity}
                />
                <circle
                  cx={band.centerX}
                  cy={trackY}
                  r={isActivePause ? 4 : 3}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={isActivePause ? 1.4 : 1}
                  opacity={isActivePause ? 0.9 : 0.45}
                />
                {isActivePause && (
                  <text
                    x={band.centerX}
                    y={trackY - 10}
                    fontSize="9"
                    textAnchor="middle"
                    fill="hsl(var(--muted-foreground))"
                    opacity={labelOpacity}
                  >
                    {formatDuration(band.pause)}
                  </text>
                )}
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
            const pauseLinked =
              activePause?.from?.id === commit.id || activePause?.to?.id === commit.id
            const pacePoint = pacePointMap.get(commit.id)
            const baselineOpacity = isActive || pauseLinked ? 0.9 : 0.55
            const fillOpacity = isActive ? 1 : pauseLinked ? 0.85 : 0.75
            const ringDashOn = Math.max(2.2, correctionLevel * 12)
            const ringDashOff = Math.max(2.2, 14 - correctionLevel * 10)
            const ringDasharray = `${ringDashOn.toFixed(1)} ${ringDashOff.toFixed(1)}`
            const stemColor = isActive ? color : 'hsl(var(--border))'
            const stemOpacity = isActive ? 0.75 : baselineOpacity * 0.45
            return (
              <g
                key={commit.id}
                onMouseEnter={() => handleEnter(commit)}
                onMouseLeave={handleLeave}
                className={interactive ? 'cursor-pointer' : undefined}
              >
                {pacePoint && isActive && (
                  <path
                    d={`M ${commit.position.x} ${commit.position.y} L ${pacePoint.x} ${pacePoint.y}`}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1.2}
                    strokeDasharray="2 3"
                    strokeOpacity={0.85}
                    pointerEvents="none"
                  />
                )}
                {correctionLevel > 0 && (
                  <circle
                    cx={commit.position.x}
                    cy={commit.position.y}
                    r={correctionRadius}
                    fill="none"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={1 + correctionLevel * 2}
                    strokeOpacity={isActive ? 0.85 : pauseLinked ? 0.65 : 0.5}
                    strokeDasharray={ringDasharray}
                  />
                )}
                <line
                  x1={commit.position.x}
                  y1={commit.position.y}
                  x2={commit.position.x}
                  y2={baselineY}
                  stroke={stemColor}
                  strokeWidth={1}
                  strokeOpacity={stemOpacity}
                />
                <circle
                  cx={commit.position.x}
                  cy={trackY}
                  r={isActive ? 3 : 2}
                  fill="hsl(var(--muted-foreground))"
                  opacity={isActive ? 0.65 : 0.35}
                  pointerEvents="none"
                />
                <circle
                  cx={commit.position.x}
                  cy={commit.position.y}
                  r={radius}
                  fill={color}
                  opacity={fillOpacity}
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
        <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-[3px] w-6 rounded-full bg-gradient-to-r from-muted-foreground/60 via-muted-foreground/30 to-muted-foreground/0" />
            Pace Line
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-6 rounded-full border border-muted-foreground/30 bg-muted-foreground/10" />
            Pause Span
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            Burst
          </span>
        </div>
      </div>
      <div className="rounded-lg border bg-muted/20 p-3 text-xs sm:text-sm">
        {interactive && (activePause || activeCommit) ? (
          activePause ? (
            <div className="grid gap-y-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 text-foreground">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Pause Window
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Burst {activePause.fromIndex + 1} → {activePause.toIndex + 1}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Idle Time
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatDuration(activePause.pause)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Resume Pace
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {Math.round(activePauseResumePace || 0)} wpm
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Next Burst Load
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {activePause.to.keystrokes} keys ·{' '}
                  {formatDuration(getDisplayDuration(activePause.to.duration, activePause.to.keystrokes))}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Resume Time
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {new Date(activePause.to.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ) : activeCommit ? (
            <div className="grid gap-y-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 text-foreground">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Burst</span>
                <span className="text-sm font-semibold text-foreground">
                  {activeBurstLabel}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Output
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {activeCommit.keystrokes} keys
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Active Time
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatDuration(getDisplayDuration(activeCommit.duration, activeCommit.keystrokes))}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Pace
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {Math.round(activePace || 0)} wpm
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Pause Before
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatDuration(pauseBeforeActive)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Corrections
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {Math.round(activeCorrectionRatio * 100)}%
                  {estimatedBackspaces > 0 ? ` · ~${estimatedBackspaces}` : ''}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Started
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {new Date(activeCommit.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ) : null
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
    displayDuration: 0,
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

  segments.forEach((segment) => {
    segment.displayDuration = getDisplayDuration(segment.duration, segment.keystrokes)
  })

  const activeDurationMs = segments.reduce((total, segment) => total + segment.displayDuration, 0)
  const longestPauseMs = pauseDurations.length ? Math.max(...pauseDurations) : 0
  const effectiveDurationMs = Math.max(activeDurationMs, totalDurationMs || 0)
  const averageKeystrokesPerMin =
    effectiveDurationMs > 0 ? (totalKeystrokes / effectiveDurationMs) * 60000 : totalKeystrokes
  const averageWpm =
    effectiveDurationMs > 0 ? (totalKeystrokes / 5 / effectiveDurationMs) * 60000 : totalKeystrokes / 5
  const correctionRatio = totalKeystrokes > 0 ? backspaceCount / totalKeystrokes : 0

  const maxSegmentKeystrokes = Math.max(...segments.map((segment) => segment.keystrokes), 1)
  const safeHeight = Math.max(graphHeight, 220)
  const baselineY = safeHeight - 60
  const amplitude = Math.max(36, Math.min(88, baselineY * 0.35))
  const timelinePadding = Math.min(96, Math.max(40, graphWidth * 0.08))
  const timelineWidth = Math.max(graphWidth - timelinePadding * 2, 1)
  const timelineStart = segments[0]?.start ?? sorted[0]?.timestamp
  const timelineEnd = segments[segments.length - 1]?.end ?? timelineStart
  const timelineSpan = Math.max(timelineEnd - timelineStart, 1)
  const isSingleSegment = segments.length === 1

  segments.forEach((segment) => {
    segment.correctionRatio = segment.keystrokes > 0 ? segment.backspaces / segment.keystrokes : 0
    segment.intensity = segment.keystrokes / maxSegmentKeystrokes
  })

  const commits: GitCommit[] = segments.map((segment, index) => {
    const type: GitCommit['type'] =
      index === 0 ? 'milestone' : segment.correctionRatio > 0.18 ? 'correction' : 'typing'
    const segmentMidpoint =
      segment.start + (segment.displayDuration > 0 ? segment.displayDuration / 2 : 0)
    const timeRatio = isSingleSegment
      ? 0.5
      : timelineSpan > 0
        ? (segmentMidpoint - timelineStart) / timelineSpan
        : 0.5
    const indexRatio =
      segments.length > 1 ? index / (segments.length - 1) : 0.5
    const spacingBias = Math.min(0.45, Math.max(0.22, 0.18 + segments.length * 0.02))
    const blendedPosition =
      isSingleSegment
        ? 0.5
        : (1 - spacingBias) * timeRatio + spacingBias * indexRatio
    const clampedPosition = Number.isFinite(blendedPosition)
      ? Math.min(1, Math.max(0, blendedPosition))
      : 0.5

    return {
      id: `commit-${index}`,
      timestamp: segment.start,
      type,
      keystrokes: segment.keystrokes,
      duration: segment.duration,
      displayDuration: segment.displayDuration,
      position: {
        x: timelinePadding + clampedPosition * timelineWidth,
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
    effectiveDurationMs,
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
    timeline: {
      start: timelineStart,
      end: timelineEnd,
    },
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
  effectiveDurationMs: number
}

function generateInsights({
  segments,
  pauseDurations,
  averageWpm,
  correctionRatio,
  backspaceCount,
  totalDurationMs,
  effectiveDurationMs,
}: InsightParams) {
  const insights: string[] = []

  if (segments.length > 0) {
    const peakSegment = segments.reduce(
      (best, segment) => (segment.keystrokes > best.keystrokes ? segment : best),
      segments[0],
    )

    insights.push(
      `Burst ${peakSegment.index + 1} packed ${peakSegment.keystrokes} keys in ${formatDuration(peakSegment.displayDuration)}.`,
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
      `Session spanned ${segments.length} burst${segments.length === 1 ? '' : 's'} over ${formatDuration(Math.max(totalDurationMs, effectiveDurationMs))}.`,
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
