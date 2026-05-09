import Link from 'next/link'
import SurfacesSubNav from './SurfacesSubNav'
import MacDemoBay from './MacDemoBay'
import MacHowItWorks from './MacHowItWorks'
import MacFeatures from './MacFeatures'
import MacUseCases from './MacUseCases'
import DownloadBay from './DownloadBay'

/**
 * MacPage — body of /mac. Pure server component.
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
            · CH-A / MAC · 16kHz
          </p>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Talk to your Mac.<br />
            <span className="italic">A mic is all you need.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Your Mac already runs your day. Talkie fits alongside — a menu-bar app you trigger with one hotkey. It speaks straight into whatever you’re working in, and hands the cursor back when it’s done. Capture a thought, shape a draft, search what you said, or kick off a workflow without ever leaving the page.
          </p>
        </div>
      </section>

      {/* DARK DEMO BEAT — break up the cream paper with a scope-bay
          panel showing TALKIE LISTENING + WPM stats with multi-color
          accents (rose REC, amber waveform, cyan/emerald readouts) */}
      <MacDemoBay />

      {/* SECTIONS */}
      <MacHowItWorks />
      <MacFeatures />
      <MacUseCases />

      {/* DOWNLOAD — clear, focused install footer (replaces the bigger
          patch-bay chassis here; that one lives on /downloads where
          multi-platform is the page) */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-24">
          <DownloadBay caption="Capture a thought. Shape a draft. Search what you said. Workflows do the rest." />
        </div>
      </section>
    </>
  )
}
