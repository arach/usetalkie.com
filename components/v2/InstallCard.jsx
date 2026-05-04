"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Download, Terminal, Check, Copy } from 'lucide-react'

/**
 * InstallCard — patch-bay-styled install panel.
 *
 * Theme-independent identity: this is an *instrument*. It renders dark
 * with phosphor accents in BOTH light and dark mode — the room around
 * it changes (cream paper vs dark studio), but the equipment itself
 * doesn't repaint when you move it. All chrome references the
 * `--panel-*` tokens (defined once at :root in globals.css), not the
 * theme-flipping `--canvas/--surface/--ink` family.
 *
 * Client island ONLY because of two small interactions:
 *   1. Package-manager tab selection (bun / npm / pnpm)
 *   2. Copy-to-clipboard with a transient "copied" state
 */
const APP_STORE_URL = 'https://apps.apple.com/us/app/talkie-mobile/id6755734109'

const PACKAGE_MANAGERS = [
  { id: 'bun',  label: 'BUN',  cmd: 'bun add -g @talkie/app' },
  { id: 'npm',  label: 'NPM',  cmd: 'npm install -g @talkie/app' },
  { id: 'pnpm', label: 'PNPM', cmd: 'pnpm add -g @talkie/app' },
]

// Tiny corner-fastener glyphs sell "this is equipment, not a panel."
// Absolutely-positioned at the four corners of the chassis.
const FASTENER_BASE =
  'pointer-events-none absolute font-mono text-[8px] leading-none select-none'
const FASTENER_STYLE = { color: 'var(--panel-ink-muted)', opacity: 0.5 }
function ChassisFasteners() {
  return (
    <>
      <span aria-hidden className={`${FASTENER_BASE} left-1.5 top-1.5`} style={FASTENER_STYLE}>·</span>
      <span aria-hidden className={`${FASTENER_BASE} right-1.5 top-1.5`} style={FASTENER_STYLE}>·</span>
      <span aria-hidden className={`${FASTENER_BASE} left-1.5 bottom-1.5`} style={FASTENER_STYLE}>·</span>
      <span aria-hidden className={`${FASTENER_BASE} right-1.5 bottom-1.5`} style={FASTENER_STYLE}>·</span>
    </>
  )
}

export default function InstallCard() {
  const [pmIndex, setPmIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const current = PACKAGE_MANAGERS[pmIndex]

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.cmd)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — silent */
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-md font-mono"
      style={{
        background: 'var(--panel-bg)',
        color: 'var(--panel-ink)',
        border: '1px solid var(--panel-edge)',
        boxShadow: 'var(--panel-chassis-shadow)',
      }}
    >
      <ChassisFasteners />

      {/* Patch-bay header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid var(--panel-edge-dim)' }}
      >
        <div
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]"
          style={{ color: 'var(--panel-ink-faint)' }}
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              background: 'var(--panel-trace)',
              boxShadow: '0 0 6px var(--panel-trace)',
            }}
          />
          INSTALL · PATCH BAY
        </div>
        <span
          className="text-[9px] uppercase tracking-[0.22em]"
          style={{ color: 'var(--panel-ink-subtle)' }}
        >
          REV A.1
        </span>
      </div>

      {/* Two primary jacks: DMG + App Store */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2"
        style={{ background: 'var(--panel-edge-faint)', gap: '1px' }}
      >
        <Link
          href="/downloads"
          className="group flex items-center gap-4 p-5 transition-colors"
          style={{ background: 'var(--panel-bg-alt)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--panel-bg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--panel-bg-alt)' }}
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm transition-transform group-hover:-translate-y-0.5"
            style={{
              background: 'var(--panel-bg-deep)',
              border: '1px solid var(--panel-edge)',
              color: 'var(--panel-trace)',
              boxShadow: '0 0 12px color-mix(in oklab, var(--panel-trace) 14%, transparent)',
            }}
          >
            <Download className="h-4 w-4" style={{ filter: 'drop-shadow(0 0 4px var(--panel-trace-glow))' }} />
          </span>
          <span className="flex flex-col leading-tight">
            <span
              className="text-[9px] uppercase tracking-[0.24em]"
              style={{ color: 'var(--panel-ink-subtle)' }}
            >
              JACK · MAC
            </span>
            <span className="mt-1 text-[13px]" style={{ color: 'var(--panel-ink)' }}>
              Download .dmg
            </span>
            <span
              className="mt-1 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--panel-ink-faint)' }}
            >
              universal · 12 mb
            </span>
          </span>
        </Link>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 p-5 transition-colors"
          style={{ background: 'var(--panel-bg-alt)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--panel-bg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--panel-bg-alt)' }}
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-white p-1.5"
            style={{ border: '1px solid var(--panel-edge)' }}
          >
            <img
              src="/qr-app-store.svg"
              alt="QR code for Talkie on the App Store"
              className="h-full w-full"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span
              className="text-[9px] uppercase tracking-[0.24em]"
              style={{ color: 'var(--panel-ink-subtle)' }}
            >
              JACK · iPHONE
            </span>
            <span className="mt-1 text-[13px]" style={{ color: 'var(--panel-ink)' }}>
              Open in App Store
            </span>
            <span
              className="mt-1 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--panel-ink-faint)' }}
            >
              scan or tap →
            </span>
          </span>
        </a>
      </div>

      {/* CLI rail */}
      <div
        style={{
          borderTop: '1px solid var(--panel-edge-dim)',
          background: 'var(--panel-bg-alt)',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: '1px solid var(--panel-edge-faint)' }}
        >
          <div
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]"
            style={{ color: 'var(--panel-ink-faint)' }}
          >
            <Terminal
              className="h-3 w-3"
              style={{ color: 'var(--panel-trace)', filter: 'drop-shadow(0 0 4px var(--panel-trace-glow))' }}
            />
            CLI · DEVELOPERS
          </div>
          <div
            role="tablist"
            aria-label="Package manager"
            className="inline-flex overflow-hidden rounded-sm text-[9px] uppercase tracking-[0.22em]"
            style={{ border: '1px solid var(--panel-edge-dim)' }}
          >
            {PACKAGE_MANAGERS.map((pm, i) => {
              const active = i === pmIndex
              return (
                <button
                  key={pm.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPmIndex(i)}
                  className="px-2.5 py-1.5 transition-colors"
                  style={{
                    color: active ? 'var(--panel-trace)' : 'var(--panel-ink-faint)',
                    borderLeft: i > 0 ? '1px solid var(--panel-edge-faint)' : undefined,
                    background: active
                      ? 'color-mix(in oklab, var(--panel-trace) 10%, transparent)'
                      : 'transparent',
                    textShadow: active ? '0 0 4px var(--panel-trace-glow)' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = 'var(--panel-ink-muted)'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = 'var(--panel-ink-faint)'
                  }}
                >
                  {pm.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-stretch gap-2 px-4 py-3">
          <code
            className="flex-1 truncate rounded-sm px-3 py-2 text-[12px]"
            style={{
              background: 'var(--panel-bg-deep)',
              border: '1px solid var(--panel-edge-faint)',
              color: 'var(--panel-ink-dim)',
            }}
          >
            <span
              className="select-none mr-2"
              style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}
            >
              $
            </span>
            {current.cmd}
          </code>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-[9px] uppercase tracking-[0.22em] transition-colors"
            style={{
              border: '1px solid var(--panel-edge)',
              color: 'var(--panel-ink-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--panel-trace)'
              e.currentTarget.style.borderColor = 'var(--panel-trace)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--panel-ink-muted)'
              e.currentTarget.style.borderColor = 'var(--panel-edge)'
            }}
            aria-label={copied ? 'Copied' : 'Copy command'}
          >
            {copied ? (
              <>
                <Check
                  className="h-3 w-3"
                  style={{ color: 'var(--panel-trace)', filter: 'drop-shadow(0 0 4px var(--panel-trace-glow))' }}
                />
                <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
                  COPIED
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                COPY
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
