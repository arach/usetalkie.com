"use client"

import { useState } from 'react'
import { Cpu, Cloud, Server, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { evalRuns } from './eval-results-data'

// ─── Config ───────────────────────────────────────────────────────────────────

const TIER_ORDER = ['ship-soon', 'local-first', 'big-swings']

const TIER_META = {
  'ship-soon':   { label: 'Ship Now',     color: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-400' },
  'local-first': { label: 'Local-First',  color: 'text-blue-600 dark:text-blue-400',       bar: 'bg-blue-400' },
  'big-swings':  { label: 'Big Swings',   color: 'text-violet-600 dark:text-violet-400',   bar: 'bg-violet-400' },
}

const TYPE_META = {
  'on-device': { Icon: Cpu,    badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-700/40' },
  'local':     { Icon: Server, badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700' },
  'cloud':     { Icon: Cloud,  badge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-700/40' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(v) {
  if (v == null) return null
  return `${Math.round(v * 100)}%`
}

function Bar({ value, colorClass, height = 'h-1.5' }) {
  if (value == null) return (
    <div className={`w-full ${height} rounded-full bg-zinc-100 dark:bg-zinc-800`} />
  )
  return (
    <div className={`w-full ${height} rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  )
}

function Pending() {
  return (
    <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
      <Circle className="w-3 h-3" />
      <span className="text-[10px] font-mono">pending</span>
    </div>
  )
}

// ─── Model row ────────────────────────────────────────────────────────────────

function ModelRow({ run, isFirst }) {
  const typeMeta = TYPE_META[run.type] ?? TYPE_META['local']
  const TypeIcon = typeMeta.Icon
  const hasTierStats = run.tier_stats && Object.keys(run.tier_stats).length > 0

  return (
    <div className={`px-4 py-4 ${isFirst ? '' : 'border-t border-zinc-100 dark:border-zinc-800/80'}`}>
      {/* Model header */}
      <div className="flex items-center gap-3 mb-3">
        <TypeIcon className="w-4 h-4 text-zinc-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {run.label ?? run.model}
            </span>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${typeMeta.badge}`}>
              {run.sublabel ?? run.type}
            </span>
            {run.pending && (
              <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                not yet run
              </span>
            )}
          </div>
          {run.note && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{run.note}</p>
          )}
        </div>

        {/* Overall + latency */}
        <div className="shrink-0 flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-0.5">overall</div>
            {run.overall_pass_rate != null
              ? <div className="text-lg font-bold text-zinc-800 dark:text-zinc-100 tabular-nums">{pct(run.overall_pass_rate)}</div>
              : <Pending />
            }
          </div>
          {run.avg_latency_s != null && (
            <div className="text-right">
              <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-0.5">latency</div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span className="text-sm font-mono text-zinc-600 dark:text-zinc-300">{run.avg_latency_s.toFixed(2)}s</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tier breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {TIER_ORDER.map(tier => {
          const meta = TIER_META[tier]
          const stats = run.tier_stats?.[tier]
          return (
            <div key={tier}>
              <div className={`text-[10px] font-mono uppercase tracking-wider mb-1 ${meta.color}`}>
                {meta.label}
              </div>
              {stats
                ? <>
                    <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 tabular-nums">
                      {pct(stats.pass_rate)}
                      <span className="text-zinc-400 dark:text-zinc-500 font-normal ml-1">
                        ({stats.passed}/{stats.total})
                      </span>
                    </div>
                    <Bar value={stats.pass_rate} colorClass={meta.bar} />
                  </>
                : <>
                    <div className="text-xs text-zinc-400 mb-1">—</div>
                    <Bar value={null} colorClass={meta.bar} />
                  </>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EvalComparison({ title = "Model Eval Results" }) {
  const runs = evalRuns
  const hasResults = runs.some(r => r.overall_pass_rate != null)

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {title}
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            24 primitives · 3 tiers
          </span>
        </div>

        {/* Tier legend */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800/50">
          {TIER_ORDER.map(tier => {
            const meta = TIER_META[tier]
            return (
              <div key={tier} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${meta.bar}`} />
                <span className={`text-[10px] font-mono ${meta.color}`}>{meta.label}</span>
              </div>
            )
          })}
          <div className="ml-auto text-[10px] font-mono text-zinc-400">% assertion pass rate</div>
        </div>

        {/* Model rows */}
        <div className="bg-white dark:bg-zinc-950">
          {runs.map((run, i) => (
            <ModelRow key={run.model} run={run} isFirst={i === 0} />
          ))}
        </div>

        {/* Footer */}
        {!hasResults && (
          <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200/70 dark:border-amber-800/40 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
              Results pending. Run{' '}
              <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-[10px]">
                python evals/run_eval.py --model ollama/qwen3:0.6b
              </code>{' '}
              then{' '}
              <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-[10px]">
                python evals/run_eval.py --export
              </code>{' '}
              to populate this table.
            </p>
          </div>
        )}

        {hasResults && (
          <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-[10px] font-mono text-zinc-400">
              Graded on test case assertions from each card's <code>testCase</code> fixture. Deterministic code-based grader — no LLM judge.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
