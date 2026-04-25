"use client"

import { useEffect, useState } from 'react'

/**
 * RotatingTagline — fades through fills of "A ___ is all you need.",
 * the supporting half of Talkie's brand pair.
 *
 * Why rotation matters
 * --------------------
 * "A mic is all you need" is a direct callback to "Attention Is All You
 * Need" (Vaswani et al., 2017). Rotating through fills keeps the joke
 * alive across visits — anticipation is a brand-loyalty signal — while
 * each fill lands a slightly different positioning angle:
 *
 *   mic      → the literal product
 *   thought  → most reduced form, the actual core
 *   whisper  → intimacy + voice
 *   signal   → on-brand for the oscilloscope canvas
 *
 * Behavior
 * --------
 * - SSR: renders the anchor variant (variants[0], typically "mic"). The
 *   first paint is deterministic; social-card scrapers and the no-JS
 *   fallback see a stable line.
 * - Hydrates on client → setInterval cycle bumps `index` every
 *   `intervalMs` (default 6s, matching the osc-sweep cadence).
 * - React `key={index}` forces the inner span to remount, which
 *   triggers the `tagline-fade-in` CSS keyframe defined in globals.css.
 * - Pauses on hover so a reader can dwell on a particular variant.
 * - Respects prefers-reduced-motion: rotation disabled, anchor variant
 *   stays put. The joke still lands once.
 *
 * Hard rule for callers: every fill must be 1–2 syllables. "Attention"
 * (3 syllables) is the original; the punch of the callback comes from
 * compressing even further. Recording, keystroke, narration → break it.
 */
export default function RotatingTagline({
  variants = ['mic', 'thought', 'whisper', 'signal'],
  intervalMs = 6000,
  className = '',
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || paused || variants.length <= 1) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % variants.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, variants.length, paused])

  return (
    <span
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span key={index} className="tagline-fade-in inline-block">
        A {variants[index]} is all you need.
      </span>
    </span>
  )
}
