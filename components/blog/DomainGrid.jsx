"use client"

import { Check } from 'lucide-react'

const domains = [
  {
    name: 'Bash',
    example: ['"find dot slash"', 'find ./'],
    done: true,
  },
  {
    name: 'SQL',
    example: ['"select star from"', 'SELECT * FROM'],
    done: false,
  },
  {
    name: 'Regex',
    example: ['"caret open bracket a dash z"', '^[a-z]'],
    done: false,
  },
  {
    name: 'URLs',
    example: ['"h t t p colon slash slash"', 'http://'],
    done: false,
  },
  {
    name: 'Math',
    example: ['"x squared plus one"', 'x² + 1'],
    done: false,
  },
  {
    name: 'File Paths',
    example: ['"slash usr slash local slash bin"', '/usr/local/bin'],
    done: false,
  },
]

export default function DomainGrid() {
  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {domains.map(({ name, example, done }) => (
          <div
            key={name}
            className={`rounded-lg border p-4 ${
              done
                ? 'border-emerald-500/50 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {done && (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
              <span
                className={`text-sm font-semibold ${
                  done
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {name}
              </span>
            </div>
            <div className="text-[11px] font-mono space-y-0.5">
              <div className="text-zinc-500 dark:text-zinc-400 truncate">
                {example[0]}
              </div>
              <div
                className={`truncate ${
                  done
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                → {example[1]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
