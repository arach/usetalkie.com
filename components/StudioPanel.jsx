'use client'

import { useEffect, useState } from 'react'

/**
 * StudioPanel — unified design-control surface. Replaces the previous
 * three floating widgets (ThemePicker, FontTweaker, OsciStyleToggle)
 * with one coherent component.
 *
 * Sections:
 *   • Theme  — warm / linen / modern (was ThemePicker)
 *   • Tone   — chassis treatment for Warm-family themes (was OsciStyleToggle)
 *   • Font   — display face + weight / tracking / leading sliders +
 *              live preview (was FontTweaker main controls)
 *   • Accent — italic-word weight + theme-aware color presets +
 *              custom hex (was FontTweaker accent section)
 *
 * Persistence: writes to the SAME localStorage keys the original
 * components used (`design-theme`, `osci-style`, `font-tweaker`) so
 * the pre-paint script in app/layout.jsx still resolves theme/tone/
 * font state synchronously before first paint. Drop-in replacement at
 * the storage layer.
 *
 * Mounted globally in app/layout.jsx. Position: fixed top-right.
 * Collapsed by default — click the header pill to expand. Open state
 * persists per-session (saved alongside font-tweaker payload).
 *
 * DEV/DESIGN TOOL — remove (or hide behind a flag) before public
 * launch if you don't want visitors poking at internal design knobs.
 */

const THEMES = [
  { key: 'warm',   label: 'Warm'   },
  { key: 'linen',  label: 'Linen'  },
  { key: 'modern', label: 'Modern' },
]

/* Tone variants — chassis aesthetic for Warm-family themes. Each
 * keys an html[data-osci-style="..."] block in globals.css that
 * remaps panel-* tokens. Modern theme has its own panel system, so
 * tone has no visible effect there. */
const TONES = [
  { key: 'phosphor',       label: 'Original'    },
  { key: 'ember-cream',    label: 'Ember Cream' },
  { key: 'ember-notepad',  label: 'Ember Note'  },
  { key: 'cream-desk',     label: 'Cream'       },
  { key: 'field-notebook', label: 'Notepad'     },
  { key: 'slate',          label: 'Slate'       },
]

const FONTS = [
  { label: 'Talkie Display · ours (Newsreader fork)',  family: 'Talkie Display',       google: null },
  { label: 'Cormorant Garamond · serif, dramatic',     family: 'Cormorant Garamond',   google: 'Cormorant+Garamond' },
  { label: 'Newsreader · serif, refined publication',  family: 'Newsreader',           google: 'Newsreader' },
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

const ACCENT_PRESETS = [
  { label: 'amber',    value: 'var(--amber)',    swatch: 'var(--amber)' },
  { label: 'trace',    value: 'var(--trace)',    swatch: 'var(--trace)' },
  { label: 'ink',      value: 'var(--ink)',      swatch: 'var(--ink)' },
  { label: 'ink-dim',  value: 'var(--ink-dim)',  swatch: 'var(--ink-dim)' },
  { label: 'rose',     value: '#f43f5e',         swatch: '#f43f5e' },
  { label: 'cyan',     value: '#06b6d4',         swatch: '#06b6d4' },
]

/* Defaults — match what's baked into globals.css for Modern, so
 * "reset all" returns the page to the committed look (not a stale
 * tweaker preview). Talkie Display at 400/-0.015em mirrors the
 * Modern theme's `.font-display` rule (Modern now resolves
 * --font-display to Talkie Display per layout.jsx + globals.css). */
const DEFAULT_FONT          = 'Talkie Display'
const DEFAULT_WEIGHT        = 400
const DEFAULT_TRACK         = -0.015
const DEFAULT_LEADING       = 1.10
const DEFAULT_ACCENT_WEIGHT = 0       // 0 sentinel = "match main weight"
const DEFAULT_ACCENT_COLOR  = 'var(--trace)'

function ensurePreconnect() {
  if (document.getElementById('sp-preconnect-1')) return
  const a = document.createElement('link')
  a.id = 'sp-preconnect-1'; a.rel = 'preconnect'; a.href = 'https://fonts.googleapis.com'
  document.head.appendChild(a)
  const b = document.createElement('link')
  b.id = 'sp-preconnect-2'; b.rel = 'preconnect'; b.href = 'https://fonts.gstatic.com'; b.crossOrigin = ''
  document.head.appendChild(b)
}

function ensureFont(google) {
  // Local fonts (e.g. Talkie Display) skip Google-Fonts injection — they're
  // already loaded via next/font/local in app/layout.jsx.
  if (!google) return
  ensurePreconnect()
  const id = `sp-font-${google}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${google}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap`
  document.head.appendChild(link)
}

function ensureStyleHook() {
  if (document.getElementById('sp-style')) return
  const style = document.createElement('style')
  style.id = 'sp-style'
  style.textContent = `
    html[data-sp-active] .font-display {
      font-weight: var(--sp-weight, 400);
      letter-spacing: var(--sp-tracking, normal);
      line-height: var(--sp-leading, 1.1);
    }
    /* Accent override — covers (a) inline italic word inside a
       .font-display headline (DownloadBay, MacPage), and (b)
       explicitly-marked [data-hero-accent] elements (rolodex flip
       cards). !important wins against Tailwind color utilities and
       inline-style colors that sit on or near the accent target. */
    html[data-sp-active-accent-weight] .font-display .italic,
    html[data-sp-active-accent-weight] .font-display em,
    html[data-sp-active-accent-weight] .font-display i,
    html[data-sp-active-accent-weight] [data-hero-accent] {
      font-weight: var(--sp-accent-weight) !important;
    }
    html[data-sp-active-accent-color] .font-display .italic,
    html[data-sp-active-accent-color] .font-display em,
    html[data-sp-active-accent-color] .font-display i,
    html[data-sp-active-accent-color] [data-hero-accent] {
      color: var(--sp-accent-color) !important;
    }
  `
  document.head.appendChild(style)
}

export default function StudioPanel() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen]       = useState(false)

  /* Public defaults — Modern + Original. The pre-paint script in
   * app/layout.jsx applies the same defaults synchronously before
   * first paint; these are the React-state mirror. */
  const [theme, setTheme]               = useState('modern')
  const [tone, setTone]                 = useState('phosphor')
  const [font, setFont]                 = useState(DEFAULT_FONT)
  const [weight, setWeight]             = useState(DEFAULT_WEIGHT)
  const [tracking, setTracking]         = useState(DEFAULT_TRACK)
  const [leading, setLeading]           = useState(DEFAULT_LEADING)
  const [accentWeight, setAccentWeight] = useState(DEFAULT_ACCENT_WEIGHT)
  const [accentColor, setAccentColor]   = useState(DEFAULT_ACCENT_COLOR)

  // Hydrate from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const t = localStorage.getItem('design-theme')
      if (t && THEMES.find(x => x.key === t)) setTheme(t)

      const o = localStorage.getItem('osci-style')
      if (o && TONES.find(x => x.key === o)) setTone(o)

      const ft = JSON.parse(localStorage.getItem('font-tweaker') || 'null')
      if (ft) {
        if (ft.font)                              setFont(ft.font)
        if (typeof ft.weight === 'number')        setWeight(ft.weight)
        if (typeof ft.tracking === 'number')      setTracking(ft.tracking)
        if (typeof ft.leading === 'number')       setLeading(ft.leading)
        if (typeof ft.accentWeight === 'number')  setAccentWeight(ft.accentWeight)
        if (typeof ft.accentColor === 'string')   setAccentColor(ft.accentColor)
      }
      const sp = JSON.parse(localStorage.getItem('studio-panel') || 'null')
      if (sp && typeof sp.open === 'boolean') setOpen(sp.open)
    } catch {}
  }, [])

  /* Apply theme — flips data-theme on html. Picking the public
   * default (modern) clears localStorage so fresh visitors stay
   * cookie-clean; warm/linen explicitly persist. */
  const applyTheme = (next) => {
    setTheme(next)
    const root = document.documentElement
    if (next === 'modern' || next === 'linen') root.setAttribute('data-theme', next)
    else root.removeAttribute('data-theme')
    try {
      if (next === 'modern') localStorage.removeItem('design-theme')
      else localStorage.setItem('design-theme', next)
    } catch {}
  }

  /* Apply tone — no attribute is the Original public treatment;
   * alternatives are explicit comparisons stored by the design tool. */
  const applyTone = (next) => {
    setTone(next)
    const root = document.documentElement
    if (next === 'phosphor') root.removeAttribute('data-osci-style')
    else root.setAttribute('data-osci-style', next)
    try {
      if (next === 'phosphor') localStorage.removeItem('osci-style')
      else localStorage.setItem('osci-style', next)
    } catch {}
  }

  // Apply font + accent — every state change writes to html inline style
  useEffect(() => {
    if (!mounted) return
    const f = FONTS.find(x => x.family === font) || FONTS[0]
    ensureStyleHook()
    ensureFont(f.google)

    const root = document.documentElement
    root.dataset.spActive = ''
    root.style.setProperty('--font-display', `"${f.family}", Georgia, serif`)
    root.style.setProperty('--sp-weight',   String(weight))
    root.style.setProperty('--sp-tracking', `${tracking}em`)
    root.style.setProperty('--sp-leading',  String(leading))

    if (accentWeight > 0) {
      root.dataset.spActiveAccentWeight = ''
      root.style.setProperty('--sp-accent-weight', String(accentWeight))
    } else {
      delete root.dataset.spActiveAccentWeight
      root.style.removeProperty('--sp-accent-weight')
    }
    if (accentColor) {
      root.dataset.spActiveAccentColor = ''
      root.style.setProperty('--sp-accent-color', accentColor)
    } else {
      delete root.dataset.spActiveAccentColor
      root.style.removeProperty('--sp-accent-color')
    }

    try {
      localStorage.setItem('font-tweaker', JSON.stringify({
        font, weight, tracking, leading, accentWeight, accentColor,
      }))
    } catch {}
  }, [mounted, font, weight, tracking, leading, accentWeight, accentColor])

  // Persist open state separately so it doesn't reset on font teardown
  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem('studio-panel', JSON.stringify({ open })) } catch {}
  }, [mounted, open])

  const reset = () => {
    /* Reset returns to the baked public preset — Modern + Original. */
    applyTheme('modern')
    applyTone('phosphor')
    setFont(DEFAULT_FONT)
    setWeight(DEFAULT_WEIGHT)
    setTracking(DEFAULT_TRACK)
    setLeading(DEFAULT_LEADING)
    setAccentWeight(DEFAULT_ACCENT_WEIGHT)
    setAccentColor(DEFAULT_ACCENT_COLOR)
    const root = document.documentElement
    delete root.dataset.spActive
    delete root.dataset.spActiveAccentWeight
    delete root.dataset.spActiveAccentColor
    root.style.removeProperty('--font-display')
    root.style.removeProperty('--sp-weight')
    root.style.removeProperty('--sp-tracking')
    root.style.removeProperty('--sp-leading')
    root.style.removeProperty('--sp-accent-weight')
    root.style.removeProperty('--sp-accent-color')
    try { localStorage.removeItem('font-tweaker') } catch {}
  }

  if (!mounted) return null

  // Header summary — current theme + font name, all-caps mono, low contrast
  const fontShort = font.replace(/Garamond|Display|Serif|Sans|Pro|Grotesque|Grotesk|\s+\d+/gi, '').trim()
  const summary = `${theme}${tone !== 'phosphor' ? ` · ${tone.split('-')[0]}` : ''} · ${fontShort}`

  return (
    <div
      /* Vertically aligned to the GET APP button in SiteShell's sticky
       * header (h-12 / 48px). top-3 + py-1.5 + text-[9px] reproduces
       * the same vertical center (~24px from viewport top). The
       * `right-4 md:right-6` offset mirrors the header's container
       * inset so the pill sits in horizontal formation with GET APP
       * on standard viewport widths. z-50 keeps the expanded panel
       * above the sticky header (which is z-40). */
      className="fixed top-[9px] right-4 md:right-6 z-50 hidden rounded-md border font-mono shadow-md backdrop-blur md:block"
      style={{
        background:  'var(--canvas-overlay)',
        borderColor: 'var(--edge)',
        color:       'var(--ink-dim)',
        width:       open ? 300 : undefined,
        maxHeight:   open ? 'calc(100vh - 1.5rem)' : undefined,
        overflowY:   open ? 'auto' : undefined,
      }}
      role="group"
      aria-label="Design studio panel"
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        /* Header pill — matches GET APP's metrics:
         * text-[9px] · px-3 · tracking-[0.22em]
         * Vertical padding is asymmetric (pt-1.5 / pb-[7px]) — the
         * extra 1px on bottom matches GET APP's rendered height
         * exactly so both pills align on top AND bottom edges. The
         * asymmetry compensates for sub-pixel rendering differences
         * between the GET APP button (border + bg-tint) and our
         * floating pill (border + backdrop-blur). */
        className="flex w-full items-center justify-between gap-3 px-3 pt-1.5 pb-[7px] text-[9px] uppercase tracking-[0.22em] hover:opacity-90"
        style={{ color: 'var(--ink-muted)' }}
      >
        <span className="flex items-center gap-2">
          <span style={{ color: 'var(--trace)' }}>▣</span>
          <span>studio</span>
        </span>
        <span
          className="truncate font-mono normal-case tracking-normal"
          style={{ color: 'var(--ink-faint)', maxWidth: open ? undefined : 200 }}
        >
          {summary}
        </span>
        <span aria-hidden style={{ opacity: 0.7 }}>{open ? '−' : '+'}</span>
      </button>

      {open && (
        /* Expanded body — bumped to text-[10px] for legibility, slightly
         * looser than the chrome-matched [9px] header pill above. */
        <div className="space-y-4 border-t px-3 pb-3 pt-3 text-[10px]" style={{ borderColor: 'var(--edge-faint)' }}>
          {/* Theme */}
          <Section label="Theme">
            <Segmented options={THEMES} active={theme} onChange={applyTheme} />
          </Section>

          {/* Tone — most variants override panel-* tokens (theme-agnostic),
              so they have visible effect on Modern too. Metallic is the only
              one strictly theme-scoped (modern). No hint — let users discover
              tone-theme combinations by trying them. */}
          <Section label="Tone">
            <Segmented options={TONES} active={tone} onChange={applyTone} compact />
          </Section>

          {/* Font */}
          <Section label="Font">
            {/* Live preview — mirrors DownloadBay headline shape */}
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

            <select
              value={font}
              onChange={e => setFont(e.target.value)}
              className="mt-2 w-full rounded-sm border px-2 py-1 font-mono text-[11px]"
              style={{ borderColor: 'var(--edge-dim)', background: 'var(--canvas)', color: 'var(--ink)' }}
            >
              {FONTS.map(f => (
                <option key={f.family} value={f.family}>{f.label}</option>
              ))}
            </select>

            <Slider label="weight"   min={200}   max={900}   step={50}    value={weight}   setValue={setWeight}   format={v => Math.round(v)} />
            <Slider label="tracking" min={-0.05} max={0.10}  step={0.005} value={tracking} setValue={setTracking} format={v => `${v.toFixed(3)}em`} />
            <Slider label="leading"  min={0.85}  max={1.60}  step={0.02}  value={leading}  setValue={setLeading}  format={v => v.toFixed(2)} />
          </Section>

          {/* Accent — italic word + rolodex card text */}
          <Section
            label="Accent"
            hint="italic word · rolodex"
            action={
              (accentWeight > 0 || accentColor) && (
                <button
                  type="button"
                  onClick={() => { setAccentWeight(DEFAULT_ACCENT_WEIGHT); setAccentColor(DEFAULT_ACCENT_COLOR) }}
                  className="font-mono normal-case tracking-normal hover:opacity-80"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  clear
                </button>
              )
            }
          >
            <Slider
              label="weight"
              min={0} max={900} step={50}
              value={accentWeight}
              setValue={setAccentWeight}
              format={v => v === 0 ? 'match' : Math.round(v)}
            />
            <div className="mt-1.5">
              <span className="mb-1 block uppercase tracking-[0.18em]" style={{ color: 'var(--ink-faint)' }}>color</span>
              <div className="flex flex-wrap items-center gap-1">
                <Chip
                  label="inherit"
                  active={accentColor === ''}
                  onClick={() => setAccentColor('')}
                />
                {ACCENT_PRESETS.map(p => (
                  <Chip
                    key={p.label}
                    label={p.label}
                    swatch={p.swatch}
                    active={accentColor === p.value}
                    onClick={() => setAccentColor(p.value)}
                  />
                ))}
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
          </Section>

          {/* Reset all */}
          <div className="flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: 'var(--edge-faint)' }}>
            <button
              type="button"
              onClick={reset}
              className="rounded-sm border px-2 py-1 uppercase tracking-[0.18em] hover:opacity-80"
              style={{ borderColor: 'var(--edge-dim)', color: 'var(--ink-muted)' }}
            >
              reset all
            </button>
            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-faint)' }}>
              dev · design
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ label, hint, action, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="uppercase tracking-[0.18em]" style={{ color: 'var(--ink-faint)' }}>
          {label}
          {hint && (
            <span className="ml-2 normal-case tracking-normal" style={{ color: 'var(--ink-subtle)', opacity: 0.7 }}>
              {hint}
            </span>
          )}
        </span>
        {action}
      </div>
      {children}
    </div>
  )
}

function Segmented({ options, active, onChange, compact }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {options.map(o => {
        const isActive = active === o.key
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={isActive}
            className={`rounded-sm border ${compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-1'} uppercase tracking-[0.18em] transition-colors hover:opacity-90`}
            style={isActive ? {
              background:  'var(--trace)',
              color:       'var(--canvas)',
              borderColor: 'var(--trace)',
            } : {
              background:  'transparent',
              color:       'var(--ink-muted)',
              borderColor: 'var(--edge-dim)',
            }}
          >
            {o.label}
          </button>
        )
      })}
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

function Chip({ label, swatch, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className="flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] hover:opacity-80"
      style={{
        borderColor: active ? 'var(--trace)'      : 'var(--edge-dim)',
        color:       active ? 'var(--ink)'        : 'var(--ink-muted)',
        background:  active ? 'var(--canvas-alt)' : 'transparent',
      }}
    >
      {swatch && (
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: swatch, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)' }}
        />
      )}
      {label}
    </button>
  )
}
