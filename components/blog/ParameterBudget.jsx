"use client"

import { useState } from 'react'

const vlmSegments = [
  { label: 'Vision encoder', pct: 18, color: 'bg-zinc-400 dark:bg-zinc-600', desc: 'Processes image patches into embeddings. Unused for text-only tasks.' },
  { label: 'Projection layers', pct: 5, color: 'bg-zinc-300 dark:bg-zinc-700', desc: 'Maps vision embeddings into the language model\'s input space.' },
  { label: 'Cross-attention', pct: 12, color: 'bg-zinc-350 bg-zinc-400/70 dark:bg-zinc-600/70', desc: 'Lets text tokens attend to image tokens. No-op without image input.' },
  { label: 'Text capacity', pct: 65, color: 'bg-emerald-500', desc: 'The portion of parameters that actually processes your text task.' },
]

const textSegments = [
  { label: 'Text capacity', pct: 100, color: 'bg-emerald-500', desc: 'Every parameter contributes to text understanding and generation.' },
]

export default function ParameterBudget() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="not-prose my-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5">
      {/* VLM bar */}
      <div className="mb-1">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Qwen3.5-2B</span>
          <span className="text-[10px] font-mono text-zinc-400">Vision-Language Model</span>
        </div>
        <div className="flex h-8 w-full rounded overflow-hidden">
          {vlmSegments.map(({ label, pct, color }) => (
            <div
              key={label}
              className={`${color} relative cursor-default transition-opacity ${
                hovered && hovered !== label ? 'opacity-40' : ''
              }`}
              style={{ width: `${pct}%` }}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      {/* Text-only bar */}
      <div className="mt-4 mb-1">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Qwen3-1.7B</span>
          <span className="text-[10px] font-mono text-zinc-400">Text-only</span>
        </div>
        <div className="flex h-8 w-full rounded overflow-hidden">
          {textSegments.map(({ label, pct, color }) => (
            <div
              key={label}
              className={`${color} relative cursor-default transition-opacity ${
                hovered && hovered !== label ? 'opacity-40' : ''
              }`}
              style={{ width: `${pct}%` }}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
        {vlmSegments.map(({ label, color }) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 cursor-default transition-opacity ${
              hovered && hovered !== label ? 'opacity-40' : ''
            }`}
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${color}`} />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Hover description */}
      <div className="mt-3 h-8 flex items-center">
        {hovered ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{hovered}:</span>{' '}
            {[...vlmSegments, ...textSegments].find(s => s.label === hovered)?.desc}
          </p>
        ) : (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">Hover a segment to see what it does</p>
        )}
      </div>
    </div>
  )
}
