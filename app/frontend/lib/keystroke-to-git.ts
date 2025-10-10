import type { GitBranch, GitCommit, Keystroke } from '@/types'

interface ProcessingOptions {
  maxCommits?: number
  pauseThreshold?: number // milliseconds
  burstThreshold?: number // keystrokes per second
  width?: number
  height?: number
}

export function processKeystrokesToGitGraph(
  keystrokes: Keystroke[], 
  options: ProcessingOptions = {}
): { commits: GitCommit[]; branches: GitBranch[] } {
  const {
    maxCommits = 50,
    pauseThreshold = 500, // Reduced from 2000ms to 500ms for more granular commits
    width = 800,
    height = 200
  } = options

  if (keystrokes.length === 0) {
    return { commits: [], branches: [] }
  }

  // Calculate adaptive thresholds based on dataset
  const adaptiveThreshold = calculateAdaptiveThreshold(keystrokes, pauseThreshold)
  
  // Always process all keystrokes for better visualization
  const commits = groupKeystrokesIntoCommits(keystrokes, adaptiveThreshold)
  
  // Ensure minimum number of commits for visual richness
  const enhancedCommits = ensureMinimumCommits(commits, keystrokes, Math.min(maxCommits, 30))
  
  // Limit to maxCommits but ensure good distribution
  const limitedCommits = enhancedCommits.slice(0, maxCommits)
  
  // Calculate positions for visual layout with artistic distribution
  const positionedCommits = calculateCommitPositions(limitedCommits, width, height)
  
  // Generate branch connections
  const branches = generateBranches(positionedCommits)
  
  return { commits: positionedCommits, branches }
}


function calculateAdaptiveThreshold(keystrokes: Keystroke[], basePauseThreshold: number): number {
  if (keystrokes.length === 0) return basePauseThreshold
  
  // Calculate total writing time span
  const firstKeystroke = keystrokes[0]
  const lastKeystroke = keystrokes[keystrokes.length - 1]
  const totalTime = lastKeystroke.timestamp - firstKeystroke.timestamp
  
  // For short sessions, use smaller thresholds to create more commits
  if (totalTime < 30000) { // Less than 30 seconds
    return Math.max(200, basePauseThreshold * 0.4)
  } else if (totalTime < 120000) { // Less than 2 minutes
    return Math.max(300, basePauseThreshold * 0.6)
  }
  
  return basePauseThreshold
}

function ensureMinimumCommits(commits: GitCommit[], keystrokes: Keystroke[], minCommits: number): GitCommit[] {
  if (commits.length >= minCommits || keystrokes.length < 10) {
    return commits
  }
  
  // If we have too few commits, create additional ones by splitting large commits
  const enhancedCommits: GitCommit[] = []
  let commitIdCounter = commits.length
  
  for (const commit of commits) {
    enhancedCommits.push(commit)
    
    // Split large commits (>50 keystrokes) into smaller ones
    if (commit.keystrokes > 50 && enhancedCommits.length < minCommits) {
      const splitCount = Math.min(3, Math.floor(commit.keystrokes / 25))
      const timeStep = commit.duration / (splitCount + 1)
      
      for (let i = 1; i <= splitCount; i++) {
        enhancedCommits.push({
          id: `enhanced-${commitIdCounter++}`,
          timestamp: commit.timestamp + (timeStep * i),
          type: commit.type === 'correction' ? 'typing' : commit.type,
          keystrokes: Math.floor(commit.keystrokes / (splitCount + 1)),
          duration: timeStep,
          position: { x: 0, y: 0 },
          branches: [],
          intensity: commit.intensity * (0.7 + Math.random() * 0.6) // Add variation
        })
      }
    }
    
    if (enhancedCommits.length >= minCommits) break
  }
  
  return enhancedCommits
}

function groupKeystrokesIntoCommits(
  keystrokes: Keystroke[], 
  pauseThreshold: number
): GitCommit[] {
  const commits: GitCommit[] = []
  let currentGroup: Keystroke[] = []
  let lastTimestamp = 0
  let commitId = 0

  for (const keystroke of keystrokes) {
    const timeDiff = lastTimestamp ? keystroke.timestamp - lastTimestamp : 0

    // Only process keydown events for commit grouping
    if (keystroke.event_type !== 'keydown') {
      continue
    }

    // Check if this starts a new commit (pause detected)
    if (timeDiff > pauseThreshold && currentGroup.length > 0) {
      // Create commit from current group
      const commit = createCommitFromGroup(currentGroup, commitId++, pauseThreshold)
      commits.push(commit)
      
      // Add pause marker if significant
      if (timeDiff > pauseThreshold * 2) {
        commits.push({
          id: `pause-${commitId++}`,
          timestamp: lastTimestamp + pauseThreshold,
          type: 'pause',
          keystrokes: 0,
          duration: timeDiff,
          position: { x: 0, y: 0 }, // Will be calculated later
          branches: [],
          intensity: Math.min(2, timeDiff / pauseThreshold)
        })
      }
      
      currentGroup = []
    }

    currentGroup.push(keystroke)
    lastTimestamp = keystroke.timestamp
  }

  // Process final group
  if (currentGroup.length > 0) {
    const commit = createCommitFromGroup(currentGroup, commitId++, pauseThreshold)
    commits.push(commit)
  }

  return commits
}

function createCommitFromGroup(
  group: Keystroke[], 
  id: number, 
  pauseThreshold: number
): GitCommit {
  const firstKeystroke = group[0]
  const lastKeystroke = group[group.length - 1]
  const duration = lastKeystroke.timestamp - firstKeystroke.timestamp
  
  // Determine commit type based on keystroke analysis
  const backspaceCount = group.filter(k => k.key_code === 8).length
  const totalKeys = group.length
  
  let type: GitCommit['type'] = 'typing'
  if (backspaceCount > totalKeys * 0.3) {
    type = 'correction'
  } else if (duration > pauseThreshold * 0.5) {
    type = 'milestone'
  }

  // Calculate intensity based on typing speed and corrections
  const keysPerSecond = duration > 0 ? (totalKeys / duration) * 1000 : 0
  const intensity = Math.max(0.5, Math.min(3, keysPerSecond / 2 + (backspaceCount / totalKeys)))

  return {
    id: `commit-${id}`,
    timestamp: firstKeystroke.timestamp,
    type,
    keystrokes: totalKeys,
    duration,
    position: { x: 0, y: 0 }, // Will be calculated later
    branches: [],
    intensity
  }
}

function calculateCommitPositions(
  commits: GitCommit[], 
  width: number, 
  height: number
): GitCommit[] {
  if (commits.length === 0) return commits

  const padding = 40 // Adequate padding to prevent text cutoff
  const bottomPadding = 60 // Extra space for timeline and timestamps
  const availableWidth = width - (padding * 2)
  const availableHeight = height - padding - bottomPadding
  
  // Calculate time span
  const startTime = commits[0].timestamp
  const endTime = commits[commits.length - 1].timestamp
  const timeSpan = endTime - startTime || 1

  // Create artistic positioning with multiple strategies
  return commits.map((commit, index) => {
    // Base X position (chronological flow)
    const timeProgress = timeSpan > 0 ? (commit.timestamp - startTime) / timeSpan : index / commits.length
    let x = padding + (timeProgress * availableWidth)
    
    // Add artistic variance to X position
    const xVariance = (Math.sin(index * 0.5) * 20) + (Math.random() - 0.5) * 30
    x = Math.max(padding, Math.min(width - padding, x + xVariance))
    
    // Multi-lane Y positioning with organic curves
    let y = calculateArtisticYPosition(commit, index, commits.length, availableHeight, padding)
    
    // Add gentle wave pattern for visual flow
    const waveOffset = Math.sin((timeProgress * Math.PI * 2) + (index * 0.3)) * 15
    y += waveOffset
    
    // Ensure Y stays within bounds with proper bottom margin
    y = Math.max(padding, Math.min(height - 70, y))
    
    return {
      ...commit,
      position: { x, y }
    }
  })
}

function calculateArtisticYPosition(
  commit: GitCommit, 
  index: number, 
  _totalCommits: number, 
  availableHeight: number, 
  padding: number
): number {
  // Define multiple lanes for different commit types
  const laneHeight = availableHeight / 4
  let baseLane = 1 // Middle lane by default
  
  // Assign lanes based on commit type and create branching patterns
  switch (commit.type) {
    case 'correction':
      baseLane = 0 // Top lane for corrections
      break
    case 'pause':
      baseLane = 3 // Bottom lane for pauses
      break
    case 'milestone':
      baseLane = 2 // Lower middle for milestones
      break
    default: // 'typing'
      // Dynamic lane switching for typing commits to create branching effect
      baseLane = 1 + Math.sin(index * 0.8) * 0.5 // Oscillate around middle
      break
  }
  
  // Add intensity-based vertical variance
  const intensityVariance = (commit.intensity - 1) * 10
  
  // Add index-based spiral effect for visual interest
  const spiralEffect = Math.sin(index * 0.4) * 8
  
  // Calculate final position
  let y = padding + (baseLane * laneHeight) + intensityVariance + spiralEffect
  
  // Add random jitter for organic feel (but keep it consistent per commit)
  const jitter = (Math.sin(commit.timestamp * 0.001) * 12)
  y += jitter
  
  return y
}


function generateBranches(commits: GitCommit[]): GitBranch[] {
  const branches: GitBranch[] = []
  let branchId = 0
  
  for (let i = 0; i < commits.length - 1; i++) {
    const currentCommit = commits[i]
    const nextCommit = commits[i + 1]
    
    // Determine branch type based on commit types
    let branchType: GitBranch['type'] = 'main'
    if (currentCommit.type === 'correction' || nextCommit.type === 'correction') {
      branchType = 'correction'
    } else if (currentCommit.type === 'milestone' || nextCommit.type === 'milestone') {
      branchType = 'merge'
    }
    
    // Calculate branch intensity based on commit intensities
    const intensity = (currentCommit.intensity + nextCommit.intensity) / 2
    
    branches.push({
      id: `branch-${branchId++}`,
      fromCommit: currentCommit.id,
      toCommit: nextCommit.id,
      type: branchType,
      intensity
    })
  }
  
  return branches
}