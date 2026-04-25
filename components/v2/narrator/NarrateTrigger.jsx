"use client"

import { Volume2 } from 'lucide-react'
import { useNarrator } from './NarratorProvider'

/**
 * NarrateTrigger — three render variants, one behaviour: dispatch `clip`
 * to the global narrator on click.
 *
 * Variants:
 *   - "speaker" (default): icon-only button. Drop next to a heading.
 *   - "pill":              eyebrow-cased CTA pill. Use for explicit
 *                          "hear how this works" affordances.
 *   - "inline":            wraps a phrase with a dotted underline + speaker
 *                          icon glyph at the end. Use to make a sentence
 *                          fragment audibly explorable.
 *
 * The `clip` prop is the same shape used by NarratorProvider — see that
 * file for the full data contract.
 */
export default function NarrateTrigger({ clip, variant = 'speaker', children, className = '' }) {
  const { play, clip: activeClip, isPlaying } = useNarrator()
  const isActive = activeClip?.slug === clip?.slug && isPlaying

  const onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    play(clip)
  }

  const ariaLabel = `Hear: ${clip?.caption || clip?.slug || 'audio narration'}`

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={isActive}
        className={`inline-flex items-center gap-2 rounded-sm border border-edge-dim px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:border-trace hover:text-trace ${
          isActive ? 'border-trace text-trace' : ''
        } ${className}`}
        style={
          isActive
            ? { background: 'color-mix(in oklab, var(--trace) 8%, transparent)' }
            : undefined
        }
      >
        <Volume2 className="h-3 w-3" />
        <span>{children || 'Hear it'}</span>
      </button>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={isActive}
        className={`group inline cursor-pointer text-inherit underline decoration-dotted underline-offset-4 transition-colors ${
          isActive
            ? 'decoration-trace'
            : 'decoration-ink-faint hover:decoration-trace'
        } ${className}`}
      >
        <span>{children}</span>
        <Volume2
          className={`ml-1 inline h-3 w-3 align-baseline transition-colors ${
            isActive ? 'text-trace' : 'text-ink-faint group-hover:text-trace'
          }`}
        />
      </button>
    )
  }

  // speaker — default
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-sm align-middle transition-colors ${
        isActive ? 'text-trace' : 'text-ink-faint hover:text-trace'
      } ${className}`}
      style={
        isActive
          ? { filter: 'drop-shadow(0 0 4px var(--trace-glow))' }
          : undefined
      }
    >
      <Volume2 className="h-3 w-3" />
    </button>
  )
}
