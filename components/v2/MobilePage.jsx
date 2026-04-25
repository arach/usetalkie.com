import Link from 'next/link'
import SurfacesSubNav from './SurfacesSubNav'
import MobileCaptureModes from './MobileCaptureModes'
import MobileMoments from './MobileMoments'

/**
 * MobilePage — body for /v2/mobile (Channel B).
 *
 * Pure server component. The /v2 layout already wraps every route in
 * <SiteShell> on a `bg-canvas text-ink` shell, so this component renders
 * the page-level chrome only: the surfaces sub-nav, hero, two content
 * sections, and the cross-surface tie-back to /v2/mac + install CTA.
 */
export default function MobilePage() {
  return (
    <>
      <SurfacesSubNav active="mobile" />

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
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
            className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · CH-B / MOBILE · 48.0kHz
          </p>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Catch it while
            <br />
            <span className="italic">it is live.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            iPhone and Apple Watch are the fast path back into Talkie. Grab the
            thought now, then pick it back up on your Mac when it is time to do
            something with it. Phone and Watch are for capture; Mac is where
            you search it, shape it, and turn it into useful output.
          </p>
        </div>
      </section>

      {/* ─────────────── SECTIONS ─────────────── */}
      <MobileCaptureModes />
      <MobileMoments />

      {/* ─────────────── TIE-BACK + INSTALL ─────────────── */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            {/* Prev channel: Mac */}
            <Link
              href="/v2/mac"
              className="group block rounded-md border border-edge bg-surface p-6 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim"
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  PREV CHANNEL · CH-A
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                Talk to your Mac.
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                Menu-bar instrument, hotkey trigger, smart routing. Keep
                reading{' '}
                <span
                  aria-hidden
                  className="text-trace transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </p>
            </Link>

            {/* Install CTA */}
            <div className="flex flex-col justify-between rounded-md border border-edge bg-surface p-6">
              <div>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
                  style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                >
                  · READY TO INSTALL
                </p>
                <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                  Get Talkie Mobile.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  iPhone, iPad, and Apple Watch — one App Store download.
                </p>
              </div>
              <Link
                href="/v2/download"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  background:
                    'color-mix(in oklab, var(--trace) 6%, transparent)',
                  textShadow: '0 0 6px var(--trace-glow)',
                  boxShadow: '0 0 18px var(--trace-faint)',
                }}
              >
                GO TO INSTALL
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
