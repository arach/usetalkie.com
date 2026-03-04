"use client"

import { Cog, Cpu, ShieldCheck, ArrowDown } from 'lucide-react'

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
      <ArrowDown className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
    </div>
  )
}

export default function PipelineFlow() {
  return (
    <div className="not-prose my-8">
      {/* Input badge */}
      <div className="flex justify-center mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
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
                stage.highlight
                  ? 'border-emerald-500/50 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    stage.highlight
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                />
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {stage.name}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    stage.highlight
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50'
                      : 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800'
                  }`}
                >
                  {stage.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                {stage.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto">
                <span className="text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {stage.example[0]}
                </span>
                <span className="text-zinc-400 dark:text-zinc-600">→</span>
                <span
                  className={`whitespace-nowrap ${
                    stage.highlight
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}
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
        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
          Reconstructed command
        </span>
      </div>
    </div>
  )
}
