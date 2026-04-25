import Link from 'next/link'
import { Play, Laptop, Mic, Smartphone, Lock } from 'lucide-react'

/**
 * DemoPage (v2) — server-rendered demo / preview surface.
 *
 * Composition:
 *   1. Hero — phosphor eyebrow + headline + supporting copy
 *   2. Notice — placeholder + mailto "ping" CTA (no client state)
 *   3. Hero clip — TalkieHero.mp4 with native <video controls>
 *   4. Promo clip — TalkiePromo.mp4
 *   5. Spec strip — three product summary tiles
 *   6. Cross-surface CTA — install + tie-back to /v2/mac
 *
 * Hard constraint: pure server component, no useState/useEffect.
 * The donor's email signup form is reframed as a mailto pill so the
 * surface still asks for a heads-up without dragging in a client island.
 */
export default function DemoPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
              style={{ boxShadow: '0 0 6px var(--trace)' }}
            />
            <p
              className="text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · DEMO REEL · 60s
            </p>
          </div>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            See Talkie <span className="italic">in action.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            A short reel: hold the hotkey, speak, watch the cursor land back where you started. The clips below are placeholders while the proper demo cuts come together — the signal flow is real.
          </p>
        </div>
      </section>

      {/* PLACEHOLDER NOTICE + PING CTA */}
      <section className="relative border-t border-edge-faint bg-canvas-alt font-mono">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
          <div className="mx-auto max-w-2xl rounded-md border border-edge-dim bg-surface p-6 md:p-7">
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-amber"
                style={{ boxShadow: '0 0 6px var(--amber)' }}
              />
              <span>· STATUS · PLACEHOLDER REEL</span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
              We are still cutting the proper demo videos. Drop a note and we will ping you when the final reel ships — no list, no marketing, just one email.
            </p>
            <a
              href="mailto:hello@usetalkie.com?subject=Demo%20reel%20heads-up"
              className="mt-5 inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-px"
              style={{
                background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                textShadow: '0 0 6px var(--trace-glow)',
              }}
            >
              PING ME WHEN READY <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* HERO CLIP */}
      <section className="relative border-t border-edge-faint bg-canvas font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="flex items-center justify-between">
            <p
              className="text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · CH-A · OVERVIEW · 60s
            </p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
              CLIP · 01 / 02
            </p>
          </div>

          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink md:text-4xl">
            The 60-second tour.
          </h2>

          <ClipFrame
            src="/videos/TalkieHero.mp4"
            label="TALKIE OVERVIEW"
            channel="01"
            durationLabel="≈ 60s"
            poster=""
          />
        </div>
      </section>

      {/* PROMO CLIP */}
      <section className="relative border-t border-edge-faint bg-canvas-alt font-mono">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="flex items-center justify-between">
            <p
              className="text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · CH-B · PROMO · SHORT
            </p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
              CLIP · 02 / 02
            </p>
          </div>

          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink md:text-4xl">
            <span className="italic text-ink-muted">Quick promo.</span>
          </h2>

          <ClipFrame
            src="/videos/TalkiePromo.mp4"
            label="TALKIE PROMO"
            channel="02"
            durationLabel="SHORT"
            narrow
          />
        </div>
      </section>

      {/* SPEC STRIP */}
      <section className="relative border-t border-edge-faint bg-canvas font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p
            className="text-[10px] uppercase tracking-[0.26em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · SPECS
          </p>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            What you are looking at.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            <SpecCard
              channel="01"
              icon={Mic}
              title="Universal dictation"
              body="Hold the hotkey in any Mac app. Talkie types straight into the focused field — no copy-paste, no modal."
            />
            <SpecCard
              channel="02"
              icon={Smartphone}
              title="Mobile capture"
              body="Capture on iPhone and Apple Watch when you are away from the desk. Sync arrives back on the Mac."
            />
            <SpecCard
              channel="03"
              icon={Lock}
              title="Private by design"
              body="On-device transcription. No cloud round-trip, no account required, no telemetry on your speech."
            />
          </div>
        </div>
      </section>

      {/* CROSS-SURFACE TIE-BACK + INSTALL */}
      <section className="relative border-t border-edge-faint bg-canvas-alt font-mono">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            <Link
              href="/v2/mac"
              className="group block rounded-md border border-edge bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-trace"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim"
                />
                <span className="text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  KEEP READING · CH-A
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                Talk to your Mac.
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                The full tour of the Mac surface — hold-to-talk, return-to-origin, 48-hour echoes. →
              </p>
            </Link>

            <div className="flex flex-col justify-between rounded-md border border-edge bg-surface p-6">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.26em] text-trace"
                  style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                >
                  · READY TO INSTALL
                </p>
                <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                  Get early access.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  macOS 26+ · DMG, App Store, or one CLI command.
                </p>
              </div>
              <Link
                href="/download"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                  textShadow: '0 0 6px var(--trace-glow)',
                }}
              >
                <Laptop className="h-3.5 w-3.5" />
                GO TO INSTALL <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * ClipFrame — oscilloscope-flavored video chrome around a native
 * <video> element. No JS player; controls are the browser default.
 */
function ClipFrame({ src, label, channel, durationLabel, narrow = false }) {
  return (
    <div className={`relative mt-8 ${narrow ? 'mx-auto max-w-3xl' : ''}`}>
      <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-3 md:p-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Header strip */}
        <div className="relative mb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
              style={{ boxShadow: '0 0 4px var(--trace)' }}
            />
            <span className="text-ink-dim">CH-{channel}</span>
            <span className="text-ink-subtle">/</span>
            <span>{label}</span>
          </div>
          <span>{durationLabel}</span>
        </div>

        {/* Video viewport */}
        <div className="relative overflow-hidden rounded-sm border border-edge bg-canvas">
          <video
            src={src}
            controls
            playsInline
            preload="metadata"
            className="block aspect-video w-full bg-canvas"
          />
        </div>

        {/* Footer ticks */}
        <div className="relative mt-3 flex items-center gap-3 text-[8px] uppercase tracking-[0.22em] text-ink-subtle">
          <Play className="h-2.5 w-2.5 text-trace" />
          <span>SIGNAL · READY</span>
          <span className="text-ink-faint">·</span>
          <span>LOCAL PLAYBACK</span>
        </div>
      </div>
    </div>
  )
}

function SpecCard({ channel, icon: Icon, title, body }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
            style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
          >
            <Icon
              className="h-4 w-4 text-trace"
              style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
            />
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            CH-{channel}
          </span>
        </div>
        <h3 className="mt-4 font-display text-lg tracking-[-0.01em] text-ink">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{body}</p>
      </div>
    </div>
  )
}
