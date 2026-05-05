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
      <div className="rounded-xl border border-edge-dim overflow-hidden shadow-sm">
        {/* Title bar — mimics Obsidian's note chrome */}
        <div className="flex items-center gap-2 px-4 py-2 bg-canvas-alt border-b border-edge-faint">
          <div className="flex gap-1 mr-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'color-mix(in oklab, var(--ink-faint) 35%, transparent)' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'color-mix(in oklab, var(--ink-faint) 35%, transparent)' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'color-mix(in oklab, var(--ink-faint) 35%, transparent)' }} />
          </div>
          <span className="text-xs text-ink-muted font-mono">
            {title}
          </span>
          {content && <CopyButton text={content} className="ml-auto" />}
        </div>

        {/* Note body */}
        <div className="bg-surface px-5 py-4 font-mono text-[13px] leading-relaxed text-ink-dim">
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
      <div className={`${sizes[level]} text-ink ${level > 1 ? 'mt-3' : 'mt-1'}`}>
        <span className="text-ink-faint mr-1">{headingMatch[1]}</span>
        <WikilinkText text={content} />
      </div>
    )
  }

  // Blockquote
  if (text.startsWith('>')) {
    return (
      <div className="border-l-2 pl-3 text-ink-muted italic text-xs" style={{ borderColor: 'color-mix(in oklab, var(--amber) 50%, transparent)' }}>
        <WikilinkText text={text.slice(1).trim()} />
      </div>
    )
  }

  // List item
  if (text.match(/^[-*]\s/)) {
    return (
      <div className="flex gap-2 pl-1">
        <span className="text-ink-faint select-none">-</span>
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
              className="text-amber px-1 py-0.5 rounded cursor-pointer transition-colors duration-200"
              style={{ background: 'color-mix(in oklab, var(--amber) 10%, transparent)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'color-mix(in oklab, var(--amber) 18%, transparent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'color-mix(in oklab, var(--amber) 10%, transparent)' }}
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
              <span key={`${i}-${j}`} className="font-semibold text-ink">
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
