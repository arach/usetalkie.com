import Link from 'next/link'

/**
 * SurfaceChannels — four-channel hub grid for /v2/surfaces.
 *
 * Pure server component. Each card is a <Link> to its detail page; the
 * card itself is the affordance, not a buried "OPEN" pill. No JS state,
 * no theme hooks — paint flows entirely through CSS-var-backed Tailwind
 * tokens (bg-surface, text-ink*, border-edge*, var(--trace*) for glow).
 *
 * Layout: 2x2 on mobile, 1x4 on md+. Each card carries:
 *   - CH 0N tag + READY indicator
 *   - Big serif surface name (Mac, iPhone, Watch, CLI)
 *   - Sublabel (DESKTOP / MOBILE / WRIST / TERMINAL)
 *   - Frequency dial (tuner needle on a 5–55 kHz scale)
 *   - One-line tagline + arrow affordance
 *
 * The dial SVG uses `stroke="var(--trace)"` / `fill="var(--trace)"` so it
 * re-skins atomically on the html.dark flip — same instrument language as
 * the donor experiment, just driven by tokens instead of JS theme reads.
 */

const CHANNELS = [
  {
    id: 'mac',
    num: 'CH 01',
    name: 'Mac',
    sublabel: 'DESKTOP',
    freq: '32.1kHz',
    freqKHz: 32.1,
    href: '/v2/mac',
    tagline: 'Talk to your Mac. Menu-bar instrument, hotkey-driven.',
  },
  {
    id: 'iphone',
    num: 'CH 02',
    name: 'iPhone',
    sublabel: 'MOBILE',
    freq: '48.0kHz',
    freqKHz: 48.0,
    href: '/v2/mobile',
    tagline: 'Catch the thought before it fades. Lands on your Mac.',
  },
  {
    id: 'watch',
    num: 'CH 03',
    name: 'Watch',
    sublabel: 'WRIST',
    freq: '22.4kHz',
    freqKHz: 22.4,
    href: '/v2/mobile',
    tagline: 'Tap mid-stride. Searchable by tonight.',
  },
  {
    id: 'cli',
    num: 'CH 04',
    name: 'CLI',
    sublabel: 'TERMINAL',
    freq: '9.6kHz',
    freqKHz: 9.6,
    href: '/download',
    tagline: 'Pipe voice through any tool. Scriptable surface.',
  },
]

export default function SurfaceChannels() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
      {CHANNELS.map((ch) => (
        <ChannelCard key={ch.id} channel={ch} />
      ))}
    </div>
  )
}

function ChannelCard({ channel }) {
  return (
    <Link
      href={channel.href}
      aria-label={`Open ${channel.name} surface`}
      className="group relative flex flex-col overflow-hidden rounded-md border border-edge-dim bg-surface p-5 font-mono transition-all hover:-translate-y-0.5 hover:border-trace"
    >
      {/* Subtle in-card grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top row: CH number + READY indicator */}
      <div className="relative flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
          {channel.num}
        </span>
        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim"
          />
          READY
        </span>
      </div>

      {/* Surface name — big serif */}
      <div className="relative mt-5">
        <span className="font-display text-3xl font-normal leading-none tracking-[-0.02em] text-ink">
          {channel.name}
        </span>
        <div className="mt-1 text-[9px] uppercase tracking-[0.26em] text-ink-faint">
          {channel.sublabel}
        </div>
      </div>

      {/* Frequency dial */}
      <div className="relative mt-6">
        <FrequencyDial freqKHz={channel.freqKHz} />
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[8px] uppercase tracking-[0.18em] text-ink-faint">
            FREQ
          </span>
          <span className="text-[9px] tracking-[0.12em] text-ink-muted">
            {channel.freq}
          </span>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-5 h-px w-full bg-edge-subtle" />

      {/* Tagline + arrow */}
      <div className="relative mt-4 flex items-end justify-between gap-3">
        <p className="flex-1 text-[12px] leading-relaxed text-ink-muted">
          {channel.tagline}
        </p>
        <span
          aria-hidden
          className="shrink-0 text-trace transition-transform group-hover:translate-x-0.5"
          style={{ textShadow: '0 0 6px var(--trace-glow)' }}
        >
          →
        </span>
      </div>
    </Link>
  )
}

/* ─── Frequency tuner dial ─────────────────────────────────────────────────
 * Linear scale 5–55 kHz. Needle = inverted triangle + line.
 * All paint via `var(--trace)` / `var(--ink-faint)` so the dial re-skins
 * atomically with the chassis on theme flip.
 */

const DIAL_MIN_KHZ = 5
const DIAL_MAX_KHZ = 55
const DIAL_RANGE = DIAL_MAX_KHZ - DIAL_MIN_KHZ
const DIAL_TICKS = [10, 20, 30, 40, 50]

function freqToPercent(kHz) {
  return ((kHz - DIAL_MIN_KHZ) / DIAL_RANGE) * 100
}

function FrequencyDial({ freqKHz }) {
  const needlePct = freqToPercent(freqKHz)
  const needleX = (needlePct / 100) * 200

  return (
    <svg
      width="100%"
      height="28"
      viewBox="0 0 200 28"
      preserveAspectRatio="none"
      aria-hidden
      className="block overflow-visible"
    >
      {/* Base scale line */}
      <line
        x1="0"
        y1="16"
        x2="200"
        y2="16"
        stroke="var(--ink-faint)"
        strokeWidth="0.8"
        opacity="0.55"
      />

      {/* Reference ticks */}
      {DIAL_TICKS.map((kHz) => {
        const x = (freqToPercent(kHz) / 100) * 200
        const isChannelFreq = Math.abs(kHz - freqKHz) < 0.6
        return (
          <line
            key={kHz}
            x1={x}
            y1={isChannelFreq ? 9 : 11}
            x2={x}
            y2="16"
            stroke="var(--ink-faint)"
            strokeWidth={isChannelFreq ? 1.2 : 0.8}
            opacity={isChannelFreq ? 0.9 : 0.5}
          />
        )
      })}

      {/* Needle — triangle pointer + line, painted in trace */}
      <g style={{ filter: 'drop-shadow(0 0 2px var(--trace-glow))' }}>
        <polygon
          points={`${needleX - 3.5},4 ${needleX + 3.5},4 ${needleX},11`}
          fill="var(--trace)"
        />
        <line
          x1={needleX}
          y1="11"
          x2={needleX}
          y2="16"
          stroke="var(--trace)"
          strokeWidth="1.5"
        />
      </g>

      {/* Frequency labels */}
      {DIAL_TICKS.map((kHz) => {
        const x = (freqToPercent(kHz) / 100) * 200
        return (
          <text
            key={kHz}
            x={x}
            y="26"
            textAnchor="middle"
            fontSize="5.5"
            fontFamily="monospace"
            letterSpacing="0.04em"
            fill="var(--ink-faint)"
            opacity="0.7"
          >
            {kHz}
          </text>
        )
      })}
    </svg>
  )
}
