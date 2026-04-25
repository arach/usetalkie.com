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
  activationKey,
  transcribeKey,
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
      className={`relative grid grid-cols-[28px_64px_1fr] items-start gap-3 px-4 py-3.5 transition-colors ${
        index % 2 === 0 ? 'bg-canvas' : 'bg-canvas-alt'
      } ${index > 0 ? 'border-t border-edge-subtle' : ''} ${
        onActivate ? 'cursor-pointer hover:bg-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-trace' : ''
      }`}
      style={activeStyle}
      aria-current={active ? 'true' : undefined}
    >
      {/* Settle-from-trace overlay — phosphor "spill" that drops in from
          the top of the row each time it freshly becomes active OR each
          time the engine deposits a fresh transcription into it. The
          `key={activationKey}` forces a remount on each activation so
          the keyframe replays. Conceptually: "the data is now stored
          in the dictation buffer." */}
      {active && activationKey != null && (
        <span
          key={`settle-${activationKey}`}
          aria-hidden
          className="row-settle pointer-events-none absolute inset-0"
        />
      )}

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

        {/* Input quote — the row's "transcription". When the engine
            finishes its transcribing beat, the parent bumps
            transcribeKey, which fires two keyed overlays here:
              1. row-paste-type — phosphor selection band sweeping
                 L→R across the text width (~280ms). Reads as a
                 cursor writing decisively.
              2. row-paste-text — the text behind briefly turns
                 trace + soft glow, then settles back to ink
                 (~520ms total color transition).
            The two combine into "engine just typed this here." Both
            are keyed by `transcribeKey` so each fire replays cleanly. */}
        <p className={`relative mt-1.5 overflow-hidden text-[13px] italic leading-snug ${active ? 'text-ink' : 'text-ink-muted'}`}>
          {active && transcribeKey != null && (
            <span
              key={`paste-band-${transcribeKey}`}
              aria-hidden
              className="row-paste-type pointer-events-none absolute inset-y-0 -left-[8%] w-[24%]"
            />
          )}
          {active && transcribeKey != null ? (
            <span
              key={`paste-text-${transcribeKey}`}
              className="row-paste-text relative"
            >
              &ldquo;{capture.input}&rdquo;
            </span>
          ) : (
            <span className="relative">
              &ldquo;{capture.input}&rdquo;
            </span>
          )}
        </p>

        <p className="mt-1.5 flex items-center gap-2 text-[12px] text-ink-dim">
          <span className="text-trace" style={TRACE_GLOW_SOFT}>→</span>
          <span>{capture.output}</span>
        </p>
      </div>
    </div>
  )
}
