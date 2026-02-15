import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowRight, CheckCircle2, Chrome, ShieldCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PublicLayout from '@/layouts/public-layout'
import { dashboardPath, publicPostsPath, rootPath, signUpPath } from '@/routes'
import type { SharedData } from '@/types'

export default function Welcome() {
  const page = usePage<SharedData>()
  const { auth } = page.props

  return (
    <>
      <Head title="Signify - Proof of Human Authorship for Tweets">
        <meta
          name="description"
          content="Add proof-of-human authorship to any tweet without leaving the editor. The Signify Chrome extension appends a verification link after you click Signify."
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
                  Chrome extension for X/Twitter
                </div>
                <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Add proof-of-human authorship to any tweet — without leaving the editor.
                </h1>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  The Signify extension watches only the X composer, creates a human-written verification, and appends a public link when you click Signify.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                    <Button size="lg" asChild className="group w-full gap-2 rounded-full sm:w-auto">
                      <Link href={auth.user ? dashboardPath() : signUpPath()}>
                        {auth.user ? 'Open dashboard' : 'Install extension'}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                    <Button size="lg" asChild className="w-full rounded-full sm:w-auto">
                      <Link href={publicPostsPath()}>View example verification</Link>
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
                    'Runs only inside the X/Twitter composer.',
                    'No global keylogging or silent collection.',
                    'Byline appended only when you click Signify.',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
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
                  <Chrome className="h-4 w-4 text-primary" />
                  Extension-first workflow
                </Badge>
                <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Install, write, click Signify, publish.
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Signify adds a proof link directly in your tweet so readers can verify your authorship without leaving X.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button size="lg" asChild className="group flex w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto">
                    <Link href={auth.user ? dashboardPath() : signUpPath()}>
                      {auth.user ? 'Open dashboard' : 'Install extension'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative w-full min-w-0 max-w-full">
                <div className="relative space-y-5 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur sm:p-8">
                  <div className="rounded-2xl border border-border/60 bg-background/85 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      01 · Start typing
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      Signify activates only in the X composer and begins timing your keystrokes.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/85 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      02 · Click Signify
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      We send a minimal verification payload and return a public proof link.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/85 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      03 · Publish with a byline
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      The extension appends a human authorship byline right before you post.
                    </p>
                    <div className="mt-3 rounded-xl border border-border/60 bg-background/90 p-3 text-xs text-muted-foreground">
                      <span className="font-mono text-[11px]">
                        Proof of human authorship: signifywriting.com/p/9f2a1c
                      </span>
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
                  Privacy first
                </Badge>
                <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                  Verification without surveillance.
                </h2>
                <p className="text-lg text-muted-foreground">
                  Signify only listens inside the tweet composer, and nothing is sent until you click Signify.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: 'Composer-only capture',
                    description:
                      'We listen only inside the X/Twitter composer. No global keylogging and no cross-site tracking.',
                  },
                  {
                    title: 'Minimal verification payload',
                    description:
                      'We send a content hash, timing aggregates, and paste indicators only after you click Signify.',
                  },
                  {
                    title: 'Clear public proof',
                    description:
                      'Your link shows Human Written or Mixed, plus the timestamp and platform — nothing else.',
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="flex h-full flex-col gap-3 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                      <ShieldCheck className="h-4 w-4" />
                      Trust
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                ))}
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
                Add human proof to every tweet.
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Install the extension, write as usual, and let Signify append the verification link.
              </p>
              <Button size="lg" asChild className="group rounded-full px-8">
                <Link href={auth.user ? dashboardPath() : signUpPath()}>
                  {auth.user ? 'Open dashboard' : 'Install extension'}
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
