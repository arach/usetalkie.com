"use client"

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }
const TRACE_FILL = { background: 'var(--trace)' }
const TRACE_FILL_DIM = { background: 'color-mix(in oklab, var(--trace) 45%, var(--canvas))' }

const segments = [
  { label: 'Exact match', pct: 76.2, style: TRACE_FILL },
  { label: 'Near match (>90%)', pct: 21.0, style: TRACE_FILL_DIM },
  { label: 'Partial (70–90%)', pct: 2.4, className: 'bg-amber-400/80' },
  { label: 'Wrong (<70%)', pct: 0.5, className: 'bg-red-500/80' },
]

export default function AccuracyBar() {
  return (
    <div className="not-prose my-8 rounded-lg border border-edge-dim bg-canvas-alt p-5">
      <div className="flex h-7 w-full rounded-full overflow-hidden border border-edge-dim">
        {segments.map(({ label, pct, style, className }) => (
          <div
            key={label}
            className={`relative group ${className ?? ''}`}
            style={{ width: `${pct}%`, ...(style ?? {}) }}
            title={`${label}: ${pct}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {segments.map(({ label, pct, style, className }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${className ?? ''}`}
              style={style ?? undefined}
            />
            <span className="text-xs text-ink-muted">
              {label}{' '}
              <span className="font-mono text-ink-faint tabular-nums">{pct}%</span>
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-sm mt-4">
        <span
          className="font-mono font-semibold text-trace tabular-nums"
          style={TRACE_GLOW_SOFT}
        >
          97.1%
        </span>
        <span className="text-ink-faint"> effective accuracy</span>
      </p>
    </div>
  )
}
