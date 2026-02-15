import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, BarChart3, CheckCircle2, ClipboardList, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GitCommitGraph } from '@/components/ui/git-commit-graph'
import { VerifiedSessionCard } from '@/components/verified-session-card'
import PublicLayout from '@/layouts/public-layout'
import { buildTimelineEvents, calculateTypingStatistics } from '@/lib/keystroke-analytics'
import { formatDateTime, formatDuration, getInitials } from '@/lib/proof-formatters'
import type { Keystroke, TimelineEvent, TypingStatistics } from '@/types'

interface Verification {
  id: string
  status: 'human_written' | 'mixed'
  platform: string
  created_at: string
  start_at?: string | null
  end_at?: string | null
  duration_seconds?: number | null
  paste: {
    occurred: boolean
    count: number
  }
  keystroke_stats: Record<string, unknown>
  author: {
    display_name: string
    username: string
    profile_url: string
  }
}

interface MetaTags {
  title: string
  description: string
  canonical_url: string
  author: string
}

interface Props {
  verification: Verification
  keystrokes: Keystroke[]
  meta: MetaTags
}

export default function PublicVerificationShow({ verification, keystrokes, meta }: Props) {
  const isMixed = verification.status === 'mixed'
  const statusLabel = isMixed ? 'Mixed' : 'Human Written'
  const statusDescription = isMixed
    ? 'Paste activity was detected during drafting.'
    : 'No paste activity was detected during drafting.'
  const totalKeystrokes = useMemo(() => (
    verification.keystroke_stats?.total_keystrokes ??
    verification.keystroke_stats?.totalKeystrokes ??
    verification.keystroke_stats?.keystrokes
  ) as number | undefined, [verification.keystroke_stats])
  const authorInitials = useMemo(() => getInitials(verification.author.display_name), [verification.author.display_name])
  const sessionMeta = useMemo(() => {
    const details = []
    if (typeof totalKeystrokes === 'number') {
      details.push(`${totalKeystrokes.toLocaleString()} keystrokes`)
    }
    if (verification.duration_seconds) {
      details.push(formatDuration(verification.duration_seconds))
    }
    return details.join(' · ')
  }, [totalKeystrokes, verification.duration_seconds])
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800)
  const heatmapWidth = Math.min(920, Math.max(260, windowWidth - 48))
  const heatmapHeight = windowWidth > 768 ? 360 : 260

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const statistics = useMemo<TypingStatistics>(
    () => calculateTypingStatistics(keystrokes),
    [keystrokes]
  )
  const timelineEvents = useMemo<TimelineEvent[]>(
    () => buildTimelineEvents(keystrokes),
    [keystrokes]
  )
  const snippetLines = useMemo(() => ([
    <>
      <span className="text-sm font-medium text-foreground/90">Proof fingerprint</span>
      <span className="font-mono text-sm text-muted-foreground">{verification.id}</span>
    </>,
    <>
      <span className="text-sm font-medium text-foreground/90">Keystrokes captured</span>
      <span className="font-semibold text-primary">
        {typeof totalKeystrokes === 'number' ? totalKeystrokes.toLocaleString() : 'Not provided'}
      </span>
    </>,
    <>
      <span className="text-sm font-medium text-foreground/90">Integrity review</span>
      <span className={`font-semibold ${isMixed ? 'text-chart-2' : 'text-chart-3'}`}>
        {isMixed ? 'Mixed' : 'Pass'}
      </span>
    </>,
  ]), [verification.id, totalKeystrokes, isMixed])
  const snippetFooter = useMemo(() => {
    const details = [
      `Created ${formatDateTime(verification.created_at)}`,
      verification.paste.occurred
        ? `${verification.paste.count} paste event${verification.paste.count === 1 ? '' : 's'}`
        : 'No paste detected',
    ]
    return details.join(' · ')
  }, [verification.created_at, verification.paste.count, verification.paste.occurred])

  return (
    <>
      <Head title={meta.title}>
        <meta name="description" content={meta.description} />
        <meta name="author" content={meta.author} />
        <link rel="canonical" href={meta.canonical_url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical_url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>

      <PublicLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => router.visit(verification.author.profile_url)}
                className="mb-4 border-border bg-background text-foreground hover:bg-muted"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {verification.author.display_name}
              </Button>
            </div>

            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <Badge variant={isMixed ? 'secondary' : 'default'} className="mb-3 inline-flex items-center gap-2 px-3 py-1 text-sm">
                  {isMixed ? <TriangleAlert className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {statusLabel}
                </Badge>
                <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  Proof of human authorship
                </h1>
                <p className="mt-2 text-base text-muted-foreground">
                  {statusDescription}
                </p>
              </div>
              <span className="hidden text-xs uppercase tracking-[0.25em] text-muted-foreground md:block">
                Session proof
              </span>
            </div>

            <div className="mb-10 flex justify-center">
              <div className="relative w-full max-w-2xl">
                <div className="pointer-events-none absolute inset-0 -top-6 right-0 hidden rounded-[28px] bg-gradient-to-br from-primary/25 via-accent/20 to-foreground/10 blur-3xl lg:block" />
                <VerifiedSessionCard
                  initials={authorInitials}
                  sessionStatus={`${verification.author.display_name} · ${verification.platform}`}
                  sessionMeta={sessionMeta}
                  authenticityLabel={isMixed ? 'Mixed' : 'Verified'}
                  snippetLines={snippetLines}
                  snippetFooter={snippetFooter}
                  className="relative z-10 mx-auto"
                />
              </div>
            </div>

            <div className="mb-10">
              <GitCommitGraph
                keystrokes={keystrokes}
                width={heatmapWidth}
                height={heatmapHeight}
                interactive={true}
                showStats={true}
                className="shadow-sm ring-1 ring-border/40"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Draft timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Start</p>
                    <p className="mt-2 text-sm font-medium text-foreground">{formatDateTime(verification.start_at)}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">End</p>
                    <p className="mt-2 text-sm font-medium text-foreground">{formatDateTime(verification.end_at)}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Duration</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {verification.duration_seconds ? formatDuration(verification.duration_seconds) : 'Not provided'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Keystrokes</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {typeof totalKeystrokes === 'number' ? totalKeystrokes.toLocaleString() : 'Not provided'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Verification signals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <span>Paste events</span>
                    <span className="font-medium text-foreground">
                      {verification.paste.occurred ? verification.paste.count : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <span>Status</span>
                    <span className="font-medium text-foreground">{statusLabel}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <span>Scope</span>
                    <span className="font-medium text-foreground">Twitter/X composer only</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <span>Data stored</span>
                    <span className="font-medium text-foreground">Keystroke timeline</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <span>Total keystrokes</span>
                    <span className="font-medium text-foreground">{statistics.total_keystrokes.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Event summary
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

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/posts">Explore public posts</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={verification.author.profile_url}>See more proofs</Link>
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  )
}
