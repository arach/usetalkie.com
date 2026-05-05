"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, Terminal, Check, Copy, Maximize2, X } from 'lucide-react'

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
  const [qrExpanded, setQrExpanded] = useState(false)

  /* QR lightbox keyboard + body-scroll handling — Escape closes,
   * body scroll locks while the modal is up. */
  useEffect(() => {
    if (!qrExpanded) return
    const onKey = (e) => { if (e.key === 'Escape') setQrExpanded(false) }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [qrExpanded])
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
          {/* Mac icon — Download glyph in --screen-trace (brand-color
           * pop: emerald on Modern, amber on Warm) against the dark
           * icon-square. The trace-on-dark pairing is the page's
           * "instrument readout" idiom — same vocabulary as the LIVE
           * dot and waveform trace. Subtle inset top-highlight + outer
           * drop give the square just enough lift to feel pressed in
           * without being theatrical. */}
          <span
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-sm transition-transform group-hover:-translate-y-0.5"
            style={{
              background: '#262626',
              border: '1px solid var(--panel-edge-dim)',
              color: 'var(--screen-trace)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 6px -2px rgba(0, 0, 0, 0.30)',
            }}
          >
            <Download className="h-8 w-8" />
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

        {/* iPhone card — split into TWO interactive zones:
         *   1. QR (button)    → opens lightbox so phone cameras can
         *                       scan a properly-sized code
         *   2. Label (link)   → opens App Store URL
         * Wrapping the whole card in <a> like before sent every QR
         * tap straight to the App Store — defeating the QR's purpose. */}
        <div
          className="group flex items-center gap-4 p-5 transition-colors"
          style={{ background: 'var(--panel-bg-alt)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--panel-bg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--panel-bg-alt)' }}
        >
          <button
            type="button"
            onClick={() => setQrExpanded(true)}
            aria-label="Expand QR code to scan with phone"
            className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-sm bg-white p-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.18)]"
            style={{ border: '1px solid var(--panel-edge)' }}
          >
            <img
              src="/qr-app-store.svg"
              alt="QR code for Talkie on the App Store"
              className="h-full w-full"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-sm border bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ borderColor: 'var(--panel-edge)' }}
            >
              <Maximize2 className="h-2.5 w-2.5" style={{ color: 'var(--panel-ink-muted)' }} />
            </span>
          </button>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col leading-tight"
          >
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
              tap to open · scan to install
            </span>
          </a>
        </div>
      </div>

      {/* QR lightbox — backdrop click + Escape close. Big QR (288px)
       * lands well within phone-camera reading range from arm's length. */}
      {qrExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="QR code expanded for scanning"
          onClick={() => setQrExpanded(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={() => setQrExpanded(false)}
            aria-label="Close expanded QR code"
            className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-edge bg-canvas-overlay text-ink-muted transition-all hover:border-trace hover:text-trace"
          >
            <X className="h-4 w-4" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-md bg-white p-8 shadow-2xl"
          >
            <img
              src="/qr-app-store.svg"
              alt="QR code for Talkie on the App Store"
              className="block h-72 w-72"
            />
            <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-700">
              Scan with phone · opens App Store
            </p>
          </div>
        </div>
      )}

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
              style={{ color: 'var(--panel-ink-muted)' }}
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
          {/* CLI bar — softer dark code surface (not punishing pure-black).
           * #2e2e2e lands in the "code editor dark" range across themes,
           * paired with --screen-ink-dim (cream) for readable install
           * text. Slightly lighter than the Mac icon-square (#262626)
           * — bigger surface tolerates lighter dark before reading
           * washed out. */}
          <code
            className="flex-1 truncate rounded-sm px-3 py-2 text-[12px]"
            style={{
              background: '#2e2e2e',
              border: '1px solid var(--panel-edge-faint)',
              color: 'var(--screen-ink-dim)',
            }}
          >
            <span
              className="select-none mr-2"
              style={{ color: 'var(--screen-trace)' }}
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
                  style={{ color: 'var(--panel-trace)' }}
                />
                <span style={{ color: 'var(--panel-trace)' }}>
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
