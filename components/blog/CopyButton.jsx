"use client"

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text, className = '', onPanel = false }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // On a dark panel surface, neutral and "copied" colors flip to panel tokens.
  const inactiveColor = onPanel ? 'var(--panel-ink-faint)' : 'var(--ink-faint)'
  const copiedColor = onPanel ? 'var(--panel-trace)' : 'var(--trace)'
  const copiedGlow = onPanel ? 'var(--panel-trace-glow)' : 'var(--trace-glow)'

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded transition-all duration-200 hover:text-amber ${className}`}
      style={
        copied
          ? {
              color: copiedColor,
              background: `color-mix(in oklab, ${copiedColor} 10%, transparent)`,
              textShadow: `0 0 4px ${copiedGlow}`,
            }
          : { color: inactiveColor }
      }
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}
