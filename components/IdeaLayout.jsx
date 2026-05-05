import Link from 'next/link'

/**
 * Idea slug layout — v2 oscilloscope canvas.
 *
 * Server component. Wraps MDX `children` in a header + article + footer
 * tied to the SiteShell that already wraps every /* route.
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
 *
 * Deep treatment
 * --------------
 * Drop-cap on first paragraph, pull-quote with tall amber stroke, h2
 * section eyebrows ("§ 02") via CSS counters, hover anchor mark on
 * headings, and chrome-wrapped pre blocks. All scoped via `.idea-prose`
 * + an inline <style> tag so we don't touch globals.css.
 *
 * Page framing
 * ------------
 * The three sections (header / article / footer tie-back) are wrapped
 * in a max-w-5xl "page" — a thin border + subtle shadow that anchors
 * the 3xl prose column inside a visible container, so the article
 * reads as an object in space rather than a floating 768px column
 * inside the viewport-wide SiteShell (which is 6xl). The outer margin
 * on desktop is where the page's canvas bg becomes visible, signaling
 * "there is a page, and there is a margin around it."
 */

const GRATICULE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
}
const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }
const PULSE_DOT_GLOW = { boxShadow: '0 0 8px var(--amber)' }

const IDEA_PROSE_CSS = `
.idea-prose { counter-reset: idea-h2; }

/* Drop-cap on the first paragraph */
.idea-prose > p:first-of-type::first-letter {
  font-family: var(--font-display, ui-serif, Georgia, serif);
  font-style: italic;
  font-weight: 400;
  color: var(--amber);
  float: left;
  font-size: 3.6em;
  line-height: 0.92;
  padding: 0.08em 0.12em 0 0;
  margin-left: -0.04em;
  text-shadow: 0 0 6px color-mix(in oklab, var(--amber) 30%, transparent);
}

/* Section eyebrow above h2 — uses CSS counter so the index is automatic */
.idea-prose h2 {
  counter-increment: idea-h2;
  position: relative;
}
.idea-prose h2::before {
  content: "§ " counter(idea-h2, decimal-leading-zero);
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--ink-subtle);
  margin-bottom: 0.85rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--edge-faint);
  font-style: normal;
  font-weight: 500;
}

/* Hover anchor marker (decorative — sits in the gutter on hover) */
.idea-prose h2::after,
.idea-prose h3::after {
  content: "#";
  position: absolute;
  left: -1.4em;
  top: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 400;
  font-size: 0.7em;
  color: var(--amber);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: translateX(4px);
  text-shadow: 0 0 4px color-mix(in oklab, var(--amber) 35%, transparent);
}
.idea-prose h2 { padding-top: 0.25rem; }
.idea-prose h3 { position: relative; }
.idea-prose h3::after {
  font-size: 0.65em;
  left: -1.2em;
}
.idea-prose h2:hover::after,
.idea-prose h3:hover::after {
  opacity: 0.85;
  transform: translateX(0);
}

/* Pull-quote — amber stroke on the left, oversized italic, no quote glyph */
.idea-prose blockquote {
  border-left: 3px solid var(--amber);
  padding: 0.4rem 0 0.4rem 1.4rem;
  margin: 2rem 0;
  font-style: italic;
  font-size: 1.18em;
  line-height: 1.55;
  color: var(--ink-dim);
  background: transparent;
  quotes: none;
}
.idea-prose blockquote::before,
.idea-prose blockquote::after { content: none; }
.idea-prose blockquote p { margin: 0; }
.idea-prose blockquote p::before,
.idea-prose blockquote p::after { content: none; }

/* Code block chrome — wrap <pre> in a gutter band that reads as instrument-screen */
.idea-prose pre {
  background: var(--panel-bg);
  border: 1px solid var(--panel-edge-dim);
  border-radius: 6px;
  padding: 1rem 1.1rem;
  color: var(--screen-ink);
  font-size: 0.84em;
  line-height: 1.65;
  position: relative;
  box-shadow: 0 0 0 1px var(--edge-faint), 0 1px 2px rgba(0,0,0,0.04);
}
.idea-prose pre::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 12px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--amber);
  opacity: 0.55;
  box-shadow: 0 0 6px var(--amber);
}
.idea-prose pre code {
  background: transparent !important;
  border: 0 !important;
  padding: 0 !important;
  color: var(--screen-ink) !important;
  font-size: 1em !important;
}

/* Inline links — hover lifts to amber */
.idea-prose a:hover { color: var(--amber); text-decoration-color: var(--amber); }

/* hr — small centered glyph instead of a flat rule */
.idea-prose hr {
  border: 0;
  text-align: center;
  margin: 2.5rem 0;
  height: auto;
}
.idea-prose hr::after {
  content: "· · ·";
  display: inline-block;
  letter-spacing: 0.5em;
  color: var(--ink-subtle);
  font-size: 0.85em;
}

/* Image pop-out — at md+ images escape the prose column into the page
 * gutter (max-w-5xl wrapper) so they read as intentional artifacts
 * rather than column-flush "broken" edges. ~3rem each side; well
 * inside the gutter so they don't touch the page wrapper edge. */
@media (min-width: 768px) {
  /* Generic rule — applies to bare <img> and <figure>. Specificity is
   * (0,1,1) and (0,1,1). The override below has (0,1,2) and wins for
   * <img> nested inside <figure>, so we don't double-escape. */
  .idea-prose img,
  .idea-prose figure {
    width: calc(100% + 6rem);
    max-width: calc(100% + 6rem);
    margin-left: -3rem;
    margin-right: -3rem;
  }
  .idea-prose figure img {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
`

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatDate(dateString) {
  const d = new Date(dateString)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

function getEntryBadge(entryType) {
  if (entryType === 'rfc') return { label: 'RFC' }
  return null
}

function getStatusBadge(status) {
  if (status === 'draft') return { label: 'Draft' }
  return null
}

export default function IdeaLayout({ title, description, date, tags, entryType, status, readMinutes, children }) {
  const entryBadge = getEntryBadge(entryType)
  const statusBadge = getStatusBadge(status)

  return (
    <div className="bg-canvas">
      <style dangerouslySetInnerHTML={{ __html: IDEA_PROSE_CSS }} />
      <div className="mx-auto max-w-5xl px-3 py-8 md:px-6 md:py-12">
        <div className="overflow-hidden rounded-md border border-edge-faint shadow-sm">
      {/* ========== HEADER ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
          {/* Crumb back to the index */}
          <Link
            href="/ideas"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint transition-colors duration-200 hover:text-amber"
          >
            <span aria-hidden className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
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

          {(date || readMinutes) && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span aria-hidden className="block h-px w-10" style={{ background: 'var(--trace-dim)' }} />
              {date && (
                <time
                  dateTime={date}
                  className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle"
                >
                  {formatDate(date)}
                </time>
              )}
              {readMinutes && (
                <>
                  <span aria-hidden className="text-ink-subtle opacity-60">·</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-amber animate-pulse"
                      style={PULSE_DOT_GLOW}
                    />
                    <span>{readMinutes} MIN READ</span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========== ARTICLE ========== */}
      <article className="relative bg-canvas-alt">
        <div className="relative mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
          <div
            className="
              idea-prose prose max-w-none
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
              prose-ul:text-ink-muted prose-ol:text-ink-muted
              prose-li:marker:text-ink-subtle prose-li:leading-relaxed
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
              href="/ideas"
              className="group inline-flex items-center gap-2 rounded-sm border border-edge-dim px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60 hover:text-amber"
            >
              <span aria-hidden className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
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
        </div>
      </div>
    </div>
  )
}
