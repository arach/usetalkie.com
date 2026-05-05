"use client"

import { Target, HardDrive, Zap } from 'lucide-react'

const stats = [
  { value: '97%', label: 'Accuracy', icon: Target },
  { value: '3 GB', label: 'Memory', icon: HardDrive },
  { value: '0.7s', label: 'Per Command', icon: Zap },
]

export default function StatsRow() {
  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="group flex flex-col items-center gap-1 rounded-lg border border-edge-dim bg-canvas-alt py-5 px-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/40"
          >
            <Icon className="w-4 h-4 text-ink-subtle mb-1 transition-transform duration-200 group-hover:scale-110" />
            <span
              className="text-4xl font-bold text-trace font-mono tabular-nums"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              {value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-faint">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-ink-muted mt-3">
        On a phone. Offline. No cloud.
      </p>
    </div>
  )
}
