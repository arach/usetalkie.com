"use client"
import { useState } from 'react'

const MANAGERS = [
  { id: 'bun',  label: 'bun',  command: 'bun add -g @talkie/app' },
  { id: 'npm',  label: 'npm',  command: 'npm install -g @talkie/app' },
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add -g @talkie/app' },
  { id: 'yarn', label: 'yarn', command: 'yarn global add @talkie/app' },
]

export default function PackageManagerTabs({ className = '' }) {
  const [active, setActive] = useState('bun')
  const [copied, setCopied] = useState(null)

  const handleCopy = async (command, id) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch {}
  }

  const current = MANAGERS.find((m) => m.id === active)

  return (
    <div className={className}>
      {/* Tab strip */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {MANAGERS.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
              active === m.id
                ? 'bg-zinc-800 text-white dark:bg-white dark:text-black'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Command */}
      <button
        onClick={() => handleCopy(current.command, current.id)}
        className="group w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm text-left transition-colors hover:border-emerald-500/60 cursor-pointer shadow-inner"
        title="Click to copy"
      >
        <span className="text-emerald-500 font-bold select-none">&gt; </span>
        <span className="text-zinc-100">{current.command}</span>
        <span className="float-right text-[10px] font-sans uppercase tracking-wider text-zinc-500 group-hover:text-emerald-400 transition-colors ml-4">
          {copied === current.id ? '✓ copied' : 'copy'}
        </span>
      </button>
    </div>
  )
}
