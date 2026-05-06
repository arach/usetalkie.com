"use client"

import { useEffect, useState } from 'react'
import { Maximize2, X } from 'lucide-react'

const FRAME_CLASSES = {
  laptop: 'mx-auto aspect-[16/10] w-full overflow-hidden rounded-sm border border-edge-dim bg-black/5',
  phone: 'mx-auto aspect-[9/16] h-16 overflow-hidden rounded-[0.85rem] border border-edge-dim bg-black/5',
  watch: 'mx-auto aspect-[416/496] h-14 overflow-hidden rounded-[1rem] border border-edge-dim bg-black/5',
  memo: 'mx-auto aspect-[4/3] w-full overflow-hidden rounded-sm border border-edge-dim bg-black/5',
}

const IMAGE_CLASSES = {
  laptop: 'h-full w-full object-cover',
  phone: 'h-full w-full object-cover',
  watch: 'h-full w-full object-cover',
  memo: 'h-full w-full object-cover',
}

const EXPANDED_FRAME_CLASSES = {
  laptop: 'aspect-[16/10] w-[min(88vw,980px)]',
  phone: 'aspect-[9/16] h-[min(78vh,720px)]',
  watch: 'aspect-[416/496] h-[min(76vh,620px)] rounded-[2rem]',
  memo: 'aspect-[4/3] w-[min(88vw,860px)]',
}

const EXPANDED_IMAGE_CLASSES = {
  laptop: 'h-full w-full object-cover',
  phone: 'h-full w-full object-cover',
  watch: 'h-full w-full object-cover',
  memo: 'h-full w-full object-cover',
}

export default function ExpandableCaptureTile({ input }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/tile flex min-h-[124px] flex-col justify-between rounded-sm border border-edge-dim bg-canvas/35 p-3 text-left transition-colors duration-200 hover:border-[color:var(--choice-accent)] hover:bg-surface hover:shadow-[0_0_18px_-12px_var(--choice-accent-glow)] group-hover/panel:border-[color:var(--choice-accent)] group-hover/panel:bg-surface group-hover/panel:shadow-[0_0_18px_-12px_var(--choice-accent-glow)]"
        aria-label={`Expand ${input.label} screenshot`}
      >
        <div className="relative flex h-[72px] items-center justify-center">
          <div className={`${FRAME_CLASSES[input.frame]} transition-colors duration-200 group-hover/tile:border-[color:var(--choice-accent)] group-hover/tile:shadow-[0_0_16px_-8px_var(--choice-accent-glow)] group-hover/panel:border-[color:var(--choice-accent)] group-hover/panel:shadow-[0_0_16px_-8px_var(--choice-accent-glow)]`}>
            <img
              src={input.src}
              alt={input.alt}
              className={`${IMAGE_CLASSES[input.frame]} opacity-65 grayscale sepia-[0.18] transition-[filter,opacity] duration-300 group-hover/tile:opacity-100 group-hover/tile:grayscale-0 group-hover/tile:sepia-0 group-hover/panel:opacity-100 group-hover/panel:grayscale-0 group-hover/panel:sepia-0`}
              loading="lazy"
            />
          </div>
          <span className="pointer-events-none absolute right-0 top-0 inline-flex h-6 w-6 translate-x-1 -translate-y-1 items-center justify-center rounded-sm border border-edge-dim bg-canvas-overlay/85 text-ink-faint opacity-0 backdrop-blur-sm transition-all duration-200 group-hover/tile:translate-x-0 group-hover/tile:translate-y-0 group-hover/tile:border-[color:var(--choice-accent)] group-hover/tile:text-[color:var(--choice-accent)] group-hover/tile:opacity-100">
            <Maximize2 className="h-3 w-3" />
          </span>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted transition-colors duration-200 group-hover/tile:text-ink group-hover/panel:text-ink">
            {input.label}
          </p>
          <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-ink-faint transition-colors duration-200 group-hover/tile:text-[color:var(--choice-accent)] group-hover/panel:text-[color:var(--choice-accent)]">
            {input.detail}
          </p>
        </div>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${input.label} screenshot`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/85 px-5 py-10 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setOpen(false)
            }}
            aria-label="Close expanded screenshot"
            className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-edge bg-canvas-overlay text-ink-muted transition-all hover:border-trace hover:text-trace"
            style={{ boxShadow: '0 0 14px color-mix(in oklab, var(--trace-glow) 25%, transparent)' }}
          >
            <X className="h-4 w-4" />
          </button>

          <div
            onClick={(event) => event.stopPropagation()}
            className="capture-expand-card rounded-md border border-edge bg-canvas-overlay p-4 backdrop-blur-md"
            style={{
              boxShadow:
                '0 0 32px color-mix(in oklab, var(--trace-glow) 30%, transparent), 0 1px 2px rgba(0,0,0,0.06)',
            }}
          >
            <p
              className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              {input.label}
            </p>
            <div className={`${EXPANDED_FRAME_CLASSES[input.frame]} overflow-hidden rounded-sm border border-edge-faint bg-black/5`}>
              <img
                src={input.src}
                alt={input.alt}
                className={EXPANDED_IMAGE_CLASSES[input.frame]}
              />
            </div>
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
              ESC · CLICK ANYWHERE TO CLOSE
            </p>
          </div>

          <style>{`
            @keyframes capture-expand-pop {
              0% { opacity: 0; transform: scale(0.94) translateY(6px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .capture-expand-card {
              animation: capture-expand-pop 0.22s ease-out;
            }
          `}</style>
        </div>
      )}
    </>
  )
}
