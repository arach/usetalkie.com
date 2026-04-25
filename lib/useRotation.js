"use client"

import { useEffect, useState } from 'react'

/**
 * useRotation — single-source-of-truth for the v2 site's "cycle through
 * a list every N seconds" pattern.
 *
 * Used by:
 *   - <RotatingTagline/>  — fades through "A ___ is all you need." fills
 *   - <RotatingDevices/>  — phosphor-highlights one of MAC / iPhone / Watch
 *   - …anything else that wants the same cadence (default 6s, matching
 *     the osc-sweep family).
 *
 * Behavior
 * --------
 * - SSR: returns index=0 deterministically. First paint is stable; share
 *   cards and the no-JS fallback see whichever item the caller put first.
 * - Hydrates on client → setInterval cycles `index` every `intervalMs`.
 * - Caller can call `pause()` / `resume()` (e.g. on mouse enter/leave) to
 *   let a reader dwell on a particular item without the cycle running.
 * - Honors `prefers-reduced-motion`: rotation disabled, anchor item stays.
 *
 * Returns: `{ index, pause, resume }`. The hook is intentionally tiny —
 * 15 lines of state — so two-line callers stay readable.
 */
export function useRotation(length, intervalMs = 6000) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || paused || length <= 1) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, length, paused])

  return {
    index,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  }
}
