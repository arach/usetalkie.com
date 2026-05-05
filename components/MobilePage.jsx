import Link from 'next/link'
import SurfacesSubNav from './SurfacesSubNav'
import MobileCaptureModes from './MobileCaptureModes'
import MobileTransitBay from './MobileTransitBay'
import MobileMoments from './MobileMoments'
import InstallCard from './InstallCard'

/**
 * MobilePage — body for /mobile (Channel B).
 *
 * Pure server component. The /v2 layout already wraps every route in
 * <SiteShell> on a `bg-canvas text-ink` shell, so this component renders
 * the page-level chrome only: the surfaces sub-nav, hero, two content
 * sections, and the cross-surface tie-back to /mac + install CTA.
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

      {/* DARK TRANSIT BEAT — 3 channels firing live (amber/emerald/cyan) */}
      <MobileTransitBay />

      <MobileMoments />

      {/* INSTALL — patch-bay chassis (shared across Mac-context pages) */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
          <div className="text-center">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · ONE LIBRARY · EVERY SURFACE
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink md:text-4xl">
              Catch it on iPhone.
              <span className="italic text-ink-muted"> Finish it on Mac.</span>
            </h2>
          </div>
          <div className="mt-10">
            <InstallCard />
          </div>
        </div>
      </section>
    </>
  )
}
