"use client"

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

/**
 * Two-tier mobile nav. `Product` holds the pages that show the app in use.
 * `Learn` holds the pages that explain it. Downloads is not repeated here:
 * the sticky header keeps that action on screen at every width.
 */
const NAV_GROUPS = [
  {
    id: 'product',
    label: 'Product',
    items: [
      { label: 'Tour', href: '/tour' },
      { label: 'Workflows', href: '/workflows' },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    items: [
      { label: 'Docs', href: '/docs' },
      { label: 'Philosophy', href: '/philosophy' },
      { label: 'Ideas', href: '/ideas' },
    ],
  },
]

/**
 * Compact mobile primary-nav disclosure for SiteShell.
 * Integrates into the mono instrument header (not a generic full-screen
 * hamburger redesign): 44×44 trigger, Escape close, focus restore, and a
 * single visible close control inside the panel.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  const close = useCallback(() => {
    setOpen(false)
    // Restore focus to the trigger after close for keyboard users.
    queueMicrotask(() => triggerRef.current?.focus())
  }, [])

  const openMenu = useCallback(() => {
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      const list = Array.from(focusables)
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    // Move focus into the panel when opened.
    queueMicrotask(() => closeRef.current?.focus())

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close])

  return (
    <div className="lg:hidden">
      {/* The panel owns the only visible close control while it is open. */}
      <button
        ref={triggerRef}
        type="button"
        className={`inline-flex h-11 w-11 items-center justify-center rounded-sm border border-edge-dim text-ink-muted transition-colors hover:border-edge hover:text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-trace ${open ? 'invisible pointer-events-none' : ''}`}
        aria-label="Open menu"
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={openMenu}
      >
        <Menu className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <>
          {/*
            Tap-outside dismissal only. It is hidden from assistive tech so the
            Close button stays the single announced close control.
          */}
          <div
            aria-hidden
            className="fixed inset-0 z-40 backdrop-blur-[2px]"
            style={{
              // Not `bg-ink/45`: `--ink` is a bare var() with no
              // <alpha-value>, so Tailwind v3 emits no rule for it and the
              // scrim renders transparent.
              background: 'color-mix(in oklab, var(--ink) 45%, transparent)',
            }}
            onClick={close}
          />
          {/*
            Viewport-fixed panel below the sticky header (h-12). Do not
            position absolute to the 44px trigger — at 320px that clips
            the menu offscreen to the left of the narrow trigger box.
            Background is `canvas` (opaque in every theme), not
            `canvas-overlay` (0.82–0.88 alpha), so page content does not
            read through the menu.
          */}
          <nav
            ref={panelRef}
            id={panelId}
            aria-label="Primary"
            className="fixed inset-x-4 top-14 z-50 max-h-[min(28rem,calc(100dvh-4.5rem))] w-auto overflow-y-auto overscroll-contain rounded-md border border-edge bg-canvas shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] sm:inset-x-auto sm:right-4 sm:left-auto sm:w-[min(18rem,calc(100vw-2rem))]"
          >
            <div className="flex items-center justify-between border-b border-edge-faint px-3 py-2">
              <p className="text-[9px] uppercase tracking-[0.24em] text-ink-subtle">· Menu</p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-trace"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {NAV_GROUPS.map((group, groupIndex) => (
              <div
                key={group.id}
                className={groupIndex > 0 ? 'border-t border-edge-faint' : undefined}
              >
                <h2
                  id={`${panelId}-${group.id}`}
                  className="px-4 pt-3 pb-1 text-[9px] uppercase tracking-[0.28em] text-ink-subtle"
                >
                  {group.label}
                </h2>
                <ul aria-labelledby={`${panelId}-${group.id}`} className="pb-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={
                          group.id === 'product'
                            ? 'flex min-h-11 items-center px-4 text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-surface hover:text-trace'
                            : 'flex min-h-11 items-center px-4 text-[11px] uppercase tracking-[0.22em] text-ink-dim transition-colors hover:bg-surface hover:text-ink'
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </>
      )}
    </div>
  )
}
