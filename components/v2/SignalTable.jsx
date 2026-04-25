"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { playPressTick, playPasteTick } from '../../lib/sfx'
import { Play } from 'lucide-react'
import LiveTrace from './LiveTrace'
import SignalTableRow from './SignalTableRow'
import CinematicCaption from './CinematicCaption'
import KeypressCue from './KeypressCue'
import CaptureIsland from './CaptureIsland'

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

// Choreography timings — each beat of the capture flow gets enough
// breathing room to register as its own event AND to invite the user
// to take over the pacing manually if they want:
//
//   PRESS → audio + live caption → RELEASE → caption hides + trace
//   freezes + island morphs to TRANSCRIBING (substantive — long
//   enough to actually see) → island fades + row paste fires (text
//   settles into the row, paste tick) → REVIEW (calm trailing
//   confirmation: trace flat, no overlay, row sits highlighted with
//   its new transcription) → IDLE (flat line, ready) → breath →
//   next clip
//
// The caption is purely narrative scenery for the viewer; the engine
// writes the transcription into the row via the paste beat. There is
// no "STORED" labeled beat — the trailing confirmation is the row
// itself, no overlay. The transcribe duration is dynamic per clip —
// short clips finish quickly, long clips take a beat longer — but
// always long enough that the TRANSCRIBING indicator is visibly
// present, not a flicker.
const BREATH_PRESS_TO_AUDIO_MS         = 360  // ⌘⇧A pressed → audio starts
// Breath between audio END and the engine indicator morphing in —
// lets the eye register "audio just stopped" before the TRANSCRIBING
// state appears, so the two read as discrete events.
const BREATH_RELEASE_TO_TRANSCRIBING_MS = 280
// Transcribe duration is computed dynamically from audio.duration:
//   clamp(audio.duration * 200, 900, 1600)
// (audio.duration is seconds → *200 = "1/5 of duration" in ms.)
// Falls back to ~1100ms if audio.duration is unavailable. Floor of
// 900ms is the key constraint — anything shorter and the engine cue
// flickers in and out before the eye registers it. Cap at 1600ms so
// long clips don't make the user wait longer than feels local.
const TRANSCRIBE_MIN_MS                = 900
const TRANSCRIBE_MAX_MS                = 1600
const TRANSCRIBE_FALLBACK_MS           = 1100
// REVIEW_DURATION_MS — trailing confirmation beat: the island is
// gone, the trace is back to its flat idle line, and the row sits
// highlighted with its transcription visible. Acts as the silent
// "yep, that landed in your dictation buffer" confirmation. Long
// enough that the user can manually click the next row before
// auto-advance fires (any click cancels the queued advance via
// clearChoreography). The only beat in the lifecycle where nothing
// animates — by design. Paste tick + row typing animation fire on
// ENTRY to this phase, then the rest of the duration is calm hold.
const REVIEW_DURATION_MS               = 1800
// Short breath between REVIEW ending and the next capture starting.
const BREATH_PASTE_TO_NEXT_MS          = 240  // review settled → next capture begins

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
  // hasEngaged: true after the first user-triggered or auto-triggered
  // playback. Drives the START affordance — visible only before the
  // first engagement, then permanently hidden in favor of the
  // lifecycle's own indicators (CaptureIsland, row halo, etc.).
  // Doesn't reset across pause/resume — once engaged, you're past the
  // "what is this?" moment for the rest of the session.
  const [hasEngaged, setHasEngaged] = useState(false)
  // captionPhase: the central state machine for the capture lifecycle.
  // Drives CinematicCaption visibility, LiveTrace freeze, the
  // CaptureIsland morph, the hover affordance gate, AND the
  // top-header eyebrow visibility.
  //
  //   recording    — audio playing. Caption visible; trace live;
  //                  island shows "● REC · {eyebrow}". Top header
  //                  shows "PLAYING · {eyebrow}".
  //   transcribing — audio ended. Caption hidden, trace frozen,
  //                  island morphs to "TRANSCRIBING · · ·". Long
  //                  enough (≥ 900ms) to actually inhabit the screen
  //                  rather than flicker. Top header still shows
  //                  the eyebrow.
  //   review       — trailing confirmation. Island is GONE (no
  //                  "STORED" overlay — that beat was retired in
  //                  favor of letting the row carry the result by
  //                  itself). Row paste typing fires on entry,
  //                  paste tick plays on entry, then the rest of
  //                  the beat is silent hold. Trace flat. Top
  //                  header drops the eyebrow.
  //   idle         — flat line, neutral header. Hover affordance
  //                  ("PLAY · {eyebrow}") only appears in this
  //                  phase, never during recording / transcribing /
  //                  review (those are mid-pipeline, not "ready to
  //                  start something new").
  //
  // (The earlier 'finalize' / 'live' / 'stored' values are retired.
  // finalizeKey is kept as a no-op stub for any straggler refs.)
  const [captionPhase, setCaptionPhase] = useState('idle')
  const [finalizeKey] = useState(0)
  // transcribeKey: per-slug timestamp captured when the engine
  // "pastes" its transcription into the row. Passed to
  // <SignalTableRow/> as a key on its paste-band + paste-text
  // overlays so the typing keyframes replay each time. Distinct
  // from activationKey (which marks "row activated / data
  // deposited and halo settles"); transcribeKey marks "engine
  // typed its output here."
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

      // Past the "before you've engaged" moment — START affordance
      // hides for the rest of the session, the lifecycle takes over.
      setHasEngaged(true)

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

        // Beat 2 — breath, then audio. activeIndex updates BEFORE
        // audio.play() so the alignment file (driven by activeCapture)
        // is already pointed at the new clip when the play event
        // fires and CinematicCaption mounts. Setting activeIndex
        // after play() created a one-render glitch where the cinematic
        // caption rendered the previous clip's words against the new
        // clip's currentTime — that's the "interstitial caption"
        // flash between sequences.
        await new Promise((resolve) => setTimeout(resolve, BREATH_PRESS_TO_AUDIO_MS))
        setActiveIndex(idx)
        await audio.play()
        setIsPlaying(true)
        setCaptionPhase('recording')
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

      // RELEASE pill fires immediately. Caption hides during the
      // small breath before the TRANSCRIBING overlay appears (no
      // finalize border-glow on the caption pill — that beat has
      // been retired in favor of the cleaner hide + overlay).
      setKeypressCue({ kind: 'end', at: Date.now() })

      const currentSlug = catalog[activeIndex]?.slug

      // Compute dynamic transcribe duration from the clip length.
      // audio.duration is in seconds; *200 maps "1/5 of duration"
      // into milliseconds. Clamp 900–1600ms so it always inhabits
      // the screen long enough to register as its own beat (not a
      // flicker), but never feels slower than local. Defensive
      // fallback if duration is unavailable (some browsers report
      // Infinity / NaN until metadata loads, though by `ended` it's
      // reliably populated).
      const audioDur = audioRef.current?.duration
      const dynamicMs =
        Number.isFinite(audioDur) && audioDur > 0
          ? Math.max(TRANSCRIBE_MIN_MS, Math.min(TRANSCRIBE_MAX_MS, audioDur * 200))
          : TRANSCRIBE_FALLBACK_MS

      // Beat A — short breath, then enter the transcribing state:
      // caption disappears, trace freezes (LiveTrace `freeze` prop
      // holds the last live polyline shape on screen), CaptureIsland
      // morphs from "● REC" to "TRANSCRIBING · · ·".
      const tEnter = setTimeout(() => {
        setCaptionPhase('transcribing')
      }, BREATH_RELEASE_TO_TRANSCRIBING_MS)
      choreographyTimeoutsRef.current.push(tEnter)

      // Beat B — engine "finishes." Phase morphs DIRECTLY to
      // 'review' (no separate stored beat). On entry to review:
      //   - CaptureIsland fades out (no overlay during trailing
      //     confirmation — the row carries the result)
      //   - Trace unfreezes and returns to its flat idle line
      //   - Row paste typing fires (transcribeKey + activationKey
      //     bumps drive the keyed overlays on the row)
      //   - Paste tick plays
      //   - Top-header eyebrow drops to neutral
      // The remainder of the review beat is silent hold so the user
      // can read what landed and (optionally) take over pacing.
      const tReview = setTimeout(() => {
        setCaptionPhase('review')
        if (currentSlug) {
          setTranscribeKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
          setActivationKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
        }
        playPasteTick(ctxRef.current)
      }, BREATH_RELEASE_TO_TRANSCRIBING_MS + dynamicMs)
      choreographyTimeoutsRef.current.push(tReview)

      // Beat C — review held long enough for the user to read the
      // result and (optionally) click the next row themselves. Then
      // phase → idle, formal end of choreography.
      const tIdle = setTimeout(() => {
        setCaptionPhase('idle')

        // Beat D — short breath, then auto-advance to the next clip.
        // (Any user click during the review beat cancels this via
        // clearChoreography(), so manual triggering wins.)
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
      }, BREATH_RELEASE_TO_TRANSCRIBING_MS + dynamicMs + REVIEW_DURATION_MS)
      choreographyTimeoutsRef.current.push(tIdle)
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

  // True only during the recording → transcribing arc. Review and
  // idle both read as neutral pre-interaction state — the row halo
  // carries the trailing confirmation visually instead of the header.
  const inActiveCapture =
    captionPhase === 'recording' || captionPhase === 'transcribing'

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
            {/* In active capture phases the header narrates the row
                being processed; in review/idle it falls back to the
                neutral pre-interaction label so the calm end state
                doesn't keep shouting the row that just landed —
                that's the table's job (the row halo). */}
            {inActiveCapture
              ? `${isPlaying ? 'PLAYING' : 'STANDBY'} · ${activeCapture?.eyebrow ?? 'CH-01 / VOICE.IN'}`
              : 'STANDBY · CH-01 / VOICE.IN'}
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
            freeze={captionPhase === 'transcribing'}
            channelLabel="CH-01"
            scaleLabel="32.1kHz · MAC · iPHONE · WATCH"
            hideLabels
          />

          {/* START affordance — pre-engagement only. Lives at the
              top-center of the trace area (same spot the
              CaptureIsland will occupy once recording starts) so the
              same region of screen narrates "what can I do / what is
              happening" through the whole session. Single word + play
              icon: minimal invitation to engage. Once the user (or
              auto-advance) kicks off the first clip, hasEngaged flips
              true and START never returns — the lifecycle indicators
              take over. */}
          {!hasEngaged && (
            <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 transition-opacity duration-300 opacity-100">
              <div
                className="flex items-center gap-2 rounded-full border border-edge bg-canvas-overlay/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.26em] text-trace backdrop-blur-md"
                style={{
                  textShadow: '0 0 4px var(--trace-glow)',
                  boxShadow: '0 0 14px color-mix(in oklab, var(--trace-glow) 32%, transparent), 0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <Play className="h-3 w-3" />
                <span>START</span>
              </div>
            </div>
          )}

          {/* Cinematic caption — subtitle pill with per-word fill while
              audio plays. Purely narrative scenery for the viewer; the
              engine writes the transcription into the row, not here.
              Hidden the moment audio ends so the TRANSCRIBING overlay
              (below) gets the stage cleanly. */}
          {captionsOn && isPlaying && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-6 sm:bottom-6">
              <CinematicCaption
                audioRef={audioRef}
                alignSrc={activeCapture?.audio?.replace(/\.mp3$/, '.alignment.json')}
                playing={isPlaying}
                phase="live"
                finalizeKey={finalizeKey}
                className="text-base sm:text-lg"
              />
            </div>
          )}

          {/* CaptureIsland — Dynamic-Island-style morph that runs as
              a single persistent indicator across the whole capture
              lifecycle. recording → transcribing → stored → fade.
              Mirrors the floating-bubble UI in the actual Talkie app
              and bridges the previously-elusive transition between
              "engine done transcribing" and "data landed in the row." */}
          <CaptureIsland
            phase={captionPhase}
            eyebrow={activeCapture?.eyebrow}
          />

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
