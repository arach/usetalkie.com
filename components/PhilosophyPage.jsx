import Link from 'next/link'
import { Mic, Lock, Layers } from 'lucide-react'
import { NarrateTrigger } from './narrator'
import { supportingLine, TAGLINE_PHILOSOPHY } from '../content/tagline'
import DownloadBay from './DownloadBay'

/**
 * Philosophy — v2 oscilloscope canvas.
 *
 * Server component. Theme flips entirely via CSS variables on `html.dark`,
 * consumed through semantic Tailwind tokens (canvas, surface, ink, trace,
 * edge, etc.). Inline `style` is reserved for things tokens cannot express
 * cleanly: graticule background grids referencing `var(--trace-faint)`,
 * phosphor glow shadows referencing `var(--trace-glow)`, and the
 * deterministic SVG waveform that needs `currentColor`-style coloring.
 *
 * Sections: HERO · OBSERVATIONS · PRINCIPLES · PULL QUOTE · FOOTER TIE-BACK.
 */

const PRINCIPLES = [
  {
    n: '01',
    eyebrow: 'MINIMALISM',
    icon: Layers,
    headline: 'Tools should stay out of the way.',
    body: 'Small on purpose. No inboxes, no dashboards, no proprietary workflow. Just a quiet path from what you say to what you build.',
    tag: 'SIGNAL · CLEAR',
  },
  {
    n: '02',
    eyebrow: 'OWNERSHIP',
    icon: Lock,
    headline: 'Own your voice, own your workflow.',
    body: 'Own your thoughts. Own your tools. Your stuff is yours, not a training set.',
    tag: 'LOCAL · PRIVATE',
  },
  {
    n: '03',
    eyebrow: 'AGENCY',
    icon: Mic,
    headline: 'Wire up your own tools.',
    body: 'Lego, basically. Snap together what you need. Your data. Your tools. Your rules.',
    tag: 'YOUR TERMS',
  },
]

// Reused inline style fragments — declared once so the JSX stays readable.
const GRATICULE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
}
const GRATICULE_FINE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}
/* Text glows removed — letterforms render at their own weight without
 * phosphor halos (per the design polish pass that cleaned up the
 * install bays). Box-shadow constants on dots / components stay since
 * those give chrome depth, not letterform softening. */
const TRACE_GLOW_SOFT = {}
const TRACE_GLOW_DOT = { boxShadow: '0 0 6px var(--trace)' }
const TRACE_GLOW_DOT_SM = { boxShadow: '0 0 4px var(--trace)' }
const HEADLINE_PHOSPHOR = {}

export default function PhilosophyPage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
            ·{' '}
            <span
              aria-hidden
              className="relative inline-block text-amber/70"
            >
              PHILOSOPHY
              <span className="pointer-events-none absolute inset-x-0 top-1/2 h-[0.06em] -translate-y-1/2 bg-amber" />
            </span>
            {' '}THINKING
          </p>

          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Your best ideas don&apos;t wait<br />
            <span className="italic text-trace" style={HEADLINE_PHOSPHOR}>
              for you to sit down.
            </span>
          </h1>

          <p className="philo-lede mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Our ideas show up anywhere, at any time. On a walk, between meetings, in the middle of something
            unrelated. Builders know this rhythm well. Sparks arrive fast, unpolished, and usually at inconvenient
            times. And without a way to catch them in the moment, they slip away just as quickly.
          </p>

          <HeroWaveform />
        </div>
      </section>

      {/* ========== OBSERVATIONS ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-10" style={{ background: 'var(--trace-dim)' }} />
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
              OBSERVATIONS
            </p>
          </div>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            Three things we noticed.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            <ObservationCard
              code="001"
              label="DEVICES"
              heading="iPhone + Mac."
              body="Your iPhone is the perfect capture device — always on you, always ready. Your Mac is where raw ideas become real output."
            />
            <ObservationCard
              code="002"
              label="SILOS"
              heading="Apps, clouds & AI disconnect."
              body="Voice Memos trap ideas. AI clouds absorb them. Your thoughts get scattered, siloed, and locked in someone else's system."
            />
            <ObservationCard
              code="003"
              label="MISSING LINK"
              heading="Something essential is missing."
              body="A private, continuous flow between your voice and your tools."
              highlight
            />
          </div>
        </div>
      </section>

      {/* ========== PRINCIPLES ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-10" style={{ background: 'var(--trace-dim)' }} />
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
              PRINCIPLES
            </p>
          </div>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            Three things we care about.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Pick any one to read first; the others follow.
          </p>

          <div className="mt-14 space-y-0">
            {PRINCIPLES.map((p) => (
              <PrincipleStack key={p.n} principle={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== PULL QUOTE ========== */}
      <section id="philosophy-pull-quote" className="relative scroll-mt-20 border-t border-edge-faint bg-canvas-alt">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-32">
          <div className="mx-auto max-w-3xl">
            {/* Top rule with eyebrow */}
            <div className="flex items-center gap-4">
              <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
              <span
                className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
                style={TRACE_GLOW_SOFT}
              >
                · VELOCITY · SOVEREIGNTY · FLOW ·
              </span>
              <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
            </div>

            <blockquote
              className="relative mt-12 pl-6 md:pl-10"
              style={{
                borderLeft: '2px solid var(--amber)',
                boxShadow: 'inset 2px 0 12px -8px var(--trace-glow)',
              }}
            >
              <p className="font-display text-3xl font-normal italic leading-[1.18] tracking-[-0.02em] text-ink md:text-[40px]">
                Your voice is the fastest path from thought to action. Don&apos;t let the tools slow you down.
              </p>
            </blockquote>

            {/* Bottom rule with phosphor dot */}
            <div className="mt-12 flex items-center gap-4">
              <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                style={TRACE_GLOW_DOT}
              />
              <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
            </div>

            {/* Narrator demo — pill variant. Audio TBD; until the file
                lands the dock will surface "no audio yet" and the missing
                slug gets cached so retries no-op. Other variants
                (speaker, inline) are documented in NarrateTrigger.jsx. */}
            <div className="mt-10 flex justify-center">
              <NarrateTrigger
                variant="pill"
                clip={{
                  slug: 'philosophy-manifesto',
                  audio: '/captures/philosophy-manifesto.mp3',
                  vtt: '/captures/philosophy-manifesto.vtt',
                  caption: 'VELOCITY · SOVEREIGNTY · FLOW',
                  anchor: '#philosophy-pull-quote',
                }}
              >
                Hear the manifesto
              </NarrateTrigger>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER TIE-BACK ==========
          DownloadBay sits centered on the page canvas (no surrounding
          gray-tinted box, no two-column grid). The previous right-side
          "SEE IT IN ACTION · Talk to your Mac" tile read as filler —
          replaced with a small inline link below the bay for users who
          want the full Mac page. */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
            {/* Tie-back link sits ABOVE the install bay so the flow reads
             * "here's the related Mac context, then here's how to install"
             * instead of "install, install, install, then... oh, learn more." */}
            <Link
              href="/mac"
              className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.26em] text-ink-subtle transition-colors hover:text-trace"
            >
              <span>See it in action on Mac</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>

            <DownloadBay caption="Voice capture, local-first, auditable signal path." />
          </div>
        </div>
      </section>
    </>
  )

  // Sub-components are declared at module scope below; this comment exists
  // so the JSX above reads top-to-bottom without forward-reference confusion.
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function ObservationCard({ code, label, heading, body, highlight = false }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-md border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-[0_0_22px_-6px_var(--trace-glow)] ${
        highlight ? 'border-edge' : 'border-edge-dim bg-surface'
      }`}
      style={
        highlight
          ? { background: 'color-mix(in oklab, var(--trace) 4%, transparent)' }
          : undefined
      }
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />
      <div className="relative">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle transition-colors duration-200 group-hover:text-amber">
          <span>
            {code} / {label}
          </span>
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-trace transition-transform duration-200 group-hover:scale-150"
            style={TRACE_GLOW_DOT_SM}
          />
        </div>

        <h3 className="mt-5 font-display text-xl font-normal leading-snug tracking-[-0.01em] text-ink">
          {heading}
        </h3>

        <p className="mt-3 text-[13px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">{body}</p>
      </div>
    </div>
  )
}

function PrincipleStack({ principle: p }) {
  const Icon = p.icon
  return (
    <div className="group relative border-t border-edge-subtle py-14 transition-colors duration-200 hover:border-edge md:py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr] md:gap-16">
        <div className="flex flex-col gap-3">
          <div className="font-display text-[56px] font-normal leading-none tracking-[-0.04em] text-trace opacity-80 transition-opacity duration-200 group-hover:opacity-100">
            {p.n}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
            · {p.eyebrow}
          </p>

          <div
            className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-edge transition-all duration-200 group-hover:scale-110 group-hover:border-amber/60"
            style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
          >
            <Icon
              className="h-4 w-4 text-trace transition-transform duration-200"
              aria-hidden
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="font-display text-3xl font-normal leading-snug tracking-[-0.02em] text-ink md:text-4xl">
            {p.headline}
          </h3>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">{p.body}</p>

          <div
            className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-trace"
            style={TRACE_GLOW_SOFT}
          >
            <span aria-hidden className="inline-block h-px w-8 transition-all duration-200 group-hover:w-12" style={{ background: 'var(--trace-dim)' }} />
            <span>{p.tag}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Static, deterministic waveform accent for the hero.
 * No randomness — same path on server and client, no hydration drift.
 * Uses `currentColor` so its stroke follows `text-trace` (the wrapping
 * span sets it), keeping theme-flip costless.
 */
function HeroWaveform() {
  const width = 320
  const height = 36
  const n = 120
  const points = []

  for (let i = 0; i < n; i++) {
    const nx = i / (n - 1)
    const envelope = Math.exp(-Math.pow((nx - 0.5) * 2.4, 2))
    const carrier =
      Math.sin(nx * 22 + 1.1) * 0.5 +
      Math.sin(nx * 47 + 3.3) * 0.28 +
      Math.sin(nx * 88 + 7.1) * 0.14
    const y = height / 2 - carrier * envelope * (height * 0.44)
    points.push(`${(nx * width).toFixed(2)},${y.toFixed(2)}`)
  }
  const pts = points.join(' ')

  return (
    <div className="mt-10 flex items-center gap-4">
      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
        SIGNAL
      </span>

      <span className="block max-w-xs text-trace opacity-70">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          preserveAspectRatio="none"
          aria-hidden
          className="block"
        >
          <line
            x1={0}
            x2={width}
            y1={height / 2}
            y2={height / 2}
            stroke="var(--trace-dim)"
            strokeWidth={1}
          />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={3}
            points={pts}
            style={{ filter: 'drop-shadow(0 0 3px var(--trace))' }}
          />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.9}
            strokeWidth={1.2}
            points={pts}
          />
        </svg>
      </span>

      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
        LOCAL
      </span>
    </div>
  )
}
