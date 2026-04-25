import Link from 'next/link'
import { DOCS_NAV, siblingDocs } from './DOCS_NAV'

/**
 * DocsLayout — wrapper for every /v2/docs/{slug} page.
 *
 * Pure server component. Owns three structural elements that
 * otherwise drift across docs: the sidebar (from DOCS_NAV), the page
 * header (breadcrumb + title + description), and the prev/next
 * footer (via siblingDocs). Page bodies render as children inside a
 * prose-styled article.
 *
 * Visual language matches DocsIndexPage and DocsNotice — phosphor
 * tokens, font-mono uppercase eyebrows, no donor-borrowed accent
 * fills. The active sidebar item picks up a trace-tinted border and
 * left-edge glow so the user always knows where they are.
 *
 * Props:
 *   slug        — current page slug, used to mark active nav + look
 *                 up prev/next siblings
 *   title       — page title (h1)
 *   description — sub-heading, single sentence
 *   toc         — optional [{ id, label, level }] for right-rail
 *                 in-page navigation. Hidden if not provided. Levels
 *                 2 and 3 are styled distinctly.
 *   children    — page body
 */

const PROSE_CLASSES = [
  // Body text + headings — match the trace + ink token vocabulary the
  // rest of the v2 surface uses. Using arbitrary-variant selectors so
  // we don't pull in @tailwindcss/typography on the static export.
  'text-[15px] leading-relaxed text-ink-muted',
  '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:tracking-[-0.01em] [&_h2]:text-ink',
  '[&_h2]:scroll-mt-24',
  '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-normal [&_h3]:text-ink',
  '[&_h3]:scroll-mt-24',
  '[&_p]:my-4',
  '[&_strong]:font-medium [&_strong]:text-ink',
  '[&_em]:italic [&_em]:text-ink',
  '[&_a]:text-trace [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-ink',
  '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5',
  '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5',
  '[&_li]:text-ink-muted',
  '[&_:not(pre)>code]:rounded [&_:not(pre)>code]:border [&_:not(pre)>code]:border-edge-faint',
  '[&_:not(pre)>code]:bg-surface [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-px',
  '[&_:not(pre)>code]:text-[0.92em] [&_:not(pre)>code]:text-ink',
  '[&_:not(pre)>code]:font-mono',
  '[&_blockquote]:my-6 [&_blockquote]:border-l [&_blockquote]:border-trace/50',
  '[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink',
  '[&_hr]:my-10 [&_hr]:border-edge-faint',
].join(' ')

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

function SidebarSection({ section, activeSlug }) {
  return (
    <div className="space-y-1.5">
      <p
        className="px-3 font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle"
        style={TRACE_GLOW_SOFT}
      >
        {section.label}
      </p>
      <ul className="space-y-px">
        {section.items
          .filter((item) => !item.hidden)
          .map((item) => {
            const active = item.slug === activeSlug
            return (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative block rounded-sm px-3 py-1.5 text-[13px] transition-colors ${
                    active
                      ? 'bg-canvas-alt text-ink'
                      : 'text-ink-muted hover:bg-canvas-alt hover:text-ink'
                  }`}
                  style={
                    active
                      ? {
                          boxShadow:
                            'inset 2px 0 0 0 var(--trace), 0 0 12px color-mix(in oklab, var(--trace-glow) 20%, transparent)',
                        }
                      : undefined
                  }
                >
                  {item.title}
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

function TocRail({ toc }) {
  if (!toc || toc.length === 0) return null
  return (
    <nav
      aria-label="On this page"
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pl-4 lg:block"
    >
      <p
        className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle"
        style={TRACE_GLOW_SOFT}
      >
        On this page
      </p>
      <ul className="mt-3 space-y-1.5 border-l border-edge-faint">
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'pl-6' : 'pl-3'}>
            <a
              href={`#${item.id}`}
              className="block py-0.5 text-[12.5px] text-ink-muted transition-colors hover:text-trace"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function PrevNext({ slug }) {
  const { prev, next } = siblingDocs(slug)
  if (!prev && !next) return null
  return (
    <nav
      aria-label="Previous and next docs"
      className="mt-16 grid grid-cols-1 gap-3 border-t border-edge-faint pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col rounded-sm border border-edge-faint p-4 transition-colors hover:border-edge"
        >
          <span
            className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle group-hover:text-trace"
            style={TRACE_GLOW_SOFT}
          >
            ← Previous
          </span>
          <span className="mt-2 font-display text-base text-ink">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col rounded-sm border border-edge-faint p-4 text-right transition-colors hover:border-edge sm:text-right"
        >
          <span
            className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle group-hover:text-trace"
            style={TRACE_GLOW_SOFT}
          >
            Next →
          </span>
          <span className="mt-2 font-display text-base text-ink">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default function DocsLayout({ slug, title, description, toc, children }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)_200px]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
          <div className="space-y-6">
            <Link
              href="/v2/docs"
              className="block px-3 font-mono text-[10px] uppercase tracking-[0.26em] text-trace transition-colors hover:text-ink"
              style={TRACE_GLOW_SOFT}
            >
              ← Docs index
            </Link>
            {DOCS_NAV.map((section) => (
              <SidebarSection key={section.label} section={section} activeSlug={slug} />
            ))}
          </div>
        </aside>

        {/* Body */}
        <article className="min-w-0">
          <header className="mb-8 border-b border-edge-faint pb-6">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
              style={TRACE_GLOW_SOFT}
            >
              /docs/{slug}
            </p>
            <h1 className="mt-3 font-display text-4xl font-normal leading-tight tracking-[-0.02em] text-ink sm:text-[44px]">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                {description}
              </p>
            )}
          </header>

          <div className={PROSE_CLASSES}>{children}</div>

          <PrevNext slug={slug} />
        </article>

        {/* Right rail TOC */}
        <TocRail toc={toc} />
      </div>
    </div>
  )
}
