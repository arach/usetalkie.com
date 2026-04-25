/**
 * Architecture diagram (v2 oscilloscope).
 *
 * Server-rendered inline SVG. Re-authored from the donor ArcDiagram + the
 * architecture.diagram.ts dataset so it paints with v2 tokens directly:
 * stroke and fill use `var(--trace)`, `var(--ink-*)`, and `var(--edge*)`
 * — meaning the same markup paints both modes when html.dark flips.
 *
 * Layout is three columns:
 *   col-1: Talkie -> TalkieAgent -> TalkieEngine     (signal stack)
 *   col-2: TalkieServer (top)   + iCloud (bottom)    (bridge + sync hub)
 *   col-3: iPhone -> Watch                            (mobile capture)
 *
 * Connections are typed (XPC, audio, HTTP, Tailscale, CloudKit, peer)
 * with stroke widths and dashes communicating channel kind.
 */

const W = 720
const H = 360

const NODE_W = { l: 200, m: 145, s: 95 }
const NODE_H = { l: 80, m: 64, s: 42 }

const NODES = {
  talkie:       { x: 24,  y: 16,  size: 'l' },
  talkieAgent:  { x: 51,  y: 124, size: 'm' },
  talkieEngine: { x: 51,  y: 218, size: 'm' },
  talkieServer: { x: 285, y: 16,  size: 'm' },
  iCloud:       { x: 285, y: 218, size: 'm' },
  iPhone:       { x: 522, y: 16,  size: 'm' },
  watch:        { x: 547, y: 124, size: 's' },
}

const NODE_DATA = {
  talkie:       { name: 'Talkie',       sub: 'Swift / SwiftUI', desc: 'UI · Workflows · Data · Orchestration' },
  talkieAgent:  { name: 'TalkieAgent',  sub: 'Swift',           desc: 'Ears & Hands' },
  talkieEngine: { name: 'TalkieEngine', sub: 'Swift',           desc: 'Local Brain' },
  talkieServer: { name: 'TalkieServer', sub: 'TypeScript',      desc: 'iPhone Bridge' },
  iCloud:       { name: 'iCloud',       sub: 'CloudKit',        desc: 'Memo Sync' },
  iPhone:       { name: 'iPhone',       sub: 'iOS',             desc: 'Voice Capture' },
  watch:        { name: 'Watch',        sub: 'watchOS' },
}

// Anchor a point on a node edge (with a small gap so strokes never touch the box).
function anchor(id, side) {
  const n = NODES[id]
  const w = NODE_W[n.size]
  const h = NODE_H[n.size]
  const gap = 6
  switch (side) {
    case 'left':   return { x: n.x - gap,     y: n.y + h / 2 }
    case 'right':  return { x: n.x + w + gap, y: n.y + h / 2 }
    case 'top':    return { x: n.x + w / 2,   y: n.y - gap }
    case 'bottom': return { x: n.x + w / 2,   y: n.y + h + gap }
    default:       return { x: n.x + w / 2,   y: n.y + h / 2 }
  }
}

// Each connector has a kind that maps to stroke style + label.
const CONNECTORS = [
  { from: 'talkie',       to: 'talkieAgent',  fromSide: 'bottom', toSide: 'top',    kind: 'xpc'    },
  { from: 'talkieAgent',  to: 'talkieEngine', fromSide: 'bottom', toSide: 'top',    kind: 'audio'  },
  { from: 'talkie',       to: 'talkieServer', fromSide: 'right',  toSide: 'left',   kind: 'http'   },
  { from: 'talkieServer', to: 'iPhone',       fromSide: 'right',  toSide: 'left',   kind: 'tail'   },
  { from: 'iPhone',       to: 'watch',        fromSide: 'bottom', toSide: 'top',    kind: 'peer'   },
  { from: 'talkie',       to: 'iCloud',       fromSide: 'bottom', toSide: 'left',   kind: 'cloud', curve: true },
  { from: 'iPhone',       to: 'iCloud',       fromSide: 'bottom', toSide: 'right',  kind: 'cloud', curve: true },
]

// Stroke kinds — all paints reference v2 tokens.
const KIND = {
  xpc:   { stroke: 'var(--trace)',     width: 1.6, dash: null,    label: 'XPC' },
  audio: { stroke: 'var(--trace)',     width: 2.4, dash: null,    label: 'audio' },
  http:  { stroke: 'var(--trace)',     width: 1.6, dash: null,    label: 'HTTP' },
  tail:  { stroke: 'var(--ink-faint)', width: 1.6, dash: null,    label: 'Tailscale' },
  peer:  { stroke: 'var(--edge)',      width: 1.2, dash: '4 3',   label: null },
  cloud: { stroke: 'var(--ink-faint)', width: 1.4, dash: '5 3',   label: 'CloudKit' },
}

function curvedPath(a, b) {
  // Soft S-curve for diagonal CloudKit links.
  const cpx = 60
  const cpy = 36
  return `M ${a.x} ${a.y} C ${a.x + cpx} ${a.y + cpy}, ${b.x - cpx} ${b.y - cpy}, ${b.x} ${b.y}`
}

function straightPath(a, b) {
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
}

export default function ArchitectureDiagram() {
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-md border border-edge-faint bg-canvas-alt p-4 md:p-6">
      <div className="relative" style={{ minWidth: W, height: H + 24 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Talkie multi-process architecture diagram"
          role="img"
        >
          {/* Faint graticule grid — same vibe as the rest of the v2 surface. */}
          <defs>
            <pattern id="osc-graticule" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--trace-faint)" strokeWidth="1" />
            </pattern>
            <marker id="osc-arrow-trace" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <polygon points="0 0, 8 3, 0 6" fill="var(--trace)" />
            </marker>
            <marker id="osc-arrow-ink" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <polygon points="0 0, 8 3, 0 6" fill="var(--ink-faint)" />
            </marker>
          </defs>

          <rect x="0" y="0" width={W} height={H} fill="url(#osc-graticule)" opacity="0.35" />

          {/* Connectors first so node boxes paint over the line ends cleanly. */}
          {CONNECTORS.map((c, i) => {
            const a = anchor(c.from, c.fromSide)
            const b = anchor(c.to, c.toSide)
            const k = KIND[c.kind]
            const d = c.curve ? curvedPath(a, b) : straightPath(a, b)
            const markerKind = k.stroke === 'var(--trace)' ? 'osc-arrow-trace' : 'osc-arrow-ink'
            const labelX = (a.x + b.x) / 2
            const labelY = (a.y + b.y) / 2
            const isVertical = Math.abs(b.y - a.y) > Math.abs(b.x - a.x)
            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke={k.stroke}
                  strokeWidth={k.width}
                  strokeDasharray={k.dash || undefined}
                  markerEnd={c.kind === 'peer' ? undefined : `url(#${markerKind})`}
                />
                {k.label && (
                  <text
                    x={isVertical ? labelX + 8 : labelX}
                    y={isVertical ? labelY + 3 : labelY - 6}
                    textAnchor={isVertical ? 'start' : 'middle'}
                    fill={k.stroke}
                    fontFamily="var(--font-mono), ui-monospace, monospace"
                    fontSize="9.5"
                    style={{ letterSpacing: '0.08em' }}
                  >
                    {k.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Node boxes — drawn entirely in SVG so the diagram is one paint unit. */}
          {Object.entries(NODES).map(([id, n]) => {
            const w = NODE_W[n.size]
            const h = NODE_H[n.size]
            const data = NODE_DATA[id]
            const isLarge = n.size === 'l'
            const isSmall = n.size === 's'
            return (
              <g key={id}>
                <rect
                  x={n.x}
                  y={n.y}
                  width={w}
                  height={h}
                  rx="6"
                  ry="6"
                  fill="var(--canvas)"
                  stroke="var(--edge)"
                  strokeWidth="1"
                />
                {/* Index tab — gives every node a tiny "channel" badge */}
                <rect
                  x={n.x + 8}
                  y={n.y + 8}
                  width={isSmall ? 10 : 14}
                  height={isSmall ? 10 : 14}
                  rx="2"
                  ry="2"
                  fill="none"
                  stroke="var(--trace)"
                  strokeWidth="1"
                />
                <text
                  x={n.x + (isSmall ? 28 : 32)}
                  y={n.y + (isSmall ? 17 : 22)}
                  fill="var(--ink)"
                  fontFamily="var(--font-display), Georgia, serif"
                  fontSize={isLarge ? 16 : isSmall ? 11 : 14}
                  fontWeight="500"
                >
                  {data.name}
                </text>
                {data.sub && (
                  <text
                    x={n.x + (isSmall ? 28 : 32)}
                    y={n.y + (isSmall ? 28 : 38)}
                    fill="var(--ink-faint)"
                    fontFamily="var(--font-mono), ui-monospace, monospace"
                    fontSize={isSmall ? 8 : 10}
                    style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
                  >
                    {data.sub}
                  </text>
                )}
                {data.desc && !isSmall && (
                  <text
                    x={n.x + 12}
                    y={n.y + h - 14}
                    fill="var(--ink-muted)"
                    fontFamily="var(--font-sans), system-ui, sans-serif"
                    fontSize={isLarge ? 12 : 11}
                  >
                    {data.desc}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        <div className="absolute bottom-1 left-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          SYS.ARCH.001
        </div>
      </div>
    </div>
  )
}

/**
 * Compact overview-page diagram.
 *
 * Smaller hub-and-spoke that shows Talkie as orchestrator with three
 * helper processes and the protocol used to reach each one. Pure SVG so
 * it stays a server component and follows v2 tokens.
 */
export function SimpleArchitectureDiagram() {
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-md border border-edge-faint bg-canvas-alt p-4 md:p-6">
      <div className="relative" style={{ minWidth: 520, height: 240 }}>
        <svg
          viewBox="0 0 520 240"
          width="100%"
          height="240"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Talkie orchestrator with three helper processes"
          role="img"
        >
          <defs>
            <pattern id="osc-graticule-small" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--trace-faint)" strokeWidth="1" />
            </pattern>
            <marker id="osc-arrow-trace-sm" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <polygon points="0 0, 7 3, 0 6" fill="var(--trace)" />
            </marker>
          </defs>
          <rect x="0" y="0" width="520" height="240" fill="url(#osc-graticule-small)" opacity="0.35" />

          {/* Talkie at top center */}
          <rect x="195" y="20" width="130" height="56" rx="6" fill="var(--canvas)" stroke="var(--edge)" />
          <text x="260" y="44" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), Georgia, serif" fontSize="16" fontWeight="500">Talkie</text>
          <text x="260" y="60" textAnchor="middle" fill="var(--ink-faint)" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="9.5" style={{ letterSpacing: '0.18em' }}>ORCHESTRATOR</text>

          {/* Three helper boxes */}
          {[
            { x: 30,  name: 'TalkieAgent',  sub: 'EARS & HANDS', proto: 'XPC' },
            { x: 195, name: 'TalkieEngine', sub: 'LOCAL BRAIN',  proto: 'XPC' },
            { x: 360, name: 'TalkieServer', sub: 'iOS BRIDGE',   proto: 'HTTP' },
          ].map((helper) => (
            <g key={helper.name}>
              {/* connector from Talkie bottom to helper top */}
              <path
                d={`M 260 84 L ${helper.x + 65} 156`}
                fill="none"
                stroke="var(--trace)"
                strokeWidth="1.4"
                markerEnd="url(#osc-arrow-trace-sm)"
              />
              <text
                x={(260 + helper.x + 65) / 2}
                y={120}
                textAnchor="middle"
                fill="var(--trace)"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize="9"
                style={{ letterSpacing: '0.12em' }}
              >
                {helper.proto}
              </text>

              <rect x={helper.x} y="160" width="130" height="56" rx="6" fill="var(--canvas)" stroke="var(--edge)" />
              <text x={helper.x + 65} y="184" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), Georgia, serif" fontSize="14" fontWeight="500">{helper.name}</text>
              <text x={helper.x + 65} y="200" textAnchor="middle" fill="var(--ink-faint)" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="9" style={{ letterSpacing: '0.16em' }}>{helper.sub}</text>
            </g>
          ))}
        </svg>
        <div className="absolute bottom-1 left-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          SYS.OVERVIEW.001
        </div>
      </div>
    </div>
  )
}
