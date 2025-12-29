import { Head, Link } from '@inertiajs/react'
import { ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import PublicLayout from '@/layouts/public-layout'
import { rootPath } from '@/routes'

const ideaSeeds = [
  'Editorial typography + proof-of-work timeline',
  'Glassmorphism hero with kinetic background',
  'Split-screen: story on left, authorship data on right',
  'Card-based modules with bold serif headlines',
]

export default function Sandbox() {
  return (
    <>
      <Head title="Signify - UI Sandbox" />

      <PublicLayout>
        <main className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.12),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-12 h-64 bg-[linear-gradient(120deg,rgba(59,130,246,0.16),rgba(249,115,22,0.12),rgba(16,185,129,0.12))] blur-3xl" />

          <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-12 lg:pt-20">
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
                Sandbox route
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Prototype landing ideas here first.
              </h1>

              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                This page is intentionally isolated so you can push bold concepts without touching the
                production landing page. Iterate freely, then port the pieces you love.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href={rootPath()}>
                    Back to home
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#idea-lab">Jump to idea lab</a>
                </Button>
              </div>
            </div>

            <section
              id="idea-lab"
              className="grid gap-6 rounded-[32px] border border-border/70 bg-background/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10 lg:grid-cols-[1.2fr_0.8fr]"
            >
              <div className="space-y-4">
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Idea lab
                </div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Draft the next landing direction.
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Use this space to swap hero layouts, animation experiments, or new visual systems.
                  Keep it messy. The only goal is to explore.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ideaSeeds.map((seed) => (
                    <div
                      key={seed}
                      className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-foreground/80"
                    >
                      {seed}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex h-full flex-col justify-between rounded-[24px] border border-border/60 bg-gradient-to-br from-foreground/5 via-background to-transparent p-5 text-sm text-muted-foreground">
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/70">
                    Notes
                  </div>
                  <p>
                    Try wildly different typography, color systems, and layout experiments here. If you
                    need mock data, keep it local to this page.
                  </p>
                </div>
                <div className="mt-6 space-y-2 rounded-2xl border border-border/50 bg-background/80 p-4 text-xs text-foreground/70">
                  <div className="font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Reminder
                  </div>
                  <p>When the concept feels right, mirror the changes into the real landing page.</p>
                </div>
              </div>
            </section>
          </section>
        </main>
      </PublicLayout>
    </>
  )
}
