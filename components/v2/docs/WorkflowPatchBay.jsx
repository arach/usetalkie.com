/**
 * Patch-bay schematic for /v2/docs/workflows.
 * Pure server-rendered SVG. All paint references CSS vars so it flips
 * with the theme. No client hooks.
 *
 * viewBox 0 0 720 320
 *   CAP   x=20  y=130 w=120 h=70   capture source (memo)
 *   S1    x=200 y=50  w=130 h=60   LLM
 *   S2    x=200 y=130 w=130 h=60   Shell  (highlighted — the spine)
 *   S3    x=200 y=210 w=130 h=60   Save
 *   ROUTE x=388 y=120 w=132 h=80   template router
 *   OUT1  x=560 y=50  w=140 h=60   file sink
 *   OUT2  x=560 y=130 w=140 h=60   webhook sink
 *   OUT3  x=560 y=210 w=140 h=60   notification sink
 */

function Graticule({ opacity = 0.5 }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage:
          'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
  )
}

function Block({ x, y, w, h, label, sub, highlighted = false, amber = false }) {
  const stroke = highlighted ? 'var(--trace)' : amber ? 'var(--amber)' : 'var(--ink-muted)'
  const strokeWidth = highlighted ? 1.4 : 1
  const fill = highlighted
    ? 'var(--trace-faint)'
    : amber
    ? 'color-mix(in oklab, var(--amber) 6%, transparent)'
    : 'transparent'
  const labelFill = highlighted ? 'var(--trace)' : amber ? 'var(--amber)' : 'var(--ink)'
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={
          highlighted ? { filter: 'drop-shadow(0 0 4px var(--trace-glow))' } : undefined
        }
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - (sub ? 4 : 0)}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="11"
        fill={labelFill}
        textAnchor="middle"
        letterSpacing="1"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 11}
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          fill="var(--ink-faint)"
          textAnchor="middle"
          letterSpacing="1"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

export default function WorkflowPatchBay() {
  const CAP = { x: 20, y: 130, w: 120, h: 70 }
  const S1 = { x: 200, y: 50, w: 130, h: 60 }
  const S2 = { x: 200, y: 130, w: 130, h: 60 }
  const S3 = { x: 200, y: 210, w: 130, h: 60 }
  const ROUTE = { x: 388, y: 120, w: 132, h: 80 }
  const OUT1 = { x: 560, y: 50, w: 140, h: 60 }
  const OUT2 = { x: 560, y: 130, w: 140, h: 60 }
  const OUT3 = { x: 560, y: 210, w: 140, h: 60 }

  const capOutY = CAP.y + CAP.h / 2
  const trunkX = 170
  const s1InY = S1.y + S1.h / 2
  const s2InY = S2.y + S2.h / 2
  const s3InY = S3.y + S3.h / 2
  const rTop = ROUTE.y + ROUTE.h * 0.25
  const rMid = ROUTE.y + ROUTE.h * 0.5
  const rBot = ROUTE.y + ROUTE.h * 0.75
  const out1Y = OUT1.y + OUT1.h / 2
  const out2Y = OUT2.y + OUT2.h / 2
  const out3Y = OUT3.y + OUT3.h / 2

  const traces = [
    `M ${CAP.x + CAP.w} ${capOutY} L ${trunkX} ${capOutY}`,
    `M ${trunkX} ${capOutY} L ${trunkX} ${s1InY} L ${S1.x} ${s1InY}`,
    `M ${trunkX} ${capOutY} L ${S2.x} ${s2InY}`,
    `M ${trunkX} ${capOutY} L ${trunkX} ${s3InY} L ${S3.x} ${s3InY}`,
    `M ${S1.x + S1.w} ${s1InY} L 360 ${s1InY} L 360 ${rTop} L ${ROUTE.x} ${rTop}`,
    `M ${S2.x + S2.w} ${s2InY} L ${ROUTE.x} ${rMid}`,
    `M ${S3.x + S3.w} ${s3InY} L 360 ${s3InY} L 360 ${rBot} L ${ROUTE.x} ${rBot}`,
    `M ${ROUTE.x + ROUTE.w} ${rTop} L 540 ${rTop} L 540 ${out1Y} L ${OUT1.x} ${out1Y}`,
    `M ${ROUTE.x + ROUTE.w} ${rMid} L ${OUT2.x} ${out2Y}`,
    `M ${ROUTE.x + ROUTE.w} ${rBot} L 540 ${rBot} L 540 ${out3Y} L ${OUT3.x} ${out3Y}`,
  ]

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-sm border border-edge bg-surface">
      <Graticule />
      <div className="relative flex items-center justify-between border-b border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        <span>WF-DOC / TALKIE.WORKFLOW.PIPELINE</span>
        <span>REV B.0</span>
      </div>
      <svg
        viewBox="0 0 720 320"
        className="relative block w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="wfdoc-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--trace)" />
          </marker>
        </defs>

        {traces.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--trace)"
            strokeWidth="1.1"
            markerEnd="url(#wfdoc-arrow)"
            opacity="0.85"
          />
        ))}

        <Block {...CAP} label="MEMO" sub="capture" amber />
        <Block {...S1} label="LLM" sub="step.llm" />
        <Block {...S2} label="SHELL" sub="step.shell" highlighted />
        <Block {...S3} label="SAVE" sub="step.saveFile" />
        <Block {...ROUTE} label="ROUTER" sub="{{ vars }}" />
        <Block {...OUT1} label="FILE" sub="@Obsidian/…" />
        <Block {...OUT2} label="WEBHOOK" sub="POST" />
        <Block {...OUT3} label="NOTIFY" sub="macOS / iOS" />

        <text
          x="170"
          y="45"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="var(--ink-faint)"
          letterSpacing="1"
        >
          TRUNK · {`{{TRANSCRIPT}}`}
        </text>
      </svg>
    </figure>
  )
}
