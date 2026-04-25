import Link from 'next/link'
import { Check, Mail, Sparkles, Laptop, Smartphone, ArrowRight } from 'lucide-react'

/**
 * /v2/thank-you — confirmation page on the oscilloscope canvas.
 *
 * Pure server component. The donor (`components/ThankYouPage.jsx`) had
 * no interactive state, just animated decorations — so this re-author
 * keeps every content beat (confirmation, two next-steps, two download
 * surfaces, back-home link) but trades the corner brackets and rounded
 * pulse-dot for the v2 phosphor aesthetic.
 */

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
const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }
const TRACE_GLOW_DOT = { boxShadow: '0 0 6px var(--trace)' }
const HEADLINE_PHOSPHOR = {
  textShadow: '0 0 18px var(--trace-glow), 0 0 6px var(--trace-glow)',
}

const NEXT_STEPS = [
  {
    icon: Mail,
    title: 'Check your inbox.',
    body: 'Confirmation signal incoming. Add hello@usetalkie.com to your contacts so it lands cleanly.',
  },
  {
    icon: Sparkles,
    title: 'Early access + launch discount.',
    body: 'You will be among the first invited before the public broadcast.',
  },
]

export default function ThankYouPage() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col items-center justify-center px-4 py-20 md:px-6 md:py-28">
        {/* Status strip */}
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
          <span aria-hidden className="inline-block h-px w-8" style={{ background: 'var(--trace-dim)' }} />
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-trace" style={TRACE_GLOW_DOT} />
          <span>SIGNAL · CONFIRMED</span>
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-trace" style={TRACE_GLOW_DOT} />
          <span aria-hidden className="inline-block h-px w-8" style={{ background: 'var(--trace-dim)' }} />
        </div>

        {/* Phosphor check */}
        <div
          className="mt-8 inline-flex h-16 w-16 items-center justify-center rounded-full border border-edge"
          style={{
            background: 'color-mix(in oklab, var(--trace) 8%, transparent)',
            boxShadow: '0 0 24px var(--trace-glow), inset 0 0 12px var(--trace-glow)',
          }}
        >
          <Check
            className="h-7 w-7 text-trace"
            strokeWidth={2.5}
            style={{ filter: 'drop-shadow(0 0 6px var(--trace-glow))' }}
            aria-hidden
          />
        </div>

        {/* Headline */}
        <h1 className="mt-8 text-center font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
          You&apos;re{' '}
          <span className="italic text-trace" style={HEADLINE_PHOSPHOR}>
            on the list.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-center text-[15px] leading-relaxed text-ink-muted">
          Thanks for your interest in Talkie. We&apos;re building something local-first and
          carefully tuned — you&apos;ll be among the first to hear it.
        </p>

        {/* What happens next */}
        <div className="mt-14 w-full">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
            <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--trace-dim)' }} />
            <span>· WHAT HAPPENS NEXT</span>
            <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--edge-subtle)' }} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {NEXT_STEPS.map((step) => (
              <NextStep key={step.title} step={step} />
            ))}
          </div>
        </div>

        {/* Download surfaces */}
        <div className="mt-12 w-full">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
            <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--trace-dim)' }} />
            <span>· GET TALKIE NOW</span>
            <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--edge-subtle)' }} />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://app.usetalkie.com/dl"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-edge px-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
              style={{
                background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                textShadow: '0 0 6px var(--trace-glow)',
              }}
            >
              <Laptop className="h-3.5 w-3.5" aria-hidden />
              DOWNLOAD · MAC
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="https://app.usetalkie.com/testflight"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-edge-dim px-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink hover:border-edge"
            >
              <Smartphone className="h-3.5 w-3.5" aria-hidden />
              TESTFLIGHT · iPHONE
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        {/* Bottom rule + back link */}
        <div className="mt-14 flex w-full items-center gap-4">
          <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
            style={TRACE_GLOW_DOT}
          />
          <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
        </div>

        <Link
          href="/v2"
          className="group mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-ink-muted transition-colors hover:text-trace"
        >
          BACK TO HOME
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>

        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
          QUESTIONS? REACH OUT ANYTIME.
        </p>
      </div>
    </section>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function NextStep({ step }) {
  const Icon = step.icon
  return (
    <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE_FINE} />
      <div className="relative flex items-start gap-4">
        <div
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border border-edge"
          style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
        >
          <Icon
            className="h-4 w-4 text-trace"
            style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
            aria-hidden
          />
        </div>
        <div>
          <h3 className="font-display text-base font-normal leading-snug tracking-[-0.01em] text-ink">
            {step.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{step.body}</p>
        </div>
      </div>
    </div>
  )
}
