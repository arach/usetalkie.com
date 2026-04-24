import Link from 'next/link'
import SurfacesSubNav from './SurfacesSubNav'
import MacHowItWorks from './MacHowItWorks'
import MacFeatures from './MacFeatures'
import MacUseCases from './MacUseCases'

/**
 * MacPage — body of /v2/mac. Pure server component.
 *
 * Composition:
 *   1. Surfaces sub-nav (Mac active)
 *   2. Page hero — channel eyebrow + headline + supporting copy
 *   3. How it works — four-stage signal flow
 *   4. Features — 2x3 channel-strip grid
 *   5. Use cases — 2x3 signal-sample grid
 *   6. Cross-surface tie-back to Mobile + install CTA
 *
 * Theme is entirely token-driven: bg-canvas/bg-canvas-alt/bg-surface
 * for surfaces, text-ink/* for typography, border-edge/* for hairlines,
 * and `var(--trace*)` for the glowing accents. No DOM-watching hooks.
 */
export default function MacPage() {
  return (
    <>
      <SurfacesSubNav active="mac" />

      {/* PAGE HERO */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p
            className="text-[10px] uppercase tracking-[0.26em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · CH-A / MAC · 32.1kHz
          </p>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Talk to your Mac.<br />
            <span className="italic">A mic is all you need.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Your Mac already runs your day. Talkie fits alongside — a menu-bar instrument you trigger with one hotkey, speaks straight into the app in front of you, and hands the cursor back where it came from. Capture a thought, shape a draft, search what you said, or kick off a workflow without leaving the app in front of you.
          </p>
        </div>
      </section>

      {/* SECTIONS */}
      <MacHowItWorks />
      <MacFeatures />
      <MacUseCases />

      {/* CROSS-SURFACE TIE-BACK + INSTALL */}
      <section className="relative border-t border-edge-faint bg-canvas-alt font-mono">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            {/* Next channel: Mobile */}
            <Link
              href="/v2/mobile"
              className="group block rounded-md border border-edge bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-trace"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim"
                />
                <span className="text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  NEXT CHANNEL · CH-B
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                Catch it while it is live.
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                iPhone and Apple Watch are the fast path back in. Keep reading →
              </p>
            </Link>

            {/* Install CTA */}
            <div className="flex flex-col justify-between rounded-md border border-edge bg-surface p-6">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.26em] text-trace"
                  style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                >
                  · READY TO INSTALL
                </p>
                <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                  Download Talkie for Mac.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  DMG, App Store, or a single CLI command.
                </p>
              </div>
              <Link
                href="/download"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                  textShadow: '0 0 6px var(--trace-glow)',
                }}
              >
                GO TO INSTALL <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
