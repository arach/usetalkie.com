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
import QRExpand from './QRExpand'
import TrackedAnchor from './TrackedAnchor'
import { TALKIE_MAC_OFFER, TALKIE_PHONE_APP } from '../shared/config/product-links'

/**
 * v2 DownloadAllPage — body of /downloads. All-platforms, all-channels view.
 *
 * Composition:
 *   1. Channel hero — eyebrow + headline + supporting copy
 *   2. Two-channel grid:
 *      · CH-A · MAC      — package-manager tabs + DMG fallback + curl
 *      · CH-B · IPHONE   — App Store CTA + QR code
 *   3. Trust strip — system requirements / signing / data posture
 *   4. Cross-link to canonical /download for the simple install path
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
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge-dim bg-canvas-alt text-trace transition-all duration-200 group-hover:scale-110 group-hover:border-amber/60"
          style={{ boxShadow: '0 0 8px var(--trace-faint)' }}
        >
          <Icon className="h-4 w-4 transition-transform duration-200" />
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
      {/* HERO WITH VISUAL */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas font-mono">
        <Graticule />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <ChannelEyebrow>· INSTALL / ALL CHANNELS · v2.5.43</ChannelEyebrow>
              <h1 className="mt-4 font-display text-4xl font-normal leading-[1.04] tracking-[-0.02em] text-ink md:text-5xl">
                Pick a device.<br />
                <span className="italic text-ink-muted">Same acoustic library.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-ink-muted">
                Download the current Mac build for free with on-device Parakeet v3 speech-to-text. The iPhone and Apple Watch apps are also free.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] text-ink-subtle">
                <span className="rounded-sm border border-edge-dim bg-canvas-alt px-2.5 py-1">BUILD 49</span>
                <span className="rounded-sm border border-edge-dim bg-canvas-alt px-2.5 py-1">UNIVERSAL BINARY</span>
                <span className="rounded-sm border border-edge-dim bg-canvas-alt px-2.5 py-1">APPLE NOTARIZED</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-2 shadow-soft">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-canvas-alt">
                <img
                  src="/images/braun/02-mac-poster.jpg"
                  alt="Talkie on MacBook in matte cream Braun finish"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-sm border border-white/10 bg-black/85 px-3 py-2 text-white backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-400">PARAKEET-TDT-V3</span>
                    <span className="font-mono text-[9px] text-zinc-300">· 0.6s ON-DEVICE</span>
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-400">100% OFFLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO-CHANNEL GRID */}
      <section className="relative bg-canvas-alt font-mono">
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

            {/* ── CH-A · MAC ─────────────────────────────────────────────── */}
            <div className="group relative overflow-hidden rounded-md border border-edge bg-surface shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]">
              <ChannelHeader
                icon={Laptop}
                channel="· CH-A · MAC"
                title="Talkie for Mac"
                meta="macOS 14+ · Apple Silicon"
              />

              <div className="space-y-6 p-5 md:p-6">
                <div className="rounded-sm border border-edge-faint bg-canvas-alt px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-trace">
                      · {TALKIE_MAC_OFFER.currentBuildLabel}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
                      PAID OFFER · PLANNED
                    </p>
                  </div>
                  <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-muted">
                    The planned offer is a {TALKIE_MAC_OFFER.trialLabel}, then{' '}
                    {TALKIE_MAC_OFFER.displayPrice} USD once. The trial and checkout are not active yet.
                  </p>
                </div>

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
                    className="group/btn mt-3 inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-edge bg-canvas-alt px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60 hover:text-amber"
                  >
                    <Download className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
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
            <div className="group relative overflow-hidden rounded-md border border-edge bg-surface shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]">
              <ChannelHeader
                icon={Smartphone}
                channel="· CH-B · IPHONE"
                title={TALKIE_PHONE_APP.name}
                meta={`${TALKIE_PHONE_APP.displayPrice} · iOS 26+`}
              />

              <div className="space-y-6 p-5 md:p-6">
                {/* Primary: App Store */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · PRIMARY · APP STORE
                  </p>
                  <TrackedAnchor
                    href={TALKIE_PHONE_APP.appStoreUrl}
                    event={{ type: 'appStore', source: 'v2_downloads_page' }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn mt-3 inline-flex w-full items-center justify-center gap-3 rounded-sm border border-trace px-5 py-3 text-[11px] uppercase tracking-[0.26em] text-trace transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]"
                  >
                    <Download className="h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110" />
                    <span>OPEN APP STORE</span>
                    <span aria-hidden className="inline-block transition-transform duration-200 group-hover/btn:translate-x-0.5">↗</span>
                  </TrackedAnchor>
                </div>

                {/* Or scan */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · OR · SCAN
                  </p>
                  <QRExpand
                    src="/qr-app-store.svg"
                    alt="QR code to download Talkie on the App Store"
                    caption="Point camera · open App Store"
                    className="mt-3"
                  />
                </div>

                {/* Cross-channel note */}
                <div className="rounded-sm border border-edge-faint bg-canvas-alt px-4 py-3">
                  <p className="font-mono text-[10px] leading-relaxed text-ink-muted">
                    Talkie for iPhone and Apple Watch is free. Captures sync to your Mac
                    through your iCloud account.
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
              value="macOS 14+ · iOS 26+ · watchOS 10+"
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

          {/* TECHNICAL SPEC SHEET */}
          <div className="mt-12 rounded-md border border-edge bg-surface p-6 font-mono md:p-8">
            <div className="flex items-center justify-between border-b border-edge-dim pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-trace">· SYSTEM SPECIFICATION SHEET</p>
                <h2 className="mt-1 font-display text-2xl font-normal text-ink">Technical Specifications (v2.5.43)</h2>
              </div>
              <span className="hidden sm:inline-block rounded-sm border border-edge-dim bg-canvas-alt px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-ink-subtle">
                BUILD 49 · NOTARIZED
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2 rounded-sm border border-edge-faint bg-canvas-alt p-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">SYSTEM / HOST</p>
                <p className="text-[11px] font-semibold text-ink">macOS 14.0+ (Sonoma, Sequoia)</p>
                <p className="text-[10px] leading-relaxed text-ink-muted">Apple Silicon (M1-M4) &amp; Intel x86_64 Universal Binary</p>
              </div>

              <div className="space-y-2 rounded-sm border border-edge-faint bg-canvas-alt p-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">ON-DEVICE ASR</p>
                <p className="text-[11px] font-semibold text-ink">FluidAudio Parakeet TDT v3</p>
                <p className="text-[10px] leading-relaxed text-ink-muted">~0.6s latency · 100% offline · CoreML Neural Engine</p>
              </div>

              <div className="space-y-2 rounded-sm border border-edge-faint bg-canvas-alt p-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">REASONING CATALOG</p>
                <p className="text-[11px] font-semibold text-ink">Gemini 3.8 Flash (Default)</p>
                <p className="text-[10px] leading-relaxed text-ink-muted">DeepSeek V4 · GLM-5 · Grok 4 · Llama 4 Scout · Claude</p>
              </div>

              <div className="space-y-2 rounded-sm border border-edge-faint bg-canvas-alt p-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">INTEGRITY &amp; IPC</p>
                <p className="text-[11px] font-semibold text-ink">Developer ID Signed + Notarized</p>
                <p className="text-[10px] leading-relaxed text-ink-muted">Mach XPC (to.talkie.agent.xpc.dev) · SHA-256 verified</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
