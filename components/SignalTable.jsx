"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { playPressTick, playPasteTick } from '../lib/sfx'
import { Bot, Bug, Mail, MessageCircle, NotebookPen, Play, Pause, Terminal, Users } from 'lucide-react'
import LiveTrace from './LiveTrace'
import SignalTableRow from './SignalTableRow'
import CinematicCaption from './CinematicCaption'
import KeypressCue from './KeypressCue'
import CaptureIsland from './CaptureIsland'
import PasteMock from './PasteMock'

/**
 * SignalTable — the navigatable, audio-driven hero player.
 *
 * Catalog comes in as a prop (server-imported from
 * `content/captures.json` and rendered as the static SSR shell in
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
 * AUTO_ADVANCE: when true, the next clip auto-PLAYS once the current one
 *   finishes its choreography.
 * AUTO_SELECT_NEXT: when true, the next clip is only SELECTED (its row is
 *   highlighted + cued) and playback stays paused — the user presses play
 *   to hear it. AUTO_ADVANCE takes precedence if both are true.
 */
const AUTO_ADVANCE = false
const AUTO_SELECT_NEXT = true
const TRANSITION_STEPS = [
  { id: 'minimized', label: 'Minimized', start: 0, end: 10 },
  { id: 'voice', label: 'Voice playback', start: 10, end: 42 },
  { id: 'desktop', label: 'Desktop preview', start: 42, end: 70 },
  { id: 'table', label: 'Signal table', start: 70, end: 100 },
]

const CAPTURE_EXAMPLE_ICONS = {
  SMS: MessageCircle,
  EMAIL: Mail,
  PROMPT: Bot,
  CLI: Terminal,
  NOTE: NotebookPen,
  ISSUE: Bug,
  MEETING: Users,
  JOURNAL: NotebookPen,
}

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
//   clamp(audio.duration * 60, 350, 600)
// Brisk by design — the surrounding choreography (keypress cue, tick
// sound, TRIG dot, dock icon lift, window-opening bezier-bounce,
// wave-bar overlay, traffic-light dots) carries the "something is
// happening" story in parallel, so the transcribe beat itself can be
// a flicker of confidence rather than a wait. Earlier 900-1600ms
// range was protective — protected against thin choreography that
// no longer exists.
const TRANSCRIBE_MIN_MS                = 350
const TRANSCRIBE_MAX_MS                = 600
const TRANSCRIBE_FALLBACK_MS           = 450
// REVIEW_DURATION_MS — trailing confirmation beat: the island is
// gone, the trace is back to its flat idle line, and the row sits
// highlighted with its transcription visible. Acts as the silent
// "yep, that landed in your dictation buffer" confirmation. Long
// enough that the user can manually click the next row before
// auto-advance fires (any click cancels the queued advance via
// clearChoreography). The only beat in the lifecycle where nothing
// animates — by design. Paste tick + row typing animation fire on
// ENTRY to this phase, then the rest of the duration is calm hold.
const REVIEW_DURATION_MS               = 3000
// Breath between REVIEW ending and the next capture starting — long
// enough that consecutive captures don't read as a tickertape; the
// dock + window have time to "settle" before the next one stages.
const BREATH_PASTE_TO_NEXT_MS          = 800   // review settled → next capture begins

export default function SignalTable({ catalog }) {
  // -------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [missingSet, setMissingSet] = useState(() => new Set())
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
  // Rollout sequence starts at the waveform, then reveals the app preview
  // and signal table after the first real capture finishes. Once a stage is
  // reached, it stays out for the rest of the session.
  const [rolloutStage, setRolloutStage] = useState(2)
  const [transitionStepId, setTransitionStepId] = useState('voice')
  const [transitionTimers, setTransitionTimers] = useState({
    minimized: 1,
    voice: 1,
    desktop: 0,
    table: 0,
  })
  const [examplesRevealed, setExamplesRevealed] = useState(false)
  const [seenCaptureSlugs, setSeenCaptureSlugs] = useState(() => new Set())
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
  const rolloutTimeoutsRef = useRef([])
  const timerAnimationRefs = useRef({})
  const rolloutCompleteRef = useRef(false)
  const stopTransitionTimerAnimation = useCallback((id) => {
    if (id) {
      if (timerAnimationRefs.current[id]) {
        cancelAnimationFrame(timerAnimationRefs.current[id])
        delete timerAnimationRefs.current[id]
      }
      return
    }

    Object.values(timerAnimationRefs.current).forEach(cancelAnimationFrame)
    timerAnimationRefs.current = {}
  }, [])
  const setTransitionTimer = useCallback((id, value) => {
    setTransitionTimers((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(1, Number(value) || 0)),
    }))
  }, [])
  const setTransitionStepTimer = useCallback((id, value) => {
    const clamped = Math.max(0, Math.min(1, Number(value) || 0))
    setTransitionTimer(id, clamped)
  }, [setTransitionTimer])
  const animateTransitionTimer = useCallback(
    (id, target, duration = 900) => {
      stopTransitionTimerAnimation(id)
      const startedAt = performance.now()
      const from = transitionTimers[id] ?? 0
      const to = Math.max(0, Math.min(1, target))
      const tick = (now) => {
        const t = Math.min(1, (now - startedAt) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setTransitionStepTimer(id, from + (to - from) * eased)
        if (t < 1) {
          timerAnimationRefs.current[id] = requestAnimationFrame(tick)
        } else {
          delete timerAnimationRefs.current[id]
        }
      }
      timerAnimationRefs.current[id] = requestAnimationFrame(tick)
    },
    [setTransitionStepTimer, stopTransitionTimerAnimation, transitionTimers]
  )
  const startRollout = useCallback(() => {
    if (rolloutCompleteRef.current) {
      stopTransitionTimerAnimation()
      setRolloutStage(4)
      setTransitionStepId('table')
      setTransitionTimers({
        minimized: 1,
        voice: 1,
        desktop: 1,
        table: 1,
      })
      return
    }

    rolloutTimeoutsRef.current.forEach(clearTimeout)
    rolloutTimeoutsRef.current = []
    stopTransitionTimerAnimation('voice')
    setRolloutStage((current) => Math.max(current, 1))
    setTransitionStepId('voice')
    setTransitionStepTimer('voice', 0.08)
    animateTransitionTimer('voice', 1, 1100)
    const tScreen = setTimeout(
      () => {
        setRolloutStage((current) => Math.max(current, 2))
      },
      620
    )
    rolloutTimeoutsRef.current = [tScreen]
  }, [animateTransitionTimer, setTransitionStepTimer, stopTransitionTimerAnimation])
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
  const markCaptureSeen = useCallback((slug) => {
    if (!slug) return
    setSeenCaptureSlugs((prev) => {
      if (prev.has(slug)) return prev
      const next = new Set(prev)
      next.add(slug)
      return next
    })
  }, [])

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
      startRollout()

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
    [catalog, missingSet, ensureAudioGraph, clearChoreography, startRollout]
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

      // STOP pill fires immediately, with the same audible tick as the
      // start cue — capture is now a toggle (ding to start, ding to
      // stop) rather than push-to-talk (press-and-hold). Same hotkey,
      // same sound, two distinct gestures bracketing the recording.
      setKeypressCue({ kind: 'end', at: Date.now() })
      playPressTick(ctxRef.current)

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
          ? Math.max(TRANSCRIBE_MIN_MS, Math.min(TRANSCRIBE_MAX_MS, audioDur * 60))
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

        if (rolloutCompleteRef.current) {
          setRolloutStage(4)
          setTransitionStepId('table')
          setTransitionTimers((prev) => ({
            ...prev,
            voice: 1,
            desktop: 1,
            table: 1,
          }))
          if (currentSlug) {
            setTranscribeKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
            setActivationKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
            markCaptureSeen(currentSlug)
          }
          playPasteTick(ctxRef.current)
          return
        }

        setRolloutStage((current) => Math.max(current, 3))
        setTransitionStepId('desktop')
        setTransitionStepTimer('desktop', 0.08)
        animateTransitionTimer('desktop', 1, 1450)

        const tDesktopDone = setTimeout(() => {
          setTransitionStepTimer('desktop', 1)
        }, 1250)
        choreographyTimeoutsRef.current.push(tDesktopDone)

        const tTable = setTimeout(() => {
          setRolloutStage((current) => Math.max(current, 4))
          setTransitionStepId('table')
          setTransitionStepTimer('table', 0.03)
          animateTransitionTimer('table', 1, 2400)
          const tDeposit = setTimeout(() => {
            if (currentSlug) {
              setTranscribeKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
              setActivationKey((prev) => ({ ...prev, [currentSlug]: Date.now() }))
              markCaptureSeen(currentSlug)
            }
            playPasteTick(ctxRef.current)
          }, 1350)
          choreographyTimeoutsRef.current.push(tDeposit)

          const tStable = setTimeout(() => {
            rolloutCompleteRef.current = true
            setExamplesRevealed(true)
          }, 2400)
          choreographyTimeoutsRef.current.push(tStable)
        }, 2100)
        choreographyTimeoutsRef.current.push(tTable)
      }, BREATH_RELEASE_TO_TRANSCRIBING_MS + dynamicMs)
      choreographyTimeoutsRef.current.push(tReview)

      // Beat C — review held long enough for the user to read the
      // result and (optionally) click the next row themselves. Then
      // phase → idle, formal end of choreography.
      const tIdle = setTimeout(() => {
        setCaptionPhase('idle')

        // Beat D — short breath, then advance to the next available clip.
        // AUTO_ADVANCE plays it; AUTO_SELECT_NEXT only selects it (row
        // highlighted + cued, playback stays paused — the user presses
        // play to hear it). Any user click during the review beat cancels
        // this via clearChoreography(), so manual control always wins.
        if (AUTO_ADVANCE || AUTO_SELECT_NEXT) {
          const tNext = setTimeout(() => {
            for (let step = 1; step <= catalog.length; step++) {
              const nextIdx = (activeIndex + step) % catalog.length
              if (!missingSet.has(catalog[nextIdx].slug)) {
                if (AUTO_ADVANCE) {
                  playIndex(nextIdx)
                } else {
                  setActiveIndex(nextIdx)
                }
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
  }, [activeIndex, catalog, missingSet, playIndex, clearChoreography, animateTransitionTimer, setTransitionStepTimer, markCaptureSeen])

  // -------------------------------------------------------------------
  // Cleanup on unmount.
  // -------------------------------------------------------------------
  useEffect(() => {
    return () => {
      clearChoreography()
      rolloutTimeoutsRef.current.forEach(clearTimeout)
      rolloutTimeoutsRef.current = []
      stopTransitionTimerAnimation()
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {})
        ctxRef.current = null
      }
      analyserRef.current = null
      sourceMapRef.current.clear()
    }
  }, [clearChoreography, stopTransitionTimerAnimation])

  const totalRows = catalog.length

  // True only during the recording → transcribing arc. Review and
  // idle both read as neutral pre-interaction state — the row halo
  // carries the trailing confirmation visually instead of the header.
  const inActiveCapture =
    captionPhase === 'recording' || captionPhase === 'transcribing'
  const currentTimelineStep =
    TRANSITION_STEPS.find((step) => step.id === transitionStepId) ?? TRANSITION_STEPS[0]
  const currentStepIndex = TRANSITION_STEPS.findIndex((step) => step.id === currentTimelineStep.id)
  const timerFor = (id) => transitionTimers[id] ?? 0
  const stepHasPassed = (id) => currentStepIndex > TRANSITION_STEPS.findIndex((step) => step.id === id)
  const voiceProgress = stepHasPassed('voice')
    ? 1
    : currentTimelineStep.id === 'voice'
    ? timerFor('voice')
    : 0
  const desktopProgress = stepHasPassed('desktop')
    ? 1
    : currentTimelineStep.id === 'desktop'
    ? timerFor('desktop')
    : 0
  const tableProgress = stepHasPassed('table')
    ? 1
    : currentTimelineStep.id === 'table'
    ? timerFor('table')
    : 0
  const screenVisible = voiceProgress > 0.02
  const previewVisible = desktopProgress > 0.02
  const tableVisible = tableProgress > 0.02
  const railPrompt =
    currentTimelineStep.id === 'minimized'
      ? 'Click to hear a real Talkie recording'
      : currentTimelineStep.id === 'voice' && voiceProgress < 0.18
      ? 'Recording with Talkie'
      : inActiveCapture
      ? `${isPlaying ? 'PLAYING' : 'STANDBY'} · ${activeCapture?.eyebrow ?? 'CH-01 / VOICE.IN'}`
      : 'STANDBY · CH-01 / VOICE.IN'
  const screenMaxHeight = Math.round(voiceProgress * 420)
  const screenPadding = screenVisible ? '1rem' : 0
  const previewMaxHeight = Math.round(desktopProgress * 500)
  const tableShellProgress = Math.min(1, tableProgress / 0.24)
  const tableSlotProgress = Math.max(0, Math.min(1, (tableProgress - 0.24) / 0.76))
  const tableRowsMaxHeight = Math.round(tableSlotProgress * 72)
  const tableMaxHeight = Math.round(tableShellProgress * 72 + tableRowsMaxHeight)
  const examplesVisible = examplesRevealed && tableProgress >= 1

  return (
    <div className="space-y-10">
      {/* Trace + caption rail — chassis renders with the always-dark
          panel identity in both themes (instruments-as-objects). The
          inner audio logic / LiveTrace already strokes in --trace, but
          --trace flips between charcoal and phosphor with theme. Inside
          a panel chassis we want a consistent phosphor stroke, so the
          inner trace area scopes --trace to --panel-trace via inline
          custom properties — LiveTrace and its descendants pick that up
          naturally. */}
      <div
        className="relative overflow-hidden rounded-md"
        style={{
          background: 'var(--panel-bg)',
          color: 'var(--panel-ink)',
          border: '1px solid var(--panel-edge)',
          boxShadow: 'var(--panel-chassis-shadow)',
          // Scope theme-flipping tokens to the panel's permanent identity.
          // Anything inside this subtree that reads --trace/--ink/--edge
          // through CSS vars (e.g. SVG strokes, LiveTrace) renders against
          // the panel palette regardless of html.dark.
          '--trace': 'var(--panel-trace)',
          '--trace-glow': 'var(--panel-trace-glow)',
          '--trace-dim': 'var(--panel-trace-dim)',
          '--ink': 'var(--panel-ink)',
          '--ink-dim': 'var(--panel-ink-dim)',
          '--ink-muted': 'var(--panel-ink-muted)',
          '--ink-faint': 'var(--panel-ink-faint)',
          '--ink-subtle': 'var(--panel-ink-subtle)',
          '--edge': 'var(--panel-edge)',
          '--edge-dim': 'var(--panel-edge-dim)',
          '--edge-faint': 'var(--panel-edge-faint)',
          '--edge-subtle': 'rgba(77, 255, 158, 0.06)',
          '--canvas-alt': 'var(--panel-bg-alt)',
          '--canvas': 'var(--panel-bg)',
          '--canvas-overlay': 'rgba(6, 9, 10, 0.85)',
        }}
      >
        {/* Corner fasteners — sells "equipment" */}
        <span aria-hidden className="pointer-events-none absolute left-1.5 top-1.5 font-mono text-[8px] leading-none select-none" style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}>·</span>
        <span aria-hidden className="pointer-events-none absolute right-1.5 top-1.5 font-mono text-[8px] leading-none select-none" style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}>·</span>
        <span aria-hidden className="pointer-events-none absolute left-1.5 bottom-1.5 font-mono text-[8px] leading-none select-none" style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}>·</span>
        <span aria-hidden className="pointer-events-none absolute right-1.5 bottom-1.5 font-mono text-[8px] leading-none select-none" style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}>·</span>

        <div className="flex min-h-9 items-center justify-between border-b border-edge-dim px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-ink-faint">
          <div className="flex min-w-0 items-center gap-2">
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
            {!screenVisible ? (
              <button
                type="button"
                onClick={() => playIndex(0)}
                disabled={rolloutStage === 1}
                className="inline-flex items-center gap-2 truncate text-left transition-colors hover:text-ink-muted disabled:cursor-default disabled:hover:text-ink-faint"
                aria-label="Play a real Talkie recording"
              >
                <Play className="h-3 w-3" />
                <span className="truncate">{railPrompt}</span>
              </button>
            ) : (
              railPrompt
            )}
          </div>
          <span className="hidden sm:inline">16kHz · 24-BIT · MONO</span>
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
          className={`group relative cursor-pointer overflow-hidden bg-canvas-alt transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-1 focus-visible:ring-trace ${
            screenVisible
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
          style={{
            maxHeight: `${screenMaxHeight}px`,
            padding: screenPadding,
            // Inset phosphor border on hover — appears like the screen
            // is "warming up" when you approach it.
            transition:
              'max-height 700ms cubic-bezier(0.22,1,0.36,1), padding 700ms cubic-bezier(0.22,1,0.36,1), opacity 500ms ease-out, box-shadow 320ms ease-out',
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
            scaleLabel="16kHz · MAC · iPHONE · WATCH"
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
          {isPlaying && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-6 sm:bottom-6">
              <CinematicCaption
                audioRef={audioRef}
                alignSrc={
                  activeCapture?.alignment ??
                  activeCapture?.audio?.replace(/\.mp3$/, '.alignment.json')
                }
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
            Three-column grid: TRIG (left) · play/pause (center, only
            after first engagement) · channel/eyebrow label (right).
            Only the phosphor dot + the play/pause icon signal state;
            the rest stays calm so consecutive captures don't strobe. */}
        <div className={`grid grid-cols-3 items-center gap-3 overflow-hidden border-t border-edge-faint px-4 text-[9px] uppercase tracking-[0.24em] text-ink-subtle transition-all duration-500 ${
          screenVisible ? 'max-h-10 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}>
          <span className="flex items-center gap-2 justify-self-start">
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full transition-all duration-500"
              style={{
                background: isPlaying ? 'var(--trace)' : 'var(--ink-faint)',
                boxShadow: isPlaying ? '0 0 4px var(--trace)' : 'none',
              }}
            />
            TRIG
          </span>
          <div className="justify-self-center">
            {hasEngaged && (
              <button
                type="button"
                onClick={() => togglePlay(activeIndex)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-edge-dim text-ink-muted transition-all duration-150 hover:border-trace hover:text-trace"
                style={{
                  background: isPlaying
                    ? 'color-mix(in oklab, var(--trace) 8%, transparent)'
                    : 'transparent',
                }}
              >
                {isPlaying ? (
                  <Pause className="h-2.5 w-2.5 fill-current" />
                ) : (
                  <Play className="h-2.5 w-2.5 fill-current" style={{ marginLeft: 0.5 }} />
                )}
              </button>
            )}
          </div>
          <span className="justify-self-end">{activeCapture?.eyebrow ?? 'CH-01 / VOICE.IN'}</span>
        </div>
      </div>

      {/* Paste-preview mock — destination-app chrome that slides in
          during the review phase, sitting BETWEEN the play bar above
          and the dictation buffer below. The sequence reads:
          live capture (play bar) → simulated paste (here) → historical
          record of past captures (table chassis). */}
      <div
        className={`overflow-hidden transition-all delay-150 duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          previewVisible
            ? 'translate-y-0 opacity-100'
            : 'max-h-0 -translate-y-2 opacity-0'
        }`}
        style={{ maxHeight: previewVisible ? `${previewMaxHeight}px` : 0 }}
      >
        <PasteMock
          capture={activeCapture}
          phase={captionPhase}
          keypressCue={keypressCue}
          revealProgress={desktopProgress}
        />
      </div>

      {/* Table — second instrument; same chassis treatment as the
          trace card so they read as a matched pair sitting on the
          workbench. Token re-scoping mirrors the trace card. */}
      <div
        className={`overflow-hidden transition-all delay-300 duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          tableVisible
            ? 'translate-y-0 opacity-100'
            : 'max-h-0 -translate-y-3 opacity-0'
        }`}
        style={{ maxHeight: tableVisible ? `${tableMaxHeight}px` : 0 }}
      >
        <div
          ref={tableRef}
          tabIndex={0}
          role="listbox"
          aria-label="Talkie capture catalog"
          aria-activedescendant={`signal-row-${activeIndex}`}
          className="relative overflow-hidden rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-trace"
          style={{
            background: 'var(--panel-bg)',
            color: 'var(--panel-ink)',
            border: '1px solid var(--panel-edge)',
            boxShadow: 'var(--panel-chassis-shadow)',
            '--trace': 'var(--panel-trace)',
            '--trace-glow': 'var(--panel-trace-glow)',
            '--trace-dim': 'var(--panel-trace-dim)',
            '--ink': 'var(--panel-ink)',
            '--ink-dim': 'var(--panel-ink-dim)',
            '--ink-muted': 'var(--panel-ink-muted)',
            '--ink-faint': 'var(--panel-ink-faint)',
            '--ink-subtle': 'var(--panel-ink-subtle)',
            '--edge': 'var(--panel-edge)',
            '--edge-dim': 'var(--panel-edge-dim)',
            '--edge-faint': 'var(--panel-edge-faint)',
            '--edge-subtle': 'rgba(77, 255, 158, 0.06)',
            '--canvas-alt': 'var(--panel-bg-alt)',
            '--canvas': 'var(--panel-bg)',
            '--surface': 'var(--panel-bg)',
          }}
        >
          {/* Corner fasteners */}
          <span aria-hidden className="pointer-events-none absolute left-1.5 top-1.5 font-mono text-[8px] leading-none select-none z-10" style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}>·</span>
          <span aria-hidden className="pointer-events-none absolute right-1.5 top-1.5 font-mono text-[8px] leading-none select-none z-10" style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}>·</span>
          <span aria-hidden className="pointer-events-none absolute left-1.5 bottom-1.5 font-mono text-[8px] leading-none select-none z-10" style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}>·</span>
          <span aria-hidden className="pointer-events-none absolute right-1.5 bottom-1.5 font-mono text-[8px] leading-none select-none z-10" style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}>·</span>

          <div className="flex items-center justify-between border-b border-edge-faint bg-canvas px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            <span>SIGNAL TABLE · DICTATION BUFFER</span>
            <span>
              {String(activeIndex + 1).padStart(2, '0')} / {String(totalRows).padStart(2, '0')}
            </span>
          </div>

          <div
            className="overflow-hidden"
            style={{
              maxHeight: `${tableRowsMaxHeight}px`,
              transition: 'max-height 760ms cubic-bezier(0.16,1.22,0.32,1)',
            }}
          >
            {[{ capture: activeCapture, index: activeIndex }].map(({ capture, index }) => {
              const rowReveal = Math.max(0, Math.min(1, tableSlotProgress / 0.54))
              return (
                <div
                  key={capture.slug}
                  id={`signal-row-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className="overflow-hidden"
                  style={{
                    maxHeight: `${Math.round(rowReveal * 72)}px`,
                    opacity: rowReveal,
                    transform: `translateY(${Math.round((1 - rowReveal) * -6)}px) scale(${0.98 + rowReveal * 0.02})`,
                    transformOrigin: 'top center',
                    transition:
                      'max-height 680ms cubic-bezier(0.16,1.22,0.32,1), opacity 260ms ease-out, transform 640ms cubic-bezier(0.16,1.22,0.32,1)',
                  }}
                >
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
                    showOutput={false}
                  />
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-edge-faint bg-canvas px-4 py-2.5 text-[9px] uppercase tracking-[0.22em] text-ink-faint">
            <span className="shrink-0">LANDED · BUFFER PREVIEW</span>
            <span className="min-w-0 truncate">{activeCapture?.output ?? 'READY'}</span>
          </div>
        </div>
      </div>

      {examplesVisible && (
        <div className="animate-[capture-examples-reveal_900ms_cubic-bezier(0.22,1,0.36,1)_both]">
          <CaptureExamplesRail
            catalog={catalog}
            activeIndex={activeIndex}
            isPlaying={isPlaying}
            seenCaptureSlugs={seenCaptureSlugs}
            onSelect={activate}
          />
        </div>
      )}

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

function CaptureExamplesRail({ catalog, activeIndex, isPlaying, seenCaptureSlugs, onSelect }) {
  const nextIndex = (activeIndex + 1) % catalog.length
  const seenCount = seenCaptureSlugs.size

  return (
    <div className="overflow-hidden rounded-md border border-edge-dim bg-surface px-3 py-3 shadow-[0_10px_28px_-24px_rgba(0,0,0,0.45)]">
      <div className="mb-2 flex items-center justify-between gap-3 px-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
        <span>Real captures · {String(seenCount).padStart(2, '0')} heard</span>
        <button
          type="button"
          onClick={() => onSelect(nextIndex)}
          className="text-ink-subtle transition-colors hover:text-ink-muted"
        >
          Next · {catalog[nextIndex]?.eyebrow ?? 'Capture'}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {catalog.map((capture, index) => {
          const kind = capture.eyebrow.split('·')[0].trim().toUpperCase()
          const Icon = CAPTURE_EXAMPLE_ICONS[kind] ?? NotebookPen
          const active = index === activeIndex
          const seen = seenCaptureSlugs.has(capture.slug)
          return (
            <button
              key={capture.slug}
              type="button"
              onClick={() => onSelect(index)}
              className={`group flex min-w-[11rem] items-center gap-2 rounded-sm border px-2.5 py-2 text-left transition-all ${
                seen
                  ? 'border-edge bg-canvas text-ink shadow-[0_8px_24px_-24px_rgba(0,0,0,0.35)]'
                  : 'border-edge-dim bg-canvas-alt text-ink-muted opacity-70 hover:border-edge hover:bg-canvas hover:opacity-100'
              }`}
              aria-pressed={active}
            >
              <span
                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border transition-transform ${
                  seen ? 'border-trace text-trace' : 'border-edge-dim text-ink-subtle group-hover:text-ink-muted'
                } ${active && isPlaying ? 'scale-105' : ''}`}
                style={
                  seen
                    ? {
                        background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                        boxShadow: active
                          ? '0 0 10px color-mix(in oklab, var(--trace-glow) 36%, transparent)'
                          : 'none',
                      }
                    : undefined
                }
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em]">
                  <span className="truncate">{capture.eyebrow}</span>
                  <span className={seen ? 'text-trace' : 'text-ink-faint'}>
                    {seen ? 'seen' : 'unseen'}
                  </span>
                </span>
                <span className="mt-1 block truncate text-[11px] text-ink-subtle">
                  {capture.output}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
