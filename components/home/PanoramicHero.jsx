"use client"

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Download, QrCode, Watch, Smartphone, Laptop, ArrowRight, Play, Terminal, Check, Copy, Bot } from 'lucide-react'

const PACKAGE_MANAGERS = [
  { id: 'bun',  label: 'BUN',  cmd: 'bun add -g @talkie/app' },
  { id: 'npm',  label: 'NPM',  cmd: 'npm install -g @talkie/app' },
  { id: 'pnpm', label: 'PNPM', cmd: 'pnpm add -g @talkie/app' },
]

/**
 * PanoramicHero — homepage synthesis composition.
 *
 * One chassis, three inset bays:
 *   LEFT   · INPUT  — keyboard-key transducer + device-aware install affordance
 *   CENTER · SCOPE  — animated waveform (idle, gets richer when device flips)
 *                     + decoded transcription line underneath
 *   RIGHT  · OUTPUT — device screenshot + per-use-case artifact line
 *
 * The sub-hero (CinematicHero) carries a user-driven use-case roller.
 * Clicking a row sets useCaseIdx; the entire chassis re-syncs:
 *   - sub-hero shows the active action → outcome summary
 *   - ScopeBay shows what was literally said (transcription)
 *   - OutputBay shows what landed (artifact)
 * Three views of the same scenario, decomposed across the pipeline.
 *
 * Above the bays: a single chassis meta-strip (eyebrow, channel, REV).
 * Between the bays: visible signal-path "wires" rendered in SVG that
 * highlight when the active device matches that lane.
 *
 * Rotating the kb-key (auto every 5.4s, or click) morphs all three bays
 * in lock-step — same input event, same output device. The whole panel
 * reads as one piece of equipment, not a stack of cards.
 *
 * Theme behavior: the chassis stays dark in BOTH light + dark modes via
 * the panel-* tokens (instruments-as-objects from Path B). The cream
 * canvas hosts amber accents (eyebrow above the chassis) per the brief.
 */

/* Generic device-category labels (Mac → Computer, iPhone → Phone)
 * for brand-agnostic rolodex framing. Per-product pages keep the
 * Apple-specific naming where install / OS-version copy demands it. */
const DEVICES = [
  {
    key: 'mac',
    label: 'Computer',
    Icon: Laptop,
    taglines: [
      'Voice a rough draft. Watch it tighten.',
      'Speak any thought. Search it tomorrow.',
    ],
    useCases: [
      {
        action: 'Voice a rough draft',
        outcome: 'Cleanup rule runs',
        transcription:
          'okay the intro is doing too much, lemme lead with the conflict instead, see if it lands',
        artifact: 'Draft refined · 127→89 words · 3 cuts',
      },
      {
        action: 'Record the meeting',
        outcome: 'Meeting notes ready',
        transcription:
          'alex pushed back on the migration window, we settled on staging-first friday, jamie owns the rollback',
        artifact: 'Meeting notes · 6 items · 4 owners',
      },
      {
        action: 'Describe the bug',
        outcome: 'GitHub issue filed',
        transcription:
          'cmd-shift-3 on the empty state crashes it, started after 0.4.1, can repro 2 of 3',
        artifact: 'Issue #482 filed · 3 logs attached',
      },
    ],
    install: {
      kind: 'dmg',
      eyebrow: 'INSTALL · MAC',
      title: 'Download .dmg',
      meta: '12 mb',
      href: '/downloads',
      Icon: Download,
    },
    screenshot: {
      src: '/screenshots/mac-home.png',
      alt: 'Talkie for Mac home view',
      caption: 'Library, search, compose',
    },
    waveformBias: 0,
    inputSpec: {
      platform: 'macOS 13+',
      release:  'v0.4.2 (142)',
      channel:  'VOICE.IN',
      status:   'ARMED',
    },
    features: [
      'Global hotkey dictation',
      'Per-app context aware',
      'On-device whisper',
    ],
  },
  {
    key: 'iphone',
    label: 'Phone',
    Icon: Smartphone,
    taglines: [
      'Ramble for five minutes. Queue a research brief.',
      'Snap and speak. Spec on your desk.',
    ],
    useCases: [
      {
        action: 'Ramble five minutes',
        outcome: 'Brief queued',
        transcription:
          'why are we seeing churn spike in week three of trial, dig the cohort, check the onboarding redesign',
        artifact: 'Brief queued · ETA ~12 min',
      },
      {
        action: 'Snap + voice an idea',
        outcome: 'Spec at your desk',
        transcription:
          'this latte cup curvature, i want this on the talkie hardware sketch, riff for a desk render',
        artifact: 'Spec drafted · 1 ref image',
      },
      {
        action: 'Describe the problem',
        outcome: 'Picked up on Mac',
        transcription:
          'build keeps failing on the dependabot lockfile, pull the last 5 runs, see if it is a single transitive',
        artifact: 'Mac picked it up · running',
      },
    ],
    install: {
      kind: 'qr',
      eyebrow: 'INSTALL · iPHONE',
      title: 'Get on App Store',
      meta: 'iOS 26+',
      href: 'https://apps.apple.com/us/app/talkie-mobile/id6755734109',
      Icon: QrCode,
    },
    screenshot: {
      src: '/screenshots/iphone-16-pro-max-3.png',
      alt: 'Talkie for iPhone capture view',
      caption: 'Capture on the go',
    },
    waveformBias: 1,
    inputSpec: {
      platform: 'iOS 26+',
      release:  'v0.4.2 (142)',
      channel:  'MIC.IN',
      status:   'ARMED',
    },
    features: [
      'Quick capture',
      'Snap + describe',
      'Background research',
    ],
  },
  {
    key: 'watch',
    label: 'Watch',
    Icon: Watch,
    taglines: [
      'Tap mid-thought. Searchable by tonight.',
      'The 3am idea, still there at 9am.',
    ],
    useCases: [
      {
        action: 'Tap mid-thought',
        outcome: 'Searchable by tonight',
        transcription:
          'what if install had a try-without-account path, lower friction first run, sign in after first capture',
        artifact: 'Captured · indexed at 21:00',
      },
      {
        action: 'Capture without stopping',
        outcome: 'Waiting on your Mac',
        transcription:
          'follow up with marc on licensing, the simple non-commercial language was cleaner, ask if his team signs',
        artifact: 'Waiting on Mac · 1 todo',
      },
      {
        action: 'The 3am idea',
        outcome: 'Still there at 9am',
        transcription:
          'that pricing tier we kept dancing around, it is just two tiers, solo and team, rest is over-engineering',
        artifact: 'Logged · 3:14am · still here',
      },
    ],
    install: {
      kind: 'handoff',
      eyebrow: 'INSTALL · WATCH',
      title: 'Pairs with iPhone',
      meta: 'watch app',
      href: '/mobile',
      Icon: Watch,
    },
    screenshot: {
      src: '/screenshots/apple-watch-link.png',
      alt: 'Talkie ready to record on Apple Watch',
      caption: 'Tap-to-capture on wrist',
    },
    waveformBias: 2,
    inputSpec: {
      platform: 'watchOS 10+',
      release:  'v0.4.2 (142)',
      channel:  'DICTATE.IN',
      status:   'PAIRED',
    },
    features: [
      'Tap-to-capture',
      'Glance summary',
      'Auto-sync to Mac',
    ],
  },
  {
    key: 'agents',
    label: 'Agents',
    Icon: Bot,
    taglines: [
      'Voice the trigger. Queue the workflow.',
      'Wire a daily brief.',
    ],
    useCases: [
      {
        action: 'Voice the trigger',
        outcome: 'Workflow scheduled',
        transcription:
          'every weekday 6am, pull the top 3 github issues by reactions, draft a triage, drop in my morning inbox',
        artifact: 'Workflow scheduled · daily 06:00',
      },
      {
        action: 'Wire a daily',
        outcome: 'Brief lands at 7am',
        transcription:
          '5-line brief on the macos voice ml landscape, apple wwdc signals, any new on-device frameworks',
        artifact: 'Brief at 07:00 · 5 sources',
      },
      {
        action: 'Sketch a recipe',
        outcome: 'Recipe armed',
        transcription:
          'anytime someone tags me on a github issue, draft a 1-para reply with a clarifying question, hold for review',
        artifact: 'Recipe armed · awaiting trigger',
      },
    ],
    install: {
      kind: 'handoff',
      eyebrow: 'CONFIGURE · AGENTS',
      title: 'Wire a workflow',
      meta: 'workflows',
      href: '/workflows',
      Icon: Bot,
    },
    screenshot: {
      src: '/screenshots/talkie-agent-handoff-console.png',
      alt: 'Talkie voice memo sent to a coding agent from the Console',
      caption: 'Voice to agent handoff',
    },
    waveformBias: 3,
    inputSpec: {
      platform: 'Workflow runtime',
      release:  'v0.4.2',
      channel:  'TRIGGER.IN',
      status:   'WIRED',
    },
    features: [
      'Voice trigger → action',
      'Daily briefs · cron',
      'Recipe runner · JSON',
    ],
  },
]

const ROTATION_MS = 5400
const FLIP_OUT_MS = 140
const FLIP_IN_MS = 220

export default function PanoramicHero() {
  const [deviceIdx, setDeviceIdx] = useState(0)
  // useCaseIdx is the single source of truth for the synchronized
  // pipeline: sub-hero summary roller, ScopeBay transcription, and
  // OutputBay artifact all read from device.useCases[useCaseIdx]. The
  // user drives advancement by clicking the roller — there is no auto-
  // rotate (devices already auto-rotate; nesting two timers reads as
  // busy). When the device flips, we reset to position 0 so each
  // device starts on its first scenario.
  const [useCaseIdx, setUseCaseIdx] = useState(0)
  const [flipPhase, setFlipPhase] = useState('idle') // 'idle' | 'out' | 'in'
  const [paused, setPaused] = useState(false)
  const flipTimers = useRef([])

  const device = DEVICES[deviceIdx]
  const useCase = device.useCases[useCaseIdx % device.useCases.length]

  useEffect(() => {
    setUseCaseIdx(0)
  }, [deviceIdx])

  // Auto-rotate. Pause on hover anywhere over the chassis so a viewer
  // can take in a single device without the rotation kicking off.
  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      jumpTo((prev) => (prev + 1) % DEVICES.length)
    }, ROTATION_MS)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused])

  useEffect(() => () => flipTimers.current.forEach(clearTimeout), [])

  const jumpTo = (next) => {
    setDeviceIdx((prevIdx) => {
      const targetIdx =
        typeof next === 'function' ? next(prevIdx) : next
      if (targetIdx === prevIdx) return prevIdx
      // Flip choreography: out → swap → in
      setFlipPhase('out')
      const t1 = window.setTimeout(() => setFlipPhase('in'), FLIP_OUT_MS)
      const t2 = window.setTimeout(
        () => setFlipPhase('idle'),
        FLIP_OUT_MS + FLIP_IN_MS
      )
      flipTimers.current.push(t1, t2)
      return targetIdx
    })
  }

  // Panel scope: re-route theme tokens to permanent dark phosphor inside
  // the chassis (instruments-as-objects). Anything inside the chassis
  // that reads --trace, --ink, --edge, --canvas through CSS vars renders
  // against the panel palette regardless of html.dark.
  const panelStyle = {
    background: 'var(--panel-bg)',
    color: 'var(--panel-ink)',
    border: '1px solid var(--panel-edge)',
    boxShadow: 'var(--panel-chassis-shadow)',
    '--trace': 'var(--panel-trace)',
    '--trace-glow': 'var(--panel-trace-glow)',
    '--trace-dim': 'var(--panel-trace-dim)',
    '--trace-faint': 'var(--panel-trace-faint)',
    '--ink': 'var(--panel-ink)',
    '--ink-dim': 'var(--panel-ink-dim)',
    '--ink-muted': 'var(--panel-ink-muted)',
    '--ink-faint': 'var(--panel-ink-faint)',
    '--ink-subtle': 'var(--panel-ink-subtle)',
    '--edge': 'var(--panel-edge)',
    '--edge-dim': 'var(--panel-edge-dim)',
    '--edge-faint': 'var(--panel-edge-faint)',
    '--edge-subtle': 'var(--panel-edge-subtle)',
    '--canvas-alt': 'var(--panel-bg-alt)',
    '--canvas': 'var(--panel-bg)',
    '--surface': 'var(--panel-bg)',
  }

  return (
    <>
      {/* CINEMATIC HERO — disconnected from the chassis. The Rolodex
          flip card and "Talk to your {device}" sit central with
          generous breathing room, donor-v1 in shape, warm-amber in
          vocabulary. Per-device taglines underneath give a scannable
          narrative. The chassis below is the deeper machine — this
          section's job is to make the product instantly legible. */}
      <CinematicHero
        device={device}
        flipPhase={flipPhase}
        useCaseIdx={useCaseIdx}
        onSelectUseCase={setUseCaseIdx}
        onCycle={() => jumpTo((prevIdx) => (prevIdx + 1) % DEVICES.length)}
        onPause={setPaused}
      />

      <CompactChassis
        device={device}
        deviceIdx={deviceIdx}
        useCase={useCase}
        onJump={jumpTo}
        panelStyle={panelStyle}
        onPause={setPaused}
      />

    <div
      /* Chassis (ossi bay) — instrument metaphor for tablet+desktop.
       * Below xl, CompactChassis carries the story without the full
       * three-bay spec/scope/output machine. */
      className="relative hidden overflow-hidden rounded-md font-mono xl:block"
      style={panelStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Corner fasteners — mirrors Path B's chassis grammar. */}
      <CornerFasteners />

      {/* Chassis meta-strip */}
      <ChassisHeader device={device} deviceIdx={deviceIdx} onJump={jumpTo} />

      {/* Three inset bays. Grid is fluid: collapses to single column on
          narrow viewports, but the panoramic reading is the design
          target — it's how the instrument tells its story. */}
      <div className="relative grid grid-cols-1 gap-px bg-[var(--panel-edge-dim)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* SIGNAL PATH WIRES — rendered inside ScopeBay flanking the
            screen well so they self-align with ScopePort jacks
            regardless of bay height. See SignalWire below. */}

        {/* LEFT BAY · INPUT — keyboard-key transducer + install affordance */}
        <InputBay device={device} flipPhase={flipPhase} />

        {/* CENTER BAY · SCOPE — animated trace + decoded transcription */}
        <ScopeBay device={device} useCase={useCase} flipPhase={flipPhase} />

        {/* RIGHT BAY · OUTPUT — device screenshot + per-case artifact */}
        <OutputBay device={device} useCase={useCase} />
      </div>

      {/* Chassis status footer — channel meter, signal-path label */}
      <ChassisFooter device={device} />
    </div>
    </>
  )
}

// =============================================================================
// Cinematic hero — centered title-card section that sits above the chassis.

function CinematicHero({ device, flipPhase, useCaseIdx, onSelectUseCase, onCycle, onPause }) {
  return (
    <section className="relative pb-3 pt-1 text-center md:pb-8 md:pt-14">
      {/* Donor-shape headline: "Talk to your" inline with the Rolodex
          flip card, sized 1em relative to the H1 and baseline-nudged
          so the card sits visually grounded under the typography.
          Sizing matches donor v1 verbatim (clamp 2.8rem → 5.6rem,
          tracking -0.025em, leading 0.92). */}
      <h1
        className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1 font-display text-[clamp(1.6rem,7vw,2rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink md:gap-y-2 md:text-[clamp(2.8rem,9vw,5.6rem)] md:leading-[0.92] md:tracking-[-0.025em]"
        aria-label={`Talk to your ${device.label}`}
      >
        <span className="shrink-0">Talk to your</span>
        <RolodexFlipCard
          label={device.label}
          flipPhase={flipPhase}
          onClick={onCycle}
          onPause={onPause}
        />
      </h1>

      {/* Use-case roller — three rows visible (prev / current / next),
          same donor-shape three-column grid. The active row drives the
          entire chassis: ScopeBay's transcription and OutputBay's
          artifact both read from useCases[useCaseIdx]. User-driven —
          click a row to jump, no auto-rotate so the sub-hero stays
          calm and lets the device rotor be the only auto-motion axis. */}
      <HeroUseCaseRoller
        useCases={device.useCases}
        idx={useCaseIdx}
        onSelect={onSelectUseCase}
      />
    </section>
  )
}

function CompactChassis({ device, deviceIdx, useCase, onJump, panelStyle, onPause }) {
  const Install = device.install
  const InstallIcon = Install.Icon
  const DeviceIcon = device.Icon

  return (
    <section
      className="relative mt-8 hidden overflow-hidden rounded-md font-mono sm:block xl:hidden"
      style={panelStyle}
      onMouseEnter={() => onPause(true)}
      onMouseLeave={() => onPause(false)}
      onFocus={() => onPause(true)}
      onBlur={() => onPause(false)}
    >
      <CornerFasteners />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-[var(--panel-edge-dim)] px-3 py-2.5 text-[8px] uppercase tracking-[0.2em] text-[var(--panel-ink-faint)] sm:px-4 sm:py-3 sm:text-[9px] sm:tracking-[0.24em]">
        <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--panel-trace)]"
            style={{ boxShadow: '0 0 6px var(--panel-trace)' }}
          />
          <span
            className="truncate"
            style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}
          >
            TALKIE <span className="hidden md:inline">· {device.inputSpec.channel}</span>
          </span>
        </span>

        <CompactDeviceSelector deviceIdx={deviceIdx} onJump={onJump} />

        <span className="justify-self-end whitespace-nowrap opacity-80">
          16KHZ <span className="hidden md:inline">· MONO</span>
        </span>
      </div>

      <div className="grid gap-px bg-[var(--panel-edge-dim)] sm:grid-cols-2">
        <div className="bg-[var(--panel-bg)] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 text-[8px] uppercase tracking-[0.22em] text-[var(--panel-ink-faint)] md:text-[9px] md:tracking-[0.24em]">
            <span>· WAVE</span>
            <span>{device.label}</span>
          </div>
          <div
            className="mt-3 flex h-24 items-center justify-center overflow-hidden rounded-md border md:mt-4 md:h-32"
            style={{
              borderColor: 'var(--screen-edge-dim)',
              background: 'var(--screen-bg)',
              boxShadow: 'var(--screen-recess-shadow)',
            }}
          >
            <div
              className="relative flex h-full w-full items-center overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, color-mix(in oklab, var(--screen-trace) 12%, var(--screen-bg)), var(--screen-bg-deep))',
                boxShadow: 'inset 0 0 22px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.035)',
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-45"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 48%, transparent 50%), repeating-linear-gradient(0deg, transparent 0 7px, color-mix(in oklab, var(--screen-trace) 12%, transparent) 8px)',
                }}
              />
              <MiniWaveform bias={device.waveformBias} />
            </div>
          </div>
        </div>

        <div className="bg-[var(--panel-bg-alt)] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 text-[8px] uppercase tracking-[0.22em] text-[var(--panel-ink-faint)] md:text-[9px] md:tracking-[0.24em]">
            <span>· SCREEN</span>
            <span>{device.inputSpec.status}</span>
          </div>

          <div
            className="mt-3 flex h-24 items-center justify-center overflow-hidden rounded-md border p-2.5 md:mt-4 md:h-32 md:p-3"
            style={{
              borderColor: 'var(--panel-edge-dim)',
              background:
                'linear-gradient(180deg, color-mix(in oklab, var(--panel-trace) 7%, var(--panel-bg)), color-mix(in oklab, var(--panel-trace) 3%, var(--panel-bg)))',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.18)',
            }}
          >
            <img
              src={device.screenshot.src}
              alt={device.screenshot.alt}
              className="max-h-full max-w-[72%] rounded-sm object-contain opacity-88 shadow-[0_8px_18px_-16px_rgba(0,0,0,0.75)] md:max-w-[78%] md:shadow-[0_10px_24px_-20px_rgba(0,0,0,0.75)]"
              loading="lazy"
            />
          </div>
        </div>

        <div className="bg-[var(--panel-bg)] p-4 md:p-5">
          <div className="text-[8px] uppercase tracking-[0.22em] text-[var(--panel-ink-faint)] md:text-[9px] md:tracking-[0.24em]">
            · CAPTION
          </div>
          <h2 className="mt-2 font-display text-xl font-normal leading-tight tracking-[-0.01em] text-[var(--panel-ink)] md:mt-3 md:text-2xl">
            {useCase.action}
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--panel-ink-muted)] md:text-[13px]">
            {useCase.transcription}
          </p>
        </div>

        <div className="bg-[var(--panel-bg-alt)] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 text-[8px] uppercase tracking-[0.22em] text-[var(--panel-ink-faint)] md:text-[9px] md:tracking-[0.24em]">
            <span>· RESULT</span>
            <span>{device.screenshot.caption}</span>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <DeviceIcon
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: 'var(--screen-trace)', filter: 'drop-shadow(0 0 4px var(--screen-trace-glow))' }}
            />
            <div className="min-w-0">
              <p className="text-[12px] leading-relaxed text-[var(--screen-ink)] md:text-[13px]">
                {useCase.outcome}
              </p>
              <p className="mt-1 truncate text-[11px] text-[var(--screen-ink-muted)]">
                {useCase.artifact}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--panel-edge-dim)] bg-[var(--panel-bg)] p-3 md:p-4">
        <Link
          href={Install.href}
          className="flex w-full items-center justify-between gap-3 rounded-sm border px-3 py-2.5 text-[9px] uppercase tracking-[0.22em] transition-colors hover:text-[var(--panel-ink)]"
          style={{
            borderColor: 'var(--panel-edge-dim)',
            color: 'var(--panel-trace)',
            background: 'color-mix(in oklab, var(--panel-trace) 7%, transparent)',
            textShadow: '0 0 4px var(--panel-trace-glow)',
          }}
        >
          <span className="flex min-w-0 items-center gap-2">
            <InstallIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{Install.title}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-[8px] text-[var(--panel-ink-faint)]">
            {Install.meta}
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>
    </section>
  )
}

function CompactDeviceSelector({ deviceIdx, onJump }) {
  return (
    <div
      role="tablist"
      aria-label="Surface"
      className="inline-flex items-center justify-center gap-1 justify-self-center rounded-sm border border-[var(--panel-edge-dim)] px-1.5 py-1"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      {DEVICES.map((device, index) => {
        const active = index === deviceIdx
        const Icon = device.Icon
        return (
          <button
            key={device.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onJump(index)}
            className="flex min-w-0 items-center justify-center gap-1.5 rounded-sm px-1.5 py-1 text-[8px] uppercase tracking-[0.18em] transition-colors md:px-2 md:text-[9px] md:tracking-[0.22em]"
            style={{
              background: active
                ? 'color-mix(in oklab, var(--panel-trace) 12%, transparent)'
                : 'transparent',
              color: active ? 'var(--panel-trace)' : 'var(--panel-ink-faint)',
              textShadow: active ? '0 0 4px var(--panel-trace-glow)' : 'none',
            }}
          >
            <Icon className="h-3 w-3 shrink-0" />
            <span className="hidden min-w-0 truncate md:inline">{device.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function MiniWaveform({ bias }) {
  const points = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const x = (i / 27) * 100
      const amp =
        Math.sin(i * 0.72 + bias) * 9 +
        Math.sin(i * 1.58 + bias * 0.8) * 5 +
        (i > 8 && i < 21 ? Math.sin(i * 2.1) * 7 : 0)
      return `${x.toFixed(2)},${(50 - amp).toFixed(2)}`
    }).join(' ')
  }, [bias])

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-16 w-full overflow-visible md:h-20"
      aria-hidden
    >
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="var(--screen-trace-faint)"
        strokeWidth="1"
      />
      <polyline
        points={points}
        fill="none"
        stroke="var(--screen-trace)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: 'drop-shadow(0 0 6px var(--screen-trace-glow))' }}
      />
    </svg>
  )
}

function HeroUseCaseRoller({ useCases, idx, onSelect }) {
  const n = useCases.length
  if (n === 0) return null
  const at = (offset) => ((idx + offset) % n + n) % n
  const rows = [-1, 0, 1].map((offset) => ({ offset, i: at(offset) }))

  return (
    <div
      className="mx-auto mt-6 flex w-full max-w-[40rem] flex-col items-stretch px-4 md:mt-8"
      aria-live="polite"
    >
      {rows.map(({ offset, i }) => {
        const isActive = offset === 0
        const uc = useCases[i]
        return (
          <button
            key={`${idx}-${offset}-${i}`}
            type="button"
            onClick={() => !isActive && onSelect(i)}
            aria-current={isActive ? 'true' : undefined}
            className="grid grid-cols-[1fr_1rem_1fr] items-baseline rounded-sm px-2 py-0.5 text-[12px] leading-snug transition-opacity hover:opacity-90 md:grid-cols-[1fr_2.5rem_1fr] md:py-1 md:text-[15px] md:leading-relaxed"
            style={{
              opacity: isActive ? 1 : 0.32,
              cursor: isActive ? 'default' : 'pointer',
            }}
          >
            <span className="text-right text-ink-muted">{uc.action}</span>
            <span aria-hidden className="select-none text-center text-ink-faint">
              →
            </span>
            <span className="text-left text-ink">{uc.outcome}</span>
          </button>
        )
      })}
    </div>
  )
}

// Rolodex-style flip card — warm beige paper card sized at 1em so it
// sits inline INSIDE the H1, baseline-nudged with mb-[-0.18em] like the
// donor's keyboard-key. Sizing rules mirror donor v1 verbatim
// (min-w-[3.8em], rounded-[0.18em], px-[0.28em], py-[0.18em]); only
// the surface palette changed from chromey black to warm Rolodex paper.
function RolodexFlipCard({ label, flipPhase, onClick, onPause }) {
  return (
    <span className="shrink-0" style={{ perspective: '600px' }}>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => onPause(true)}
        onMouseLeave={() => onPause(false)}
        onFocus={() => onPause(true)}
        onBlur={() => onPause(false)}
        aria-label={`Cycle device — currently ${label}. Click to advance.`}
        className="relative -mb-[0.10em] inline-flex w-[5em] cursor-pointer select-none items-center justify-center overflow-hidden rounded-[0.18em] border px-[0.28em] pt-[0.05em] pb-[0.14em] font-display text-[1em] font-semibold leading-[1] tracking-[-0.01em]"
        style={{
          color: 'var(--rolodex-ink)',
          background: 'var(--rolodex-bg)',
          borderColor: 'var(--rolodex-edge)',
          boxShadow: 'var(--rolodex-shadow)',
          animation:
            flipPhase === 'out'
              ? 'flap-out 140ms ease-in forwards'
              : flipPhase === 'in'
              ? 'flap-in 200ms cubic-bezier(0.22,1.2,0.36,1) forwards'
              : undefined,
        }}
      >
        {/* Center horizontal flap line — the Rolodex hinge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--rolodex-hinge) 12%, var(--rolodex-hinge) 88%, transparent 100%)',
          }}
        />
        {/* Top sheen — paper highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{ background: 'linear-gradient(180deg, var(--rolodex-sheen), transparent)' }}
        />
        {/* Bottom drop shadow — card resting */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: 'linear-gradient(180deg, transparent, var(--rolodex-rest))' }}
        />
        <span data-hero-accent className="relative inline-block w-full text-center">{label}</span>
      </button>
    </span>
  )
}

// =============================================================================
// Sub-components
// =============================================================================

function CornerFasteners() {
  const dot = (
    pos
  ) => (
    <span
      key={pos}
      aria-hidden
      className={`pointer-events-none absolute ${pos} font-mono text-[8px] leading-none select-none z-30`}
      style={{ color: 'var(--panel-ink-muted)', opacity: 0.5 }}
    >
      ·
    </span>
  )
  return (
    <>
      {dot('left-1.5 top-1.5')}
      {dot('right-1.5 top-1.5')}
      {dot('left-1.5 bottom-1.5')}
      {dot('right-1.5 bottom-1.5')}
    </>
  )
}

function ChassisHeader({ device, deviceIdx, onJump }) {
  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[var(--panel-edge-dim)] px-4 py-2.5 text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
      <div className="flex min-w-0 items-center gap-2.5 justify-self-start whitespace-nowrap">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--panel-trace)] animate-pulse"
          style={{ boxShadow: '0 0 6px var(--panel-trace)' }}
        />
        <span
          className="hidden lg:inline"
          style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}
        >
          TALKIE / SIGNAL
        </span>
        <span aria-hidden className="hidden opacity-50 lg:inline">·</span>
        <span className="hidden lg:inline">CH-01 / VOICE.IN</span>
        <span
          className="lg:hidden"
          style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}
        >
          TALKIE · VOICE.IN
        </span>
      </div>

      {/* Device LED rotor — center column of a 3-col grid so it sits
          dead-center regardless of left/right column widths. With the
          previous justify-between flex, asymmetric side widths
          (TALKIE/SIGNAL/CH-01 wider than REV A.4/16KHZ) pushed the
          rotor slightly off-axis. The grid pins it. */}
      <div className="justify-self-center">
        <DeviceRotor deviceIdx={deviceIdx} onJump={onJump} />
      </div>

      <div className="flex items-center gap-2 opacity-80 justify-self-end whitespace-nowrap">
        <span className="hidden lg:inline">REV A.4</span>
        <span aria-hidden className="hidden opacity-50 lg:inline">·</span>
        <span>16KHZ · MONO</span>
      </div>
    </div>
  )
}

function DeviceRotor({ deviceIdx, onJump }) {
  return (
    <div
      role="tablist"
      aria-label="Surface"
      className="inline-flex items-center gap-1 rounded-sm border border-[var(--panel-edge-dim)] px-1.5 py-1"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      {DEVICES.map((d, i) => {
        const active = i === deviceIdx
        const Icon = d.Icon
        return (
          <button
            key={d.key}
            role="tab"
            aria-selected={active}
            onClick={() => onJump(i)}
            className="group inline-flex items-center gap-1.5 rounded-sm px-2 py-1 transition-colors"
            style={{
              background: active
                ? 'color-mix(in oklab, var(--panel-trace) 12%, transparent)'
                : 'transparent',
              color: active
                ? 'var(--panel-trace)'
                : 'var(--panel-ink-faint)',
              textShadow: active ? '0 0 4px var(--panel-trace-glow)' : 'none',
            }}
          >
            <Icon className="h-3 w-3" />
            <span className="text-[9px] uppercase tracking-[0.22em]">{d.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// -----------------------------------------------------------------------------
// LEFT BAY · keyboard-key transducer + install affordance
// -----------------------------------------------------------------------------

// Vertical device rail — left edge of the input bay. Same content as
// the (now-toggleable) top rotor: 4 device LEDs that drive the chassis
// rotation. Both pickers write to the same `deviceIdx` state in
// PanoramicHero, so they stay in sync if both are visible. Default
// composition uses only this rail; the top rotor is hidden unless
// explicitly toggled back on.
function DeviceRail({ deviceIdx, onJump }) {
  return (
    <div
      role="tablist"
      aria-label="Surface"
      aria-orientation="vertical"
      className="flex w-12 shrink-0 flex-col items-center justify-start gap-2 border-r py-5 sm:w-14 sm:py-6 lg:py-7"
      style={{ borderColor: 'var(--panel-edge-dim)' }}
    >
      {DEVICES.map((d, i) => {
        const isActive = i === deviceIdx
        const Icon = d.Icon
        return (
          <button
            key={d.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={d.label}
            onClick={() => onJump(i)}
            className="group relative flex h-9 w-9 items-center justify-center rounded-sm transition-colors"
            style={{
              background: isActive
                ? 'color-mix(in oklab, var(--panel-trace) 12%, transparent)'
                : 'transparent',
              border: isActive
                ? '1px solid var(--panel-edge-dim)'
                : '1px solid transparent',
            }}
          >
            <Icon
              className="h-4 w-4 transition-colors"
              style={{
                color: isActive ? 'var(--panel-trace)' : 'var(--panel-ink-faint)',
                filter: isActive ? 'drop-shadow(0 0 4px var(--panel-trace-glow))' : undefined,
              }}
            />
          </button>
        )
      })}
    </div>
  )
}

function InputBay({ device, flipPhase }) {
  const Install = device.install

  return (
    <div className="relative flex bg-[var(--panel-bg)]">
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6 lg:p-7">
        {/* DECK 1: Header — eyebrow + device label (light) + jack info */}
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
          <span>
            <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
              · INPUT
            </span>
            <span className="opacity-70"> · {device.label.toUpperCase()}</span>
          </span>
          <span className="opacity-70">JACK 01</span>
        </div>

        {/* DECK 2: SPEC divider — same Y as ScopeBay's SIGNAL and
            OutputBay's RUNNING ON line. No numbered badge: kept the
            chassis dividers visually identical across all three bays
            so the eye reads one continuous deck rhythm. */}
        <SectionDivider label="SPEC" />

        {/* DECK 3: Artifact — framed spec-sheet panel. Fixed 220px to
            match ScopeBay's screen well and OutputBay's screenshot
            well. Same frame grammar (rounded-md + border + recessed
            shadow + corner brackets) so the three artifacts read as
            siblings on a shared chassis rule. Inside: nutrition-label
            spec rows on top, divider, capability bullets at bottom.
            No flex-1 — the wrapper takes exactly 220px so the deck-4
            divider below sits at the same Y across all three bays. */}
        <div className="flex items-start">
          <div
            className="relative flex h-[220px] w-full flex-col overflow-hidden rounded-md border"
            style={{
              borderColor: 'var(--screen-edge-dim)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
            }}
          >
            <ScreenCornerBrackets />
            <div className="relative flex flex-1 flex-col gap-3 px-3.5 py-3">
              <SpecRows spec={device.inputSpec} />
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.28em] text-[var(--panel-ink-subtle)]">
                <span aria-hidden className="h-px flex-1" style={{ background: 'var(--panel-edge-dim)' }} />
                <span>· CAPS ·</span>
                <span aria-hidden className="h-px flex-1" style={{ background: 'var(--panel-edge-dim)' }} />
              </div>
              <FeatureList features={device.features} />
            </div>
          </div>
        </div>

        {/* DECK 4: INSTALL divider — aligns with ScopeBay's DECODED
            and OutputBay's SURFACE. */}
        <SectionDivider label="INSTALL" />

        {/* Below deck 4: install jack + small CLI fallback (Mac only).
            QR for iPhone was tried then dropped — the bottom row
            reads cleaner without a tall supplement. The wrapper is
            pinned at min-h-[26px] (the CLI link's height) so the
            chassis stays the same height across all four devices —
            iPhone/Watch/Agents have an empty 26px slot, Mac fills
            it with the CLI affordance. */}
        <DeviceInstallJack install={Install} />
        <div className="min-h-[26px]">
          {Install.kind === 'dmg' && <CliFallbackLink />}
        </div>
      </div>
    </div>
  )
}

// Sub-rail: labeled chassis divider that separates stacked sections
// inside a bay. Reads as a silkscreen separator with a numbered badge
// on the left, label in the middle, hairlines on either side. The
// badge anchors the section in the chassis hierarchy (01 / 02 / 03 / 04)
// so the structure is legible even when content swaps on channel change.
function SectionDivider({ label, num }) {
  // Fixed min-height so badged + unbadged variants occupy the same
  // vertical slot — critical for cross-bay deck alignment. The badge
  // pill is ~14px tall; the bare-label variant is ~10px. min-h-[1.25rem]
  // (20px) accommodates both, with items-center centering content.
  return (
    <div className="flex min-h-[1.25rem] items-center gap-2 text-[8px] uppercase tracking-[0.28em] text-[var(--panel-ink-subtle)]">
      {num && (
        <span
          className="inline-flex shrink-0 items-center rounded-sm border px-1 py-px text-[7px] tracking-[0.2em] text-[var(--panel-ink-faint)]"
          style={{ borderColor: 'var(--panel-edge-dim)' }}
        >
          {num}
        </span>
      )}
      <span aria-hidden className="h-px flex-1" style={{ background: 'var(--panel-edge-dim)' }} />
      <span>· {label} ·</span>
      <span aria-hidden className="h-px flex-1" style={{ background: 'var(--panel-edge-dim)' }} />
    </div>
  )
}

// SPEC sheet — nutrition-label-style key/value rows. STATUS row removed
// (read as goofy "armed/live" gimmick); platform / release / channel are
// the only fields that earn their place as printed device labels.
function SpecRows({ spec }) {
  const rows = [
    ['PLATFORM', spec.platform],
    ['RELEASE',  spec.release],
    ['CHANNEL',  spec.channel],
  ]
  return (
    <dl
      className="grid grid-cols-[5.5em_1fr] gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.18em]"
    >
      {rows.map(([key, value]) => (
        <Fragment key={key}>
          <dt className="text-[var(--panel-ink-subtle)]">{key}</dt>
          <dd>
            <span style={{ color: 'var(--panel-ink-dim)' }}>{value}</span>
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}

// FEATURES — three short bullets describing what this input source can do.
// Pure list, same fade as SPEC.
function FeatureList({ features }) {
  return (
    <ul
      className="flex flex-col gap-1.5 text-[11px] leading-snug text-[var(--panel-ink-dim)]"
    >
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2">
          <span
            aria-hidden
            className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full"
            style={{ background: 'var(--panel-trace)', boxShadow: '0 0 3px var(--panel-trace-glow)' }}
          />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  )
}

function MacCliRail() {
  const [pmIndex, setPmIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const current = PACKAGE_MANAGERS[pmIndex]

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.cmd)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — silent */
    }
  }

  return (
    <div className="-mt-2 flex flex-col gap-2">
      {/* Divider eyebrow — frames the rail as an alternative path */}
      <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.26em] text-[var(--panel-ink-subtle)]">
        <span className="h-px flex-1" style={{ background: 'var(--panel-edge-faint)' }} />
        <span>· OR VIA CLI ·</span>
        <span className="h-px flex-1" style={{ background: 'var(--panel-edge-faint)' }} />
      </div>

      {/* Centered tabs */}
      <div
        role="tablist"
        aria-label="Package manager"
        className="inline-flex self-center overflow-hidden rounded-sm text-[9px] uppercase tracking-[0.22em]"
        style={{ border: '1px solid var(--panel-edge-dim)' }}
      >
        {PACKAGE_MANAGERS.map((pm, i) => {
          const active = i === pmIndex
          return (
            <button
              key={pm.id}
              role="tab"
              aria-selected={active}
              onClick={() => setPmIndex(i)}
              className="px-2.5 py-1 transition-colors"
              style={{
                color: active ? 'var(--panel-trace)' : 'var(--panel-ink-faint)',
                borderLeft: i > 0 ? '1px solid var(--panel-edge-faint)' : undefined,
                background: active
                  ? 'color-mix(in oklab, var(--panel-trace) 10%, transparent)'
                  : 'transparent',
                textShadow: active ? '0 0 4px var(--panel-trace-glow)' : undefined,
              }}
            >
              {pm.label}
            </button>
          )
        })}
      </div>

      {/* Command + copy */}
      <div className="flex items-stretch gap-2">
        <code
          className="flex-1 truncate rounded-sm px-2.5 py-1.5 text-[11px]"
          style={{
            border: '1px solid var(--panel-edge-dim)',
            color: 'var(--panel-ink-dim)',
          }}
        >
          <span
            className="select-none mr-2"
            style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}
          >
            $
          </span>
          {current.cmd}
        </code>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? 'Copied' : 'Copy command'}
          className="inline-flex items-center justify-center rounded-sm px-2 py-1.5 text-[9px] uppercase tracking-[0.22em] transition-colors"
          style={{
            border: '1px solid var(--panel-edge-dim)',
            color: copied ? 'var(--panel-trace)' : 'var(--panel-ink-muted)',
            textShadow: copied ? '0 0 4px var(--panel-trace-glow)' : undefined,
          }}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
    </div>
  )
}

// Single-line install affordance: "phosphor icon + title + meta + ↗".
// Replaces the previous 3-line card with icon block. Reads as the
// same "phosphor indicator + content" stripe as the ScopeBay
// transcription (cursor + speech) and OutputBay artifact (LED + receipt)
// so the third row across all bays has consistent visual rhythm.
function DeviceInstallJack({ install }) {
  const Icon = install.Icon
  const isExternal = install.href.startsWith('http')
  // min-w-0 + overflow-hidden on the flex link so children with
  // truncate can actually shrink below their intrinsic content width.
  // Without this, flex items default to min-width: auto and force the
  // link (and its parent inner-col) to grow past the bay column,
  // overflowing into the adjacent ScopeBay (clipped silently by the
  // chassis overflow-hidden — but the install card was extending
  // ~170px past the Watch bay's right edge before this fix).
  // Solid button-look: panel-bg-alt fill (auto theme-flips: light gray on
  // Modern, warm-charcoal on Warm) + full panel-edge border + bright
  // panel-ink text. No phosphor wash — that 4% trace tint read as a
  // half-selected highlight, not a clickable button.
  const sharedClass =
    'group flex min-w-0 items-center gap-2.5 overflow-hidden rounded-sm border border-[var(--panel-edge)] px-2.5 py-1.5 transition-colors hover:border-[var(--panel-trace)]'
  const sharedStyle = {
    background: 'var(--panel-bg-alt)',
  }
  const inner = (
    <>
      <Icon
        className="h-3.5 w-3.5 shrink-0 text-[var(--panel-trace)]"
        style={{ filter: 'drop-shadow(0 0 3px var(--panel-trace-glow))' }}
      />
      <span className="min-w-0 flex-1 truncate text-[12px] text-[var(--panel-ink)]">
        {install.title}
      </span>
      <span className="shrink-0 truncate text-[10px] uppercase tracking-[0.18em] text-[var(--panel-ink-faint)]">
        {install.meta}
      </span>
      <span
        aria-hidden
        className="shrink-0 text-[12px] text-[var(--panel-ink-faint)] transition-colors group-hover:text-[var(--panel-trace)]"
      >
        {isExternal ? '↗' : '→'}
      </span>
    </>
  )
  return isExternal ? (
    <a
      href={install.href}
      target="_blank"
      rel="noopener noreferrer"
      className={sharedClass}
      style={sharedStyle}
    >
      {inner}
    </a>
  ) : (
    <Link href={install.href} className={sharedClass} style={sharedStyle}>
      {inner}
    </Link>
  )
}

// CLI fallback for Mac — points at the Downloads page where the npm /
// bun / pnpm install commands live alongside the .dmg. Sized smaller
// and dimmer than the primary install jack so it reads as a secondary
// affordance rather than competing with the .dmg CTA.
function CliFallbackLink() {
  return (
    <Link
      href="/downloads"
      className="group flex items-center gap-2 rounded-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--panel-ink-subtle)] transition-colors hover:text-[var(--panel-trace)]"
    >
      <Terminal
        className="h-3 w-3 shrink-0 text-[var(--panel-ink-faint)] transition-colors group-hover:text-[var(--panel-trace)]"
      />
      <span>Or, if you live in a terminal</span>
      <span aria-hidden className="ml-auto shrink-0">↗</span>
    </Link>
  )
}

// QR panel for iPhone — supplements the "Get on App Store" jack with
// a scannable code so a viewer with their phone in hand has a direct
// path off the desktop screen. White surface is required for scanner
// reliability; phosphor border ties it back to the chassis grammar.
function QrPanel() {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-[var(--panel-edge-dim)] p-2">
      <div className="shrink-0 rounded-sm bg-white p-1">
        <img
          src="/qr-app-store.svg"
          alt="App Store QR code"
          className="block h-16 w-16"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-subtle)]">
          · SCAN ·
        </span>
        <span className="text-[11px] leading-tight text-[var(--panel-ink-dim)]">
          Open with your camera to install on iOS.
        </span>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// CENTER BAY · animated waveform + use-case ribbon
// -----------------------------------------------------------------------------

function ScopeBay({ device, useCase, flipPhase }) {
  // Four-deck structure mirroring InputBay and OutputBay so the chassis
  // shares a horizontal grid:
  //   1. Header (eyebrow + device + processor info)
  //   2. Secondary divider (· SIGNAL ·)
  //   3. Artifact — screen well + waveform (flex-1, fills remaining)
  //   4. Detail divider (· DECODED ·) + use-case ribbon
  // Structural chrome stays solid through device changes; only the
  // waveform animates (flatline during flip-out → new bias on flip-in).
  return (
    <div
      className="relative flex h-full flex-col gap-4 bg-[var(--panel-bg-alt)] p-5 sm:p-6 lg:p-7"
      style={{
        backgroundImage:
          'linear-gradient(var(--panel-edge-faint) 1px, transparent 1px), linear-gradient(90deg, var(--panel-edge-faint) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* DECK 1: Header — eyebrow + device label (light) on the left,
          processor readout on the right. Same shape as InputBay's
          "· INPUT · MAC | JACK 01" so the row reads as one continuous
          chassis rule. */}
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
        <span>
          <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
            · SCOPE
          </span>
          <span className="opacity-70"> · {device.label.toUpperCase()}</span>
        </span>
        <span className="opacity-70">PROC · SAY → DO</span>
      </div>

      {/* DECK 2: Secondary line — light SIGNAL divider matching the
          height/Y of InputBay's "02 · SPEC ·" divider. */}
      <SectionDivider label="SIGNAL" />

      {/* DECK 3: Artifact — screen well + waveform. flex-1 absorbs
          remaining bay height; items-start top-aligns the screen well
          so it sits at the same Y as InputBay's spec rows and
          OutputBay's screenshot. The SignalWires below are rendered as
          siblings of the screen well (anchored to its vertical center
          via top:50% on the wrapper) so they self-align with the
          ScopePort jacks regardless of bay height. They extend out
          past the wrapper into adjacent bays — visible because no
          ancestor between here and the chassis is overflow-hidden.
          No flex-1 on the artifact wrapper — keeps deck-4 at the
          same Y as InputBay/OutputBay (see same comment elsewhere). */}
      <div className="relative flex items-start">
        <div className="relative w-full">
          <ScopePort side="left" />
          <ScopePort side="right" />
          <SignalWire side="left" delayMs={0} />
          <SignalWire side="right" delayMs={800} />
          <div
            className="relative h-[220px] overflow-hidden rounded-md border bg-[var(--screen-bg)] p-2.5 sm:p-3"
            style={{
              borderColor: 'var(--screen-edge-dim)',
              boxShadow: 'var(--screen-recess-shadow)',
            }}
          >
            {/* CRT scanline overlay — drifts via scan-drift keyframe so the
                instrument reads as live phosphor, not a still image. Sits
                behind the waveform in DOM order so the trace stays primary. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, var(--panel-scanline) 3px, var(--panel-scanline) 4px)',
                animation: 'scan-drift 0.8s linear infinite',
              }}
            />
            <ScopeWaveform bias={device.waveformBias} flipPhase={flipPhase} />
            <ScreenCornerBrackets />
          </div>
        </div>
      </div>

      {/* DECK 4: Detail divider — DECODED rail anchors the bottom
          region (use-case ribbon) as a distinct deck. Lines up with
          InputBay's "04 · INSTALL ·" and OutputBay's "· SURFACE ·". */}
      <SectionDivider label="DECODED" />

      {/* Below deck 4: the transcription — what the user literally
          said into the mic for the active use case. Driven by the
          shared useCaseIdx in PanoramicHero, so it stays in sync with
          the sub-hero summary roller and the OutputBay artifact. The
          three together read as a pipeline: intent → signal → result. */}
      <TranscriptionView text={useCase.transcription} />
    </div>
  )
}

function ScopeWaveform({ bias, flipPhase }) {
  // Live curve = device-specific waveform. Flat curve = no-signal jitter
  // shown DURING channel changes (the OUT phase of the flip choreography).
  // This is what real oscilloscopes do when you switch input sources —
  // the trace collapses to thermal-noise flatline before the new signal
  // pattern resolves. Replaces the previous opacity-fade approach which
  // read as "the panel is changing"; this reads as "the SIGNAL is
  // changing" — a more honest mental model.
  const liveCurve = useMemo(() => buildWaveformCurve(bias), [bias])
  const flatCurve = useMemo(() => buildFlatCurve(), [])

  const isFlatline = flipPhase === 'out'
  const curve = isFlatline ? flatCurve : liveCurve

  return (
    <div className="relative h-full" aria-hidden>
      <svg
        viewBox={`0 0 1200 220`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="absolute inset-0 block"
      >
        {/* Center divider */}
        <line x1={0} x2={1200} y1={110} y2={110} stroke="var(--screen-edge-faint)" strokeWidth={1} />

        {/* Vertical ticks */}
        {Array.from({ length: 8 }, (_, i) => {
          const x = ((i + 1) * 1200) / 9
          return (
            <line
              key={`v-${i}`}
              x1={x}
              x2={x}
              y1={94}
              y2={126}
              stroke="var(--screen-edge-faint)"
              strokeWidth={1}
            />
          )
        })}

        {/* Glow underlay — flatline phase uses a softer glow so the
            no-signal state reads as quieter than the live curve. */}
        <polyline
          points={curve}
          fill="none"
          stroke="var(--screen-trace)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'blur(6px)',
            opacity: isFlatline ? 0.18 : 0.45,
            transition: 'opacity 200ms ease-out',
          }}
        />
        {/* Crisp top stroke — always visible at full opacity since the
            curve itself swaps between flat and live (no fade-out
            needed). The trace stays "on" through the channel change,
            it just collapses to flatline mid-transition. */}
        <polyline
          points={curve}
          fill="none"
          stroke="var(--screen-trace)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 2px var(--screen-trace-glow))',
          }}
        />

        {/* Playhead — animated x position via class-keyed keyframe */}
        <line
          className="home-playhead-sweep"
          x1={0}
          x2={0}
          y1={20}
          y2={200}
          stroke="var(--screen-trace)"
          strokeWidth={1}
          opacity={0.55}
        />
      </svg>
    </div>
  )
}

function buildFlatCurve() {
  // Flat-line at midline (y=110) with subtle thermal-noise jitter.
  // Mimics what an oscilloscope shows with no signal on the input —
  // a near-flat trace with small high-frequency wobble from amplifier
  // noise. Two layered sine waves at different frequencies for organic
  // texture (deterministic across renders so React reconciles cleanly).
  const n = 360
  const pts = []
  for (let i = 0; i < n; i++) {
    const nx = i / (n - 1)
    const jitter =
      Math.sin(nx * 71 + 0.7) * 1.4 +
      Math.sin(nx * 197 + 2.1) * 0.6
    const y = 110 + jitter
    pts.push(`${(nx * 1200).toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

// ScopePort — small phosphor-glowing jack on the screen well's left
// and right edges. Aligns vertically with the SignalPathOverlay wires
// (both anchored at top:50% of the bay row) so the wire endpoints
// visually plug into the port's outer ring. Pure decoration —
// pointer-events disabled.
function ScopePort({ side }) {
  const isLeft = side === 'left'
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2"
      style={{
        [isLeft ? 'left' : 'right']: '-7px',
      }}
    >
      {/* Outer jack ring — sits in the screen-bg color so it reads as a
          recessed socket rather than a button. Inset shadow + outer
          phosphor halo gives it depth. */}
      <span
        className="block h-3.5 w-3.5 rounded-full"
        style={{
          background: 'var(--screen-bg)',
          border: '1px solid var(--screen-edge)',
          boxShadow:
            '0 0 6px var(--screen-trace-glow), inset 0 0 0 1px rgba(0,0,0,0.4)',
        }}
      />
      {/* Inner trace dot — phosphor-colored conducting bit at the port
          center. The wire endpoint dot from SignalPathOverlay (also
          phosphor) lands beside this, so they read as connected. */}
      <span
        className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 rounded-full"
        style={{
          background: 'var(--screen-trace)',
          boxShadow: '0 0 4px var(--screen-trace-glow)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </span>
  )
}

function ScreenCornerBrackets() {
  // Four small L-bracket marks, one per CRT corner. Sits inside the
  // overflow-hidden screen container and traces phosphor from
  // --screen-edge so brackets always match the active trace color.
  // Pure decoration — pointer-events disabled so they never intercept
  // anything that lands on the screen later (hover regions, etc).
  const common = 'pointer-events-none absolute h-3 w-3'
  const stroke = 'var(--screen-edge)'
  return (
    <>
      <span
        aria-hidden
        className={`${common} left-1.5 top-1.5`}
        style={{ borderLeft: `1px solid ${stroke}`, borderTop: `1px solid ${stroke}` }}
      />
      <span
        aria-hidden
        className={`${common} right-1.5 top-1.5`}
        style={{ borderRight: `1px solid ${stroke}`, borderTop: `1px solid ${stroke}` }}
      />
      <span
        aria-hidden
        className={`${common} bottom-1.5 left-1.5`}
        style={{ borderLeft: `1px solid ${stroke}`, borderBottom: `1px solid ${stroke}` }}
      />
      <span
        aria-hidden
        className={`${common} bottom-1.5 right-1.5`}
        style={{ borderRight: `1px solid ${stroke}`, borderBottom: `1px solid ${stroke}` }}
      />
    </>
  )
}

function buildWaveformCurve(bias) {
  // bias 0 = Mac (richer mid burst), 1 = iPhone (faster cadence + tail),
  // 2 = Watch (smaller, tap-shaped). Same envelope grammar as
  // HeroWaveform so it reads as the same family.
  const n = 360
  const pts = []
  for (let i = 0; i < n; i++) {
    const nx = i / (n - 1)
    const burstX = bias === 1 ? 0.22 : bias === 2 ? 0.5 : 0.32
    const burstW = bias === 1 ? 4.8 : bias === 2 ? 7.5 : 4.2
    const burstA = bias === 2 ? 0.6 : 0.95
    const tailX = bias === 1 ? 0.62 : bias === 2 ? 0.78 : 0.74
    const tailA = bias === 1 ? 0.7 : bias === 2 ? 0.25 : 0.55
    const burstEnv = Math.exp(-Math.pow((nx - burstX) * burstW, 2)) * burstA
    const tailEnv = Math.exp(-Math.pow((nx - tailX) * 5.5, 2)) * tailA
    const env = burstEnv + tailEnv
    const f1 = bias === 1 ? 44 : bias === 2 ? 28 : 38
    const carrier =
      Math.sin(nx * f1 + 1.1) * 0.5 +
      Math.sin(nx * 71 + 3.3) * 0.28 +
      Math.sin(nx * 137 + 7.1) * 0.14
    const y = 110 - carrier * env * 88
    pts.push(`${(nx * 1200).toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

// TranscriptionView — single voice-shaped line shown in the DECODED
// deck of the ScopeBay. The leading "▮" is a phosphor cursor evoking
// a live transcription. Italic + lowercase + comma-spliced text reads
// as natural dictation rather than a typed prompt. No animation on
// content swap (the user pushed back on excess motion); the cursor's
// gentle pulse is the only moving piece, sourced from Tailwind's
// `animate-pulse` and tinted with the panel trace color so it reads
// as an instrument indicator instead of a generic loading dot.
function TranscriptionView({ text }) {
  return (
    <div
      className="flex items-start gap-2 text-[12px] leading-relaxed"
      style={{ color: 'var(--panel-ink-muted)' }}
    >
      <span
        aria-hidden
        className="mt-[2px] inline-block animate-pulse"
        style={{
          color: 'var(--panel-trace)',
          textShadow: '0 0 4px var(--panel-trace-glow)',
          fontSize: '10px',
          lineHeight: 1,
        }}
      >
        ▮
      </span>
      <span className="italic">{text}</span>
    </div>
  )
}

// -----------------------------------------------------------------------------
// RIGHT BAY · device screenshot in inset display well
// -----------------------------------------------------------------------------

function OutputBay({ device, useCase }) {
  // Four-deck structure mirroring InputBay and ScopeBay:
  //   1. Header (· OUTPUT · device | JACK 02)
  //   2. Secondary line (RUNNING ON · device with live LED)
  //   3. Artifact — screenshot well (flex-1, fills remaining)
  //   4. Detail divider (· SURFACE ·) + caption
  return (
    <div className="relative flex flex-col gap-4 bg-[var(--panel-bg)] p-5 sm:p-6 lg:p-7">
      {/* DECK 1: Header — eyebrow + device label (light) + jack info */}
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
        <span>
          <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
            · OUTPUT
          </span>
          <span className="opacity-70"> · {device.label.toUpperCase()}</span>
        </span>
        <span className="opacity-70">JACK 02</span>
      </div>

      {/* DECK 2: Secondary line — live status with LED. Same min-height
          as SectionDivider so the deck-2 Y matches across all three
          bays (Input's SPEC divider, Scope's SIGNAL divider, this). */}
      <div className="flex min-h-[1.25rem] items-center gap-2 text-[8px] uppercase tracking-[0.28em] text-[var(--panel-ink-subtle)]">
        <span
          aria-hidden
          className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--panel-trace)]"
          style={{ boxShadow: '0 0 4px var(--panel-trace)' }}
        />
        <span>· RUNNING ON · {device.label.toUpperCase()} ·</span>
        <span aria-hidden className="h-px flex-1" style={{ background: 'var(--panel-edge-dim)' }} />
      </div>

      {/* DECK 3: Artifact — framed screenshot well. Fixed 220px to
          match InputBay's spec sheet and ScopeBay's screen well; same
          rounded-md + border + corner-bracket frame grammar so all
          three artifacts read as siblings on a shared chassis rule.
          Light bg + hairline recess (per the earlier "let shadow do
          the work" pass — keeps the screenshot the visual focus).
          No flex-1 — wrapper takes exactly 220px so the SURFACE
          divider below stays in line with InputBay's INSTALL and
          ScopeBay's DECODED dividers. */}
      <div className="flex items-start">
        <div
          className="relative flex h-[220px] w-full items-center justify-center overflow-hidden rounded-md border"
          style={{
            background: 'var(--panel-bg-alt)',
            borderColor: 'var(--screen-edge-dim)',
            boxShadow:
              'inset 0 1px 2px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.03)',
          }}
        >
          <ScreenCornerBrackets />
          <img
            src={device.screenshot.src}
            alt={device.screenshot.alt}
            loading="lazy"
            className="relative z-10 max-h-[200px] w-auto max-w-full rounded-[2px] object-contain"
            style={{
              filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.18))',
            }}
          />
        </div>
      </div>

      {/* DECK 4: Detail divider — SURFACE rail aligns with InputBay's
          INSTALL divider and ScopeBay's DECODED divider. */}
      <SectionDivider label="SURFACE" />

      {/* Below deck 4: the artifact — the receipt for what landed
          on this surface. Driven by the shared useCaseIdx so it
          matches the sub-hero summary and the ScopeBay transcription.
          Sentence case (vs the previous uppercase caption) so per-
          use-case detail can read naturally as a status line. */}
      <div className="flex items-start gap-2 text-[11px] leading-snug text-[var(--panel-ink-dim)]">
        <span
          aria-hidden
          className="mt-[5px] inline-block h-1 w-1 shrink-0 rounded-full"
          style={{
            background: 'var(--panel-trace)',
            boxShadow: '0 0 4px var(--panel-trace-glow)',
          }}
        />
        <span>{useCase.artifact}</span>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// SIGNAL PATH WIRES — phosphor segments flanking the scope screen well
// -----------------------------------------------------------------------------

// Each wire renders inside the screen-well wrapper (sibling of the
// ScopePort jacks). With side="left" it sits flush against the
// wrapper's left edge (right:100%) and extends 52px leftward into the
// InputBay column; with side="right" it sits flush against the
// wrapper's right edge (left:100%) and extends 52px rightward into the
// OutputBay column.
//
// Vertical anchor: top:50% of the wrapper. The wrapper is just a
// transparent container around ScopePorts + screen well, so its
// vertical center equals the screen well's center, which equals each
// ScopePort's center (the ports use top-1/2 too). The two endpoint
// dots therefore sit on the same Y as the port dots — they read as
// one continuous conductor regardless of screen-well height or where
// the artifact deck sits in the bay.
//
// Visibility: hidden below lg, since at narrower widths the bays
// stack vertically and there's nothing horizontal to bridge.
function SignalWire({ side, delayMs }) {
  const isLeft = side === 'left'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-20 hidden lg:block"
      style={{
        top: '50%',
        [isLeft ? 'right' : 'left']: '100%',
        transform: 'translateY(-50%)',
        width: '52px',
        height: '14px',
      }}
    >
      {/* Static rail */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'var(--panel-edge)',
          transform: 'translateY(-50%)',
        }}
      />
      {/* Junction dots — one at each end of the rail */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '5px',
          height: '5px',
          marginLeft: '-2.5px',
          marginTop: '-2.5px',
          borderRadius: '50%',
          background: 'var(--panel-trace)',
          boxShadow: '0 0 6px var(--panel-trace-glow)',
        }}
      />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          right: 0,
          width: '5px',
          height: '5px',
          marginRight: '-2.5px',
          marginTop: '-2.5px',
          borderRadius: '50%',
          background: 'var(--panel-trace)',
          boxShadow: '0 0 6px var(--panel-trace-glow)',
        }}
      />
      {/* Chase pulse — a small bright segment that walks left → right.
          Uses the home-wire-chase keyframe defined in the global stylesheet. */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          width: '14px',
          height: '2px',
          marginTop: '-1px',
          borderRadius: '2px',
          background:
            'linear-gradient(90deg, transparent 0%, var(--panel-trace) 50%, transparent 100%)',
          filter: 'drop-shadow(0 0 4px var(--panel-trace-glow))',
          animation: `home-wire-chase 2.4s linear infinite ${delayMs}ms`,
        }}
      />
    </div>
  )
}

// -----------------------------------------------------------------------------
// CHASSIS FOOTER · status meter
// -----------------------------------------------------------------------------

function ChassisFooter({ device }) {
  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-[var(--panel-edge-dim)] px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-[var(--panel-ink-subtle)]">
      <span className="flex items-center gap-2 justify-self-start">
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full"
          style={{ background: 'var(--panel-trace)', boxShadow: '0 0 4px var(--panel-trace)' }}
        />
        <span>TRIG · LIVE</span>
        <span aria-hidden className="opacity-50">·</span>
        <span>SIGNAL PATH · LOCAL ONLY</span>
      </span>
      {/* Stable, device-agnostic CTA — same link regardless of which
          device is on the rolodex. Lives in the chassis bezel so it
          reads as a property of the instrument rather than a property
          of any one bay. Styled as a subtle button (border + faint
          phosphor wash) rather than plain text so the click affordance
          is legible without competing with the per-device install
          jacks above. Centered via the 3-col grid. */}
      <Link
        href="/downloads"
        className="group inline-flex items-center gap-2 justify-self-center rounded-sm border border-[var(--panel-edge)] px-3 py-1.5 transition-colors hover:border-[var(--panel-trace)] hover:text-[var(--panel-trace)]"
        style={{
          background: 'var(--panel-bg-alt)',
          color: 'var(--panel-ink)',
        }}
      >
        <Download className="h-3 w-3 transition-colors group-hover:text-[var(--panel-trace)]" />
        <span>ALL DOWNLOADS</span>
        <span aria-hidden className="transition-colors group-hover:text-[var(--panel-trace)]">↗</span>
      </Link>
      <span className="opacity-80 justify-self-end">SURFACE · {device.label.toUpperCase()}</span>
    </div>
  )
}
