import Link from 'next/link'
import {
  Cpu,
  Download,
  Laptop,
  ShieldCheck,
  Smartphone,
  Terminal,
  Waves,
} from 'lucide-react'
import CopyCommand from './CopyCommand'
import PackageManagerTabs from './PackageManagerTabs'
import TrackedAnchor from './TrackedAnchor'

/**
 * v2 DownloadAllPage — body of /v2/downloads. All-platforms, all-channels view.
 *
 * Composition:
 *   1. Channel hero — eyebrow + headline + supporting copy
 *   2. Two-channel grid:
 *      · CH-A · MAC      — package-manager tabs + DMG fallback + curl
 *      · CH-B · IPHONE   — App Store CTA + QR code
 *   3. Trust strip — system requirements / signing / data posture
 *   4. Cross-link to canonical /v2/download for the simple install path
 *
 * Pure server component. Three small client islands are embedded:
 *   - <PackageManagerTabs />  tab switcher + clipboard
 *   - <CopyCommand />          curl + cli-only clipboard
 *   - <TrackedAnchor />        GA event before navigation (DMG + App Store)
 *
 * Theme is fully token-driven; inline `style` only for CSS-var refs the
 * Tailwind config does not yet expose (--trace-glow + color-mix gradients).
 */

const DMG_URL =
  'https://github.com/arach/usetalkie.com/releases/latest/download/Talkie.dmg'
const CLI_INSTALL_CMD = 'curl -fsSL go.usetalkie.com/install | bash'
const CLI_ONLY_CMD = 'bun add -g @talkie/cli'
const APP_STORE_URL =
  'https://apps.apple.com/us/app/talkie-mobile/id6755734109'

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

function ChannelHeader({ icon: Icon, channel, title, meta }) {
  return (
    <div className="flex items-start justify-between border-b border-edge-dim px-5 py-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge-dim bg-canvas-alt text-trace"
          style={{ boxShadow: '0 0 8px var(--trace-faint)' }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
            {channel}
          </p>
          <p className="mt-0.5 font-mono text-[12px] uppercase tracking-[0.16em] text-ink">
            {title}
          </p>
        </div>
      </div>
      <p className="text-right font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
        {meta}
      </p>
    </div>
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

export default function DownloadAllPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas font-mono">
        <Graticule />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <ChannelEyebrow>· INSTALL / ALL CHANNELS</ChannelEyebrow>
          <h1 className="mt-4 font-display text-4xl font-normal leading-[1.04] tracking-[-0.02em] text-ink md:text-5xl">
            Pick a surface.<br />
            <span className="italic text-ink-muted">Same signal.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-ink-muted">
            Talkie ships on Mac and iPhone. Both surfaces speak to the same
            local-first store. Install one, or both — they sync through your
            own iCloud, never ours.
          </p>
        </div>
      </section>

      {/* TWO-CHANNEL GRID */}
      <section className="relative bg-canvas-alt font-mono">
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

            {/* ── CH-A · MAC ─────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-md border border-edge bg-surface shadow-soft">
              <ChannelHeader
                icon={Laptop}
                channel="· CH-A · MAC"
                title="Talkie for Mac"
                meta="macOS 26+ · Apple Silicon"
              />

              <div className="space-y-6 p-5 md:p-6">
                {/* Primary: package-manager tabs */}
                <div>
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-trace" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                      · PRIMARY · PACKAGE MANAGER
                    </p>
                  </div>
                  <div className="mt-3">
                    <PackageManagerTabs />
                  </div>
                  <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-faint">
                    Installs the app, the CLI, and launches Talkie.
                  </p>
                </div>

                {/* Secondary: DMG */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · OR · DIRECT DMG
                  </p>
                  <TrackedAnchor
                    href={DMG_URL}
                    event={{ type: 'download', release: 'latest', source: 'v2_downloads_page' }}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-edge bg-canvas-alt px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink transition-all hover:-translate-y-0.5 hover:border-trace hover:text-trace"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>DOWNLOAD DMG</span>
                  </TrackedAnchor>
                </div>

                {/* Tertiary: curl one-liner */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · OR · CURL
                  </p>
                  <div className="mt-3">
                    <CopyCommand command={CLI_INSTALL_CMD} />
                  </div>
                </div>

                {/* CLI-only */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · CLI ONLY
                  </p>
                  <div className="mt-3">
                    <CopyCommand command={CLI_ONLY_CMD} variant="ghost" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── CH-B · IPHONE ──────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-md border border-edge bg-surface shadow-soft">
              <ChannelHeader
                icon={Smartphone}
                channel="· CH-B · IPHONE"
                title="Talkie Mobile"
                meta="iOS 18+"
              />

              <div className="space-y-6 p-5 md:p-6">
                {/* Primary: App Store */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · PRIMARY · APP STORE
                  </p>
                  <TrackedAnchor
                    href={APP_STORE_URL}
                    event={{ type: 'appStore', source: 'v2_downloads_page' }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-3 rounded-sm border border-trace px-5 py-3 text-[11px] uppercase tracking-[0.26em] text-trace transition-all hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" />
                    <span>OPEN APP STORE</span>
                    <span aria-hidden>↗</span>
                  </TrackedAnchor>
                </div>

                {/* Or scan */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · OR · SCAN
                  </p>
                  <div className="mt-3 flex items-center justify-center rounded-sm border border-edge-dim bg-canvas-alt p-5">
                    <div className="rounded-sm border border-edge-faint bg-white p-3">
                      <img
                        src="/qr-app-store.svg"
                        alt="QR code to download Talkie on the App Store"
                        className="block h-36 w-36"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                    Point your camera · open in App Store
                  </p>
                </div>

                {/* Cross-channel note */}
                <div className="rounded-sm border border-edge-faint bg-canvas-alt px-4 py-3">
                  <p className="font-mono text-[10px] leading-relaxed text-ink-muted">
                    iPhone captures sync to your Mac through your own iCloud
                    Private DB. No Talkie servers in the path.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Trust strip */}
          <div className="mt-10 grid grid-cols-1 gap-4 rounded-md border border-edge-faint bg-canvas px-5 py-5 sm:grid-cols-3">
            <StatRow
              icon={Cpu}
              label="REQUIRES"
              value="macOS 26 · iOS 18+"
            />
            <StatRow
              icon={ShieldCheck}
              label="SIGNED"
              value="Notarized · App Store"
            />
            <StatRow
              icon={Waves}
              label="DATA"
              value="Local-first · Your iCloud"
            />
          </div>

          {/* Cross-link to canonical */}
          <Link
            href="/v2/download"
            className="group mt-8 flex items-center justify-between gap-4 rounded-md border border-edge-dim bg-canvas px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-trace"
          >
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                · QUICK INSTALL
              </p>
              <p className="mt-1.5 font-mono text-[12px] text-ink">
                Just want the Mac DMG and the one-liner?
              </p>
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-transform group-hover:translate-x-0.5"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              CANONICAL INSTALL →
            </span>
          </Link>
        </div>
      </section>
    </>
  )
}
