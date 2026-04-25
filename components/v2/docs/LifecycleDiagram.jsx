/**
 * Lifecycle diagram (v2 oscilloscope).
 *
 * Server-rendered inline SVG. Re-authored from the donor LifecyclePage's
 * Phase/Step composition into a single ribbon: four phases connected by
 * trace-colored signal lines, with timing badges and hook-point pips.
 *
 * Because every paint attribute references v2 tokens, the same markup
 * theme-flips with html.dark. No JS, no client component.
 */

const W = 760
const H = 200

const PHASES = [
  { x: 30,  label: 'Capture',       timing: '~50ms',     hook: 'onCaptureStart' },
  { x: 220, label: 'Transcription', timing: '~300–800ms', hook: 'onTranscriptionComplete' },
  { x: 410, label: 'Routing',       timing: '~50ms',     hook: 'beforeRoute' },
  { x: 600, label: 'Storage',       timing: '~10ms',     hook: 'onDictationStored' },
]

const PHASE_W = 130
const PHASE_H = 64

export default function LifecycleDiagram() {
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-md border border-edge-faint bg-canvas-alt p-4 md:p-6">
      <div className="relative" style={{ minWidth: W, height: H + 16 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Dictation lifecycle phases — capture, transcription, routing, storage"
          role="img"
        >
          <defs>
            <pattern id="osc-life-grat" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--trace-faint)" strokeWidth="1" />
            </pattern>
            <marker id="osc-life-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <polygon points="0 0, 8 3, 0 6" fill="var(--trace)" />
            </marker>
          </defs>

          <rect x="0" y="0" width={W} height={H} fill="url(#osc-life-grat)" opacity="0.35" />

          {/* Signal baseline running through every phase center */}
          <line
            x1="20"
            x2={W - 20}
            y1="100"
            y2="100"
            stroke="var(--trace-dim)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Connectors between phases */}
          {PHASES.slice(0, -1).map((p, i) => {
            const nextX = PHASES[i + 1].x
            return (
              <path
                key={i}
                d={`M ${p.x + PHASE_W} 100 L ${nextX} 100`}
                stroke="var(--trace)"
                strokeWidth="1.6"
                fill="none"
                markerEnd="url(#osc-life-arrow)"
              />
            )
          })}

          {/* Phase boxes */}
          {PHASES.map((p, i) => (
            <g key={p.label}>
              {/* Phase container */}
              <rect
                x={p.x}
                y={100 - PHASE_H / 2}
                width={PHASE_W}
                height={PHASE_H}
                rx="6"
                fill="var(--canvas)"
                stroke="var(--edge)"
              />
              {/* Phase index pill */}
              <rect
                x={p.x + 10}
                y={100 - PHASE_H / 2 + 8}
                width="22"
                height="14"
                rx="2"
                fill="none"
                stroke="var(--trace)"
              />
              <text
                x={p.x + 21}
                y={100 - PHASE_H / 2 + 18}
                textAnchor="middle"
                fill="var(--trace)"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize="9"
                style={{ letterSpacing: '0.08em' }}
              >
                0{i + 1}
              </text>
              {/* Phase name */}
              <text
                x={p.x + 40}
                y={100 - PHASE_H / 2 + 20}
                fill="var(--ink)"
                fontFamily="var(--font-display), Georgia, serif"
                fontSize="14"
                fontWeight="500"
              >
                {p.label}
              </text>
              {/* Timing */}
              <text
                x={p.x + 10}
                y={100 - PHASE_H / 2 + 44}
                fill="var(--ink-faint)"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize="10"
                style={{ letterSpacing: '0.06em' }}
              >
                {p.timing}
              </text>
              {/* Hook pip below the phase */}
              <circle cx={p.x + PHASE_W / 2} cy={100 + PHASE_H / 2 + 22} r="3" fill="var(--trace)" />
              <text
                x={p.x + PHASE_W / 2}
                y={100 + PHASE_H / 2 + 42}
                textAnchor="middle"
                fill="var(--ink-muted)"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize="9"
                style={{ letterSpacing: '0.08em' }}
              >
                {p.hook}
              </text>
            </g>
          ))}

          {/* End-cap — signal terminates */}
          <circle cx={20} cy={100} r="3" fill="var(--trace)" />
        </svg>
        <div className="absolute bottom-1 left-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          SYS.LIFECYCLE.001
        </div>
      </div>
    </div>
  )
}
