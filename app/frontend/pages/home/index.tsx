import type { ReactNode } from "react"

import { Head, Link, usePage } from "@inertiajs/react"
import { ArrowRight, Fingerprint, PenTool, ShieldCheck, LineChart, Play, Sparkles, Github } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { dashboardPath, publicPostsPath, signInPath, signUpPath } from "@/routes"
import type { SharedData } from "@/types"

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
                  Signify captures each keystroke with cryptographic precision so your readers, partners, and platforms know your work is
                  authentically human. Build trust instantly with shareable writing proofs and immersive replays.
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

                <div className="grid gap-6 sm:grid-cols-2">
                  <Metric
                    value="ms-level capture"
                    title="Every keystroke recorded"
                    description="Immutable, tamper-evident timeline."
                  />
                  <Metric
                    value="4.9/5"
                    title="Writer satisfaction"
                    description="Across 1,200+ verified sessions."
                  />
                </div>
              </div>

              <div className="relative">
              <div className="absolute inset-0 -translate-x-6 rounded-[28px] bg-gradient-to-br from-primary/25 via-accent/30 to-foreground/10 blur-3xl" />
              <Card className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-xl backdrop-blur">
                <CardContent className="space-y-6 p-8">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-muted text-sm font-semibold text-foreground">
                          SJ
                        </span>
                        <div>
                          <p className="font-semibold text-foreground">Session verified</p>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">3 min ago · 1,348 keystrokes</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
                      >
                        Authentic
                      </Badge>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/60 p-5 text-left shadow-inner">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                        <Fingerprint className="h-4 w-4 text-primary" />
                        Replay in progress
                      </div>
                      <div className="mt-4 space-y-3 font-mono text-sm leading-relaxed text-muted-foreground">
                        <p>{">> Launching proof sequence..."}</p>
                        <p>
                          const entry = <span className="text-primary">Signify.capture()</span>
                        </p>
                        <p>
                          entry.commit(<span className="text-accent">"Every sentence is traced, every edit logged."</span>)
                        </p>
                        <p className="text-xs text-muted-foreground">Timeline sync: 00:00:17</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <TimelineItem label="Draft authored" value="12:34:08" accent="from-primary to-chart-2" />
                      <TimelineItem label="Edits verified" value="12:37:44" accent="from-accent to-chart-4" />
                      <TimelineItem label="Proof shared" value="12:39:02" accent="from-secondary to-chart-3" />
                    </div>
                  </CardContent>
                </Card>
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
                  icon={<ShieldCheck className="h-5 w-5 text-chart-3" />}
                  title="Compliance ready"
                  description="Export verifiable reports for legal, editorial, and platform compliance workflows."
                  details={["SOC2-aligned storage", "Full audit trails", "Exportable session proofs"]}
                />
                <FeatureCard
                  icon={<LineChart className="h-5 w-5 text-chart-4" />}
                  title="Live analytics"
                  description="Monitor writing velocity, editing cadence, and authenticity scores across your organization."
                  details={["Session heatmaps", "Risk scoring", "Insights API"]}
                />
                <FeatureCard
                  icon={<Sparkles className="h-5 w-5 text-chart-5" />}
                  title="AI assistance, verified"
                  description="Declare AI assistance transparently with dual-signature proofs for every generated block."
                  details={["Hybrid workflows", "Source labeling", "Reader-friendly badges"]}
                />
                <FeatureCard
                  icon={<Play className="h-5 w-5 text-chart-2" />}
                  title="Embeddable experiences"
                  description="Embed writing replays anywhere with responsive, accessible components."
                  details={["Custom branding", "Dark mode ready", "One-line install"]}
                />
              </div>
            </div>
          </section>

          <section id="how-it-works" className="border-b border-border bg-muted py-20">
            <div className="mx-auto grid w-full max-w-6xl gap-16 px-4 md:grid-cols-[minmax(0,0.9fr)_1fr] md:items-start">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="w-fit text-xs font-semibold uppercase tracking-widest text-secondary-foreground shadow-sm"
                >
                  How Signify works
                </Badge>
                <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                  Capture, verify, and share proof in under five minutes.
                </h2>
                <p className="text-lg text-muted-foreground">
                  We pair writing telemetry with cryptographic signatures so every draft produces an irrefutable authenticity packet.
                </p>
                <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-md">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Proof bundle includes</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>• Session hash + signature</li>
                    <li>• Full keystroke timeline</li>
                    <li>• Replay embed + highlights</li>
                    <li>• AI assistance disclosures</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <ProcessStep
                  step="01"
                  title="Capture session data"
                  description="Writers draft inside Signify or connect via our editors. Every keystroke, edit, and pause is recorded locally."
                />
                <ProcessStep
                  step="02"
                  title="Verify authenticity"
                  description="Timeline signatures are checked against our integrity network. Any anomalies are surfaced instantly."
                />
                <ProcessStep
                  step="03"
                  title="Share proof bundle"
                  description="Publish a replay link or export a compliance-ready PDF for legal, editorial, or partner review."
                />
              </div>
            </div>
          </section>

          <section id="security" className="border-b border-border bg-background py-20">
            <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 lg:grid-cols-[minmax(0,0.9fr)_1fr] lg:items-center">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="w-fit text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  Ironclad authenticity
                </Badge>
                <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                  Proof infrastructure built for legal teams and creative leaders.
                </h2>
                <p className="text-lg text-muted-foreground">
                  End-to-end encryption, provenance tracking, and exportable audit trails ensure every document can stand up under scrutiny.
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <ChecklistItem title="Zero-knowledge storage" description="Session data encrypted at the edge before hitting our servers." />
                  <ChecklistItem title="Chain of custody" description="Immutable event log with multi-party attestation on every signature." />
                  <ChecklistItem
                    title="Region-aware hosting"
                    description="Deploy writers in US, EU, or APAC data clusters based on compliance needs."
                  />
                  <ChecklistItem
                    title="Enterprise controls"
                    description="SAML SSO, granular permissions, and configurable retention windows."
                  />
                </div>
              </div>

              <Card className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/15 shadow-lg">
                <CardContent className="space-y-6 p-8">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">Real-time authenticity</h3>
                    <p className="text-3xl font-semibold text-foreground">99.98% capture integrity</p>
                    <p className="text-sm text-muted-foreground">
                      Automated anomaly detection flags any pasted or imported content before publication.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Session snapshot</p>
                    <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                        <span>Human-authored</span>
                        <span className="font-semibold text-primary">Pass</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                        <span>AI assistance</span>
                        <span className="font-semibold text-accent">Transparent</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                        <span>Integrity score</span>
                        <span className="font-semibold text-chart-2">99.7</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Signify issues W3C-compliant provenance manifests with every published proof bundle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="border-b border-border bg-background py-20">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4">
              <div className="max-w-2xl space-y-4">
                <Badge
                  variant="outline"
                  className="w-fit text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  Writers who switched
                </Badge>
                <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                  “The replay turned my readers into subscribers overnight.”
                </h2>
                <p className="text-lg text-muted-foreground">
                  Signify helps independent writers and enterprise teams prove originality while delivering an engaging behind-the-scenes
                  experience.
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <TestimonialCard
                  quote="The proof bundle is now a mandatory part of every editorial handoff. It keeps our bylines honest and our sponsors confident."
                  author="Alex Chen"
                  role="Editorial Director, Archway Media"
                  stats="8 brands onboarded"
                />
                <TestimonialCard
                  quote="Watching the keystroke replay is like sitting beside our writers. It's the transparency our community has been asking for."
                  author="Sarah Johnson"
                  role="Founder, The Craft Co."
                  stats="62% increase in membership"
                />
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary via-accent to-chart-4 py-20 text-primary-foreground">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 text-center">
              <Badge
                variant="secondary"
                className="border-primary-foreground/30 bg-primary-foreground/15 text-xs font-semibold uppercase tracking-wider text-primary-foreground/90"
              >
                Start in minutes
              </Badge>
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                Ready to prove your voice is authentically human?
              </h2>
              <p className="max-w-2xl text-lg text-primary-foreground/80">
                Launch your first verified session for free. Invite collaborators, share the replay, and embed your proof anywhere.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={auth.user ? dashboardPath() : signUpPath()}>
                    {auth.user ? "Open dashboard" : "Create your first proof"}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <a href="https://github.com/placeholder/signify" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View product roadmap
                  </a>
                </Button>
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

function TimelineItem({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${accent}`} />
        <span>{label}</span>
      </div>
      <span className="font-semibold text-foreground">{value}</span>
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

function ProcessStep({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-x-1">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-accent" />
      <div className="ml-4 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{step}</span>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ChecklistItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role, stats }: {
  quote: string
  author: string
  role: string
  stats: string
}) {
  return (
    <Card className="h-full rounded-3xl border border-border bg-card/80 p-8 shadow-lg backdrop-blur">
      <CardContent className="flex h-full flex-col gap-6 p-0">
        <p className="text-lg italic leading-relaxed text-muted-foreground">“{quote}”</p>
        <div className="mt-auto space-y-2">
          <p className="text-base font-semibold text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{stats}</p>
        </div>
      </CardContent>
    </Card>
  )
}
