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
            className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-4 px-3"
          >
            <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500 mb-1" />
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {value}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 text-center">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
        Trained on a Mac Mini M4. Runs on-device, offline.
      </p>
    </div>
  )
}
