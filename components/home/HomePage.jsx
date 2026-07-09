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
  Lock,
  ArrowRight,
} from 'lucide-react'
import SignalTable from '../SignalTable'
import capturesCatalog from '../../content/captures.json'
import PanoramicHero from './PanoramicHero'
import { getTourItems } from '../../lib/tour'

/**
 * HomePage — synthesis composition.
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
// Content data
// -----------------------------------------------------------------------------

const CAPTURE_MODES = [
  {
    icon: Mic,
    eyebrow: 'CAPTURE',
    title: 'Catch it before it changes.',
    body: 'Record on iPhone, Watch, or Mac. Transcript stays in one place.',
    href: '/mobile',
  },
  {
    icon: Laptop,
    eyebrow: 'DICTATION',
    title: 'Speak straight into the work.',
    body: "Hotkey on Mac. Dictate into whatever app you're already in.",
    href: '/mac',
  },
  {
    icon: Wand2,
    eyebrow: 'COMPOSE',
    title: 'Clean it up later.',
    body: "Rewrite, trim, expand — once the raw take is saved. It's not going anywhere.",
    href: '/mac',
  },
  {
    icon: Search,
    eyebrow: 'RECOVERY',
    title: 'Find it three weeks from now.',
    body: 'Search across everything you’ve said. Talkie remembers the app, the time, and the context.',
    href: '/docs/cli',
  },
  {
    icon: Layers,
    eyebrow: 'WORKFLOWS',
    title: 'Turn raw speech into stuff you can use.',
    body: 'Voice goes in. Summaries, tasks, and files come out.',
    href: '/docs/workflows',
  },
  {
    icon: Terminal,
    eyebrow: 'CLI',
    title: 'Script against it.',
    body: 'Your voice data has a CLI. Pipe it, query it, build on it.',
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
    body: 'Your recordings and transcripts stay on your devices. Not on someone else’s server.',
  },
  {
    icon: Cloud,
    pin: 'U2',
    title: 'Sync through your iCloud',
    body: 'Sync runs through your iCloud account. No third-party servers involved.',
  },
  {
    icon: Cpu,
    pin: 'U3',
    title: 'Models on your terms',
    body: 'On-device, bring-your-own-key, or fully offline. All three work.',
  },
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
const AMBER_GLOW_SOFT = { textShadow: '0 0 4px color-mix(in oklab, var(--amber) 32%, transparent)' }
const AMBER_GLOW_DOT = { boxShadow: '0 0 6px color-mix(in oklab, var(--amber) 45%, transparent)' }
const AMBER_TINT = { background: 'color-mix(in oklab, var(--amber) 8%, transparent)' }
const AMBER_TINT_SUBTLE = { background: 'color-mix(in oklab, var(--amber) 5%, transparent)' }

// In dark mode, --amber maps to the brighter #ffb84d, so the same
// glow values on text-amber phosphor through naturally. We rely on
// the var.

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function HomePage() {
  /* HScroll order is editorial, not lib/tour's authoring order:
   * Recording first (live waveform = terminal-shaped active state),
   * Library second (the memo list), Ready third (the capture-idle
   * state), then the rest in original order. */
  const IPHONE_HSCROLL_ORDER = [
    'iphone-recording',
    'iphone-library',
    'iphone-ready',
    'iphone-welcome',
    'iphone-memo-detail',
    'iphone-sync',
    'iphone-settings',
  ]
  const orderIndex = (slug) => {
    const i = IPHONE_HSCROLL_ORDER.indexOf(slug)
    return i === -1 ? Infinity : i
  }
  const iphoneItems = getTourItems()
    .filter((i) => i.platform === 'iphone')
    .sort((a, b) => orderIndex(a.slug) - orderIndex(b.slug))

  /* Mac HScroll — landscape aspect, smaller subset. Home / Recording /
   * Compose / Diff lead because they're the most narratively legible
   * screens (dashboard, the live HUD, compose, diff). */
  const MAC_HSCROLL_ORDER = [
    'mac-home',
    'mac-recording',
    'mac-compose',
    'mac-compose-diff',
    'mac-actions',
    'mac-models',
  ]
  const macOrder = (slug) => {
    const i = MAC_HSCROLL_ORDER.indexOf(slug)
    return i === -1 ? Infinity : i
  }
  const macItems = getTourItems()
    .filter((i) => i.platform === 'mac' && MAC_HSCROLL_ORDER.includes(i.slug))
    .sort((a, b) => macOrder(a.slug) - macOrder(b.slug))
  const watchItems = getTourItems().filter((i) => i.platform === 'watch')

  return (
    <>
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

        </div>
      </section>

      {/* ========== AGENT HANDOFF · SCREENSHOT PROOF ========== */}
      <section
        id="agent-handoff"
        className="relative overflow-hidden border-b border-edge-faint bg-canvas-alt font-mono"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35" style={GRATICULE} />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <div className="max-w-xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · AGENT HANDOFF
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
              Talk to Talkie. Your agents take it from there.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-muted">
              Speak a task in the app and Talkie hands it to your coding agent, ready to run.
            </p>
            <div className="mt-7">
              <Link
                href="/workflows"
                className="inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] transition-all hover:-translate-y-0.5"
                style={{
                  color: 'var(--amber)',
                  ...AMBER_TINT,
                  ...AMBER_GLOW_SOFT,
                }}
              >
                SEE WORKFLOWS <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <AgentHandoffFrame />
        </div>
      </section>

      {/* ========== MOBILE-ONLY HSCROLL · IPHONE / WATCH / MAC SCREENS ==========
          Phone-only visual proof between the textual hero and the
          richer Data Buffer below. Tablet+desktop already get the
          panoramic chassis as their visual anchor, so this section
          is `md:hidden` to keep the rich layout untouched. */}
      <section className="border-b border-edge-faint bg-canvas-alt py-7 md:hidden">
        <p className="px-4 text-[10px] uppercase tracking-[0.26em]" style={{ color: 'var(--amber)' }}>
          · ON YOUR iPHONE
        </p>

        <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {iphoneItems.map((item) => (
            <Link
              key={item.slug}
              href={`/tour/${item.slug}/`}
              className="group flex-shrink-0 snap-start"
            >
              <div className="w-[170px] overflow-hidden rounded-[1.5rem] border border-edge-dim bg-surface shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)] transition-transform active:scale-[0.97]">
                <img
                  src={item.src}
                  alt={item.title}
                  className="aspect-[9/19] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 px-1 text-center text-[9px] uppercase tracking-[0.22em] text-ink-faint">
                {item.title}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-8 px-4 text-[10px] uppercase tracking-[0.26em]" style={{ color: 'var(--amber)' }}>
          · ON YOUR WATCH
        </p>

        <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {watchItems.map((item) => (
            <Link
              key={item.slug}
              href={`/tour/${item.slug}/`}
              className="group flex-shrink-0 snap-start"
            >
              <div className="w-[142px] overflow-hidden rounded-[1.25rem] border border-edge-dim bg-surface shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)] transition-transform active:scale-[0.97]">
                <img
                  src={item.src}
                  alt={item.title}
                  className="aspect-[5/6] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 px-1 text-center text-[9px] uppercase tracking-[0.22em] text-ink-faint">
                {item.title}
              </p>
            </Link>
          ))}
        </div>

        {/* Mac strip — landscape cards, fewer items, sits right under
            the mobile HScrolls so the user sees every surface without
            scrolling far. Same snap behavior, wider cards (16/10
            aspect ratio mirrors mac screens). */}
        <p className="mt-8 px-4 text-[10px] uppercase tracking-[0.26em]" style={{ color: 'var(--amber)' }}>
          · ON YOUR MAC
        </p>

        <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {macItems.map((item) => (
            <Link
              key={item.slug}
              href={`/tour/${item.slug}/`}
              className="group flex-shrink-0 snap-start"
            >
              <div className="w-[280px] overflow-hidden rounded-[1.25rem] border border-edge-dim bg-surface shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)] transition-transform active:scale-[0.97]">
                <img
                  src={item.src}
                  alt={item.title}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 px-1 text-center text-[9px] uppercase tracking-[0.22em] text-ink-faint">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== CAPTURES · SIGNAL TABLE ========== */}
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
              · CAPTURES
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              What it might sound like.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              AI-simulated recordings. Max and Sarah are fictional to protect{' '}
              <span className="italic">Claude&rsquo;s</span> privacy.
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
              · CAPTURE MODES
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              One voice{' '}
              <span
                aria-hidden
                className="relative inline-block text-amber/70"
              >
                substrate
                <span className="pointer-events-none absolute inset-x-0 top-[60%] h-[0.06em] -translate-y-1/2 bg-amber" />
              </span>{' '}
              thingie. <span className="italic text-ink-muted">Works everywhere.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              A capture can become a note, a draft, a search, or the start of a workflow. Say it once, then use it where it belongs.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {CAPTURE_MODES.slice(0, 3).map((m, i) => (
              <CaptureModeCard key={m.title} mode={m} index={i} />
            ))}
            <div className="hidden md:contents">
              {CAPTURE_MODES.slice(3).map((m, i) => (
                <CaptureModeCard key={m.title} mode={m} index={i + 3} />
              ))}
            </div>
          </div>

          {/* Mobile-only escape hatch — last 3 modes (Recovery / Workflows /
              CLI) are hidden above to keep the section from sprawling on
              iPhone; this points to the full tour. */}
          <div className="mt-6 md:hidden">
            <Link
              href="/tour"
              className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:border-edge hover:text-ink"
            >
              MORE MODES <ArrowRight className="h-3 w-3" />
            </Link>
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
              · PRIVATE SYNC
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
              · OWNERSHIP
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Your voice stays yours.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Everything lives on your devices, syncs through your iCloud, transcribes on the chip you already paid for. External models are opt-in — your keys, not ours.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {OWNERSHIP_CARDS.map((card) => (
              <OwnershipCard key={card.title} card={card} />
            ))}
          </div>

          <Link
            href="/security"
            className="group mt-10 block overflow-hidden rounded-md border border-edge-dim bg-surface transition-all hover:-translate-y-0.5 hover:border-edge"
          >
            <div className="flex items-center justify-between border-b border-edge-faint px-4 py-3 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-faint">
              <span>· Security architecture</span>
              <span
                className="transition-colors group-hover:text-ink"
                style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
              >
                Security →
              </span>
            </div>
            <div className="relative overflow-hidden p-5 md:p-6">
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE_FINE} />
              <div className="relative grid grid-cols-1 gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
                <SecurityNode label="Your devices" detail="local library" />
                <SecurityArrow />
                <SecurityNode label="Your iCloud" detail="private sync" />
                <SecurityArrow />
                <SecurityNode label="External models" detail="opt-in · your keys" muted />
              </div>
            </div>
          </Link>

          <div className="mt-10">
            <Link
              href="/security"
              className="inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] transition-all hover:-translate-y-0.5"
              style={{
                color: 'var(--amber)',
                ...AMBER_TINT,
                ...AMBER_GLOW_SOFT,
              }}
            >
              READ HOW IT&apos;S WIRED <span aria-hidden>→</span>
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
              · PRICING
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Free while we build.
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
              Free. If that ever changes, it&rsquo;ll be for power-user features — never the core local utility.
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
                </div>

                <div className="mt-6">
                  <span
                    className="font-display text-6xl font-normal tracking-[-0.02em]"
                    style={{
                      color: 'var(--amber)',
                      textShadow:
                        '0 0 18px color-mix(in oklab, var(--amber) 35%, transparent), 0 0 6px color-mix(in oklab, var(--amber) 45%, transparent)',
                    }}
                  >
                    $0
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
                No plans to charge today. If that changes, it&rsquo;ll cover advanced features — never the core local utility.
              </p>

              <ul className="mt-6 space-y-3 text-[12px] text-ink-muted">
                {[
                  ['ALWAYS', 'Core tool · free, no exceptions'],
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
                The philosophy behind a little app that stays out of your way and keeps your voice on your side. Keep reading <span aria-hidden>→</span>
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// -----------------------------------------------------------------------------
// Sub-components — agent handoff frame, capture mode card, flow step, ownership card
// -----------------------------------------------------------------------------

function AgentHandoffFrame() {
  return (
    <figure className="relative">
      <div className="relative overflow-hidden rounded-md border border-edge bg-surface shadow-[0_18px_60px_-30px_rgba(0,0,0,0.55)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-55" style={GRATICULE_FINE} />

        <div className="relative flex min-h-8 items-center justify-between gap-3 border-b border-edge-dim px-3 text-[8px] uppercase tracking-[0.26em] text-ink-faint sm:px-4">
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: 'var(--amber)', ...AMBER_GLOW_DOT }}
            />
            <span className="truncate">RUNNING · AG-01 / VOICE.IN</span>
          </span>
          <span className="hidden text-ink-subtle sm:inline">SPEC · ON&nbsp;&nbsp;10.23AM · MONO</span>
        </div>

        <div className="relative p-2 sm:p-3">
          <div className="overflow-hidden rounded-[0.45rem] border border-edge-dim bg-surface shadow-[0_10px_28px_-22px_rgba(0,0,0,0.55)]">
            <img
              src="/screenshots/talkie-agent-handoff-console.png"
              alt="A Talkie Console session showing a spoken product feedback memo sent to a coding agent"
              className="block aspect-[1234/988] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="relative flex min-h-8 items-center justify-between gap-3 border-t border-edge-dim px-3 text-[8px] uppercase tracking-[0.26em] text-ink-faint sm:px-4">
          <span>· TRIG · LIVE · SIGNAL PATH · LOCAL ONLY</span>
          <span className="hidden text-ink-subtle sm:inline">SCOUT · CODEX · HANDOFF ·</span>
        </div>
      </div>
    </figure>
  )
}

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
                  filter: 'drop-shadow(0 0 4px color-mix(in oklab, var(--amber) 32%, transparent))',
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
          className="hidden font-display text-5xl font-normal leading-none tracking-[-0.04em] opacity-95 md:block"
          style={{
            color: 'var(--amber)',
            textShadow:
              '0 0 18px color-mix(in oklab, var(--amber) 30%, transparent), 0 0 6px color-mix(in oklab, var(--amber) 40%, transparent)',
          }}
        >
          {step.id}
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
                filter: 'drop-shadow(0 0 4px color-mix(in oklab, var(--amber) 32%, transparent))',
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

function SecurityNode({ label, detail, muted = false }) {
  return (
    <div
      className="rounded-sm border border-edge-dim bg-canvas px-4 py-3"
      style={
        muted
          ? undefined
          : {
              boxShadow: 'inset 2px 0 0 0 var(--amber)',
            }
      }
    >
      <p className={muted ? 'text-ink-faint' : 'text-ink'}>{label}</p>
      <p className="mt-1 text-[8px] tracking-[0.18em] text-ink-faint">{detail}</p>
    </div>
  )
}

function SecurityArrow() {
  return (
    <div
      aria-hidden
      className="hidden h-px w-10 md:block"
      style={{
        background:
          'linear-gradient(90deg, color-mix(in oklab, var(--amber) 10%, transparent), var(--amber), color-mix(in oklab, var(--amber) 10%, transparent))',
        boxShadow: '0 0 6px color-mix(in oklab, var(--amber) 35%, transparent)',
      }}
    />
  )
}
