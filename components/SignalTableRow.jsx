import { Play, Pause } from 'lucide-react'

/**
 * SignalTableRow — presentational row.
 *
 * No state, no effects — usable from both server (SSR shell) and client
 * (the live SignalTable island). All interactivity is wired through
 * props (`onActivate`, `onTogglePlay`).
 *
 * Interaction model (no nested interactive):
 *   - Play/pause is the sole button in the transport column.
 *   - Row activation is a separate button covering stage + body so
 *     there is one clear interactive owner per action (axe nested-
 *     interactive safe).
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
  showOutput = true,
  activationKey,
  transcribeKey,
  onActivate,
  onTogglePlay,
}) {
  const handleActivate = () => {
    if (onActivate) onActivate(index)
  }

  const handlePlayClick = (e) => {
    e.stopPropagation()
    if (onTogglePlay) onTogglePlay(index)
  }

  // Stage label: derived from index, mirrors the donor table's "T+NN".
  const stage = `T+${String(index + 1).padStart(2, '0')}`

  // Phosphor active state — tinted background + subtle glow halo.
  // Background mix dialed back from 7% → 4% so the active row reads
  // as a softer highlight rather than a heavy wash, especially on
  // Slate where Modern's white canvas amplifies any tint.
  const activeStyle = active
    ? {
        background: 'color-mix(in oklab, var(--trace) 4%, transparent)',
        boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--trace) 22%, transparent), 0 0 12px color-mix(in oklab, var(--trace-glow) 40%, transparent)',
      }
    : undefined

  return (
    <div
      className={`relative grid grid-cols-[44px_64px_1fr] items-start gap-2 px-3 py-3.5 transition-colors sm:grid-cols-[44px_64px_1fr] sm:gap-3 sm:px-4 ${
        index % 2 === 0 ? 'bg-canvas' : 'bg-canvas-alt'
      } ${index > 0 ? 'border-t border-edge-subtle' : ''}`}
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

      {/* Transport — sole interactive owner for play/pause */}
      <button
        type="button"
        onClick={handlePlayClick}
        disabled={missing}
        aria-label={playing ? 'Pause' : 'Play'}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-trace ${
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
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>

      {/* Activation owner — stage + body. Separate from play so we never
          nest interactive controls. Keyboard listbox navigation still
          lives on the parent SignalTable chassis. */}
      {onActivate ? (
        <button
          type="button"
          onClick={handleActivate}
          className="col-span-2 grid min-h-11 grid-cols-[64px_1fr] items-start gap-2 rounded-sm text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-trace sm:gap-3"
          aria-label={`Select capture ${stage}: ${capture.eyebrow}`}
        >
          <RowBody
            stage={stage}
            capture={capture}
            active={active}
            missing={missing}
            showOutput={showOutput}
            transcribeKey={transcribeKey}
          />
        </button>
      ) : (
        <div className="col-span-2 grid min-h-11 grid-cols-[64px_1fr] items-start gap-2 sm:gap-3">
          <RowBody
            stage={stage}
            capture={capture}
            active={active}
            missing={missing}
            showOutput={showOutput}
            transcribeKey={transcribeKey}
          />
        </div>
      )}
    </div>
  )
}

function RowBody({ stage, capture, active, missing, showOutput, transcribeKey }) {
  return (
    <>
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
                 L→R across the text width (~280ms).
              2. row-paste-text — the text behind briefly turns
                 trace + soft glow, then settles back to ink.
            Both are keyed by `transcribeKey` so each fire replays. */}
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

        {showOutput && (
          <p className="mt-1.5 flex items-center gap-2 text-[12px] text-ink-dim">
            <span className="text-trace" style={TRACE_GLOW_SOFT}>→</span>
            <span>{capture.output}</span>
          </p>
        )}
      </div>
    </>
  )
}
