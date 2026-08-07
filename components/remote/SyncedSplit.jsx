'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Synced split — one recording, two lights, one draggable seam.
 *
 * Both 47-second captures run at once and stay time-locked. The light
 * pass is clipped to everything right of the seam, so dragging does not
 * toggle between two states — it moves the boundary *through* motion
 * that is already happening. No pause, no reload, no waiting for a
 * second clip to buffer.
 *
 * Two implementation notes worth keeping in mind if this changes:
 *
 * 1. `clip-path: inset()` is the right tool here, not width. Width would
 *    letterbox the overlay video (its intrinsic aspect ratio would fight
 *    the container); clip-path leaves both videos identically laid out
 *    and only changes which pixels paint.
 *
 * 2. Two <video> elements never stay in sync on their own — independent
 *    decoders drift, especially after a tab is backgrounded. The fix is
 *    a cheap correcting loop: the dark pass is the clock, and the light
 *    pass is nudged back whenever it strays past a threshold that is
 *    wider than a frame (so we do not thrash the decoder) but tighter
 *    than perception (so the seam never shows two different moments).
 *
 * The pair is ~17 MB, so nothing loads until the section is near the
 * viewport, and playback stops again once it leaves.
 */

const SYNC_TOLERANCE_S = 0.2
const DEFAULT_SEAM = 52

export default function SyncedSplit({
  darkSrc = '/videos/fresh/talkie-dark-screen-library.mp4',
  lightSrc = '/videos/fresh/talkie-light-screen-library.mp4',
  darkPoster = '/videos/fresh/talkie-dark-screen-library-poster.jpg',
  lightPoster = '/videos/fresh/talkie-light-screen-library-poster.jpg',
}) {
  const frameRef = useRef(null)
  const darkRef = useRef(null)
  const lightRef = useRef(null)
  const [seam, setSeam] = useState(DEFAULT_SEAM)
  const [live, setLive] = useState(false)
  const [dragging, setDragging] = useState(false)

  /* Load and play only while the section is in play. */
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const observer = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: '200px 0px', threshold: 0.01 },
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const dark = darkRef.current
    const light = lightRef.current
    if (!dark || !light) return

    if (live) {
      // play() rejects on browsers that block autoplay even when muted;
      // the poster stays up and the seam still drags, so swallow it.
      dark.play().catch(() => {})
      light.play().catch(() => {})
    } else {
      dark.pause()
      light.pause()
    }
  }, [live])

  /* The dark pass is the clock; the light pass is corrected to it. */
  useEffect(() => {
    const dark = darkRef.current
    const light = lightRef.current
    if (!dark || !light) return

    const correct = () => {
      if (light.readyState < 1 || dark.readyState < 1) return
      if (Math.abs(light.currentTime - dark.currentTime) > SYNC_TOLERANCE_S) {
        light.currentTime = dark.currentTime
      }
    }

    dark.addEventListener('timeupdate', correct)
    dark.addEventListener('seeked', correct)
    dark.addEventListener('play', correct)
    return () => {
      dark.removeEventListener('timeupdate', correct)
      dark.removeEventListener('seeked', correct)
      dark.removeEventListener('play', correct)
    }
  }, [])

  const seamFromPointer = useCallback((clientX) => {
    const frame = frameRef.current
    if (!frame) return
    const { left, width } = frame.getBoundingClientRect()
    if (!width) return
    const pct = ((clientX - left) / width) * 100
    setSeam(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDragging(true)
    seamFromPointer(event.clientX)
  }
  const onPointerMove = (event) => {
    if (!dragging) return
    seamFromPointer(event.clientX)
  }
  const endDrag = (event) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    setDragging(false)
  }

  const onKeyDown = (event) => {
    const step = event.shiftKey ? 10 : 2
    if (event.key === 'ArrowLeft') setSeam((s) => Math.max(0, s - step))
    else if (event.key === 'ArrowRight') setSeam((s) => Math.min(100, s + step))
    else if (event.key === 'Home') setSeam(0)
    else if (event.key === 'End') setSeam(100)
    else return
    event.preventDefault()
  }

  return (
    <div>
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="group relative aspect-[16/10] w-full select-none overflow-hidden rounded-lg border border-edge-dim bg-screen-bg"
        style={{ cursor: dragging ? 'grabbing' : 'ew-resize', touchAction: 'pan-y' }}
      >
        <video
          ref={darkRef}
          src={darkSrc}
          poster={darkPoster}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Talkie for Mac in dark appearance, 47-second capture"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={lightRef}
          src={lightSrc}
          poster={lightPoster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${seam}%)` }}
        />

        {/* Seam. 2px because it is a grab target, not a hairline —
            a 1px rule on a fractional percentage offset would blur. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-amber"
          style={{ left: `${seam}%`, marginLeft: -1, boxShadow: '0 0 12px var(--amber)' }}
        />

        {/* Handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Appearance seam position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(seam)}
          aria-valuetext={`${Math.round(seam)} percent light`}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber/70 bg-canvas-overlay backdrop-blur-sm transition-transform duration-150 focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--amber)] group-hover:scale-105"
          style={{ left: `${seam}%`, boxShadow: '0 0 16px color-mix(in oklab, var(--amber) 45%, transparent)' }}
        >
          <span aria-hidden className="font-mono text-[11px] tracking-[0.1em] text-amber">
            ‹ ›
          </span>
        </div>

        {/* Corner labels, each pinned to the light it belongs to. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 rounded-sm px-2 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-screen-ink-dim"
          style={{ background: 'color-mix(in oklab, #000 55%, transparent)' }}
        >
          DARK
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 rounded-sm px-2 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-dim"
          style={{ background: 'color-mix(in oklab, #fff 62%, transparent)' }}
        >
          LIGHT
        </span>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
        <span className="text-amber">DRAG THE SEAM</span>
        <span aria-hidden className="text-ink-subtle">/</span>
        <span>ONE 47-SECOND SESSION, BOTH APPEARANCES, PLAYING AT ONCE</span>
      </p>
    </div>
  )
}
