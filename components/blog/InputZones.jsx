"use client"

import { useState } from 'react'
import { Cog, Cpu, AlertTriangle } from 'lucide-react'

const examples = [
  {
    zone: 'clean',
    label: 'Processor handles it',
    icon: Cog,
    color: 'emerald',
    input: 'chmod space seven five five space slash etc slash nginx dot conf',
    tokens: [
      { text: 'chmod', ok: true },
      { text: ' ', ok: true },
      { text: 'space', ok: true },
      { text: ' ', ok: true },
      { text: 'seven', ok: true },
      { text: ' ', ok: true },
      { text: 'five', ok: true },
      { text: ' ', ok: true },
      { text: 'five', ok: true },
      { text: ' ', ok: true },
      { text: 'space', ok: true },
      { text: ' ', ok: true },
      { text: 'slash', ok: true },
      { text: ' ', ok: true },
      { text: 'etc', ok: true },
      { text: ' ', ok: true },
      { text: 'slash', ok: true },
      { text: ' ', ok: true },
      { text: 'nginx', ok: true },
      { text: ' ', ok: true },
      { text: 'dot', ok: true },
      { text: ' ', ok: true },
      { text: 'conf', ok: true },
    ],
    output: 'chmod 755 /etc/nginx.conf',
    desc: 'Every token is a known keyword or literal. Deterministic substitution works perfectly.',
  },
  {
    zone: 'middle',
    label: 'The middle zone',
    icon: AlertTriangle,
    color: 'amber',
    input: 'chmod space seven five five space forward slash etsy forward slash nginx dot conf',
    tokens: [
      { text: 'chmod', ok: true },
      { text: ' ', ok: true },
      { text: 'space', ok: true },
      { text: ' ', ok: true },
      { text: 'seven', ok: true },
      { text: ' ', ok: true },
      { text: 'five', ok: true },
      { text: ' ', ok: true },
      { text: 'five', ok: true },
      { text: ' ', ok: true },
      { text: 'space', ok: true },
      { text: ' ', ok: true },
      { text: 'forward', ok: true },
      { text: ' ', ok: true },
      { text: 'slash', ok: true },
      { text: ' ', ok: true },
      { text: 'etsy', ok: false },
      { text: ' ', ok: true },
      { text: 'forward', ok: true },
      { text: ' ', ok: true },
      { text: 'slash', ok: true },
      { text: ' ', ok: true },
      { text: 'nginx', ok: true },
      { text: ' ', ok: true },
      { text: 'dot', ok: true },
      { text: ' ', ok: true },
      { text: 'conf', ok: true },
    ],
    output: 'chmod 755 /etsy/nginx.conf',
    correct: 'chmod 755 /etc/nginx.conf',
    desc: 'Protocol-formatted, so it looks clean. But "etsy" is a Whisper transcription error for "/etc". A processor outputs the wrong path silently.',
  },
  {
    zone: 'messy',
    label: 'Model needed',
    icon: Cpu,
    color: 'blue',
    input: 'change permissions to seven fifty five on the nginx config in etsy',
    tokens: [
      { text: 'change', ok: null },
      { text: ' ', ok: null },
      { text: 'permissions', ok: null },
      { text: ' ', ok: null },
      { text: 'to', ok: null },
      { text: ' ', ok: null },
      { text: 'seven', ok: null },
      { text: ' ', ok: null },
      { text: 'fifty', ok: null },
      { text: ' ', ok: null },
      { text: 'five', ok: null },
      { text: ' ', ok: null },
      { text: 'on', ok: null },
      { text: ' ', ok: null },
      { text: 'the', ok: null },
      { text: ' ', ok: null },
      { text: 'nginx', ok: null },
      { text: ' ', ok: null },
      { text: 'config', ok: null },
      { text: ' ', ok: null },
      { text: 'in', ok: null },
      { text: ' ', ok: null },
      { text: 'etsy', ok: false },
    ],
    output: 'chmod 755 /etc/nginx.conf',
    desc: 'Natural language with a transcription error. Needs a model to interpret "seven fifty five" as 755, resolve "nginx config", and correct "etsy" to /etc.',
  },
]

const colorMap = {
  emerald: {
    border: 'border-emerald-500/40 dark:border-emerald-500/25',
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    badge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50',
    icon: 'text-emerald-600 dark:text-emerald-400',
    output: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    border: 'border-amber-500/40 dark:border-amber-500/25',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    badge: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50',
    icon: 'text-amber-500 dark:text-amber-400',
    output: 'text-amber-600 dark:text-amber-400',
  },
  blue: {
    border: 'border-blue-500/40 dark:border-blue-500/25',
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    badge: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50',
    icon: 'text-blue-600 dark:text-blue-400',
    output: 'text-blue-600 dark:text-blue-400',
  },
}

export default function InputZones() {
  const [active, setActive] = useState(1)
  const ex = examples[active]
  const colors = colorMap[ex.color]
  const Icon = ex.icon

  return (
    <div className="not-prose my-8">
      {/* Tab buttons */}
      <div className="flex gap-1 mb-3">
        {examples.map((e, i) => {
          const c = colorMap[e.color]
          return (
            <button
              key={e.zone}
              onClick={() => setActive(i)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded transition-all ${
                active === i
                  ? `${c.badge} font-medium`
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400'
              }`}
            >
              {e.zone}
            </button>
          )
        })}
      </div>

      {/* Card */}
      <div className={`rounded-lg border ${colors.border} ${colors.bg} p-4`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-4 h-4 ${colors.icon}`} />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{ex.label}</span>
        </div>

        {/* Input with token highlighting */}
        <div className="mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Input</span>
          <div className="mt-1 font-mono text-sm leading-relaxed">
            {ex.tokens.filter(t => t.text !== ' ').map((t, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className={
                  t.ok === false
                    ? 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-0.5 rounded'
                    : t.ok === null
                    ? 'text-zinc-500 dark:text-zinc-400'
                    : 'text-zinc-700 dark:text-zinc-300'
                }>
                  {t.text}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Output</span>
          <div className={`mt-1 font-mono text-sm ${
            ex.correct ? 'text-red-500 dark:text-red-400 line-through' : colors.output
          }`}>
            {ex.output}
          </div>
          {ex.correct && (
            <div className={`font-mono text-sm mt-0.5 ${colors.output}`}>
              {ex.correct} <span className="text-xs text-zinc-400">(needs model)</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{ex.desc}</p>
      </div>
    </div>
  )
}
