"use client"

import { useState } from 'react'

const TRACE = 'var(--trace)'
const TRACE_DIM = 'color-mix(in oklab, var(--trace) 50%, transparent)'
const TRACE_FAINT = 'color-mix(in oklab, var(--trace) 22%, transparent)'
const INK_FAINT = 'var(--ink-faint)'

const vlmSegments = [
  { label: 'Vision encoder', pct: 18, fill: INK_FAINT, desc: 'Processes image patches into embeddings. Unused for text-only tasks.' },
  { label: 'Projection layers', pct: 5, fill: 'color-mix(in oklab, var(--ink-faint) 60%, transparent)', desc: 'Maps vision embeddings into the language model\'s input space.' },
  { label: 'Cross-attention', pct: 12, fill: TRACE_FAINT, desc: 'Lets text tokens attend to image tokens. No-op without image input.' },
  { label: 'Text capacity', pct: 65, fill: TRACE, desc: 'The portion of parameters that actually processes your text task.' },
]

const textSegments = [
  { label: 'Text capacity', pct: 100, fill: TRACE, desc: 'Every parameter contributes to text understanding and generation.' },
]

export default function ParameterBudget() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="not-prose my-8 rounded-lg border border-edge-dim bg-canvas-alt p-5">
      {/* VLM bar */}
      <div className="mb-1">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono text-xs font-semibold text-ink">Qwen3.5-2B</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Vision-Language Model</span>
        </div>
        <div className="flex h-8 w-full rounded overflow-hidden border border-edge-dim">
          {vlmSegments.map(({ label, pct, fill }) => (
            <div
              key={label}
              className={`relative cursor-default transition-opacity ${
                hovered && hovered !== label ? 'opacity-40' : ''
              }`}
              style={{
                width: `${pct}%`,
                background: fill,
                boxShadow: fill === TRACE && (!hovered || hovered === label) ? 'inset 0 0 12px color-mix(in oklab, var(--trace-glow) 60%, transparent)' : undefined,
              }}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      {/* Text-only bar */}
      <div className="mt-4 mb-1">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono text-xs font-semibold text-ink">Qwen3-1.7B</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Text-only</span>
        </div>
        <div className="flex h-8 w-full rounded overflow-hidden border border-edge-dim">
          {textSegments.map(({ label, pct, fill }) => (
            <div
              key={label}
              className={`relative cursor-default transition-opacity ${
                hovered && hovered !== label ? 'opacity-40' : ''
              }`}
              style={{
                width: `${pct}%`,
                background: fill,
                boxShadow: !hovered || hovered === label ? 'inset 0 0 12px color-mix(in oklab, var(--trace-glow) 60%, transparent)' : undefined,
              }}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
        {vlmSegments.map(({ label, fill }) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 cursor-default transition-opacity ${
              hovered && hovered !== label ? 'opacity-40' : ''
            }`}
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0 border border-edge-dim"
              style={{ background: fill }}
            />
            <span className="text-xs text-ink-muted">{label}</span>
          </div>
        ))}
      </div>

      {/* Hover description */}
      <div className="mt-3 h-8 flex items-center">
        {hovered ? (
          <p className="text-xs text-ink-muted">
            <span className="font-medium text-ink">{hovered}:</span>{' '}
            {[...vlmSegments, ...textSegments].find(s => s.label === hovered)?.desc}
          </p>
        ) : (
          <p className="text-xs text-ink-subtle italic">Hover a segment to see what it does</p>
        )}
      </div>
    </div>
  )
}
