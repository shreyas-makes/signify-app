import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import AppLogo from '@/components/app-logo'
import { dashboardPath, publicPostsPath, signInPath, signUpPath } from '@/routes'
import type { SharedData } from '@/types'

export default function Welcome() {
  const page = usePage<SharedData>()
  const { auth } = page.props

  return (
    <>
      <Head title="Signify - Human Stories & Ideas">
        <meta
          name="description"
          content="A home for human stories and ideas. Share your voice, earn trust, and build a readership that knows your words are real."
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
              <Link href="/features" className="transition-colors hover:text-foreground">
                Features
              </Link>
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
          <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-background to-accent/15">
            <div className="pointer-events-none absolute -top-32 left-[-10%] h-[260px] w-[260px] rounded-full bg-primary/20 blur-3xl blob-drift-1 sm:h-[360px] sm:w-[360px]" />
            <div className="pointer-events-none absolute bottom-0 right-[-12%] h-[280px] w-[280px] rounded-full bg-accent/35 blur-3xl blob-drift-2 sm:h-[380px] sm:w-[380px]" />
            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-12 md:min-h-[78vh] md:grid-cols-[minmax(0,1.05fr)_0.95fr] md:pt-20">
              <div className="min-w-0 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Human-only publishing
                </div>
                <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Human (only) stories, and ideas.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Publish your stories and protect your voice from algorithmic sameness.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button size="lg" asChild className="group w-full gap-2 rounded-full sm:w-auto">
                    <Link href={auth.user ? dashboardPath() : signUpPath()}>
                      {auth.user ? 'Open dashboard' : 'Start writing'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full rounded-full sm:w-auto"
                  >
                    <Link href={publicPostsPath()}>Explore the library</Link>
                  </Button>
                </div>
                
              </div>

              <div className="relative mx-auto w-full max-w-[520px]">
                <div className="absolute -left-6 top-8 h-16 w-16 rotate-6 rounded-2xl border border-border/60 bg-card shadow-sm" />
                <div className="absolute -right-8 bottom-12 h-20 w-20 rounded-full bg-accent/40 shadow-sm" />
                <div className="relative overflow-hidden rounded-[32px] border border-border/70 bg-card/90 p-8 shadow-[0_24px_60px_rgba(18,18,23,0.15)]">
                  <div className="absolute -right-6 -top-8 h-28 w-28">
                    <svg viewBox="0 0 120 120" className="h-full w-full text-primary" aria-hidden="true">
                      <g fill="currentColor" fillOpacity="0.9">
                        <circle cx="60" cy="20" r="20" />
                        <circle cx="95" cy="45" r="20" />
                        <circle cx="85" cy="85" r="20" />
                        <circle cx="35" cy="85" r="20" />
                        <circle cx="25" cy="45" r="20" />
                      </g>
                      <circle cx="60" cy="60" r="12" fill="hsl(var(--background))" />
                    </svg>
                  </div>

                  <div className="absolute right-6 top-8 h-24 w-32 text-foreground/30">
                    <svg viewBox="0 0 140 110" className="h-full w-full" aria-hidden="true">
                      <path
                        d="M8 86L42 52L74 64L108 30L132 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx="8" cy="86" r="4" fill="currentColor" />
                      <circle cx="42" cy="52" r="4" fill="currentColor" />
                      <circle cx="74" cy="64" r="4" fill="currentColor" />
                      <circle cx="108" cy="30" r="4" fill="currentColor" />
                      <circle cx="132" cy="36" r="4" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      No AI generated stories
                    </div>
                    <p className="font-serif text-3xl leading-tight text-foreground">
                      Stories shaped by lived experience, not prompts.
                    </p>
                    <div className="relative h-40 overflow-hidden rounded-[24px] bg-primary">
                      <svg viewBox="0 0 220 140" className="h-full w-full" aria-hidden="true">
                        <path
                          d="M30 110C60 70 90 90 120 60C150 30 185 50 200 20"
                          fill="none"
                          stroke="hsl(var(--background))"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M20 95C40 80 70 80 90 65C110 50 140 55 170 35"
                          fill="none"
                          stroke="hsl(var(--background))"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.7"
                        />
                        <circle cx="40" cy="38" r="6" fill="hsl(var(--background))" fillOpacity="0.9" />
                        <circle cx="70" cy="30" r="4" fill="hsl(var(--background))" fillOpacity="0.7" />
                        <circle cx="170" cy="80" r="5" fill="hsl(var(--background))" fillOpacity="0.8" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-border bg-background py-12 text-sm text-muted-foreground">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <AppLogo
                  showIcon={false}
                  labelClassName="font-serif text-base tracking-tight text-foreground"
                />
              </div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Human only stories, and ideas</p>
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

            <p className="text-xs text-muted-foreground">© 2025 Signify</p>
          </div>
        </footer>
      </div>
    </>
  )
}
