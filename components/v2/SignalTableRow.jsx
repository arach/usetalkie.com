import { Play, Pause } from 'lucide-react'

/**
 * SignalTableRow — presentational row.
 *
 * No state, no effects — usable from both server (SSR shell) and client
 * (the live SignalTable island). All interactivity is wired through
 * props (`onClick`, `onPlay`).
 *
 * Active rows get a phosphor halo via inline CSS-var-backed box-shadow;
 * "no audio yet" rows show a tiny indicator next to the play button
 * instead of swallowing the click silently.
 */

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }
const TRACE_GLOW_DOT = { boxShadow: '0 0 6px var(--trace)' }

export default function SignalTableRow({
  capture,
  index,
  active = false,
  playing = false,
  missing = false,
  onActivate,
  onTogglePlay,
}) {
  const handleRowClick = () => {
    if (onActivate) onActivate(index)
  }

  const handlePlayClick = (e) => {
    e.stopPropagation()
    if (onTogglePlay) onTogglePlay(index)
  }

  // Stage label: derived from index, mirrors the donor table's "T+NN".
  const stage = `T+${String(index + 1).padStart(2, '0')}`

  // Phosphor active state — tinted background + subtle glow halo.
  const activeStyle = active
    ? {
        background: 'color-mix(in oklab, var(--trace) 7%, transparent)',
        boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--trace) 28%, transparent), 0 0 14px color-mix(in oklab, var(--trace-glow) 50%, transparent)',
      }
    : undefined

  return (
    <div
      role={onActivate ? 'button' : undefined}
      tabIndex={onActivate ? 0 : undefined}
      onClick={onActivate ? handleRowClick : undefined}
      onKeyDown={
        onActivate
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleRowClick()
              }
            }
          : undefined
      }
      className={`grid grid-cols-[28px_64px_1fr] items-start gap-3 px-4 py-3.5 transition-colors ${
        index % 2 === 0 ? 'bg-canvas' : 'bg-canvas-alt'
      } ${index > 0 ? 'border-t border-edge-subtle' : ''} ${
        onActivate ? 'cursor-pointer hover:bg-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-trace' : ''
      }`}
      style={activeStyle}
      aria-current={active ? 'true' : undefined}
    >
      {/* Transport */}
      <button
        type="button"
        onClick={handlePlayClick}
        disabled={missing}
        aria-label={playing ? 'Pause' : 'Play'}
        className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-sm border transition-all ${
          playing
            ? 'border-trace text-trace'
            : missing
            ? 'border-edge-faint text-ink-subtle cursor-not-allowed'
            : 'border-edge text-ink-muted hover:border-trace hover:text-trace'
        }`}
        style={
          playing
            ? {
                background: 'color-mix(in oklab, var(--trace) 14%, transparent)',
                boxShadow: '0 0 8px var(--trace-glow)',
              }
            : undefined
        }
      >
        {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      </button>

      {/* Stage */}
      <span
        className={`mt-1 text-[10px] uppercase tracking-[0.22em] ${active ? 'text-trace' : 'text-trace'}`}
        style={TRACE_GLOW_SOFT}
      >
        {stage}
      </span>

      {/* Body */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-ink-faint">
          <span
            aria-hidden
            className={`inline-block h-1 w-1 rounded-full ${active ? 'bg-trace' : 'bg-ink-subtle'}`}
            style={active ? TRACE_GLOW_DOT : undefined}
          />
          <span>{capture.eyebrow}</span>
          {missing && (
            <span className="ml-2 normal-case tracking-normal text-ink-subtle">
              · no audio yet
            </span>
          )}
        </div>

        <p className={`mt-1.5 text-[13px] italic leading-snug ${active ? 'text-ink' : 'text-ink-muted'}`}>
          &ldquo;{capture.input}&rdquo;
        </p>

        <p className="mt-1.5 flex items-center gap-2 text-[12px] text-ink-dim">
          <span className="text-trace" style={TRACE_GLOW_SOFT}>→</span>
          <span>{capture.output}</span>
        </p>
      </div>
    </div>
  )
}
