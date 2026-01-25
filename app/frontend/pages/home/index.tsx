import { Head, Link, usePage } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { KeystrokeBarcode } from '@/components/ui/keystroke-barcode'
import { KeystrokeReplay } from '@/components/ui/keystroke-replay'
import PublicLayout from '@/layouts/public-layout'
import { dashboardPath, publicPostsPath, rootPath, signUpPath } from '@/routes'
import type { Keystroke, SharedData } from '@/types'

interface DemoAction {
  type: 'char' | 'backspace'
  value?: string
  delay: number
}

const demoBaseTimestamp = Date.parse('2024-01-04T16:00:00Z')

function buildHumanDemoActions(): DemoAction[] {
  const actions: DemoAction[] = []
  const jitterPattern = [-18, -8, 0, 6, 14, -5, 11, -12, 4, 0]
  let actionIndex = 0
  let delayBoost = 0

  const pushChar = (character: string) => {
    let delay = 90

    if (character === ' ') {
      delay = 135
    } else if (',;:'.includes(character)) {
      delay = 210
    } else if ('.!?'.includes(character)) {
      delay = 320
    } else if (character === '\n') {
      delay = 360
    }

    delay += jitterPattern[actionIndex % jitterPattern.length]

    if (delayBoost > 0) {
      delay += delayBoost
      delayBoost = 0
    }

    actions.push({ type: 'char', value: character, delay: Math.max(40, delay) })
    actionIndex += 1
  }

  const pushText = (text: string) => {
    for (const character of text) {
      pushChar(character)
    }
  }

  const addPause = (durationMs: number) => {
    delayBoost += durationMs
  }

  const addBackspaces = (count: number, delay = 120) => {
    for (let i = 0; i < count; i += 1) {
      const jitter = jitterPattern[actionIndex % jitterPattern.length]
      actions.push({ type: 'backspace', delay: Math.max(45, delay + jitter) })
      actionIndex += 1
    }
  }

  pushText('It was the best of times, ')
  addPause(420)
  pushText('it was the ')
  pushText('worsst')
  addBackspaces(3)
  pushText('st')
  addPause(380)
  pushText(' of times. ')
  addPause(620)
  pushText('It is a truth universallyy')
  addBackspaces(1)
  pushText(' acknowledged, that a single man in possession of a good fortune, must be in want of a wife. ')
  addPause(520)
  pushText('All happy families are alike; each unhappy family is unhappy in its own way.')

  return actions
}

const demoActions: DemoAction[] = buildHumanDemoActions()

const {
  keystrokes: replayDemoKeystrokes,
  finalContent: replayDemoFinalContent,
} = buildDemoKeystrokes(demoActions, demoBaseTimestamp)

const analyticsDemoKeystrokes = buildAnalyticsDemoKeystrokes(replayDemoKeystrokes, 4, 14000)
const dnaDemoKeystrokes = analyticsDemoKeystrokes.slice(0, 220)

export default function Welcome() {
  const page = usePage<SharedData>()
  const { auth } = page.props
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)
  const heroLoopTimeoutRef = useRef<number | null>(null)
  const heroPlayAttemptsRef = useRef(0)
  const [heroAspectRatio, setHeroAspectRatio] = useState<number | null>(null)
  const [heroVideoReady, setHeroVideoReady] = useState(false)

  const requestHeroPlay = () => {
    const video = heroVideoRef.current
    if (!video) {
      return
    }
    if (!video.muted) {
      video.muted = true
    }
    const playPromise = video.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {})
    }

    if (video.paused && heroPlayAttemptsRef.current < 4) {
      heroPlayAttemptsRef.current += 1
      window.setTimeout(() => {
        requestHeroPlay()
      }, 350)
    }
  }

  useEffect(() => {
    requestHeroPlay()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestHeroPlay()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (heroLoopTimeoutRef.current !== null) {
        window.clearTimeout(heroLoopTimeoutRef.current)
        heroLoopTimeoutRef.current = null
      }
    }
  }, [])

  const handleHeroMetadata = () => {
    const video = heroVideoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      return
    }
    setHeroAspectRatio(video.videoWidth / video.videoHeight)
    if (Number.isFinite(video.duration) && video.duration > 0.4) {
      const startAt = Math.min(1.2, Math.max(0.35, video.duration * 0.06))
      video.currentTime = startAt
    }
    requestHeroPlay()
  }

  const handleHeroTimeUpdate = () => {
    const video = heroVideoRef.current
    if (!video) {
      return
    }
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return
    }
    if (video.currentTime < video.duration - 0.08) {
      return
    }
    if (heroLoopTimeoutRef.current !== null) {
      return
    }
    video.pause()
    heroLoopTimeoutRef.current = window.setTimeout(() => {
      heroLoopTimeoutRef.current = null
      video.currentTime = 0
      requestHeroPlay()
    }, 2500)
  }

  const handleHeroCanPlay = () => {
    requestHeroPlay()
  }

  const handleHeroPlaying = () => {
    setHeroVideoReady(true)
  }

  return (
    <>
      <Head title="Signify - Human Stories & Ideas">
        <meta
          name="description"
          content="A home for human stories and ideas. Share your voice, earn trust, and build a readership that knows your words are real."
        />
      </Head>

      <PublicLayout footerVariant="gradient">
        <main>
          <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-rose-100/60 via-background to-sky-100/70 pt-8 sm:pt-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/2 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,207,232,0.75),rgba(253,230,138,0.6),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-28%] left-[-10%] h-[320px] w-[520px] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.75),rgba(186,230,253,0.55),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-38%] right-[-12%] h-[360px] w-[520px] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(254,215,170,0.8),rgba(253,186,116,0.5),transparent_70%)] blur-3xl" />
            </div>

            <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-4 pb-16 pt-6 text-center md:min-h-[68vh] md:pt-10">
              <div className="min-w-0 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Proof of human writing
                </div>
                <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Publish writing with a proof-of-human signature.
                </h1>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Turn finished drafts into published posts with a cryptographic signature that proves a human wrote it.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                    <Button size="lg" asChild className="group w-full gap-2 rounded-full sm:w-auto">
                      <Link href={auth.user ? dashboardPath() : signUpPath()}>
                        {auth.user ? 'Open dashboard' : 'Start writing'}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                    <Button size="lg" asChild className="w-full rounded-full sm:w-auto">
                      <Link href={publicPostsPath()}>Explore</Link>
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="w-full rounded-full sm:w-auto"
                    >
                      <Link href={`${rootPath()}#features`}>How it works</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 sm:text-left">
                  {[
                    'Verify authorship in real time.',
                    'Share proof bundles instantly.',
                    'Publish with full trust.',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-4xl">
                <div
                  className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-border/50 bg-transparent shadow-[0_28px_70px_rgba(15,23,42,0.18)]"
                  style={heroAspectRatio ? { aspectRatio: `${heroAspectRatio}` } : undefined}
                >
                  <video
                    ref={heroVideoRef}
                    className="h-full w-full scale-[0.96] object-contain"
                    autoPlay
                    muted
                    defaultMuted
                    playsInline
                    preload="metadata"
                    poster="/hero-remotion-poster.jpg"
                    onLoadedMetadata={handleHeroMetadata}
                    onLoadedData={handleHeroCanPlay}
                    onCanPlay={handleHeroCanPlay}
                    onPlaying={handleHeroPlaying}
                    onTimeUpdate={handleHeroTimeUpdate}
                  >
                    <source src="/hero-remotion.webm" type="video/webm" />
                    <source src="/hero-remotion.mp4" type="video/mp4" />
                  </video>
                  {!heroVideoReady ? (
                    <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.4em] text-muted-foreground">
                      Loading
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-rose-100/60 via-background to-sky-100/70">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/2 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,207,232,0.75),rgba(253,230,138,0.6),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-28%] left-[-10%] h-[320px] w-[520px] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.75),rgba(186,230,253,0.55),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-38%] right-[-12%] h-[360px] w-[520px] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(254,215,170,0.8),rgba(253,186,116,0.5),transparent_70%)] blur-3xl" />
            </div>
            <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-12 md:grid-cols-[minmax(0,1.1fr)_1fr] md:pt-16 lg:gap-16">
              <div className="min-w-0 space-y-4">
                <Badge
                  variant="secondary"
                  className="w-fit gap-2 text-xs font-semibold uppercase tracking-wide shadow-sm ring-1 ring-primary/15"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  Verified human authorship
                </Badge>
                <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Prove every word you publish is unmistakably yours.
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Publish with a shareable proof that shows exactly how your story came to life - no AI, just you.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button size="lg" asChild className="group flex w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto">
                    <Link href={auth.user ? dashboardPath() : signUpPath()}>
                      {auth.user ? 'Open dashboard' : 'Start writing now'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative w-full min-w-0 max-w-full">
                <div className="relative space-y-5 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur sm:p-8">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Keystrokes are analyzed to generate a signature that is uniquely yours.
                  </p>

                  <div className="scroll-preview h-[240px] rounded-2xl border border-border/60 bg-background/85 p-4 shadow-sm sm:h-[280px] md:h-[320px]">
                    <div className="relative z-10 -mx-4 -mt-4 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-gradient-to-r from-primary/15 via-background/95 to-accent/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80 shadow-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                        Draft essay
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/95 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/80" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                        Live
                      </span>
                    </div>
                    <div className="scroll-preview-inner relative z-0 mt-2 text-sm leading-relaxed text-foreground/80">
                      {Array.from({ length: 2 }).map((_, segmentIndex) => (
                        <div key={`draft-${segmentIndex}`} className="scroll-preview-segment">
                          <p>
                            In the quiet hours between edits, the draft becomes a map of intent - sentences
                            rerouted, verbs tightened, the cadence returning to something unmistakably human.
                          </p>
                          <p>
                            Each revision leaves a visible trace, a rhythm of decisions that can be replayed and
                            verified without losing the intimacy of the original voice.
                          </p>
                          <p>
                            Margins fill with alternate lines, and the story learns its shape through small
                            reversals, pauses, and a renewed confidence in the final cadence.
                          </p>
                          <p>
                            What remains is a story built by hand: imperfect, deliberate, and undeniably yours.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/85 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      <span>Signature</span>
                      <span className="font-mono text-[10px]">Generated</span>
                    </div>
                    <div className="mt-4 rounded-xl border border-border/50 bg-background/90 p-4">
                      <svg viewBox="0 0 260 60" className="h-12 w-full text-foreground/70" aria-hidden="true">
                        <path
                          className="signature-path"
                          d="M10 40C30 20 46 52 64 38C82 24 92 20 108 34C124 48 140 18 156 32C172 46 186 14 202 28C218 42 232 24 248 18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        Unique rhythm imprint
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="features"
            className="relative overflow-hidden border-b border-border bg-gradient-to-br from-rose-100/60 via-background to-sky-100/70 py-20"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/2 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,207,232,0.75),rgba(253,230,138,0.6),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-28%] left-[-10%] h-[320px] w-[520px] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.75),rgba(186,230,253,0.55),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-38%] right-[-12%] h-[360px] w-[520px] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(254,215,170,0.8),rgba(253,186,116,0.5),transparent_70%)] blur-3xl" />
            </div>
            <div className="relative z-10 mx-auto flex w-full max-w-none flex-col gap-16 px-4 sm:max-w-6xl">
              <div className="max-w-none space-y-4 sm:max-w-2xl">
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
                <div className="min-w-0 lg:col-span-4">
                  <div className="flex h-full w-full min-w-0 flex-col gap-6 overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary">Keystroke DNA</span>
                      <h3 className="text-xl font-semibold text-foreground">See the human fingerprint in every draft.</h3>
                      <p className="text-sm text-muted-foreground">
                        Keystroke telemetry renders an immutable barcode of the writing session so reviewers can spot real authorship at a glance.
                      </p>
                    </div>
                    <KeystrokeBarcode
                      keystrokes={dnaDemoKeystrokes}
                      className="w-full max-w-full rounded-2xl shadow-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Sample session | {dnaDemoKeystrokes.length.toLocaleString()} keystrokes captured across focused drafting bursts.
                    </p>
                  </div>
                </div>

                <div className="min-w-0 space-y-6 lg:col-span-8">
                  <div className="max-w-none space-y-2 sm:max-w-2xl">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">Immersive replays</span>
                    <h3 className="text-xl font-semibold text-foreground">Walk readers through every decision.</h3>
                  </div>
                  <KeystrokeReplay
                    keystrokes={replayDemoKeystrokes}
                    finalContent={replayDemoFinalContent}
                    title="Demo draft: human hands draft every line"
                    autoPlayOnView
                    showStats={false}
                    className="w-full max-h-[340px] overflow-hidden border border-border/60 bg-background/95 shadow-md ring-1 ring-border/40 sm:max-h-[360px] md:max-h-[420px] lg:max-h-none"
                  />
                </div>

              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-gradient-to-br from-rose-100/60 via-background to-sky-100/70 py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/2 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,207,232,0.75),rgba(253,230,138,0.6),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-28%] left-[-10%] h-[320px] w-[520px] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.75),rgba(186,230,253,0.55),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-38%] right-[-12%] h-[360px] w-[520px] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(254,215,170,0.8),rgba(253,186,116,0.5),transparent_70%)] blur-3xl" />
            </div>
            <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Ready to publish</p>
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                Build trust with every story you share.
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Start drafting, capture human proof, and publish with confidence in minutes.
              </p>
              <Button size="lg" asChild className="group rounded-full px-8">
                <Link href={auth.user ? dashboardPath() : signUpPath()}>
                  {auth.user ? 'Open dashboard' : 'Start writing now'}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </section>
        </main>
      </PublicLayout>
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
