"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { DOCS_NAV, siblingDocs } from './DOCS_NAV'

/**
 * DocsLayout — wrapper for every /docs/{slug} page.
 *
 * Owns structural documentation elements:
 * - Left sidebar (with doc sections and active highlighting)
 * - Page header (breadcrumb, title, description, and mobile section jumps)
 * - Heading deeplinking (clickable hover '#' anchors, copy URL to clipboard, toast notification)
 * - Right-rail Table of Contents with live scrollspy
 * - Prev/next footer navigation
 */

const PROSE_CLASSES = [
  'text-[15px] leading-relaxed text-ink-muted',
  '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:tracking-[-0.01em] [&_h2]:text-ink',
  '[&_h2]:scroll-mt-24',
  '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-normal [&_h3]:text-ink',
  '[&_h3]:scroll-mt-24',
  '[&_[id]]:scroll-mt-24',
  '[&_.doc-anchor-link]:!no-underline [&_.doc-anchor-link]:text-ink-subtle hover:[&_.doc-anchor-link]:text-amber',
  '[&_p]:my-4',
  '[&_strong]:font-medium [&_strong]:text-ink',
  '[&_em]:italic [&_em]:text-ink',
  '[&_a]:text-trace [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-ink',
  '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5',
  '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5',
  '[&_li]:text-ink-muted',
  '[&_:not(pre)>code]:rounded [&_:not(pre)>code]:border [&_:not(pre)>code]:border-edge-faint',
  '[&_:not(pre)>code]:bg-surface [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5',
  '[&_:not(pre)>code]:text-[0.92em] [&_:not(pre)>code]:text-ink',
  '[&_:not(pre)>code]:font-mono',
  '[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:border-panel-edge',
  '[&_pre]:bg-panel-bg [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[12.5px]',
  '[&_pre]:leading-relaxed [&_pre]:text-panel-ink-dim',
  '[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit',
  '[&_blockquote]:my-6 [&_blockquote]:border-l [&_blockquote]:border-trace/50',
  '[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink',
  '[&_hr]:my-10 [&_hr]:border-edge-faint',
].join(' ')

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

function ToastHUD({ message }) {
  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-sm border border-amber/70 bg-panel-bg/95 px-3.5 py-2 font-mono text-[11.5px] text-panel-ink shadow-xl shadow-black/50 backdrop-blur-md transition-all duration-200"
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-amber"
        style={{ boxShadow: '0 0 6px var(--trace-glow)' }}
      />
      <span>{message}</span>
    </div>
  )
}

function SidebarSection({ section, activeSlug, activeSectionId }) {
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
                  className={`group relative block rounded-sm px-3 py-1.5 text-[13px] transition-all duration-200 ${
                    active
                      ? 'bg-canvas-alt text-ink font-medium'
                      : 'text-ink-muted hover:translate-x-0.5 hover:bg-canvas-alt hover:text-amber'
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

                {/* Sub-sections when this doc is active */}
                {active && item.sections && item.sections.length > 0 && (
                  <ul className="my-1.5 ml-3 space-y-0.5 border-l border-edge-faint pl-2">
                    {item.sections.map((sec) => {
                      const isSecActive = activeSectionId === sec.id
                      return (
                        <li key={sec.id}>
                          <a
                            href={`#${sec.id}`}
                            className={`group/sec flex items-center justify-between py-1 text-[11.5px] transition-colors ${
                              isSecActive
                                ? 'font-medium text-amber'
                                : 'text-ink-subtle hover:text-amber'
                            }`}
                            style={isSecActive ? TRACE_GLOW_SOFT : undefined}
                          >
                            <span className="truncate">
                              <span className="mr-1 font-mono text-[10px] text-amber/60">#</span>
                              {sec.title}
                            </span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
      </ul>
    </div>
  )
}

function TocRail({ toc, activeId, onCopySection }) {
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
        {toc.map((item) => {
          const isActive = activeId === item.id
          return (
            <li
              key={item.id}
              className={`group flex items-center justify-between transition-all duration-150 ${
                item.level === 3 ? 'pl-6' : 'pl-3'
              } ${isActive ? '-ml-px border-l-2 border-amber' : ''}`}
            >
              <a
                href={`#${item.id}`}
                className={`block py-0.5 text-[12.5px] transition-all duration-200 ${
                  isActive
                    ? 'font-medium text-amber'
                    : 'text-ink-muted hover:translate-x-0.5 hover:text-amber'
                }`}
                style={isActive ? TRACE_GLOW_SOFT : undefined}
              >
                {item.label}
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onCopySection(item.id)
                }}
                className="mr-1 text-[11px] font-mono text-ink-subtle opacity-0 transition-opacity group-hover:opacity-100 hover:text-amber"
                title="Copy link to section"
                aria-label={`Copy link to section ${item.label}`}
              >
                #
              </button>
            </li>
          )
        })}
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
          className="group flex flex-col rounded-sm border border-edge-faint p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]"
        >
          <span
            className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle transition-colors duration-200 group-hover:text-amber"
            style={TRACE_GLOW_SOFT}
          >
            <span aria-hidden className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span> Previous
          </span>
          <span className="mt-2 font-display text-base text-ink">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col rounded-sm border border-edge-faint p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-[0_0_22px_-6px_var(--trace-glow)] sm:text-right"
        >
          <span
            className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle transition-colors duration-200 group-hover:text-amber"
            style={TRACE_GLOW_SOFT}
          >
            Next <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </span>
          <span className="mt-2 font-display text-base text-ink">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default function DocsLayout({ slug, title, description, toc, sections, children }) {
  const articleRef = useRef(null)
  const [activeId, setActiveId] = useState('')
  const [toastMessage, setToastMessage] = useState(null)
  const toastTimerRef = useRef(null)

  const resolvedToc =
    toc ??
    (sections || []).map((item) => ({
      id: item.id,
      label: item.label ?? item.title,
      level: item.level ?? 2,
    }))

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage(msg)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 2200)
  }

  const copySectionLink = (id) => {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    window.history.pushState(null, '', `#${id}`)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setActiveId(id)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast(`Copied section link #${id}`)
      }).catch(() => {
        showToast(`Jumped to #${id}`)
      })
    }
  }

  // Handle initial hash on mount or slug change
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      setActiveId(hash)
      const timer = setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [slug])

  // Attach clickable hover anchors to all headings with IDs
  useEffect(() => {
    if (!articleRef.current) return
    const headings = articleRef.current.querySelectorAll('h2[id], h3[id]')
    const cleanupFns = []

    headings.forEach((heading) => {
      const id = heading.id
      if (!id) return
      if (heading.querySelector('.doc-anchor-link')) return

      heading.classList.add('group', 'relative')

      const anchor = document.createElement('a')
      anchor.className =
        'doc-anchor-link ml-2 inline-flex items-center select-none font-mono text-[0.8em] font-normal text-ink-subtle opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:!text-amber focus:opacity-100'
      anchor.href = `#${id}`
      anchor.setAttribute('aria-label', `Permalink to ${heading.textContent?.trim() || id}`)
      anchor.title = 'Copy link to section'
      anchor.innerHTML = '<span class="text-amber">#</span>'

      const handleClick = (e) => {
        e.preventDefault()
        copySectionLink(id)
      }

      anchor.addEventListener('click', handleClick)
      heading.appendChild(anchor)

      cleanupFns.push(() => {
        anchor.removeEventListener('click', handleClick)
        anchor.remove()
      })
    })

    return () => {
      cleanupFns.forEach((fn) => fn())
    }
  }, [slug, children])

  // Track active section on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return

    const headings = articleRef.current?.querySelectorAll('h2[id], h3[id]')
    if (!headings || headings.length === 0) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const headerOffset = 120
      let currentId = ''

      for (let i = 0; i < headings.length; i++) {
        const top = headings[i].getBoundingClientRect().top + scrollY
        if (top - headerOffset <= scrollY) {
          currentId = headings[i].id
        } else {
          break
        }
      }

      if (currentId) {
        setActiveId(currentId)
      } else if (headings[0]) {
        setActiveId(headings[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [slug, children])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)_200px]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
          <div className="space-y-6">
            <Link
              href="/docs"
              className="group block px-3 font-mono text-[10px] uppercase tracking-[0.26em] text-trace transition-colors duration-200 hover:text-amber"
              style={TRACE_GLOW_SOFT}
            >
              <span aria-hidden className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span> Docs index
            </Link>
            {DOCS_NAV.map((section) => (
              <SidebarSection
                key={section.label}
                section={section}
                activeSlug={slug}
                activeSectionId={activeId}
              />
            ))}
          </div>
        </aside>

        {/* Body */}
        <article ref={articleRef} className="min-w-0">
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

            {/* Quick in-page section jumps on mobile */}
            {resolvedToc.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5 lg:hidden">
                <span className="self-center mr-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
                  Jump to:
                </span>
                {resolvedToc
                  .filter((s) => s.level === 2)
                  .map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className={`inline-flex items-center rounded-xs border px-2 py-0.5 font-mono text-[10.5px] transition-colors ${
                        activeId === s.id
                          ? 'border-amber/60 bg-canvas-alt text-amber'
                          : 'border-edge-faint bg-surface/60 text-ink-muted hover:border-amber/50 hover:text-amber'
                      }`}
                    >
                      <span className="mr-0.5 text-amber/70">#</span>
                      {s.label}
                    </a>
                  ))}
              </div>
            )}
          </header>

          <div className={PROSE_CLASSES}>{children}</div>

          <PrevNext slug={slug} />
        </article>

        {/* Right rail TOC */}
        <TocRail
          toc={resolvedToc}
          activeId={activeId}
          onCopySection={copySectionLink}
        />
      </div>

      <ToastHUD message={toastMessage} />
    </div>
  )
}
