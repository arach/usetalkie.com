"use client"

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

/**
 * Tiny client island so the rest of the v2 chrome can stay server-rendered.
 * Reads/writes localStorage and toggles `html.dark` — same contract as the
 * pre-paint script in app/layout.jsx, so a refresh keeps the chosen theme.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    const root = document.documentElement
    if (next) root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-edge-dim text-ink-faint transition-colors hover:border-edge hover:text-trace md:h-auto md:w-auto md:px-2 md:py-1.5"
    >
      {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
    </button>
  )
}
