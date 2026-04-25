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

/**
 * /v2/support — server-rendered support / knowledge-base page.
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
          'Download Talkie from the Mac App Store or install via CLI with `curl -fsSL go.usetalkie.com/install | bash`. The CLI installer downloads the app, installs the command-line tools, and launches Talkie automatically.',
      },
      {
        icon: Mic,
        title: 'Your first dictation',
        body:
          'Press the global hotkey (default: Option+D) from anywhere on your Mac to start dictating. Speak naturally — Talkie transcribes locally on your device using the Neural Engine. Press the hotkey again or click the menu bar icon to stop. Your text is copied to the clipboard automatically.',
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
    label: 'DATA & PRIVACY',
    articles: [
      {
        icon: HardDrive,
        title: 'Where is my data stored?',
        body:
          'All data lives in a local SQLite database on your Mac. If you enable iCloud sync, data is encrypted with your Apple ID keys and stored in a Private CloudKit container. Talkie Systems has zero access to your data.',
      },
      {
        icon: RefreshCw,
        title: 'Syncing across devices',
        body:
          'Talkie uses Apple iCloud (CloudKit) to sync between your devices. Data is encrypted end-to-end with your Apple ID. Enable sync in Settings > iCloud. All synced devices must be signed into the same Apple ID.',
      },
      {
        icon: Key,
        title: 'Setting up API keys',
        body:
          'Go to Settings > API Keys. Enter your OpenAI or Anthropic key. Keys are stored in the macOS Keychain (Secure Enclave) and only accessed at runtime. Talkie never sends your keys to our servers.',
      },
    ],
  },
  {
    code: '03',
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
          'Workflows let you chain AI actions on your transcriptions — summarize, extract action items, translate, or send to external services. Create workflows in Settings > Workflows or use the built-in templates.',
      },
      {
        icon: Smartphone,
        title: 'Mobile capture',
        body:
          'Use Talkie for iOS to capture voice memos on the go. Recordings sync to your Mac via iCloud where they are transcribed locally. The mobile app is a lightweight capture tool — all AI processing happens on your Mac.',
      },
    ],
  },
  {
    code: '04',
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
          'Try deleting and reinstalling from the App Store. If using the CLI version, run `talkie doctor` to diagnose issues. Check Console.app for crash logs. Talkie requires macOS 14 (Sonoma) or later.',
      },
    ],
  },
]

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

export default function SupportPage() {
  return (
    <>
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
            Browse the knowledge base below. If you cannot find what you need, send us a signal —
            most messages get a response within 24 hours.
          </p>

          {/* Telemetry strip */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-subtle">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                style={TRACE_GLOW_DOT_SM}
              />
              <span>RESPONSE · UNDER 24H</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <LifeBuoy className="h-3 w-3 text-trace" aria-hidden />
              <span>CHANNELS · EMAIL · DOCS</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--trace-dim)' }} />
              <span>ALL SIGNALS LOCAL</span>
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
            Twelve articles across four channels. Each entry is a self-contained signal — read top to bottom.
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
              <div className="relative overflow-hidden rounded-md border border-edge bg-surface p-6">
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                      style={TRACE_GLOW_DOT}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                      CHANNEL · 01 / EMAIL
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                    Send a message.
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                    Reach the team at{' '}
                    <span className="font-mono text-ink">hello@usetalkie.com</span>. Include your
                    macOS version and a short description — most replies land within a day.
                  </p>

                  <a
                    href="mailto:hello@usetalkie.com?subject=Talkie%20Support"
                    className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                      textShadow: '0 0 6px var(--trace-glow)',
                    }}
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    OPEN MAIL <span aria-hidden>→</span>
                  </a>
                </div>
              </div>

              {/* Reference channel */}
              <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-6">
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim bg-transparent"
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                      CHANNEL · 02 / REFERENCE
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                    Read the docs.
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                    Long-form documentation, CLI reference, and security architecture for engineers
                    who want to know exactly what Talkie does and where data lives.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/v2/docs"
                      className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-ink hover:border-edge"
                    >
                      DOCUMENTATION <span aria-hidden>↗</span>
                    </Link>
                    <Link
                      href="/v2/security"
                      className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-ink hover:border-edge"
                    >
                      SECURITY <span aria-hidden>→</span>
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
    <article className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE_FINE} />
      <div className="relative">
        <div
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
          style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
        >
          <Icon
            className="h-4 w-4 text-trace"
            style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
            aria-hidden
          />
        </div>

        <h3 className="mt-4 font-display text-lg font-normal leading-snug tracking-[-0.01em] text-ink">
          {article.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{article.body}</p>
      </div>
    </article>
  )
}
