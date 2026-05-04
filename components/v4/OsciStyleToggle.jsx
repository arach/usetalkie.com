'use client'

import { useEffect, useState } from 'react'

/**
 * Osci-style toggle — small floating segmented control that flips the
 * `data-osci-style` attribute on <html>, swapping the panel-* CSS vars
 * to one of three light-mode chassis identities (or back to default).
 *
 * Persists the choice to localStorage; the layout's beforeInteractive
 * theme-init script reads that value and re-applies the attribute on
 * load before first paint, so reloading on a non-default treatment
 * doesn't flash through the default.
 *
 * Dark mode is unaffected by all variants — every override is scoped to
 * `:not(.dark)` in globals.css. The widget still cycles in dark mode
 * (the attribute is set), but visible changes only appear on light
 * theme.
 */
const OPTIONS = [
  { key: 'phosphor',       label: 'Original'      },
  { key: 'ember-cream',    label: 'Ember·Cream'   },
  { key: 'ember-notepad',  label: 'Ember·Notepad' },
  { key: 'cream-desk',     label: 'Cream'         },
  { key: 'field-notebook', label: 'Notepad'       },
]

export default function OsciStyleToggle() {
  const [active, setActive] = useState('phosphor')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('osci-style')
      if (stored && OPTIONS.find(o => o.key === stored)) {
        setActive(stored)
      } else {
        setActive('phosphor')
      }
    } catch {}
  }, [])

  const apply = (key) => {
    setActive(key)
    const root = document.documentElement
    if (key === 'phosphor') {
      root.removeAttribute('data-osci-style')
    } else {
      root.setAttribute('data-osci-style', key)
    }
    try {
      if (key === 'phosphor') localStorage.removeItem('osci-style')
      else localStorage.setItem('osci-style', key)
    } catch {}
  }

  if (!mounted) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1 rounded-md border border-edge-faint px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider shadow-md backdrop-blur"
      style={{ background: 'var(--canvas-overlay)' }}
      role="group"
      aria-label="Oscilloscope chassis style"
    >
      <span className="px-1 text-ink-subtle">scope</span>
      {OPTIONS.map(o => {
        const isActive = active === o.key
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => apply(o.key)}
            aria-pressed={isActive}
            className={`rounded-sm px-2 py-0.5 transition-colors ${
              isActive
                ? 'text-canvas'
                : 'text-ink-muted hover:text-ink'
            }`}
            style={isActive ? {
              background: 'var(--trace)',
              color: 'var(--canvas)',
            } : undefined}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
