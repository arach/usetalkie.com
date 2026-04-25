import React from 'react'
import { Keyboard, Mic, Cpu, Send, ArrowRight } from 'lucide-react'

/**
 * MacHowItWorks — four-stage signal-flow diagram.
 *
 * Hotkey -> Voice -> Transcribe -> Paste, rendered as a horizontal
 * chain on desktop and a vertical stack on mobile. Connectors carry
 * a CSS-only traveling dot in dark mode (graticule colors auto-flip
 * via CSS vars, so no JS theme detection is required).
 */
const STAGES = [
  { n: '01', icon: Keyboard, label: 'Hotkey',     desc: 'Hold to talk',         sub: 'CH-01 · TRIGGER' },
  { n: '02', icon: Mic,      label: 'Voice',      desc: 'Speak naturally',      sub: 'CH-02 · INPUT'   },
  { n: '03', icon: Cpu,      label: 'Transcribe', desc: 'On-device Whisper',    sub: 'CH-03 · PROCESS' },
  { n: '04', icon: Send,     label: 'Paste',      desc: 'Smart routing',        sub: 'CH-04 · OUTPUT'  },
]

export default function MacHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-t border-edge-faint bg-canvas-alt font-mono"
    >
      {/* Section graticule */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        <div className="max-w-3xl">
          <p
            className="text-[10px] uppercase tracking-[0.26em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · SIGNAL FLOW
          </p>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            The four-step path.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Four stages, one loop — hotkey, voice, transcribe, paste. The whole chain takes about a second, and the cursor lands right back where it started.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Mobile: vertical stack */}
          <div className="flex flex-col gap-3 md:hidden">
            {STAGES.map((stage, i) => (
              <React.Fragment key={stage.n}>
                <StageCard stage={stage} />
                {i < STAGES.length - 1 && (
                  <div className="mx-auto flex h-6 w-full items-center justify-center" aria-hidden>
                    <div className="flex items-center gap-2">
                      <span className="block h-px w-8 bg-trace opacity-40" />
                      <ArrowRight className="h-3 w-3 rotate-90 text-trace" />
                      <span className="block h-px w-8 bg-trace opacity-40" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Desktop: horizontal flow */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-3">
            <StageCard stage={STAGES[0]} />
            <Connector delay={0} />
            <StageCard stage={STAGES[1]} />
            <Connector delay={0.6} />
            <StageCard stage={STAGES[2]} />
            <Connector delay={1.2} />
            <StageCard stage={STAGES[3]} />
          </div>
        </div>

        <p className="mt-10 text-center text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
          · loop time ≈ 1s · on-device · no cloud round-trip ·
        </p>
      </div>

      {/* Traveling-dot keyframes (dark mode dot only; CSS vars handle theming) */}
      <style>{`
        @keyframes osc-flow-dot {
          0%   { left: -8%; opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { left: 108%; opacity: 0; }
        }
        .osc-flow-dot { display: none; }
        html.dark .osc-flow-dot { display: block; }
      `}</style>
    </section>
  )
}

function StageCard({ stage }) {
  const Icon = stage.icon
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-md border border-edge-dim bg-surface p-4 md:p-5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          <span>{stage.sub}</span>
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-trace"
            style={{ boxShadow: '0 0 4px var(--trace)' }}
          />
        </div>

        <div
          className="mt-4 font-display text-[11px] tracking-[0.2em] text-trace"
          style={{ textShadow: '0 0 4px var(--trace-glow)' }}
        >
          {stage.n}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-edge"
            style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
          >
            <Icon
              className="h-4 w-4 text-trace"
              style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
            />
          </div>
          <h3 className="font-display text-xl tracking-[-0.01em] text-ink">{stage.label}</h3>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{stage.desc}</p>
      </div>
    </div>
  )
}

function Connector({ delay }) {
  return (
    <div
      className="relative flex items-center self-center"
      style={{ width: '44px', height: '100%' }}
      aria-hidden
    >
      <span className="block h-px w-full bg-trace opacity-40" />
      <ArrowRight
        className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-trace"
        style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
      />
      <span
        className="osc-flow-dot absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-trace"
        style={{
          boxShadow: '0 0 6px var(--trace)',
          animation: `osc-flow-dot 2.4s linear ${delay}s infinite`,
          left: '-8%',
        }}
      />
    </div>
  )
}
