import Link from 'next/link'

/**
 * Idea slug layout — v2 oscilloscope canvas.
 *
 * Server component. Wraps MDX `children` in a header + article + footer
 * tied to the SiteShell that already wraps every /v2/* route.
 *
 * Prose strategy
 * --------------
 * The MDX content is rendered with next-mdx-remote/rsc and styled via
 * Tailwind Typography (`prose`). Default `prose` colors are zinc-toned;
 * we remap them to v2 tokens with `prose-*` overrides so text/links/code
 * follow `--ink*` and `--trace*` and theme-flip with the rest of the
 * canvas. Custom MDX components from components/blog/* render under
 * `prose-img:my-0` etc. and use their own neutral palettes — they sit
 * inside the prose container but visually carry their own surface.
 */

const GRATICULE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
}
const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

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

export default function IdeaLayout({ title, description, date, tags, entryType, status, children }) {
  const entryBadge = getEntryBadge(entryType)
  const statusBadge = getStatusBadge(status)

  return (
    <>
      {/* ========== HEADER ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
          {/* Crumb back to the index */}
          <Link
            href="/v2/ideas"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint transition-colors hover:text-trace"
          >
            <span aria-hidden>←</span>
            <span>ALL IDEAS</span>
          </Link>

          {/* Badges */}
          {(entryBadge || statusBadge || (tags && tags.length > 0)) && (
            <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em]">
              {entryBadge && (
                <span
                  className="inline-flex items-center rounded-sm border border-edge px-2 py-0.5 text-trace"
                  style={{
                    background: 'color-mix(in oklab, var(--trace) 5%, transparent)',
                    ...TRACE_GLOW_SOFT,
                  }}
                >
                  {entryBadge.label}
                </span>
              )}
              {statusBadge && (
                <span className="inline-flex items-center rounded-sm border border-edge-dim px-2 py-0.5 text-ink-muted">
                  {statusBadge.label}
                </span>
              )}
              {tags && tags.map((tag) => (
                <span key={tag} className="inline-flex items-center text-ink-subtle">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="mt-6 font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
              {description}
            </p>
          )}

          {date && (
            <div className="mt-7 flex items-center gap-3">
              <span aria-hidden className="block h-px w-10" style={{ background: 'var(--trace-dim)' }} />
              <time
                dateTime={date}
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle"
              >
                {formatDate(date)}
              </time>
            </div>
          )}
        </div>
      </section>

      {/* ========== ARTICLE ========== */}
      <article className="relative bg-canvas-alt">
        <div className="relative mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
          <div
            className="
              prose max-w-none
              prose-headings:font-display prose-headings:font-normal prose-headings:tracking-[-0.01em]
              prose-headings:text-ink prose-headings:scroll-mt-20
              prose-h2:mt-14 prose-h2:mb-4 prose-h2:text-3xl
              prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl
              prose-p:text-ink-muted prose-p:leading-[1.8]
              prose-a:text-trace prose-a:no-underline hover:prose-a:underline
              prose-strong:text-ink prose-strong:font-semibold
              prose-em:text-ink-dim
              prose-code:text-ink prose-code:bg-surface prose-code:border prose-code:border-edge-faint
              prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.9em] prose-code:font-normal
              prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-surface prose-pre:border prose-pre:border-edge-faint prose-pre:rounded-md
              prose-ul:text-ink-muted prose-ol:text-ink-muted
              prose-li:marker:text-ink-subtle prose-li:leading-relaxed
              prose-blockquote:border-l-trace prose-blockquote:text-ink-dim prose-blockquote:not-italic
              prose-hr:border-edge-faint
              prose-img:rounded-md prose-img:border prose-img:border-edge-faint
              prose-table:text-ink-muted
              prose-th:text-ink prose-th:border-edge
              prose-td:border-edge-faint
            "
          >
            {children}
          </div>
        </div>
      </article>

      {/* ========== FOOTER TIE-BACK ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-14">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Link
              href="/v2/ideas"
              className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:border-edge hover:text-trace"
            >
              <span aria-hidden>←</span>
              <span>ALL IDEAS</span>
            </Link>

            <div
              className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle"
              style={TRACE_GLOW_SOFT}
            >
              <span aria-hidden className="block h-px w-8" style={{ background: 'var(--trace-dim)' }} />
              <span>END · SIGNAL</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
