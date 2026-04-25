"use client"

import { Cog, Cpu, ShieldCheck, ArrowDown } from 'lucide-react'

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

const stages = [
  {
    icon: Cog,
    name: 'Preprocessor',
    badge: 'Deterministic Code',
    description: 'Symbol + digit expansion. No model involved.',
    example: ['"find dot dash name star dot txt"', '"find . - name * . txt"'],
    highlight: false,
  },
  {
    icon: Cpu,
    name: 'Fine-tuned LM',
    badge: '1.5B, LoRA',
    description: 'Structural reasoning — spacing, quoting, grouping.',
    example: ['"find . - name * . txt"', 'find . -name *.txt'],
    highlight: true,
  },
  {
    icon: ShieldCheck,
    name: 'Post-processor',
    badge: 'Deterministic Code',
    description: 'Repetition guard, balanced quotes, sanity checks.',
    example: ['find . -name *.txt', 'find . -name *.txt  ✓'],
    highlight: false,
  },
]

function Arrow() {
  return (
    <div className="flex justify-center py-1">
      <ArrowDown className="w-4 h-4 text-ink-subtle" />
    </div>
  )
}

export default function PipelineFlow() {
  return (
    <div className="not-prose my-8">
      {/* Input badge */}
      <div className="flex justify-center mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint bg-canvas-alt border border-edge-dim px-2 py-0.5 rounded">
          Voice input
        </span>
      </div>

      <Arrow />

      {stages.map((stage, i) => {
        const Icon = stage.icon
        return (
          <div key={stage.name}>
            <div
              className={`rounded-lg border p-4 ${
                stage.highlight ? 'border-trace/40' : 'border-edge-dim bg-canvas-alt'
              }`}
              style={
                stage.highlight
                  ? {
                      background: 'color-mix(in oklab, var(--trace) 7%, transparent)',
                      boxShadow:
                        'inset 0 0 0 1px color-mix(in oklab, var(--trace) 28%, transparent), 0 0 14px color-mix(in oklab, var(--trace-glow) 50%, transparent)',
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    stage.highlight ? 'text-trace' : 'text-ink-subtle'
                  }`}
                  style={stage.highlight ? TRACE_GLOW_SOFT : undefined}
                />
                <span className="font-semibold text-sm text-ink">
                  {stage.name}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] px-1.5 py-0.5 rounded border ${
                    stage.highlight
                      ? 'text-trace border-trace/30'
                      : 'text-ink-faint border-edge-dim bg-canvas'
                  }`}
                  style={stage.highlight ? TRACE_GLOW_SOFT : undefined}
                >
                  {stage.badge}
                </span>
              </div>
              <p className="text-xs text-ink-muted mb-3">
                {stage.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto">
                <span className="text-ink-muted whitespace-nowrap">
                  {stage.example[0]}
                </span>
                <span className="text-ink-subtle">→</span>
                <span
                  className={`whitespace-nowrap ${
                    stage.highlight ? 'text-trace' : 'text-ink'
                  }`}
                  style={stage.highlight ? TRACE_GLOW_SOFT : undefined}
                >
                  {stage.example[1]}
                </span>
              </div>
            </div>
            {i < stages.length - 1 && <Arrow />}
          </div>
        )
      })}

      <Arrow />

      {/* Output badge */}
      <div className="flex justify-center mt-2">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-trace border border-trace/30 px-2 py-0.5 rounded"
          style={{
            ...TRACE_GLOW_SOFT,
            background: 'color-mix(in oklab, var(--trace) 7%, transparent)',
          }}
        >
          Reconstructed command
        </span>
      </div>
    </div>
  )
}
