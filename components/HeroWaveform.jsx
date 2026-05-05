/**
 * HeroWaveform — static, deterministic SVG trace for the hero panel.
 *
 * Pure server component. Same path on server + client (no Math.random,
 * no Date.now), so there's no hydration drift. Stroke paint references
 * `var(--trace*)` so the figure re-skins atomically on theme flip
 * without any JS.
 *
 * Rendered into a fixed-aspect viewport box so it scales fluidly while
 * preserving the graticule + corner ticks beneath.
 */
export default function HeroWaveform({
  width = 1200,
  height = 220,
  channelLabel = 'CH-01',
  scaleLabel = '32.1kHz · MAC · iPHONE · WATCH',
}) {
  const n = 360
  const points = []

  // Two superimposed envelopes give the trace a "burst then settle"
  // shape that reads as a captured utterance rather than a sine sweep.
  for (let i = 0; i < n; i++) {
    const nx = i / (n - 1)
    const burstEnv = Math.exp(-Math.pow((nx - 0.32) * 4.2, 2)) * 0.95
    const tailEnv = Math.exp(-Math.pow((nx - 0.74) * 5.5, 2)) * 0.55
    const env = burstEnv + tailEnv
    const carrier =
      Math.sin(nx * 38 + 1.1) * 0.5 +
      Math.sin(nx * 71 + 3.3) * 0.28 +
      Math.sin(nx * 137 + 7.1) * 0.14
    const y = height / 2 - carrier * env * (height * 0.4)
    points.push(`${(nx * width).toFixed(2)},${y.toFixed(2)}`)
  }

  const polyPoints = points.join(' ')
  const cornerTickLen = 12

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      preserveAspectRatio="none"
      aria-hidden
      className="block"
    >
      {/* Major graticule lines */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = ((i + 1) * width) / 8
        return (
          <line
            key={`v-${i}`}
            x1={x}
            x2={x}
            y1={0}
            y2={height}
            stroke="var(--trace-faint)"
            strokeWidth={1}
          />
        )
      })}
      {Array.from({ length: 3 }, (_, i) => {
        const y = ((i + 1) * height) / 4
        return (
          <line
            key={`h-${i}`}
            x1={0}
            x2={width}
            y1={y}
            y2={y}
            stroke="var(--trace-faint)"
            strokeWidth={1}
          />
        )
      })}

      {/* Center axis */}
      <line
        x1={0}
        x2={width}
        y1={height / 2}
        y2={height / 2}
        stroke="var(--trace-dim)"
        strokeWidth={1}
        strokeDasharray="3 4"
      />

      {/* Corner ticks (instrument frame) */}
      {[
        [0, 0],
        [width, 0],
        [0, height],
        [width, height],
      ].map(([cx, cy], i) => {
        const xSign = cx === 0 ? 1 : -1
        const ySign = cy === 0 ? 1 : -1
        return (
          <g key={`tick-${i}`} stroke="var(--trace)" strokeWidth={1.5}>
            <line x1={cx} y1={cy} x2={cx + xSign * cornerTickLen} y2={cy} />
            <line x1={cx} y1={cy} x2={cx} y2={cy + ySign * cornerTickLen} />
          </g>
        )
      })}

      {/* Trace — soft glow underlay then crisp top stroke */}
      <polyline
        fill="none"
        stroke="var(--trace)"
        strokeOpacity={0.35}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={polyPoints}
        style={{ filter: 'drop-shadow(0 0 6px var(--trace))' }}
      />
      <polyline
        fill="none"
        stroke="var(--trace)"
        strokeOpacity={0.95}
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={polyPoints}
      />

      {/* Instrument labels */}
      <text
        x={14}
        y={20}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        fontSize="10"
        fill="var(--ink-subtle)"
        letterSpacing="2"
      >
        {channelLabel}
      </text>
      <text
        x={width - 14}
        y={20}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        fontSize="10"
        fill="var(--ink-subtle)"
        letterSpacing="2"
        textAnchor="end"
      >
        {scaleLabel}
      </text>
      <text
        x={14}
        y={height - 10}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        fontSize="9"
        fill="var(--ink-subtle)"
        letterSpacing="2"
      >
        TRIG · AUTO
      </text>
      <text
        x={width - 14}
        y={height - 10}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        fontSize="9"
        fill="var(--trace)"
        letterSpacing="2"
        textAnchor="end"
        style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
      >
        ● LIVE
      </text>
    </svg>
  )
}
