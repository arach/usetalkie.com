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

const MANAGERS = [
  { id: 'bun',  label: 'bun',  cmd: 'bun add -g @talkie/app' },
  { id: 'npm',  label: 'npm',  cmd: 'npm install -g @talkie/app' },
  { id: 'pnpm', label: 'pnpm', cmd: 'pnpm add -g @talkie/app' },
]

export default function DownloadBay({ caption }) {
  const [copiedCurl, setCopiedCurl] = useState(false)
  const [copiedDev, setCopiedDev] = useState(false)
  const [activeMgr, setActiveMgr] = useState('bun')
  const currentMgr = MANAGERS.find((m) => m.id === activeMgr) ?? MANAGERS[0]

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
        className="group/dl inline-grid grid-cols-[auto_auto] grid-rows-[auto_auto] items-center gap-x-4 gap-y-1 rounded-md px-10 py-5"
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-edge)',
          boxShadow: 'var(--panel-chassis-shadow)',
        }}
      >
        {/* Icon-only hover micro-animation: subtle 4% scale, slow easing
         * (300ms) so it feels like the icon "leans in" on intent rather
         * than the whole button lifting. */}
        <Download
          className="col-start-1 row-start-1 h-7 w-7 shrink-0 text-amber transition-transform duration-300 ease-out group-hover/dl:scale-[1.04]"
        />
        <span className="col-start-2 row-start-1 font-display text-3xl leading-none tracking-tight text-panel-ink md:text-4xl">
          Talkie for{' '}
          <span className="italic text-amber">
            Mac
          </span>
        </span>
        {/* Subtitle spans both grid columns so it centers across the
         * full button width — not just the headline column. The
         * Download hover-swap overlay sits in the same span/center
         * position so the swap stays in place visually instead of
         * jumping when the wider/narrower text comes in. */}
        <span
          className="col-span-2 col-start-1 row-start-2 text-center text-[10px] uppercase tracking-[0.26em] transition-opacity duration-200 group-hover/dl:opacity-0"
          style={{ color: 'var(--panel-ink-faint)' }}
        >
          macOS 26+ · iOS 26+
        </span>
        <span
          aria-hidden
          className="pointer-events-none col-span-2 col-start-1 row-start-2 text-center text-[10px] uppercase tracking-[0.26em] opacity-0 transition-opacity duration-200 group-hover/dl:opacity-100"
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
          third equivalent option. Package-manager tabs let bun/npm/pnpm
          users self-select instead of staring at someone else's PM. */}
      <div className="mt-2 flex w-full max-w-md flex-col items-center gap-3 border-t border-edge-faint pt-7">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-faint">
          · FOR DEVELOPERS
        </p>
        <div className="flex items-center gap-1" role="tablist" aria-label="Package manager">
          {MANAGERS.map((m) => {
            const isActive = m.id === activeMgr
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveMgr(m.id)
                  setCopiedDev(false)
                }}
                className={`relative px-2.5 py-1 font-mono text-[10px] lowercase tracking-[0.18em] transition-colors duration-150 ${
                  isActive ? 'text-amber' : 'text-ink-faint hover:text-ink-muted'
                }`}
              >
                {m.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-0.5 block h-px bg-amber"
                  />
                )}
              </button>
            )
          })}
        </div>
        <CommandBar
          cmd={currentMgr.cmd}
          copied={copiedDev}
          onCopy={() => copyTo(currentMgr.cmd, setCopiedDev)}
        />

        {/* Tiny tie-back to docs — for users who installed via package
         * manager and want to wire the CLI / hooks immediately. Sits
         * below the dev install line so it reads as a follow-on, not
         * a primary action. */}
        <Link
          href="/docs"
          className="group inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.26em] text-ink-faint transition-colors hover:text-trace"
        >
          <span>Read the docs</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
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
      <span className="select-none text-amber" aria-hidden>
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
