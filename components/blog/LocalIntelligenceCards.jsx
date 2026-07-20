"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, Layers, Cpu, Copy, Check, Terminal } from 'lucide-react'
import { localIntelligenceCards, localIntelligenceCardsById } from './local-intelligence-cards-data'

// ─── Tier config ────────────────────────────────────────────────────────────

const TIER = {
  'ship-soon': {
    label: 'Ship Now',
    Icon: Zap,
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-700/40',
    cardBorder: 'border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-300/80 dark:hover:border-emerald-700/60',
    activeBorder: 'border-emerald-300 dark:border-emerald-700/70 shadow-sm shadow-emerald-100/50 dark:shadow-emerald-900/20',
    headerBg: 'bg-gradient-to-r from-emerald-50/80 to-zinc-50 dark:from-emerald-950/20 dark:to-zinc-900/30',
    promptBg: 'bg-zinc-950 dark:bg-zinc-950',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    progressColor: 'bg-emerald-400 dark:bg-emerald-500',
  },
  'local-first': {
    label: 'Local-First',
    Icon: Layers,
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200/70 dark:border-blue-700/40',
    cardBorder: 'border-zinc-200 dark:border-zinc-800/80 hover:border-blue-300/80 dark:hover:border-blue-700/60',
    activeBorder: 'border-blue-300 dark:border-blue-700/70 shadow-sm shadow-blue-100/50 dark:shadow-blue-900/20',
    headerBg: 'bg-gradient-to-r from-blue-50/80 to-zinc-50 dark:from-blue-950/20 dark:to-zinc-900/30',
    promptBg: 'bg-zinc-950 dark:bg-zinc-950',
    accentText: 'text-blue-600 dark:text-blue-400',
    progressColor: 'bg-blue-400 dark:bg-blue-500',
  },
  'big-swings': {
    label: 'Big Swings',
    Icon: Cpu,
    dot: 'bg-violet-400',
    badge: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border border-violet-200/70 dark:border-violet-700/40',
    cardBorder: 'border-zinc-200 dark:border-zinc-800/80 hover:border-violet-300/80 dark:hover:border-violet-700/60',
    activeBorder: 'border-violet-300 dark:border-violet-700/70 shadow-sm shadow-violet-100/50 dark:shadow-violet-900/20',
    headerBg: 'bg-gradient-to-r from-violet-50/80 to-zinc-50 dark:from-violet-950/20 dark:to-zinc-900/30',
    promptBg: 'bg-zinc-950 dark:bg-zinc-950',
    accentText: 'text-violet-600 dark:text-violet-400',
    progressColor: 'bg-violet-400 dark:bg-violet-500',
  },
}

// ─── Copy button ─────────────────────────────────────────────────────────────

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 dark:text-zinc-500 hover:text-zinc-300 transition-colors px-1.5 py-0.5 rounded hover:bg-white/5"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'copied' : 'copy'}
    </button>
  )
}

// ─── Confidence pill ─────────────────────────────────────────────────────────

function ConfidenceBar({ value }) {
  if (!value) return null
  const pct = Math.round(value * 100)
  const color = pct >= 90 ? 'bg-emerald-400' : pct >= 75 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-zinc-400">{pct}%</span>
    </div>
  )
}

// ─── Prompt panel ────────────────────────────────────────────────────────────

function PromptPanel({ prompt }) {
  return (
    <div className="rounded-lg overflow-hidden border border-zinc-700/50 text-[12px] font-mono">
      {/* Task line */}
      <div className="px-3 py-2 bg-zinc-800/60 border-b border-zinc-700/40">
        <span className="text-zinc-500 uppercase tracking-wider text-[10px]">task — </span>
        <span className="text-zinc-300">{prompt.task}</span>
      </div>
      {/* System prompt */}
      <div className="bg-zinc-950">
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-600">system</span>
          <CopyBtn text={prompt.system} />
        </div>
        <pre className="px-3 pb-3 text-zinc-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {prompt.system}
        </pre>
      </div>
      {/* User template */}
      <div className="bg-zinc-900/60 border-t border-zinc-700/40">
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-600">user template</span>
          <CopyBtn text={prompt.user} />
        </div>
        <pre className="px-3 pb-3 text-zinc-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {prompt.user}
        </pre>
      </div>
    </div>
  )
}

// ─── Output panel ─────────────────────────────────────────────────────────────

function OutputPanel({ expectedOutput }) {
  return (
    <div className="rounded-lg overflow-hidden border border-zinc-700/50">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/60 border-b border-zinc-700/40">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">expected output · json</span>
        <CopyBtn text={JSON.stringify(expectedOutput.example, null, 2)} />
      </div>
      <pre className="bg-zinc-950 px-3 py-3 text-[12px] font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
        {JSON.stringify(expectedOutput.example, null, 2)}
      </pre>
    </div>
  )
}

// ─── Test case panel ─────────────────────────────────────────────────────────

function TestPanel({ testCase }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700/50 overflow-hidden text-[12px]">
      <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700/40">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">test · </span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{testCase.name}</span>
      </div>
      <div className="px-3 py-3 bg-white dark:bg-zinc-900/50 space-y-1.5">
        {testCase.assertions.map((a, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold flex items-center justify-center mt-0.5">✓</span>
            <span className="text-zinc-600 dark:text-zinc-400 font-mono">{a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Single card ─────────────────────────────────────────────────────────────

function Card({ card }) {
  const [open, setOpen] = useState(false)
  const t = TIER[card.tier] ?? TIER['ship-soon']
  const { Icon } = t

  // Pull a confidence value from expectedOutput example if present
  const sampleConf =
    card.expectedOutput?.example?.confidence ??
    card.expectedOutput?.example?.items?.[0]?.confidence ??
    card.expectedOutput?.example?.events?.[0]?.confidence ??
    null

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        open ? t.activeBorder : t.cardBorder
      }`}
    >
      {/* Card header — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-full text-left px-4 py-3.5 flex items-start gap-3 ${t.headerBg} transition-colors`}
      >
        <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${t.accentText}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-snug">
              {card.title}
            </span>
            {sampleConf && <ConfidenceBar value={sampleConf} />}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            {card.objective}
          </p>
        </div>
        <div className="shrink-0 mt-0.5">
          {open
            ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          {/* Input example */}
          <div className="px-4 pt-4 pb-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1.5">
              <Terminal className="w-3 h-3" /> input example
            </div>
            <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700/50">
              <pre className="bg-zinc-50 dark:bg-zinc-900/60 px-3 py-2.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {JSON.stringify(card.inputExample, null, 2)}
              </pre>
            </div>
          </div>

          {/* Prompt */}
          <div className="px-4 pb-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              prompts
            </div>
            <PromptPanel prompt={card.prompt} />
          </div>

          {/* Expected output */}
          <div className="px-4 pb-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              expected output
            </div>
            <OutputPanel expectedOutput={card.expectedOutput} />
          </div>

          {/* Test case */}
          <div className="px-4 pb-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              test case
            </div>
            <TestPanel testCase={card.testCase} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveCards({ ids, tier }) {
  let cards = localIntelligenceCards
  if (Array.isArray(ids) && ids.length > 0) {
    cards = ids.map(id => localIntelligenceCardsById[id]).filter(Boolean)
  }
  if (tier) {
    cards = cards.filter(c => c.tier === tier)
  }
  return cards
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export function LocalIntelligenceCard({ id, card }) {
  const resolved = card ?? (id ? localIntelligenceCardsById[id] : null)
  if (!resolved) {
    return (
      <div className="not-prose my-4 rounded-xl border border-red-200 dark:border-red-800/50 px-4 py-3 text-sm text-red-600 dark:text-red-400 font-mono">
        Missing card: <code>{id}</code>
      </div>
    )
  }
  return (
    <div className="not-prose my-4">
      <Card card={resolved} />
    </div>
  )
}

export function LocalIntelligenceCards({ ids, tier }) {
  const cards = resolveCards({ ids, tier })
  const t = tier ? TIER[tier] : null

  return (
    <div className="not-prose my-6">
      {t && (
        <div className="flex items-center gap-2 mb-3">
          <t.Icon className={`w-3.5 h-3.5 ${t.accentText}`} />
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${t.badge}`}>
            {t.label}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">{cards.length} primitives</span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3">
        {cards.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}

export function LocalIntelligencePromotedCards({ ids = [] }) {
  const cards = resolveCards({ ids })
  const t = TIER['ship-soon']

  return (
    <div className="not-prose my-6">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <t.Icon className={`w-3.5 h-3.5 ${t.accentText}`} />
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${t.badge}`}>
            Ship Now
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">{cards.length} primitives ready to ship</span>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
