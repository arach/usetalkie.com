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
  ArrowRight,
} from 'lucide-react'
import SignalTable from '../SignalTable'
import InstallCard from '../InstallCard'
import capturesCatalog from '../../content/captures.json'
import DemoFilmHero from './DemoFilmHero'
import MobileDisclosure from './MobileDisclosure'
import PanoramicHero from './PanoramicHero'
import RemoteHero from './RemoteHero'
import SectionArt from './SectionArt'

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
 *   - InstallCard (CLI patch-bay) as the download rail.
 *   - Capture modes / flow / ownership / downloads sit on cream canvas
 *     with amber accents — flipping from trace to amber per the brief's
 *     chrome rule.
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
    body: "Rewrite, trim, or expand once the raw take is saved. It's not going anywhere.",
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
    body: "Use whatever's closest: iPhone, Watch, a Mac memo, or dictation right at the keyboard.",
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
    body: 'Sync runs through your iCloud account. Talkie does not operate the sync server.',
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
// FlowStep numbers and header live dots. This makes the cream
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
  return (
    <div className="home-page-art relative isolate">
      <div aria-hidden className="home-page-artwork pointer-events-none absolute inset-0 z-0">
        <span className="home-page-artwork__left" />
        <span className="home-page-artwork__center" />
        <span className="home-page-artwork__right" />
      </div>

      {/* ========== HERO — PRODUCT PROMISE + REAL DEVICE RELATIONSHIP ========== */}
      <RemoteHero />

      {/* ========== PRODUCT MODEL — PANORAMIC INSTRUMENT ========== */}
      <section id="product-model" className="home-hero-art relative scroll-mt-16 overflow-hidden border-b border-edge-faint bg-canvas font-mono">
        <div aria-hidden className="home-hero-graticule pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14 xl:py-16">
          <div className="mb-8 md:hidden">
            <p className="text-[10px] uppercase tracking-[0.18em] text-amber">
              · PRODUCT MODEL ·
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal leading-[1.04] tracking-[-0.02em] text-ink">
              Capture context. Send it to an agent.
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-muted">
              Each surface shows the same Situation, Action, and Result.
            </p>
          </div>

          {/* The product proposition and scenario system explain the film
              after the visitor has seen Talkie work. */}
          <PanoramicHero />

          {/* Brand callback — the positioning line
              lands here as a small italic signoff, so it reads as a
              memorable closer instead of competing with "Talk to your
              {device}" for the lead. */}
          {/* Brand callback — desktop only here. On mobile, the same
              line is hoisted to a mid-page divider section between
              Recovery Flow and Ownership for thematic punctuation. */}
          <p className="mt-8 hidden text-center font-display text-[clamp(1rem,1.5vw,1.25rem)] italic leading-relaxed text-ink-dim md:mt-12 md:block">
            <span aria-hidden className="mr-3 inline-block align-middle text-ink-faint not-italic">·</span>
            A remote control for your agents.
            <span aria-hidden className="ml-3 inline-block align-middle text-ink-faint not-italic">·</span>
          </p>
        </div>
      </section>

      {/* ========== REAL PRODUCT FILM — SUPPORTING PROOF ========== */}
      <DemoFilmHero />

      {/* ========== CAPTURES · SIGNAL TABLE ========== */}
      <section
        id="capture"
        className="relative scroll-mt-16 overflow-hidden border-t border-edge-faint bg-canvas-alt font-mono"
      >
        <span id="dictation-capture" aria-hidden className="absolute -top-20" />
        <SectionArt slice="31%" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
          <div className="max-w-4xl">
            <p
              className="text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · DICTATION CAPTURE · LIVE EXAMPLES
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              How do I dictate into any Mac app?
            </h2>
            <div className="mt-4 flex max-w-3xl flex-col gap-4 text-[15px] leading-relaxed text-ink-muted md:flex-row md:items-end md:justify-between md:gap-8">
              <p className="max-w-2xl">
                Set the hotkey once, then speak into any app. This staged capture
                shows the same global shortcut in a note, a temporary chat, and
                Claude Code. Talkie stores each result locally with its source and
                recording metadata.
              </p>
              <Link
                href="/workflows"
                className="group inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas sm:tracking-[0.22em]"
                style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
              >
                See workflows
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <MobileDisclosure summary="OPEN THE LIVE CAPTURE" className="mt-8 md:mt-10">
            <div className="border-t border-edge-faint p-2 group-open:block md:block md:border-0 md:p-0">
              <SignalTable catalog={capturesCatalog} />
            </div>
          </MobileDisclosure>
        </div>
      </section>

      {/* ========== CAPTURE MODES ========== */}
      <section
        id="modes"
        className="relative scroll-mt-16 overflow-hidden border-t border-edge-faint bg-canvas font-mono"
      >
        <SectionArt variant="technical" tone="canvas" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · CAPTURE MODES
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              What can Talkie do with a voice capture?
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              A capture can become a note, a draft, a search, or the start of a workflow. Say it once, then use it where it belongs.
            </p>
          </div>

          <MobileDisclosure summary="SHOW CAPTURE MODES" className="mt-8 md:mt-14">
            <div className="grid grid-cols-1 gap-4 border-t border-edge-faint p-3 group-open:grid md:grid md:grid-cols-2 md:gap-5 md:border-0 md:p-0 lg:grid-cols-3">
              {CAPTURE_MODES.map((m, i) => (
                <CaptureModeCard key={m.title} mode={m} index={i} />
              ))}
            </div>
          </MobileDisclosure>
        </div>
      </section>

      {/* ========== RECOVERY FLOW ========== */}
      <section
        id="context"
        className="relative scroll-mt-16 overflow-hidden border-t border-edge-faint bg-canvas-alt font-mono"
      >
        <SectionArt slice="56%" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · COMING BACK LATER
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              How can I find a voice note later?
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Talkie stores the transcript, time, app, and project context with each capture so it stays searchable.
            </p>
          </div>

          <MobileDisclosure summary="SHOW THE RECOVERY FLOW" className="mt-8 md:mt-14">
            <div className="border-t border-edge-faint px-4 group-open:block md:block md:border-0 md:px-0">
              {FLOW_STEPS.map((step) => (
                <FlowStep key={step.id} step={step} />
              ))}
            </div>
          </MobileDisclosure>
        </div>
      </section>

      {/* ========== OWNERSHIP / ARCHITECTURE ========== */}
      <section
        id="ownership"
        className="relative scroll-mt-16 overflow-hidden border-t border-edge-faint bg-canvas font-mono"
      >
        <SectionArt variant="technical" tone="canvas" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.26em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              · OWNERSHIP
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Where does Talkie store voice data?
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Your recordings and transcripts start on your devices. You can sync them through your iCloud account. External models are optional and use the keys that you provide.
            </p>
          </div>

          <MobileDisclosure summary="SHOW DATA OWNERSHIP" className="mt-8 md:mt-12">
            <div className="border-t border-edge-faint p-3 group-open:block md:block md:border-0 md:p-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
                {OWNERSHIP_CARDS.map((card) => (
                  <OwnershipCard key={card.title} card={card} />
                ))}
              </div>

              <Link
                href="/security"
                className="group mt-6 block overflow-hidden rounded-md border border-edge-dim bg-surface transition-all hover:-translate-y-0.5 hover:border-edge focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas md:mt-10"
              >
                <div className="flex min-h-11 items-center justify-between border-b border-edge-faint px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint md:text-[9px] md:tracking-[0.24em]">
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

              <div className="mt-6 md:mt-10">
                <Link
                  href="/security"
                  className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas md:tracking-[0.24em]"
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
          </MobileDisclosure>
        </div>
      </section>

      {/* ========== DOWNLOADS ========== */}
      <section
        id="downloads"
        className="relative scroll-mt-16 overflow-hidden border-t border-edge-faint bg-canvas-alt font-mono"
      >
        <span id="get" aria-hidden className="absolute -top-20" />
        <SectionArt slice="81%" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] xl:gap-16">
            <div className="min-w-0 max-w-xl">
              <p
                className="text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.26em]"
                style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
              >
                · DOWNLOADS
              </p>
              <h2 className="mt-3 font-display text-3xl font-normal leading-[1.04] tracking-[-0.02em] text-ink md:text-5xl">
                How much does Talkie cost?
              </h2>
              <p className="mt-5 max-w-[65ch] text-[15px] leading-relaxed text-ink-muted">
                The current Mac build is free. Talkie Phone and the Apple Watch app are free.
                A 7-day trial and a $39 one-time Mac license are planned. The trial and checkout are not active yet.
              </p>

              <div className="mt-9 border-y border-edge-dim">
                <DownloadStoryRow
                  label="MAC · WORK SURFACE"
                  detail="Use the signed DMG or a package manager. Requires macOS 26 or later on Apple silicon."
                />
                <DownloadStoryRow
                  label="iPHONE + WATCH · CAPTURE SURFACES"
                  detail="Open Talkie Phone in the App Store. The iPhone and Apple Watch apps are free."
                  divided
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/mac"
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas sm:tracking-[0.24em]"
                  style={{ color: 'var(--amber)', ...AMBER_TINT, ...AMBER_GLOW_SOFT }}
                >
                  EXPLORE MAC <span aria-hidden className="ml-2">→</span>
                </Link>
                <Link
                  href="/mobile"
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-sm border border-edge-dim px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-ink-muted transition-all hover:-translate-y-0.5 hover:border-edge hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas sm:tracking-[0.24em]"
                >
                  EXPLORE MOBILE <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>
            </div>

            <div className="min-w-0">
              <InstallCard />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-edge-faint pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-faint sm:tracking-[0.2em]">
              CURRENT DOWNLOADS · MAC · iPHONE · APPLE WATCH · CLI
            </p>
            <Link
              href="/downloads"
              className="inline-flex min-h-11 items-center whitespace-nowrap text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas sm:tracking-[0.24em]"
              style={{ color: 'var(--amber)', ...AMBER_GLOW_SOFT }}
            >
              VIEW THE FULL DOWNLOAD GUIDE <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Sub-components — capture mode card, flow step, ownership card, download row
// -----------------------------------------------------------------------------

function DownloadStoryRow({ label, detail, divided = false }) {
  return (
    <div className={`grid gap-2 py-4 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-start ${divided ? 'border-t border-edge-faint' : ''}`}>
      <p className="text-[9px] uppercase tracking-[0.18em] text-ink-subtle sm:tracking-[0.22em]">{label}</p>
      <p className="text-[12px] leading-relaxed text-ink-muted">{detail}</p>
    </div>
  )
}

function CaptureModeCard({ mode, index }) {
  const Icon = mode.icon
  const ch = String(index + 1).padStart(2, '0')
  return (
    <Link
      href={mode.href}
      className="group relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5 transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
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
