"use client"

import { useState } from 'react'

const models = [
  {
    name: 'Qwen2.5-1.5B',
    params: '1.5B',
    type: 'text-only',
    exact: null,
    effective: 97,
    training: 'MLX, local',
    color: 'emerald',
    note: 'Part 1 baseline. Highest effective accuracy.',
  },
  {
    name: 'Qwen3.5-2B',
    params: '2B',
    type: 'VLM',
    exact: 79.2,
    effective: null,
    training: 'Unsloth, Colab T4',
    color: 'zinc',
    note: 'Partial eval (510/630 cases). Multimodal overhead, session timed out before completion.',
    partial: true,
  },
  {
    name: 'Qwen3-1.7B',
    params: '1.7B',
    type: 'text-only',
    exact: 67.8,
    effective: 93.3,
    training: 'MLX, Mac Mini M4',
    color: 'blue',
    note: 'Shipped model. Full parameter budget on text, 10 minutes to train.',
  },
]

const colorMap = {
  emerald: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/40 dark:border-emerald-500/25',
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    badge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50',
  },
  blue: {
    bar: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/40 dark:border-blue-500/25',
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    badge: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50',
  },
  zinc: {
    bar: 'bg-zinc-400 dark:bg-zinc-500',
    text: 'text-zinc-600 dark:text-zinc-400',
    border: 'border-zinc-300 dark:border-zinc-700',
    bg: 'bg-zinc-50 dark:bg-zinc-800/50',
    badge: 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800',
  },
}

export default function ModelComparison() {
  const [active, setActive] = useState(null)
  const [metric, setMetric] = useState('effective')

  return (
    <div className="not-prose my-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5">
      {/* Metric toggle */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">Showing:</span>
        {['effective', 'exact'].map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`text-[11px] font-mono px-2 py-0.5 rounded transition-all ${
              metric === m
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400'
            }`}
          >
            {m === 'effective' ? 'Effective accuracy' : 'Exact match'}
          </button>
        ))}
      </div>

      {/* Model bars */}
      <div className="space-y-3">
        {models.map((model, i) => {
          const colors = colorMap[model.color]
          const value = metric === 'effective' ? model.effective : model.exact
          const isActive = active === i

          return (
            <div
              key={model.name}
              className={`rounded-lg border p-3 cursor-default transition-all ${
                isActive ? `${colors.border} ${colors.bg}` : 'border-transparent'
              }`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {model.name}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${colors.badge}`}>
                    {model.type}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{model.params}</span>
                </div>
                <span className={`text-sm font-mono font-medium ${colors.text}`}>
                  {value != null ? `${value}%` : '—'}
                </span>
              </div>

              {/* Bar */}
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colors.bar} ${
                    value == null ? 'opacity-20' : ''
                  }`}
                  style={{ width: `${value ?? 0}%` }}
                />
              </div>

              {/* Detail on hover */}
              {isActive && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{model.note}</p>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-3">{model.training}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
