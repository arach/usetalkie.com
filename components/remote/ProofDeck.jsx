'use client'

import { useState } from 'react'
import { PROOFS } from '../../lib/capabilities'

/**
 * Proof deck — the claims above, shown running.
 *
 * Every frame is a real capture from a real build. That constraint is
 * the whole point of the section, so the honesty note travels *with*
 * each proof instead of collecting in a footnote nobody reads: the
 * prerequisite for SSH sits under the SSH capture, the "varies by app"
 * caveat sits under the insertion capture.
 *
 * Screenshots arrive at wildly different aspect ratios (a portrait phone
 * next to a landscape Mac window), so each one sits in a fixed-height
 * dark bay with `object-contain`. Nothing is cropped to fit a grid, and
 * the row keeps a stable height as you move between tabs — Rule 4, no
 * layout shift on state change.
 */
const FRAME_COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
}

export default function ProofDeck() {
  const [activeId, setActiveId] = useState(PROOFS[0].id)
  const active = PROOFS.find((proof) => proof.id === activeId) ?? PROOFS[0]

  return (
    <div>
      {/* Tab rail */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Product proof">
        {PROOFS.map((proof) => {
          const selected = proof.id === active.id
          return (
            <button
              key={proof.id}
              type="button"
              role="tab"
              id={`proof-tab-${proof.id}`}
              aria-selected={selected}
              aria-controls={`proof-panel-${proof.id}`}
              onClick={() => setActiveId(proof.id)}
              className={[
                'inline-flex items-center gap-2 rounded-sm border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-200',
                'focus:outline-none focus-visible:shadow-[0_0_0_2px_var(--amber)]',
                selected
                  ? 'border-amber/60 text-amber'
                  : 'border-edge-dim text-ink-faint hover:-translate-y-px hover:border-edge hover:text-ink-dim',
              ].join(' ')}
              style={selected ? { background: 'color-mix(in oklab, var(--amber) 8%, transparent)' } : undefined}
            >
              <span className={selected ? 'text-amber' : 'text-ink-subtle'}>{proof.family}</span>
              <span>{proof.tab}</span>
            </button>
          )
        })}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`proof-panel-${active.id}`}
        aria-labelledby={`proof-tab-${active.id}`}
        className="mt-6 overflow-hidden rounded-lg border border-edge-dim bg-surface"
      >
        <div className="border-b border-edge-subtle p-5 md:p-7">
          <h3 className="max-w-2xl font-display text-2xl font-normal leading-[1.15] tracking-[-0.015em] text-ink md:text-3xl">
            {active.title}
          </h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">{active.body}</p>
        </div>

        {/* Frames. Column counts are literal classes, not an interpolated
            inline style — an inline grid-template applies at every width,
            which would squash three portrait phone captures on a 375px
            screen with no way to opt out at a breakpoint. */}
        <div className={`grid gap-4 p-5 md:p-7 ${FRAME_COLUMNS[active.frames.length] ?? 'grid-cols-1'}`}>
          {active.frames.map((frame) => (
            <figure key={frame.src} className="min-w-0">
              <div className="flex h-[260px] items-center justify-center overflow-hidden rounded-md border border-edge-subtle bg-screen-bg p-2 md:h-[340px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.src}
                  alt={frame.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <figcaption className="mt-2.5 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-ink-faint">
                {frame.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Honesty band */}
        <div className="flex flex-col gap-2 border-t border-edge-subtle bg-canvas-alt px-5 py-4 md:flex-row md:items-start md:gap-5 md:px-7">
          <span className="flex-shrink-0 font-mono text-[9px] uppercase tracking-[0.24em] text-amber">
            · WHAT THIS SHOWS
          </span>
          <p className="max-w-3xl text-[12px] leading-relaxed text-ink-faint">{active.note}</p>
        </div>
      </div>
    </div>
  )
}
