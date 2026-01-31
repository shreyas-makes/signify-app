export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('') || 'WR'
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return 'under 1s'
  }

  const totalSeconds = Math.round(seconds)
  const minutes = Math.floor(totalSeconds / 60)
  const remainderSeconds = Math.max(0, totalSeconds % 60)

  if (minutes === 0) {
    return `${remainderSeconds}s`
  }

  return `${minutes}m ${remainderSeconds.toString().padStart(2, '0')}s`
}

export function formatDateTime(value?: string | null) {
  if (!value) return 'Not provided'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return value
  return parsed.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
