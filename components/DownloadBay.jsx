"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Check, Copy, Download } from 'lucide-react'

/**
 * DownloadBay — single-purpose Mac install footer for /mac, /workflows,
 * /security, /features, /agents, /philosophy.
 *
 *   1. Big primary CTA — "Talkie for Mac" with macOS 26+ subtext that
 *      cross-fades to "Download" on hover. Icon grid-anchored to row 1
 *      so it centers against the headline only.
 *   2. "or" divider — connects the dominant button to the curl alternative.
 *   3. Curl one-liner CLI bar with copy-to-clipboard.
 *   4. Optional caption — single line of contextual highlight per page.
 *   5. "FOR DEVELOPERS" section — npm install path for users who'd rather
 *      go through the package manager than the bash one-liner.
 *
 * No App Store jack. No package-manager tabs. The patch-bay InstallCard
 * exists for /downloads where multi-platform IS the page; this is the
 * bottom-of-page download moment for Mac-context routes.
 */
const INSTALL_CMD = 'curl -fsSL go.usetalkie.com/install | bash'
const NPM_CMD = 'npm install -g talkie-cli'

export default function DownloadBay({ caption }) {
  const [copiedCurl, setCopiedCurl] = useState(false)
  const [copiedNpm, setCopiedNpm] = useState(false)

  const copyTo = async (cmd, setter) => {
    try {
      await navigator.clipboard.writeText(cmd)
      setter(true)
      window.setTimeout(() => setter(false), 1600)
    } catch {
      /* clipboard unavailable — silent */
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
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

      {/* "or" divider — connects the dominant button to the CLI alternative */}
      <div className="flex items-center gap-3" aria-hidden>
        <span className="block h-px w-10 bg-edge-dim" />
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-faint">
          or
        </span>
        <span className="block h-px w-10 bg-edge-dim" />
      </div>

      {/* Curl one-liner */}
      <CommandBar
        cmd={INSTALL_CMD}
        copied={copiedCurl}
        onCopy={() => copyTo(INSTALL_CMD, setCopiedCurl)}
      />

      {/* Caption */}
      {caption && (
        <p className="max-w-md text-center text-[13px] leading-relaxed text-ink-muted">
          {caption}
        </p>
      )}

      {/* For developers — separate beat below the primary install paths.
          Border-top + extra spacing signals a tier change rather than a
          third equivalent option. */}
      <div className="mt-2 flex w-full max-w-md flex-col items-center gap-3 border-t border-edge-faint pt-7">
        <p
          className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-faint"
          style={{ textShadow: '0 0 4px var(--trace-glow)' }}
        >
          · FOR DEVELOPERS
        </p>
        <CommandBar
          cmd={NPM_CMD}
          copied={copiedNpm}
          onCopy={() => copyTo(NPM_CMD, setCopiedNpm)}
        />
      </div>
    </div>
  )
}

/* Slim dark instrument bar wrapping a copy-paste command. Used for both
 * the primary curl install line and the developer npm line. */
function CommandBar({ cmd, copied, onCopy }) {
  return (
    <div
      className="inline-flex items-center gap-3 rounded-md px-4 py-2.5 font-mono text-[12px]"
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
        {cmd}
      </code>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? 'Copied' : 'Copy command'}
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
  )
}
