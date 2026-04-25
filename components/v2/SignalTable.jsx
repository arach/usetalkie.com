"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { playPressTick, playPasteTick } from '../../lib/sfx'
import { Play } from 'lucide-react'
import LiveTrace from './LiveTrace'
import SignalTableRow from './SignalTableRow'
import CinematicCaption from './CinematicCaption'
import KeypressCue from './KeypressCue'

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

// Choreography timings — each beat of the capture flow gets just
// enough breathing room to register as its own event:
//
//   PRESS → audio (live caption) → RELEASE → caption freezes →
//   row transcribe-scan → paste lands in row → breath → next
//
// The caption is purely narrative scenery for the viewer; the engine
// writes the transcription into the row via the scan beat (NOT by
// flying the caption text into the row, which would conflate the
// viewer's view with the engine's output). Total post-audio runway
// is intentionally short — real transcription is fast, the demo
// should feel that way too.
const BREATH_PRESS_TO_AUDIO_MS         = 240  // ⌘⇧A pressed → audio starts
const BREATH_RELEASE_TO_TRANSCRIBE_MS  = 200  // audio ended → row scan begins
const TRANSCRIBE_DURATION_MS           = 420  // phosphor write-head sweeps the row
const BREATH_PASTE_TO_NEXT_MS          = 720  // paste landed → next capture begins

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
  // activationKey: per-slug timestamp captured when a row becomes active.
  // Passed to <SignalTableRow/> as a `key`-prop on its overlay span so the
  // settle-from-trace animation replays on every fresh activation
  // (not just on the first one).
  const [activationKey, setActivationKey] = useState({})
  // keypressCue: { kind: 'start' | 'end', at: number } — fires once at
  // play start and once at clip end, mirroring how screencast tools
  // surface the hotkey that bookends a recording. The `at` timestamp
  // is the React key on <KeypressCue/> so each fire replays the keyframe.
  const [keypressCue, setKeypressCue] = useState(null)
  // captionPhase: drives the CinematicCaption render mode.
  //   live      — per-word karaoke fill (audio playing)
  //   finalize  — all words promoted to "spoken" + soft border-glow
  //               pulse (the live view has frozen into a still frame).
  //               No scan-line on the caption — engine output happens
  //               on the row, not here.
  //   idle      — caption hides between clips.
  // finalizeKey — bumped per clip so the border pulse replays.
  const [captionPhase, setCaptionPhase] = useState('idle')
  const [finalizeKey, setFinalizeKey] = useState(0)
  // transcribeKey: per-slug timestamp captured when the engine writes
  // the transcription for that row. Passed to <SignalTableRow/> as a
  // key on its scan overlay so the row-transcribe-scan keyframe
  // replays each time. Distinct from activationKey (which marks
  // "row activated / data deposited"); transcribeKey marks "engine
  // currently writing this output."
  const [transcribeKey, setTranscribeKey] = useState({})

  // -------------------------------------------------------------------
  // Refs (Web Audio + DOM)
  // -------------------------------------------------------------------
  const audioRef = useRef(null)
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceMapRef = useRef(new Map()) // slug → MediaElementAudioSourceNode
  const tableRef = useRef(null)
  // Pending choreography timeouts — cleared on user interruption (manual
  // play/pause, row click) and on unmount, so we never fire a paste-tick
  // for a clip the user has already moved past.
  const choreographyTimeoutsRef = useRef([])
  const clearChoreography = useCallback(() => {
    choreographyTimeoutsRef.current.forEach(clearTimeout)
    choreographyTimeoutsRef.current = []
    // Caption phase fall-back happens in the next playIndex / pause
    // path. Row scan / settle overlays are pure React state keyed on
    // timestamps — letting them age out is fine; a stale key never
    // re-fires its keyframe.
  }, [])

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
  // Activation timestamping: each time activeIndex changes, stamp the
  // new active slug with the current time. The row uses this as a `key`
  // for its settle-overlay so the spawn animation replays.
  // -------------------------------------------------------------------
  useEffect(() => {
    const slug = catalog[activeIndex]?.slug
    if (!slug) return
    setActivationKey((prev) => ({ ...prev, [slug]: Date.now() }))
  }, [activeIndex, catalog])

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
  // Play a specific row — with capture-flow choreography:
  //   1. PRESS keypress cue + tick (key-down feel)
  //   2. ~240ms breath
  //   3. audio.play() begins
  //   4. caption fills, trace lights up
  //
  // Cancels any pending end-of-clip choreography from the previous clip
  // (so re-clicking a row doesn't double-fire paste ticks).
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

      // Clear any pending paste/auto-advance from a previous clip.
      clearChoreography()

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

        // Beat 1 — press cue + tick
        setKeypressCue({ kind: 'start', at: Date.now() })
        playPressTick(ctxRef.current)

        // Beat 2 — breath, then audio. Reset caption to live mode so
        // any leftover finalize visuals from a previous clip are gone
        // before the new karaoke fill starts.
        setCaptionPhase('live')
        await new Promise((resolve) => setTimeout(resolve, BREATH_PRESS_TO_AUDIO_MS))
        await audio.play()
        setActiveIndex(idx)
        setIsPlaying(true)
      } catch (err) {
        // Autoplay rejection or 404 — surface for dev, soft-fail for user.
        // eslint-disable-next-line no-console
        console.warn(`[SignalTable] play failed for "${next.slug}":`, err)
      }
    },
    [catalog, missingSet, ensureAudioGraph, clearChoreography]
  )

  // -------------------------------------------------------------------
  // Toggle play for a specific row (used by row buttons).
  // Manual pause cancels any pending paste/auto-advance choreography
  // so the user isn't surprised by a tick or auto-advance arriving
  // after they explicitly pressed pause.
  // -------------------------------------------------------------------
  const togglePlay = useCallback(
    (idx) => {
      const audio = audioRef.current
      if (!audio) return

      if (idx === activeIndex && isPlaying) {
        clearChoreography()
        audio.pause()
        setIsPlaying(false)
        // Manual pause — drop any post-audio caption visuals so the
        // user isn't surprised by a finalize sweep that shouldn't fire.
        setCaptionPhase('idle')
        return
      }
      playIndex(idx)
    },
    [activeIndex, isPlaying, playIndex, clearChoreography]
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

      // RELEASE pill + caption freezes immediately. Caption stays as
      // the viewer's narrative scenery; karaoke cursor snaps off so
      // it doesn't sit stuck on the last word.
      setKeypressCue({ kind: 'end', at: Date.now() })
      setCaptionPhase('finalize')
      setFinalizeKey((k) => k + 1)

      const currentSlug = catalog[activeIndex]?.slug

      // Beat A — short breath, then the engine "writes" the
      // transcription into the active row via a phosphor write-head
      // sweep. The trace is already in passive (frozen, dimmed) state
      // from the existing isPlaying=false logic; the scan provides
      // the distinct "transcription mode" UX.
      const tScan = setTimeout(() => {
        if (currentSlug) {
          setTranscribeKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
        }
      }, BREATH_RELEASE_TO_TRANSCRIBE_MS)
      choreographyTimeoutsRef.current.push(tScan)

      // Beat B — the scan completes; data lands in the row. Paste
      // tick fires in the same frame as the row-settle replay (the
      // phosphor "spill" from the top of the row, reading as
      // "deposited into the buffer"). Caption fades to idle now that
      // its narrative job is done.
      const tLand = setTimeout(() => {
        if (currentSlug) {
          setActivationKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
        }
        playPasteTick(ctxRef.current)
        setCaptionPhase('idle')

        // Beat C — breath, then advance to next capture.
        if (AUTO_ADVANCE) {
          const tNext = setTimeout(() => {
            for (let step = 1; step <= catalog.length; step++) {
              const nextIdx = (activeIndex + step) % catalog.length
              if (!missingSet.has(catalog[nextIdx].slug)) {
                playIndex(nextIdx)
                return
              }
            }
          }, BREATH_PASTE_TO_NEXT_MS)
          choreographyTimeoutsRef.current.push(tNext)
        }
      }, BREATH_RELEASE_TO_TRANSCRIBE_MS + TRANSCRIBE_DURATION_MS)
      choreographyTimeoutsRef.current.push(tLand)
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
      // Drop any post-audio visuals — error path skips the choreography.
      clearChoreography()
      setCaptionPhase('idle')
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
  }, [activeIndex, catalog, missingSet, playIndex, clearChoreography])

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
      clearChoreography()
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {})
        ctxRef.current = null
      }
      analyserRef.current = null
      sourceMapRef.current.clear()
    }
  }, [clearChoreography])

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
    <div className="space-y-10">
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

        {/* Trace area — clickable, with a hover invitation that says
            "this is gonna be cool" when not playing. Clicking anywhere
            in the trace toggles play/pause for the active row. */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => togglePlay(activeIndex)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              togglePlay(activeIndex)
            }
          }}
          aria-label={isPlaying ? `Pause ${activeCapture?.eyebrow ?? ''}` : `Play ${activeCapture?.eyebrow ?? ''}`}
          className="group relative cursor-pointer bg-canvas-alt p-2 transition-shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-trace sm:p-4"
          style={{
            // Inset phosphor border on hover — appears like the screen
            // is "warming up" when you approach it.
            transition: 'box-shadow 0.32s ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = isPlaying
              ? 'none'
              : 'inset 0 0 0 1px color-mix(in oklab, var(--trace) 32%, transparent), inset 0 0 24px color-mix(in oklab, var(--trace-glow) 18%, transparent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <LiveTrace
            analyserRef={analyserRef}
            playing={isPlaying}
            channelLabel="CH-01"
            scaleLabel="32.1kHz · MAC · iPHONE · WATCH"
            hideLabels
          />

          {/* Hover affordance — fades in when not playing so the trace
              area reads as "press here to play this." Hidden during
              playback (cinematic captions take that role). */}
          {!isPlaying && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div
                className="flex items-center gap-2 rounded-sm border border-edge bg-canvas-overlay/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.26em] text-trace backdrop-blur-md"
                style={{
                  textShadow: '0 0 4px var(--trace-glow)',
                  boxShadow: '0 0 18px color-mix(in oklab, var(--trace-glow) 35%, transparent)',
                }}
              >
                <Play className="h-3 w-3" />
                <span>PLAY · {activeCapture?.eyebrow ?? 'CH-01'}</span>
              </div>
            </div>
          )}

          {/* Cinematic caption — subtitle pill with per-word fill while
              audio plays, freezes into a still-frame on finalize.
              Purely narrative scenery for the viewer; the engine writes
              the transcription into the row, not here. Hidden in idle
              (between clips) so it doesn't pop back into view after
              the data has landed in the buffer. */}
          {captionsOn && (isPlaying || captionPhase === 'finalize') && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-6 sm:bottom-6">
              <CinematicCaption
                audioRef={audioRef}
                alignSrc={activeCapture?.audio?.replace(/\.mp3$/, '.alignment.json')}
                playing={isPlaying}
                phase={isPlaying ? 'live' : captionPhase}
                finalizeKey={finalizeKey}
                className="text-base sm:text-lg"
              />
            </div>
          )}

          {/* Keypress cue — pops the hotkey HUD at the start and end
              of each clip, like a screencast tool. Inside the trace's
              corner-tick guides, bottom-right. Re-keyed per fire so
              the keyframe replays. */}
          {keypressCue && (
            <KeypressCue
              key={keypressCue.at}
              keys={['⌘', '⇧', 'A']}
              variant={keypressCue.kind}
            />
          )}
        </div>

        {/* Status bar — mirrors the top header for visual balance.
            Only the phosphor dot subtly signals active/idle so the UI
            doesn't feel nervous between clips. The label stays calm. */}
        <div className="flex items-center justify-between gap-3 border-t border-edge-faint px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full transition-all duration-500"
              style={{
                background: isPlaying ? 'var(--trace)' : 'var(--ink-faint)',
                boxShadow: isPlaying ? '0 0 4px var(--trace)' : 'none',
              }}
            />
            TRIG · LIVE
          </span>
          <span>{activeCapture?.eyebrow ?? 'CH-01 / VOICE.IN'}</span>
        </div>
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
                activationKey={activationKey[capture.slug]}
                transcribeKey={transcribeKey[capture.slug]}
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
