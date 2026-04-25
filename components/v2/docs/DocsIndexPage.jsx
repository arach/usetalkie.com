import Link from 'next/link'
import { DOCS_NAV } from './DOCS_NAV'

/**
 * v2 Docs index — the landing page at /v2/docs.
 *
 * Pure server component. Reads the canonical nav structure from
 * DOCS_NAV.js so this list never drifts from the sidebar.
 *
 * Visual language matches the oscilloscope canvas: graticule overlay
 * on the header, cream/phosphor tokens, font-mono eyebrows, no chip
 * colors borrowed from the donor (the donor used emerald/violet/rose
 * accent fills which fight the trace token).
 */

const GRATICULE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
}
const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

function DocCard({ slug, title, description, href }) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col justify-between rounded-sm border border-edge-faint bg-canvas p-5 transition-all hover:-translate-y-px hover:border-edge"
    >
      <div>
        <p
          className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle transition-colors group-hover:text-trace"
        >
          /docs/{slug}
        </p>
        <h3 className="mt-3 font-display text-xl font-normal leading-tight tracking-[-0.01em] text-ink">
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{description}</p>
      </div>

      <div className="mt-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-trace">
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full bg-trace"
          style={{ boxShadow: '0 0 4px var(--trace)' }}
        />
        <span>Read guide</span>
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  )
}

export default function DocsIndexPage() {
  return (
    <>
      {/* ========== HEADER ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-ink-faint">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
              style={{ boxShadow: '0 0 6px var(--trace)' }}
            />
            <span style={TRACE_GLOW_SOFT} className="text-trace">
              DOCUMENTATION
            </span>
            <span className="opacity-50">·</span>
            <span>SIGNAL · REFERENCE</span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
            How Talkie works.
          </h1>

          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
            From the philosophy to the wire format. Read top-to-bottom for the full
            picture, or jump straight to the surface you need.
          </p>
        </div>
      </section>

      {/* ========== SECTIONS ========== */}
      <section className="relative bg-canvas-alt">
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="space-y-14 md:space-y-16">
            {DOCS_NAV.map((group, idx) => {
              const visible = group.items.filter((item) => !item.hidden)
              if (visible.length === 0) return null
              const channel = String(idx + 1).padStart(2, '0')
              return (
                <div key={group.label}>
                  <div className="flex items-baseline gap-3 font-mono">
                    <span className="text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                      CH·{channel}
                    </span>
                    <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--edge-faint)' }} />
                    <span className="text-[10px] uppercase tracking-[0.28em] text-ink-dim">
                      {group.label}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((item) => (
                      <DocCard
                        key={item.slug}
                        slug={item.slug}
                        title={item.title}
                        description={item.description}
                        href={item.href}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA tile */}
          <div className="mt-20 rounded-sm border border-edge-faint bg-canvas px-6 py-8 md:px-8 md:py-10">
            <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.26em] text-trace"
                  style={TRACE_GLOW_SOFT}
                >
                  · NEXT
                </p>
                <h2 className="mt-2 font-display text-2xl font-normal leading-tight tracking-[-0.01em] text-ink">
                  Ready to plug in the mic?
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  Download Talkie for Mac and turn voice into action — local-first,
                  auditable, yours.
                </p>
              </div>

              <Link
                href="/v2/download"
                className="inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-px"
                style={{ background: 'color-mix(in oklab, var(--trace) 6%, transparent)' }}
              >
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                  style={{ boxShadow: '0 0 4px var(--trace)' }}
                />
                DOWNLOAD · MAC <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
