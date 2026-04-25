import Link from 'next/link'
import {
  Cpu,
  Download,
  ShieldCheck,
  Terminal,
  Waves,
} from 'lucide-react'
import CopyCommand from './CopyCommand'

/**
 * v2 DownloadPage — body of /v2/download (and /v2/dl, which renders the
 * same component with no-index metadata).
 *
 * Composition:
 *   1. Channel hero — eyebrow, headline, supporting copy
 *   2. Install card — primary DMG anchor + curl one-liner + direct URL
 *   3. Trust strip — system requirements, signing, local-first
 *   4. Cross-link — "all platforms / iPhone" pointer to /v2/downloads
 *
 * Pure server component. The only interactive bits are <CopyCommand /> islands,
 * which own clipboard state in isolation.
 *
 * Theme is fully token-driven; inline `style` only for CSS-var refs that the
 * Tailwind config does not yet expose (--trace-glow + color-mix gradients).
 */

const DMG_URL =
  'https://github.com/arach/usetalkie.com/releases/latest/download/Talkie.dmg'
const DMG_DISPLAY = 'github.com/arach/usetalkie.com/releases/.../Talkie.dmg'
const CLI_INSTALL_CMD = 'curl -fsSL go.usetalkie.com/install | bash'

function Graticule({ opacity = 0.3 }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage:
          'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
  )
}

function ChannelEyebrow({ children }) {
  return (
    <p
      className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
      style={{ textShadow: '0 0 4px var(--trace-glow)' }}
    >
      {children}
    </p>
  )
}

function StatRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-6 w-6 items-center justify-center rounded-sm border border-edge-dim bg-canvas-alt text-trace"
        style={{ boxShadow: '0 0 6px var(--trace-faint)' }}
      >
        <Icon className="h-3 w-3" />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
          {label}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-ink">{value}</p>
      </div>
    </div>
  )
}

export default function DownloadPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas font-mono">
        <Graticule />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <ChannelEyebrow>· INSTALL / CH-A · MAC</ChannelEyebrow>
          <h1 className="mt-4 font-display text-4xl font-normal leading-[1.04] tracking-[-0.02em] text-ink md:text-5xl">
            Get Talkie on your Mac.<br />
            <span className="italic text-ink-muted">One signed binary.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-ink-muted">
            DMG, App Store, or a single command. Local-first by default. Your
            words stay on your devices.
          </p>
        </div>
      </section>

      {/* INSTALL CARD */}
      <section className="relative bg-canvas-alt font-mono">
        <div className="relative mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-16">
          <div className="relative overflow-hidden rounded-md border border-edge bg-surface shadow-soft">
            {/* Card header — schematic-style ID strip */}
            <div className="relative flex items-center justify-between border-b border-edge-dim px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                  style={{ boxShadow: '0 0 6px var(--trace)' }}
                />
                <span>INSTALL · TALKIE.MAC</span>
              </div>
              <span>REV A.1</span>
            </div>

            <div className="space-y-7 p-6 md:p-8">
              {/* Primary: DMG download */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  · PRIMARY · SIGNED DMG
                </p>
                <a
                  href={DMG_URL}
                  className="mt-3 inline-flex w-full items-center justify-center gap-3 rounded-sm border border-trace px-5 py-3.5 text-[11px] uppercase tracking-[0.26em] text-trace transition-all hover:-translate-y-0.5"
                  style={{
                    background:
                      'color-mix(in oklab, var(--trace) 8%, transparent)',
                    textShadow: '0 0 6px var(--trace-glow)',
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>DOWNLOAD TALKIE FOR MAC</span>
                  <span aria-hidden>→</span>
                </a>
              </div>

              {/* Direct link */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  · DIRECT LINK
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={DMG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block flex-1 truncate rounded-sm border border-edge-dim bg-canvas-alt px-3 py-2.5 font-mono text-[12px] text-trace transition-colors hover:border-trace"
                    title={DMG_URL}
                  >
                    {DMG_DISPLAY}
                  </a>
                </div>
              </div>

              {/* CLI one-liner */}
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-trace" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · OR · ONE-LINER
                  </p>
                </div>
                <div className="mt-3">
                  <CopyCommand command={CLI_INSTALL_CMD} />
                </div>
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-faint">
                  Installs the CLI, downloads the app, and launches it.
                </p>
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-1 gap-4 border-t border-edge-faint pt-6 sm:grid-cols-3">
                <StatRow
                  icon={Cpu}
                  label="REQUIRES"
                  value="macOS 26+ · Apple Silicon"
                />
                <StatRow
                  icon={ShieldCheck}
                  label="SIGNED"
                  value="Notarized by Apple"
                />
                <StatRow
                  icon={Waves}
                  label="DATA"
                  value="Local-first by default"
                />
              </div>
            </div>
          </div>

          {/* Cross-link */}
          <Link
            href="/v2/downloads"
            className="group mt-8 flex items-center justify-between gap-4 rounded-md border border-edge-dim bg-canvas px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-trace"
          >
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                · ALL SURFACES
              </p>
              <p className="mt-1.5 font-mono text-[12px] text-ink">
                Looking for iPhone, Watch, or every platform on one page?
              </p>
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-transform group-hover:translate-x-0.5"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              ALL DOWNLOADS →
            </span>
          </Link>
        </div>
      </section>
    </>
  )
}
