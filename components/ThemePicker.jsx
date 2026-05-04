'use client'

import { useEffect, useState } from 'react'

/**
 * Site-wide design-theme picker. Flips the html-level `data-theme`
 * attribute between unset (modern, default) and "classic" (donor look).
 *
 * The pre-paint script in app/layout.jsx applies the resolved theme
 * before first frame from a precedence chain:
 *   1. URL `?theme=modern|classic` (campaign-friendly; also sticks to
 *      localStorage so visit-onward navigation keeps the choice)
 *   2. localStorage 'design-theme'
 *   3. 'modern' (site default)
 *
 * The localStorage key is `design-theme` rather than `theme` because the
 * existing dark/light color-scheme toggle already owns `localStorage.theme`.
 * Two orthogonal axes — color scheme + design language — coexist without
 * name collision.
 *
 * Positioned bottom-left so it doesn't conflict with the Modern-only
 * floating toggles (osci-style, chassis-rotor) at bottom-right. Visible
 * on every page since this component is mounted in app/layout.jsx.
 */
const OPTIONS = [
  { key: 'modern',  label: 'Modern'  },
  { key: 'classic', label: 'Classic' },
]

export default function ThemePicker() {
  const [theme, setTheme] = useState('modern')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('design-theme')
      if (stored && OPTIONS.find(o => o.key === stored)) {
        setTheme(stored)
      }
    } catch {}
  }, [])

  const apply = (next) => {
    setTheme(next)
    const root = document.documentElement
    if (next === 'classic') {
      root.setAttribute('data-theme', 'classic')
    } else {
      root.removeAttribute('data-theme')
    }
    try {
      if (next === 'modern') localStorage.removeItem('design-theme')
      else localStorage.setItem('design-theme', next)
    } catch {}
  }

  if (!mounted) return null

  return (
    <div
      className="fixed bottom-4 left-4 z-40 flex items-center gap-1 rounded-md border border-edge-faint px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider shadow-md backdrop-blur"
      style={{ background: 'var(--canvas-overlay)' }}
      role="group"
      aria-label="Design theme"
    >
      <span className="px-1 text-ink-subtle">theme</span>
      {OPTIONS.map(o => {
        const isActive = theme === o.key
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => apply(o.key)}
            aria-pressed={isActive}
            className={`rounded-sm px-2 py-0.5 transition-colors ${
              isActive ? 'text-canvas' : 'text-ink-muted hover:text-ink'
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
