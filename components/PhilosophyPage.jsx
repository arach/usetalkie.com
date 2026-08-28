import Link from 'next/link'
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
            · WHY TALKIE EXISTS
          </p>

          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Your agents needed<br />
            <span className="italic text-trace" style={HEADLINE_PHOSPHOR}>
              a remote control.
            </span>
          </h1>

          <p className="philo-lede mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            The original insight behind Talkie was not about dictation. It was about directing
            agents when the Mac was out of reach. A helpful agent waits inside an app. A remote
            control lets you send the instruction, carry the context, and follow the result from
            wherever the work starts.
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
              label="ORIGIN"
              heading="The problem was not dictation."
              body="Agents could do useful work, but directing them still meant returning to the Mac, opening the right tool, and moving the context by hand."
            />
            <ObservationCard
              code="002"
              label="CONTEXT"
              heading="The instruction was not enough."
              body="Remote use exposed the next problem. An agent needs the app, file, screen, history, and destination that give the instruction meaning."
            />
            <ObservationCard
              code="003"
              label="THROUGHPUT"
              heading="Speed only helps when context survives."
              body="Talkie keeps intent and context together so an agent can act without another round of explanation."
              highlight
            />
          </div>
        </div>
      </section>

      {/* ========== EVOLUTION ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-10" style={{ background: 'var(--trace-dim)' }} />
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
              EVOLUTION
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <h2 className="max-w-[13ch] font-display text-4xl font-normal leading-[1.04] tracking-[-0.02em] text-ink md:text-5xl">
              From remote control to a context layer.
            </h2>

            <div className="space-y-6 text-[15px] leading-relaxed text-ink-muted">
              <p>
                The first version needed to do one thing: let a person direct an agent without
                returning to the Mac. That made voice useful, but it also exposed a larger
                requirement. Fast instructions fail when the surrounding context is missing.
              </p>
              <p>
                Over time, the relevant context kept expanding. It could be the active app,
                selected text, a screenshot, a file, a recording, a project, the device in hand,
                or the agent already doing the work.
              </p>
              <p className="text-ink">
                That is why Talkie grew beyond dictation and device sync. Capture, search,
                workflows, remote access, and agent handoff are parts of one system. The goal is
                high-throughput, contextual communication with agents.
              </p>
            </div>
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
            They read in order: the signal, the store, the system.
          </p>

          <PrinciplesSignalPath />
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
                · SPEED · OWNERSHIP · FLOW ·
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
                  caption: 'SPEED · OWNERSHIP · FLOW',
                  anchor: '#philosophy-pull-quote',
                }}
              >
                Hear it out loud
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

            <DownloadBay caption="Local-first voice capture. Your words stay on your devices." />
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

function PrinciplesSignalPath() {
  return (
    <div className="relative mt-16">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible text-trace lg:block"
        viewBox="0 0 1120 980"
        preserveAspectRatio="none"
      >
        <path
          d="M112 118 C112 250 126 300 238 323 C350 346 465 345 506 414"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.72"
          strokeWidth="1.4"
        />
        <path
          d="M548 617 C580 677 585 700 520 742 C488 763 482 795 542 830"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.72"
          strokeWidth="1.4"
        />
        <circle cx="112" cy="118" r="4" fill="currentColor" />
        <circle cx="506" cy="414" r="4" fill="currentColor" />
        <circle cx="548" cy="617" r="4" fill="currentColor" />
        <circle cx="542" cy="830" r="4" fill="currentColor" />
      </svg>

      <div className="absolute bottom-2 left-[15px] top-2 w-px bg-trace/45 lg:hidden" aria-hidden />

      <div className="relative grid min-h-[270px] grid-cols-1 gap-8 pb-16 pl-12 lg:min-h-[310px] lg:grid-cols-[190px_360px_1fr] lg:gap-8 lg:pb-0 lg:pl-0">
        <div className="relative flex items-start gap-5 lg:pt-10">
          <span
            aria-hidden
            className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-canvas bg-trace shadow-[0_0_0_6px_color-mix(in_oklab,var(--trace)_12%,transparent)] lg:hidden"
          />
          <SignalSource />
        </div>

        <PrincipleCopy
          label="DELIVERY"
          headline="Send the instruction, keep your place."
          body="Talkie carries your instruction and the context that gives it meaning to wherever the work runs, then brings the result back. You never relocate into another app to get something done."
          tag="SIGNAL · CLEAR"
        />
      </div>

      <div className="relative grid min-h-[350px] grid-cols-1 gap-10 pb-16 pl-12 lg:min-h-[350px] lg:grid-cols-[420px_210px_1fr] lg:items-center lg:gap-10 lg:pb-0 lg:pl-0">
        <div className="hidden lg:block" />
        <div className="relative">
          <span
            aria-hidden
            className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-canvas bg-trace shadow-[0_0_0_6px_color-mix(in_oklab,var(--trace)_12%,transparent)] lg:hidden"
          />
          <LocalStore />
        </div>

        <PrincipleCopy
          label="OWNERSHIP"
          headline="Own your voice, own your workflow."
          body="Your recordings and transcripts are yours. Not a training set, not a product. They live on your devices and leave only when you send them somewhere."
          tag="LOCAL · PRIVATE"
        />
      </div>

      <div className="relative grid min-h-[340px] grid-cols-1 gap-10 pl-12 lg:grid-cols-[390px_1fr] lg:items-center lg:gap-16 lg:pl-24">
        <div className="relative">
          <span
            aria-hidden
            className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-canvas bg-trace shadow-[0_0_0_6px_color-mix(in_oklab,var(--trace)_12%,transparent)] lg:hidden"
          />
          <PrincipleCopy
            label="COMPOSITION"
            headline="Compose your own system."
            body="Talkie uses small, composable parts. You and your agents connect tools, context, and workflows into the system the work requires."
            tag="COMPOSABLE"
          />
        </div>

        <WorkflowDiagram />
      </div>
    </div>
  )
}

function PrincipleCopy({ label, headline, body, tag }) {
  return (
    <div className="group max-w-xl self-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-trace">
        · {label}
      </p>
      <h3 className="mt-3 max-w-[16ch] font-display text-3xl font-normal leading-[1.08] tracking-[-0.02em] text-ink md:text-4xl">
        {headline}
      </h3>
      <p className="mt-4 max-w-[60ch] text-[14px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">
        {body}
      </p>
      <div className="mt-5 inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.24em] text-trace">
        <span aria-hidden className="h-px w-8 bg-trace/35 transition-all duration-300 group-hover:w-12" />
        <span>{tag}</span>
      </div>
    </div>
  )
}

function SignalSource() {
  const bars = [10, 21, 13, 27, 17, 34, 25, 12]
  return (
    <div className="w-[150px] text-trace">
      <p className="font-mono text-[9px] uppercase tracking-[0.24em]">· SOURCE</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-10 items-center gap-[3px]" aria-hidden>
          {bars.map((height, index) => (
            <span key={index} className="w-px bg-current opacity-70" style={{ height }} />
          ))}
        </div>
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-trace/25" aria-hidden>
          <span className="absolute inset-[7px] rounded-full border border-trace/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-trace shadow-[0_0_0_6px_color-mix(in_oklab,var(--trace)_14%,transparent)]" />
        </div>
      </div>
    </div>
  )
}

function LocalStore() {
  const rows = ['RECORDINGS', 'TRANSCRIPTS', 'CONTEXT', 'RULES']
  return (
    <div className="mx-auto w-full max-w-[190px] rounded-[88px] border border-trace/45 p-1 text-trace shadow-[0_14px_35px_-28px_var(--trace)]">
      <div className="overflow-hidden rounded-[82px] border border-trace/25 bg-canvas/90 py-5 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.24em]">LOCAL</p>
        <div className="mx-auto mt-4 flex h-[70px] w-[70px] items-center justify-center rounded-full border border-dashed border-trace/30" aria-hidden>
          <div className="flex items-center gap-[3px]">
            {[18, 30, 42, 28, 16].map((height, index) => (
              <span key={index} className="w-[2px] bg-current" style={{ height }} />
            ))}
          </div>
        </div>
        <div className="mt-4 divide-y divide-trace/15 border-y border-trace/15">
          {rows.map((row) => (
            <div key={row} className="py-2 font-mono text-[8px] uppercase tracking-[0.2em]">
              {row}
            </div>
          ))}
        </div>
        <span className="mx-auto mt-4 block h-1.5 w-1.5 rounded-full bg-trace" aria-hidden />
      </div>
    </div>
  )
}

function WorkflowDiagram() {
  const nodes = [
    { label: 'AGENT\nORCHESTRATOR', className: 'left-1/2 top-0 -translate-x-1/2' },
    { label: 'KNOWLEDGE\nBASES', className: 'right-0 top-[64px]' },
    { label: 'RESULTS\nDELIVERY', className: 'right-0 bottom-[58px]' },
    { label: 'RULES &\nPOLICIES', className: 'bottom-0 right-[23%]' },
    { label: 'TOOLS &\nAPIS', className: 'bottom-0 left-[23%]' },
    { label: 'VOICE\nINPUT', className: 'left-0 bottom-[58px]' },
  ]

  return (
    <div className="relative mx-auto h-[300px] w-full max-w-[520px] text-trace">
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 520 300" preserveAspectRatio="none">
        <path d="M260 144 L260 43 M285 144 L426 90 M286 160 L444 215 M274 174 L354 269 M246 174 L165 269 M235 160 L78 215" fill="none" stroke="currentColor" strokeDasharray="3 4" strokeOpacity="0.35" />
        <path d="M78 215 H235 M286 215 H500" fill="none" stroke="currentColor" strokeOpacity="0.7" />
        <circle cx="260" cy="144" r="5" fill="currentColor" />
        <circle cx="235" cy="215" r="4" fill="currentColor" />
        <circle cx="286" cy="215" r="4" fill="currentColor" />
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-[68px] w-[120px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-trace/40 bg-canvas text-center shadow-[0_0_0_5px_color-mix(in_oklab,var(--trace)_8%,transparent)] sm:h-[76px] sm:w-[150px]">
        <span className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] sm:text-[9px] sm:tracking-[0.18em]">WORKFLOW<br />DESIGNER</span>
      </div>

      {nodes.map((node) => (
        <div
          key={node.label}
          className={`absolute flex h-[48px] w-[82px] items-center justify-center rounded-lg border border-edge bg-canvas px-1 text-center font-mono text-[7px] uppercase leading-relaxed tracking-[0.08em] text-ink-muted sm:h-[54px] sm:w-[112px] sm:px-2 sm:text-[8px] sm:tracking-[0.14em] ${node.className}`}
        >
          {node.label.split('\n').map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </div>
      ))}
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
