import type { CSSProperties } from 'react'
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
            
                <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Human (only) stories, and ideas.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                   No AI generated stories. Just original work and lived ideas.
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

                <div className="relative mx-auto w-full max-w-[560px]">
                  <div className="relative space-y-5 rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-[0_30px_70px_rgba(18,18,23,0.18)] editorial-collage-frame sm:p-8">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Keystrokes are analyzed in real time to create a signature that only a human can
                      produce.
                    </p>

                    <div className="space-y-4 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm paper-grain">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        <span>Keystroke cadence</span>
                        <span className="font-mono text-[10px]">Live</span>
                      </div>
                      <div className="relative h-24 overflow-hidden rounded-xl border border-border/50 bg-background/90 p-4 keystroke-grid">
                        <div className="flex h-full items-end justify-between gap-2">
                          {Array.from({ length: 10 }).map((_, index) => (
                            <span
                              key={`stroke-${index}`}
                              className="keystroke-bar"
                              style={{ '--delay': `${index * 0.18}s` } as CSSProperties}
                            />
                          ))}
                        </div>
                        <div className="absolute right-4 top-3 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          Typing
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm">
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

                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
                      <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                        Certified
                      </span>
                      <span className="rounded-full border border-foreground/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 stamp-ring stamp-in">
                        100% Human
                      </span>
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
