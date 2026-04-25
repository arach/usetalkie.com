"use client"

import { useRotation } from '../../lib/useRotation'

/**
 * RotatingTagline — fades through fills of "A ___ is all you need.",
 * the supporting half of Talkie's brand pair.
 *
 * Why rotation matters
 * --------------------
 * "A mic is all you need" is a direct callback to "Attention Is All You
 * Need" (Vaswani et al., 2017). Rotating through fills keeps the joke
 * alive across visits — anticipation is a brand-loyalty signal — while
 * each fill lands a different concrete input. Hard rule: every fill
 * must be an actual thing the user can produce or use. No abstractions
 * (thought, signal, moment) — those break the joke because the original
 * "attention" is also a real mechanism, not a vibe.
 *
 *   mic      → the device
 *   word     → atomic verbal unit
 *   whisper  → soft voice mode
 *   memo     → recorded artifact (the resulting object)
 *
 * Behavior
 * --------
 * - SSR: renders the anchor variant (variants[0], typically "mic"). The
 *   first paint is deterministic; social-card scrapers and the no-JS
 *   fallback see a stable line.
 * - Hydrates on client → useRotation cycles the index. React `key`
 *   forces the inner span to remount, which triggers the
 *   `tagline-fade-in` CSS keyframe defined in globals.css.
 * - Pauses on hover so a reader can dwell on a particular variant.
 * - Respects prefers-reduced-motion (handled inside useRotation).
 *
 * Hard rule for callers: every fill must be 1–2 syllables. "Attention"
 * (3 syllables) is the original; the punch of the callback comes from
 * compressing even further. Recording, keystroke, narration → break it.
 */
export default function RotatingTagline({
  variants = ['mic', 'word', 'whisper', 'memo'],
  intervalMs = 6000,
  className = '',
}) {
  const { index, pause, resume } = useRotation(variants.length, intervalMs)

  return (
    <span className={className} onMouseEnter={pause} onMouseLeave={resume}>
      <span key={index} className="tagline-fade-in inline-block">
        A {variants[index]} is all you need.
      </span>
    </span>
  )
}
