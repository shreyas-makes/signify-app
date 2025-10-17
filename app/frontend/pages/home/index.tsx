import { Head, Link, usePage } from '@inertiajs/react'
import {
  ArrowRight,
  Fingerprint,
  LineChart,
  PenTool,
  Play,
  Sparkles,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { VerifiedSessionCard } from '@/components/verified-session-card'
import { dashboardPath, publicPostsPath, signInPath, signUpPath } from '@/routes'
import type { SharedData } from '@/types'

export default function Welcome() {
  const page = usePage<SharedData>()
  const { auth } = page.props

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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary via-accent to-chart-2 text-primary-foreground shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Signify</span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
              <Link href={publicPostsPath()} className="transition-colors hover:text-foreground">
                Explore Library
              </Link>
              <a href="#how-it-works" className="transition-colors hover:text-foreground">
                How it Works
              </a>
              <a href="#features" className="transition-colors hover:text-foreground">
                Platform
              </a>
              <a href="#security" className="transition-colors hover:text-foreground">
                Proof
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
              <div className="h-[400px] w-[720px] bg-gradient-to-r from-primary/35 via-accent/25 to-chart-2/20 opacity-60" />
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-24 pt-20 md:grid-cols-[minmax(0,1.1fr)_1fr] md:pt-28 lg:gap-16">
              <div className="space-y-8">
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
                  Signify traces every keystroke while you draft so editors, readers, and platforms feel the human craft in your words. Publish with a shareable proof that shows exactly how your story came to life—no AI, just you.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button size="lg" asChild className="group flex w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto">
                    <Link href={auth.user ? dashboardPath() : signUpPath()}>
                      {auth.user ? "Open dashboard" : "Start writing now"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="flex w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto">
                    <Link href={publicPostsPath()}>
                      <Play className="h-4 w-4" />
                      Watch writing replay
                    </Link>
                  </Button>
                </div>

              </div>

              <div className="relative">
                <div className="absolute inset-0 -translate-x-6 rounded-[28px] bg-gradient-to-br from-primary/25 via-accent/30 to-foreground/10 blur-3xl" />
                <VerifiedSessionCard
                  initials="SJ"
                  sessionMeta="3 min ago · 1,348 keystrokes"
                  previewHeading="Feature draft preview"
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
                  A verification layer designed for creative and compliance teams alike.
                </h2>
                <p className="text-lg text-muted-foreground">
                  Capture the nuance of human drafting, verify originality in real time, and share transparent proof bundles with one link.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={<Fingerprint className="h-5 w-5 text-primary" />}
                  title="Keystroke DNA"
                  description="Millisecond-level capture creates a biometric map of intent that is impossible to spoof."
                  details={["Immutable session hashes", "Cryptographic signatures", "Tamper alerts"]}
                />
                <FeatureCard
                  icon={<PenTool className="h-5 w-5 text-accent" />}
                  title="Immersive replays"
                  description="Share a cinematic writing replay that showcases every edit, deletion, and thought process."
                  details={["Inline annotations", "Playback controls", "Collaborative reviews"]}
                />
                <FeatureCard
                  icon={<LineChart className="h-5 w-5 text-chart-4" />}
                  title="Live analytics"
                  description="Monitor writing velocity, editing cadence, and authenticity scores across your organization."
                  details={["Session heatmaps", "Risk scoring", "Insights API"]}
                />
              </div>
            </div>
          </section>

        </main>

        <footer className="border-t border-border bg-background py-12 text-sm text-muted-foreground">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground">
                S
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Signify</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Authenticity for writers</p>
              </div>
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

function Metric({ value, title, description }: { value: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">{value}</p>
      <p className="mt-3 text-lg font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description, details }: {
  icon: ReactNode
  title: string
  description: string
  details: string[]
}) {
  return (
    <Card className="group h-full overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-sm transition-all hover:-translate-y-1 hover:border-border hover:shadow-xl">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <ul className="mt-auto space-y-2 text-sm text-muted-foreground">
          {details.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
