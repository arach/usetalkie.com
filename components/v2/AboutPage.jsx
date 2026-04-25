import Link from 'next/link'
import { Building2, MapPin, Sparkles, Github, Linkedin, Mail } from 'lucide-react'

/**
 * About — v2 oscilloscope canvas.
 *
 * Server component. Theme flips entirely via CSS variables on `html.dark`,
 * consumed through semantic Tailwind tokens (canvas, surface, ink, trace,
 * edge). Inline `style` is reserved for token-resistant primitives:
 * graticule grids referencing `var(--trace-faint)`, phosphor glow
 * shadows referencing `var(--trace-glow)`, and trace-tinted surfaces
 * via `color-mix`.
 *
 * Sections: HERO · STORY · OPERATOR (founder card) · CONNECT.
 *
 * Newsletter form was dropped on purpose — the donor used `useState` and
 * a fetch handler, both forbidden in this server-only port. Email + social
 * links are surfaced instead, which covers the same intent (reach out)
 * without flipping the file to a client component.
 */

// Reused inline style fragments — declared once so JSX stays readable.
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
const HEADLINE_PHOSPHOR = { textShadow: '0 0 18px var(--trace-glow), 0 0 6px var(--trace-glow)' }
const TRACE_TINT = { background: 'color-mix(in oklab, var(--trace) 6%, transparent)' }
const TRACE_TINT_FAINT = { background: 'color-mix(in oklab, var(--trace) 4%, transparent)' }

const STORY_PARAGRAPHS = [
  'Typing is a bottleneck. The faster you can get ideas out of your head and into your tools, the more you can leverage AI to amplify your work. Voice is the unlock.',
  'I was a power user of early voice tools like SuperWhisper and Wispr Flow — they were great and opened my eyes to what was possible. But none of them treated developers as first-class citizens. So I built Talkie for engineers and tech-forward people who want control: open data, everything is a file, fully pluggable and hookable.',
  'A native macOS app that lives in your menu bar, transcribes locally with state-of-the-art models, and gets out of your way. No subscriptions, no cloud dependency. Press a key, talk, your words appear wherever you’re typing.',
  'Dictation is just the beginning. When you take voice-first workflows seriously, a whole surface opens up: memory, analysis, automation, context. That’s where Talkie is headed.',
]

const FOUNDER_STATS = [
  { icon: Building2, label: '4 ventures · 1 exit' },
  { icon: MapPin, label: 'Montreal / SF' },
  { icon: Sparkles, label: 'AI pilled, voice pilled' },
]

export default function AboutPage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
            · ABOUT · OPERATOR LOG
          </p>

          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Voice is the unlock.<br />
            <span className="italic text-trace" style={HEADLINE_PHOSPHOR}>
              Typing is the bottleneck.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Talkie is a native macOS app for engineers and tech-forward operators who want
            control over their tools. Local-first, open data, fully hookable. One person
            building it, in the open, for people who think the same way.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-trace" style={TRACE_GLOW_DOT} />
            <span>SOLO BUILT</span>
            <span aria-hidden className="text-edge-dim">/</span>
            <span>LOCAL FIRST</span>
            <span aria-hidden className="text-edge-dim">/</span>
            <span>OPEN DATA</span>
          </div>
        </div>
      </section>

      {/* ========== STORY ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
            · THE STORY
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
            You don&apos;t get the full value of AI unless you can communicate at high velocity.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[160px_1fr] md:gap-16">
            {/* Side rail — line index */}
            <div className="flex flex-col gap-3">
              <div
                className="font-display text-[56px] font-normal leading-none tracking-[-0.04em] text-trace opacity-80"
                style={{ textShadow: '0 0 24px var(--trace-glow), 0 0 8px var(--trace-glow)' }}
              >
                01
              </div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
                style={TRACE_GLOW_SOFT}
              >
                · LOG ENTRY
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-subtle">
                BY ARACH T.
              </p>
            </div>

            {/* Prose */}
            <div className="space-y-5 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              {STORY_PARAGRAPHS.map((para, i) => (
                <p key={i}>{para}</p>
              ))}

              <div
                className="mt-8 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-trace"
                style={TRACE_GLOW_SOFT}
              >
                <span aria-hidden className="inline-block h-px w-8" style={{ background: 'var(--trace-dim)' }} />
                <span>BUILT FOR TINKERERS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== OPERATOR (FOUNDER) ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
            · THE OPERATOR
          </p>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            Who&apos;s behind it.
          </h2>

          <div
            className="relative mt-12 overflow-hidden rounded-md border border-edge bg-surface"
            style={TRACE_TINT_FAINT}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={GRATICULE_FINE} />

            <div className="relative grid grid-cols-1 gap-8 p-6 md:grid-cols-[auto_1fr] md:gap-10 md:p-10">
              {/* Portrait + ID strip */}
              <div className="flex flex-col items-start gap-4">
                <div className="relative">
                  {/* Phosphor halo */}
                  <span
                    aria-hidden
                    className="absolute -inset-1 rounded-md"
                    style={{ boxShadow: '0 0 24px var(--trace-glow)' }}
                  />
                  <img
                    src="/arach-circle.png"
                    alt="Arach Tchoupani"
                    className="relative h-32 w-32 rounded-md border border-edge object-cover md:h-40 md:w-40"
                  />
                </div>

                <div className="flex flex-col gap-1 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                  <span>ID · 001</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-trace" style={TRACE_GLOW_DOT} />
                    SIGNAL ACTIVE
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col">
                <h3 className="font-display text-2xl font-normal leading-tight tracking-[-0.01em] text-ink md:text-3xl">
                  Arach Tchoupani
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
                  · FOUNDER &amp; ENGINEER
                </p>

                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted">
                  15+ years in tech, from software engineer to CTO. Previously co-founded
                  Breathe Life (acquired 2022), worked at Meta on Creators and Facebook.
                  Now focused on AI-powered tools that make work feel more natural. Based
                  in Montreal, in SF often.
                </p>

                {/* Stat strip */}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {FOUNDER_STATS.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-subtle"
                    >
                      <Icon className="h-3.5 w-3.5 text-trace" style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }} aria-hidden />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Channels */}
                <div className="mt-7 flex flex-wrap gap-2">
                  <ChannelLink href="https://x.com/arach" label="@arach">
                    <XIcon />
                  </ChannelLink>
                  <ChannelLink href="https://github.com/arach" label="github/arach">
                    <Github className="h-3.5 w-3.5" aria-hidden />
                  </ChannelLink>
                  <ChannelLink href="https://linkedin.com/in/arach" label="linkedin/arach">
                    <Linkedin className="h-3.5 w-3.5" aria-hidden />
                  </ChannelLink>
                  <ChannelLink href="https://arach.io" label="arach.io" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONNECT ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={GRATICULE} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace" style={TRACE_GLOW_SOFT}>
                · CONNECT
              </p>
              <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
                Don&apos;t be a stranger.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted">
                Feedback, ideas, questions, or just a quick hello — they all land in the
                same inbox and they all get read. The fastest channels are below.
              </p>
            </div>

            <div
              aria-hidden
              className="hidden h-px w-32 md:block"
              style={{ background: 'var(--trace-dim)' }}
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            <ConnectCard
              code="CH-01"
              label="EMAIL"
              heading="hey@usetalkie.com"
              body="Direct line. Bug reports, feature ideas, partnership stuff — all of it."
              href="mailto:hey@usetalkie.com"
              icon={<Mail className="h-3.5 w-3.5" aria-hidden />}
              cta="OPEN MAIL"
            />
            <ConnectCard
              code="CH-02"
              label="X / TWITTER"
              heading="@usetalkieapp"
              body="Product updates, what's shipping, what's next. Reply for the fastest reply."
              href="https://x.com/usetalkieapp"
              icon={<XIcon />}
              cta="FOLLOW"
              external
            />
            <ConnectCard
              code="CH-03"
              label="PHILOSOPHY"
              heading="Why Talkie exists."
              body="The principles behind the tool — local-first, sovereign, low-friction."
              href="/v2/philosophy"
              cta="READ"
              highlight
            />
          </div>
        </div>
      </section>

      {/* ========== FOOTER TIE-BACK ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            {/* This is Talkie */}
            <div className="flex flex-col justify-between rounded-md border border-edge bg-surface p-6">
              <div>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
                  style={TRACE_GLOW_SOFT}
                >
                  · THIS IS TALKIE
                </p>
                <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                  A selfie. For your brain.<br />
                  <span className="text-base italic text-ink-muted md:text-lg">A signal is all you need.</span>
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                  Voice capture, local-first, auditable signal path. Your words stay on your devices.
                </p>
              </div>
              <Link
                href="/v2/mac"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  ...TRACE_TINT,
                  textShadow: '0 0 6px var(--trace-glow)',
                }}
              >
                SEE THE MAC <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Mobile tie-back */}
            <Link
              href="/v2/mobile"
              className="group block rounded-md border border-edge bg-surface p-6 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim bg-transparent"
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  ON THE GO
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                Talkie for Mobile.
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                The capture device that&apos;s always with you. Keep reading <span aria-hidden>→</span>
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function ChannelLink({ href, label, children }) {
  const isExternal = href.startsWith('http')
  const externalProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a
      href={href}
      {...externalProps}
      className="inline-flex items-center gap-1.5 rounded-sm border border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-all hover:-translate-y-0.5 hover:text-trace"
      style={TRACE_TINT_FAINT}
    >
      {children}
      <span>{label}</span>
    </a>
  )
}

function ConnectCard({ code, label, heading, body, href, icon, cta, external = false, highlight = false }) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const isInternal = href.startsWith('/')

  const inner = (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={GRATICULE_FINE} />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          <span>
            {code} / {label}
          </span>
          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-trace" style={{ boxShadow: '0 0 4px var(--trace)' }} />
        </div>

        <h3 className="mt-5 font-display text-xl font-normal leading-snug tracking-[-0.01em] text-ink">
          {heading}
        </h3>

        <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{body}</p>

        <div
          className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-trace"
          style={TRACE_GLOW_SOFT}
        >
          {icon}
          <span>{cta}</span>
          <span aria-hidden>→</span>
        </div>
      </div>
    </>
  )

  const className = `group relative block overflow-hidden rounded-md border p-5 transition-all hover:-translate-y-0.5 ${
    highlight ? 'border-edge' : 'border-edge-dim bg-surface'
  }`
  const cardStyle = highlight ? TRACE_TINT_FAINT : undefined

  if (isInternal) {
    return (
      <Link href={href} className={className} style={cardStyle}>
        {inner}
      </Link>
    )
  }

  return (
    <a href={href} {...externalProps} className={className} style={cardStyle}>
      {inner}
    </a>
  )
}

function XIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
