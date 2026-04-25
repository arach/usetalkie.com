"use client"

import { Check } from 'lucide-react'

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

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
              done ? 'border-trace/40' : 'border-dashed border-edge bg-canvas-alt/50 opacity-70'
            }`}
            style={
              done
                ? {
                    background: 'color-mix(in oklab, var(--trace) 7%, transparent)',
                    boxShadow:
                      'inset 0 0 0 1px color-mix(in oklab, var(--trace) 28%, transparent), 0 0 14px color-mix(in oklab, var(--trace-glow) 50%, transparent)',
                  }
                : undefined
            }
          >
            <div className="flex items-center gap-2 mb-2">
              {done && (
                <Check
                  className="w-3.5 h-3.5 text-trace"
                  style={TRACE_GLOW_SOFT}
                />
              )}
              <span
                className={`text-sm font-semibold ${
                  done ? 'text-trace' : 'text-ink-muted'
                }`}
                style={done ? TRACE_GLOW_SOFT : undefined}
              >
                {name}
              </span>
            </div>
            <div className="text-[11px] font-mono space-y-0.5">
              <div className="text-ink-muted truncate">
                {example[0]}
              </div>
              <div
                className={`truncate ${done ? 'text-trace' : 'text-ink-subtle'}`}
                style={done ? TRACE_GLOW_SOFT : undefined}
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
