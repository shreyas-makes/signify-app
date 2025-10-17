import { Head, router } from '@inertiajs/react'
import { 
  Activity,
  ArrowLeft, 
  BarChart3,
  Download,
  Loader2,
  Shield
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'


import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GitCommitGraph } from '@/components/ui/git-commit-graph'
import { KeystrokeReplay } from '@/components/ui/keystroke-replay'
import { VerifiedSessionCard } from '@/components/verified-session-card'
import type { Keystroke, TimelineEvent, TypingStatistics } from '@/types'

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('') || 'WR'
}

function formatDuration(seconds: number) {
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

interface Author {
  display_name: string
}

interface Verification {
  keystroke_verified: boolean
  total_keystrokes: number
}

interface Post {
  id: number
  title: string
  content: string
  public_slug: string
  published_at: string
  word_count: number
  reading_time_minutes: number
  keystroke_count: number
  author: Author
  verification: Verification
}

interface MetaTags {
  title: string
  description: string
  author: string
  published_time: string
  canonical_url: string
  og_title: string
  og_description: string
  og_url: string
  og_type: string
  twitter_card: string
}

interface KeystrokePagination {
  current_page: number
  has_more: boolean
  total_keystrokes: number
  per_page: number
}

interface Props {
  post: Post
  keystrokes: Keystroke[]
  meta: MetaTags
  pagination: KeystrokePagination
}

export default function PublicPostKeystrokes({ post, keystrokes, meta, pagination }: Props) {
  const [loadingMore, setLoadingMore] = useState(false)
  const [allKeystrokes, setAllKeystrokes] = useState<Keystroke[]>(keystrokes)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800)
  const heatmapWidth = windowWidth > 1024 ? 920 : Math.max(360, windowWidth - 80)
  const heatmapHeight = windowWidth > 768 ? 360 : 260

  // Handle window resize for responsive git graph
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load more keystrokes for complete replay
  const loadMoreKeystrokes = useCallback(async () => {
    if (!pagination.has_more || loadingMore) return
    
    setLoadingMore(true)
    try {
      const response = await fetch(`/posts/${post.public_slug}/keystrokes?page=${pagination.current_page + 1}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      
      if (response.ok) {
        const data = await response.json() as { keystrokes: Keystroke[] }
        setAllKeystrokes(prev => [...prev, ...data.keystrokes])
      }
    } catch (error) {
      console.error('Failed to load more keystrokes:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [post.public_slug, pagination.current_page, pagination.has_more, loadingMore])


  // Calculate typing statistics using all available keystrokes
  const statistics = useMemo((): TypingStatistics => {
    if (allKeystrokes.length === 0) {
      return {
        total_keystrokes: 0,
        average_wpm: 0,
        total_time_seconds: 0,
        pause_count: 0,
        backspace_count: 0,
        correction_count: 0
      }
    }

    const firstTimestamp = allKeystrokes[0].timestamp
    const lastTimestamp = allKeystrokes[allKeystrokes.length - 1].timestamp
    const totalTimeMs = lastTimestamp - firstTimestamp
    const totalTimeSeconds = totalTimeMs / 1000

    // Count backspaces and corrections
    const backspaceCount = allKeystrokes.filter(k => k.key_code === 8).length
    const correctionCount = allKeystrokes.filter(k => k.event_type === 'keydown' && k.key_code === 8).length

    // Calculate pauses (gaps > 2 seconds between keystrokes)
    let pauseCount = 0
    for (let i = 1; i < allKeystrokes.length; i++) {
      const timeDiff = allKeystrokes[i].timestamp - allKeystrokes[i - 1].timestamp
      if (timeDiff > 2000) { // 2 seconds
        pauseCount++
      }
    }

    // Calculate WPM based on word count and time
    const averageWpm = totalTimeSeconds > 0 ? (post.word_count / totalTimeSeconds) * 60 : 0

    return {
      total_keystrokes: allKeystrokes.length,
      average_wpm: Math.round(averageWpm),
      total_time_seconds: Math.round(totalTimeSeconds),
      pause_count: pauseCount,
      backspace_count: backspaceCount,
      correction_count: correctionCount
    }
  }, [allKeystrokes, post.word_count])

  const authorInitials = useMemo(() => getInitials(post.author.display_name), [post.author.display_name])

  const sessionMeta = useMemo(() => {
    const details = [`${statistics.total_keystrokes.toLocaleString()} verified keystrokes`]
    if (statistics.total_time_seconds > 0) {
      details.push(`replay ${formatDuration(statistics.total_time_seconds)}`)
    }
    return details.join(' | ')
  }, [statistics.total_keystrokes, statistics.total_time_seconds])

  const proofId = useMemo(() => `${post.public_slug}-${post.id}`, [post.public_slug, post.id])

  const snippetLines = useMemo(
    () => [
      <>
        <span className="text-sm font-medium text-foreground/90">Proof fingerprint</span>
        <span className="font-mono text-sm text-muted-foreground">{proofId}</span>
      </>,
      <>
        <span className="text-sm font-medium text-foreground/90">Keystrokes captured</span>
        <span className="font-semibold text-primary">
          {statistics.total_keystrokes.toLocaleString()}
        </span>
      </>,
      <>
        <span className="text-sm font-medium text-foreground/90">Integrity review</span>
        <span className="font-semibold text-chart-3">
          {post.verification.keystroke_verified ? 'Pass' : 'Pending'}
        </span>
      </>,
    ],
    [proofId, statistics.total_keystrokes, post.verification.keystroke_verified]
  )

  const snippetFooter = useMemo(() => {
    const details: string[] = []

    if (post.published_at) {
      const publishedDate = new Date(post.published_at)
      details.push(
        `Published ${publishedDate.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}`
      )
    }

    details.push(
      statistics.pause_count === 0
        ? 'No unusual pauses detected'
        : `${statistics.pause_count} thoughtful pause${statistics.pause_count === 1 ? '' : 's'}`
    )

    details.push(`${statistics.backspace_count} corrections`)

    if (statistics.average_wpm > 0) {
      details.push(`${statistics.average_wpm} WPM`)
    }

    return details.join(' · ')
  }, [post.published_at, statistics.pause_count, statistics.backspace_count, statistics.average_wpm])

  const excerpt = useMemo(() => {
    const stripped = post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (!stripped) return ''
    return stripped.length > 180 ? `${stripped.slice(0, 177)}…` : stripped
  }, [post.content])

  const timeline = useMemo(() => [
    {
      label: 'Total keystrokes',
      value: statistics.total_keystrokes.toLocaleString(),
      accent: 'from-primary to-chart-2'
    },
    {
      label: 'Corrections logged',
      value: statistics.correction_count.toLocaleString(),
      accent: 'from-accent to-chart-4'
    },
    {
      label: 'Replay length',
      value: statistics.total_time_seconds > 0 ? formatDuration(statistics.total_time_seconds) : 'under 1s',
      accent: 'from-secondary to-chart-3'
    }
  ], [statistics.total_keystrokes, statistics.correction_count, statistics.total_time_seconds])

  // Generate timeline events for visualization (use first chunk for performance)
  const timelineEvents = useMemo((): TimelineEvent[] => {
    const events: TimelineEvent[] = []
    let currentEvent: TimelineEvent | null = null
    const sampleKeystrokes = allKeystrokes.slice(0, 500) // Limit for performance
    
    for (let i = 0; i < sampleKeystrokes.length; i++) {
      const keystroke = sampleKeystrokes[i]
      const nextKeystroke = sampleKeystrokes[i + 1]
      
      if (keystroke.event_type === 'keydown') {
        // Determine if this is a correction (backspace)
        if (keystroke.key_code === 8) {
          events.push({
            timestamp: keystroke.timestamp,
            type: 'correction'
          })
        } else {
          // Regular typing
          if (!currentEvent || currentEvent.type !== 'typing') {
            currentEvent = {
              timestamp: keystroke.timestamp,
              type: 'typing',
              keystrokes: 1
            }
            events.push(currentEvent)
          } else {
            currentEvent.keystrokes = (currentEvent.keystrokes ?? 0) + 1
          }
        }

        // Check for pause after this keystroke
        if (nextKeystroke) {
          const timeDiff = nextKeystroke.timestamp - keystroke.timestamp
          if (timeDiff > 2000) { // 2 second pause threshold
            events.push({
              timestamp: keystroke.timestamp + 100, // Small offset
              type: 'pause',
              duration: timeDiff
            })
            currentEvent = null // Reset current event
          }
        }
      }
    }

    return events
  }, [allKeystrokes])


  // Download keystroke data as JSON
  const handleDownloadData = () => {
    const data = {
      post: {
        title: post.title,
        author: post.author.display_name,
        published_at: post.published_at,
        word_count: post.word_count
      },
      keystrokes: allKeystrokes,
      statistics: statistics,
      timeline_events: timelineEvents
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keystroke-data-${post.public_slug}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Head title={meta.title}>
        <meta name="description" content={meta.description} />
        <meta name="author" content={meta.author} />
        <meta property="og:title" content={meta.og_title} />
        <meta property="og:description" content={meta.og_description} />
        <meta property="og:url" content={meta.og_url} />
        <meta property="og:type" content={meta.og_type} />
        <meta name="twitter:card" content={meta.twitter_card} />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Navigation */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.visit(`/posts/${post.public_slug}`)}
              className="mb-4 border-border bg-background text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Post
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] xl:gap-10">
            <div>
              <div className="mb-4 flex items-start gap-3">
                <Badge 
                  variant="outline"
                  className="border-border bg-muted text-foreground hover:bg-muted"
                >
                  <Shield className="mr-1 h-3 w-3" />
                  Keystroke Verified
                </Badge>
                <Badge 
                  variant="outline"
                  className="border-border bg-background text-muted-foreground hover:bg-muted"
                >
                  <Activity className="mr-1 h-3 w-3" />
                  Live Replay
                </Badge>
              </div>
              
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                Keystroke Timeline: {post.title}
              </h1>
              <p className="text-muted-foreground">
                Let readers replay the real keystrokes that shaped this draft from {post.author.display_name}. It is proof that every sentence was written by hand.
              </p>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -top-6 right-0 hidden rounded-[28px] bg-gradient-to-br from-primary/25 via-accent/20 to-foreground/10 blur-3xl lg:block" />
              <VerifiedSessionCard
                initials={authorInitials}
                sessionMeta={sessionMeta}
                authenticityLabel={post.verification.keystroke_verified ? 'Verified' : 'Pending'}
                snippetTitle="Proof of authorship summary"
                snippetLines={snippetLines}
                snippetFooter={snippetFooter}
                excerpt={excerpt ? `“${excerpt}”` : undefined}
                timeline={timeline}
                className="relative z-10"
              />
            </div>
          </div>

          <div className="mb-10">
            <GitCommitGraph
              keystrokes={allKeystrokes}
              width={heatmapWidth}
              height={heatmapHeight}
              interactive={true}
              showStats={true}
              className="shadow-sm ring-1 ring-border/40"
            />
          </div>

          <div className="space-y-6">
            <KeystrokeReplay 
              keystrokes={allKeystrokes.map(k => ({
                id: k.id,
                event_type: k.event_type,
                key_code: k.key_code,
                character: k.character,
                timestamp: k.timestamp,
                sequence_number: k.sequence_number,
                cursor_position: k.cursor_position
              }))}
              title={post.title}
              finalContent={post.content}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleDownloadData} 
                    variant="outline" 
                    size="sm"
                    className="border-border bg-background text-foreground hover:bg-muted"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Complete Data (JSON)
                  </Button>
                  {pagination.has_more && (
                    <Button 
                      onClick={() => void loadMoreKeystrokes()} 
                      variant="outline" 
                      size="sm"
                      disabled={loadingMore}
                      className="border-border bg-background text-foreground hover:bg-muted disabled:opacity-50"
                    >
                      {loadingMore && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Load All Keystrokes ({pagination.total_keystrokes - allKeystrokes.length} more)
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Export includes complete keystroke timeline, statistics, and verification data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Event Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timelineEvents.slice(0, 10).map((event, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 rounded-lg border bg-muted p-2"
                    >
                      <div className={`h-3 w-3 rounded-full ${
                        event.type === 'typing' ? 'bg-foreground' :
                        event.type === 'pause' ? 'bg-foreground/60' : 'bg-border'
                      }`} />
                      <div className="flex-1 text-sm">
                        <span className="font-medium capitalize">{event.type}</span>
                        {event.keystrokes && <span className="ml-2 text-muted-foreground">({event.keystrokes} keys)</span>}
                        {event.duration && <span className="ml-2 text-muted-foreground">({(event.duration/1000).toFixed(1)}s)</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {timelineEvents.length > 10 && (
                    <div className="py-2 text-center text-sm text-muted-foreground">
                      ... and {timelineEvents.length - 10} more events
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
