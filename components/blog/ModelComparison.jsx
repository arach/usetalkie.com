"use client"

import { useState } from 'react'

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

// Color discipline: trace = primary/best, amber = secondary/shipped, neutral = unspecified.
// All values resolve via tokens so the table flips with the canvas theme.
const models = [
  {
    name: 'Qwen2.5-1.5B',
    params: '1.5B',
    type: 'text-only',
    exact: null,
    effective: 97,
    training: 'MLX, local',
    tone: 'primary',
    note: 'Part 1 baseline. Highest effective accuracy.',
  },
  {
    name: 'Qwen3.5-2B',
    params: '2B',
    type: 'VLM',
    exact: 79.2,
    effective: null,
    training: 'Unsloth, Colab T4',
    tone: 'neutral',
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
    tone: 'secondary',
    note: 'Shipped model. Full parameter budget on text, 10 minutes to train.',
  },
]

const toneMap = {
  primary: {
    barBg: 'var(--trace)',
    barShadow: '0 0 6px var(--trace-glow)',
    text: 'text-trace',
    textGlow: TRACE_GLOW_SOFT,
    cardBg: 'color-mix(in oklab, var(--trace) 6%, transparent)',
    cardBorder: 'color-mix(in oklab, var(--trace) 35%, transparent)',
    badgeBg: 'color-mix(in oklab, var(--trace) 10%, transparent)',
    badgeColor: 'var(--trace)',
  },
  secondary: {
    barBg: 'var(--amber)',
    barShadow: '0 0 6px color-mix(in oklab, var(--amber) 50%, transparent)',
    text: 'text-amber',
    textGlow: { textShadow: '0 0 4px color-mix(in oklab, var(--amber) 35%, transparent)' },
    cardBg: 'color-mix(in oklab, var(--amber) 7%, transparent)',
    cardBorder: 'color-mix(in oklab, var(--amber) 35%, transparent)',
    badgeBg: 'color-mix(in oklab, var(--amber) 10%, transparent)',
    badgeColor: 'var(--amber)',
  },
  neutral: {
    barBg: 'color-mix(in oklab, var(--ink-faint) 50%, transparent)',
    barShadow: 'none',
    text: 'text-ink-muted',
    textGlow: undefined,
    cardBg: 'color-mix(in oklab, var(--ink-faint) 6%, transparent)',
    cardBorder: 'var(--edge)',
    badgeBg: 'color-mix(in oklab, var(--ink-faint) 12%, transparent)',
    badgeColor: 'var(--ink-muted)',
  },
}

export default function ModelComparison() {
  const [active, setActive] = useState(null)
  const [metric, setMetric] = useState('effective')

  return (
    <div className="not-prose my-8 rounded-lg border border-edge-dim bg-canvas-alt p-5">
      {/* Metric toggle */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-ink-faint">Showing:</span>
        {['effective', 'exact'].map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`text-[11px] font-mono px-2 py-0.5 rounded transition-all duration-200 border ${
              metric === m
                ? 'border-amber/50 text-amber font-medium'
                : 'border-transparent text-ink-faint hover:text-ink-muted hover:border-edge-dim'
            }`}
            style={
              metric === m
                ? { background: 'color-mix(in oklab, var(--amber) 8%, transparent)' }
                : undefined
            }
          >
            {m === 'effective' ? 'Effective accuracy' : 'Exact match'}
          </button>
        ))}
      </div>

      {/* Model bars */}
      <div className="space-y-3">
        {models.map((model, i) => {
          const c = toneMap[model.tone]
          const value = metric === 'effective' ? model.effective : model.exact
          const isActive = active === i

          return (
            <div
              key={model.name}
              className="rounded-lg border p-3 cursor-default transition-all duration-200"
              style={{
                borderColor: isActive ? c.cardBorder : 'transparent',
                background: isActive ? c.cardBg : 'transparent',
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink">
                    {model.name}
                  </span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: c.badgeBg, color: c.badgeColor }}
                  >
                    {model.type}
                  </span>
                  <span className="text-[10px] font-mono text-ink-faint">{model.params}</span>
                </div>
                <span
                  className={`text-sm font-mono font-medium ${c.text}`}
                  style={c.textGlow}
                >
                  {value != null ? `${value}%` : '—'}
                </span>
              </div>

              {/* Bar */}
              <div className="h-2 w-full rounded-full overflow-hidden border border-edge-faint" style={{ background: 'var(--canvas)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${value ?? 0}%`,
                    background: c.barBg,
                    boxShadow: c.barShadow,
                    opacity: value == null ? 0.2 : 1,
                  }}
                />
              </div>

              {/* Detail on hover */}
              {isActive && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-ink-muted">{model.note}</p>
                  <span className="text-[10px] font-mono text-ink-faint shrink-0 ml-3">{model.training}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
