import Link from 'next/link'
import SurfaceChannels from './SurfaceChannels'

/**
 * SurfacesPage — body for /v2/surfaces (the surfaces hub).
 *
 * Pure server component. The /v2 layout already wraps in <SiteShell> on a
 * `bg-canvas text-ink` shell, so this composes the page-level chrome only:
 * a hero, the four-channel hub grid, and a tie-back to /download.
 *
 * Note: the SurfacesSubNav is intentionally omitted on this page — it is
 * the parent of Mac/Mobile, not a sibling. The hub itself is the nav.
 *
 * Theme paint flows entirely through CSS-var-backed Tailwind tokens
 * (bg-canvas/bg-canvas-alt, text-ink*, border-edge*, var(--trace*) for
 * glowing accents). No client hooks, no JS-driven theme reads.
 */
export default function SurfacesPage() {
  return (
    <>
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
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · TALKIE / SURFACES
          </p>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-7xl">
            Many surfaces,<br />
            <span className="italic">one trace.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base">
            Mac is where you work. iPhone and Watch are where you catch the thought before it fades. Same signal, different endpoints — every capture lands in the same library on your Mac.
          </p>
        </div>
      </section>

      {/* ─────────────── CHANNEL BANK ─────────────── */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · PICK A CHANNEL
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-normal leading-[1.1] tracking-[-0.01em] text-ink md:text-4xl">
            Four inputs. <span className="italic text-ink-muted">One library.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
            Each channel has its own frequency and its own moment. Tap one to open the surface.
          </p>

          <div className="mt-10">
            <SurfaceChannels />
          </div>
        </div>
      </section>

      {/* ─────────────── TIE-BACK TO INSTALL ─────────────── */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="max-w-xl">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
                style={{ textShadow: '0 0 4px var(--trace-glow)' }}
              >
                · NEXT
              </p>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink md:text-3xl">
                Three inputs. <span className="italic">Pick one.</span>
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                Mac DMG, App Store, or a single CLI command.
              </p>
            </div>
            <Link
              href="/v2/downloads"
              className="inline-flex items-center gap-2 self-start rounded-sm border border-edge px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5 md:self-end"
              style={{
                background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                textShadow: '0 0 6px var(--trace-glow)',
                boxShadow: '0 0 18px var(--trace-faint)',
              }}
            >
              GO TO INSTALL
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
