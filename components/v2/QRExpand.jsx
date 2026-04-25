"use client"

import { useEffect, useState } from 'react'
import { Maximize2, X } from 'lucide-react'

/**
 * QRExpand — small wrapper that renders a QR code at a default size
 * with a "[expand]" affordance underneath. Click → full-screen lightbox
 * with the QR enlarged so a phone camera can scan it cleanly from
 * across the room.
 *
 * Client island; the rest of the downloads page stays server-rendered.
 *
 * Closes on backdrop click, the X button, or Escape.
 */
export default function QRExpand({
  src,
  alt = 'QR code',
  caption,
  className = '',
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    // Lock body scroll while the lightbox is up.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <div className={className}>
        <div className="flex items-center justify-center rounded-sm border border-edge-dim bg-canvas-alt p-5">
          <div className="rounded-sm border border-edge-faint bg-white p-3">
            <img src={src} alt={alt} className="block h-36 w-36" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          {caption && <span>{caption}</span>}
          {caption && <span aria-hidden className="text-ink-subtle">·</span>}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-sm border border-edge-faint bg-canvas-alt px-2 py-1 text-trace transition-all hover:border-trace hover:-translate-y-px"
            style={{
              textShadow: '0 0 4px var(--trace-glow)',
              boxShadow: '0 0 10px color-mix(in oklab, var(--trace-glow) 18%, transparent)',
            }}
            aria-label="Expand QR code"
          >
            <Maximize2 className="h-3 w-3" />
            <span>EXPAND</span>
          </button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/85 px-6 py-10 backdrop-blur-md"
        >
          {/* Close button — top-right of the viewport */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            aria-label="Close expanded QR code"
            className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-edge bg-canvas-overlay text-ink-muted transition-all hover:border-trace hover:text-trace"
            style={{ boxShadow: '0 0 14px color-mix(in oklab, var(--trace-glow) 25%, transparent)' }}
          >
            <X className="h-4 w-4" />
          </button>

          {/* QR card — phosphor frame, click swallowed so backdrop click still closes. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[min(90vw,520px)] rounded-md border border-edge bg-canvas-overlay p-6 backdrop-blur-md"
            style={{
              boxShadow:
                '0 0 32px color-mix(in oklab, var(--trace-glow) 30%, transparent), 0 1px 2px rgba(0,0,0,0.06)',
            }}
          >
            <p
              className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · SCAN
            </p>
            <div className="rounded-sm border border-edge-faint bg-white p-5">
              <img
                src={src}
                alt={alt}
                className="block h-[min(70vh,420px)] w-[min(70vh,420px)]"
              />
            </div>
            {caption && (
              <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                {caption}
              </p>
            )}
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
              ESC · CLICK ANYWHERE TO CLOSE
            </p>
          </div>
        </div>
      )}
    </>
  )
}
