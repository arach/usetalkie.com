import Link from 'next/link'
import {
  LifeBuoy,
  Mail,
  Mic,
  Keyboard,
  Download,
  RefreshCw,
  Key,
  HardDrive,
  Terminal,
  Smartphone,
  Workflow,
  AlertCircle,
} from 'lucide-react'
import JsonLd from './JsonLd'
import { TALKIE_MAC_OFFER, TALKIE_PHONE_APP } from '../shared/config/product-links'

/**
 * /support — server-rendered support / knowledge-base page.
 *
 * Pure server component. The donor (`components/SupportPage.jsx`) ships an
 * interactive accordion + contact form; the v2 brief mandates no client
 * code on this route, so we present the same KB content as an always-open
 * spec-sheet and route help requests via a mailto channel card. Re-introducing
 * the form here would require splitting it into a client island, which is
 * out of scope for this pass.
 *
 * Design language follows PhilosophyPage / SecurityPage: oscilloscope
 * canvas, graticule overlays, phosphor accents on the trace token, mono
 * eyebrows. Inline `style` is reserved for var() refs only.
 */

const KB_SECTIONS = [
  {
    code: '01',
    label: 'GETTING STARTED',
    articles: [
      {
        icon: Download,
        title: 'Installing Talkie',
        body:
          'Download the signed Mac build from the Talkie downloads page. You can also install it with `curl -fsSL go.usetalkie.com/install | bash`. The command downloads the app, installs the command-line tools, and launches Talkie.',
      },
      {
        icon: Mic,
        title: 'Your first dictation',
        body:
          'Press the global hotkey (default: Option+D) from anywhere on your Mac to start dictating. Speak naturally. Talkie transcribes locally on your device using the Neural Engine. Press the hotkey again or click the menu bar icon to stop. Your text is copied to the clipboard automatically.',
      },
      {
        icon: Keyboard,
        title: 'Keyboard shortcuts',
        body:
          'Option+D starts/stops dictation. Option+T opens Talkie. You can customize these in Talkie Settings > Shortcuts. The global hotkey works system-wide, even when Talkie is in the background.',
      },
    ],
  },
  {
    code: '02',
    label: 'PLANNED MAC OFFER',
    articles: [
      {
        icon: Key,
        title: 'Is the paid Mac offer active?',
        body:
          `No. The current Mac build is free to download. The planned offer is a ${TALKIE_MAC_OFFER.trialLabel}, then ${TALKIE_MAC_OFFER.displayPrice} USD as a ${TALKIE_MAC_OFFER.billingLabel} payment. Checkout and license activation are not active yet.`,
      },
      {
        icon: Mic,
        title: 'How will the trial work?',
        body:
          `${TALKIE_MAC_OFFER.trialStartLabel}. ${TALKIE_MAC_OFFER.trialRequirementsLabel}. ${TALKIE_MAC_OFFER.automaticChargeLabel}. These rules describe the planned offer, not the current build.`,
      },
      {
        icon: HardDrive,
        title: 'What will happen after the trial?',
        body:
          `${TALKIE_MAC_OFFER.expiryLabel}. ${TALKIE_MAC_OFFER.dataAccessLabel}. This behavior must be implemented and tested before the paid offer starts.`,
      },
      {
        icon: Smartphone,
        title: 'Are the mobile apps part of the Mac license?',
        body:
          `${TALKIE_PHONE_APP.name} and the Apple Watch app are free. They do not require a Mac license.`,
      },
    ],
  },
  {
    code: '03',
    label: 'DATA & PRIVACY',
    articles: [
      {
        icon: HardDrive,
        title: 'Where is my data stored?',
        body:
          'Your Talkie library is stored in a local SQLite database on your Mac. If you enable iCloud sync, Apple stores the synced copy in your private CloudKit container. Talkie does not operate a server for your synced library.',
      },
      {
        icon: RefreshCw,
        title: 'Syncing across devices',
        body:
          'Talkie uses Apple iCloud and CloudKit to sync between your devices. Enable sync in Settings > iCloud. All synced devices must use the same Apple ID.',
      },
      {
        icon: Key,
        title: 'Setting up API keys',
        body:
          'Go to Settings > API Keys. Enter your OpenAI or Anthropic key. Talkie stores the key in the macOS Keychain and reads it when you use the provider. Talkie does not send the key to a Talkie server.',
      },
    ],
  },
  {
    code: '04',
    label: 'ADVANCED',
    articles: [
      {
        icon: Terminal,
        title: 'Using the CLI',
        body:
          'The Talkie CLI lets you capture and transcribe from the terminal. Run `talkie capture` to record, `talkie list` to see recent captures, and `talkie transcribe` to process audio files. Run `talkie --help` for all commands.',
      },
      {
        icon: Workflow,
        title: 'Workflows & automation',
        body:
          'Workflows let you run AI actions on your transcriptions. You can summarize, extract action items, translate, or send data to external services. Create workflows in Settings > Workflows or use a built-in template.',
      },
      {
        icon: Smartphone,
        title: 'Mobile capture',
        body:
          'Use Talkie for iPhone to capture voice memos when you are away from your Mac. If you enable iCloud sync, recordings can sync to your Mac for local transcription.',
      },
    ],
  },
  {
    code: '05',
    label: 'TROUBLESHOOTING',
    articles: [
      {
        icon: Mic,
        title: 'Microphone not working',
        body:
          'Go to System Settings > Privacy & Security > Microphone and ensure Talkie is enabled. If the hotkey does not trigger recording, check System Settings > Privacy & Security > Accessibility. Restart Talkie after granting permissions.',
      },
      {
        icon: RefreshCw,
        title: 'Sync issues',
        body:
          'Ensure all devices are on the same Apple ID with iCloud Drive enabled. Check Settings > iCloud in Talkie to confirm sync is active. If data is not appearing, try toggling sync off and on. Large recordings may take a few minutes to sync.',
      },
      {
        icon: AlertCircle,
        title: 'App will not launch or crashes',
        body:
          'Download the current signed build again and reinstall it. If you use the command-line tools, run `talkie doctor` to diagnose issues. Check Console.app for crash logs. Talkie requires macOS 14 (Sonoma) or later.',
      },
    ],
  },
]
const KB_ARTICLE_COUNT = KB_SECTIONS.reduce(
  (total, section) => total + section.articles.length,
  0,
)

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
const TRACE_GLOW_DOT_SM = { boxShadow: '0 0 4px var(--trace)' }
const HEADLINE_PHOSPHOR = {
  textShadow: '0 0 18px var(--trace-glow), 0 0 6px var(--trace-glow)',
}

const OFFER_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the paid Talkie for Mac offer active?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. The current Mac build is free to download. A ${TALKIE_MAC_OFFER.trialLabel} and ${TALKIE_MAC_OFFER.displayPrice} USD one-time license are planned.`,
      },
    },
    {
      '@type': 'Question',
      name: 'How will the Talkie for Mac trial work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${TALKIE_MAC_OFFER.trialStartLabel}. ${TALKIE_MAC_OFFER.trialRequirementsLabel}. ${TALKIE_MAC_OFFER.automaticChargeLabel}.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Are the Talkie iPhone and Apple Watch apps free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. ${TALKIE_PHONE_APP.name} and the Apple Watch app are free. They do not require a Mac license.`,
      },
    },
  ],
}

export default function SupportPage() {
  return (
    <>
      <JsonLd data={OFFER_FAQ_SCHEMA} />
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
            style={TRACE_GLOW_SOFT}
          >
            · SUPPORT · OPERATOR&apos;S MANUAL
          </p>

          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            How can we{' '}
            <span className="italic text-trace" style={HEADLINE_PHOSPHOR}>
              help?
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Browse the knowledge base below. If you can&apos;t find what you need, write us.
            We read every message.
          </p>

          {/* Telemetry strip */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-subtle">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                style={TRACE_GLOW_DOT_SM}
              />
              <span>RESPONSE · EMAIL</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <LifeBuoy className="h-3 w-3 text-trace" aria-hidden />
              <span>CHANNELS · EMAIL · DOCS</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--trace-dim)' }} />
              <span>APP LIBRARY · LOCAL FIRST</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========== KNOWLEDGE BASE ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
            style={TRACE_GLOW_SOFT}
          >
            · KNOWLEDGE BASE
          </p>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            Common topics.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            {KB_ARTICLE_COUNT} articles across {KB_SECTIONS.length} sections. Each entry stands on its own.
          </p>

          <div className="mt-14 space-y-12">
            {KB_SECTIONS.map((section) => (
              <KBSection key={section.code} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTACT CHANNEL ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl">
            {/* Top rule */}
            <div className="flex items-center gap-4">
              <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
              <span
                className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
                style={TRACE_GLOW_SOFT}
              >
                · STILL NEED HELP
              </span>
              <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Email channel */}
              <div className="group relative overflow-hidden rounded-md border border-edge bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]">
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-trace transition-transform duration-200 group-hover:scale-150"
                      style={TRACE_GLOW_DOT}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle transition-colors duration-200 group-hover:text-amber">
                      CHANNEL · 01 / EMAIL
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                    Send a message.
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">
                    Reach the team at{' '}
                    <span className="font-mono text-ink">hello@usetalkie.com</span>. Include your
                    macOS version and a short description. We will reply by email.
                  </p>

                  <a
                    href="mailto:hello@usetalkie.com?subject=Talkie%20Support"
                    className="group/btn mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60"
                    style={{
                      background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                      textShadow: '0 0 6px var(--trace-glow)',
                    }}
                  >
                    <Mail className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:scale-110" aria-hidden />
                    OPEN MAIL <span aria-hidden className="inline-block transition-transform duration-200 group-hover/btn:translate-x-0.5">→</span>
                  </a>
                </div>
              </div>

              {/* Reference channel */}
              <div className="group relative overflow-hidden rounded-md border border-edge-dim bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/40 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]">
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim bg-transparent transition-all duration-200 group-hover:scale-150 group-hover:border-amber group-hover:bg-amber"
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle transition-colors duration-200 group-hover:text-amber">
                      CHANNEL · 02 / REFERENCE
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                    Read the docs.
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">
                    Long-form documentation, CLI reference, and security architecture for engineers
                    who want to know exactly what Talkie does and where data lives.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/docs"
                      className="group/lnk inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-amber hover:border-amber/50"
                    >
                      DOCUMENTATION <span aria-hidden className="inline-block transition-transform duration-200 group-hover/lnk:-translate-y-0.5 group-hover/lnk:translate-x-0.5">↗</span>
                    </Link>
                    <Link
                      href="/security"
                      className="group/lnk inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-amber hover:border-amber/50"
                    >
                      SECURITY <span aria-hidden className="inline-block transition-transform duration-200 group-hover/lnk:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom rule with phosphor dot */}
            <div className="mt-10 flex items-center gap-4">
              <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                style={TRACE_GLOW_DOT}
              />
              <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--trace-dim)' }} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function KBSection({ section }) {
  return (
    <div>
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
        <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--trace-dim)' }} />
        <span>
          {section.code} / {section.label}
        </span>
        <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--edge-subtle)' }} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {section.articles.map((article) => (
          <KBCard key={article.title} article={article} />
        ))}
      </div>
    </div>
  )
}

function KBCard({ article }) {
  const Icon = article.icon
  return (
    <article className="group relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE_FINE} />
      <div className="relative">
        <div
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-edge transition-all duration-200 group-hover:scale-110 group-hover:border-amber/60"
          style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
        >
          <Icon
            className="h-4 w-4 text-trace transition-transform duration-200"
            style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
            aria-hidden
          />
        </div>

        <h3 className="mt-4 font-display text-lg font-normal leading-snug tracking-[-0.01em] text-ink">
          {article.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">{article.body}</p>
      </div>
    </article>
  )
}
