import React from 'react'
import { Code, Layers, FileText, Terminal, Mail, Search } from 'lucide-react'

/**
 * MacUseCases — 2x3 grid of "signal sample" use-case cards.
 *
 * Each card is a labeled capture: app + timestamp header, an italic
 * quoted action line, an arrow, the resulting outcome, and a small
 * amplitude bar suggesting capture length.
 */
const CASES = [
  { app: 'VS Code',  icon: Code,     time: '09:14:22', action: "Describe the bug while it's fresh", outcome: 'GitHub issue filed, not forgotten',     amplitude: 0.72 },
  { app: 'Figma',    icon: Layers,   time: '10:02:48', action: 'Voice a rough draft',               outcome: 'Your cleanup rule runs automatically',  amplitude: 0.58 },
  { app: 'Notion',   icon: FileText, time: '11:47:03', action: 'Record the meeting',                outcome: 'Your summary format, every time',       amplitude: 0.92 },
  { app: 'Terminal', icon: Terminal, time: '13:21:55', action: 'Spec out what I need',              outcome: 'Command drafted, ready to run',         amplitude: 0.45 },
  { app: 'Gmail',    icon: Mail,     time: '15:08:17', action: 'Reply, conversational tone',        outcome: 'Draft in your voice, ready to send',    amplitude: 0.64 },
  { app: 'Safari',   icon: Search,   time: '16:33:41', action: "Save this, I'll think later",       outcome: 'Tagged, searchable, back to flow',      amplitude: 0.38 },
]

export default function MacUseCases() {
  return (
    <section
      id="use-cases"
      className="relative border-t border-edge-faint bg-canvas-alt font-mono"
    >
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
            · USE CASES
          </p>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            Work is already <span className="italic text-ink-muted">happening.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Talkie sits alongside — captures attach to the app you were already in, the work stays in your flow.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <UseCaseCard key={c.app} useCase={c} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes osc-uc-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
      `}</style>
    </section>
  )
}

function UseCaseCard({ useCase, index }) {
  const Icon = useCase.icon
  const barWidth = Math.max(18, Math.round(useCase.amplitude * 100))

  return (
    <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full bg-trace"
              style={{
                boxShadow: '0 0 4px var(--trace)',
                animation: 'osc-uc-pulse 2.6s ease-in-out infinite',
                animationDelay: `${(index % 4) * 0.3}s`,
              }}
            />
            <Icon className="h-3 w-3 text-ink-faint" />
            <span className="text-ink-dim">{useCase.app.toUpperCase()}</span>
            <span className="text-ink-subtle">/</span>
            <span className="text-ink-faint">{useCase.time}</span>
          </div>
        </div>

        <p className="mt-5 font-display text-[17px] italic leading-snug tracking-[-0.01em] text-ink-muted">
          <span className="text-ink-subtle">&ldquo;</span>
          {useCase.action}
          <span className="text-ink-subtle">&rdquo;</span>
        </p>

        <div className="mt-4 flex items-center gap-2" aria-hidden>
          <span className="block h-px w-6 bg-trace opacity-40" />
          <span
            className="text-[11px] leading-none text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            →
          </span>
        </div>

        <p className="mt-3 text-[14px] font-medium leading-relaxed text-ink">{useCase.outcome}</p>

        <div className="mt-5 flex items-center gap-3">
          <span className="text-[8px] uppercase tracking-[0.22em] text-ink-subtle">AMPL</span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-sm bg-edge-subtle">
            <div
              className="absolute inset-y-0 left-0 bg-trace"
              style={{
                width: `${barWidth}%`,
                boxShadow: '0 0 6px var(--trace)',
              }}
            />
          </div>
          <span className="text-[8px] uppercase tracking-[0.22em] tabular-nums text-ink-faint">
            {String(barWidth).padStart(2, '0')}%
          </span>
        </div>
      </div>
    </div>
  )
}
