"use client"

import { useRotation } from '../../lib/useRotation'

/**
 * RotatingDevices — renders a device list with one phosphor-highlighted,
 * cycling through every `intervalMs`.
 *
 * Why this shape (highlight-rotating instead of swap-rotating)
 * ------------------------------------------------------------
 * The "MAC · iPhone · Watch" eyebrow on the hero is a multi-device
 * positioning statement — we want the reader to see all three at once.
 * Swap-rotating ("MAC" → "iPhone" → "Watch") would lose the "supports
 * all three" signal. Highlight-rotating preserves it: every device is
 * visible, the rotation just draws the eye to a different one each
 * cycle, like a status panel quietly cycling channels.
 *
 * The active device gets `text-trace` + a soft phosphor textShadow.
 * Inactive devices stay at the parent's text color (typically
 * `text-ink-subtle` for an eyebrow). CSS transition on color +
 * text-shadow makes the handoff smooth, no React `key` remount needed.
 *
 * Behavior
 * --------
 * - SSR: highlights devices[0]. First paint is stable.
 * - Hydrates on client → useRotation cycles which index is active.
 * - Pauses on hover.
 * - Respects prefers-reduced-motion (handled inside useRotation).
 */
export default function RotatingDevices({
  devices = ['MAC', 'iPHONE', 'WATCH'],
  intervalMs = 6000,
  separator = ' · ',
  className = '',
}) {
  const { index, pause, resume } = useRotation(devices.length, intervalMs)

  return (
    <span className={className} onMouseEnter={pause} onMouseLeave={resume}>
      {devices.map((device, i) => {
        const isActive = i === index
        return (
          <span key={device}>
            <span
              className="transition-colors duration-500"
              style={
                isActive
                  ? {
                      color: 'var(--trace)',
                      textShadow: '0 0 4px var(--trace-glow)',
                    }
                  : undefined
              }
            >
              {device}
            </span>
            {i < devices.length - 1 && separator}
          </span>
        )
      })}
    </span>
  )
}
