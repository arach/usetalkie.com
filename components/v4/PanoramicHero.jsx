"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Download, QrCode, Watch, Smartphone, Laptop, ArrowRight, Play, Terminal, Check, Copy } from 'lucide-react'

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
  },
  {
    key: 'iphone',
    label: 'iPhone',
    Icon: Smartphone,
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
  },
  {
    key: 'watch',
    label: 'Watch',
    Icon: Watch,
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
      href: '/v2/mobile',
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

      {/* Device LED rotor — clicking a device LED jumps the whole
          composition. This is the single shared input control. */}
      <DeviceRotor deviceIdx={deviceIdx} onJump={onJump} />

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

function InputBay({ device, flipPhase, onJump, deviceIdx }) {
  const Icon = device.Icon
  const Install = device.install
  const InstallIcon = Install.Icon
  return (
    <div className="relative flex flex-col gap-5 bg-[var(--panel-bg)] p-5 sm:p-6 lg:p-7">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
        <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
          · INPUT · TRANSDUCER
        </span>
        <span className="opacity-70">JACK 01</span>
      </div>

      {/* Keyboard-key transducer. The kb-key sits like a physical keycap
          tied into the chassis. Clicking advances the rotation. */}
      <button
        type="button"
        onClick={() => onJump((deviceIdx + 1) % DEVICES.length)}
        aria-label={`Switch surface — currently ${device.label}`}
        className="group relative flex flex-col items-center"
        style={{ perspective: '600px' }}
      >
        <span
          className="relative inline-flex min-w-[5.5em] items-center justify-center overflow-hidden rounded-[0.18em] border border-[rgba(255,255,255,0.08)] bg-[#0f1417] px-[0.42em] py-[0.18em] font-display text-[clamp(2rem,4vw,2.8rem)] font-normal leading-[1] tracking-[-0.01em] text-[var(--panel-ink)]"
          style={{
            animation:
              flipPhase === 'out'
                ? 'flap-out 140ms ease-in forwards'
                : flipPhase === 'in'
                ? 'flap-in 220ms cubic-bezier(0.22,1.2,0.36,1) forwards'
                : undefined,
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.5), 0 8px 16px -8px rgba(0,0,0,0.7)',
          }}
        >
          <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/10" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.4))]" />
          <span className="relative inline-block w-full text-center">{device.label}</span>
        </span>

        {/* Sub-caption under the key — names the gesture */}
        <span className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.26em] text-[var(--panel-ink-faint)]">
          <Icon className="h-3 w-3 text-[var(--panel-trace)]" style={{ filter: 'drop-shadow(0 0 4px var(--panel-trace-glow))' }} />
          <span>Talk to your {device.label}</span>
        </span>
      </button>

      {/* Sub-jack: device-aware install affordance. Morphs with rotation. */}
      <DeviceInstallJack install={Install} flipPhase={flipPhase} />

      {/* CLI install rail — Mac only. The DMG is the headline path; this
          is the CLI alternative for developers who prefer global npm bins.
          Hidden during morph so the bay doesn't flicker between devices. */}
      {Install.kind === 'dmg' && <MacCliRail flipPhase={flipPhase} />}
    </div>
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
  return (
    <div
      className="relative bg-[var(--panel-bg-alt)] p-5 sm:p-6"
      style={{
        backgroundImage:
          'linear-gradient(var(--panel-edge-faint) 1px, transparent 1px), linear-gradient(90deg, var(--panel-edge-faint) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-[var(--panel-ink-faint)]">
        <span style={{ color: 'var(--panel-trace)', textShadow: '0 0 4px var(--panel-trace-glow)' }}>
          · SCOPE
        </span>
        <span className="opacity-70">PROC · SAY → DO</span>
      </div>

      {/* Headline lives INSIDE the scope bay, on the dark trace canvas —
          phosphor against the graticule. The kb-key on the left literally
          "writes" into this display. */}
      <h1 className="mt-3 font-display text-[clamp(1.9rem,3vw,2.6rem)] font-normal leading-[1.04] tracking-[-0.02em] text-[var(--panel-ink)]">
        Talk to your{' '}
        <span
          className="italic"
          style={{
            color: 'var(--panel-trace)',
            textShadow: '0 0 14px var(--panel-trace-glow), 0 0 4px var(--panel-trace-glow)',
            opacity: flipPhase === 'idle' ? 1 : 0.5,
            transition: 'opacity 220ms ease-out',
          }}
        >
          {device.label}
        </span>
        .
      </h1>

      {/* Animated trace — bias parameter shifts the carrier so each device
          has a distinct fingerprint that swaps in on rotation. */}
      <div className="mt-4 overflow-hidden rounded-sm border border-[var(--panel-edge-dim)] bg-[var(--panel-bg-deep)]">
        <ScopeWaveform bias={device.waveformBias} flipPhase={flipPhase} />
      </div>

      {/* Use-case caption ribbon — what this kb-key produces on this
          device, presented as the engine's "what I do" output. */}
      <div className="mt-4">
        <UseCaseRibbon useCases={device.useCases} flipPhase={flipPhase} />
      </div>
    </div>
  )
}

function ScopeWaveform({ bias, flipPhase }) {
  // Three deterministic curves — one per device. Pre-compute and swap
  // by index. The "playhead" sweep gives each curve a sense of being
  // an active capture even though there's no audio playing.
  const curve = useMemo(() => buildWaveformCurve(bias), [bias])

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
        <line x1={0} x2={1200} y1={110} y2={110} stroke="var(--panel-edge-faint)" strokeWidth={1} />

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
              stroke="var(--panel-edge-faint)"
              strokeWidth={1}
            />
          )
        })}

        {/* Glow underlay */}
        <polyline
          points={curve}
          fill="none"
          stroke="var(--panel-trace)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'blur(6px)', opacity: 0.45 }}
        />
        {/* Crisp top stroke */}
        <polyline
          points={curve}
          fill="none"
          stroke="var(--panel-trace)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 2px var(--panel-trace-glow))',
            opacity: flipPhase === 'idle' ? 1 : 0.4,
            transition: 'opacity 200ms ease-out',
          }}
        />

        {/* Playhead — animated x position via class-keyed keyframe */}
        <line
          className="v4-playhead-sweep"
          x1={0}
          x2={0}
          y1={20}
          y2={200}
          stroke="var(--panel-trace)"
          strokeWidth={1}
          opacity={0.55}
        />
      </svg>
    </div>
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
          className="grid grid-cols-[1fr_1.4rem_1fr] items-baseline gap-x-2"
        >
          <span className="text-right text-[var(--panel-ink-faint)]">{u.action}</span>
          <span aria-hidden className="text-center text-[var(--panel-trace)]" style={{ textShadow: '0 0 4px var(--panel-trace-glow)' }}>
            →
          </span>
          <span className="text-left text-[var(--panel-ink)]">{u.outcome}</span>
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
