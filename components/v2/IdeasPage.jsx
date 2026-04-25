import Link from 'next/link'

/**
 * Ideas index — v2 oscilloscope canvas.
 *
 * Server component. All chrome is themed via semantic Tailwind tokens
 * (canvas, surface, ink, trace, edge…). The donor at components/IdeasPage.jsx
 * shipped its own header / nav / footer; here we render only the body
 * because /v2/* routes are wrapped by SiteShell in app/v2/layout.jsx.
 *
 * Internal links target /v2/ideas/[slug] so the user stays inside the v2
 * surface while we evaluate the new shell.
 */

const GRATICULE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
}
const GRATICULE_FINE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}
const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }
const TRACE_GLOW_DOT = { boxShadow: '0 0 6px var(--trace)' }

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getEntryBadge(entryType) {
  if (entryType === 'rfc') return { label: 'RFC' }
  return null
}

function getStatusBadge(status) {
  if (status === 'draft') return { label: 'Draft' }
  return null
}

export default function IdeasPage({ ideas }) {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-4xl px-4 py-20 md:px-6 md:py-24">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
            style={TRACE_GLOW_SOFT}
          >
            · IDEAS · SIGNAL LOG
          </p>

          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Ideas in progress.
          </h1>

          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Concepts and thinking on voice, computing, and the tools we build. Some are RFCs, some are
            half-formed sketches, all are in flight.
          </p>

          <div className="mt-8 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
            <span aria-hidden className="block h-px w-10" style={{ background: 'var(--trace-dim)' }} />
            <span>{ideas.length} {ideas.length === 1 ? 'ENTRY' : 'ENTRIES'}</span>
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-trace" style={TRACE_GLOW_DOT} />
            <span>LIVE</span>
          </div>
        </div>
      </section>

      {/* ========== INDEX ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25" style={GRATICULE} />

        <div className="relative mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
          {ideas.length === 0 ? (
            <div className="rounded-md border border-edge-dim bg-surface p-10 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
                NO ENTRIES · CHECK BACK SOON
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {ideas.map((idea) => (
                <li key={idea.slug}>
                  <IdeaRow idea={idea} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function IdeaRow({ idea }) {
  const entryBadge = getEntryBadge(idea.entryType)
  const statusBadge = getStatusBadge(idea.status)
  const tags = idea.tags || []

  return (
    <Link
      href={`/v2/ideas/${idea.slug}`}
      className="group relative block overflow-hidden rounded-md border border-edge-dim bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-edge"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE_FINE} />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="min-w-0 flex-1">
          {/* meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            <time dateTime={idea.date}>{formatDate(idea.date)}</time>

            {entryBadge && (
              <>
                <span aria-hidden className="opacity-50">·</span>
                <span
                  className="inline-flex items-center rounded-sm border border-edge px-2 py-0.5 text-trace"
                  style={{
                    background: 'color-mix(in oklab, var(--trace) 5%, transparent)',
                    ...TRACE_GLOW_SOFT,
                  }}
                >
                  {entryBadge.label}
                </span>
              </>
            )}

            {statusBadge && (
              <>
                <span aria-hidden className="opacity-50">·</span>
                <span className="inline-flex items-center rounded-sm border border-edge-dim px-2 py-0.5 text-ink-muted">
                  {statusBadge.label}
                </span>
              </>
            )}

            {tags.length > 0 && (
              <>
                <span aria-hidden className="opacity-50">·</span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-ink-faint">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <h2 className="mt-3 font-display text-2xl font-normal leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-trace md:text-3xl">
            {idea.title}
          </h2>

          {idea.description && (
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
              {idea.description}
            </p>
          )}
        </div>

        {/* trailing chevron / signal indicator */}
        <div className="flex shrink-0 items-center gap-2 self-end md:self-center">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-trace opacity-60 transition-opacity group-hover:opacity-100"
            style={TRACE_GLOW_DOT}
          />
          <span
            className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle transition-colors group-hover:text-trace"
            style={TRACE_GLOW_SOFT}
          >
            READ <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
