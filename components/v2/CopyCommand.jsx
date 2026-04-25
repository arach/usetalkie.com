"use client"
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * v2 CopyCommand — small client island for copy-to-clipboard CLI snippets.
 *
 * Why client: clipboard write + transient "copied" state. Kept tiny so the
 * surrounding download bodies can stay server components.
 *
 * `prefix` defaults to `>`. `variant="ghost"` strips the surface chrome for
 * inline use inside the simpler /v2/dl card.
 */
export default function CopyCommand({
  command,
  prefix = '>',
  variant = 'surface',
  label = 'copy',
  className = '',
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const baseChrome =
    variant === 'ghost'
      ? 'border border-edge-faint bg-transparent'
      : 'border border-edge bg-canvas-alt'

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy"
      className={`group flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left transition-colors hover:border-trace ${baseChrome} ${className}`}
    >
      <span className="flex min-w-0 items-center gap-2 font-mono text-[12px]">
        <span aria-hidden className="select-none text-trace">{prefix}</span>
        <span className="truncate text-ink">{command}</span>
      </span>
      <span className="flex flex-shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle group-hover:text-trace">
        {copied ? (
          <>
            <Check className="h-3 w-3 text-trace" />
            <span className="text-trace">copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span>{label}</span>
          </>
        )}
      </span>
    </button>
  )
}
