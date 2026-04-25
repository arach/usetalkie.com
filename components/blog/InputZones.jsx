"use client"

import { useState } from 'react'
import { Cog, Cpu, AlertTriangle } from 'lucide-react'

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

const examples = [
  {
    zone: 'clean',
    label: 'Processor handles it',
    icon: Cog,
    color: 'trace',
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
    color: 'ink',
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

// Color tokens — `trace` and `ink` use phosphor/edge tokens; `amber` keeps semantic warning hue.
const colorMap = {
  trace: {
    iconClass: 'text-trace',
    iconStyle: TRACE_GLOW_SOFT,
    outputClass: 'text-trace',
    outputStyle: TRACE_GLOW_SOFT,
    badgeClass: 'text-trace border-trace/30',
    badgeStyle: { ...TRACE_GLOW_SOFT, background: 'color-mix(in oklab, var(--trace) 8%, transparent)' },
    cardStyle: {
      background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
      boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--trace) 26%, transparent)',
    },
  },
  amber: {
    iconClass: 'text-amber-400/80',
    iconStyle: undefined,
    outputClass: 'text-amber-400/90',
    outputStyle: undefined,
    badgeClass: 'text-amber-400/90 border-amber-400/30',
    badgeStyle: { background: 'color-mix(in oklab, rgb(251 191 36) 8%, transparent)' },
    cardStyle: {
      background: 'color-mix(in oklab, rgb(251 191 36) 5%, transparent)',
      boxShadow: 'inset 0 0 0 1px color-mix(in oklab, rgb(251 191 36) 26%, transparent)',
    },
  },
  ink: {
    iconClass: 'text-ink-muted',
    iconStyle: undefined,
    outputClass: 'text-ink',
    outputStyle: undefined,
    badgeClass: 'text-ink-muted border-edge',
    badgeStyle: { background: 'var(--canvas)' },
    cardStyle: undefined,
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
          const isActive = active === i
          return (
            <button
              key={e.zone}
              onClick={() => setActive(i)}
              className={`font-mono text-[11px] uppercase tracking-[0.18em] px-2.5 py-1 rounded border transition-all ${
                isActive
                  ? `${c.badgeClass} font-medium`
                  : 'text-ink-subtle border-edge-dim hover:text-ink-muted hover:border-edge'
              }`}
              style={isActive ? c.badgeStyle : undefined}
            >
              {e.zone}
            </button>
          )
        })}
      </div>

      {/* Card */}
      <div
        className="rounded-lg border border-edge-dim bg-canvas-alt p-4"
        style={colors.cardStyle}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-4 h-4 ${colors.iconClass}`} style={colors.iconStyle} />
          <span className="text-sm font-semibold text-ink">{ex.label}</span>
        </div>

        {/* Input with token highlighting */}
        <div className="mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Input</span>
          <div className="mt-1 font-mono text-sm leading-relaxed">
            {ex.tokens.filter(t => t.text !== ' ').map((t, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className={
                  t.ok === false
                    ? 'text-red-500/90 bg-red-500/15 px-0.5 rounded'
                    : t.ok === null
                    ? 'text-ink-muted'
                    : 'text-ink'
                }>
                  {t.text}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Output</span>
          <div
            className={`mt-1 font-mono text-sm ${
              ex.correct ? 'text-red-500/90 line-through' : colors.outputClass
            }`}
            style={ex.correct ? undefined : colors.outputStyle}
          >
            {ex.output}
          </div>
          {ex.correct && (
            <div className={`font-mono text-sm mt-0.5 ${colors.outputClass}`} style={colors.outputStyle}>
              {ex.correct} <span className="text-xs text-ink-subtle">(needs model)</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-ink-muted leading-relaxed">{ex.desc}</p>
      </div>
    </div>
  )
}
