"use client"

import { Pause, Play, X } from 'lucide-react'
import LiveTrace from '../LiveTrace'
import { useNarrator } from './NarratorProvider'

/**
 * NarratorDock — floating mini-oscilloscope + cinematic caption.
 *
 * Layout (top → bottom):
 *   1. Header        status pill + transport buttons
 *   2. Trace + caption    the trace fills the area; the caption is
 *                         absolute-positioned over the lower portion,
 *                         like a film subtitle. No background block —
 *                         the text-shadow paints canvas color around the
 *                         glyphs so they punch through any trace line.
 *   3. Status bar    mirrors the header bar at the bottom for visual
 *                    balance. Shows trig state on the left + format on
 *                    the right (or the missing-audio fallback message).
 */
export default function NarratorDock() {
  const { clip, isPlaying, captionText, missing, analyserRef, play, pause, close } = useNarrator()

  if (!clip) return null

  const togglePlay = () => {
    if (missing) return
    if (isPlaying) pause()
    else play(clip)
  }

  return (
    <div
      role="dialog"
      aria-label={clip.caption || 'Audio narration'}
      className="fixed bottom-4 right-4 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-md border border-edge bg-canvas-overlay font-mono shadow-2xl backdrop-blur-md"
    >
      {/* Header — status pill + transport */}
      <div className="flex items-center justify-between gap-3 border-b border-edge-dim px-3 py-2 text-[9px] uppercase tracking-[0.24em] text-ink-faint">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace"
            style={{ boxShadow: '0 0 6px var(--trace)' }}
          />
          <span className="truncate">
            {missing ? 'STANDBY' : isPlaying ? 'PLAYING' : 'PAUSED'} · {clip.caption || clip.slug}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={togglePlay}
            disabled={missing}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-ink-muted transition-colors hover:text-trace disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-ink-muted transition-colors hover:text-trace"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Trace + cinematic caption overlay */}
      <div className="relative bg-canvas-alt p-2">
        <LiveTrace
          analyserRef={analyserRef}
          playing={isPlaying}
          viewW={600}
          viewH={88}
          compact
        />

        {/* Caption — film-subtitle style, no background, text-shadow stroke */}
        {!missing && captionText && (
          <p
            aria-live="polite"
            className="pointer-events-none absolute inset-x-4 bottom-3 text-center text-sm font-sans font-medium leading-snug text-ink"
            style={{
              textShadow:
                '0 0 4px var(--canvas-alt), 0 0 8px var(--canvas-alt), 0 0 12px var(--canvas-alt), 0 1px 2px var(--canvas-alt)',
            }}
          >
            {captionText}
          </p>
        )}
      </div>

      {/* Bottom status bar — mirrors the top header */}
      <div className="flex items-center justify-between gap-3 border-t border-edge-faint px-3 py-1.5 text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
        {missing ? (
          <span className="truncate">no audio yet · row stays visible</span>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-1 w-1 rounded-full"
                style={{
                  background: isPlaying ? 'var(--trace)' : 'var(--ink-faint)',
                  boxShadow: isPlaying ? '0 0 4px var(--trace)' : 'none',
                }}
              />
              {isPlaying ? 'TRIG · LIVE' : captionText ? 'TRIG · HOLD' : 'TRIG · ARMED'}
            </span>
            <span>32.1kHz · MONO</span>
          </>
        )}
      </div>
    </div>
  )
}
