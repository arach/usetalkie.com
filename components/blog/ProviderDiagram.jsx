"use client"

import { Cpu, Cloud, Server, ArrowRight, Shield, DollarSign, Wifi, WifiOff } from 'lucide-react'

const PROVIDERS = [
  {
    id: 'apple',
    label: 'Apple Intelligence',
    sublabel: 'On-Device',
    icon: Cpu,
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200/80 dark:border-emerald-700/50',
    ring: 'ring-2 ring-emerald-400/40 dark:ring-emerald-500/30',
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400',
    traits: [
      { icon: Shield, label: 'Private' },
      { icon: DollarSign, label: 'Free' },
      { icon: WifiOff, label: 'Offline' },
    ],
    note: 'Default route',
    highlight: true,
  },
  {
    id: 'openai',
    label: 'OpenAI',
    sublabel: 'Cloud · GPT-4o',
    icon: Cloud,
    iconColor: 'text-zinc-500 dark:text-zinc-400',
    bg: 'bg-zinc-50 dark:bg-zinc-900/30',
    border: 'border-zinc-200 dark:border-zinc-700/50',
    ring: '',
    badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
    traits: [
      { icon: Wifi, label: 'Cloud' },
    ],
    note: 'Escalation',
    highlight: false,
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    sublabel: 'Cloud · Claude',
    icon: Cloud,
    iconColor: 'text-zinc-500 dark:text-zinc-400',
    bg: 'bg-zinc-50 dark:bg-zinc-900/30',
    border: 'border-zinc-200 dark:border-zinc-700/50',
    ring: '',
    badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
    traits: [
      { icon: Wifi, label: 'Cloud' },
    ],
    note: 'Escalation',
    highlight: false,
  },
  {
    id: 'ollama',
    label: 'Ollama',
    sublabel: 'Local · Custom',
    icon: Server,
    iconColor: 'text-zinc-500 dark:text-zinc-400',
    bg: 'bg-zinc-50 dark:bg-zinc-900/30',
    border: 'border-zinc-200 dark:border-zinc-700/50',
    ring: '',
    badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
    traits: [
      { icon: WifiOff, label: 'Offline' },
    ],
    note: 'Custom models',
    highlight: false,
  },
]

export default function ProviderDiagram() {
  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            LLMProvider Protocol
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-950">
          {/* Protocol box */}
          <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-3 mb-5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">protocol</div>
            <div className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
              LLMProvider
            </div>
            <div className="mt-2 space-y-1">
              {['var models: [LLMModel]', 'func generate(prompt:) async throws -> String', 'func stream(prompt:) -> AsyncStream<String>'].map(sig => (
                <div key={sig} className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 pl-3 border-l-2 border-zinc-200 dark:border-zinc-700">
                  {sig}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700" />
              <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">conforms</div>
              <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>

          {/* Provider grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PROVIDERS.map(p => {
              const Icon = p.icon
              return (
                <div
                  key={p.id}
                  className={`rounded-lg border p-3 transition-all ${p.bg} ${p.border} ${p.ring}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 shrink-0 ${p.iconColor}`} />
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-100 leading-tight truncate">
                        {p.label}
                      </div>
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                        {p.sublabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.traits.map(tr => {
                      const TrIcon = tr.icon
                      return (
                        <span key={tr.label} className={`inline-flex items-center gap-0.5 text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded ${p.badge}`}>
                          <TrIcon className="w-2.5 h-2.5" />
                          {tr.label}
                        </span>
                      )
                    })}
                  </div>

                  <div className={`text-[9px] font-mono uppercase tracking-wider ${p.highlight ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                    {p.note}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Routing note */}
          <div className="mt-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-1.5 mt-0.5 shrink-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <ArrowRight className="w-3 h-3 text-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Routing:</span> Apple Intelligence runs first. Cloud providers activate on low confidence, long context, or explicit user choice. The rest of the app never changes — same protocol, different network layer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
