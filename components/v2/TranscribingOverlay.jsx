"use client"

/**
 * TranscribingOverlay — the post-audio "engine working" indicator.
 *
 * Sits absolute-positioned over the LiveTrace area while the trace is
 * frozen (last waveform held on screen as a still frame). Reads as
 * "the live view has finished, the engine is now turning that signal
 * into text." Mono eyebrow text + a 3-dot phosphor pulse — the dots
 * are offset so they read as a typing indicator, more on-brand for
 * the oscilloscope canvas than a blinking cursor would be.
 *
 * Visibility is controlled by the `show` prop (parent toggles with
 * captionPhase === 'transcribing'). Self-fades via a CSS transition
 * on opacity so we don't need a key trick — the parent is free to
 * leave us mounted across the beat.
 *
 * Honors prefers-reduced-motion: dots stop pulsing but the pill
 * itself still appears (the engine-state cue is still useful with
 * motion off).
 */
export default function TranscribingOverlay({ show }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 0.22s ease-out',
      }}
    >
      <div
        className="flex items-center gap-2.5 rounded-sm border border-edge bg-canvas-overlay/85 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.26em] text-trace backdrop-blur-md"
        style={{
          textShadow: '0 0 4px var(--trace-glow)',
          boxShadow: '0 0 18px color-mix(in oklab, var(--trace-glow) 35%, transparent)',
        }}
      >
        <span>TRANSCRIBING</span>
        <span className="flex items-center gap-[3px]">
          <span
            className="transcribing-dot inline-block h-[5px] w-[5px] rounded-full bg-trace"
            style={{ boxShadow: '0 0 4px var(--trace-glow)', animationDelay: '0ms' }}
          />
          <span
            className="transcribing-dot inline-block h-[5px] w-[5px] rounded-full bg-trace"
            style={{ boxShadow: '0 0 4px var(--trace-glow)', animationDelay: '160ms' }}
          />
          <span
            className="transcribing-dot inline-block h-[5px] w-[5px] rounded-full bg-trace"
            style={{ boxShadow: '0 0 4px var(--trace-glow)', animationDelay: '320ms' }}
          />
        </span>
      </div>
    </div>
  )
}
