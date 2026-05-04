'use client'

import { useEffect, useState } from 'react'
import PRESETS from './versionComparePresets'

/**
 * Side-by-side or N-up comparison grid for design-iteration screenshots.
 * Each version supplies a `light` and `dark` image path; a single toggle
 * flips every panel in the row at once so versions can be compared
 * fairly under the same lighting condition.
 *
 * Usage in MDX (preferred — sidesteps next-mdx-remote/rsc's limited
 * JSX-in-attribute evaluation, which silently empties complex array props):
 *
 *   <VersionCompare preset="hero-before-after" />
 *
 * Programmatic usage (passing versions inline) still works:
 *
 *   <VersionCompare
 *     label="before / after"
 *     versions={[{ label, light, dark, caption }, ...]}
 *   />
 */
export default function VersionCompare({
  preset,
  versions: versionsProp,
  label: labelProp,
  defaultMode = 'light',
}) {
  const fromPreset = preset ? PRESETS[preset] : null
  const versions = versionsProp ?? fromPreset?.versions ?? []
  const label = labelProp ?? fromPreset?.label

  const [mode, setMode] = useState(defaultMode)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!expanded) return
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(null) }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [expanded])

  const colsClass =
    versions.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-2' :
    versions.length === 3 ? 'sm:grid-cols-3' :
    versions.length === 2 ? 'sm:grid-cols-2' :
    'sm:grid-cols-1'

  return (
    <figure className="not-prose my-12 lg:-mx-16 xl:-mx-32">
      <header className="mb-3 flex items-center gap-3">
        {label && (
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">
            {label}
          </span>
        )}
        <span
          className="hidden sm:block flex-1 h-px bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800"
          aria-hidden
        />
        <div
          role="tablist"
          aria-label="Toggle screenshot mode"
          className="inline-flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono font-bold uppercase tracking-wider"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'light'}
            onClick={() => setMode('light')}
            className={`px-3 py-1 transition-colors ${
              mode === 'light'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Light
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'dark'}
            onClick={() => setMode('dark')}
            className={`px-3 py-1 transition-colors border-l border-zinc-200 dark:border-zinc-800 ${
              mode === 'dark'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Dark
          </button>
        </div>
      </header>

      <div className={`grid grid-cols-1 ${colsClass} gap-3`}>
        {versions.map((v, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <button
              type="button"
              onClick={() => setExpanded({
                src: mode === 'light' ? v.light : v.dark,
                label: v.label,
                mode,
              })}
              aria-label={`Expand ${v.label} (${mode} mode)`}
              className="group relative block aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 cursor-zoom-in"
            >
              <img
                src={mode === 'light' ? v.light : v.dark}
                alt={`${v.label} — ${mode} mode`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-200"
              />
              <span
                aria-hidden
                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm border border-white/30 bg-black/50 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                ⤢ expand
              </span>
            </button>
            <figcaption className="flex items-baseline justify-between gap-3 border-t border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                {v.label}
              </span>
              {v.caption && (
                <span className="text-[10px] text-zinc-500 dark:text-zinc-500 truncate">
                  {v.caption}
                </span>
              )}
            </figcaption>
          </div>
        ))}
      </div>

      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded view: ${expanded.label}`}
          onClick={() => setExpanded(null)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        >
          <img
            src={expanded.src}
            alt={`${expanded.label} — ${expanded.mode} mode (expanded)`}
            className="max-h-full max-w-full rounded-md shadow-2xl ring-1 ring-white/10"
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(null) }}
            aria-label="Close expanded view"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/20 bg-black/40 font-mono text-lg text-white/90 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-black/60 hover:text-white"
          >
            ×
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-sm border border-white/15 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
            {expanded.label} · {expanded.mode} · click anywhere or press esc to close
          </div>
        </div>
      )}
    </figure>
  )
}
