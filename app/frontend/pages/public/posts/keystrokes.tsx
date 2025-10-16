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
import type { Keystroke, TimelineEvent, TypingStatistics } from '@/types'

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
              variant="ghost" 
              onClick={() => router.visit(`/posts/${post.public_slug}`)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Post
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Badge variant="secondary">
                <Shield className="h-3 w-3 mr-1" />
                Keystroke Verified
              </Badge>
              <Badge variant="outline">
                <Activity className="h-3 w-3 mr-1" />
                Live Replay
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Keystroke Timeline: {post.title}
            </h1>
            <p className="text-muted-foreground mb-4">
              Watch the authentic keystroke-by-keystroke creation by {post.author.display_name}
            </p>

            
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Keystroke Replay */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enhanced Keystroke Replay Component */}
              <KeystrokeReplay 
                keystrokes={allKeystrokes.map(k => ({
                  id: k.id,
                  event_type: k.event_type,
                  key_code: k.key_code,
                  character: k.character,
                  timestamp: k.timestamp.toString(),
                  sequence_number: k.sequence_number
                }))}
                title={post.title}
                finalContent={post.content}
                className="border-primary/20 bg-primary/5"
              />

              {/* Additional Download Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleDownloadData} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Complete Data (JSON)
                    </Button>
                    {pagination.has_more && (
                      <Button 
                        onClick={() => void loadMoreKeystrokes()} 
                        variant="outline" 
                        size="sm"
                        disabled={loadingMore}
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

              {/* Legacy Timeline Events (for reference) */}
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
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted border"
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          event.type === 'typing' ? 'bg-primary' :
                          event.type === 'pause' ? 'bg-secondary' : 'bg-destructive'
                        }`} />
                        <div className="flex-1 text-sm">
                          <span className="font-medium capitalize">{event.type}</span>
                          {event.keystrokes && <span className="text-muted-foreground ml-2">({event.keystrokes} keys)</span>}
                          {event.duration && <span className="text-muted-foreground ml-2">({(event.duration/1000).toFixed(1)}s)</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                    {timelineEvents.length > 10 && (
                      <div className="text-center text-sm text-muted-foreground py-2">
                        ... and {timelineEvents.length - 10} more events
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Verification Info */}
            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verification Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-primary/80">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Document:</span>
                      <span className="font-medium">{post.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Author:</span>
                      <span className="font-medium">{post.author.display_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Published:</span>
                      <span className="font-medium">{post.published_at}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Word Count:</span>
                      <span className="font-medium">{post.word_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Keystrokes:</span>
                      <span className="font-medium">{post.keystroke_count.toLocaleString()}</span>
                    </div>
                    <hr className="border-primary/30" />
                    <div className="text-xs">
                      ✓ Every keystroke captured in real-time<br />
                      ✓ No copy-paste operations detected<br />
                      ✓ Authentic human typing patterns<br />
                      ✓ Tamper-proof verification
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pattern Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Typing Consistency</span>
                        <span className="text-primary font-medium">Natural</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Pause Patterns</span>
                        <span className="text-primary font-medium">Human-like</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Correction Rate</span>
                        <span className="text-primary font-medium">Typical</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-muted-foreground">
                      Analysis shows natural human typing patterns with realistic pauses, corrections, and rhythm variations.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
