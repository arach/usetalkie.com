"use client"

const segments = [
  { label: 'Exact match', pct: 76.2, color: 'bg-emerald-500', dot: 'bg-emerald-500' },
  { label: 'Near match (>90%)', pct: 21.0, color: 'bg-emerald-300 dark:bg-emerald-700', dot: 'bg-emerald-300 dark:bg-emerald-700' },
  { label: 'Partial (70–90%)', pct: 2.4, color: 'bg-amber-400', dot: 'bg-amber-400' },
  { label: 'Wrong (<70%)', pct: 0.5, color: 'bg-red-500', dot: 'bg-red-500' },
]

export default function AccuracyBar() {
  return (
    <div className="not-prose my-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5">
      <div className="flex h-7 w-full rounded-full overflow-hidden">
        {segments.map(({ label, pct, color }) => (
          <div
            key={label}
            className={`${color} relative group`}
            style={{ width: `${pct}%` }}
            title={`${label}: ${pct}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {segments.map(({ label, pct, dot }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              {label}{' '}
              <span className="font-mono text-zinc-500">{pct}%</span>
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-sm mt-4">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">97.1%</span>
        <span className="text-zinc-500"> effective accuracy</span>
      </p>
    </div>
  )
}
