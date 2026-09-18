'use client'

import styles from './TalkieMark.module.css'

/**
 * Talkie's mark: a lowercase JetBrains Mono "t" that fills from the baseline
 * with the voice, exactly as the macOS cursor companion draws it.
 *
 * Set the fill by writing `--level` (0–1) on the element — pass `markRef` to
 * get a handle for that. It is written from a frame loop rather than React
 * state so the fill can follow the signal without re-rendering.
 */
export default function TalkieMark({ markRef, className = '', tone = 'light' }) {
  return (
    <span
      ref={markRef}
      className={`${styles.mark} ${className}`.trim()}
      data-tone={tone}
      aria-hidden="true"
    >
      t
    </span>
  )
}
