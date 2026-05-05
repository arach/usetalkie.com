"use client"

import { useState } from 'react'

// Color discipline: 1 accent (amber) for the center hub, neutral ink for everything else.
// Differentiation between topic nodes and daily notes is carried by *size*, not hue.
const nodes = [
  // Center
  { id: 'voice', label: 'Voice Memos', x: 300, y: 200, size: 'lg', kind: 'hub' },
  // Topics (outer ring)
  { id: 'engine', label: 'API\nRedesign', x: 100, y: 80, size: 'md', kind: 'topic' },
  { id: 'scout', label: 'Mobile App', x: 300, y: 50, size: 'md', kind: 'topic' },
  { id: 'marketing', label: 'Marketing\nStrategy', x: 500, y: 80, size: 'md', kind: 'topic' },
  { id: 'product', label: 'Product\nLaunch', x: 530, y: 220, size: 'md', kind: 'topic' },
  { id: 'business', label: 'Pricing\nModel', x: 480, y: 350, size: 'md', kind: 'topic' },
  { id: 'workflow', label: 'Onboarding\nFlow', x: 120, y: 340, size: 'md', kind: 'topic' },
  { id: 'health', label: 'Health &\nSustainability', x: 70, y: 220, size: 'sm', kind: 'topic' },
  // Daily notes (small dots)
  { id: 'day1', label: 'Mar 9', x: 200, y: 130, size: 'xs', kind: 'note' },
  { id: 'day2', label: 'Mar 10', x: 400, y: 140, size: 'xs', kind: 'note' },
  { id: 'day3', label: 'Mar 14', x: 190, y: 280, size: 'xs', kind: 'note' },
  { id: 'day4', label: 'Mar 15', x: 410, y: 280, size: 'xs', kind: 'note' },
]

const edges = [
  // Voice → daily notes
  { from: 'voice', to: 'day1', strength: 1 },
  { from: 'voice', to: 'day2', strength: 1 },
  { from: 'voice', to: 'day3', strength: 1 },
  { from: 'voice', to: 'day4', strength: 1 },
  // Daily notes → topics
  { from: 'day1', to: 'engine', strength: 2 },
  { from: 'day1', to: 'scout', strength: 2 },
  { from: 'day2', to: 'marketing', strength: 2 },
  { from: 'day2', to: 'product', strength: 2 },
  { from: 'day2', to: 'scout', strength: 1 },
  { from: 'day3', to: 'product', strength: 2 },
  { from: 'day3', to: 'workflow', strength: 2 },
  { from: 'day3', to: 'health', strength: 1 },
  { from: 'day4', to: 'business', strength: 2 },
  { from: 'day4', to: 'marketing', strength: 1 },
  { from: 'day4', to: 'product', strength: 1 },
  // Cross-topic connections
  { from: 'scout', to: 'marketing', strength: 1 },
  { from: 'scout', to: 'workflow', strength: 1 },
  { from: 'product', to: 'business', strength: 1 },
]

// Two-tone palette: amber for the center hub, ink-muted for orbiting topics + notes.
// All values resolve via currentColor cascade or var(--token), so themes flip cleanly.
const kindMap = {
  hub: {
    bg: 'color-mix(in oklab, var(--amber) 14%, transparent)',
    stroke: 'color-mix(in oklab, var(--amber) 55%, transparent)',
    textColor: 'var(--amber)',
  },
  topic: {
    bg: 'color-mix(in oklab, var(--ink-faint) 14%, transparent)',
    stroke: 'color-mix(in oklab, var(--ink-faint) 45%, transparent)',
    textColor: 'var(--ink)',
  },
  note: {
    bg: 'color-mix(in oklab, var(--ink-faint) 8%, transparent)',
    stroke: 'color-mix(in oklab, var(--ink-faint) 30%, transparent)',
    textColor: 'var(--ink-muted)',
  },
}

const sizeMap = {
  lg: { r: 38, fontSize: 11, fontWeight: 600 },
  md: { r: 30, fontSize: 9, fontWeight: 500 },
  sm: { r: 24, fontSize: 8, fontWeight: 500 },
  xs: { r: 16, fontSize: 7, fontWeight: 400 },
}

export default function MindMap() {
  const [hovered, setHovered] = useState(null)

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  const getConnectedIds = (id) => {
    const connected = new Set()
    edges.forEach(e => {
      if (e.from === id) connected.add(e.to)
      if (e.to === id) connected.add(e.from)
    })
    return connected
  }

  const connectedToHovered = hovered ? getConnectedIds(hovered) : new Set()

  return (
    <div className="not-prose my-10">
      <div className="rounded-xl border border-edge-dim bg-canvas-alt overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-edge-faint flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-edge" />
            <div className="w-2.5 h-2.5 rounded-full bg-edge" />
            <div className="w-2.5 h-2.5 rounded-full bg-edge" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-faint ml-2">
            Knowledge Graph — 7 topics from 10 voice memos
          </span>
        </div>

        {/* SVG */}
        <svg viewBox="0 0 600 420" className="w-full" style={{ minHeight: 280, color: 'var(--ink-faint)' }}>
          <defs>
            <radialGradient id="glow-center" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background glow behind center */}
          <circle cx={300} cy={200} r={100} fill="url(#glow-center)" />

          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodeMap[edge.from]
            const to = nodeMap[edge.to]
            const isActive = hovered && (hovered === edge.from || hovered === edge.to)
            const isDimmed = hovered && !isActive
            const hoveredKind = hovered ? nodeMap[hovered].kind : null

            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                strokeWidth={edge.strength === 2 ? 1.5 : 0.8}
                className={`transition-opacity duration-200 ${
                  isDimmed ? 'opacity-5' : isActive ? 'opacity-70' : 'opacity-25'
                }`}
                stroke={isActive && hoveredKind === 'hub' ? 'var(--amber)' : 'currentColor'}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const s = sizeMap[node.size]
            const c = kindMap[node.kind]
            const isActive = hovered === node.id || connectedToHovered.has(node.id)
            const isDimmed = hovered && !isActive && hovered !== node.id
            const isHover = hovered === node.id

            const lines = node.label.split('\n')

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s' }}
                opacity={isDimmed ? 0.25 : 1}
              >
                {/* Background circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={s.r}
                  fill={c.bg}
                  stroke={isHover ? 'var(--amber)' : c.stroke}
                  strokeWidth={isActive || isHover ? 2 : 1}
                  className="transition-all duration-200"
                  style={isHover ? { filter: 'drop-shadow(0 0 6px color-mix(in oklab, var(--amber) 45%, transparent))' } : undefined}
                />
                {/* Label */}
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={node.x}
                    y={node.y + (li - (lines.length - 1) / 2) * (s.fontSize + 2)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={s.fontSize}
                    fontWeight={s.fontWeight}
                    fontFamily="var(--font-sans)"
                    fill={c.textColor}
                  >
                    {line}
                  </text>
                ))}
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="px-4 py-2.5 border-t border-edge-faint flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-[10px] text-ink-faint font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber" style={{ boxShadow: '0 0 4px var(--amber)' }} /> Center hub
          </span>
          <span className="text-[10px] text-ink-faint font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--ink-muted)' }} /> Topic nodes
          </span>
          <span className="text-[10px] text-ink-faint font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--ink-faint)' }} /> Daily notes
          </span>
          <span className="text-[10px] text-ink-subtle font-mono flex items-center gap-1.5 ml-auto">
            Hover to explore connections
          </span>
        </div>
      </div>
    </div>
  )
}
