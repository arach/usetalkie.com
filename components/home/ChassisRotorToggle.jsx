'use client'

import { useEffect, useState } from 'react'

/**
 * Top-of-chassis device-rotor visibility toggle. The vertical DeviceRail
 * in the input bay is the primary device picker; the original top
 * rotor is hidden by default but stays in the DOM (display:none via the
 * `.chassis-rotor-host` rule). This toggle flips an html-level attribute
 * that the CSS rule keys off of.
 *
 * Pre-paint script in app/layout.jsx reads localStorage('chassis-rotor')
 * and applies the attribute before first frame, so reloading with the
 * rotor enabled doesn't flash through the hidden default.
 */
export default function ChassisRotorToggle() {
  const [on, setOn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      setOn(localStorage.getItem('chassis-rotor') === 'on')
    } catch {}
  }, [])

  const apply = (next) => {
    setOn(next)
    const root = document.documentElement
    if (next) root.setAttribute('data-chassis-rotor', 'on')
    else root.removeAttribute('data-chassis-rotor')
    try {
      if (next) localStorage.setItem('chassis-rotor', 'on')
      else localStorage.removeItem('chassis-rotor')
    } catch {}
  }

  if (!mounted) return null

  const buttonStyle = (active) => active
    ? { background: 'var(--trace)', color: 'var(--canvas)' }
    : undefined

  const buttonClass = (active) =>
    `rounded-sm px-2 py-0.5 transition-colors ${
      active ? 'text-canvas' : 'text-ink-muted hover:text-ink'
    }`

  return (
    <div
      className="fixed bottom-16 right-4 z-40 flex items-center gap-1 rounded-md border border-edge-faint px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider shadow-md backdrop-blur"
      style={{ background: 'var(--canvas-overlay)' }}
      role="group"
      aria-label="Top device rotor visibility"
    >
      <span className="px-1 text-ink-subtle">top rotor</span>
      <button
        type="button"
        onClick={() => apply(false)}
        aria-pressed={!on}
        className={buttonClass(!on)}
        style={buttonStyle(!on)}
      >
        Off
      </button>
      <button
        type="button"
        onClick={() => apply(true)}
        aria-pressed={on}
        className={buttonClass(on)}
        style={buttonStyle(on)}
      >
        On
      </button>
    </div>
  )
}
