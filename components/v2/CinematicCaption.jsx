"use client"

import { forwardRef, useEffect, useRef, useState } from 'react'

/**
 * CinematicCaption — subtitle pill with per-word "karaoke" fill.
 *
 * Driven by an alignment.json file (one per clip, emitted by
 * scripts/render-clip.mjs). On each RAF tick while playing, finds the
 * active phrase (the one whose [start, end] contains audio.currentTime)
 * and classifies its words by playback state:
 *
 *   spoken    →  text-ink           (past words, fully filled)
 *   active    →  text-trace + glow  (currently being said)
 *   upcoming  →  text-ink-faint     (future words, dim)
 *
 * Visual: subtle phosphor border + canvas-overlay backdrop-blur, mono
 * font (matches the instrument-panel typography of the trace shell).
 * Pure decorative — the VTT TextTrack still drives screen-reader
 * announcements via the existing aria-live caption channel, so this
 * component stays `aria-hidden`.
 *
 * Props:
 *   audioRef    ref to the <audio> element (used for currentTime)
 *   alignSrc    URL of the .alignment.json for the current clip
 *   playing     whether to spin the RAF loop (no-op when false)
 *   className   size + extra styling (caller controls font-size)
 *   phase       'live' | 'finalize' | 'idle'
 *               live      — per-word karaoke fill (audio playing)
 *               finalize  — all words promoted to "spoken" + scan-line
 *                           sweep across the pill (post-audio
 *                           transcription beat)
 *               idle      — same as live but RAF paused
 *   finalizeKey changes once per finalize fire so the scan-line keyframe
 *               replays cleanly on each clip.
 *   ref         forwarded to the outer span so the parent can measure
 *               its bounding rect for the FLIP transition.
 */
const CinematicCaption = forwardRef(function CinematicCaption(
  { audioRef, alignSrc, playing, className = '', phase = 'live', finalizeKey },
  ref
) {
  const [alignment, setAlignment] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const cacheRef = useRef(new Map())

  // Fetch + cache alignment per clip. Cached so re-activating the same
  // clip (auto-advance loop, scrub, etc.) doesn't re-fetch.
  useEffect(() => {
    if (!alignSrc) {
      setAlignment(null)
      return
    }
    if (cacheRef.current.has(alignSrc)) {
      setAlignment(cacheRef.current.get(alignSrc))
      return
    }
    let live = true
    fetch(alignSrc)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!live) return
        cacheRef.current.set(alignSrc, j)
        setAlignment(j)
      })
      .catch(() => {
        if (live) setAlignment(null)
      })
    return () => {
      live = false
    }
  }, [alignSrc])

  // RAF loop tracking currentTime while playing. Not started when paused
  // so we don't burn frames; the paused state retains the last computed
  // word classification, which is exactly what you want visually.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    const loop = () => {
      const audio = audioRef?.current
      if (audio) setCurrentTime(audio.currentTime)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing, audioRef])

  if (!alignment?.phrases?.length) return null

  // Find the phrase whose window contains currentTime. If we're past
  // the last phrase (e.g., during the brief tail after the audio ends),
  // keep the last phrase visible until the parent unmounts us.
  let phrase = null
  for (const p of alignment.phrases) {
    if (currentTime >= p.start && currentTime < p.end) {
      phrase = p
      break
    }
    if (currentTime >= p.start) phrase = p
  }
  if (!phrase) phrase = alignment.phrases[0]

  const isFinalize = phase === 'finalize'

  return (
    <span
      ref={ref}
      aria-hidden
      className={`relative inline-block overflow-hidden rounded-sm border bg-canvas-overlay/75 px-3 py-1 font-mono leading-snug backdrop-blur-md ${className} ${
        isFinalize ? 'border-edge caption-finalize' : 'border-edge-faint'
      }`}
    >
      {phrase.words.map((w, i) => {
        // During finalize, everything is "spoken" — the transcription
        // has settled, no live cursor. During live playback we render
        // the karaoke classification.
        const state = isFinalize
          ? 'spoken'
          : currentTime < w.start
          ? 'upcoming'
          : currentTime < w.end
          ? 'active'
          : 'spoken'
        const colorClass =
          state === 'active' ? 'text-trace' : state === 'spoken' ? 'text-ink' : 'text-ink-faint'
        return (
          <span
            key={`${phrase.start}-${i}`}
            className={colorClass}
            style={
              state === 'active'
                ? { textShadow: '0 0 4px var(--trace-glow)', transition: 'color 0.18s ease-out' }
                : { transition: 'color 0.36s ease-out' }
            }
          >
            {w.word}
            {i < phrase.words.length - 1 ? ' ' : ''}
          </span>
        )
      })}

      {/* Scan-line sweep — the "transcribing" ambient cue. Gated on
          a non-zero finalizeKey so the very first phase=finalize
          render doesn't fire it spuriously; the parent bumps
          finalizeKey at the precise moment we want the scan to run.
          Keyed by finalizeKey so the keyframe replays per clip.
          Pure decoration: the layout (and width measurement for
          FLIP) is unchanged. */}
      {isFinalize && finalizeKey > 0 && (
        <span
          key={finalizeKey}
          aria-hidden
          className="caption-scanline pointer-events-none absolute inset-y-0 -left-8 w-8"
        />
      )}
    </span>
  )
})

export default CinematicCaption
