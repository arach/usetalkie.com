import { ArrowUpRight, Download, QrCode, Smartphone, Watch } from 'lucide-react'
import SurfacesSubNav from './SurfacesSubNav'
import MobileCaptureModes from './MobileCaptureModes'
import MobileTransitBay from './MobileTransitBay'
import MobileMoments from './MobileMoments'
import InstallCard from './InstallCard'
import QRExpand from './QRExpand'
import TrackedAnchor from './TrackedAnchor'
import { TALKIE_PHONE_APP } from '../shared/config/product-links'

/**
 * MobilePage — body for /mobile (Channel B).
 *
 * Pure server component. The /v2 layout already wraps every route in
 * <SiteShell> on a `bg-canvas text-ink` shell, so this component renders
 * the page-level chrome only: the surfaces sub-nav, hero, two content
 * sections, and the cross-surface tie-back to /mac + install CTA.
 */
export default function MobilePage() {
  return (
    <>
      <SurfacesSubNav active="mobile" />

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · CH-B / MOBILE · 48.0kHz
            </p>
            <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
              Catch it while
              <br />
              <span className="italic">it is live.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              iPhone and Apple Watch are the fast path back into Talkie. Phone and
              Watch catch the thought. Mac is where you actually do something with it.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TrackedAnchor
                href={TALKIE_PHONE_APP.appStoreUrl}
                event={{ type: 'appStore', source: 'mobile_hero' }}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={`Download ${TALKIE_PHONE_APP.name} on the App Store`}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-ink bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-canvas transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_rgba(0,0,0,0.5)]"
              >
                <Download className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span>Download on the App Store</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </TrackedAnchor>
              <a
                href="#talkie-phone-qr"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-edge px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-all duration-200 hover:border-trace hover:text-trace"
              >
                <QrCode className="h-4 w-4" />
                Scan with phone
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="h-3 w-3 text-trace" />
                iPhone
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Watch className="h-3 w-3 text-trace" />
                Apple Watch included
              </span>
              <span>Available on the App Store</span>
            </div>
          </div>

          <aside
            id="talkie-phone-qr"
            className="relative scroll-mt-28 overflow-hidden rounded-md p-4 sm:p-5"
            style={{
              background: 'var(--panel-bg)',
              color: 'var(--panel-ink)',
              border: '1px solid var(--panel-edge)',
              boxShadow: 'var(--panel-chassis-shadow)',
              '--trace': 'var(--panel-trace)',
              '--trace-glow': 'var(--panel-trace-glow)',
              '--ink': 'var(--panel-ink)',
              '--ink-muted': 'var(--panel-ink-muted)',
              '--ink-faint': 'var(--panel-ink-faint)',
              '--ink-subtle': 'var(--panel-ink-subtle)',
              '--edge': 'var(--panel-edge)',
              '--edge-dim': 'var(--panel-edge-dim)',
              '--edge-faint': 'var(--panel-edge-faint)',
              '--canvas-alt': 'var(--panel-bg-alt)',
              '--canvas-overlay': 'rgba(6, 9, 10, 0.92)',
            }}
          >
            <span aria-hidden className="absolute left-1.5 top-1.5 font-mono text-[8px] text-ink-faint">·</span>
            <span aria-hidden className="absolute right-1.5 top-1.5 font-mono text-[8px] text-ink-faint">·</span>
            <div className="flex items-center justify-between gap-4 border-b border-edge-faint pb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-trace"
                  style={{ boxShadow: '0 0 6px var(--trace)' }}
                />
                Talkie Phone
              </span>
              <span>App Store · live</span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center lg:grid-cols-1">
              <div>
                <p className="font-display text-2xl font-normal tracking-[-0.01em] text-ink">
                  Point your camera.
                  <span className="italic text-trace"> Keep the thought.</span>
                </p>
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-muted">
                  Scan to open {TALKIE_PHONE_APP.name} directly in the App Store.
                </p>
              </div>
              <QRExpand
                src="/qr-app-store.svg"
                alt={`QR code to download ${TALKIE_PHONE_APP.name} on the App Store`}
                caption="Scan · App Store"
              />
            </div>

            <TrackedAnchor
              href={TALKIE_PHONE_APP.appStoreUrl}
              event={{ type: 'appStore', source: 'mobile_hero_qr' }}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 flex items-center justify-between rounded-sm border border-edge bg-canvas-alt px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted transition-all duration-200 hover:border-trace hover:text-trace"
            >
              <span>Open App Store instead</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </TrackedAnchor>
          </aside>
        </div>
      </section>

      {/* ─────────────── SECTIONS ─────────────── */}
      <MobileCaptureModes />

      {/* DARK TRANSIT BEAT — 3 channels firing live (amber/emerald/cyan) */}
      <MobileTransitBay />

      <MobileMoments />

      {/* INSTALL — patch-bay chassis (shared across Mac-context pages) */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
          <div className="text-center">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · ONE LIBRARY · EVERY SURFACE
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink md:text-4xl">
              Catch it on iPhone.
              <span className="italic text-ink-muted"> Finish it on Mac.</span>
            </h2>
          </div>
          <div className="mt-10">
            <InstallCard />
          </div>
        </div>
      </section>
    </>
  )
}
