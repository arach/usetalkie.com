"use client"

import CopyButton from './CopyButton'

/**
 * CopyableCode — wraps a code snippet with a styled container and copy button.
 *
 * One-liners render inline (no title bar).
 * Multi-line blocks get the full treatment with header.
 *
 * Usage:
 *   <CopyableCode code="talkie memos" />
 *   <CopyableCode code={"line1\nline2"} label="Terminal" />
 */
export default function CopyableCode({ lang = '', code, label }) {
  const isOneLiner = !code?.includes('\n')

  if (isOneLiner) {
    return (
      <div className="not-prose my-4">
        <div className="inline-flex items-center gap-3 bg-zinc-950 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 w-full">
          <code className="text-[13px] font-mono text-zinc-300 flex-1">{code}</code>
          <CopyButton text={code} />
        </div>
      </div>
    )
  }

  return (
    <div className="not-prose my-6">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {label || lang || 'code'}
          </span>
          <CopyButton text={code} />
        </div>
        {/* Code body */}
        <div className="bg-zinc-950 dark:bg-zinc-900 px-5 py-4 overflow-x-auto">
          <pre className="text-[13px] font-mono leading-relaxed text-zinc-300">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
