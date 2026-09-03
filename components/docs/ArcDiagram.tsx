"use client"
import React, { useState, useCallback } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ============================================
// Types
// ============================================

export type NodeSize = 's' | 'm' | 'l'
export type AnchorPosition = 'left' | 'right' | 'top' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type DiagramColor = 'violet' | 'emerald' | 'blue' | 'amber' | 'sky' | 'zinc' | 'rose' | 'orange'

export interface NodePosition {
  x: number
  y: number
  size: NodeSize
}

export interface NodeData {
  icon: string
  name: string
  subtitle?: string
  description?: string
  color: DiagramColor
}

export interface Connector {
  from: string
  to: string
  fromAnchor: AnchorPosition
  toAnchor: AnchorPosition
  style: string
  curve?: 'natural' | 'step'
}

export type LabelAlign = 'left' | 'right' | 'center'

export interface ConnectorStyle {
  color: DiagramColor
  strokeWidth: number
  label?: string
  labelAlign?: LabelAlign  // For vertical: 'right' = right of line, 'left' = left of line. Default: 'right'
  dashed?: boolean
}

export interface DiagramLayout {
  width: number
  height: number
}

export interface ArcDiagramData {
  id?: string
  layout: DiagramLayout
  nodes: Record<string, NodePosition>
  nodeData: Record<string, NodeData>
  connectors: Connector[]
  connectorStyles: Record<string, ConnectorStyle>
}

// ============================================
// Constants
// ============================================

const NODE_SIZES: Record<NodeSize, { width: number; height: number }> = {
  l: { width: 200, height: 80 },
  m: { width: 140, height: 65 },
  s: { width: 90, height: 40 },
}

const COLORS: Record<DiagramColor, { stroke: string; faint: boolean }> = {
  violet:  { stroke: 'var(--trace)',     faint: false },
  emerald: { stroke: 'var(--trace)',     faint: false },
  blue:    { stroke: 'var(--trace)',     faint: false },
  amber:   { stroke: 'var(--trace)',     faint: false },
  orange:  { stroke: 'var(--trace)',     faint: false },
  rose:    { stroke: 'var(--trace)',     faint: false },
  sky:     { stroke: 'var(--ink-faint)', faint: true },
  zinc:    { stroke: 'var(--ink-faint)', faint: true },
}

const GRATICULE = {
  backgroundImage:
    'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

// ============================================
// Components
// ============================================

interface NodeProps {
  node: NodePosition
  data: NodeData
}

function Node({ node, data }: NodeProps) {
  const size = NODE_SIZES[node.size]
  const Icon = (LucideIcons as Record<string, LucideIcon>)[data.icon] || LucideIcons.Box

  const isLarge = node.size === 'l'
  const isSmall = node.size === 's'

  return (
    <div
      className={`
        absolute rounded-sm border border-edge bg-canvas
        ${isLarge ? 'px-4 py-3' : isSmall ? 'px-2.5 py-1.5' : 'px-3 py-2'}
      `}
      style={{ left: node.x, top: node.y, width: size.width, height: size.height }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`
            flex flex-shrink-0 items-center justify-center rounded-[2px] border border-trace/70
            ${isLarge ? 'h-8 w-8' : isSmall ? 'h-5 w-5' : 'h-6 w-6'}
          `}
        >
          <Icon className={`${isLarge ? 'h-4 w-4' : isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'} text-trace`} />
        </div>
        <div className="min-w-0">
          <div className={`font-display font-normal text-ink ${isLarge ? 'text-[15px]' : isSmall ? 'text-[11px]' : 'text-[13px]'}`}>
            {data.name}
          </div>
          {data.subtitle && (
            <div
              className={`font-mono text-ink-faint ${isSmall ? 'text-[8px] tracking-[0.08em]' : 'text-[9px] tracking-[0.10em]'}`}
            >
              {data.subtitle}
            </div>
          )}
        </div>
      </div>
      {data.description && !isSmall && (
        <div className={`mt-1.5 text-ink-muted ${isLarge ? 'text-[11px]' : 'text-[10px]'}`}>
          {data.description}
        </div>
      )}
    </div>
  )
}

function getAnchorPoint(node: NodePosition, anchor: AnchorPosition): { x: number; y: number } {
  const size = NODE_SIZES[node.size]
  const gap = 6

  const anchors: Record<AnchorPosition, { x: number; y: number }> = {
    left:        { x: node.x - gap,              y: node.y + size.height / 2 },
    right:       { x: node.x + size.width + gap, y: node.y + size.height / 2 },
    top:         { x: node.x + size.width / 2,   y: node.y - gap },
    bottom:      { x: node.x + size.width / 2,   y: node.y + size.height + gap },
    bottomRight: { x: node.x + size.width + gap, y: node.y + size.height - 12 },
    bottomLeft:  { x: node.x - gap,              y: node.y + size.height - 12 },
    topRight:    { x: node.x + size.width + gap, y: node.y + 12 },
    topLeft:     { x: node.x - gap,              y: node.y + 12 },
  }

  return anchors[anchor]
}

// Calculate angle between two points for arrow rotation
function getAngle(from: { x: number; y: number }, to: { x: number; y: number }): number {
  return Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI)
}

interface ConnectorProps {
  connector: Connector
  connectorIndex: number
  nodes: Record<string, NodePosition>
  styles: Record<string, ConnectorStyle>
}

function ConnectorPath({ connector, connectorIndex, nodes, styles }: ConnectorProps) {
  const fromNode = nodes[connector.from]
  const toNode = nodes[connector.to]
  if (!fromNode || !toNode) return null

  const style = styles[connector.style] || { color: 'zinc' as DiagramColor, strokeWidth: 1.4 }
  const from = getAnchorPoint(fromNode, connector.fromAnchor)
  const to = getAnchorPoint(toNode, connector.toAnchor)
  const colorMeta = COLORS[style.color] || COLORS.zinc
  const color = colorMeta.stroke
  const dashed = style.dashed || colorMeta.faint
  const gradientId = `connector-gradient-${connectorIndex}`

  // Calculate path
  let path: string
  const isVertical = Math.abs(to.y - from.y) > Math.abs(to.x - from.x)
  const labelAlign = style.labelAlign || (isVertical ? 'right' : 'center')

  // Label positioning
  let labelPos: { x: number; y: number }
  let labelOffset = { x: 0, y: 0 }
  let textAnchor: 'start' | 'middle' | 'end' = 'middle'

  if (connector.curve === 'natural') {
    // Curved path for diagonal connections
    const dx = to.x - from.x
    const dy = to.y - from.y
    const cp1x = from.x + dx * 0.4
    const cp1y = from.y + dy * 0.1
    const cp2x = to.x - dx * 0.4
    const cp2y = to.y - dy * 0.1
    path = `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`
    labelPos = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
    labelOffset = { x: 0, y: -8 }
  } else {
    path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`
    labelPos = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }

    if (isVertical) {
      // Vertical connector - position label to left or right of line
      if (labelAlign === 'right') {
        labelOffset = { x: 8, y: 4 }
        textAnchor = 'start'  // Left-aligned text on right side
      } else if (labelAlign === 'left') {
        labelOffset = { x: -8, y: 4 }
        textAnchor = 'end'    // Right-aligned text on left side
      } else {
        labelOffset = { x: 0, y: -8 }
        textAnchor = 'middle'
      }
    } else {
      // Horizontal connector - label above, centered
      labelOffset = { x: 0, y: -8 }
      textAnchor = 'middle'
    }
  }

  // Calculate arrow angle at endpoint
  const angle = getAngle(from, to)
  const arrowSize = 8

  return (
    <g>
      {/* Gradient definition - fades at both ends */}
      <defs>
        <linearGradient
          id={gradientId}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="12%" stopColor={color} stopOpacity={1} />
          <stop offset="88%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0.35} />
        </linearGradient>
      </defs>

      {/* Main path with gradient */}
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={style.strokeWidth ?? 1.4}
        strokeDasharray={dashed ? '5 3' : undefined}
      />

      {/* Arrow head - triangle at end point */}
      <g transform={`translate(${to.x}, ${to.y}) rotate(${angle})`}>
        <polygon
          points={`0,0 ${-arrowSize},-${arrowSize/2.5} ${-arrowSize},${arrowSize/2.5}`}
          fill={color}
        />
      </g>

      {/* Label */}
      {style.label && (
        <text
          x={labelPos.x + labelOffset.x}
          y={labelPos.y + labelOffset.y}
          textAnchor={textAnchor}
          fill={color}
          className="font-mono text-[9.5px] uppercase tracking-[0.08em]"
          style={{
            fontFamily: 'var(--font-mono), ui-monospace, monospace',
            paintOrder: 'stroke fill',
            stroke: 'var(--canvas)',
            strokeWidth: 4,
          }}
        >
          {style.label}
        </text>
      )}
    </g>
  )
}

// ============================================
// Zoom Controls
// ============================================

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2]

interface ZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  const { ZoomIn, ZoomOut } = LucideIcons

  return (
    <div className="flex items-center bg-canvas">
      <button
        onClick={onZoomOut}
        disabled={zoom <= ZOOM_LEVELS[0]}
        className="rounded-l-sm p-1 text-ink-faint transition-colors hover:bg-canvas-alt hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        title="Zoom out"
      >
        <ZoomOut className="h-3 w-3" />
      </button>
      <button
        onClick={onReset}
        className="min-w-[36px] border-x border-edge px-1.5 py-1 font-mono text-[9px] text-ink-faint transition-colors hover:bg-canvas-alt hover:text-ink"
        title="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={onZoomIn}
        disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
        className="rounded-r-sm p-1 text-ink-faint transition-colors hover:bg-canvas-alt hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        title="Zoom in"
      >
        <ZoomIn className="h-3 w-3" />
      </button>
    </div>
  )
}

// ============================================
// Main Component
// ============================================

interface ArcDiagramProps {
  data: ArcDiagramData
  className?: string
  interactive?: boolean  // Enable zoom/pan controls
}

export default function ArcDiagram({ data, className = '', interactive = true }: ArcDiagramProps) {
  const { id, layout, nodes, nodeData, connectors, connectorStyles } = data

  // Zoom & pan state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = useCallback(() => {
    setZoom(z => {
      const idx = ZOOM_LEVELS.findIndex(l => l >= z)
      return ZOOM_LEVELS[Math.min(idx + 1, ZOOM_LEVELS.length - 1)]
    })
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(z => {
      const idx = ZOOM_LEVELS.findIndex(l => l >= z)
      return ZOOM_LEVELS[Math.max(idx - 1, 0)]
    })
  }, [])

  const handleReset = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!interactive) return
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      if (e.deltaY < 0) handleZoomIn()
      else handleZoomOut()
    }
  }, [interactive, handleZoomIn, handleZoomOut])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!interactive) return
    setIsPanning(true)
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }, [interactive, pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    })
  }, [isPanning, panStart])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  return (
    <div
      className={`overflow-x-auto rounded-sm border border-edge bg-canvas ${className}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: interactive ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
    >
      <div className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-2 border border-edge-faint" />
        <span aria-hidden className="pointer-events-none absolute left-2 top-2 z-10 h-2.5 w-2.5 border-l border-t border-trace/60" />
        <span aria-hidden className="pointer-events-none absolute right-2 top-2 z-10 h-2.5 w-2.5 border-r border-t border-trace/60" />
        <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 z-10 h-2.5 w-2.5 border-b border-l border-trace/60" />
        <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 z-10 h-2.5 w-2.5 border-b border-r border-trace/60" />

      <div
        className="relative transition-transform duration-150 ease-out"
        style={{
          width: layout.width,
          height: layout.height,
          minWidth: layout.width,
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'top left',
        }}
      >
        <div
          aria-hidden
          className="absolute opacity-40"
          style={{
            top: -2000,
            left: -2000,
            width: layout.width + 4000,
            height: layout.height + 4000,
            ...GRATICULE,
          }}
        />

        {/* Connectors */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
        >
          {connectors.map((conn, i) => (
            <ConnectorPath
              key={i}
              connector={conn}
              connectorIndex={i}
              nodes={nodes}
              styles={connectorStyles}
            />
          ))}
        </svg>

        {/* Nodes */}
        {Object.entries(nodes).map(([nodeId, node]) => (
          <Node key={nodeId} node={node} data={nodeData[nodeId]} />
        ))}
      </div>
      </div>

      <div className="flex items-stretch border-t border-edge bg-canvas">
        <div className="flex min-w-0 flex-1 items-baseline gap-3 px-3 py-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-trace">
            {id || 'SYS.ARCH'}
          </span>
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
            macOS process topology
          </span>
        </div>
        <div className="hidden items-center border-l border-edge px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-subtle sm:flex">
          Scale 1:1
        </div>
        <div className="flex items-center border-l border-edge px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-subtle">
          Sheet 1/1
        </div>
        {interactive && (
          <div className="relative border-l border-edge">
            <ZoomControls
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  )
}
