'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TALKIE_PHONE_APP } from '../../shared/config/product-links'
import { PLAY_PRODUCT_DEMO_EVENT } from '../../shared/events/product-demo'

const CTA_CLASS =
  'inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas'

const SURFACE_TRANSITION =
  'transition-[transform,opacity] duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none'

const SCREEN_TRANSITION =
  'transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none'

const MAC_SCENES = [
  {
    label: 'Home',
    src: '/screenshots/mac/current/talkie-home-light.webp',
    alt: 'Talkie for Mac showing meetings, voice captures, screenshots, workflows, and connected agents',
    description: 'Review meetings, captures, workflows, and connected agents.',
  },
  {
    label: 'Library',
    src: '/screenshots/mac/current/talkie-library-light.webp',
    alt: 'Talkie for Mac showing recent captures and an activity summary in the Library',
    description: 'Browse captures and review activity by source.',
  },
  {
    label: 'Editor',
    src: '/screenshots/mac/current/talkie-editor-light.webp',
    alt: 'Talkie for Mac showing a Markdown source, rendered preview, and revision history',
    description: 'Edit a note beside its preview and revision history.',
  },
  {
    label: 'Dictionary',
    src: '/screenshots/mac/current/talkie-dictionary-light.webp',
    alt: 'Talkie for Mac showing the form for a new Dictionary replacement',
    description: 'Add replacements for recurring transcription terms.',
  },
  {
    label: 'Learn',
    src: '/screenshots/mac/current/talkie-learn-light.webp',
    alt: 'Talkie for Mac showing product guidance for voice editing and inline differences',
    description: 'Review local product guidance inside Talkie.',
  },
]

const PHONE_SCENES = [
  {
    label: 'Home',
    src: '/screenshots/mobile/iphone-home-current.webp',
    alt: 'Talkie for iPhone showing recent memos and quick capture actions',
    description: 'Start a recording, scan context, or ask an agent.',
  },
  {
    label: 'Record',
    src: '/screenshots/mobile/iphone-recording-current.webp',
    alt: 'Talkie for iPhone recording a memo with controls for photos, feedback, and research',
    description: 'Add supporting material while the memo records.',
  },
  {
    label: 'Memo',
    src: '/screenshots/mobile/iphone-memo-current.webp',
    alt: 'Talkie for iPhone showing a saved meeting memo, transcript, and follow-up actions',
    description: 'Review the transcript and continue with an action.',
  },
  {
    label: 'Keyboard',
    src: '/screenshots/mobile/iphone-keyboard-current.webp',
    alt: 'Talkie for iPhone showing the Talkie keyboard in a writing app',
    description: 'Dictate and edit from the Talkie keyboard.',
  },
]

function useScreenshotReel(sceneCount, enabled) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const reelRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReduceMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const element = reelRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!enabled || !inView || paused || reduceMotion) return undefined

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setActiveIndex((currentIndex) => (currentIndex + 1) % sceneCount)
      }
    }, 5600)

    return () => window.clearInterval(interval)
  }, [enabled, inView, paused, reduceMotion, sceneCount])

  return {
    activeIndex,
    reelRef,
    select: setActiveIndex,
    interactionProps: {
      onPointerEnter: () => setPaused(true),
      onPointerLeave: () => setPaused(false),
      onFocusCapture: () => setPaused(true),
      onBlurCapture: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      },
    },
  }
}

function ScreenshotStack({ activeIndex, priority = false, scenes, sizes, objectClassName }) {
  return scenes.map((scene, index) => (
    <Image
      key={scene.src}
      src={scene.src}
      alt=""
      fill
      loading={priority && index === 0 ? 'eager' : 'lazy'}
      fetchPriority={priority && index === 0 ? 'high' : 'auto'}
      sizes={sizes}
      aria-hidden="true"
      className={`${SCREEN_TRANSITION} ${objectClassName} ${
        activeIndex === index
          ? 'z-10 scale-100 opacity-100'
          : 'pointer-events-none z-0 scale-[1.015] opacity-0'
      }`}
    />
  ))
}

function ReelSelector({ activeIndex, label, onSelect, orientation = 'horizontal', scenes, tabIndex }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={orientation === 'vertical'
        ? 'flex flex-col items-stretch gap-1'
        : 'flex flex-wrap items-center gap-x-0.5 gap-y-0.5'}
    >
      {scenes.map((scene, index) => {
        const selected = activeIndex === index

        return (
          <button
            key={scene.src}
            type="button"
            onClick={() => onSelect(index)}
            aria-pressed={selected}
            tabIndex={tabIndex}
            className={`min-h-11 rounded-md px-1.5 font-mono text-[10px] uppercase tracking-[0.08em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 ${orientation === 'vertical' ? 'flex items-center justify-between text-left' : ''} ${
              selected
                ? 'text-ink underline decoration-amber decoration-2 underline-offset-4'
                : 'text-ink-faint hover:text-ink'
            }`}
          >
            {scene.label}
            {orientation === 'vertical' && (
              <span aria-hidden="true" className="text-[9px] text-ink-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function AppStoreAccess({ tabIndex }) {
  return (
    <>
      <a
        href={TALKIE_PHONE_APP.appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Scan the QR code to open Talkie in the App Store"
        tabIndex={tabIndex}
        className="hidden shrink-0 items-center gap-3 rounded-lg px-2 py-1.5 text-left text-ink outline-none transition-colors hover:bg-canvas-alt focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas md:flex"
      >
        <span className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-[0_0.5rem_1.5rem_-0.75rem_rgba(17,17,15,0.24)]">
          <Image
            src="/qr-app-store.svg"
            alt=""
            width={64}
            height={64}
            className="size-full"
          />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium leading-tight">Scan for Talkie</span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
            App Store · {TALKIE_PHONE_APP.displayPrice}
          </span>
        </span>
      </a>

      <a
        href={TALKIE_PHONE_APP.appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Talkie in the App Store"
        tabIndex={tabIndex}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-canvas outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas md:hidden"
      >
        Open App Store
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-none stroke-current stroke-2">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
    </>
  )
}

export default function RemoteHero() {
  const [activeSurface, setActiveSurface] = useState('mac')
  const heroRef = useRef(null)
  const macFocusRef = useRef(null)
  const mobileFocusRef = useRef(null)
  const mobileTriggerRef = useRef(null)
  const backButtonRef = useRef(null)
  const showMobile = activeSurface === 'mobile'
  const macReel = useScreenshotReel(MAC_SCENES.length, !showMobile)
  const phoneReel = useScreenshotReel(PHONE_SCENES.length, showMobile)
  const activeMacScene = MAC_SCENES[macReel.activeIndex]
  const activePhoneScene = PHONE_SCENES[phoneReel.activeIndex]

  const openMobile = (event) => {
    const keyboardActivation = event?.detail === 0
    setActiveSurface('mobile')
    requestAnimationFrame(() => {
      heroRef.current?.scrollIntoView({ block: 'start' })
      const focusTarget = keyboardActivation ? backButtonRef.current : mobileFocusRef.current
      focusTarget?.focus({ preventScroll: true })
    })
  }

  const showMac = (event) => {
    const keyboardNavigation = !event || event.detail === 0
    setActiveSurface('mac')
    requestAnimationFrame(() => {
      const focusTarget = keyboardNavigation ? mobileTriggerRef.current : macFocusRef.current
      focusTarget?.focus({ preventScroll: true })
    })
  }

  return (
    <section
      ref={heroRef}
      aria-labelledby={showMobile ? 'home-mobile-title' : 'home-lead-title'}
      className="relative scroll-mt-12 overflow-hidden border-b border-edge-faint bg-canvas"
    >
      <div
        className="relative mx-auto max-w-[90rem] overflow-x-clip"
        onKeyDown={(event) => {
          if (showMobile && event.key === 'Escape') showMac()
        }}
      >
        <div
          aria-hidden={showMobile}
          inert={showMobile ? true : undefined}
          className={`${SURFACE_TRANSITION} grid items-center gap-10 px-4 pb-10 pt-10 min-[380px]:gap-12 sm:px-6 sm:pb-12 sm:pt-12 lg:min-h-[min(52rem,calc(100svh-3rem))] lg:grid-cols-[minmax(18rem,0.74fr)_minmax(0,1.26fr)] lg:gap-8 lg:px-8 lg:pb-12 lg:pt-8 xl:gap-10 xl:pb-14 xl:pt-10 ${showMobile ? 'pointer-events-none -translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
        >
          <span ref={macFocusRef} tabIndex={-1} className="sr-only">Talkie for Mac</span>
          <div className="relative z-10 min-w-0 lg:pr-6 xl:pr-10">
            <h1
              id="home-lead-title"
              className="max-w-[11.5ch] font-display text-[clamp(2.7rem,12vw,3.55rem)] font-normal leading-[0.94] tracking-[-0.035em] text-ink lg:text-[clamp(3.1rem,4.1vw,4.25rem)] xl:max-w-none xl:text-[clamp(4.35rem,5.6vw,5.55rem)] xl:leading-[0.92]"
            >
              <span className="block">Your agents,</span>
              {' '}
              <span className="block">within reach.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-muted sm:mt-7 lg:mt-8 lg:text-lg xl:mt-10 xl:text-xl">
              Dictate into any Mac app. Capture context on iPhone or Watch. Send the right material to an agent and follow the result.
            </p>

            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap lg:mt-8 xl:mt-10">
              <Link
                href="#downloads"
                className={`${CTA_CLASS} border border-ink bg-ink text-canvas transition-transform duration-200 hover:-translate-y-0.5`}
              >
                Download for Mac
              </Link>
              <Link
                href="#product-model"
                className={`${CTA_CLASS} border border-edge bg-canvas text-ink transition-colors duration-200 hover:bg-canvas-alt`}
              >
                See how it works
              </Link>
            </div>

            <p className="mt-4 max-w-xl font-mono text-[11px] leading-relaxed text-ink-dim">
              macOS 26+ · Apple silicon
            </p>
          </div>

          <figure
            ref={macReel.reelRef}
            className="min-w-0 self-center pb-2 lg:pb-0"
            {...macReel.interactionProps}
          >
            <div className="relative w-full">
              <Link
                href="#product-demo"
                aria-label={`Watch the Talkie demo. Current screen: ${activeMacScene.label}.`}
                onClick={() => {
                  window.dispatchEvent(new Event(PLAY_PRODUCT_DEMO_EVENT))
                }}
                tabIndex={showMobile ? -1 : undefined}
                className="group relative block aspect-[1513/1235] overflow-hidden rounded-xl border border-edge-faint bg-[#eaf0f4] shadow-[0_2rem_5rem_-2rem_rgba(17,17,15,0.24)] outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
              >
                <span role="img" aria-label={activeMacScene.alt} className="absolute inset-0">
                  <ScreenshotStack
                    activeIndex={macReel.activeIndex}
                    priority
                    scenes={MAC_SCENES}
                    sizes="(max-width: 1023px) calc(100vw - 2rem), (max-width: 1439px) 64vw, 900px"
                    objectClassName="object-cover object-top group-hover:brightness-[0.96]"
                  />
                </span>
                <span className="absolute inset-0 z-20 flex items-center justify-center" aria-hidden="true">
                  <span className="flex size-14 items-center justify-center rounded-full border border-white/60 bg-[#11110f]/85 text-white shadow-[0_0.75rem_2rem_-0.5rem_rgba(17,17,15,0.45)] transition-transform duration-200 group-hover:scale-105 sm:size-16">
                    <svg viewBox="0 0 24 24" className="ml-0.5 size-5 fill-current sm:size-6">
                      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
                    </svg>
                  </span>
                </span>
              </Link>
            </div>

            <figcaption className="mt-4 border-t border-edge-faint pt-3 sm:flex sm:items-end sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[11px] leading-relaxed text-ink-dim">
                  Talkie for Mac <span aria-hidden="true">·</span> {activeMacScene.description}
                </p>
                <ReelSelector
                  activeIndex={macReel.activeIndex}
                  label="Mac screenshots"
                  onSelect={macReel.select}
                  scenes={MAC_SCENES}
                  tabIndex={showMobile ? -1 : undefined}
                />
              </div>
              <button
                ref={mobileTriggerRef}
                type="button"
                onClick={openMobile}
                tabIndex={showMobile ? -1 : undefined}
                aria-label="Show Talkie for iPhone and Apple Watch"
                className="group mt-3 flex min-h-14 items-center gap-3 rounded-xl border border-edge-faint px-3 py-2 text-left text-ink outline-none transition-colors hover:bg-canvas-alt focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas sm:mt-0 sm:shrink-0"
              >
                <span className="relative h-12 w-6 shrink-0 overflow-hidden rounded-[0.45rem] border border-edge-faint bg-white shadow-[0_0.45rem_1rem_-0.4rem_rgba(17,17,15,0.32)]">
                  <Image
                    src="/screenshots/mobile/iphone-home-current.webp"
                    alt=""
                    fill
                    sizes="24px"
                    className="object-cover object-top"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-medium leading-tight">Talkie for iPhone and Watch</span>
                  <span className="mt-1 block font-mono text-[10px] leading-none text-ink-faint">Show mobile context</span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-4 shrink-0 fill-none stroke-current stroke-2 transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </figcaption>
          </figure>
        </div>

        <div
          aria-hidden={!showMobile}
          inert={!showMobile ? true : undefined}
          className={`${SURFACE_TRANSITION} absolute inset-x-4 bottom-10 top-10 sm:inset-x-6 sm:bottom-12 sm:top-12 lg:inset-x-8 lg:bottom-12 lg:top-8 xl:bottom-14 xl:top-10 ${showMobile ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'}`}
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-edge bg-canvas-alt">
            <span ref={mobileFocusRef} tabIndex={-1} className="sr-only">Talkie for iPhone and Apple Watch</span>
            <div className="flex shrink-0 items-center justify-between gap-4 px-3 py-2 sm:px-5 sm:py-3 lg:px-6">
              <button
                ref={backButtonRef}
                type="button"
                onClick={showMac}
                tabIndex={showMobile ? undefined : -1}
                aria-label="Back to Talkie for Mac"
                className="group inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-ink outline-none transition-colors hover:bg-canvas focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-canvas-alt"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-4 shrink-0 fill-none stroke-current stroke-2 transition-transform duration-200 group-hover:-translate-x-0.5"
                >
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                <span className="relative h-7 w-11 shrink-0 overflow-hidden rounded-md border border-edge-faint bg-white shadow-[0_0.25rem_0.65rem_-0.45rem_rgba(17,17,15,0.24)]">
                  <Image
                    src="/screenshots/mac/current/talkie-home-light.webp"
                    alt=""
                    fill
                    loading="eager"
                    sizes="44px"
                    className="object-cover"
                  />
                </span>
                <span>Mac</span>
              </button>
              <h2 id="home-mobile-title" className="font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-ink-faint">
                iPhone + Watch
              </h2>
            </div>

            <div
              ref={phoneReel.reelRef}
              className="min-h-0 flex-1 overflow-hidden px-2 pb-2 min-[380px]:px-3 sm:px-5 sm:pb-4 lg:px-6"
              {...phoneReel.interactionProps}
            >
              <div
                className="grid h-full min-h-0 overflow-hidden rounded-xl px-3 pb-3 pt-5 shadow-[inset_0_-1px_0_rgba(17,17,15,0.08)] min-[380px]:px-5 sm:px-8 sm:pb-5 sm:pt-7 lg:grid-cols-[minmax(12rem,0.72fr)_minmax(24rem,1.38fr)_minmax(8rem,0.42fr)] lg:gap-8 lg:px-10 xl:grid-cols-[minmax(15rem,0.76fr)_minmax(27rem,1.34fr)_minmax(9rem,0.4fr)] xl:gap-10 xl:px-12"
                style={{ background: 'color-mix(in oklab, var(--ink) 4.5%, transparent)' }}
              >
                <div className="hidden min-w-0 flex-col justify-center lg:flex">
                  <h3 className="max-w-[9ch] font-display text-[clamp(2.6rem,3.7vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.035em] text-ink">
                    Capture where the work starts.
                  </h3>
                  <p className="mt-6 max-w-[31ch] text-base leading-relaxed text-ink-muted xl:text-lg">
                    {activePhoneScene.description} Apple Watch can start the same capture.
                  </p>
                </div>

                <div className="flex min-h-0 flex-col items-center justify-center">
                  <div className="flex min-h-0 w-full flex-1 items-center justify-center gap-3 min-[380px]:gap-5 sm:items-end sm:gap-8 lg:gap-8 xl:gap-10">
                    <div
                      role="img"
                      aria-label={activePhoneScene.alt}
                      className="relative w-[64%] max-w-[16.5rem] shrink-0 overflow-hidden rounded-[1.75rem] bg-[#1f1f1c] p-[4px] shadow-[0_1.6rem_3rem_-1rem_rgba(17,17,15,0.34)] sm:rounded-[2.5rem] sm:p-[6px] lg:w-[58%] lg:max-w-[13.5rem] xl:max-w-[15rem]"
                    >
                      <div className="relative aspect-[1320/2868] w-full overflow-hidden rounded-[1.5rem] bg-[#fbfaf7] sm:rounded-[2.15rem]">
                        <ScreenshotStack
                          activeIndex={phoneReel.activeIndex}
                          scenes={PHONE_SCENES}
                          sizes="(max-width: 379px) 58vw, (max-width: 639px) 54vw, (max-width: 1023px) 280px, (max-width: 1279px) 216px, 240px"
                          objectClassName="object-contain"
                        />
                      </div>
                    </div>

                    <div className="relative w-[26%] max-w-[10.5rem] shrink-0 self-center overflow-hidden rounded-[1.6rem] bg-[#1f1f1c] p-[4px] shadow-[0_1.25rem_2.25rem_-0.75rem_rgba(17,17,15,0.38)] sm:self-end sm:rounded-[2.5rem] sm:p-[6px] lg:w-[30%] lg:max-w-[9.5rem] xl:max-w-[10.5rem]">
                      <div className="relative aspect-[416/496] w-full overflow-hidden rounded-[1.35rem] bg-black sm:rounded-[2.15rem]">
                        <Image
                          src="/screenshots/mobile/apple-watch-home-current.webp"
                          alt="Talkie for Apple Watch showing the current record control and Ask AI action"
                          fill
                          sizes="(max-width: 379px) 24vw, (max-width: 639px) 22vw, (max-width: 1023px) 160px, (max-width: 1279px) 152px, 168px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 hidden w-full justify-center border-t border-edge-faint pt-4 lg:flex">
                    <AppStoreAccess tabIndex={showMobile ? undefined : -1} />
                  </div>
                </div>

                <div className="hidden min-w-0 flex-col justify-center border-l border-edge-faint pl-5 lg:flex xl:pl-6">
                  <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
                    iPhone views
                  </p>
                  <ReelSelector
                    activeIndex={phoneReel.activeIndex}
                    label="iPhone screenshots"
                    onSelect={phoneReel.select}
                    orientation="vertical"
                    scenes={PHONE_SCENES}
                    tabIndex={showMobile ? undefined : -1}
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-edge-faint bg-canvas px-3 py-2 sm:px-6 sm:py-3 lg:hidden">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
                <div className="min-w-0">
                  <ReelSelector
                    activeIndex={phoneReel.activeIndex}
                    label="iPhone screenshots"
                    onSelect={phoneReel.select}
                    scenes={PHONE_SCENES}
                    tabIndex={showMobile ? undefined : -1}
                  />
                  <p className="max-w-xl text-[13px] leading-5 text-ink-muted sm:text-sm lg:text-base lg:leading-6">
                    {activePhoneScene.description} Apple Watch can start the same capture.
                  </p>
                </div>
                <AppStoreAccess tabIndex={showMobile ? undefined : -1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
