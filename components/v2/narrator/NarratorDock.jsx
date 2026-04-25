"use client"

import { Pause, Play, X } from 'lucide-react'
import LiveTrace from '../LiveTrace'
import { useNarrator } from './NarratorProvider'

/**
 * NarratorDock — floating mini-oscillator + caption rail.
 *
 * Renders nothing when no clip is active. When a clip is set, slides into
 * the bottom-right corner; pressing Esc or the X closes. Reuses the same
 * LiveTrace component as the homepage hero, just in compact mode.
 *
 * The dock intentionally has zero clip-specific logic — every behaviour
 * (play, pause, missing-fallback, captions) is owned by NarratorProvider
 * and consumed via context. This keeps the dock as a pure render surface
 * that we can later swap for a different shape (drawer, popover, etc.)
 * without touching the audio graph.
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

      {/* Mini live trace */}
      <div className="bg-canvas-alt p-2">
        <LiveTrace
          analyserRef={analyserRef}
          playing={isPlaying}
          viewW={600}
          viewH={80}
          compact
        />
      </div>

      {/* Caption rail. aria-live so screen readers get the text. min-height
          so the dock doesn't bounce in size between cues. */}
      <div
        aria-live="polite"
        className="min-h-[30px] border-t border-edge-faint px-3 py-2"
      >
        {missing ? (
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-subtle">
            no audio yet · catalog row visible without sound
          </p>
        ) : captionText ? (
          <p className="text-[11px] italic leading-snug text-ink-muted">{captionText}</p>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-subtle">
            {isPlaying ? '— transcribing —' : 'paused'}
          </p>
        )}
      </div>
    </div>
  )
}
