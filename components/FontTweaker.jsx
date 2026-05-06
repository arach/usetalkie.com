'use client'

import { useEffect, useState } from 'react'

/**
 * FontTweaker — DEV-ONLY ephemeral console for cycling display faces in
 * real time without restarting the dev server. Drives the public
 * --font-display token plus three aux vars (weight / tracking / leading)
 * so changes propagate everywhere `.font-display` is used.
 *
 * Loads each face lazily by injecting a Google Fonts <link> on pick —
 * sidesteps next/font's boot-time registration. Selection persists to
 * localStorage so reloads keep the active face while exploration is in
 * progress. The Reset button removes both the localStorage entry and
 * the inline html styles, returning the page to whatever the active
 * theme defines as --font-display.
 *
 * Remove this component (+ its mount in app/layout.jsx) once a Modern
 * display face is chosen and committed to globals.css.
 */
const FONTS = [
  { label: 'Newsreader · serif, refined publication',  family: 'Newsreader',           google: 'Newsreader' },
  { label: 'Cormorant Garamond · serif, dramatic',     family: 'Cormorant Garamond',   google: 'Cormorant+Garamond' },
  { label: 'Spectral · serif, restrained workhorse',   family: 'Spectral',             google: 'Spectral' },
  { label: 'Source Serif 4 · serif, modern Adobe',     family: 'Source Serif 4',       google: 'Source+Serif+4' },
  { label: 'EB Garamond · serif, humanist classical',  family: 'EB Garamond',          google: 'EB+Garamond' },
  { label: 'Crimson Pro · serif, workhorse',           family: 'Crimson Pro',          google: 'Crimson+Pro' },
  { label: 'Lora · serif, popular',                    family: 'Lora',                 google: 'Lora' },
  { label: 'DM Serif Display · serif, contrast',       family: 'DM Serif Display',     google: 'DM+Serif+Display' },
  { label: 'Bodoni Moda · serif, couture contrast',    family: 'Bodoni Moda',          google: 'Bodoni+Moda' },
  { label: 'Playfair Display · serif, classic',        family: 'Playfair Display',     google: 'Playfair+Display' },
  { label: 'Libre Caslon Display · serif, classical',  family: 'Libre Caslon Display', google: 'Libre+Caslon+Display' },
  { label: 'Fraunces · serif, chunky (current Warm)',  family: 'Fraunces',             google: 'Fraunces' },
  { label: 'Instrument Serif · serif, donor (overdone)', family: 'Instrument Serif',   google: 'Instrument+Serif' },
  { label: 'Bricolage Grotesque · sans, variable',     family: 'Bricolage Grotesque',  google: 'Bricolage+Grotesque' },
  { label: 'Manrope · sans, geometric',                family: 'Manrope',              google: 'Manrope' },
  { label: 'Plus Jakarta Sans · sans, geometric',      family: 'Plus Jakarta Sans',    google: 'Plus+Jakarta+Sans' },
  { label: 'DM Sans · sans, geometric',                family: 'DM Sans',              google: 'DM+Sans' },
  { label: 'Outfit · sans, display geometric',         family: 'Outfit',               google: 'Outfit' },
  { label: 'Hanken Grotesk · sans, neo-grot',          family: 'Hanken Grotesk',       google: 'Hanken+Grotesk' },
  { label: 'Onest · sans, neo-grot',                   family: 'Onest',                google: 'Onest' },
  { label: 'Figtree · sans, geometric',                family: 'Figtree',              google: 'Figtree' },
  { label: 'Albert Sans · sans, neo-grot',             family: 'Albert Sans',          google: 'Albert+Sans' },
]

const DEFAULT_FONT          = 'Newsreader'
const DEFAULT_WEIGHT        = 400
const DEFAULT_TRACK         = 0
const DEFAULT_LEADING       = 1.1
const DEFAULT_ACCENT_WEIGHT = 0       // 0 sentinel = "match main weight" (no override)
const DEFAULT_ACCENT_COLOR  = ''      // '' sentinel = inherit (use whatever Tailwind class set)

/* Theme-aware accent presets. Values are CSS var references so they flip
 * with the active design theme (amber → emerald on Modern, etc.) without
 * needing the tweaker to know about themes. */
const ACCENT_PRESETS = [
  { label: 'amber',    value: 'var(--amber)',    swatch: 'var(--amber)' },
  { label: 'trace',    value: 'var(--trace)',    swatch: 'var(--trace)' },
  { label: 'ink',      value: 'var(--ink)',      swatch: 'var(--ink)' },
  { label: 'ink-dim',  value: 'var(--ink-dim)',  swatch: 'var(--ink-dim)' },
  { label: 'rose',     value: '#f43f5e',         swatch: '#f43f5e' },
  { label: 'cyan',     value: '#06b6d4',         swatch: '#06b6d4' },
]

function ensurePreconnect() {
  if (document.getElementById('ft-preconnect-1')) return
  const a = document.createElement('link')
  a.id = 'ft-preconnect-1'; a.rel = 'preconnect'; a.href = 'https://fonts.googleapis.com'
  document.head.appendChild(a)
  const b = document.createElement('link')
  b.id = 'ft-preconnect-2'; b.rel = 'preconnect'; b.href = 'https://fonts.gstatic.com'; b.crossOrigin = ''
  document.head.appendChild(b)
}

function ensureFont(google) {
  ensurePreconnect()
  const id = `ft-font-${google}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  // Request a sensible weight + italic spread; Google serves the closest
  // available cuts the face actually has.
  link.href = `https://fonts.googleapis.com/css2?family=${google}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap`
  document.head.appendChild(link)
}

/* The aux-var override rule is gated behind html[data-ft-active] so the
 * tweaker only intrudes on cascade while it's actively driving things.
 * On reset (or before first interaction) the attribute clears and the
 * normal theme/Tailwind cascade returns. */
function ensureStyleHook() {
  if (document.getElementById('ft-style')) return
  const style = document.createElement('style')
  style.id = 'ft-style'
  style.textContent = `
    html[data-ft-active] .font-display {
      font-weight: var(--ft-weight, 400);
      letter-spacing: var(--ft-tracking, normal);
      line-height: var(--ft-leading, 1.1);
    }
    /* Accent override — covers two distinct hero accent patterns:
       (a) inline italic word inside a .font-display headline (DownloadBay
           "Mac", MacPage "A mic is all you need"), and
       (b) explicitly-marked [data-hero-accent] elements — the rolodex
           flip-card text on the homepage and panoramic hero. The
           rolodex isn't an italic span (it's a styled card with its own
           color treatment), so it has to opt in via attribute.
       !important is necessary because both Tailwind color utilities
       (text-amber etc.) and inline style="color: var(--rolodex-ink)" on
       the rolodex card sit on or near the accent target — only !important
       reliably wins. Acceptable in a dev tool; removed at teardown. */
    html[data-ft-active-accent-weight] .font-display .italic,
    html[data-ft-active-accent-weight] .font-display em,
    html[data-ft-active-accent-weight] .font-display i,
    html[data-ft-active-accent-weight] [data-hero-accent] {
      font-weight: var(--ft-accent-weight) !important;
    }
    html[data-ft-active-accent-color] .font-display .italic,
    html[data-ft-active-accent-color] .font-display em,
    html[data-ft-active-accent-color] .font-display i,
    html[data-ft-active-accent-color] [data-hero-accent] {
      color: var(--ft-accent-color) !important;
    }
  `
  document.head.appendChild(style)
}

export default function FontTweaker() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen]       = useState(true)
  const [font, setFont]                 = useState(DEFAULT_FONT)
  const [weight, setWeight]             = useState(DEFAULT_WEIGHT)
  const [tracking, setTracking]         = useState(DEFAULT_TRACK)
  const [leading, setLeading]           = useState(DEFAULT_LEADING)
  const [accentWeight, setAccentWeight] = useState(DEFAULT_ACCENT_WEIGHT)
  const [accentColor, setAccentColor]   = useState(DEFAULT_ACCENT_COLOR)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = JSON.parse(localStorage.getItem('font-tweaker') || 'null')
      if (saved) {
        if (saved.font)                              setFont(saved.font)
        if (typeof saved.weight === 'number')        setWeight(saved.weight)
        if (typeof saved.tracking === 'number')      setTracking(saved.tracking)
        if (typeof saved.leading === 'number')       setLeading(saved.leading)
        if (typeof saved.accentWeight === 'number')  setAccentWeight(saved.accentWeight)
        if (typeof saved.accentColor === 'string')   setAccentColor(saved.accentColor)
        if (saved.open === false)                    setOpen(false)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!mounted) return
    const f = FONTS.find(x => x.family === font) || FONTS[0]
    ensureStyleHook()
    ensureFont(f.google)

    const root = document.documentElement
    root.dataset.ftActive = ''
    root.style.setProperty('--font-display', `"${f.family}", Georgia, serif`)
    root.style.setProperty('--ft-weight',   String(weight))
    root.style.setProperty('--ft-tracking', `${tracking}em`)
    root.style.setProperty('--ft-leading',  String(leading))

    /* Accent overrides only fire when their data attributes are set,
     * so a 0/empty default leaves the natural cascade alone. */
    if (accentWeight > 0) {
      root.dataset.ftActiveAccentWeight = ''
      root.style.setProperty('--ft-accent-weight', String(accentWeight))
    } else {
      delete root.dataset.ftActiveAccentWeight
      root.style.removeProperty('--ft-accent-weight')
    }
    if (accentColor) {
      root.dataset.ftActiveAccentColor = ''
      root.style.setProperty('--ft-accent-color', accentColor)
    } else {
      delete root.dataset.ftActiveAccentColor
      root.style.removeProperty('--ft-accent-color')
    }

    try {
      localStorage.setItem('font-tweaker', JSON.stringify({
        font, weight, tracking, leading, accentWeight, accentColor, open,
      }))
    } catch {}
  }, [mounted, font, weight, tracking, leading, accentWeight, accentColor, open])

  const reset = () => {
    setFont(DEFAULT_FONT)
    setWeight(DEFAULT_WEIGHT)
    setTracking(DEFAULT_TRACK)
    setLeading(DEFAULT_LEADING)
    setAccentWeight(DEFAULT_ACCENT_WEIGHT)
    setAccentColor(DEFAULT_ACCENT_COLOR)
    const root = document.documentElement
    delete root.dataset.ftActive
    delete root.dataset.ftActiveAccentWeight
    delete root.dataset.ftActiveAccentColor
    root.style.removeProperty('--font-display')
    root.style.removeProperty('--ft-weight')
    root.style.removeProperty('--ft-tracking')
    root.style.removeProperty('--ft-leading')
    root.style.removeProperty('--ft-accent-weight')
    root.style.removeProperty('--ft-accent-color')
    try { localStorage.removeItem('font-tweaker') } catch {}
  }

  if (!mounted) return null

  return (
    <div
      className="fixed top-4 right-4 z-40 rounded-md border font-mono text-[10px] shadow-lg backdrop-blur"
      style={{
        background:  'var(--canvas-overlay)',
        borderColor: 'var(--edge)',
        color:       'var(--ink-dim)',
        width:       open ? 280 : undefined,
      }}
      role="group"
      aria-label="Font tweaker (dev only)"
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 uppercase tracking-[0.18em] hover:opacity-90"
        style={{ color: 'var(--ink-muted)' }}
      >
        <span>Aa · font tweaker</span>
        <span aria-hidden style={{ opacity: 0.7 }}>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="space-y-3 border-t px-3 pb-3 pt-3" style={{ borderColor: 'var(--edge-faint)' }}>
          {/* Live preview — mirrors the DownloadBay headline so the tweaker
              tracks the canonical "Talkie for Mac" layout while you cycle. */}
          <div
            className="rounded-sm border px-3 py-3 text-center"
            style={{ borderColor: 'var(--edge-faint)', background: 'var(--canvas-alt)' }}
          >
            <span
              style={{
                fontFamily:    `"${font}", Georgia, serif`,
                fontSize:      '1.6rem',
                fontWeight:    weight,
                letterSpacing: `${tracking}em`,
                lineHeight:    leading,
                color:         'var(--ink)',
              }}
            >
              Talkie for{' '}
              <span
                style={{
                  fontStyle:  'italic',
                  fontWeight: accentWeight > 0 ? accentWeight : weight,
                  color:      accentColor || 'var(--amber)',
                }}
              >
                Mac
              </span>
            </span>
          </div>

          <label className="block">
            <span className="mb-1 block uppercase tracking-[0.18em]" style={{ color: 'var(--ink-faint)' }}>face</span>
            <select
              value={font}
              onChange={e => setFont(e.target.value)}
              className="w-full rounded-sm border px-2 py-1 font-mono text-[11px]"
              style={{ borderColor: 'var(--edge-dim)', background: 'var(--canvas)', color: 'var(--ink)' }}
            >
              {FONTS.map(f => (
                <option key={f.family} value={f.family}>{f.label}</option>
              ))}
            </select>
          </label>

          <Slider label="weight"   min={200}   max={900}   step={50}    value={weight}   setValue={setWeight}   format={v => Math.round(v)} />
          <Slider label="tracking" min={-0.05} max={0.10}  step={0.005} value={tracking} setValue={setTracking} format={v => `${v.toFixed(3)}em`} />
          <Slider label="leading"  min={0.85}  max={1.60}  step={0.02}  value={leading}  setValue={setLeading}  format={v => v.toFixed(2)} />

          {/* ACCENT — italic word inside the headline (the "Mac" / "iPhone"
              moment). Independent weight + color from the main display. */}
          <div className="space-y-2 border-t pt-2" style={{ borderColor: 'var(--edge-faint)' }}>
            <div className="flex items-center justify-between uppercase tracking-[0.18em]" style={{ color: 'var(--ink-faint)' }}>
              <span>accent · italic word</span>
              {(accentWeight > 0 || accentColor) && (
                <button
                  type="button"
                  onClick={() => { setAccentWeight(DEFAULT_ACCENT_WEIGHT); setAccentColor(DEFAULT_ACCENT_COLOR) }}
                  className="font-mono normal-case tracking-normal hover:opacity-80"
                  style={{ color: 'var(--ink-muted)' }}
                  title="Clear accent overrides"
                >
                  clear
                </button>
              )}
            </div>
            <Slider
              label="weight"
              min={0} max={900} step={50}
              value={accentWeight}
              setValue={setAccentWeight}
              format={v => v === 0 ? 'match' : Math.round(v)}
            />
            <div>
              <span className="mb-1 block uppercase tracking-[0.18em]" style={{ color: 'var(--ink-faint)' }}>color</span>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAccentColor('')}
                  aria-pressed={accentColor === ''}
                  className="rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] hover:opacity-80"
                  style={{
                    borderColor: accentColor === '' ? 'var(--trace)' : 'var(--edge-dim)',
                    color:       accentColor === '' ? 'var(--ink)'   : 'var(--ink-muted)',
                    background:  accentColor === '' ? 'var(--canvas-alt)' : 'transparent',
                  }}
                >
                  inherit
                </button>
                {ACCENT_PRESETS.map(p => {
                  const active = accentColor === p.value
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setAccentColor(p.value)}
                      aria-pressed={active}
                      title={p.label}
                      className="flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] hover:opacity-80"
                      style={{
                        borderColor: active ? 'var(--trace)' : 'var(--edge-dim)',
                        color:       active ? 'var(--ink)'   : 'var(--ink-muted)',
                        background:  active ? 'var(--canvas-alt)' : 'transparent',
                      }}
                    >
                      <span
                        aria-hidden
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: p.swatch, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)' }}
                      />
                      {p.label}
                    </button>
                  )
                })}
                <input
                  type="color"
                  value={accentColor.startsWith('#') ? accentColor : '#000000'}
                  onChange={e => setAccentColor(e.target.value)}
                  className="h-5 w-5 cursor-pointer rounded-sm border"
                  style={{ borderColor: 'var(--edge-dim)' }}
                  title="Custom hex"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={reset}
              className="rounded-sm border px-2 py-1 uppercase tracking-[0.18em] hover:opacity-80"
              style={{ borderColor: 'var(--edge-dim)', color: 'var(--ink-muted)' }}
            >
              reset all
            </button>
            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-faint)' }}>
              .font-display · global
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function Slider({ label, min, max, step, value, setValue, format }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between uppercase tracking-[0.18em]" style={{ color: 'var(--ink-faint)' }}>
        <span>{label}</span>
        <span className="font-mono normal-case tracking-normal tabular-nums" style={{ color: 'var(--ink-muted)' }}>
          {format(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => setValue(parseFloat(e.target.value))}
        className="w-full"
        style={{ accentColor: 'var(--trace)' }}
      />
    </label>
  )
}
