import { Head, Link, usePage } from "@inertiajs/react"
import { Check, Eye, Shield, Zap, Play, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dashboardPath, signInPath, signUpPath, publicPostsPath } from "@/routes"
import type { SharedData } from "@/types"

export default function Welcome() {
  const page = usePage<SharedData>()
  const { auth } = page.props

  return (
    <>
      <Head title="Signify - Prove Your Words">
        <meta name="description" content="The writing platform that proves human authorship through keystroke verification. Write, publish, and share with complete authenticity." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Navigation */}
        <header className="relative z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">Signify</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  href={publicPostsPath()}
                  className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Explore
                </Link>
                {auth.user ? (
                  <Button asChild size="sm">
                    <Link href={dashboardPath()}>Dashboard</Link>
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={signInPath()}>Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={signUpPath()}>Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 lg:py-32">
          <div className="container mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1">
              🔒 Keystroke-Verified Writing Platform
            </Badge>
            
            <h1 className="font-['Crimson_Text','Crimson_Text_Fallback'] font-normal text-[128px] leading-[128px] text-[rgb(20,20,20)] dark:text-white">
              Prove Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Words</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              The only writing platform that captures every keystroke, proving human authorship 
              and authentic creativity. Write, publish, and share with complete transparency.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {auth.user ? (
                <Button size="lg" asChild className="px-8 py-3 text-lg">
                  <Link href={dashboardPath()}>
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="px-8 py-3 text-lg">
                  <Link href={signUpPath()}>
                    Start Writing
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" size="lg" asChild className="px-8 py-3 text-lg">
                <Link href={publicPostsPath()}>
                  <Play className="mr-2 h-5 w-5" />
                  See Demo
                </Link>
              </Button>
            </div>

            {/* Demo Placeholder */}
            <div className="mt-16">
              <Card className="mx-auto max-w-4xl overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">Interactive Keystroke Demo</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">Watch how every keystroke is captured and verified</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-['Crimson_Text'] text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Why Signify?
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                The future of authentic writing is here
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-blue-600" />}
                title="Keystroke Verification"
                description="Every character typed is captured with millisecond precision, creating an unalterable proof of human authorship."
              />
              
              <FeatureCard
                icon={<Eye className="h-8 w-8 text-purple-600" />}
                title="Writing Replay"
                description="Watch your writing process unfold character by character. Share your creative journey with readers."
              />
              
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-green-600" />}
                title="Instant Publishing"
                description="Publish your verified content instantly with shareable links and embedded proof of authenticity."
              />
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-['Crimson_Text'] text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Trusted by Writers
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Join creators who value authenticity
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <TestimonialCard
                quote="Signify brings transparency to writing that I've never seen before. The keystroke verification is fascinating."
                author="Alex Chen"
                role="Tech Writer"
                avatar="AC"
              />
              
              <TestimonialCard
                quote="As a publisher, being able to verify the authenticity of submissions changes everything. This is the future."
                author="Sarah Johnson"
                role="Editorial Director"
                avatar="SJ"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-['Crimson_Text'] text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              Ready to prove your words?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Join the writing platform that values authenticity above all else.
            </p>
            
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {!auth.user && (
                <Button size="lg" asChild className="px-8 py-3 text-lg">
                  <Link href={signUpPath()}>
                    Start Writing for Free
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" size="lg" asChild className="px-8 py-3 text-lg">
                <a href="https://github.com/placeholder/signify" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Signify</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
                <Link href={publicPostsPath()} className="hover:text-slate-900 dark:hover:text-white">
                  Explore
                </Link>
                <a href="/legal/privacy" className="hover:text-slate-900 dark:hover:text-white">
                  Privacy
                </a>
                <a href="/legal/terms" className="hover:text-slate-900 dark:hover:text-white">
                  Terms
                </a>
                <a href="/support/contact" className="hover:text-slate-900 dark:hover:text-white">
                  Contact
                </a>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-slate-500">
              © 2024 Signify. Proving authenticity, one keystroke at a time.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ quote, author, role, avatar }: {
  quote: string
  author: string
  role: string
  avatar: string
}) {
  return (
    <Card className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <CardContent className="p-6">
        <p className="text-slate-700 dark:text-slate-300 mb-4 italic">
          "{quote}"
        </p>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{avatar}</span>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{author}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
