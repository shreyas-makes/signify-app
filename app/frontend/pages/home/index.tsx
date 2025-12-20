import { Head, Link, usePage } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GitCommitGraph } from '@/components/ui/git-commit-graph'
import { KeystrokeBarcode } from '@/components/ui/keystroke-barcode'
import { KeystrokeReplay } from '@/components/ui/keystroke-replay'
import { VerifiedSessionCard } from '@/components/verified-session-card'
import AppLogo from '@/components/app-logo'
import { dashboardPath, publicPostsPath, signInPath, signUpPath } from '@/routes'
import type { Keystroke, SharedData } from '@/types'

interface DemoAction {
  type: 'char' | 'backspace'
  value?: string
  delay: number
}

const demoBaseTimestamp = Date.parse('2024-01-04T16:00:00Z')

function buildDemoActionsFromText(text: string): DemoAction[] {
  const actions: DemoAction[] = []

  for (const character of text) {
    let delay = 90

    if (character === ' ') {
      delay = 140
    } else if (',;:'.includes(character)) {
      delay = 190
    } else if ('.!?'.includes(character)) {
      delay = 220
    }

    actions.push({ type: 'char', value: character, delay })
  }

  return actions
}

const demoText =
  'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness. ' +
  'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. ' +
  'All happy families are alike; each unhappy family is unhappy in its own way. ' +
  'There was no possibility of taking a walk that day.'
const demoActions: DemoAction[] = buildDemoActionsFromText(demoText)

const {
  keystrokes: replayDemoKeystrokes,
  finalContent: replayDemoFinalContent,
} = buildDemoKeystrokes(demoActions, demoBaseTimestamp)

const analyticsDemoKeystrokes = buildAnalyticsDemoKeystrokes(replayDemoKeystrokes, 4, 14000)
const dnaDemoKeystrokes = analyticsDemoKeystrokes.slice(0, 220)

export default function Welcome() {
  const page = usePage<SharedData>()
  const { auth } = page.props
  const analyticsGraphRef = useRef<HTMLDivElement | null>(null)
  const [analyticsGraphWidth, setAnalyticsGraphWidth] = useState(880)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const element = analyticsGraphRef.current
    if (!element) {
      return
    }

    const updateWidth = (nextWidth: number) => {
      const normalizedWidth = Math.max(1, Math.floor(nextWidth || 0))
      setAnalyticsGraphWidth((prev) => (Math.abs(prev - normalizedWidth) > 1 ? normalizedWidth : prev))
    }

    updateWidth(element.clientWidth)

    if ('ResizeObserver' in window && typeof window.ResizeObserver === 'function') {
      const observer = new window.ResizeObserver((entries) => {
        for (const entry of entries) {
          updateWidth(entry.contentRect.width)
        }
      })

      observer.observe(element)
      return () => observer.disconnect()
    }

    const handleResize = () => updateWidth(element.clientWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const analyticsGraphHeight = analyticsGraphWidth < 520 ? 220 : 280

  return (
    <>
      <Head title="Signify - Prove Your Words">
        <meta
          name="description"
          content="The writing platform that proves human authorship through keystroke verification. Write, publish, and share with complete authenticity."
        />
      </Head>

      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-3">
              <AppLogo
                showIcon={false}
                labelClassName="font-serif text-xl tracking-tight"
              />
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
              <Link href={publicPostsPath()} className="transition-colors hover:text-foreground">
                Explore Library
              </Link>
              <a href="#features" className="transition-colors hover:text-foreground">
                Platform
              </a>
              <a href="#get-started" className="transition-colors hover:text-foreground">
                Get started
              </a>
            </nav>

            <div className="flex items-center gap-2">
              {auth.user ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={dashboardPath()}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={signInPath()}>Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={signUpPath()}>Start for free</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main>
          <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/10">
            <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center blur-3xl">
              <div className="h-[260px] w-[420px] bg-gradient-to-r from-primary/35 via-accent/25 to-chart-2/20 opacity-60 sm:h-[400px] sm:w-[720px]" />
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-10 md:grid-cols-[minmax(0,1.1fr)_1fr] md:pt-16 lg:gap-16">
              <div className="min-w-0 space-y-4">
                <Badge
                  variant="secondary"
                  className="w-fit gap-2 text-xs font-semibold uppercase tracking-wide shadow-sm ring-1 ring-primary/15"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  Verified human authorship
                </Badge>
                <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  Prove every word you publish is unmistakably yours.
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                 Publish with a shareable proof that shows exactly how your story came to life—no AI, just you.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button size="lg" asChild className="group flex w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto">
                    <Link href={auth.user ? dashboardPath() : signUpPath()}>
                      {auth.user ? "Open dashboard" : "Start writing now"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  
                </div>

              </div>

              <div className="relative w-full min-w-0 max-w-full">
                <div className="absolute inset-0 -translate-x-6 rounded-[28px] bg-gradient-to-br from-primary/25 via-accent/30 to-foreground/10 blur-3xl" />
                <VerifiedSessionCard
                  initials="SJ"
                  sessionMeta="3 min ago | 1,348 keystrokes"
                  className="w-full max-w-full"
                />
              </div>
            </div>
          </section>

          <section className="border-b border-border py-14">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
              <div className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Trusted by teams safeguarding authentic voices
              </div>
              <div className="grid items-center justify-center gap-6 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-3 lg:grid-cols-6">
                <span>Literary Wave</span>
                <span>Archway Media</span>
                <span>Publisher Co</span>
                <span>Proof Labs</span>
                <span>Campus Writers</span>
                <span>Authentic Voice</span>
              </div>
            </div>
          </section>

          <section id="features" className="border-b border-border bg-background py-20">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4">
              <div className="max-w-2xl space-y-4">
                <Badge
                  variant="outline"
                  className="w-fit text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  Why teams choose Signify
                </Badge>
                <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                  100% human authorship for your published essays
                </h2>
                <p className="text-lg text-muted-foreground">
                  Capture the nuance of human drafting, verify originality in real time, and share transparent proof bundles with one link.
                </p>
              </div>

              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="flex h-full flex-col gap-6 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary">Keystroke DNA</span>
                      <h3 className="text-xl font-semibold text-foreground">See the human fingerprint in every draft.</h3>
                      <p className="text-sm text-muted-foreground">
                        Keystroke telemetry renders an immutable barcode of the writing session so reviewers can spot real authorship at a glance.
                      </p>
                    </div>
                    <KeystrokeBarcode keystrokes={dnaDemoKeystrokes} className="rounded-2xl shadow-sm" />
                    <p className="text-xs text-muted-foreground">
                      Sample session | {dnaDemoKeystrokes.length.toLocaleString()} keystrokes captured across focused drafting bursts.
                    </p>
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-8">
                  <div className="max-w-2xl space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">Immersive replays</span>
                    <h3 className="text-xl font-semibold text-foreground">Walk readers through every decision.</h3>
                    <p className="text-sm text-muted-foreground">
                      Let collaborators scrub through the draft exactly as it unfolded&mdash;pauses, edits, corrections, and all.
                    </p>
                  </div>
                  <KeystrokeReplay
                    keystrokes={replayDemoKeystrokes}
                    finalContent={replayDemoFinalContent}
                    title="Demo draft: human hands draft every line"
                    autoPlayOnView
                    className="border border-border/60 bg-background/95 shadow-md ring-1 ring-border/40"
                  />
                </div>

                <div className="space-y-6 lg:col-span-12">
                  <div className="max-w-3xl space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">Live analytics</span>
                    <h3 className="text-xl font-semibold text-foreground">Spot authenticity trends in real time.</h3>
                    <p className="text-sm text-muted-foreground">
                      Aggregate keystroke evidence to surface writing velocity, focus breaks, and correction patterns across your entire team.
                    </p>
                  </div>
                  <div ref={analyticsGraphRef} className="w-full">
                    <GitCommitGraph
                      keystrokes={analyticsDemoKeystrokes}
                      width={analyticsGraphWidth}
                      height={analyticsGraphHeight}
                      interactive={false}
                      className="shadow-md ring-1 ring-border/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="get-started"
            className="border-t border-border bg-muted/60 py-20"
          >
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 text-center">
              <Badge
                variant="outline"
                className="w-fit text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Join the proof
              </Badge>
              <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
                Ready to start publishing essays?
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button size="lg" asChild>
                  <Link href={auth.user ? dashboardPath() : signUpPath()}>
                    {auth.user ? 'Go to dashboard' : 'Start writing'}
                  </Link>
                </Button>
              </div>
            </div>
          </section>

        </main>

        <footer className="border-t border-border bg-background py-12 text-sm text-muted-foreground">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-serif text-lg tracking-tight text-foreground">Signify</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Authenticity for writers</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={publicPostsPath()} className="transition-colors hover:text-foreground">
                Explore
              </Link>
              <a href="/legal/privacy" className="transition-colors hover:text-foreground">
                Privacy
              </a>
              <a href="/legal/terms" className="transition-colors hover:text-foreground">
                Terms
              </a>
              <a href="/support/contact" className="transition-colors hover:text-foreground">
                Contact
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Signify. Proof that every story is human.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

function buildDemoKeystrokes(actions: DemoAction[], baseTimestamp: number): {
  keystrokes: Keystroke[]
  finalContent: string
} {
  const keystrokes: Keystroke[] = []
  let timestamp = baseTimestamp
  let sequence = 1
  let content = ''

  for (const action of actions) {
    timestamp += Math.max(action.delay, 16)

    if (action.type === 'char' && typeof action.value === 'string') {
      const cursorPosition = content.length
      keystrokes.push({
        id: sequence,
        event_type: 'keydown',
        key_code: charToKeyCode(action.value),
        character: action.value,
        timestamp,
        cursor_position: cursorPosition,
        sequence_number: sequence,
      })
      content = content.slice(0, cursorPosition) + action.value + content.slice(cursorPosition)
      sequence += 1
      continue
    }

    if (action.type === 'backspace') {
      const cursorPosition = Math.max(0, content.length)
      keystrokes.push({
        id: sequence,
        event_type: 'keydown',
        key_code: 8,
        character: '\b',
        timestamp,
        cursor_position: cursorPosition,
        sequence_number: sequence,
      })
      if (cursorPosition > 0) {
        content = content.slice(0, cursorPosition - 1) + content.slice(cursorPosition)
      }
      sequence += 1
    }
  }

  return { keystrokes, finalContent: content }
}

function buildAnalyticsDemoKeystrokes(
  baseKeystrokes: Keystroke[],
  loops = 3,
  spacingMs = 12000,
): Keystroke[] {
  if (baseKeystrokes.length === 0) {
    return []
  }

  const expanded: Keystroke[] = []
  let sequence = 1
  const baseStart = baseKeystrokes[0].timestamp

  for (let loop = 0; loop < loops; loop += 1) {
    const speedMultiplier = 1 + loop * 0.25
    const offset = loop * spacingMs

    for (const base of baseKeystrokes) {
      const offsetFromStart = base.timestamp - baseStart
      const scaledOffset = Math.round(offsetFromStart / speedMultiplier)
      expanded.push({
        ...base,
        id: sequence,
        sequence_number: sequence,
        timestamp: baseStart + offset + scaledOffset,
      })
      sequence += 1
    }
  }

  return expanded
}

function charToKeyCode(character: string): number {
  if (!character) {
    return 0
  }

  if (character === ' ') return 32
  if (character === '.') return 190
  if (character === ',') return 188
  if (character === '-') return 189

  const upper = character.toUpperCase()
  return upper.charCodeAt(0)
}
