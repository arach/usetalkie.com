"use client"

import { useState } from 'react'

const nodes = [
  // Center
  { id: 'voice', label: 'Voice Memos', x: 300, y: 200, size: 'lg', color: 'emerald' },
  // Topics (outer ring)
  { id: 'engine', label: 'Open Source\nEngine', x: 100, y: 80, size: 'md', color: 'blue' },
  { id: 'scout', label: 'Open Scout', x: 300, y: 50, size: 'md', color: 'violet' },
  { id: 'marketing', label: 'Marketing\nStrategy', x: 500, y: 80, size: 'md', color: 'amber' },
  { id: 'product', label: 'Product\nRoadmap', x: 530, y: 220, size: 'md', color: 'rose' },
  { id: 'business', label: 'Business\nModel', x: 480, y: 350, size: 'md', color: 'cyan' },
  { id: 'workflow', label: 'Workflow\nBuilder', x: 120, y: 340, size: 'md', color: 'orange' },
  { id: 'health', label: 'Health &\nSustainability', x: 70, y: 220, size: 'sm', color: 'lime' },
  // Daily notes (small dots)
  { id: 'day1', label: 'Mar 9', x: 200, y: 130, size: 'xs', color: 'zinc' },
  { id: 'day2', label: 'Mar 10', x: 400, y: 140, size: 'xs', color: 'zinc' },
  { id: 'day3', label: 'Mar 14', x: 190, y: 280, size: 'xs', color: 'zinc' },
  { id: 'day4', label: 'Mar 15', x: 410, y: 280, size: 'xs', color: 'zinc' },
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

const colorMap = {
  emerald: {
    fill: 'fill-emerald-500 dark:fill-emerald-400',
    bg: 'rgba(16,185,129,0.12)',
    stroke: 'rgba(16,185,129,0.5)',
    text: 'fill-emerald-900 dark:fill-emerald-100',
  },
  blue: {
    fill: 'fill-blue-500 dark:fill-blue-400',
    bg: 'rgba(59,130,246,0.1)',
    stroke: 'rgba(59,130,246,0.4)',
    text: 'fill-blue-900 dark:fill-blue-100',
  },
  violet: {
    fill: 'fill-violet-500 dark:fill-violet-400',
    bg: 'rgba(139,92,246,0.1)',
    stroke: 'rgba(139,92,246,0.4)',
    text: 'fill-violet-900 dark:fill-violet-100',
  },
  amber: {
    fill: 'fill-amber-500 dark:fill-amber-400',
    bg: 'rgba(245,158,11,0.1)',
    stroke: 'rgba(245,158,11,0.4)',
    text: 'fill-amber-900 dark:fill-amber-100',
  },
  rose: {
    fill: 'fill-rose-500 dark:fill-rose-400',
    bg: 'rgba(244,63,94,0.1)',
    stroke: 'rgba(244,63,94,0.4)',
    text: 'fill-rose-900 dark:fill-rose-100',
  },
  cyan: {
    fill: 'fill-cyan-500 dark:fill-cyan-400',
    bg: 'rgba(6,182,212,0.1)',
    stroke: 'rgba(6,182,212,0.4)',
    text: 'fill-cyan-900 dark:fill-cyan-100',
  },
  orange: {
    fill: 'fill-orange-500 dark:fill-orange-400',
    bg: 'rgba(249,115,22,0.1)',
    stroke: 'rgba(249,115,22,0.4)',
    text: 'fill-orange-900 dark:fill-orange-100',
  },
  lime: {
    fill: 'fill-lime-500 dark:fill-lime-400',
    bg: 'rgba(132,204,22,0.1)',
    stroke: 'rgba(132,204,22,0.4)',
    text: 'fill-lime-900 dark:fill-lime-100',
  },
  zinc: {
    fill: 'fill-zinc-400 dark:fill-zinc-500',
    bg: 'rgba(161,161,170,0.08)',
    stroke: 'rgba(161,161,170,0.3)',
    text: 'fill-zinc-600 dark:fill-zinc-400',
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
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 ml-2">
            Knowledge Graph — 7 topics from 10 voice memos
          </span>
        </div>

        {/* SVG */}
        <svg viewBox="0 0 600 420" className="w-full" style={{ minHeight: 280 }}>
          <defs>
            <radialGradient id="glow-center" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
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

            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                strokeWidth={edge.strength === 2 ? 1.5 : 0.8}
                className={`transition-opacity duration-200 ${
                  isDimmed ? 'opacity-5' : isActive ? 'opacity-60' : 'opacity-20'
                }`}
                stroke={isActive ? colorMap[nodeMap[hovered].color]?.stroke || '#888' : '#888'}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const s = sizeMap[node.size]
            const c = colorMap[node.color]
            const isActive = hovered === node.id || connectedToHovered.has(node.id)
            const isDimmed = hovered && !isActive && hovered !== node.id

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
                  stroke={c.stroke}
                  strokeWidth={isActive || hovered === node.id ? 2 : 1}
                  className="transition-all duration-200"
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
                    className={c.text}
                  >
                    {line}
                  </text>
                ))}
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Center hub
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500" /> Topic nodes
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-400" /> Daily notes
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1.5 ml-auto">
            Hover to explore connections
          </span>
        </div>
      </div>
    </div>
  )
}
