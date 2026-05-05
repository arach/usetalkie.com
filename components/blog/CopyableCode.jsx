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
        <div
          className="inline-flex items-center gap-3 rounded-lg border px-4 py-2.5 w-full"
          style={{ background: 'var(--panel-bg)', borderColor: 'var(--panel-edge-dim)' }}
        >
          <code className="text-[13px] font-mono flex-1" style={{ color: 'var(--screen-ink-dim)' }}>{code}</code>
          <CopyButton text={code} onPanel />
        </div>
      </div>
    )
  }

  return (
    <div className="not-prose my-6">
      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: 'var(--panel-edge-dim)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ background: 'var(--panel-bg-alt)', borderColor: 'var(--panel-edge-faint)' }}
        >
          <span
            className="text-[10px] font-mono uppercase tracking-[0.22em]"
            style={{ color: 'var(--panel-ink-faint)' }}
          >
            {label || lang || 'code'}
          </span>
          <CopyButton text={code} onPanel />
        </div>
        {/* Code body */}
        <div
          className="px-5 py-4 overflow-x-auto"
          style={{ background: 'var(--panel-bg)' }}
        >
          <pre
            className="text-[13px] font-mono leading-relaxed"
            style={{ color: 'var(--screen-ink-dim)' }}
          >
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
