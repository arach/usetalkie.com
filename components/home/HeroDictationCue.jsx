'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import TalkieMark from './TalkieMark'
import TalkieRecordingBar from './TalkieRecordingBar'
import { useNarrator } from '../narrator'
import { compressLevel, readAnalyserLevel, smoothTowards } from './talkie-signal'
import {
  BADGE_SIZE,
  POINTER_GAP,
  createFollowState,
  followAtRest,
  settleFollow,
  stepFollow,
} from './talkie-follow'
import { HERO_CAPTURES, captureAudio, loadCapture, spokenCountAt } from './talkie-captures'
import styles from './HeroDictationCue.module.css'

// The same shortcut the demo film keycasts, so the hero and the demo are
// telling the visitor about one key combination rather than two. It is written
// as a chord the way a menu writes one — a note about the app, not a keyboard
// miming its own press.
const CHORD = '⌃⇧⌘L'

/**
 * The hero's account of what Talkie does, and an invitation to hear it.
 *
 * Nothing plays on its own, and the page binds no shortcut of its own: the
 * chord is written here as a fact about the Mac app, which is all it can be on
 * a website. Press the button and a genuine capture plays — you hear the
 * sentence, the mark fills from that actual waveform, and the words land on
 * the milliseconds they were spoken.
 *
 * For the length of the clip the mark leaves its slot and trails your pointer
 * the way Talkie's companion trails it on a desktop, then glides home.
 */
export default function HeroDictationCue() {
  const { play, close, isPlaying, audioRef, analyserRef } = useNarrator()

  const rootRef = useRef(null)
  const badgeRef = useRef(null)
  const parkedMarkRef = useRef(null)
  const companionRef = useRef(null)
  const companionMarkRef = useRef(null)
  const textRef = useRef(null)
  const levelRef = useRef({ level: 0 })

  // 'idle' — parked, silent. 'live' — a clip is playing and the mark is out.
  // 'homing' — the clip has ended and the mark is gliding back to its slot.
  const [phase, setPhase] = useState('idle')

  // The loaded capture being spoken, and where the rotation has got to.
  const captureRef = useRef(null)
  const turnRef = useRef(0)

  const start = useCallback(async () => {
    if (phase !== 'idle') return
    const { slug, caption } = HERO_CAPTURES[turnRef.current % HERO_CAPTURES.length]
    turnRef.current += 1
    try {
      captureRef.current = await loadCapture(slug)
    } catch (error) {
      // No alignment means no transcript to write, so there is no demo to run.
      // eslint-disable-next-line no-console
      console.warn(`[HeroDictationCue] no alignment for "${slug}"`, error)
      return
    }
    // `bare` keeps the site's narrator dock out of the hero: the recording bar
    // and the line beside it are already this clip's player.
    play({ slug, audio: captureAudio(slug), caption, bare: true })
  }, [phase, play])

  // Warm the alignment before it is needed, so the press has nothing to wait on.
  const prefetch = useCallback(() => {
    const { slug } = HERO_CAPTURES[turnRef.current % HERO_CAPTURES.length]
    loadCapture(slug).catch(() => {})
  }, [])

  useEffect(() => {
    if (isPlaying) setPhase('live')
    else setPhase((current) => (current === 'live' ? 'homing' : current))
  }, [isPlaying])

  useEffect(() => {
    if (phase === 'idle') return undefined

    const root = rootRef.current
    const badge = badgeRef.current
    const companion = companionRef.current
    const parkedMark = parkedMarkRef.current
    const companionMark = companionMarkRef.current
    const text = textRef.current
    if (!root || !badge || !companion || !parkedMark || !companionMark || !text) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Touch and pen have no hovering pointer to trail: the companion would
    // either never appear or stick where a finger last landed.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const follows = finePointer && !reduceMotion

    const capture = captureRef.current
    const buffer = new Uint8Array(analyserRef.current?.fftSize ?? 1024)
    const follow = createFollowState()

    let frame = 0
    let level = 0
    let lastTimestamp = 0
    let spoken = 0
    let pointerX = 0
    let pointerY = 0
    let hasPointer = false

    /** The badge's slot, in viewport coordinates — where the mark lives at rest. */
    const parked = () => {
      const bounds = badge.getBoundingClientRect()
      return { x: bounds.left, y: bounds.top }
    }

    /** Beside the pointer, kept whole inside the viewport as the native panel is. */
    const beside = () => ({
      x: Math.max(4, Math.min(pointerX + POINTER_GAP, window.innerWidth - BADGE_SIZE - 4)),
      y: Math.max(4, Math.min(pointerY + POINTER_GAP, window.innerHeight - BADGE_SIZE - 4)),
    })

    const place = () => {
      companion.style.transform = `translate3d(${follow.x}px, ${follow.y}px, 0)`
    }

    if (follows) {
      settleFollow(follow, parked().x, parked().y)
      place()
      root.dataset.detached = 'true'
    }

    const step = (timestamp) => {
      frame = requestAnimationFrame(step)
      const dt = lastTimestamp ? Math.min(0.05, (timestamp - lastTimestamp) / 1000) : 1 / 60
      lastTimestamp = timestamp

      // ---- The voice, read from the clip you are actually hearing ----------
      const heard = phase === 'live' ? readAnalyserLevel(analyserRef.current, buffer) : 0
      level = smoothTowards(level, heard, dt)
      levelRef.current.level = level
      const fill = compressLevel(level, 0).toFixed(3)
      parkedMark.style.setProperty('--level', fill)
      companionMark.style.setProperty('--level', fill)

      // ---- The words, on the milliseconds they were spoken -----------------
      if (phase === 'live' && capture) {
        const at = audioRef.current?.currentTime ?? 0
        const next = spokenCountAt(capture.words, at, spoken)
        if (next !== spoken) {
          spoken = next
          text.textContent = capture.words
            .slice(0, spoken)
            .map((entry) => entry.word)
            .join(' ')
          // Keep the newest word in view, as a real dictation field does.
          const overflow = Math.max(0, text.scrollWidth - text.parentElement.clientWidth)
          text.style.transform = `translateX(${-overflow}px)`
        }
        text.dataset.typing = spoken < capture.words.length ? 'true' : 'false'
      }

      // ---- The follow ------------------------------------------------------
      if (!follows) return
      if (phase === 'live') {
        const target = hasPointer ? beside() : parked()
        stepFollow(follow, target.x, target.y, dt)
        place()
        return
      }

      // Homing: back to the slot, and the mark is only handed over once it has
      // actually arrived — so the swap is never visible as a jump.
      const slot = parked()
      stepFollow(follow, slot.x, slot.y, dt)
      place()
      if (followAtRest(follow, slot.x, slot.y)) {
        root.dataset.detached = 'false'
        setPhase('idle')
      }
    }

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      pointerX = event.clientX
      pointerY = event.clientY
      hasPointer = true
    }

    if (follows) window.addEventListener('pointermove', onPointerMove, { passive: true })
    frame = requestAnimationFrame(step)

    // Reduced motion and touch never detach, so homing has nothing to wait for.
    let settle = 0
    if (!follows && phase === 'homing') settle = window.setTimeout(() => setPhase('idle'), 400)

    return () => {
      cancelAnimationFrame(frame)
      if (settle) clearTimeout(settle)
      if (follows) window.removeEventListener('pointermove', onPointerMove)
    }
  }, [phase, analyserRef, audioRef])

  // Back to rest: clear the provider's clip and wipe the line.
  useEffect(() => {
    if (phase !== 'idle') return
    close()
    const text = textRef.current
    if (!text) return
    text.textContent = ''
    text.style.transform = 'translateX(0)'
    text.dataset.typing = 'false'
  }, [phase, close])

  const live = phase !== 'idle'

  return (
    <div ref={rootRef} className={styles.cue} data-live={live} data-detached="false">
      <button
        type="button"
        className={styles.trigger}
        onClick={start}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-label={
          live
            ? 'Playing a Talkie dictation capture'
            : 'Hear a real Talkie dictation. On a Mac, Control-Shift-Command-L is the shortcut that summons Talkie.'
        }
      >
        {/* Talkie, waiting. It leaves this slot for the length of a clip; the
            slot stays behind so nothing in the row moves while it is out. */}
        <span ref={badgeRef} className={styles.badge} aria-hidden="true">
          <TalkieMark markRef={parkedMarkRef} className={styles.badgeMark} />
        </span>

        {/* One reserved slot: the hint sits here until the bar unfolds over it. */}
        <span className={styles.stage}>
          <span className={styles.hint} aria-hidden="true">
            <span className={styles.hintChord}>{CHORD}</span>
            <span className={styles.hintLabels}>
              <span className={styles.hintRest}>to dictate, anywhere</span>
              <span className={styles.hintHover}>hear it</span>
            </span>
          </span>

          <TalkieRecordingBar levelRef={levelRef} leading="none" className={styles.bar} />
        </span>
      </button>

      <span className={styles.transcript} aria-hidden="true">
        <span ref={textRef} className={styles.transcriptText} data-typing="false" />
      </span>

      {/* The mark while it is out. Fixed to the viewport so it can trail the
          pointer anywhere on the page, and never takes the pointer itself. */}
      <span ref={companionRef} className={styles.companion} aria-hidden="true">
        <TalkieMark markRef={companionMarkRef} />
      </span>
    </div>
  )
}
