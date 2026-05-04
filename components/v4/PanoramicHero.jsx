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
 * PanoramicHero — v4's synthesis composition.
 *
 * One chassis, three inset bays:
 *   LEFT   · INPUT  — keyboard-key transducer + device-aware install affordance
 *   CENTER · SCOPE  — animated waveform (idle, gets richer when device flips)
 *                     + use-case caption ribbon underneath
 *   RIGHT  · OUTPUT — device screenshot framed inside an inset display well
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

const DEVICES = [
  {
    key: 'mac',
    label: 'Mac',
    Icon: Laptop,
    taglines: [
      'Voice a rough draft. Watch it tighten.',
      'Speak any thought. Search it tomorrow.',
    ],
    useCases: [
      { action: 'Voice a rough draft', outcome: 'Cleanup rule runs' },
      { action: 'Record the meeting', outcome: 'Summary, every time' },
      { action: 'Describe the bug', outcome: 'GitHub issue filed' },
    ],
    install: {
      kind: 'dmg',
      eyebrow: 'INSTALL · MAC',
      title: 'Download .dmg',
      meta: 'universal · 12 mb',
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
      build:    'v0.4.2 · build 142',
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
    label: 'iPhone',
    Icon: Smartphone,
    taglines: [
      'Ramble for five minutes. Get a research brief.',
      'Snap and speak. Spec on your desk.',
    ],
    useCases: [
      { action: 'Ramble five minutes', outcome: 'Researches, pings back' },
      { action: 'Snap + voice an idea', outcome: 'Spec at your desk' },
      { action: 'Describe the problem', outcome: 'Mac investigates' },
    ],
    install: {
      kind: 'qr',
      eyebrow: 'INSTALL · iPHONE',
      title: 'Scan the code',
      meta: 'tap to expand →',
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
      platform: 'iOS 17+',
      build:    'v0.4.2 · build 142',
      status:   'ARMED',
    },
    features: [
      'Always-on capture',
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
      { action: 'Tap mid-thought', outcome: 'Searchable by tonight' },
      { action: 'Capture without stopping', outcome: 'Waiting on your Mac' },
      { action: 'The 3am idea', outcome: 'Still there at 9am' },
    ],
    install: {
      kind: 'handoff',
      eyebrow: 'INSTALL · WATCH',
      title: 'Auto-installs with iPhone',
      meta: 'pair via Watch app →',
      href: '/mobile',
      Icon: Watch,
    },
    screenshot: {
      // Reuse the iphone-light-1 portrait as a stand-in for watch glance until
      // a watch render lands; cropped square in the inset well.
      src: '/screenshots/iphone-light-1.png',
      alt: 'Talkie glance view (Watch surrogate)',
      caption: 'Glance on the wrist',
    },
    waveformBias: 2,
    inputSpec: {
      platform: 'watchOS 10+',
      build:    'v0.4.2 · build 142',
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
    label: 'agents',
    Icon: Bot,
    taglines: [
      'Voice the trigger. The agent picks it up.',
      'Wire a daily. Brief lands at 7am.',
    ],
    useCases: [
      { action: 'Voice the trigger', outcome: 'Workflow runs while you sleep' },
      { action: 'Wire a daily', outcome: 'Brief lands at 7am' },
      { action: 'Sketch a recipe', outcome: 'Agent runs it for you' },
    ],
    install: {
      kind: 'handoff',
      eyebrow: 'CONFIGURE · AGENTS',
      title: 'Wire up a workflow',
      meta: 'see what they do →',
      href: '/workflows',
      Icon: Bot,
    },
    screenshot: {
      src: '/screenshots/mac-home.png',
      alt: 'Workflow output landing in Talkie inbox',
      caption: 'Workflows in motion',
    },
    waveformBias: 3,
    inputSpec: {
      platform: 'Workflow runtime',
      build:    'v0.4.2',
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
  const [flipPhase, setFlipPhase] = useState('idle') // 'idle' | 'out' | 'in'
  const [paused, setPaused] = useState(false)
  const flipTimers = useRef([])

  const device = DEVICES[deviceIdx]

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
        onCycle={() => jumpTo((prevIdx) => (prevIdx + 1) % DEVICES.length)}
        onPause={setPaused}
      />

    <div
      className="relative overflow-hidden rounded-md font-mono"
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
      <div className="relative grid grid-cols-1 gap-px bg-[var(--panel-edge-faint)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* SIGNAL PATH WIRES — sit absolutely between the bays. Hidden
            on small viewports where the bays stack vertically. */}
        <SignalPathOverlay flipPhase={flipPhase} />

        {/* LEFT BAY · INPUT — keyboard-key transducer + install affordance */}
        <InputBay
          device={device}
          flipPhase={flipPhase}
          onJump={jumpTo}
          deviceIdx={deviceIdx}
        />

        {/* CENTER BAY · SCOPE — animated trace + use-case ribbon */}
        <ScopeBay device={device} flipPhase={flipPhase} />

        {/* RIGHT BAY · OUTPUT — device screenshot in inset well */}
        <OutputBay device={device} flipPhase={flipPhase} />
      </div>

      {/* Chassis status footer — channel meter, signal-path label */}
      <ChassisFooter device={device} />
    </div>
    </>
  )
}

// =============================================================================
// Cinematic hero — centered title-card section that sits above the chassis.

function CinematicHero({ device, flipPhase, onCycle, onPause }) {
  const feature = device.useCases[0]
  return (
    <section className="relative pb-14 pt-2 text-center md:pb-20 md:pt-6">
      {/* Brand placard — small amber eyebrow above the headline */}
      <p
        className="mb-10 inline-block font-mono text-[10px] uppercase tracking-[0.32em] md:mb-14"
        style={{
          color: 'var(--amber)',
          textShadow: '0 0 6px color-mix(in oklab, var(--amber) 50%, transparent)',
        }}
      >
        · TALKIE / SIGNAL · INSTRUMENT ·
      </p>

      {/* Donor-shape headline: "Talk to your" inline with the Rolodex
          flip card, sized 1em relative to the H1 and baseline-nudged
          so the card sits visually grounded under the typography.
          Sizing matches donor v1 verbatim (clamp 2.8rem → 5.6rem,
          tracking -0.025em, leading 0.92). */}
      <h1
        className="mx-auto flex max-w-5xl flex-wrap items-end justify-center gap-x-[0.28em] gap-y-2 font-display text-[clamp(2.8rem,9vw,5.6rem)] font-normal leading-[0.92] tracking-[-0.025em] text-ink"
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

      {/* Single action → outcome row, donor-shape three-column grid:
          right-aligned action / centered arrow / left-aligned outcome.
          Fades with the flip choreography so it swaps with the device. */}
      <div
        className="mx-auto mt-10 grid w-full max-w-[40rem] grid-cols-[1fr_2.5rem_1fr] items-center gap-y-3 px-4 text-[15px] leading-relaxed md:mt-14"
        style={{
          opacity: flipPhase === 'idle' ? 1 : 0.4,
          transition: 'opacity 220ms ease-out',
        }}
        aria-live="polite"
      >
        <span className="text-right text-ink-muted">{feature.action}</span>
        <span aria-hidden className="select-none text-center text-ink-faint">
          →
        </span>
        <span className="text-left text-ink">{feature.outcome}</span>
      </div>
    </section>
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
        className="relative mb-[-0.28em] inline-flex min-w-[3.8em] cursor-pointer select-none items-center justify-center overflow-hidden rounded-[0.18em] border pl-[0.28em] pr-[0.28em] pt-[0.26em] pb-[0.10em] font-display text-[1em] font-normal leading-[1] tracking-[-0.01em]"
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
        <span className="relative inline-block w-full text-center">{label}</span>
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
    <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-[var(--panel-edge-dim)] px-4 py-2.5 text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--panel-trace)] animate-pulse"
          style={{ boxShadow: '0 0 6px var(--panel-trace)' }}
        />
        <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
          TALKIE / SIGNAL
        </span>
        <span aria-hidden className="opacity-50">·</span>
        <span>CH-01 / VOICE.IN</span>
      </div>

      {/* Device LED rotor — duplicate of the vertical DeviceRail
          inside the input bay. Hidden by default in current
          composition; show it back via the chassis-rotor toggle.
          Visibility is CSS-controlled (display:none on the wrapper)
          so SSR + pre-paint script can decide before first frame
          and there's no FOUC. */}
      <span className="chassis-rotor-host">
        <DeviceRotor deviceIdx={deviceIdx} onJump={onJump} />
      </span>

      <div className="flex items-center gap-2 opacity-80">
        <span>REV A.4</span>
        <span aria-hidden className="opacity-50">·</span>
        <span>32.1KHZ · MONO</span>
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
      style={{ borderColor: 'var(--panel-edge-faint)' }}
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

function InputBay({ device, flipPhase, onJump, deviceIdx }) {
  const Install = device.install
  const isMorphing = flipPhase !== 'idle'
  const fadePanelStyle = {
    opacity: isMorphing ? 0.5 : 1,
    transition: 'opacity 220ms ease-out',
  }

  return (
    <div className="relative flex bg-[var(--panel-bg)]">
      <DeviceRail deviceIdx={deviceIdx} onJump={onJump} />
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6 lg:p-7">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
          <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
            · INPUT · {device.label.toUpperCase()}
          </span>
          <span className="opacity-70">JACK 01</span>
        </div>

        {/* SPEC — data-sheet rows describing the input source. Fades
            with the flip choreography so the channel changeover reads
            as a single gesture across the bay. */}
        <SectionDivider label="· SPEC ·" />
        <SpecRows spec={device.inputSpec} fadeStyle={fadePanelStyle} />

        {/* FEATURES — what this input source actually does. Three short
            bullets per device; same fade. */}
        <SectionDivider label="· FEATURES ·" />
        <FeatureList features={device.features} fadeStyle={fadePanelStyle} />

        {/* Install jack — device-aware install affordance. Morphs with rotation. */}
        <SectionDivider label="· INSTALL ·" />
        <DeviceInstallJack install={Install} flipPhase={flipPhase} />

        {/* CLI install rail — Mac only. The DMG is the headline path; this
            is the CLI alternative for developers who prefer global npm bins.
            On non-Mac devices we keep the same vertical space (visibility
            hidden) so the chassis row doesn't resize when the rotation
            lands on a device that doesn't expose a CLI install. */}
        <div
          aria-hidden={Install.kind !== 'dmg'}
          style={{ visibility: Install.kind === 'dmg' ? 'visible' : 'hidden' }}
        >
          <MacCliRail flipPhase={flipPhase} />
        </div>
      </div>
    </div>
  )
}

// Sub-rail: a thin labeled divider used to separate stacked sections
// inside the input bay. Reads as a chassis silkscreen separator —
// short ALL-CAPS label between two hairlines.
function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.26em] text-[var(--panel-ink-subtle)]">
      <span aria-hidden className="h-px flex-1" style={{ background: 'var(--panel-edge-faint)' }} />
      <span>{label}</span>
      <span aria-hidden className="h-px flex-1" style={{ background: 'var(--panel-edge-faint)' }} />
    </div>
  )
}

// SPEC table — definition list of platform/build/status. STATUS gets
// a small phosphor LED + trace-colored value to signal "armed/live".
function SpecRows({ spec, fadeStyle }) {
  const rows = [
    ['PLATFORM', spec.platform, false],
    ['BUILD',    spec.build,    false],
    ['STATUS',   spec.status,   true],
  ]
  return (
    <dl
      className="grid grid-cols-[5.5em_1fr] gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-[0.18em]"
      style={fadeStyle}
    >
      {rows.map(([key, value, isStatus]) => (
        <Fragment key={key}>
          <dt className="text-[var(--panel-ink-faint)]">{key}</dt>
          <dd className="text-[var(--panel-ink)]">
            {isStatus ? (
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="inline-block h-1 w-1 rounded-full"
                  style={{
                    background: 'var(--panel-trace)',
                    boxShadow: '0 0 4px var(--panel-trace-glow)',
                  }}
                />
                <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
                  {value}
                </span>
              </span>
            ) : (
              <span style={{ color: 'var(--panel-ink-dim)' }}>{value}</span>
            )}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}

// FEATURES — three short bullets describing what this input source can do.
// Pure list, same fade as SPEC.
function FeatureList({ features, fadeStyle }) {
  return (
    <ul
      className="flex flex-col gap-1.5 text-[11px] leading-snug text-[var(--panel-ink-dim)]"
      style={fadeStyle}
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

function MacCliRail({ flipPhase }) {
  const [pmIndex, setPmIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const current = PACKAGE_MANAGERS[pmIndex]
  const isMorphing = flipPhase !== 'idle'

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
    <div
      className="-mt-2 flex flex-col gap-2"
      style={{
        opacity: isMorphing ? 0.4 : 1,
        transition: 'opacity 200ms ease-out',
      }}
    >
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
            background: 'var(--panel-bg-deep)',
            border: '1px solid var(--panel-edge-faint)',
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

function DeviceInstallJack({ install, flipPhase }) {
  const Icon = install.Icon
  const isMorphing = flipPhase !== 'idle'
  const isExternal = install.href.startsWith('http')
  const Wrap = ({ children }) =>
    isExternal ? (
      <a
        href={install.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-sm border border-[var(--panel-edge-dim)] p-3 transition-all hover:border-[var(--panel-trace)]"
        style={{
          background: 'color-mix(in oklab, var(--panel-trace) 4%, transparent)',
        }}
      >
        {children}
      </a>
    ) : (
      <Link
        href={install.href}
        className="group block rounded-sm border border-[var(--panel-edge-dim)] p-3 transition-all hover:border-[var(--panel-trace)]"
        style={{
          background: 'color-mix(in oklab, var(--panel-trace) 4%, transparent)',
        }}
      >
        {children}
      </Link>
    )

  return (
    <div className="mt-1">
      <Wrap>
        <div
          className="flex items-center gap-3"
          style={{
            opacity: isMorphing ? 0.4 : 1,
            transform: isMorphing ? 'translateY(2px)' : 'none',
            transition: 'opacity 200ms ease-out, transform 200ms ease-out',
          }}
        >
          {install.kind === 'qr' ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[var(--panel-edge)] bg-white p-1">
              <img src="/qr-app-store.svg" alt="QR" className="h-full w-full" />
            </span>
          ) : (
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[var(--panel-edge)]"
              style={{
                background: 'color-mix(in oklab, var(--panel-trace) 6%, transparent)',
                boxShadow: '0 0 12px color-mix(in oklab, var(--panel-trace) 18%, transparent)',
              }}
            >
              <Icon
                className="h-4 w-4 text-[var(--panel-trace)]"
                style={{ filter: 'drop-shadow(0 0 4px var(--panel-trace-glow))' }}
              />
            </span>
          )}
          <span className="flex flex-col leading-tight">
            <span className="text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-subtle)]">
              {install.eyebrow}
            </span>
            <span className="mt-1 text-[13px] text-[var(--panel-ink)]">{install.title}</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--panel-ink-faint)]">
              {install.meta}
            </span>
          </span>
        </div>
      </Wrap>
    </div>
  )
}

// -----------------------------------------------------------------------------
// CENTER BAY · animated waveform + use-case ribbon
// -----------------------------------------------------------------------------

function ScopeBay({ device, flipPhase }) {
  // Regenerate-on-flip choreography. During flip-out, all sub-components
  // fade together (so the bay reads as "channel changing"). During
  // flip-in, they cascade with stagger delays so the bay re-scans on the
  // new device — channel readout first, then waveform, then ribbon.
  const isOut = flipPhase !== 'idle'
  const inDelay = (ms) => (flipPhase === 'in' ? `${ms}ms` : '0ms')
  const fadeStyle = (ms) => ({
    opacity: isOut ? 0 : 1,
    transform: isOut ? 'translateY(2px)' : 'translateY(0)',
    transition: 'opacity 220ms ease-out, transform 220ms ease-out',
    transitionDelay: inDelay(ms),
  })

  return (
    <div
      className="relative flex h-full min-h-[460px] flex-col bg-[var(--panel-bg-alt)] p-5 sm:p-6"
      style={{
        backgroundImage:
          'linear-gradient(var(--panel-edge-faint) 1px, transparent 1px), linear-gradient(90deg, var(--panel-edge-faint) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Header row — pinned to top */}
      <div
        className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]"
        style={fadeStyle(0)}
      >
        <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
          · SCOPE
        </span>
        <span className="opacity-70">PROC · SAY → DO</span>
      </div>

      {/* Scope readout — small device callsign above the waveform.
          The big "Talk to your {device}" H1 lives above the chassis
          now; this is just the phosphor-toned channel label so the
          signal still has a name. */}
      <p
        className="mt-3 inline-flex items-baseline gap-2 font-display text-[11px] uppercase tracking-[0.24em]"
        style={{
          color: 'var(--panel-ink-muted)',
          ...fadeStyle(60),
        }}
      >
        <span>CHANNEL</span>
        <span
          className="not-italic"
          style={{
            color: 'var(--panel-trace)',
            textShadow: '0 0 8px var(--panel-trace-glow)',
          }}
        >
          {device.label.toUpperCase()}
        </span>
      </p>

      {/* Animated trace — vertically centered in the bay so the
          waveform's carrier line lands on the same Y as the wire-port
          that enters from the input bay (both at bay midpoint).
          Pinned to --screen-* tokens (always-dark CRT bezel) so the
          phosphor display retains its instrument identity even when
          the surrounding chassis flips to a cream/notepad treatment.
          Corner brackets pick up --screen-edge so they tint with
          whatever phosphor the active treatment uses.

          The outer wrapper hosts the ScopePort jacks (left/right) so
          they sit OUTSIDE the screen well's overflow-hidden clip and
          land on the SignalPathOverlay wires entering/leaving the
          bay at top:50%. Both the wires and the screen well's vertical
          midpoint are anchored to the same row-50% line, so the ports
          plug into the wire endpoints visually. */}
      <div className="relative my-auto" style={fadeStyle(140)}>
        <ScopePort side="left" />
        <ScopePort side="right" />
        <div
          className="relative overflow-hidden rounded-md border bg-[var(--screen-bg)]"
          style={{
            borderColor: 'var(--screen-edge-dim)',
            boxShadow: 'var(--screen-recess-shadow)',
          }}
        >
          <ScopeWaveform bias={device.waveformBias} flipPhase={flipPhase} />
          <ScreenCornerBrackets />
        </div>
      </div>

      {/* Use-case caption ribbon — pinned to the bottom of the bay so
          the waveform sits between header and ribbon at vertical center. */}
      <div style={fadeStyle(220)}>
        <UseCaseRibbon useCases={device.useCases} flipPhase={flipPhase} />
      </div>
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
    <div className="relative h-[180px] sm:h-[210px]" aria-hidden>
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
          className="v4-playhead-sweep"
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

function UseCaseRibbon({ useCases, flipPhase }) {
  return (
    <div
      className="grid grid-cols-1 gap-y-1.5 text-[12px] sm:gap-y-2"
      style={{
        opacity: flipPhase === 'idle' ? 1 : 0.5,
        transform: flipPhase === 'idle' ? 'translateY(0)' : 'translateY(2px)',
        transition: 'opacity 220ms ease-out, transform 220ms ease-out',
      }}
      aria-live="polite"
    >
      {useCases.map((u) => (
        <div
          key={u.action}
          className="grid h-[1.6em] grid-cols-[1fr_1.4rem_1fr] items-baseline gap-x-2"
        >
          <span className="truncate text-right text-[var(--panel-ink-faint)]">{u.action}</span>
          <span aria-hidden className="text-center text-[var(--panel-trace)]" style={{ textShadow: '0 0 4px var(--panel-trace-glow)' }}>
            →
          </span>
          <span className="truncate text-left text-[var(--panel-ink)]">{u.outcome}</span>
        </div>
      ))}
    </div>
  )
}

// -----------------------------------------------------------------------------
// RIGHT BAY · device screenshot in inset display well
// -----------------------------------------------------------------------------

function OutputBay({ device, flipPhase }) {
  return (
    <div className="relative flex flex-col bg-[var(--panel-bg)] p-5 sm:p-6">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
        <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
          · OUTPUT · SURFACE
        </span>
        <span className="opacity-70">JACK 02</span>
      </div>

      <div className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.26em] text-[var(--panel-ink-faint)]">
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full bg-[var(--panel-trace)]"
          style={{ boxShadow: '0 0 4px var(--panel-trace)' }}
        />
        <span>RUNNING ON · {device.label.toUpperCase()}</span>
      </div>

      {/* Inset display well — the screenshot lives behind a recessed
          frame with phosphor edge. The well itself looks like a sub-
          screen on the chassis. */}
      <div
        className="relative mt-3 flex flex-1 items-center justify-center overflow-hidden rounded-sm border border-[var(--panel-edge-dim)] bg-[var(--panel-bg-deep)] p-3"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(0,0,0,0.4), inset 0 8px 24px rgba(0,0,0,0.45)',
          minHeight: '220px',
        }}
      >
        {/* Phosphor scanline overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(180deg, transparent 0%, transparent 49%, var(--panel-scanline) 50%, transparent 51%)',
            backgroundSize: '100% 4px',
          }}
        />
        <img
          src={device.screenshot.src}
          alt={device.screenshot.alt}
          loading="lazy"
          className="relative z-10 max-h-[220px] w-auto max-w-full rounded-[2px] object-contain"
          style={{
            opacity: flipPhase === 'idle' ? 1 : 0.45,
            transform: flipPhase === 'idle' ? 'scale(1)' : 'scale(0.98)',
            transition: 'opacity 220ms ease-out, transform 220ms ease-out',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))',
          }}
        />
      </div>

      <div className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[var(--panel-ink-faint)]">
        <span>{device.screenshot.caption}</span>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// SIGNAL PATH WIRES — small SVG overlays between the bays
// -----------------------------------------------------------------------------

function SignalPathOverlay({ flipPhase }) {
  // Two horizontal "wires" sitting on the column dividers between the
  // bays. Each wire is a thin phosphor segment with two junction dots,
  // anchored at ~50% vertical so it visually crosses both adjacent
  // bays. The chase animation (osc-chase) moves a tiny bright segment
  // along each wire, selling "voltage moving" between the input
  // transducer → scope → output surface.
  //
  // Anchoring strategy: each wire spans 56px horizontally, centered
  // exactly on the column gap (the 1px panel-edge-faint divider in the
  // grid). The grid columns are minmax(0, 0.95fr) | 1.4fr | 1fr so the
  // dividers fall at predictable percentages. Using percent-based left
  // positions keeps the wires aligned regardless of viewport width.
  const wireBase = {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '52px',
    height: '14px',
    pointerEvents: 'none',
  }
  // Column gap positions: input ends at ~28.4%, scope ends at ~70.6%
  // (with the 0.95 / 1.4 / 1 ratios; 0.95/(0.95+1.4+1) = 28.4%,
  // (0.95+1.4)/(...) = 70.1%). The 0.5 offset bias ports the line
  // exactly onto the divider seam.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
      style={{
        opacity: flipPhase === 'idle' ? 1 : 0.35,
        transition: 'opacity 220ms ease-out',
      }}
    >
      <SignalWire leftPercent={28.4} delayMs={0} />
      <SignalWire leftPercent={70.1} delayMs={800} />
    </div>
  )
}

function SignalWire({ leftPercent, delayMs }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: `${leftPercent}%`,
        transform: 'translate(-50%, -50%)',
        width: '52px',
        height: '14px',
        pointerEvents: 'none',
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
      {/* Junction dots */}
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
          Uses a CSS keyframe defined inline-style via an animation
          on a transform-positioned absolute span. */}
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
          animation: `v4-wire-chase 2.4s linear infinite ${delayMs}ms`,
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
    <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-[var(--panel-edge-faint)] px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-[var(--panel-ink-subtle)]">
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full"
          style={{ background: 'var(--panel-trace)', boxShadow: '0 0 4px var(--panel-trace)' }}
        />
        <span>TRIG · LIVE</span>
        <span aria-hidden className="opacity-50">·</span>
        <span>SIGNAL PATH · LOCAL ONLY</span>
      </span>
      <span className="opacity-80">SURFACE · {device.label.toUpperCase()}</span>
    </div>
  )
}
