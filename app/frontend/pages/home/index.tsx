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
        <header className="fixed inset-x-0 top-4 z-50 w-full px-4">
          <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between rounded-[36px] border border-border/70 bg-background/90 px-4 py-3 shadow-[0_20px_50px_rgba(15,15,20,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
            <Link href="/" className="flex items-center">
              <AppLogo
                showIcon
                iconClassName="size-7"
                labelClassName="font-serif text-xl leading-tight tracking-tight"
              />
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
              <Link href={publicPostsPath()} className="transition-colors hover:text-foreground">
                Discover
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
          <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-background to-accent/15 pt-20 sm:pt-24">
            <div className="pointer-events-none absolute -top-32 left-[-10%] h-[260px] w-[260px] rounded-full bg-primary/20 blur-3xl blob-drift-1 sm:h-[360px] sm:w-[360px]" />
            <div className="pointer-events-none absolute bottom-0 right-[-12%] h-[280px] w-[280px] rounded-full bg-accent/35 blur-3xl blob-drift-2 sm:h-[380px] sm:w-[380px]" />
            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-12 md:min-h-[78vh] md:grid-cols-[minmax(0,1.05fr)_0.95fr] md:pt-20">
              <div className="min-w-0 space-y-6">
            
                <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Human written stories, and ideas.
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
                    <Link href={publicPostsPath()}>Discover</Link>
                  </Button>
                </div>
                
              </div>

              <div className="relative mx-auto w-full max-w-[560px]" aria-hidden="true">
                <div className="relative overflow-hidden rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-[0_30px_70px_rgba(18,18,23,0.18)] editorial-hero-board sm:p-8">
                  <div className="pointer-events-none absolute -left-12 top-6 h-[220px] w-[220px] rounded-full bg-primary/15 blur-3xl editorial-ink-pulse" />
                  <div className="pointer-events-none absolute bottom-0 right-[-18%] h-[240px] w-[240px] rounded-full bg-accent/35 blur-3xl editorial-ink-pulse-delayed" />

                  <div className="relative h-[360px] overflow-hidden rounded-[24px] sm:h-[420px]">
                    <img
                      src="/cover-pic.png"
                      alt="Hand-drawn cover illustration"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/15 py-12 text-sm text-muted-foreground">
          <div className="pointer-events-none absolute -left-24 top-8 h-[240px] w-[240px] rounded-full bg-primary/15 blur-3xl blob-drift-1" />
          <div className="pointer-events-none absolute bottom-[-10%] right-[-12%] h-[260px] w-[260px] rounded-full bg-accent/30 blur-3xl blob-drift-2" />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-serif text-lg font-semibold tracking-tight text-foreground">
                Signify
              </p>
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
