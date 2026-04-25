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

// Choreography timings — give each beat of the capture flow some
// breathing room so it reads as a deliberate sequence:
//
//   PRESS → audio → RELEASE → finalize → memorialize → paste → next
//
// The post-audio beats are split into two distinct moments so the eye
// reads "the system is finishing the transcription" and then "the
// transcription is being memorialized into the table" as separate
// events, not one continuous gesture.
const BREATH_PRESS_TO_AUDIO_MS         = 240  // ⌘⇧A pressed → audio starts
const BREATH_RELEASE_TO_FINALIZE_MS    = 220  // RELEASE pill → caption finalize starts
const FINALIZE_DURATION_MS             = 720  // length of the scan-line / settle beat
const BREATH_FINALIZE_TO_TRANSPORT_MS  = 160  // settled caption → flight begins
const TRANSPORT_DURATION_MS            = 520  // FLIP-style flight to the row
const BREATH_PASTE_TO_NEXT_MS          = 820  // paste landed → next capture begins

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
  //   finalize  — all words promoted to "spoken" + scan-line sweep
  //               across the pill (the post-audio "transcription has
  //               settled" beat).
  //   idle      — same render as live, RAF paused, used between clips.
  // finalizeKey — bumped per clip so the scan-line keyframe replays.
  const [captionPhase, setCaptionPhase] = useState('idle')
  const [finalizeKey, setFinalizeKey] = useState(0)
  // memorializeFlight: { id, text, fromRect, toRect } | null
  //   When non-null, a portal ghost renders the caption text and FLIPs
  //   from fromRect → toRect. Cleared when the flight is cancelled or
  //   completes. Cancellation is just "set this to null" since the
  //   ghost is purely React-rendered.
  const [memorializeFlight, setMemorializeFlight] = useState(null)

  // -------------------------------------------------------------------
  // Refs (Web Audio + DOM)
  // -------------------------------------------------------------------
  const audioRef = useRef(null)
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceMapRef = useRef(new Map()) // slug → MediaElementAudioSourceNode
  const tableRef = useRef(null)
  // Source rect for the FLIP transition — the CinematicCaption pill,
  // measured at the moment audio ends. Null when no caption is showing.
  const captionRef = useRef(null)
  // Pending choreography timeouts — cleared on user interruption (manual
  // play/pause, row click) and on unmount, so we never fire a paste-tick
  // for a clip the user has already moved past.
  const choreographyTimeoutsRef = useRef([])
  const clearChoreography = useCallback(() => {
    choreographyTimeoutsRef.current.forEach(clearTimeout)
    choreographyTimeoutsRef.current = []
    // Also tear down any in-flight post-audio visuals. The finalize
    // scan-line and the memorialize ghost are both pure React state,
    // so clearing them here is enough — no orphan DOM, no orphan
    // animations. Caption phase falls back to whatever the audio
    // state implies (the next playIndex / pause path will set it).
    setMemorializeFlight(null)
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

      // Beat 3 — release cue (PRESS pill flips to RELEASE label).
      // Promote the caption to "finalize" immediately so the karaoke
      // cursor doesn't stay stuck on the last word while we wait for
      // the scan-line beat — visually the pill freezes into final
      // form the moment audio stops, which is what the user expects.
      // The visible scan-line / border pulse fires later via
      // finalizeKey on the BREATH_RELEASE_TO_FINALIZE_MS timeout.
      setKeypressCue({ kind: 'end', at: Date.now() })
      setCaptionPhase('finalize')

      const currentSlug = catalog[activeIndex]?.slug

      // Beat 4 — after a small breath, the scan-line sweeps across
      // the pill. Reads as "the system is post-processing the
      // transcription." The phase is already 'finalize', we just
      // re-key the scan-line span to replay its keyframe.
      const tFinalize = setTimeout(() => {
        setFinalizeKey((k) => k + 1)
      }, BREATH_RELEASE_TO_FINALIZE_MS)
      choreographyTimeoutsRef.current.push(tFinalize)

      // Beat 5 — once the finalize beat has had room to read, kick
      // off the FLIP-style flight from the caption pill down to the
      // active row. We measure both rects at the moment of launch
      // (not at audio-end) so any layout shifts that happened during
      // the finalize beat are accounted for.
      const tTransport = setTimeout(() => {
        const fromEl = captionRef.current
        const toEl = currentSlug
          ? tableRef.current?.querySelector(`#signal-row-${activeIndex}`)
          : null

        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect()
          const toRect = toEl.getBoundingClientRect()
          // Capture the resolved text so the ghost matches the pill
          // even if the source unmounts mid-flight (it shouldn't, but
          // defensive — and it removes the ghost's dependency on the
          // alignment cache once airborne).
          const text = fromEl.innerText || ''
          setMemorializeFlight({
            id: Date.now(),
            text,
            fromRect,
            toRect,
            fontSize: parseFloat(getComputedStyle(fromEl).fontSize) || 16,
          })
        }
        // The original caption pill fades out as the ghost takes over.
        setCaptionPhase('idle')
      }, BREATH_RELEASE_TO_FINALIZE_MS + FINALIZE_DURATION_MS + BREATH_FINALIZE_TO_TRANSPORT_MS)
      choreographyTimeoutsRef.current.push(tTransport)

      // Beat 6 — landing. The ghost arrives at the row; we re-bump
      // activationKey (row-settle replays, reading as "data
      // deposited") and fire the paste tick in the same frame the
      // FLIP keyframe ends. Then clear the ghost.
      const tLand = setTimeout(() => {
        if (currentSlug) {
          setActivationKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
        }
        playPasteTick(ctxRef.current)
        setMemorializeFlight(null)

        // Beat 7 — after a longer breath, advance to next capture.
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
      }, BREATH_RELEASE_TO_FINALIZE_MS + FINALIZE_DURATION_MS + BREATH_FINALIZE_TO_TRANSPORT_MS + TRANSPORT_DURATION_MS)
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

          {/* Cinematic caption — subtitle pill with per-word fill,
              positioned over the bottom of the trace. Pure decorative;
              the VTT TextTrack still drives screen-reader output.
              Hidden during the FLIP flight (the ghost takes the visual
              lead) and during idle (so the pill doesn't pop back into
              view between clips after the memorialize beat). */}
          {captionsOn && !memorializeFlight && (isPlaying || captionPhase === 'finalize') && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-6 sm:bottom-6">
              <CinematicCaption
                ref={captionRef}
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

      {/* FLIP ghost — the "memorialize" flight. Rendered in viewport
          coordinates (position:fixed) at the source rect, animated via
          a CSS keyframe driven by --mem-dx / --mem-dy / --mem-scale.
          Cancellation is just unmounting (clearChoreography sets
          memorializeFlight to null). aria-hidden because this is a
          purely visual restatement of the caption text the live region
          already announced. */}
      {memorializeFlight && (
        <MemorializeGhost flight={memorializeFlight} />
      )}
    </div>
  )
}

/**
 * MemorializeGhost — a single-purpose portal-style element that flies
 * the caption text from the trace area down to the active row in the
 * signal table. Receives a `flight` snapshot containing source/target
 * rects (in viewport space) and the resolved caption text.
 *
 * Positioned with position:fixed at fromRect, then a CSS keyframe
 * (`caption-memorialize` in globals.css) interpolates a single
 * transform from (0,0) → (dx,dy) with a soft scale-down at landing.
 *
 * Why fixed instead of a true React portal: we already render inside
 * the main React tree (no z-index conflicts here), and fixed
 * positioning gives us free coordinate-space alignment with
 * getBoundingClientRect() readings without bringing in createPortal.
 */
function MemorializeGhost({ flight }) {
  const { text, fromRect, toRect, fontSize } = flight
  // Travel deltas: aim the ghost's center at the row's vertical center.
  const dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2)
  const dy = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2)
  // Scale: the row is wider than the caption pill but visually we want
  // the ghost to "compact" as it lands (it's becoming a row entry, not
  // covering the whole row). Capped to avoid over-shrinking on narrow
  // captions where the ratio could go silly.
  const scale = Math.max(0.78, Math.min(0.98, toRect.width > 0 ? Math.min(fromRect.width, toRect.width * 0.62) / fromRect.width : 0.9))

  return (
    <span
      aria-hidden
      className="caption-memorialize pointer-events-none fixed z-50 inline-block rounded-sm border border-edge bg-canvas-overlay/85 px-3 py-1 font-mono leading-snug text-ink backdrop-blur-md"
      style={{
        top: fromRect.top,
        left: fromRect.left,
        width: fromRect.width,
        fontSize: fontSize ? `${fontSize}px` : undefined,
        boxShadow: '0 0 18px color-mix(in oklab, var(--trace-glow) 50%, transparent)',
        // CSS custom properties consumed by the keyframe.
        '--mem-dx': `${dx}px`,
        '--mem-dy': `${dy}px`,
        '--mem-scale': scale,
      }}
    >
      {text}
    </span>
  )
}
