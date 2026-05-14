'use client'

import { Wordmark } from './brand/Wordmark'

/**
 * Brand page — /brand
 *
 * The receipts for how Talkie carries itself. Wordmark variants, color
 * tokens, type, voice, motion, usage. This is the page a designer
 * external to the team lands on and immediately knows the rules.
 *
 * Custody owner: @talkie-brand (Scout). Source-of-truth materials are
 * loaded from the real components/tokens, not duplicated here.
 */

const TOKENS = [
  {
    name: 'Studio Cream',
    var: '--brand-studio-cream',
    hex: '#F4EFE6',
    role: 'Primary ink on dark canvas. Default body and display color in dark mode.',
  },
  {
    name: 'Ribbon Black',
    var: '--brand-canvas',
    hex: '#0E0D0A',
    role: 'Primary canvas in dark mode. Body and display ink in light mode.',
  },
  {
    name: 'Hot Mic',
    var: '--brand-hot-mic',
    hex: '#FF5346',
    role: 'Listening state. The only red in the system. Used on the wordmark dot, recording indicators, never decorative.',
  },
  {
    name: 'Cassette Orange',
    var: '--brand-cassette-orange',
    hex: '#E68A3C',
    role: 'Processing, warm accent. Used in narrator transitions and secondary state cues.',
  },
  {
    name: 'Tape Tan',
    var: '--brand-tape-tan',
    hex: '#7A6E5C',
    role: 'Idle, dividers, secondary mono labels. The connective tissue of the system.',
  },
  {
    name: 'Caution Yellow',
    var: '--brand-caution-yellow',
    hex: '#E5C547',
    role: 'Error / warning, used sparingly. Reserve for moments that genuinely need attention.',
  },
  {
    name: 'Graphite',
    var: '--brand-graphite',
    hex: '#B8B2A4',
    role: 'Secondary text on dark canvas. Body de-emphasis without going to full mute.',
  },
  {
    name: 'Signal Green',
    var: '--brand-signal-green',
    hex: '#5FD088',
    role: 'Sync-ok, app available. Strict indicator semantic — never for decoration or CTAs.',
  },
]

const VOICE_LINES = [
  { kind: 'anchor', text: "It's like a selfie. For your thoughts." },
  { kind: 'supporting', text: 'A mic is all you need.' },
  { kind: 'supporting', text: 'Voice-first AI. Yours.' },
  { kind: 'supporting', text: 'Local-first. Auditable signal path.' },
]

const DOS_AND_DONTS = [
  { ok: true, text: 'Use the Wordmark component — never re-type "talkie" in CSS.' },
  { ok: true, text: 'Keep the Hot Mic dot red. It means listening; nothing else.' },
  { ok: true, text: 'Pair Talkie Medium (wordmark) with JetBrains Mono (labels) and a single display serif for emphasis.' },
  { ok: true, text: 'Let the warm canvases (Cream / Ribbon Black) do the heavy lifting. Avoid pure white and pure black.' },
  { ok: false, text: 'Don\'t stretch, skew, or condense the wordmark by hand. Use the `squeeze` prop.' },
  { ok: false, text: 'Don\'t recolor the Hot Mic dot for theming. Use `monotone` mode if a single-color lockup is required.' },
  { ok: false, text: 'Don\'t pair the wordmark with another logotype lockup horizontally without a divider.' },
  { ok: false, text: 'Don\'t use Signal Green for CTAs. It\'s a sync indicator, not a button color.' },
]

function Section({ eyebrow, title, kicker, children }) {
  return (
    <section className="border-t border-edge-subtle py-20 first:border-t-0 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-subtle">· {eyebrow}</p>
          <h2 className="mt-4 font-display text-3xl leading-tight tracking-[-0.02em] text-ink md:text-4xl">
            {title}
          </h2>
          {kicker && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-faint">{kicker}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}

function WordmarkTile({ label, bg, ink, children }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex min-h-[180px] items-center justify-center rounded-sm border border-edge-subtle px-8 py-10"
        style={{ background: bg, color: ink }}
      >
        {children}
      </div>
      <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· {label}</p>
    </div>
  )
}

function Swatch({ token }) {
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-edge-subtle p-5">
      <div
        className="h-20 w-full rounded-sm"
        style={{ background: `var(${token.var})`, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }}
      />
      <div className="space-y-1">
        <p className="font-display text-base leading-tight text-ink">{token.name}</p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          <span className="text-trace">{token.var}</span>
          <span className="mx-1.5 text-ink-subtle">·</span>
          <span>{token.hex}</span>
        </p>
      </div>
      <p className="text-[11px] leading-relaxed text-ink-faint">{token.role}</p>
    </div>
  )
}

export default function BrandPage() {
  return (
    <article className="font-mono">
      {/* Hero */}
      <header className="border-b border-edge-faint py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-[10px] uppercase tracking-[0.32em] text-ink-subtle">· Brand · v1</p>
          <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
            <div className="max-w-2xl">
              <Wordmark size={120} state="listening" pulse />
              <h1 className="mt-10 font-display text-4xl leading-tight tracking-[-0.02em] text-ink md:text-5xl">
                The receipts for how Talkie carries itself.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-faint">
                Wordmark, color, type, voice, motion. Everything on this page is loaded from the real components and tokens — no duplicated values, no drift. If the brand evolves, this page evolves with it.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-10 gap-y-3 text-[11px] leading-relaxed md:text-xs">
              <dt className="uppercase tracking-[0.2em] text-ink-subtle">Wordmark</dt>
              <dd className="text-ink">v6 · 2026-05-14</dd>
              <dt className="uppercase tracking-[0.2em] text-ink-subtle">Type</dt>
              <dd className="text-ink">Talkie Medium</dd>
              <dt className="uppercase tracking-[0.2em] text-ink-subtle">Accent</dt>
              <dd className="text-ink">Hot Mic · #FF5346</dd>
              <dt className="uppercase tracking-[0.2em] text-ink-subtle">Canvases</dt>
              <dd className="text-ink">Cream · Ribbon Black</dd>
            </dl>
          </div>
        </div>
      </header>

      {/* Wordmark */}
      <Section
        eyebrow="Wordmark"
        title="The lockup is the brand."
        kicker="Talkie's wordmark is the dotless mono with a Hot Mic dot floating above the i. Red means listening — never decoration. Use the Wordmark component; never re-type the letters."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <WordmarkTile label="Listening · Dark canvas (default)" bg="#0E0D0A" ink="#F4EFE6">
            <Wordmark size={110} state="listening" pulse ink="#F4EFE6" />
          </WordmarkTile>
          <WordmarkTile label="Listening · Light canvas" bg="#F4EFE6" ink="#15140F">
            <Wordmark size={110} state="listening" pulse ink="#15140F" />
          </WordmarkTile>
          <WordmarkTile label="Idle · Hot Mic off (Tape Tan dot)" bg="#0E0D0A" ink="#F4EFE6">
            <Wordmark size={110} state="idle" ink="#F4EFE6" />
          </WordmarkTile>
          <WordmarkTile label="Monotone · Single-color lockup" bg="#0E0D0A" ink="#F4EFE6">
            <Wordmark size={110} state="listening" monotone ink="#F4EFE6" />
          </WordmarkTile>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <WordmarkTile label="Hero scale · 140px" bg="#0E0D0A" ink="#F4EFE6">
            <Wordmark size={140} state="listening" pulse ink="#F4EFE6" />
          </WordmarkTile>
          <WordmarkTile label="Body scale · 56px" bg="#0E0D0A" ink="#F4EFE6">
            <Wordmark size={56} state="listening" pulse ink="#F4EFE6" />
          </WordmarkTile>
          <WordmarkTile label="Nav scale · 28px" bg="#0E0D0A" ink="#F4EFE6">
            <Wordmark size={28} state="listening" pulse ink="#F4EFE6" />
          </WordmarkTile>
        </div>

        <p className="mt-8 max-w-2xl text-[12px] leading-relaxed text-ink-faint">
          Props: <code className="text-trace">size</code>,{' '}
          <code className="text-trace">state</code> (listening · idle),{' '}
          <code className="text-trace">pulse</code>,{' '}
          <code className="text-trace">squeeze</code>,{' '}
          <code className="text-trace">thinness</code>,{' '}
          <code className="text-trace">dotScale</code>,{' '}
          <code className="text-trace">dotGap</code>,{' '}
          <code className="text-trace">monotone</code>,{' '}
          <code className="text-trace">guides</code>,{' '}
          <code className="text-trace">kern</code>. Defaults are tuned for the site's nav and footer; override per-context with intention.
        </p>
      </Section>

      {/* Color */}
      <Section
        eyebrow="Color"
        title="Warm, restrained, semantic."
        kicker="No pure white, no pure black. Eight tokens — most of them connective. Red is the only red, green is the only green, and both are reserved for state, not styling."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOKENS.map((t) => (
            <Swatch key={t.name} token={t} />
          ))}
        </div>
      </Section>

      {/* Type */}
      <Section
        eyebrow="Type"
        title="Three voices, one rhythm."
        kicker="A custom mono carries the brand. JetBrains Mono carries the technical labels. A serif display carries the literary moments."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-sm border border-edge-subtle p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· Wordmark / Display Mono</p>
            <p className="mt-4" style={{ fontFamily: 'var(--font-talkie), ui-monospace, monospace', fontWeight: 500, fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.01em', color: 'var(--brand-wordmark-ink)' }}>
              talkie
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
              Talkie Medium · custom derivative of JetBrains Mono · dotless i with parametric foot
            </p>
          </div>
          <div className="rounded-sm border border-edge-subtle p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· UI Mono</p>
            <p className="mt-4 font-mono text-xl text-ink">
              RECORD · LOCAL · AUDIT
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
              JetBrains Mono · 0.20–0.28em tracking · uppercase for eyebrows and metadata
            </p>
          </div>
          <div className="rounded-sm border border-edge-subtle p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· Display Serif</p>
            <p className="mt-3 font-display text-2xl italic leading-tight text-ink">
              Your best ideas don't wait.
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
              Cormorant · italic for literary emphasis · sparingly, ≤ 15% of any view
            </p>
          </div>
        </div>
      </Section>

      {/* Voice */}
      <Section
        eyebrow="Voice"
        title="Spare. Modernist. A touch literary."
        kicker="The anchor line states the product without explaining it. Supporting lines stay short, particular, and confident. Never marketing-speak."
      >
        <ul className="space-y-5">
          {VOICE_LINES.map((line) => (
            <li
              key={line.text}
              className="flex items-baseline gap-5 border-b border-edge-subtle pb-5 last:border-b-0"
            >
              <span className="w-24 shrink-0 text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                · {line.kind}
              </span>
              <span
                className={
                  line.kind === 'anchor'
                    ? 'font-display text-2xl leading-tight tracking-[-0.01em] text-ink md:text-3xl'
                    : 'font-display text-lg italic leading-snug text-ink-muted md:text-xl'
                }
              >
                {line.text}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Motion */}
      <Section
        eyebrow="Motion"
        title="One motion per state."
        kicker="The Hot Mic pulses at 1 Hz when listening. Idle has no motion. No spinners, no decorative rotation, no parallax. If you can't say what a motion means, don't add it."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-sm border border-edge-subtle p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· Listening · 1.0 Hz opacity pulse</p>
            <div className="mt-8 flex items-center justify-center">
              <Wordmark size={96} state="listening" pulse />
            </div>
            <pre className="mt-8 overflow-x-auto rounded-sm border border-edge-subtle bg-canvas-alt p-4 text-[11px] leading-relaxed text-ink-muted">
{`@keyframes talkie-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }
}
.talkie-dot {
  animation: talkie-pulse 1000ms ease-in-out infinite;
}`}
            </pre>
          </div>
          <div className="rounded-sm border border-edge-subtle p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· Idle · No motion</p>
            <div className="mt-8 flex items-center justify-center">
              <Wordmark size={96} state="idle" />
            </div>
            <p className="mt-8 text-[11px] leading-relaxed text-ink-faint">
              The dot is Tape Tan, the wordmark is still. Stillness is a brand statement — the app doesn't fidget when it has nothing to say.
            </p>
          </div>
        </div>
      </Section>

      {/* Usage */}
      <Section
        eyebrow="Usage"
        title="Do, don't."
        kicker="A short list of rules that keep the brand recognizable. When in doubt, prefer restraint."
      >
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {DOS_AND_DONTS.map((rule, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-sm border border-edge-subtle p-5"
            >
              <span
                aria-hidden
                className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-[10px] font-mono uppercase tracking-widest"
                style={{
                  background: rule.ok
                    ? 'color-mix(in oklab, var(--brand-signal-green) 18%, transparent)'
                    : 'color-mix(in oklab, var(--brand-hot-mic) 14%, transparent)',
                  color: rule.ok ? 'var(--brand-signal-green)' : 'var(--brand-hot-mic)',
                }}
              >
                {rule.ok ? '✓' : '×'}
              </span>
              <span className="text-[12px] leading-relaxed text-ink">{rule.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Assets */}
      <Section
        eyebrow="Assets"
        title="Receipts you can ship."
        kicker="The wordmark and font, packaged. If you need a variant that isn't here, ping @talkie-brand on Scout or open an issue against this page."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-sm border border-edge-subtle p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· Font</p>
            <p className="mt-3 font-display text-xl text-ink">Talkie Medium v6</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
              Embedded version: <code className="text-trace">Talkie Medium v6 · 2026-05-14</code>. Loaded via next/font/local; available as <code className="text-trace">--font-talkie</code>.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Source: <span className="text-trace">/public/fonts/Talkie-Medium.ttf</span>
            </p>
          </div>
          <div className="rounded-sm border border-edge-subtle p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· Wordmark · SVG</p>
            <p className="mt-3 font-display text-xl text-ink">Inline component</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
              Use <code className="text-trace">&lt;Wordmark /&gt;</code> from <code className="text-trace">components/brand/Wordmark.jsx</code>. Renders inline SVG at any size; theme-aware ink; parametric squeeze, thinness, dot.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Status: <span className="text-trace">stable</span>
            </p>
          </div>
          <div className="rounded-sm border border-edge-subtle p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-subtle">· Static exports</p>
            <p className="mt-3 font-display text-xl text-ink">Coming</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
              Pre-rendered SVG / PNG / favicon / OG image for the wordmark are next on @talkie-brand's queue. File a request via Scout if you need a specific variant.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Status: <span className="text-trace">in progress</span>
            </p>
          </div>
        </div>
      </Section>

      {/* Footer note */}
      <section className="border-t border-edge-subtle bg-canvas-alt py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.24em] text-ink-subtle md:flex-row md:items-center md:justify-between">
            <span>· Custody · @talkie-brand · /docs/specs/brand-page.md</span>
            <span>Wordmark v6 · 2026-05-14</span>
          </div>
        </div>
      </section>
    </article>
  )
}
