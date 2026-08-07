import Link from 'next/link'
import { Terminal, Code2, MonitorSmartphone, KeyRound } from 'lucide-react'
import SyncedSplit from './SyncedSplit'
import ProofDeck from './ProofDeck'
import CapabilityLedger from './CapabilityLedger'
import { CAPABILITY_COUNT } from '../../lib/capabilities'

/**
 * /remote — Talkie as a remote control for agents.
 *
 * A staging route, deliberately noindex, for the conversion of the
 * internal Feature Explorer study into public material. The upstream
 * critique picked the spine: the control-surface thesis carries the
 * page, the visual-context proof and the review boundary get imported
 * into it, and the builder material stays a deeper section rather than
 * the headline argument.
 *
 * The load-bearing constraint: lead with remote control without burying
 * dictation. Voice is not demoted here, it is placed. It is the fastest
 * way to press the button, said plainly in the hero, and then the page
 * spends its length on what the button is attached to.
 *
 * Only three islands ship JS (the seam, the proof tabs, the ledger).
 * Everything else is server-rendered.
 */

const GRATICULE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
}

const LOOP = ['YOU', 'TALKIE', 'AGENT', 'RESULT']

const PILLARS = [
  {
    tag: 'INPUT',
    title: 'Speak or type from anywhere',
    body: 'Global dictation and typed requests start from a hotkey in any app. You do not switch to a chat window to direct the work.',
  },
  {
    tag: 'CARRY',
    title: 'Context rides along',
    body: 'Spoken context, screenshots, and screen clips travel with the instruction, so the agent sees what you were looking at when you asked.',
  },
  {
    tag: 'RETURN',
    title: 'Results land where you work',
    body: 'Output returns to the app that was focused when you spoke, to a terminal, or through a route you choose. Not into a silo.',
  },
]

const BUILDER = [
  {
    icon: Terminal,
    label: 'CONSOLE',
    title: 'Tabbed agent sessions on the Mac',
    body: 'Local shells and agent harnesses run inside Talkie and stay open on tabs, so a session is somewhere you return to rather than something you re-open.',
  },
  {
    icon: Code2,
    label: 'CLI · SDK',
    title: 'Your records, addressable',
    body: 'Query memos, dictations, workflows, and captures from a terminal or a script. Results come back as JSON records or absolute paths, which is what an agent can actually use.',
  },
  {
    icon: KeyRound,
    label: 'SSH',
    title: 'A real terminal on the phone',
    body: 'Saved hosts, modifier keys, and inline dictation. It connects after you enable Remote Login on the Mac and put a key in place, and not before.',
  },
  {
    icon: MonitorSmartphone,
    label: 'WORKFLOWS',
    title: 'Instructions that become sequences',
    body: 'Portable JSON definitions run ordered steps: transcribe, generate, transform, evaluate, then deliver to a file, a webhook, a notification, or your phone.',
  },
]

export default function RemoteControlPage() {
  return (
    <div className="bg-canvas">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge-faint">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <ControlLoop />

          <h1 className="mt-10 max-w-3xl font-display text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-6xl">
            A remote control
            <br />
            for your{' '}
            <span className="italic text-trace" style={{ textShadow: '0 0 18px var(--trace-glow), 0 0 6px var(--trace-glow)' }}>
              agents.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Send the instruction, include the working context, and receive the result where the
            work already is.
          </p>

          {/* Voice, placed rather than buried. */}
          <div className="mt-8 flex max-w-2xl items-start gap-4 border-l-2 border-amber/50 pl-5">
            <p className="text-[15px] leading-relaxed text-ink-dim">
              Dictation is still the fastest way to press the button, and Talkie is very good at
              it. It was never the whole machine.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/downloads"
              className="inline-flex items-center gap-2 rounded-sm border border-edge px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60"
              style={{ background: 'color-mix(in oklab, var(--trace) 6%, transparent)' }}
            >
              DOWNLOAD · MAC <span aria-hidden>→</span>
            </Link>
            <a
              href="#channels"
              className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-edge hover:text-ink"
            >
              SEE ALL {CAPABILITY_COUNT} <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Three pillars ────────────────────────────────────────────── */}
      <section className="border-b border-edge-faint">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionLabel>THE CONTROL LOOP</SectionLabel>
          <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-edge-dim md:grid-cols-3" style={{ background: 'var(--edge-subtle)' }}>
            {PILLARS.map((pillar) => (
              <div key={pillar.tag} className="group bg-surface p-6 transition-colors duration-200 hover:bg-canvas-alt md:p-7">
                <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-amber">· {pillar.tag}</p>
                <h3 className="mt-4 font-display text-xl font-normal leading-snug tracking-[-0.01em] text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The instrument (dark band) ───────────────────────────────── */}
      <section className="border-b border-edge-faint bg-panel-bg">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-panel-ink-muted">
            <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--panel-edge-dim)' }} />
            <span>· THE INSTRUMENT</span>
            <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--panel-edge-faint)' }} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
            <div className="order-2 lg:order-1">
              <SyncedSplit />
            </div>
            <div className="order-1 lg:order-2 lg:pb-16">
              <h2 className="font-display text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-panel-ink md:text-4xl">
                The console you point it from.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-panel-ink-muted">
                Captures, dictations, memos, and agent sessions in one library on your Mac. Both
                recordings here are the same 47-second session, running at the same moment. Drag
                the seam and the appearance changes underneath the motion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof ────────────────────────────────────────────────────── */}
      <section className="border-b border-edge-faint">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionLabel>SHOWN, NOT DESCRIBED</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-display text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-ink md:text-4xl">
            Every frame below is the real app.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            No reconstructions, no mocked-up feature theater. Where a capability has a
            prerequisite or a boundary, it is stated next to the capture rather than in a
            footnote.
          </p>
          <div className="mt-10">
            <ProofDeck />
          </div>
        </div>
      </section>

      {/* ── The five channels ────────────────────────────────────────── */}
      <section id="channels" className="scroll-mt-16 border-b border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionLabel>THE FIVE CHANNELS</SectionLabel>
          <h2 className="mt-6 max-w-3xl font-display text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-ink md:text-4xl">
            The remote is one argument.
            <br />
            The instrument has{' '}
            <span className="italic text-trace" style={{ textShadow: '0 0 14px var(--trace-glow)' }}>
              five channels.
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Chat, Watch, Act, Run, and Connect. {CAPABILITY_COUNT} mapped capabilities, each one
            traced back to the code that implements it. Pick a channel.
          </p>
          <div className="mt-10">
            <CapabilityLedger />
          </div>
        </div>
      </section>

      {/* ── For builders ─────────────────────────────────────────────── */}
      <section className="border-b border-edge-faint">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionLabel>IF YOU BUILD WITH AGENTS</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-display text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-ink md:text-4xl">
            The controls are exposed.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {BUILDER.map((entry) => {
              const Icon = entry.icon
              return (
                <div
                  key={entry.label}
                  className="group flex gap-4 rounded-md border border-edge-dim bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/40 md:p-6"
                >
                  <div
                    className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border border-edge transition-all duration-200 group-hover:scale-110 group-hover:border-amber/60"
                    style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                  >
                    <Icon className="h-4 w-4 text-trace" style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">· {entry.label}</p>
                    <h3 className="mt-2 font-display text-lg font-normal leading-snug text-ink">{entry.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{entry.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Closer ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-24">
          <h2 className="font-display text-3xl font-normal leading-[1.08] tracking-[-0.02em] text-ink md:text-4xl">
            Push to direct.
            <br />
            Let go to keep working.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Talkie carries the request, the context, and the return path. You stay in the app you
            were already in.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/downloads"
              className="inline-flex items-center gap-2 rounded-sm border border-edge px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60"
              style={{ background: 'color-mix(in oklab, var(--trace) 6%, transparent)' }}
            >
              DOWNLOAD · MAC <span aria-hidden>→</span>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-edge hover:text-ink"
            >
              READ THE DOCS <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
      <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--trace-dim)' }} />
      <span>· {children}</span>
      <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--edge-subtle)' }} />
    </div>
  )
}

/**
 * The loop, drawn once at the top so the rest of the page has something
 * to hang off. It is a closed circuit, not a funnel — the return leg is
 * the part that makes it a remote rather than a microphone.
 */
function ControlLoop() {
  return (
    <div className="inline-block">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.24em]">
        {LOOP.map((node, index) => (
          <span key={node} className="flex items-center gap-3">
            <span className={index === 0 || index === LOOP.length - 1 ? 'text-amber' : 'text-ink-dim'}>{node}</span>
            {index < LOOP.length - 1 && (
              <span aria-hidden className="text-ink-subtle">
                →
              </span>
            )}
          </span>
        ))}
      </div>
      <div aria-hidden className="mt-2 flex items-center gap-2">
        <span className="block h-2 w-px" style={{ background: 'var(--amber)' }} />
        <span className="block h-px flex-1" style={{ background: 'color-mix(in oklab, var(--amber) 45%, transparent)' }} />
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">RETURNS TO WHERE YOU WERE</span>
        <span className="block h-px flex-1" style={{ background: 'color-mix(in oklab, var(--amber) 45%, transparent)' }} />
        <span className="block h-2 w-px" style={{ background: 'var(--amber)' }} />
      </div>
    </div>
  )
}
