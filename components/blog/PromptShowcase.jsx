"use client"

import { useState } from 'react'
import { MessageSquare, Lightbulb, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import CopyButton from './CopyButton'

/**
 * PromptShowcase — displays a prompt with inline annotations.
 *
 * Props:
 *   title: string — prompt step name (e.g. "Step 1: Extract threads")
 *   prompt: string — the actual prompt text
 *   annotations: Array<{ text: string, note: string }> — snippets to highlight with explanations
 *   result?: string — optional preview of what the prompt produces
 */
export default function PromptShowcase({ title, prompt, annotations = [], result }) {
  const [expanded, setExpanded] = useState(false)

  // Build highlighted prompt
  const highlightedPrompt = buildHighlighted(prompt, annotations)

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-b border-zinc-200 dark:border-zinc-700/60">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
            {title}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <CopyButton text={prompt} />
            <Sparkles className="w-3 h-3 text-emerald-500/50 dark:text-emerald-400/50" />
          </div>
        </div>

        {/* Prompt body */}
        <div className="bg-white dark:bg-zinc-900 px-5 py-4">
          <div className="font-mono text-[13px] leading-[1.8] text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
            {highlightedPrompt}
          </div>
        </div>

        {/* Annotations */}
        {annotations.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors w-full"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Why this prompt works — {annotations.length} key techniques</span>
              {expanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
            </button>

            {expanded && (
              <div className="mt-3 space-y-2.5">
                {annotations.map((ann, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <code className="text-[11px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                        {ann.text.length > 50 ? ann.text.slice(0, 50) + '...' : ann.text}
                      </code>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {ann.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Result preview */}
        {result && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-emerald-50/50 dark:bg-emerald-950/20 px-5 py-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              Output preview
            </div>
            <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Builds a React fragment with highlighted annotation spans.
 */
function buildHighlighted(prompt, annotations) {
  if (!annotations.length) return prompt

  // Find all annotation positions
  const positions = []
  annotations.forEach((ann, idx) => {
    const start = prompt.indexOf(ann.text)
    if (start !== -1) {
      positions.push({ start, end: start + ann.text.length, idx })
    }
  })

  // Sort by start position
  positions.sort((a, b) => a.start - b.start)

  const parts = []
  let lastEnd = 0

  positions.forEach(pos => {
    // Text before highlight
    if (pos.start > lastEnd) {
      parts.push(<span key={`t-${pos.start}`}>{prompt.slice(lastEnd, pos.start)}</span>)
    }
    // Highlighted text
    parts.push(
      <span
        key={`h-${pos.start}`}
        className="bg-emerald-100/60 dark:bg-emerald-800/25 text-emerald-800 dark:text-emerald-300 rounded px-0.5 border-b border-emerald-400/40 dark:border-emerald-500/30"
        title={annotations[pos.idx].note}
      >
        {prompt.slice(pos.start, pos.end)}
        <sup className="text-[9px] text-emerald-600 dark:text-emerald-400 ml-0.5 font-bold">
          {pos.idx + 1}
        </sup>
      </span>
    )
    lastEnd = pos.end
  })

  // Remaining text
  if (lastEnd < prompt.length) {
    parts.push(<span key="end">{prompt.slice(lastEnd)}</span>)
  }

  return parts
}
