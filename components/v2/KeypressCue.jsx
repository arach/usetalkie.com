"use client"

/**
 * KeypressCue — screencast-style hotkey overlay that pops up at the
 * start and end of a Talkie capture, telling the viewer "this is the
 * gesture that triggered the recording."
 *
 * Placement: bottom-right of the trace area, inside the SVG corner-tick
 * guides. Mirrors the position screen-recorders like CleanShot or
 * Keycastr use for their key indicator HUD.
 *
 * Animation: pops in (0.24s) → holds (~1s) → fades out (0.4s) for a
 * total ~1.6s lifecycle. Driven by a CSS keyframe (`keypress-cue`); the
 * parent forces a remount via `key={triggerKey}` so each fire replays
 * the keyframe cleanly.
 *
 * Props:
 *   keys      array of glyph strings, e.g. ['⌘', '⇧', 'A']
 *   variant   'start' | 'end' — drives the small label prefix
 *             ('PRESS' for start, 'RELEASE' for end). Visual treatment
 *             is the same; the label is the only difference.
 */
export default function KeypressCue({ keys = ['⌘', '⇧', 'A'], variant = 'start' }) {
  const label = variant === 'end' ? 'RELEASE' : 'PRESS'
  return (
    <div
      aria-hidden
      className="keypress-cue pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm border border-edge bg-canvas-overlay/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted backdrop-blur-md sm:bottom-4 sm:right-4"
      style={{
        boxShadow:
          '0 0 14px color-mix(in oklab, var(--trace-glow) 28%, transparent), 0 1px 2px rgba(0,0,0,0.06)',
      }}
    >
      <span className="text-[8px] tracking-[0.22em] text-ink-subtle">{label}</span>
      <span className="flex items-center gap-1">
        {keys.map((k, i) => (
          <kbd
            key={i}
            className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-[3px] border border-edge bg-surface px-1 font-mono text-[10px] normal-case text-ink"
          >
            {k}
          </kbd>
        ))}
      </span>
    </div>
  )
}
