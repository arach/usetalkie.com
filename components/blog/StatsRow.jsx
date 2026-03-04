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
            className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-5 px-4"
          >
            <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500 mb-1" />
            <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              {value}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
        On a phone. Offline. No cloud.
      </p>
    </div>
  )
}
