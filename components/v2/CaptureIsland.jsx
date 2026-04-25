"use client"

/**
 * CaptureIsland — Dynamic-Island-style status morph for the capture
 * lifecycle. A single persistent pill at the top-center of the trace
 * area whose content morphs across states rather than each phase
 * being a separate component.
 *
 *   recording    → "● REC · {eyebrow}"   pulsing phosphor dot, live
 *   transcribing → "TRANSCRIBING ···"    3-dot phosphor processor pulse
 *   review       → hidden                trailing confirmation lives
 *                                        on the row (paste typing +
 *                                        halo); the island gets out
 *                                        of the way deliberately
 *   idle         → hidden                fades out
 *
 * Mirrors the floating-bubble UI in the actual Talkie macOS app —
 * the same physical indicator follows the user from recording into
 * transcribing, then steps aside so the row's paste-type animation
 * is the visible "your dictation just landed" beat without an
 * overlay shouting on top of it.
 *
 * Props:
 *   phase   — 'idle' | 'recording' | 'transcribing' | 'review'
 *   eyebrow — the active capture's eyebrow text (sub-label during
 *             recording)
 */
export default function CaptureIsland({ phase = 'idle', eyebrow }) {
  // Visible only during the recording → transcribing arc. Review and
  // idle both hide the island so the row's paste typing + halo can
  // carry the trailing confirmation by itself, no overlay competing.
  const visible = phase === 'recording' || phase === 'transcribing'

  const config = {
    recording: {
      label: 'REC',
      sub: eyebrow,
      dotClass: 'animate-pulse',
      dotShadow: '0 0 6px var(--trace)',
      pillExtra: '',
    },
    transcribing: {
      label: 'TRANSCRIBING',
      sub: null,
      dotClass: 'capture-island-dot-pulse',
      dotShadow: '0 0 6px var(--trace)',
      pillExtra: '',
    },
    idle: { label: '', sub: null, dotClass: '', dotShadow: '', pillExtra: '' },
  }[phase] || { label: '', sub: null, dotClass: '', dotShadow: '', pillExtra: '' }

  return (
    <div
      aria-live="polite"
      aria-hidden={!visible}
      className={`pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`flex items-center gap-2 rounded-full border border-edge bg-canvas-overlay/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] backdrop-blur-md ${config.pillExtra}`}
        style={{
          boxShadow: visible
            ? '0 0 14px color-mix(in oklab, var(--trace-glow) 32%, transparent), 0 1px 2px rgba(0,0,0,0.04)'
            : 'none',
          transition: 'box-shadow 0.32s ease-out',
        }}
      >
        {visible && (
          <>
            <span
              aria-hidden
              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace ${config.dotClass}`}
              style={{ boxShadow: config.dotShadow }}
            />
            {/* Inner label remounts via key on phase change so the
                fade-in keyframe replays — the pill itself stays put,
                only the content morphs. */}
            <span
              key={phase}
              className="capture-island-label-fade flex items-center gap-1"
            >
              <span
                className="text-trace"
                style={{ textShadow: '0 0 4px var(--trace-glow)' }}
              >
                {config.label}
              </span>
              {config.sub && (
                <>
                  <span className="text-ink-faint">·</span>
                  <span className="text-ink-muted">{config.sub}</span>
                </>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
