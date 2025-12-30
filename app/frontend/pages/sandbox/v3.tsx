import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowUpRight } from 'lucide-react'
import ScrollCircleText from '@/components/sandbox/scroll-circle-text'
import { Button } from '@/components/ui/button'
import { dashboardPath, newDocumentPath, publicPostsPath, signInPath, signUpPath } from '@/routes'
import type { SharedData } from '@/types'

export default function SandboxV3() {
  const page = usePage<SharedData>()
  const { auth } = page.props
  const isSignedIn = Boolean(auth.user)
  const arrowHref = isSignedIn ? dashboardPath() : signInPath()
  const arrowLabel = isSignedIn ? 'Open dashboard' : 'Sign in'
  const writingHref = isSignedIn ? newDocumentPath() : signUpPath()

  return (
    <>
      <Head title="Signify - Sandbox V3" />

      <main className="circle-page">
        <section className="circle-hero">
          <div className="circle-sticky">
            <ScrollCircleText variant="pair" curve={0.003} />
            <div className="circle-shell">
              <Link href={arrowHref} className="circle-arrow" aria-label={arrowLabel}>
                <ArrowUpRight className="circle-arrow-icon" />
              </Link>
            </div>
            <div className="circle-footer">
              <Button asChild variant="outline" size="sm" className="circle-footer-button">
                <Link href={publicPostsPath()}>Explore</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="circle-footer-button">
                <Link href={writingHref}>Start writing</Link>
              </Button>
            </div>
          </div>
        </section>

        <style>{`
          :global(html),
          :global(body) {
            height: 100%;
            overflow: hidden;
            overscroll-behavior: none;
          }

          .circle-page {
            --ink: #1f1f1f;
            --paper: #f6f2ea;
            background: radial-gradient(120% 120% at 15% 15%, rgba(255, 255, 255, 0.85), transparent 55%),
              radial-gradient(120% 120% at 85% 10%, rgba(255, 255, 255, 0.65), transparent 55%),
              #f2eee6;
            color: var(--ink);
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            overflow: hidden;
          }

          .circle-hero {
            position: relative;
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
          }

          .circle-sticky {
            position: sticky;
            top: 0;
            height: 100vh;
            height: 100svh;
            height: 100dvh;
            overflow: hidden;
            display: grid;
            place-items: center;
          }

          .circle-canvas {
            position: absolute;
            inset: 0;
            pointer-events: none;
            filter: grayscale(1);
          }

          .circle-canvas canvas {
            width: 100%;
            height: 100%;
            display: block;
          }

          .circle-shell {
            position: relative;
            z-index: 2;
            max-width: 560px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 0;
            text-align: center;
            align-items: center;
          }

          .circle-arrow {
            width: 72px;
            height: 72px;
            border-radius: 999px;
            border: 2px solid #1f1f1f;
            display: grid;
            place-items: center;
            background: transparent;
            color: #1f1f1f;
            transition: transform 150ms ease, border-color 150ms ease;
          }

          .circle-arrow:active {
            transform: scale(1.08);
          }

          .circle-arrow:hover {
            border-color: #1f1f1f;
          }

          .circle-arrow-icon {
            width: 28px;
            height: 28px;
          }

          .circle-footer {
            position: absolute;
            bottom: calc(24px + env(safe-area-inset-bottom));
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 3;
          }

          .circle-footer-button {
            border-color: rgba(31, 31, 31, 0.6);
            color: #1f1f1f;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 10px;
          }

          .circle-footer-button:hover {
            border-color: #1f1f1f;
          }

          @media (max-width: 640px) {
            .circle-arrow {
              width: 56px;
              height: 56px;
            }

            .circle-arrow-icon {
              width: 22px;
              height: 22px;
            }

            .circle-footer {
              flex-direction: column;
              width: min(86vw, 280px);
              gap: 8px;
            }

            .circle-footer-button {
              width: 100%;
              justify-content: center;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .circle-canvas {
              display: none;
            }
          }
        `}</style>
      </main>
    </>
  )
}
