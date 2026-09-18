'use client'

import { useEffect, useRef } from 'react'
import TalkieMark from './TalkieMark'
import { compressLevel, smoothTowards, speechEnvelope } from './talkie-signal'
import {
  BADGE_SIZE,
  POINTER_GAP,
  createFollowState,
  settleFollow,
  stepFollow,
} from './talkie-follow'
import styles from './DemoCursorStage.module.css'

/**
 * Wraps the homepage demo block and lends it Talkie's cursor companion: the
 * small microphone badge that trails the pointer while the app is listening.
 *
 * The badge only exists inside this block, it never takes the pointer (the
 * real cursor and every click carry on untouched), and the level filling its
 * mark is synthesised rather than heard, so no microphone is requested.
 */
export default function DemoCursorStage({ children }) {
  const stageRef = useRef(null)
  const badgeRef = useRef(null)
  const levelRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const badge = badgeRef.current
    const levelMark = levelRef.current
    if (!stage || !badge || !levelMark) return undefined

    // Touch and pen have no hovering pointer to follow: the companion would
    // either never appear or stick where a finger last landed.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let frame = 0
    let active = false
    let pointerX = 0
    let pointerY = 0
    let level = 0
    const follow = createFollowState()
    let lastTimestamp = 0

    /** Keep the badge inside the demo block, as the native panel stays on screen. */
    const target = () => {
      const bounds = stage.getBoundingClientRect()
      return {
        x: Math.max(bounds.left + 4, Math.min(pointerX + POINTER_GAP, bounds.right - BADGE_SIZE - 4)),
        y: Math.max(bounds.top + 4, Math.min(pointerY + POINTER_GAP, bounds.bottom - BADGE_SIZE - 4)),
      }
    }

    const place = () => {
      badge.style.transform = `translate3d(${follow.x}px, ${follow.y}px, 0)`
    }

    const step = (timestamp) => {
      frame = requestAnimationFrame(step)
      const dt = lastTimestamp ? Math.min(0.05, (timestamp - lastTimestamp) / 1000) : 1 / 60
      lastTimestamp = timestamp

      const origin = target()

      if (reduceMotion.matches) settleFollow(follow, origin.x, origin.y)
      else stepFollow(follow, origin.x, origin.y, dt)

      place()

      level = reduceMotion.matches
        ? 0.4
        : smoothTowards(level, speechEnvelope(timestamp / 1000), dt)
      levelMark.style.setProperty('--level', compressLevel(level, 0).toFixed(3))
    }

    const start = () => {
      if (frame) return
      lastTimestamp = 0
      frame = requestAnimationFrame(step)
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches) return
      pointerX = event.clientX
      pointerY = event.clientY
      if (!active) {
        active = true
        // Arrive at the pointer rather than flying in from the last position.
        const origin = target()
        settleFollow(follow, origin.x, origin.y)
        place()
        badge.dataset.visible = 'true'
        start()
      }
    }

    const onPointerLeave = () => {
      if (!active) return
      active = false
      badge.dataset.visible = 'false'
      stop()
    }

    // A scroll moves the block out from under a stationary pointer, and no
    // pointer event follows. Drop the companion only once the block has
    // actually left the pointer, so scrolling while hovering keeps it.
    const onScroll = () => {
      if (!active) return
      const bounds = stage.getBoundingClientRect()
      const inside =
        pointerX >= bounds.left &&
        pointerX <= bounds.right &&
        pointerY >= bounds.top &&
        pointerY <= bounds.bottom
      if (!inside) onPointerLeave()
    }

    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerleave', onPointerLeave)
    stage.addEventListener('pointercancel', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      stop()
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerleave', onPointerLeave)
      stage.removeEventListener('pointercancel', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div ref={stageRef} className={styles.stage}>
      {children}
      <span ref={badgeRef} className={styles.badge} data-visible="false" aria-hidden="true">
        <TalkieMark markRef={levelRef} tone="auto" />
      </span>
    </div>
  )
}
