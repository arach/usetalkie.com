import { Smartphone, Watch, Command } from 'lucide-react'

/**
 * MobileCaptureModes — three mode cards (Phone / Watch / Widgets), each
 * with a small abstract scope display drawn in SVG.
 *
 * Server-rendered. Theme flows through CSS-variable-backed Tailwind tokens
 * (`bg-canvas-alt`, `border-edge-faint`, `text-trace`, ...). Inline `style`
 * is reserved for var refs (graticule images, glow shadows) and SVG paint
 * attrs that take CSS color refs (`stroke="var(--trace)"`).
 *
 * No client hooks, no DOM-watching — light/dark flips atomically with
 * `html.dark`.
 */

const MODES = [
  {
    key: 'iphone',
    Icon: Smartphone,
    title: 'Quick Capture',
    tag: 'MODE · IPHONE',
    body:
      'Open the app. One big mic button. Start talking. The capture syncs back to your Mac when you unlock it next.',
    Display: PhoneDisplay,
  },
  {
    key: 'watch',
    Icon: Watch,
    title: 'Wrist Tap',
    tag: 'MODE · WATCH',
    body:
      'Raise your wrist, tap to talk. No phone required. Captures sync via your iPhone.',
    Display: WatchDisplay,
  },
  {
    key: 'widgets',
    Icon: Command,
    title: 'Ambient Entry',
    tag: 'MODE · WIDGETS',
    body:
      'Add a capture widget to your lock screen. Or trigger from Siri, Shortcuts, or Control Center.',
    Display: WidgetDisplay,
  },
]

export default function MobileCaptureModes() {
  return (
    <section
      id="capture-modes"
      className="relative border-t border-edge-faint bg-canvas-alt"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        {/* Header */}
        <div className="max-w-3xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · CAPTURE MODES
          </p>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            Built to catch the thought,{' '}
            <span className="italic text-ink-muted">not become another inbox.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            The mobile app is there for the moment you do not have your desk,
            not to replace it.
          </p>
        </div>

        {/* Modes grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {MODES.map((mode) => (
            <ModeCard key={mode.key} mode={mode} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ModeCard({ mode }) {
  const { Icon, Display } = mode

  return (
    <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5">
      {/* inner graticule */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative flex h-full flex-col">
        {/* header strip */}
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          <span>{mode.tag}</span>
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-trace"
            style={{ boxShadow: '0 0 4px var(--trace)' }}
          />
        </div>

        {/* display */}
        <div
          className="mt-4 flex items-center justify-center rounded-sm border border-edge bg-surface p-5"
          style={{ minHeight: '160px' }}
        >
          <Display />
        </div>

        {/* title + icon */}
        <div className="mt-5 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
            style={{
              background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
            }}
          >
            <Icon
              className="h-4 w-4 text-trace"
              strokeWidth={1.5}
              style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
            />
          </div>
          <h3 className="font-display text-lg tracking-[-0.01em] text-ink">
            {mode.title}
          </h3>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
          {mode.body}
        </p>
      </div>
    </div>
  )
}

/* ─────────────── Displays ─────────────── */

function PhoneDisplay() {
  // Tall phone-shaped rectangle with a deterministic waveform inside.
  const w = 74
  const h = 130
  const innerPadX = 6
  const waveW = w - innerPadX * 2
  const waveH = 44
  const waveYTop = 50
  const n = 36
  const points = []
  for (let i = 0; i < n; i++) {
    const nx = i / (n - 1)
    const envelope = Math.exp(-Math.pow((nx - 0.5) * 2.2, 2))
    const y =
      waveYTop +
      waveH / 2 -
      (Math.sin(nx * 13 + 1) * 0.55 + Math.sin(nx * 29 + 2) * 0.3) *
        envelope *
        (waveH * 0.4)
    const x = innerPadX + nx * waveW
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  const pointsStr = points.join(' ')

  return (
    <svg width="86" height="140" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      {/* phone frame */}
      <rect
        x="1"
        y="1"
        width={w - 2}
        height={h - 2}
        rx="8"
        ry="8"
        fill="none"
        stroke="var(--edge)"
        strokeWidth="1"
      />
      {/* notch */}
      <rect
        x={w / 2 - 10}
        y="3"
        width="20"
        height="3"
        rx="1.5"
        fill="var(--trace-dim)"
      />
      {/* status bar */}
      <text
        x={innerPadX + 2}
        y="16"
        fontSize="5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.5"
        fill="var(--ink-subtle)"
      >
        09:41
      </text>
      {/* title */}
      <text
        x={w / 2}
        y="30"
        fontSize="5.5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1"
        fill="var(--ink-faint)"
        textAnchor="middle"
      >
        TALKIE
      </text>
      {/* baseline */}
      <line
        x1={innerPadX}
        x2={w - innerPadX}
        y1={waveYTop + waveH / 2}
        y2={waveYTop + waveH / 2}
        stroke="var(--trace)"
        strokeOpacity="0.12"
        strokeWidth="0.5"
      />
      {/* waveform glow */}
      <polyline
        fill="none"
        stroke="var(--trace)"
        strokeOpacity="0.3"
        strokeWidth="1.8"
        points={pointsStr}
        style={{ filter: 'drop-shadow(0 0 2px var(--trace))' }}
      />
      {/* waveform sharp */}
      <polyline
        fill="none"
        stroke="var(--trace)"
        strokeOpacity="0.95"
        strokeWidth="0.8"
        points={pointsStr}
      />
      {/* big mic button */}
      <circle
        cx={w / 2}
        cy={h - 22}
        r="12"
        fill="none"
        stroke="var(--edge)"
        strokeWidth="1"
      />
      <circle
        cx={w / 2}
        cy={h - 22}
        r="9"
        fill="var(--trace-faint)"
        stroke="var(--trace)"
        strokeOpacity="0.4"
        strokeWidth="0.5"
      />
      {/* mic glyph */}
      <rect
        x={w / 2 - 2}
        y={h - 27}
        width="4"
        height="7"
        rx="2"
        fill="var(--trace)"
        style={{ filter: 'drop-shadow(0 0 2px var(--trace))' }}
      />
      <path
        d={`M ${w / 2 - 4} ${h - 21} Q ${w / 2} ${h - 17}, ${w / 2 + 4} ${
          h - 21
        }`}
        fill="none"
        stroke="var(--trace)"
        strokeWidth="0.8"
      />
      {/* label */}
      <text
        x={w / 2}
        y={h - 6}
        fontSize="4"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.8"
        fill="var(--ink-subtle)"
        textAnchor="middle"
      >
        HOLD TO TALK
      </text>
    </svg>
  )
}

function WatchDisplay() {
  // Small rounded square with a circular trace drawn from a deterministic
  // wobble around a base radius.
  const size = 110
  const cx = size / 2
  const cy = size / 2
  const r = 34
  const n = 60
  const pathPts = []
  for (let i = 0; i < n; i++) {
    const nx = i / n
    const angle = nx * Math.PI * 2
    const wobble =
      Math.sin(nx * 8 * Math.PI + 1) * 0.15 +
      Math.sin(nx * 17 * Math.PI + 2) * 0.06
    const rr = r * (1 + wobble * 0.18)
    const x = cx + Math.cos(angle) * rr
    const y = cy + Math.sin(angle) * rr
    pathPts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  const ptsStr = pathPts.join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {/* watch case */}
      <rect
        x="4"
        y="4"
        width={size - 8}
        height={size - 8}
        rx="22"
        ry="22"
        fill="none"
        stroke="var(--edge)"
        strokeWidth="1"
      />
      {/* crown tick */}
      <rect
        x={size - 4}
        y={cy - 4}
        width="3"
        height="8"
        rx="1"
        fill="var(--edge-dim)"
      />
      {/* inner guide ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--trace)"
        strokeOpacity="0.14"
        strokeWidth="0.6"
      />
      {/* circular trace glow */}
      <polygon
        points={ptsStr}
        fill="none"
        stroke="var(--trace)"
        strokeOpacity="0.32"
        strokeWidth="2"
        style={{ filter: 'drop-shadow(0 0 3px var(--trace))' }}
      />
      {/* circular trace sharp */}
      <polygon
        points={ptsStr}
        fill="none"
        stroke="var(--trace)"
        strokeOpacity="0.9"
        strokeWidth="0.9"
      />
      {/* center mic dot */}
      <circle
        cx={cx}
        cy={cy}
        r="3"
        fill="var(--trace)"
        style={{ filter: 'drop-shadow(0 0 3px var(--trace))' }}
      />
      {/* label */}
      <text
        x={cx}
        y={size - 12}
        fontSize="5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1.2"
        fill="var(--ink-subtle)"
        textAnchor="middle"
      >
        TAP · TALK
      </text>
    </svg>
  )
}

function WidgetDisplay() {
  const w = 130
  const h = 88

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      {/* widget frame */}
      <rect
        x="1"
        y="1"
        width={w - 2}
        height={h - 2}
        rx="8"
        ry="8"
        fill="none"
        stroke="var(--edge)"
        strokeWidth="1"
      />
      {/* header label */}
      <text
        x="10"
        y="14"
        fontSize="5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1.5"
        fill="var(--ink-subtle)"
      >
        TALKIE · WIDGET
      </text>
      {/* signal dot */}
      <circle
        cx={w - 10}
        cy="11"
        r="1.6"
        fill="var(--trace)"
        style={{ filter: 'drop-shadow(0 0 2px var(--trace))' }}
      />
      {/* mic icon box */}
      <rect
        x="10"
        y="26"
        width="24"
        height="24"
        rx="4"
        fill="var(--trace-faint)"
        stroke="var(--trace)"
        strokeOpacity="0.35"
        strokeWidth="0.6"
      />
      {/* mic glyph */}
      <rect
        x="20"
        y="31"
        width="4"
        height="9"
        rx="2"
        fill="var(--trace)"
        style={{ filter: 'drop-shadow(0 0 2px var(--trace))' }}
      />
      <path
        d="M 18 41 Q 22 46, 26 41"
        fill="none"
        stroke="var(--trace)"
        strokeWidth="0.9"
      />
      <line
        x1="22"
        y1="46"
        x2="22"
        y2="49"
        stroke="var(--trace)"
        strokeWidth="0.9"
      />
      {/* tap to record label */}
      <text
        x="42"
        y="36"
        fontSize="6"
        fontFamily="ui-monospace, monospace"
        fill="var(--ink-dim)"
      >
        Tap to record
      </text>
      <text
        x="42"
        y="46"
        fontSize="4.5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.8"
        fill="var(--ink-subtle)"
      >
        LOCK · SIRI · SHORTCUTS
      </text>
      {/* baseline */}
      <line
        x1="10"
        y1="72"
        x2={w - 10}
        y2="72"
        stroke="var(--trace)"
        strokeOpacity="0.12"
        strokeWidth="0.5"
      />
      {/* mini trace */}
      <polyline
        fill="none"
        stroke="var(--trace)"
        strokeOpacity="0.8"
        strokeWidth="0.9"
        points="10,72 20,70 28,74 36,69 44,73 52,70 60,72 68,68 76,73 84,70 92,72 100,71 108,73 116,70 120,72"
        style={{ filter: 'drop-shadow(0 0 2px var(--trace))' }}
      />
    </svg>
  )
}
