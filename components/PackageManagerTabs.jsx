"use client"
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * v2 PackageManagerTabs — client island.
 *
 * Why client: tab switching + clipboard copy state need useState; nothing else
 * in the v2 download surface owns this interaction.
 *
 * Theme is fully token-driven. Inline `style` only for CSS-var refs the
 * Tailwind config does not yet expose (--trace-glow, color-mix gradient).
 */

const MANAGERS = [
  { id: 'bun',  label: 'bun',  command: 'bun add -g @talkie/app' },
  { id: 'npm',  label: 'npm',  command: 'npm install -g @talkie/app' },
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add -g @talkie/app' },
  { id: 'yarn', label: 'yarn', command: 'yarn global add @talkie/app' },
]

export default function PackageManagerTabs({ className = '' }) {
  const [active, setActive] = useState('bun')
  const [copied, setCopied] = useState(false)

  const current = MANAGERS.find((m) => m.id === active) ?? MANAGERS[0]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <div className={className}>
      {/* Tab strip */}
      <div className="flex items-center gap-1 border-b border-edge-faint">
        {MANAGERS.map((m) => {
          const isActive = m.id === active
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setActive(m.id)
                setCopied(false)
              }}
              className={`relative -mb-px px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                isActive
                  ? 'text-trace'
                  : 'text-ink-faint hover:text-ink-muted'
              }`}
              style={
                isActive
                  ? { textShadow: '0 0 4px var(--trace-glow)' }
                  : undefined
              }
            >
              {m.label}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px block h-px bg-trace"
                  style={{ boxShadow: '0 0 6px var(--trace-glow)' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Command surface */}
      <button
        type="button"
        onClick={handleCopy}
        title="Click to copy"
        className="group mt-2 flex w-full items-center justify-between gap-3 rounded-sm border border-edge bg-canvas-alt px-3 py-2.5 text-left transition-colors hover:border-trace"
      >
        <span className="flex min-w-0 items-center gap-2 font-mono text-[12px]">
          <span aria-hidden className="select-none text-trace">&gt;</span>
          <span className="truncate text-ink">{current.command}</span>
        </span>
        <span className="flex flex-shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle group-hover:text-trace">
          {copied ? (
            <>
              <Check className="h-3 w-3 text-trace" />
              <span className="text-trace">copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>copy</span>
            </>
          )}
        </span>
      </button>
    </div>
  )
}
