"use client"

import { useState } from 'react'

const W = 480
const H = 220

const ranks = [4, 8, 16]

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
    <div className="not-prose my-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5">
      {/* Rank selector */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">LoRA rank:</span>
        {ranks.map(r => (
          <button
            key={r}
            onClick={() => setRank(r)}
            className={`text-xs font-mono px-2 py-0.5 rounded transition-all ${
              rank === r
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400'
            }`}
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
          className="fill-zinc-200 dark:fill-zinc-700 stroke-zinc-300 dark:stroke-zinc-600"
          strokeWidth="1"
        />
        <text
          x={fullX + fullW / 2} y={fullY + fullH / 2 - 6}
          textAnchor="middle"
          className="fill-zinc-500 dark:fill-zinc-400"
          fontSize="11" fontFamily="ui-monospace, monospace"
        >
          W
        </text>
        <text
          x={fullX + fullW / 2} y={fullY + fullH / 2 + 10}
          textAnchor="middle"
          className="fill-zinc-400 dark:fill-zinc-500"
          fontSize="9" fontFamily="ui-monospace, monospace"
        >
          frozen
        </text>

        {/* Dimension labels for W */}
        <text x={fullX + fullW / 2} y={fullY - 8} textAnchor="middle"
          className="fill-zinc-400 dark:fill-zinc-500" fontSize="8" fontFamily="ui-monospace, monospace">
          d_out
        </text>
        <text x={fullX - 8} y={fullY + fullH / 2 + 3} textAnchor="end"
          className="fill-zinc-400 dark:fill-zinc-500" fontSize="8" fontFamily="ui-monospace, monospace">
          d_in
        </text>

        {/* Plus sign */}
        <text
          x={fullX + fullW + gapX / 2} y={fullY + fullH / 2 + 4}
          textAnchor="middle"
          className="fill-zinc-400 dark:fill-zinc-500"
          fontSize="16"
        >
          +
        </text>

        {/* Matrix A - tall and narrow */}
        <rect
          x={aX} y={aY} width={aW} height={aH}
          rx="3"
          className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-400 dark:stroke-emerald-600"
          strokeWidth="1.5"
        />
        <text
          x={aX + aW / 2} y={aY + aH / 2 + 4}
          textAnchor="middle"
          className="fill-emerald-700 dark:fill-emerald-300"
          fontSize="10" fontFamily="ui-monospace, monospace"
        >
          A
        </text>

        {/* Multiply sign */}
        <text
          x={aX + aW + 10} y={aY + aH / 2 + 4}
          textAnchor="middle"
          className="fill-zinc-400 dark:fill-zinc-500"
          fontSize="12"
        >
          x
        </text>

        {/* Matrix B - wide and short */}
        <rect
          x={bX} y={bY} width={bW} height={bH}
          rx="3"
          className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-400 dark:stroke-emerald-600"
          strokeWidth="1.5"
        >
        </rect>
        <text
          x={bX + bW / 2} y={bY + bH / 2 + 4}
          textAnchor="middle"
          className="fill-emerald-700 dark:fill-emerald-300"
          fontSize="10" fontFamily="ui-monospace, monospace"
        >
          B
        </text>

        {/* Rank label on A */}
        <text x={aX + aW / 2} y={aY - 8} textAnchor="middle"
          className="fill-emerald-600 dark:fill-emerald-400" fontSize="8" fontFamily="ui-monospace, monospace">
          r={rank}
        </text>

        {/* Rank label on B */}
        <text x={bX - 8} y={bY + bH / 2 + 3} textAnchor="end"
          className="fill-emerald-600 dark:fill-emerald-400" fontSize="8" fontFamily="ui-monospace, monospace">
          r={rank}
        </text>

        {/* Labels */}
        <text x={fullX + fullW / 2} y={fullY + fullH + 20} textAnchor="middle"
          className="fill-zinc-400 dark:fill-zinc-500" fontSize="9" fontFamily="ui-monospace, monospace">
          Original weights
        </text>
        <text x={(aX + bX + bW) / 2} y={aY + aH + 20} textAnchor="middle"
          className="fill-emerald-600 dark:fill-emerald-400" fontSize="9" fontFamily="ui-monospace, monospace">
          LoRA adapter (trainable)
        </text>
      </svg>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="text-center">
          <div className="text-xs text-zinc-400 dark:text-zinc-500">Trainable params</div>
          <div className="text-sm font-mono font-medium text-emerald-600 dark:text-emerald-400">{pctParams}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-zinc-400 dark:text-zinc-500">Rank</div>
          <div className="text-sm font-mono font-medium text-zinc-700 dark:text-zinc-300">{rank}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-zinc-400 dark:text-zinc-500">Approach</div>
          <div className="text-sm font-mono font-medium text-zinc-700 dark:text-zinc-300">
            {rank <= 4 ? 'Minimal' : rank <= 8 ? 'Conservative' : 'Standard'}
          </div>
        </div>
      </div>
    </div>
  )
}
