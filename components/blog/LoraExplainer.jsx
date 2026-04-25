"use client"

import { useState } from 'react'

const W = 480
const H = 220

const ranks = [4, 8, 16]

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

export default function LoraExplainer() {
  const [rank, setRank] = useState(16)

  const fullW = 140
  const fullH = 100
  const fullX = 40
  const fullY = 60

  const aW = rank * 2.5
  const aH = fullH
  const bW = fullW
  const bH = rank * 2.5

  const gapX = 60
  const aX = fullX + fullW + gapX
  const aY = fullY
  const bX = aX + aW + 20
  const bY = fullY + (fullH - bH) / 2

  const frozenParams = (fullW / 2.5) * (fullH / 2.5)
  const loraParams = ((aW / 2.5) * (aH / 2.5)) + ((bW / 2.5) * (bH / 2.5))
  const pctParams = ((loraParams / frozenParams) * 100).toFixed(1)

  return (
    <div className="not-prose my-8 rounded-lg border border-edge-dim bg-canvas-alt p-5">
      {/* Rank selector */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">LoRA rank:</span>
        {ranks.map(r => (
          <button
            key={r}
            onClick={() => setRank(r)}
            className={`text-xs font-mono px-2 py-0.5 rounded transition-all border ${
              rank === r
                ? 'border-trace text-trace font-medium'
                : 'border-edge-dim text-ink-faint hover:text-ink-muted hover:border-edge'
            }`}
            style={
              rank === r
                ? {
                    background: 'color-mix(in oklab, var(--trace) 12%, transparent)',
                    boxShadow: '0 0 8px var(--trace-glow)',
                  }
                : undefined
            }
          >
            {r}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-lg">
        {/* Full weight matrix - frozen */}
        <rect
          x={fullX} y={fullY} width={fullW} height={fullH}
          rx="3"
          fill="color-mix(in oklab, var(--ink-faint) 25%, transparent)"
          stroke="var(--edge)"
          strokeWidth="1"
        />
        <text
          x={fullX + fullW / 2} y={fullY + fullH / 2 - 6}
          textAnchor="middle"
          fill="var(--ink-muted)"
          fontSize="11" fontFamily="ui-monospace, monospace"
        >
          W
        </text>
        <text
          x={fullX + fullW / 2} y={fullY + fullH / 2 + 10}
          textAnchor="middle"
          fill="var(--ink-faint)"
          fontSize="9" fontFamily="ui-monospace, monospace"
        >
          frozen
        </text>

        {/* Dimension labels for W */}
        <text x={fullX + fullW / 2} y={fullY - 8} textAnchor="middle"
          fill="var(--ink-faint)" fontSize="8" fontFamily="ui-monospace, monospace">
          d_out
        </text>
        <text x={fullX - 8} y={fullY + fullH / 2 + 3} textAnchor="end"
          fill="var(--ink-faint)" fontSize="8" fontFamily="ui-monospace, monospace">
          d_in
        </text>

        {/* Plus sign */}
        <text
          x={fullX + fullW + gapX / 2} y={fullY + fullH / 2 + 4}
          textAnchor="middle"
          fill="var(--ink-faint)"
          fontSize="16"
        >
          +
        </text>

        {/* Matrix A - tall and narrow */}
        <rect
          x={aX} y={aY} width={aW} height={aH}
          rx="3"
          fill="color-mix(in oklab, var(--trace) 30%, transparent)"
          stroke="var(--trace)"
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
        />
        <text
          x={aX + aW / 2} y={aY + aH / 2 + 4}
          textAnchor="middle"
          fill="var(--trace)"
          fontSize="10" fontFamily="ui-monospace, monospace"
        >
          A
        </text>

        {/* Multiply sign */}
        <text
          x={aX + aW + 10} y={aY + aH / 2 + 4}
          textAnchor="middle"
          fill="var(--ink-faint)"
          fontSize="12"
        >
          x
        </text>

        {/* Matrix B - wide and short */}
        <rect
          x={bX} y={bY} width={bW} height={bH}
          rx="3"
          fill="color-mix(in oklab, var(--trace) 30%, transparent)"
          stroke="var(--trace)"
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
        >
        </rect>
        <text
          x={bX + bW / 2} y={bY + bH / 2 + 4}
          textAnchor="middle"
          fill="var(--trace)"
          fontSize="10" fontFamily="ui-monospace, monospace"
        >
          B
        </text>

        {/* Rank label on A */}
        <text x={aX + aW / 2} y={aY - 8} textAnchor="middle"
          fill="var(--trace)" fontSize="8" fontFamily="ui-monospace, monospace">
          r={rank}
        </text>

        {/* Rank label on B */}
        <text x={bX - 8} y={bY + bH / 2 + 3} textAnchor="end"
          fill="var(--trace)" fontSize="8" fontFamily="ui-monospace, monospace">
          r={rank}
        </text>

        {/* Labels */}
        <text x={fullX + fullW / 2} y={fullY + fullH + 20} textAnchor="middle"
          fill="var(--ink-faint)" fontSize="9" fontFamily="ui-monospace, monospace">
          Original weights
        </text>
        <text x={(aX + bX + bW) / 2} y={aY + aH + 20} textAnchor="middle"
          fill="var(--trace)" fontSize="9" fontFamily="ui-monospace, monospace">
          LoRA adapter (trainable)
        </text>
      </svg>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Trainable params</div>
          <div
            className="text-sm font-mono font-medium text-trace tabular-nums"
            style={TRACE_GLOW_SOFT}
          >
            {pctParams}%
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Rank</div>
          <div className="text-sm font-mono font-medium text-ink tabular-nums">{rank}</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Approach</div>
          <div className="text-sm font-mono font-medium text-ink">
            {rank <= 4 ? 'Minimal' : rank <= 8 ? 'Conservative' : 'Standard'}
          </div>
        </div>
      </div>
    </div>
  )
}
