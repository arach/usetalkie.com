import React from 'react'
import { Hand, CornerDownLeft, Clock, Eye, Send, Signal } from 'lucide-react'

/**
 * MacFeatures — 2x3 grid of channel-strip feature cards.
 *
 * Each card carries a mono icon, channel tag (CH-0N), short body, and
 * a deterministic SVG sparkline that individuates the cards. Pure
 * server component; theme paint comes from CSS-var-backed tokens.
 */
const FEATURES = [
  { icon: Hand,           title: 'Hold-to-Talk',     body: 'Press and hold. Talk. Release. No modes, no recording state to forget.',                shape: 0 },
  { icon: CornerDownLeft, title: 'Return to Origin', body: 'Cursor lands back where you left it. The typing flow resumes.',                          shape: 1 },
  { icon: Clock,          title: '48-Hour Echoes',   body: 'Every capture stays searchable for 48 hours by default. Never lose a fast thought.',     shape: 2 },
  { icon: Eye,            title: 'Minimal HUD',      body: 'A tiny waveform appears when you speak. No modal dialog, no interruption.',              shape: 3 },
  { icon: Send,           title: 'Smart Routing',    body: 'Talkie pastes into the app in front of you. No copy-and-paste step.',                    shape: 4 },
  { icon: Signal,         title: 'Always Ready',     body: 'Lives in the menu bar. One hotkey away from any app, any time.',                         shape: 5 },
]

export default function MacFeatures() {
  return (
    <section
      id="features"
      className="relative border-t border-edge-faint bg-canvas font-mono"
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
        <div className="max-w-3xl">
          <p
            className="text-[10px] uppercase tracking-[0.26em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · FEATURES
          </p>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            Six behaviors. <span className="italic text-ink-muted">One instrument.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Talkie behaves the same way everywhere — the same hold-to-talk, the same cursor return, the same fast search of what you said.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }) {
  const Icon = feature.icon
  const chNum = String(index + 1).padStart(2, '0')

  return (
    <div className="group relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-trace">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
              style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
            >
              <Icon
                className="h-4 w-4 text-trace"
                style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
              />
            </div>
            <h3 className="font-display text-lg tracking-[-0.01em] text-ink">{feature.title}</h3>
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            CH-{chNum}
          </span>
        </div>

        <div className="mt-4 h-px w-full bg-edge-subtle" />

        <p className="mt-4 flex-1 text-[13px] leading-relaxed text-ink-muted">{feature.body}</p>

        <div className="mt-5 w-full">
          <FeatureSparkline shape={feature.shape} />
        </div>
      </div>
    </div>
  )
}

/**
 * Six deterministic sparkline shapes — one per card. Pure SVG; the
 * `stroke="var(--trace)"` paint attr re-skins on theme flip.
 */
function FeatureSparkline({ shape, width = 240, height = 18 }) {
  const n = 64
  const points = []

  for (let i = 0; i < n; i++) {
    const nx = i / (n - 1)
    let y
    switch (shape) {
      case 0: // pulse (hold-to-talk)
        y = Math.exp(-Math.pow((nx - 0.5) * 3.5, 2)) * 0.9
        break
      case 1: // return arc
        y = Math.sin(nx * Math.PI) * 0.75 - Math.sin(nx * Math.PI * 4) * 0.08
        break
      case 2: // decay tail
        y = Math.exp(-nx * 3) * Math.sin(nx * 22) * 0.85
        break
      case 3: // calm waveform
        y = Math.sin(nx * 9) * 0.25 + Math.sin(nx * 22) * 0.1
        break
      case 4: // directional burst
        y = Math.sin(nx * 14) * 0.4 * (1 - Math.exp(-nx * 4))
        break
      case 5: // steady beacon
      default:
        y = Math.sin(nx * 18) * 0.5 + Math.sin(nx * 41) * 0.1
        break
    }
    const px = nx * width
    const py = height / 2 - y * (height * 0.42)
    points.push(`${px.toFixed(2)},${py.toFixed(2)}`)
  }

  const polyPoints = points.join(' ')
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      aria-hidden
      className="block"
    >
      <line
        x1="0"
        x2={width}
        y1={height / 2}
        y2={height / 2}
        stroke="var(--trace)"
        strokeOpacity={0.08}
        strokeWidth={1}
      />
      <polyline
        fill="none"
        stroke="var(--trace)"
        strokeOpacity={0.3}
        strokeWidth={2}
        points={polyPoints}
      />
      <polyline
        fill="none"
        stroke="var(--trace)"
        strokeOpacity={0.85}
        strokeWidth={1}
        points={polyPoints}
      />
    </svg>
  )
}
