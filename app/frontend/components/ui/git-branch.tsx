import type { GitBranch as GitBranchType, GitCommit } from '@/types'

interface GitBranchProps {
  branch: GitBranchType
  commits: GitCommit[]
  isActive?: boolean
}

export function GitBranch({ branch, commits, isActive = false }: GitBranchProps) {
  const fromCommit = commits.find(c => c.id === branch.fromCommit)
  const toCommit = commits.find(c => c.id === branch.toCommit)

  if (!fromCommit || !toCommit) {
    return null
  }

  const getBranchColor = () => {
    switch (branch.type) {
      case 'main':
        return isActive ? '#16a34a' : '#22c55e'
      case 'correction':
        return isActive ? '#dc2626' : '#ef4444'
      case 'merge':
        return isActive ? '#2563eb' : '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  const getBranchWidth = () => {
    const baseWidth = 1.5
    const intensityMultiplier = Math.max(0.8, Math.min(4, branch.intensity))
    return baseWidth * intensityMultiplier * (isActive ? 1.8 : 1)
  }

  const generateSmoothPath = () => {
    const startX = fromCommit.position.x
    const startY = fromCommit.position.y
    const endX = toCommit.position.x
    const endY = toCommit.position.y

    // Calculate control points for smooth curves
    const deltaX = endX - startX
    const deltaY = endY - startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance < 10) {
      // Very short distance, use straight line
      return `M ${startX} ${startY} L ${endX} ${endY}`
    }

    // Create smooth curve with control points
    const controlOffset = Math.min(distance / 3, 50)
    const control1X = startX + controlOffset
    const control1Y = startY
    const control2X = endX - controlOffset
    const control2Y = endY

    return `M ${startX} ${startY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${endX} ${endY}`
  }

  return (
    <g className="git-branch">
      {/* Background shadow for depth */}
      <path
        d={generateSmoothPath()}
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth={getBranchWidth() + 1}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(1, 1)"
      />
      
      {/* Main branch line with enhanced styling */}
      <path
        d={generateSmoothPath()}
        stroke={getBranchColor()}
        strokeWidth={getBranchWidth()}
        fill="none"
        opacity={isActive ? 0.95 : 0.8}
        className="transition-all duration-300"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))'
        }}
      />
      
      {/* Enhanced activity indicator for high-intensity branches */}
      {branch.intensity > 1.8 && (
        <>
          <path
            d={generateSmoothPath()}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth={getBranchWidth() * 0.4}
            fill="none"
            className="animate-pulse"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {branch.intensity > 2.5 && (
            <path
              d={generateSmoothPath()}
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth={getBranchWidth() * 0.2}
              fill="none"
              className="animate-pulse"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animationDelay: '0.5s' }}
            />
          )}
        </>
      )}
    </g>
  )
}