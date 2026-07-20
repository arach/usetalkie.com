"use client"

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function QuickCopyButton({ text, label = 'Quick Copy', className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/80 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  )
}
