"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import LiveTrace from './LiveTrace'
import SignalTableRow from './SignalTableRow'

/**
 * SignalTable — the navigatable, audio-driven hero player.
 *
 * Catalog comes in as a prop (server-imported from
 * `content/v2/captures.json` and rendered as the static SSR shell in
 * HomePage). On hydration this island takes over: 3-row windowed view,
 * keyboard + scroll-wheel nav, click-to-jump, lazy AudioContext, live
 * amplitude trace via AnalyserNode, captions via the cuechange event,
 * auto-advance to the next clip on `ended`.
 *
 * Audio fallback: a row whose MP3 404s stays visible. Its play button
 * shows "· no audio yet" and clicks no-op (single console.warn for dev
 * visibility — never throws). The 404 status is tracked per-slug so we
 * don't probe the same file twice.
 *
 * AudioContext lifecycle:
 *   - Created lazily on the first play attempt (autoplay-policy safe).
 *   - One AudioContext per island, reused across clips.
 *   - One MediaElementAudioSourceNode per <audio>, cached by slug
 *     (you can only attach a source node to a given media element
 *     once — re-creating it throws InvalidStateError).
 *   - One AnalyserNode shared by all sources.
 *   - Disposed on unmount via context.close().
 *
 * AUTO_ADVANCE: switch to false to make the player stop after each clip.
 */
const AUTO_ADVANCE = true
const WINDOW_SIZE = 3

export default function SignalTable({ catalog }) {
  // -------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [windowStart, setWindowStart] = useState(0)
  const [missingSet, setMissingSet] = useState(() => new Set())
  const [captionText, setCaptionText] = useState('')
  const [captionsOn, setCaptionsOn] = useState(true)

  // -------------------------------------------------------------------
  // Refs (Web Audio + DOM)
  // -------------------------------------------------------------------
  const audioRef = useRef(null)
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceMapRef = useRef(new Map()) // slug → MediaElementAudioSourceNode
  const tableRef = useRef(null)

  const activeCapture = catalog[activeIndex]

  // -------------------------------------------------------------------
  // Lazy AudioContext setup. Called on first user-initiated play.
  // -------------------------------------------------------------------
  const ensureAudioGraph = useCallback(() => {
    if (typeof window === 'undefined') return null
    const audio = audioRef.current
    if (!audio) return null

    // Build the context exactly once.
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      ctxRef.current = new Ctx()
      const analyser = ctxRef.current.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.6
      analyser.connect(ctxRef.current.destination)
      analyserRef.current = analyser
    }

    // Each <audio> element can only be source'd once. We use a single
    // shared <audio> tag whose `src` swaps per clip — so the source
    // node is also created exactly once for that element. We key the
    // map by a stable sentinel ('__audio__') for clarity.
    const map = sourceMapRef.current
    if (!map.has('__audio__')) {
      try {
        const src = ctxRef.current.createMediaElementSource(audio)
        src.connect(analyserRef.current)
        map.set('__audio__', src)
      } catch (err) {
        // Re-attaching throws InvalidStateError — already wired.
        // eslint-disable-next-line no-console
        console.warn('[SignalTable] media source already attached', err)
      }
    }

    return ctxRef.current
  }, [])

  // -------------------------------------------------------------------
  // Window pinning: while playing, keep the active row at the top.
  // While idle, only adjust the window if the active row scrolls out.
  // -------------------------------------------------------------------
  useEffect(() => {
    if (isPlaying) {
      setWindowStart(Math.min(activeIndex, Math.max(0, catalog.length - WINDOW_SIZE)))
      return
    }
    setWindowStart((prev) => {
      if (activeIndex < prev) return activeIndex
      if (activeIndex >= prev + WINDOW_SIZE) return Math.min(activeIndex - WINDOW_SIZE + 1, catalog.length - WINDOW_SIZE)
      return prev
    })
  }, [activeIndex, isPlaying, catalog.length])

  // -------------------------------------------------------------------
  // Play a specific row. Handles src swap + missing-audio + autoplay.
  // -------------------------------------------------------------------
  const playIndex = useCallback(
    async (idx) => {
      const next = catalog[idx]
      if (!next) return
      if (missingSet.has(next.slug)) {
        // eslint-disable-next-line no-console
        console.warn(`[SignalTable] no audio for "${next.slug}" — skipping`)
        return
      }

      const audio = audioRef.current
      if (!audio) return

      ensureAudioGraph()

      // If the user is re-clicking the active row's play button, just
      // resume; otherwise swap src.
      const desiredSrc = next.audio
      const currentSrc = audio.currentSrc || audio.src
      if (!currentSrc.endsWith(desiredSrc)) {
        audio.src = desiredSrc
        audio.load()
      }

      try {
        if (ctxRef.current && ctxRef.current.state === 'suspended') {
          await ctxRef.current.resume()
        }
        await audio.play()
        setActiveIndex(idx)
        setIsPlaying(true)
      } catch (err) {
        // Autoplay rejection or 404 — surface for dev, soft-fail for user.
        // eslint-disable-next-line no-console
        console.warn(`[SignalTable] play failed for "${next.slug}":`, err)
      }
    },
    [catalog, missingSet, ensureAudioGraph]
  )

  // -------------------------------------------------------------------
  // Toggle play for a specific row (used by row buttons).
  // -------------------------------------------------------------------
  const togglePlay = useCallback(
    (idx) => {
      const audio = audioRef.current
      if (!audio) return

      if (idx === activeIndex && isPlaying) {
        audio.pause()
        setIsPlaying(false)
        return
      }
      playIndex(idx)
    },
    [activeIndex, isPlaying, playIndex]
  )

  // -------------------------------------------------------------------
  // Activate a row (click anywhere on row body).
  // Clicking activates + plays — feels right for a single-purpose hero.
  // -------------------------------------------------------------------
  const activate = useCallback(
    (idx) => {
      if (idx === activeIndex && isPlaying) return // no-op
      playIndex(idx)
    },
    [activeIndex, isPlaying, playIndex]
  )

  // -------------------------------------------------------------------
  // <audio> event wiring (mounted once).
  // -------------------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      setIsPlaying(false)
      setCaptionText('')
      if (AUTO_ADVANCE) {
        // Advance to next non-missing row, wrapping.
        for (let step = 1; step <= catalog.length; step++) {
          const nextIdx = (activeIndex + step) % catalog.length
          if (!missingSet.has(catalog[nextIdx].slug)) {
            playIndex(nextIdx)
            return
          }
        }
      }
    }
    const onError = () => {
      const cur = catalog[activeIndex]
      if (!cur) return
      // eslint-disable-next-line no-console
      console.warn(`[SignalTable] audio error for "${cur.slug}" (likely 404)`)
      setMissingSet((prev) => {
        if (prev.has(cur.slug)) return prev
        const next = new Set(prev)
        next.add(cur.slug)
        return next
      })
      setIsPlaying(false)
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [activeIndex, catalog, missingSet, playIndex])

  // -------------------------------------------------------------------
  // Captions via TextTrack `cuechange`. Re-bind when the track set
  // changes (new clip = new <track> child).
  // -------------------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audio.textTracks || audio.textTracks.length === 0) return

    const track = audio.textTracks[0]
    track.mode = captionsOn ? 'hidden' : 'disabled' // 'hidden' still fires cuechange

    const onCueChange = () => {
      const cues = track.activeCues
      if (!cues || cues.length === 0) {
        setCaptionText('')
        return
      }
      const text = Array.from(cues)
        .map((c) => c.text)
        .join(' ')
      setCaptionText(text)
    }
    track.addEventListener('cuechange', onCueChange)
    return () => {
      track.removeEventListener('cuechange', onCueChange)
    }
  }, [activeIndex, captionsOn])

  // -------------------------------------------------------------------
  // Keyboard: ↑/↓ navigate, space/enter toggle, only when table focused.
  // -------------------------------------------------------------------
  useEffect(() => {
    const el = tableRef.current
    if (!el) return

    const onKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(activeIndex + 1, catalog.length - 1)
        if (next !== activeIndex) activate(next)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.max(activeIndex - 1, 0)
        if (next !== activeIndex) activate(next)
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        togglePlay(activeIndex)
      }
    }

    el.addEventListener('keydown', onKeyDown)
    return () => el.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, catalog.length, activate, togglePlay])

  // -------------------------------------------------------------------
  // Scroll-wheel inside the table walks the buffer (debounced via RAF).
  // -------------------------------------------------------------------
  useEffect(() => {
    const el = tableRef.current
    if (!el) return

    let ticking = false
    let accum = 0

    const onWheel = (e) => {
      // Only intercept vertical scrolls; let trackpad horizontal pass.
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      e.preventDefault()
      accum += e.deltaY
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const threshold = 40
        if (accum > threshold) {
          accum = 0
          setWindowStart((s) => Math.min(s + 1, Math.max(0, catalog.length - WINDOW_SIZE)))
        } else if (accum < -threshold) {
          accum = 0
          setWindowStart((s) => Math.max(s - 1, 0))
        }
      })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [catalog.length])

  // -------------------------------------------------------------------
  // Cleanup on unmount.
  // -------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {})
        ctxRef.current = null
      }
      analyserRef.current = null
      sourceMapRef.current.clear()
    }
  }, [])

  // -------------------------------------------------------------------
  // Derived: visible window.
  // -------------------------------------------------------------------
  const visible = useMemo(() => {
    const start = Math.max(0, Math.min(windowStart, catalog.length - WINDOW_SIZE))
    return catalog.slice(start, start + WINDOW_SIZE).map((c, offset) => ({
      capture: c,
      index: start + offset,
    }))
  }, [catalog, windowStart])

  const totalRows = catalog.length
  const visibleStart = Math.max(0, Math.min(windowStart, catalog.length - WINDOW_SIZE))

  return (
    <div className="space-y-6">
      {/* Trace + caption rail */}
      <div className="relative overflow-hidden rounded-md border border-edge bg-surface">
        <div className="flex items-center justify-between border-b border-edge-dim px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-ink-faint">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
              style={{ boxShadow: '0 0 6px var(--trace)' }}
            />
            {isPlaying ? 'PLAYING' : 'STANDBY'} · {activeCapture?.eyebrow ?? 'CH-01 / VOICE.IN'}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCaptionsOn((v) => !v)}
              className="text-[9px] uppercase tracking-[0.22em] text-ink-faint hover:text-ink-muted transition-colors"
              aria-pressed={captionsOn}
            >
              CC · {captionsOn ? 'ON' : 'OFF'}
            </button>
            <span>32.1kHz · 24-BIT · MONO</span>
          </div>
        </div>

        <div className="bg-canvas-alt p-2 sm:p-4">
          <LiveTrace
            analyserRef={analyserRef}
            playing={isPlaying}
            channelLabel="CH-01"
            scaleLabel="32.1kHz · MAC · iPHONE · WATCH"
          />
        </div>

        {/* Caption rail — always reserves space so layout doesn't jump. */}
        {captionsOn && (
          <div className="border-t border-edge-faint px-4 py-2.5 min-h-[34px]">
            <p className="text-[12px] italic text-ink-muted">
              {captionText || (
                <span className="not-italic text-ink-subtle text-[10px] uppercase tracking-[0.22em]">
                  {isPlaying ? '— transcribing —' : 'play any row to hear it'}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <div
        ref={tableRef}
        tabIndex={0}
        role="listbox"
        aria-label="Talkie capture catalog"
        aria-activedescendant={`signal-row-${activeIndex}`}
        className="overflow-hidden rounded-md border border-edge-dim focus:outline-none focus-visible:ring-1 focus-visible:ring-trace"
      >
        <div className="flex items-center justify-between border-b border-edge-faint bg-canvas-alt px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          <span>SIGNAL TABLE · DICTATION BUFFER</span>
          <span>
            {String(visibleStart + 1).padStart(2, '0')}–{String(Math.min(visibleStart + WINDOW_SIZE, totalRows)).padStart(2, '0')} / {String(totalRows).padStart(2, '0')}
          </span>
        </div>

        <div>
          {visible.map(({ capture, index }) => (
            <div key={capture.slug} id={`signal-row-${index}`} role="option" aria-selected={index === activeIndex}>
              <SignalTableRow
                capture={capture}
                index={index}
                active={index === activeIndex}
                playing={index === activeIndex && isPlaying}
                missing={missingSet.has(capture.slug)}
                onActivate={activate}
                onTogglePlay={togglePlay}
              />
            </div>
          ))}
        </div>

        {/* Scrubber: dot per row, click to jump. */}
        <div className="flex items-center justify-between gap-3 border-t border-edge-faint bg-canvas-alt px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            {catalog.map((c, i) => {
              const inWindow = i >= visibleStart && i < visibleStart + WINDOW_SIZE
              const isActive = i === activeIndex
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => activate(i)}
                  aria-label={`Jump to ${c.eyebrow}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isActive ? 'w-5 bg-trace' : inWindow ? 'w-2 bg-ink-faint' : 'w-1.5 bg-edge'
                  }`}
                  style={isActive ? { boxShadow: '0 0 6px var(--trace)' } : undefined}
                />
              )
            })}
          </div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-ink-faint hidden sm:flex items-center gap-3">
            <span>↑ ↓ NAV</span>
            <span>SPACE PLAY</span>
          </div>
        </div>
      </div>

      {/* Single shared <audio>. Rendered without `controls` — the row
          buttons are the transport. preload=none so we don't fetch
          eight clips on hydration. */}
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" className="sr-only">
        {activeCapture?.vtt && (
          <track
            kind="captions"
            src={activeCapture.vtt}
            srcLang="en"
            label="English"
            default
          />
        )}
      </audio>
    </div>
  )
}
