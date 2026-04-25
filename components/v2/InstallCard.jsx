"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Download, Terminal, Check, Copy } from 'lucide-react'

/**
 * InstallCard — patch-bay-styled install panel.
 *
 * Client island ONLY because of two small interactions:
 *   1. Package-manager tab selection (bun / npm / pnpm)
 *   2. Copy-to-clipboard with a transient "copied" state
 *
 * Everything else (layout, typography, glow) is pure Tailwind on
 * CSS-var-backed tokens — the island re-skins atomically with the
 * rest of the page when `html.dark` flips.
 */
const APP_STORE_URL = 'https://apps.apple.com/us/app/talkie-mobile/id6755734109'

const PACKAGE_MANAGERS = [
  { id: 'bun',  label: 'BUN',  cmd: 'bun add -g @talkie/app' },
  { id: 'npm',  label: 'NPM',  cmd: 'npm install -g @talkie/app' },
  { id: 'pnpm', label: 'PNPM', cmd: 'pnpm add -g @talkie/app' },
]

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
    <div className="relative overflow-hidden rounded-md border border-edge bg-surface font-mono">
      {/* Patch-bay header */}
      <div className="flex items-center justify-between border-b border-edge-dim px-4 py-2">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-ink-faint">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
            style={{ boxShadow: '0 0 6px var(--trace)' }}
          />
          INSTALL · PATCH BAY
        </div>
        <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          REV A.1
        </span>
      </div>

      {/* Two primary jacks: DMG + App Store */}
      <div className="grid grid-cols-1 gap-px bg-edge-faint sm:grid-cols-2">
        <Link
          href="/download"
          className="group flex items-center gap-4 bg-canvas-alt p-5 transition-colors hover:bg-canvas"
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-edge bg-surface text-trace transition-transform group-hover:-translate-y-0.5"
            style={{
              boxShadow: '0 0 12px color-mix(in oklab, var(--trace) 14%, transparent)',
            }}
          >
            <Download className="h-4 w-4" style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[9px] uppercase tracking-[0.24em] text-ink-subtle">JACK · MAC</span>
            <span className="mt-1 text-[13px] text-ink">Download .dmg</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              universal · 12 mb
            </span>
          </span>
        </Link>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-canvas-alt p-5 transition-colors hover:bg-canvas"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-edge bg-white p-1.5">
            <img
              src="/qr-app-store.svg"
              alt="QR code for Talkie on the App Store"
              className="h-full w-full"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[9px] uppercase tracking-[0.24em] text-ink-subtle">JACK · iPHONE</span>
            <span className="mt-1 text-[13px] text-ink">Open in App Store</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              scan or tap →
            </span>
          </span>
        </a>
      </div>

      {/* CLI rail */}
      <div className="border-t border-edge-dim bg-canvas-alt">
        <div className="flex items-center justify-between border-b border-edge-faint px-4 py-2">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-ink-faint">
            <Terminal className="h-3 w-3 text-trace" style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }} />
            CLI · DEVELOPERS
          </div>
          <div
            role="tablist"
            aria-label="Package manager"
            className="inline-flex overflow-hidden rounded-sm border border-edge-dim text-[9px] uppercase tracking-[0.22em]"
          >
            {PACKAGE_MANAGERS.map((pm, i) => {
              const active = i === pmIndex
              return (
                <button
                  key={pm.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPmIndex(i)}
                  className={`px-2.5 py-1.5 transition-colors ${
                    active
                      ? 'text-trace'
                      : 'text-ink-faint hover:text-ink-muted'
                  } ${i > 0 ? 'border-l border-edge-faint' : ''}`}
                  style={
                    active
                      ? {
                          background: 'color-mix(in oklab, var(--trace) 10%, transparent)',
                          textShadow: '0 0 4px var(--trace-glow)',
                        }
                      : undefined
                  }
                >
                  {pm.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-stretch gap-2 px-4 py-3">
          <code className="flex-1 truncate rounded-sm border border-edge-faint bg-surface px-3 py-2 text-[12px] text-ink-dim">
            <span className="select-none text-trace mr-2" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
              $
            </span>
            {current.cmd}
          </code>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-sm border border-edge px-3 py-2 text-[9px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-trace hover:border-trace"
            aria-label={copied ? 'Copied' : 'Copy command'}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-trace" style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }} />
                <span className="text-trace" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
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
