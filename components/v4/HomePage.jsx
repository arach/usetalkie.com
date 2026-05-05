import Link from 'next/link'
import {
  Mic,
  Laptop,
  Wand2,
  Search,
  Layers,
  Terminal,
  HardDrive,
  Cloud,
  Cpu,
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react'
import SignalTable from '../SignalTable'
import capturesCatalog from '../../content/captures.json'
import PanoramicHero from './PanoramicHero'
import OsciStyleToggle from './OsciStyleToggle'

/**
 * v4 HomePage — synthesis composition.
 *
 * Hero is a single panoramic instrument (PanoramicHero) that integrates
 * keyboard-key + use-case examples + install affordance + animated
 * scope + device screenshot into one orchestrated chassis. The brief's
 * "tight, concise top" is collapsed into ONE panel — input bay, scope
 * bay, output bay sit side-by-side and morph together when the device
 * rotates.
 *
 * Below the hero chassis:
 *   - SignalTable as the "data buffer" — second instrument on the
 *     same workbench. Donor screenshots gallery is intentionally
 *     dropped here; the hero already shows one screenshot per device
 *     in the OUTPUT bay, and the SignalTable provides the "what
 *     real captures look like" texture without needing more thumbnails.
 *   - InstallCard (CLI patch-bay) as the developer rail.
 *   - Capture modes / flow / ownership / pricing / CTA sit on cream
 *     canvas with amber accents (eyebrows, FlowStep numbers, pricing
 *     $0) — flipping from trace to amber per the brief's chrome rule.
 */

// -----------------------------------------------------------------------------
// Content data (forks v2 — donor URLs go to /v4 to keep nav scope tight)
// -----------------------------------------------------------------------------

const CAPTURE_MODES = [
  {
    icon: Mic,
    eyebrow: 'CAPTURE',
    title: 'Catch the thought before it mutates.',
    body: 'Record on iPhone, Apple Watch, or Mac and keep the full transcript in the same system.',
    href: '/mobile',
  },
  {
    icon: Laptop,
    eyebrow: 'DICTATION',
    title: 'Speak straight into the work.',
    body: 'Global shortcuts on Mac dictate into the app you are already using — no switching tools.',
    href: '/mac',
  },
  {
    icon: Wand2,
    eyebrow: 'COMPOSE',
    title: 'Structure it after the moment.',
    body: 'Rewrite, expand, summarize, and compare edits once the raw idea is safely recorded.',
    href: '/mac',
  },
  {
    icon: Search,
    eyebrow: 'RECOVERY',
    title: 'Recover the full thread later.',
    body: 'Search across memos and dictations, with app context attached when capture starts on desktop.',
    href: '/docs/cli',
  },
  {
    icon: Layers,
    eyebrow: 'WORKFLOWS',
    title: 'Turn raw speech into useful output.',
    body: 'Route captures into summaries, task lists, files, and follow-up actions without copy-paste.',
    href: '/docs/workflows',
  },
  {
    icon: Terminal,
    eyebrow: 'CLI',
    title: 'Keep the advanced layer open.',
    body: 'Query your voice data from scripts and tools instead of trapping it inside a single interface.',
    href: '/docs/cli',
  },
]

const FLOW_STEPS = [
  {
    id: '01',
    title: 'Capture in the cheapest mode.',
    body: 'Use the lowest-friction input available: iPhone, Watch, Mac memo, or keyboard dictation.',
  },
  {
    id: '02',
    title: 'Recover the surrounding context.',
    body: 'Talkie remembers the transcript, time, app, and project clues that make a later search actually useful.',
  },
  {
    id: '03',
    title: 'Turn it into output when you are ready.',
    body: 'Summaries, tasks, cleaned-up notes, diffs, and workflows happen after the idea is safely stored.',
  },
]

const OWNERSHIP_CARDS = [
  {
    icon: HardDrive,
    pin: 'U1',
    title: 'Local-first library',
    body: 'Recordings and transcripts live on your devices instead of disappearing into a database we control.',
  },
  {
    icon: Cloud,
    pin: 'U2',
    title: 'Sync through your iCloud',
    body: 'When devices stay in step, the sync path runs through Apple’s infrastructure and your Apple ID.',
  },
  {
    icon: Cpu,
    pin: 'U3',
    title: 'Models on your terms',
    body: 'On-device models, bring your own provider, or fully offline workflows — privacy or convenience, your call.',
  },
]

const OWNERSHIP_PILLS = [
  'On-device transcription',
  'Encrypted iCloud sync',
  'Searchable memos + dictations',
  'No vendor lock-in',
]

// -----------------------------------------------------------------------------
// Reusable inline-style fragments
// -----------------------------------------------------------------------------

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

// Amber takes over the chrome on cream surfaces (per brief): eyebrows,
// FlowStep numbers, pricing $0, header live dot. This makes the cream
// canvas a chromatic event without bleeding phosphor into light mode.
const AMBER_GLOW_SOFT = { textShadow: '0 0 4px rgba(196, 125, 28, 0.32)' }
const AMBER_GLOW_DOT = { boxShadow: '0 0 6px rgba(196, 125, 28, 0.45)' }
const AMBER_TINT = { background: 'color-mix(in oklab, var(--amber) 8%, transparent)' }
const AMBER_TINT_SUBTLE = { background: 'color-mix(in oklab, var(--amber) 5%, transparent)' }

// In dark mode, --amber maps to the brighter #ffb84d, so the same
// glow values on text-amber phosphor through naturally. We rely on
// the var.

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <OsciStyleToggle />
      {/* ========== HERO — PANORAMIC INSTRUMENT ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas font-mono">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          {/* Donor-shape hero leads with the product proposition (the H1
              and placard live inside PanoramicHero now, since they're
              tied to the rotating device state). The chassis below is
              the deeper structure — instrument as evidence, not as
              headline. */}
          <PanoramicHero />

          {/* Brand callback — the original "selfie / thoughts" line
              moves here as a small italic signoff, so it lands as a
              memorable closer instead of competing with "Talk to your
              {device}" for the lead. */}
          <p className="mt-10 text-center font-display text-[clamp(1rem,1.5vw,1.25rem)] italic leading-relaxed text-ink-dim md:mt-14">
            <span aria-hidden className="mr-3 inline-block align-middle text-ink-faint not-italic">·</span>
            It's like a selfie. For your thoughts.
            <span aria-hidden className="ml-3 inline-block align-middle text-ink-faint not-italic">·</span>
          </p>
        </div>
      </section>

      {/* ========== DATA BUFFER · SIGNAL TABLE ========== */}
      <section
        id="capture"
        className="relative border-t border-edge-faint bg-canvas-alt font-mono"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · 01 / DATA BUFFER
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              What the instrument actually captures.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Every clip is a real capture. Press play to hear the voice, watch the engine transcribe, and see where it lands.
            </p>
          </div>

          <div className="mt-10">
            <SignalTable catalog={capturesCatalog} />
          </div>
        </div>
      </section>

      {/* ========== CAPTURE MODES ========== */}
      <section
        id="modes"
        className="relative border-t border-edge-faint bg-canvas font-mono"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · 02 / CAPTURE MODES
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              One voice path. <span className="italic text-ink-muted">More than one use.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Talkie can start as a quick note, a dictated paragraph, a search query, or the start of a workflow. Voice for its own sake is not the point — moving work forward is.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {CAPTURE_MODES.map((m, i) => (
              <CaptureModeCard key={m.title} mode={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== RECOVERY FLOW ========== */}
      <section
        id="context"
        className="relative border-t border-edge-faint bg-canvas-alt font-mono"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · 03 / RECOVERY FLOW
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Voice notes are easy to save.
              <br />
              <span className="italic text-ink-muted">Harder to use.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Talkie keeps enough of the moment intact that coming back later feels less like archaeology and more like picking work back up.
            </p>
          </div>

          <div className="mt-14 space-y-0">
            {FLOW_STEPS.map((step) => (
              <FlowStep key={step.id} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== OWNERSHIP / ARCHITECTURE ========== */}
      <section
        id="ownership"
        className="relative border-t border-edge-faint bg-canvas font-mono"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · 04 / OWNERSHIP
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Your voice stays on your side.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Library lives on your devices. Sync runs through your iCloud. On-device transcription is available. External providers are opt-in and use your keys.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {OWNERSHIP_CARDS.map((card) => (
              <OwnershipCard key={card.title} card={card} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {OWNERSHIP_PILLS.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-sm border border-edge-dim bg-surface px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ink-muted"
              >
                <ShieldCheck
                  className="h-3 w-3"
                  style={{ color: 'var(--amber)', filter: 'drop-shadow(0 0 3px rgba(196,125,28,0.32))' }}
                />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/security"
              className="inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] transition-all hover:-translate-y-0.5"
              style={{
                color: 'var(--amber)',
                ...AMBER_TINT,
                ...AMBER_GLOW_SOFT,
              }}
            >
              READ THE ARCHITECTURE <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section
        id="pricing"
        className="relative border-t border-edge-faint bg-canvas-alt font-mono"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · 05 / PRICING
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Free while we build.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Talkie is free. No plans to change that for the basic utilities — and the local-first promise stays non-negotiable either way.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
            {/* Free plan card */}
            <div className="relative overflow-hidden rounded-md border border-edge bg-surface p-8">
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: 'var(--amber)', ...AMBER_GLOW_DOT }}
                    />
                    PLAN · FREE / OPEN BUILD
                  </div>
                  <span
                    className="rounded-sm border border-edge px-2 py-0.5 text-[9px] uppercase tracking-[0.22em]"
                    style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
                  >
                    AVAILABLE NOW
                  </span>
                </div>

                <div className="mt-6 flex items-baseline gap-3">
                  <span
                    className="font-display text-6xl font-normal tracking-[-0.02em]"
                    style={{
                      color: 'var(--amber)',
                      textShadow:
                        '0 0 18px rgba(196,125,28,0.35), 0 0 6px rgba(196,125,28,0.45)',
                    }}
                  >
                    $0
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.22em] text-ink-faint">
                    / per month · indefinitely while in beta
                  </span>
                </div>

                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    'Full Mac, iPhone & Watch app access',
                    'On-device transcription (Apple Silicon)',
                    'Encrypted iCloud sync via your Apple ID',
                    'Workflows + CLI + audit trail',
                    'Bring your own provider keys',
                    'No telemetry tied to your content',
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-muted"
                    >
                      <span
                        className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full"
                        style={{ background: 'var(--amber)', ...AMBER_GLOW_DOT }}
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/downloads"
                    className="inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] transition-all hover:-translate-y-0.5"
                    style={{
                      color: 'var(--amber)',
                      ...AMBER_TINT,
                      ...AMBER_GLOW_SOFT,
                      boxShadow: '0 0 18px color-mix(in oklab, var(--amber) 12%, transparent)',
                    }}
                  >
                    DOWNLOAD · MAC <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href="/mobile"
                    className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink hover:border-edge"
                  >
                    iPHONE & WATCH <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className="rounded-md border border-edge-dim bg-surface p-6">
              <p
                className="text-[10px] uppercase tracking-[0.26em]"
                style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
              >
                · ROADMAP
              </p>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.15] tracking-[-0.01em] text-ink">
                Honest pricing, when the time comes.
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                No plans to charge today. If that changes, it&rsquo;ll be for advanced and power-user features — never the basic utilities. Local-first stays non-negotiable, regardless.
              </p>

              <ul className="mt-6 space-y-3 text-[12px] text-ink-muted">
                {[
                  ['ALWAYS', 'Basic utilities · free, no exceptions'],
                  ['MAYBE', 'Pro tier · advanced + power-user features'],
                  ['NEVER', 'Selling your voice or transcripts'],
                ].map(([tag, desc]) => (
                  <li key={tag} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block rounded-sm border border-edge-dim px-1.5 py-0.5 text-[8px] uppercase tracking-[0.22em] text-ink-faint">
                      {tag}
                    </span>
                    <span className="leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section
        id="get"
        className="relative border-t border-edge-faint bg-canvas font-mono"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            <div className="relative overflow-hidden rounded-md border border-edge bg-surface p-8">
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />
              <div className="relative">
                <p
                  className="text-[10px] uppercase tracking-[0.26em]"
                  style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
                >
                  · READY TO INSTALL
                </p>
                <h3 className="mt-3 font-display text-3xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                  Start with your Mac.
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                  iPhone and Watch help you catch the thought. Mac is where Talkie earns its keep. DMG, App Store, or a single CLI command.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/downloads"
                    className="inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] transition-all hover:-translate-y-0.5"
                    style={{
                      color: 'var(--amber)',
                      ...AMBER_TINT,
                      ...AMBER_GLOW_SOFT,
                      boxShadow: '0 0 18px color-mix(in oklab, var(--amber) 12%, transparent)',
                    }}
                  >
                    DOWNLOAD FOR MAC <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link
                    href="/security"
                    className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink hover:border-edge"
                  >
                    HOW PRIVACY WORKS <Lock className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/philosophy"
              className="group block rounded-md border border-edge bg-surface p-8 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim"
                />
                <span className="text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  FURTHER READING
                </span>
              </div>
              <h3 className="mt-3 font-display text-3xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                Why local-first matters.
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                The philosophy behind a tool that stays out of your way and keeps your voice on your side. Keep reading <span aria-hidden>→</span>
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// -----------------------------------------------------------------------------
// Sub-components — capture mode card, flow step (amber-on-cream), ownership card
// -----------------------------------------------------------------------------

function CaptureModeCard({ mode, index }) {
  const Icon = mode.icon
  const ch = String(index + 1).padStart(2, '0')
  return (
    <Link
      href={mode.href}
      className="group relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5 transition-all hover:-translate-y-0.5"
      style={{ '--hover-border': 'var(--amber)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
              style={AMBER_TINT_SUBTLE}
            >
              <Icon
                className="h-4 w-4"
                style={{
                  color: 'var(--amber)',
                  filter: 'drop-shadow(0 0 4px rgba(196,125,28,0.32))',
                }}
              />
            </div>
            <span className="text-[9px] uppercase tracking-[0.24em] text-ink-faint">
              {mode.eyebrow}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            CH-{ch}
          </span>
        </div>

        <div className="mt-4 h-px w-full bg-edge-subtle" />

        <h3 className="mt-4 font-display text-lg font-normal leading-snug tracking-[-0.01em] text-ink">
          {mode.title}
        </h3>
        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink-muted">{mode.body}</p>

        <div className="mt-5 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-ink-faint transition-colors">
          EXPLORE
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}

function FlowStep({ step }) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-edge-faint py-10 md:grid-cols-[140px_1fr] md:gap-10 md:py-12">
      <div>
        <div
          className="font-display text-5xl font-normal leading-none tracking-[-0.04em] opacity-95"
          style={{
            color: 'var(--amber)',
            textShadow:
              '0 0 18px rgba(196,125,28,0.30), 0 0 6px rgba(196,125,28,0.40)',
          }}
        >
          {step.id}
        </div>
        <div
          className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]"
          style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
        >
          <span
            aria-hidden
            className="inline-block h-px w-6"
            style={{ background: 'color-mix(in oklab, var(--amber) 40%, transparent)' }}
          />
          STAGE · {step.id}
        </div>
      </div>
      <div>
        <h3 className="font-display text-2xl font-normal leading-snug tracking-[-0.01em] text-ink md:text-3xl">
          {step.title}
        </h3>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">{step.body}</p>
      </div>
    </div>
  )
}

function OwnershipCard({ card }) {
  const Icon = card.icon
  return (
    <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
            style={AMBER_TINT_SUBTLE}
          >
            <Icon
              className="h-4 w-4"
              style={{
                color: 'var(--amber)',
                filter: 'drop-shadow(0 0 4px rgba(196,125,28,0.32))',
              }}
            />
          </div>
          <span
            className="rounded-sm border border-edge-dim px-1.5 py-0.5 text-[9px] uppercase tracking-[0.22em]"
            style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
          >
            {card.pin}
          </span>
        </div>

        <h3 className="mt-5 font-display text-xl font-normal leading-snug tracking-[-0.01em] text-ink">
          {card.title}
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{card.body}</p>
      </div>
    </div>
  )
}
