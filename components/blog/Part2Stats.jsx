"use client"

import { Target, HardDrive, Zap, Timer } from 'lucide-react'

const stats = [
  { value: '93.3%', label: 'Effective Accuracy', icon: Target },
  { value: '948 MB', label: 'Model Size', icon: HardDrive },
  { value: '10 min', label: 'Training Time', icon: Timer },
  { value: '4.8 GB', label: 'Peak Memory', icon: Zap },
]

export default function Part2Stats() {
  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="group flex flex-col items-center gap-1 rounded-lg border border-edge-dim bg-canvas-alt py-4 px-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/40"
          >
            <Icon className="w-4 h-4 text-ink-subtle mb-1 transition-transform duration-200 group-hover:scale-110" />
            <span
              className="text-2xl sm:text-3xl font-bold text-trace font-mono tabular-nums"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              {value}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-faint text-center">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-ink-muted mt-3">
        Trained on a Mac Mini M4. Runs on-device, offline.
      </p>
    </div>
  )
}
