"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Check, Copy, Download } from 'lucide-react'

/**
 * DownloadBay — single-purpose Mac install footer for /mac, /workflows,
 * /security, /features, /agents.
 *
 *   1. Big primary CTA — "Talk to your Mac." (ribboned amber button, the
 *      iconic brand promise reused as the download verb)
 *   2. Slim dark CLI bar — `curl -fsSL go.usetalkie.com/install | bash`
 *      with copy-to-clipboard. The only dark element here, sized small
 *      so it complements the button instead of competing with it.
 *   3. Small caption — one line of contextual highlight per page (e.g.
 *      "Capture a thought. Search what you said. Workflows do the rest.")
 *
 * No App Store jack. No package-manager tabs. No corner fasteners. The
 * patch-bay InstallCard exists for /downloads where multi-platform IS
 * the page; this is for the bottom-of-page Mac-context download moment
 * where 'cognitively too much' was the feedback on the bigger panel.
 */
const INSTALL_CMD = 'curl -fsSL go.usetalkie.com/install | bash'

export default function DownloadBay({ caption }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — silent */
    }
  }

  return (
    <div className="flex flex-col items-center gap-7">
      {/* Big primary CTA — icon centered with the headline (row 1), subtext
          tucked beneath in column 2 only via grid placement so the icon
          doesn't drift toward the visual center of the stacked block. */}
      <Link
        href="/downloads"
        aria-label="Download Talkie for Mac"
        className="group/dl inline-grid grid-cols-[auto_auto] grid-rows-[auto_auto] items-center gap-x-4 gap-y-1 rounded-md px-10 py-5 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-edge)',
          boxShadow: 'var(--panel-chassis-shadow)',
        }}
      >
        <Download
          className="col-start-1 row-start-1 h-7 w-7 shrink-0 text-amber transition-transform duration-200 group-hover/dl:scale-110"
          style={{ filter: 'drop-shadow(0 0 6px var(--panel-trace-glow))' }}
        />
        <span className="col-start-2 row-start-1 font-display text-3xl leading-none tracking-tight text-screen-ink md:text-4xl">
          Talkie for{' '}
          <span className="italic text-amber" style={{ textShadow: '0 0 12px var(--panel-trace-glow)' }}>
            Mac
          </span>
        </span>
        <span
          className="col-start-2 row-start-2 text-center text-[10px] uppercase tracking-[0.26em] transition-opacity duration-200 group-hover/dl:opacity-0"
          style={{ color: 'var(--panel-ink-faint)' }}
        >
          macOS 26+
        </span>
        <span
          aria-hidden
          className="pointer-events-none col-start-2 row-start-2 text-center text-[10px] uppercase tracking-[0.26em] opacity-0 transition-opacity duration-200 group-hover/dl:opacity-100"
          style={{ color: 'var(--panel-trace)' }}
        >
          Download
        </span>
      </Link>

      {/* Slim CLI bar — copy-paste install one-liner */}
      <div
        className="group/cli inline-flex items-center gap-3 rounded-md px-4 py-2.5 font-mono text-[12px]"
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-edge-dim)',
          color: 'var(--panel-ink-dim)',
        }}
      >
        <span
          className="select-none text-amber"
          style={{ textShadow: '0 0 4px var(--panel-trace-glow)' }}
          aria-hidden
        >
          $
        </span>
        <code className="select-all" style={{ color: 'var(--panel-ink-dim)' }}>
          {INSTALL_CMD}
        </code>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? 'Copied' : 'Copy install command'}
          className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-sm transition-colors duration-150"
          style={{
            color: copied ? 'var(--panel-trace)' : 'var(--panel-ink-faint)',
            border: '1px solid var(--panel-edge-dim)',
            background: copied
              ? 'color-mix(in oklab, var(--panel-trace) 12%, transparent)'
              : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!copied) e.currentTarget.style.color = 'var(--panel-ink)'
          }}
          onMouseLeave={(e) => {
            if (!copied) e.currentTarget.style.color = 'var(--panel-ink-faint)'
          }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Caption */}
      {caption && (
        <p className="max-w-md text-center text-[13px] leading-relaxed text-ink-muted">
          {caption}
        </p>
      )}
    </div>
  )
}
