'use client'

import { useEffect, useRef } from 'react'
import {
  buildParticleConstants,
  compressLevel,
  drawParticleField,
  fitCanvas,
  smoothTowards,
  speechEnvelope,
} from './talkie-signal'
import TalkieMark from './TalkieMark'
import styles from './TalkieRecordingBar.module.css'

// Density is matched to the real overlay: 36 particles across roughly 300pt of
// bar. Narrow bars get proportionally fewer so the field reads the same.
const REFERENCE_WIDTH = 300
const MAX_PARTICLES = 36
const MIN_PARTICLES = 14

// Built once, at full population. Drawing a slice keeps every particle's seed
// pinned as the bar changes width, so the field never reshuffles as it unfolds.
const PARTICLES = buildParticleConstants(MAX_PARTICLES)

// The still frame shown under reduced motion: mid-phrase, so the bar still
// looks like a voice was caught rather than an empty strip.
const STILL_TIME = 6.2
const STILL_LEVEL = 0.34

function particleCountFor(width) {
  const scaled = Math.round((MAX_PARTICLES * width) / REFERENCE_WIDTH)
  return Math.max(MIN_PARTICLES, Math.min(MAX_PARTICLES, scaled))
}

/**
 * The translucent recording bar Talkie floats over the desktop while it
 * listens, rebuilt with browser-native drawing. The particle field is a port
 * of the app's own calm-mode canvas.
 *
 * Pass `levelRef` to let a parent conduct the voice, so everything reacting to
 * it shares one smoother; leave it off and the bar drives itself from the
 * synthesised envelope. Either way the page asks for no microphone.
 *
 * It is decoration, not a control: the affordances are drawn for likeness and
 * are inert.
 */
export default function TalkieRecordingBar({
  className = '',
  label = null,
  levelRef = null,
  leading = 'mark',
}) {
  const canvasRef = useRef(null)
  const markRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let level = 0
    let lastTimestamp = 0
    let visible = false

    // White in both themes, as in the overlay, where the fill is set explicitly
    // rather than resolved from the theme.
    const color = 'rgba(255, 255, 255, 0.92)'

    const paint = (fit, time, drawLevel) => {
      drawParticleField(fit.ctx, {
        width: fit.width,
        height: fit.height,
        time,
        level: compressLevel(drawLevel),
        constants: PARTICLES.slice(0, particleCountFor(fit.width)),
        color,
      })
      markRef.current?.style.setProperty('--level', compressLevel(drawLevel, 0).toFixed(3))
    }

    const drawStill = () => {
      const fit = fitCanvas(canvas)
      if (fit) paint(fit, STILL_TIME, STILL_LEVEL)
    }

    const step = (timestamp) => {
      frame = requestAnimationFrame(step)
      const fit = fitCanvas(canvas)
      if (!fit) return

      const dt = lastTimestamp ? Math.min(0.05, (timestamp - lastTimestamp) / 1000) : 1 / 60
      lastTimestamp = timestamp
      const time = timestamp / 1000

      level = levelRef
        ? levelRef.current?.level ?? 0
        : smoothTowards(level, speechEnvelope(time), dt)
      paint(fit, time, level)
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      lastTimestamp = 0
    }

    const sync = () => {
      if (visible && !document.hidden && !reduceMotion.matches) {
        if (!frame) frame = requestAnimationFrame(step)
        return
      }
      stop()
      if (reduceMotion.matches) drawStill()
    }

    // Only animate while the bar is on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    const resizeObserver = new ResizeObserver(() => {
      if (!frame) drawStill()
    })
    resizeObserver.observe(canvas)

    document.addEventListener('visibilitychange', sync)
    reduceMotion.addEventListener('change', sync)

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reduceMotion.removeEventListener('change', sync)
    }
  }, [levelRef])

  return (
    <figure
      data-talkie-bar=""
      className={`${styles.bar} ${className}`.trim()}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' })}
    >
      {leading === 'mark' && (
        <span className={styles.badge} aria-hidden="true">
          <TalkieMark markRef={markRef} className={styles.badgeMark} />
        </span>
      )}

      <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />

      <span className={styles.control} aria-hidden="true">
        <span className={styles.stop} />
      </span>
    </figure>
  )
}
