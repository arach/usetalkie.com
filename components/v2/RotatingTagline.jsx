"use client"

import { useRotation } from '../../lib/useRotation'
import { TAGLINE_VARIANTS } from '../../content/v2/tagline'

/**
 * RotatingTagline — fades through fills of "A ___ is all you need.",
 * the supporting half of Talkie's brand pair.
 *
 * Variants live in `content/v2/tagline.js` — that file is the single
 * source of truth for brand-voice strings. Don't hardcode fills here
 * or in callers; import them.
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
 */
export default function RotatingTagline({
  variants = TAGLINE_VARIANTS,
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
