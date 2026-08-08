"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Film, Images, Laptop, Smartphone, Watch } from 'lucide-react'
import { getTourItems } from '../lib/tour'
import DownloadBay from './DownloadBay'
import DemoViewer from './DemoViewer'

/**
 * TourLandingPage — single page, three surfaces.
 *
 *   1. Hero
 *   2. Demos    — DemoViewer with Mac / Mobile / Full Reel sections
 *   3. Gallery  — platform-filtered on mobile; all sections on desktop
 *   4. Install CTA
 *
 * Mobile gallery uses an exclusive platform filter (default Mac) plus
 * horizontal snap rails for iPhone/Watch so the page stays curated
 * without hiding any screens.
 */

const DEMO_SECTIONS = [
  {
    id: 'mac',
    title: 'Mac',
    description: 'Dictate into anything you’re already using. Compose, transform, ship.',
    videos: [
      { id: 'mac-overview', src: '/videos/TalkieOverview.mp4', title: 'Overview' },
      { id: 'mac-dictation', src: '/videos/TalkieDictation.mp4', title: 'Dictation' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    description: 'Capture on the go. Sync via iCloud. Your Mac picks it up from there.',
    videos: [
      { id: 'mob-recording', src: '/videos/MobileRecording.mp4', title: 'Recording' },
      { id: 'mob-capture', src: '/videos/CaptureOverview.mp4', title: 'Capture' },
    ],
  },
  {
    id: 'reel',
    title: 'Full Reel',
    description: 'The longer story. The 60-second tour and the closing pitch.',
    videos: [
      { id: 'reel-60s', src: '/videos/60s%20Demo%20-%20Full%20Overview.mp4', title: '60-second Tour' },
      { id: 'reel-promo', src: '/videos/TalkiePromo.mp4', title: 'Promo' },
    ],
  },
]

const PLATFORMS = [
  { id: 'mac', label: 'Mac', icon: Laptop },
  { id: 'iphone', label: 'iPhone', icon: Smartphone },
  { id: 'watch', label: 'Watch', icon: Watch },
]

export default function TourLandingPage() {
  const items = getTourItems()
  const macItems = items.filter((it) => it.platform === 'mac')
  const iphoneItems = items.filter((it) => it.platform === 'iphone')
  const watchItems = items.filter((it) => it.platform === 'watch')
  const [mobilePlatform, setMobilePlatform] = useState('mac')

  const platformItems = {
    mac: macItems,
    iphone: iphoneItems,
    watch: watchItems,
  }

  return (
    <main id="main">
      {/* ========== HERO ========== */}
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
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-trace">
              · TALKIE / TOUR
            </p>
          </div>
          <h1 className="mt-4 font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
            See Talkie in action.
            <br />
            <span className="italic text-amber">On Mac, iPhone, and Watch.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Watch the demos at the top, then step through every screen
            below. Each gallery card opens a focused view with audio
            narration so you can hear what each piece is doing.
          </p>
        </div>
      </section>

      {/* ========== DEMOS ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeader
            eyebrow="· 02 / DEMOS"
            icon={Film}
            title="Press play."
            blurb="Full-screen player, custom controls, and a playlist of every clip. Switch sections to jump between Mac, Mobile, and the longer pieces."
          />
          <DemoViewer sections={DEMO_SECTIONS} />
        </div>
      </section>

      {/* ========== GALLERY ========== */}
      <section
        id="gallery"
        className="relative scroll-mt-24 border-t border-edge-faint bg-canvas"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <SectionHeader
            eyebrow="· 03 / GALLERY"
            icon={Images}
            title="Look around."
            blurb="Click any card for the focused view with audio narration. Press Esc to land back at this gallery."
          />

          {/* Mobile: exclusive platform filter */}
          <div className="mb-8 md:hidden">
            <div
              role="tablist"
              aria-label="Gallery platform"
              className="flex min-w-0 items-stretch gap-0.5 overflow-hidden rounded-md border border-edge bg-surface p-1"
            >
              {PLATFORMS.map((p) => {
                const Icon = p.icon
                const isActive = mobilePlatform === p.id
                const count = platformItems[p.id].length
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setMobilePlatform(p.id)}
                    className={`relative flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1 px-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace sm:gap-1.5 sm:px-2 sm:text-[11px] sm:tracking-[0.16em] ${
                      isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    <Icon className="hidden h-3.5 w-3.5 shrink-0 xs:block" aria-hidden />
                    <span className="truncate">{p.label}</span>
                    <span className="shrink-0 text-ink-muted tabular-nums">{count}</span>
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-x-2 bottom-1 block h-0.5 bg-trace sm:inset-x-3"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile: single active platform */}
          <div className="md:hidden">
            {mobilePlatform === 'mac' && (
              <SubGallery
                icon={Laptop}
                eyebrow={`MAC · ${macItems.length} SCREENS`}
                items={macItems}
                platform="mac"
                layout="stack"
              />
            )}
            {mobilePlatform === 'iphone' && (
              <SubGallery
                icon={Smartphone}
                eyebrow={`iPHONE · ${iphoneItems.length} SCREENS`}
                items={iphoneItems}
                platform="iphone"
                layout="rail"
              />
            )}
            {mobilePlatform === 'watch' && (
              <SubGallery
                icon={Watch}
                eyebrow={`WATCH · ${watchItems.length} SCREENS`}
                items={watchItems}
                platform="watch"
                layout="rail"
              />
            )}
          </div>

          {/* Desktop: all three expanded */}
          <div className="hidden space-y-16 md:block">
            <SubGallery
              icon={Laptop}
              eyebrow={`MAC · ${macItems.length} SCREENS`}
              items={macItems}
              platform="mac"
              layout="grid"
            />
            <SubGallery
              icon={Smartphone}
              eyebrow={`iPHONE · ${iphoneItems.length} SCREENS`}
              items={iphoneItems}
              platform="iphone"
              layout="grid"
            />
            <SubGallery
              icon={Watch}
              eyebrow={`WATCH · ${watchItems.length} SCREENS`}
              items={watchItems}
              platform="watch"
              layout="grid"
            />
          </div>
        </div>
      </section>

      {/* ========== INSTALL CTA ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
            <DownloadBay caption="See it once, then put it on your machine." />
          </div>
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function SectionHeader({ eyebrow, icon: Icon, title, blurb }) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-trace">
        {Icon ? <Icon className="h-3 w-3" /> : null}
        <span>{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-ink md:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-[14px] leading-relaxed text-ink-muted">{blurb}</p>
    </div>
  )
}

/**
 * layout:
 *   - "grid"  — desktop multi-column
 *   - "stack" — mobile Mac one-column list
 *   - "rail"  — mobile iPhone/Watch horizontal snap strip
 */
function SubGallery({ icon: Icon, eyebrow, items, platform, layout = 'grid' }) {
  const gridCols =
    platform === 'iphone'
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      : platform === 'watch'
        ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
  const aspectClass =
    platform === 'mac'
      ? 'aspect-[16/10]'
      : platform === 'watch'
        ? 'aspect-[5/6]'
        : 'aspect-[9/19]'
  const platformLabel =
    platform === 'iphone' ? 'iPhone' : platform === 'watch' ? 'Apple Watch' : 'Mac'

  const isRail = layout === 'rail'
  const isStack = layout === 'stack'

  const containerClass = isRail
    ? 'flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
    : isStack
      ? 'grid grid-cols-1 gap-4'
      : `grid gap-4 ${gridCols}`

  const cardClass = isRail
    ? platform === 'watch'
      ? 'w-[42%] min-w-[9.5rem] max-w-[12rem] shrink-0 snap-start'
      : 'w-[70%] min-w-[12rem] max-w-[16rem] shrink-0 snap-start'
    : 'block'

  return (
    <div>
      <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
        <Icon className="h-3 w-3" />
        <span>{eyebrow}</span>
      </div>
      <div className={containerClass}>
        {items.map((item, idx) => (
          <Link
            key={item.slug}
            href={`/tour/${item.slug}/`}
            className={`group overflow-hidden rounded-md border border-edge-dim bg-surface transition-all duration-200 motion-reduce:transition-none hover:border-amber/50 hover:shadow-[0_0_22px_-6px_var(--trace-glow)] motion-safe:hover:-translate-y-0.5 ${cardClass}`}
          >
            <div className={`relative overflow-hidden bg-canvas-alt ${aspectClass}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={`${item.title} — Talkie for ${platformLabel}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-[1.02]"
              />
              <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center rounded-sm border border-edge-dim bg-canvas/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint backdrop-blur-sm">
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-4">
              <span className="font-display text-[15px] leading-tight text-ink transition-colors group-hover:text-amber">
                {item.title}
              </span>
              {/* Full captions on stack/desktop; shorter presence on rails */}
              <span
                className={`text-[12px] leading-snug text-ink-muted ${
                  isRail ? 'line-clamp-2' : ''
                }`}
              >
                {item.caption}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
