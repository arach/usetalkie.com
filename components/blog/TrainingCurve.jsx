"use client"

// Data from the article's training table
const data = [
  { iter: 200, train: 0.337, val: 0.213 },
  { iter: 400, train: 0.108, val: 0.204 },
  { iter: 600, train: 0.068, val: 0.137 },
  { iter: 800, train: 0.049, val: 0.109 },
  { iter: 1000, train: 0.052, val: 0.137 },
]

// Chart dimensions
const W = 480
const H = 200
const PAD = { top: 20, right: 20, bottom: 30, left: 45 }
const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom

function scaleX(iter) {
  return PAD.left + ((iter - 200) / 800) * plotW
}

function scaleY(loss) {
  const maxLoss = 0.4
  return PAD.top + (1 - loss / maxLoss) * plotH
}

function polyline(data, key) {
  return data.map(d => `${scaleX(d.iter)},${scaleY(d[key])}`).join(' ')
}

export default function TrainingCurve() {
  const bestPoint = data[3] // iter 800
  const yTicks = [0, 0.1, 0.2, 0.3, 0.4]

  return (
    <div className="not-prose my-8 rounded-lg border border-edge-dim bg-canvas-alt p-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Training and validation loss curve">
        {/* Y axis ticks */}
        {yTicks.map(t => (
          <g key={t}>
            <line
              x1={PAD.left}
              y1={scaleY(t)}
              x2={PAD.left + plotW}
              y2={scaleY(t)}
              stroke="var(--edge-dim)"
              strokeWidth="0.5"
            />
            <text
              x={PAD.left - 8}
              y={scaleY(t) + 3}
              textAnchor="end"
              fill="var(--ink-muted)"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
            >
              {t.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {data.map(d => (
          <text
            key={d.iter}
            x={scaleX(d.iter)}
            y={H - 6}
            textAnchor="middle"
            fill="var(--ink-muted)"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
          >
            {d.iter}
          </text>
        ))}

        {/* Train loss line — primary trace */}
        <polyline
          points={polyline(data, 'train')}
          fill="none"
          stroke="var(--trace)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
        />

        {/* Val loss line — semantic warning kept as amber */}
        <polyline
          points={polyline(data, 'val')}
          fill="none"
          className="stroke-amber-400/80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 3"
        />

        {/* Best checkpoint dot + label */}
        <circle
          cx={scaleX(bestPoint.iter)}
          cy={scaleY(bestPoint.val)}
          r="4"
          fill="var(--trace)"
          style={{ filter: 'drop-shadow(0 0 6px var(--trace-glow))' }}
        />
        <text
          x={scaleX(bestPoint.iter) + 8}
          y={scaleY(bestPoint.val) - 8}
          fill="var(--trace)"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
        >
          best checkpoint
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-0.5 rounded"
            style={{ background: 'var(--trace)', boxShadow: '0 0 4px var(--trace-glow)' }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Train loss</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-amber-400/80 rounded" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Val loss</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--trace)', boxShadow: '0 0 6px var(--trace)' }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Iter 800</span>
        </div>
      </div>
    </div>
  )
}
