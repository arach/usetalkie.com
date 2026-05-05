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
      <div className="rounded-xl border border-edge-dim overflow-hidden bg-canvas-alt">
        {/* Header — single amber accent, no gradient (gradients fail on cream) */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b border-edge-faint"
          style={{ background: 'color-mix(in oklab, var(--amber) 8%, transparent)' }}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber" />
          <span className="text-xs font-semibold text-amber uppercase tracking-[0.18em]">
            {title}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <CopyButton text={prompt} />
            <Sparkles className="w-3 h-3 text-amber/60" />
          </div>
        </div>

        {/* Prompt body */}
        <div className="bg-surface px-5 py-4">
          <div className="font-mono text-[13px] leading-[1.8] text-ink-muted whitespace-pre-wrap">
            {highlightedPrompt}
          </div>
        </div>

        {/* Annotations */}
        {annotations.length > 0 && (
          <div className="border-t border-edge-faint bg-canvas-alt px-4 py-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-faint hover:text-amber transition-colors duration-200 w-full"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Why this prompt works — {annotations.length} key techniques</span>
              {expanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
            </button>

            {expanded && (
              <div className="mt-3 space-y-2.5">
                {annotations.map((ann, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full text-amber text-[10px] font-bold flex items-center justify-center mt-0.5 tabular-nums"
                      style={{ background: 'color-mix(in oklab, var(--amber) 14%, transparent)' }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <code
                        className="text-[11px] text-amber px-1.5 py-0.5 rounded"
                        style={{ background: 'color-mix(in oklab, var(--amber) 10%, transparent)' }}
                      >
                        {ann.text.length > 50 ? ann.text.slice(0, 50) + '...' : ann.text}
                      </code>
                      <p className="text-xs text-ink-muted mt-1 leading-relaxed">
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
          <div
            className="border-t border-edge-faint px-5 py-3"
            style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
          >
            <div
              className="text-[10px] font-mono uppercase tracking-[0.22em] text-trace mb-1.5"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              Output preview
            </div>
            <div className="font-mono text-xs text-ink-muted whitespace-pre-wrap leading-relaxed">
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
        className="text-amber rounded px-0.5 border-b"
        style={{
          background: 'color-mix(in oklab, var(--amber) 12%, transparent)',
          borderColor: 'color-mix(in oklab, var(--amber) 35%, transparent)',
        }}
        title={annotations[pos.idx].note}
      >
        {prompt.slice(pos.start, pos.end)}
        <sup className="text-[9px] text-amber ml-0.5 font-bold tabular-nums">
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
