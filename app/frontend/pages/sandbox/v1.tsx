import { Head } from '@inertiajs/react'
import { ArrowUpRight } from 'lucide-react'
import ScrollCircleText from '@/components/sandbox/scroll-circle-text'

export default function SandboxV1() {
  return (
    <>
      <Head title="Signify - Sandbox V1" />

      <main className="circle-page">
        <section className="circle-hero">
          <div className="circle-sticky">
            <ScrollCircleText />
            <div className="circle-shell">
              <button type="button" className="circle-arrow" aria-label="Open">
                <ArrowUpRight className="circle-arrow-icon" />
              </button>
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
            overflow: hidden;
          }

          .circle-hero {
            position: relative;
            min-height: 100vh;
          }

          .circle-sticky {
            position: sticky;
            top: 0;
            height: 100vh;
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
            border: 1px solid rgba(31, 31, 31, 0.2);
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
            border-color: rgba(31, 31, 31, 0.4);
          }

          .circle-arrow-icon {
            width: 28px;
            height: 28px;
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
