"use client"

import CopyButton from './CopyButton'

/**
 * ObsidianNote — renders a mock Obsidian-style note preview.
 *
 * Usage in MDX:
 *   <ObsidianNote title="open-scout" content={"# Open Scout\n\n> quote\n\n## Section\nText with [[wikilinks]]"} />
 */
export default function ObsidianNote({ title, content }) {
  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/60 overflow-hidden shadow-sm">
        {/* Title bar — mimics Obsidian's note chrome */}
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700/60">
          <div className="flex gap-1 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60 dark:bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60 dark:bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/60 dark:bg-green-500/40" />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {title}
          </span>
          {content && <CopyButton text={content} className="ml-auto" />}
        </div>

        {/* Note body */}
        <div className="bg-white dark:bg-[#1e1e2e] px-5 py-4 font-mono text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
          {content && <ObsidianContent content={content} />}
        </div>
      </div>
    </div>
  )
}

/**
 * Renders text content with [[wikilinks]] highlighted.
 * For use when children is a simple string.
 */
function ObsidianContent({ content }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <Line key={i} text={line} />
      ))}
    </div>
  )
}

function Line({ text }) {
  if (!text.trim()) return <div className="h-3" />

  // Heading
  const headingMatch = text.match(/^(#{1,3})\s+(.*)/)
  if (headingMatch) {
    const level = headingMatch[1].length
    const content = headingMatch[2]
    const sizes = { 1: 'text-lg font-bold', 2: 'text-base font-semibold', 3: 'text-sm font-medium' }
    return (
      <div className={`${sizes[level]} text-zinc-900 dark:text-zinc-100 ${level > 1 ? 'mt-3' : 'mt-1'}`}>
        <span className="text-zinc-300 dark:text-zinc-600 mr-1">{headingMatch[1]}</span>
        <WikilinkText text={content} />
      </div>
    )
  }

  // Blockquote
  if (text.startsWith('>')) {
    return (
      <div className="border-l-2 border-emerald-500/50 dark:border-emerald-400/40 pl-3 text-zinc-500 dark:text-zinc-400 italic text-xs">
        <WikilinkText text={text.slice(1).trim()} />
      </div>
    )
  }

  // List item
  if (text.match(/^[-*]\s/)) {
    return (
      <div className="flex gap-2 pl-1">
        <span className="text-zinc-400 dark:text-zinc-500 select-none">-</span>
        <span><WikilinkText text={text.slice(2)} /></span>
      </div>
    )
  }

  return <div><WikilinkText text={text} /></div>
}

function WikilinkText({ text }) {
  // Split on [[...]] patterns
  const parts = text.split(/(\[\[[^\]]+\]\])/)

  return (
    <>
      {parts.map((part, i) => {
        const wikilinkMatch = part.match(/^\[\[([^\]]+)\]\]$/)
        if (wikilinkMatch) {
          return (
            <span
              key={i}
              className="text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-1 py-0.5 rounded hover:bg-violet-100 dark:hover:bg-violet-500/20 cursor-pointer transition-colors"
            >
              {wikilinkMatch[1]}
            </span>
          )
        }

        // Bold
        const boldParts = part.split(/(\*\*[^*]+\*\*)/)
        return boldParts.map((bp, j) => {
          const boldMatch = bp.match(/^\*\*([^*]+)\*\*$/)
          if (boldMatch) {
            return (
              <span key={`${i}-${j}`} className="font-semibold text-zinc-900 dark:text-zinc-100">
                {boldMatch[1]}
              </span>
            )
          }
          return <span key={`${i}-${j}`}>{bp}</span>
        })
      })}
    </>
  )
}
