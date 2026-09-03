import type { ArcDiagramData } from '../ArcDiagram'

const diagram: ArcDiagramData = {
  id: 'SYS.ARCH.001',
  layout: { width: 860, height: 300 },

  // Top row: Talkie, TalkieServer, iPhone
  // Lower row: TalkieAgent (engine host), iCloud, Watch
  // Large=200w, Medium=140w, Small=90w
  nodes: {
    talkie:       { x: 40,  y: 28,  size: 'l' },
    talkieAgent:  { x: 70,  y: 175, size: 'm' },
    talkieServer: { x: 330, y: 36,  size: 'm' },
    iCloud:       { x: 330, y: 175, size: 'm' },
    iPhone:       { x: 560, y: 36,  size: 'm' },
    watch:        { x: 585, y: 175, size: 's' },
  },

  nodeData: {
    talkie:       { icon: 'Monitor',    name: 'Talkie',       subtitle: 'Swift/SwiftUI', description: 'Orchestrator & UI',     color: 'violet' },
    talkieAgent:  { icon: 'Mic',        name: 'TalkieAgent',  subtitle: 'Swift',         description: 'Capture + engine',     color: 'emerald' },
    talkieServer: { icon: 'Server',     name: 'TalkieServer', subtitle: 'TypeScript',    description: 'iOS bridge',           color: 'amber' },
    iCloud:       { icon: 'Cloud',      name: 'iCloud',       subtitle: 'CloudKit',      description: 'Memo sync',            color: 'sky' },
    iPhone:       { icon: 'Smartphone', name: 'iPhone',       subtitle: 'iOS',           description: 'Voice capture',        color: 'zinc' },
    watch:        { icon: 'Watch',      name: 'Watch',        subtitle: 'watchOS',         color: 'zinc' },
  },

  connectors: [
    { from: 'talkie',       to: 'talkieAgent',  fromAnchor: 'bottom', toAnchor: 'top',  style: 'xpc' },
    { from: 'talkie',       to: 'talkieServer', fromAnchor: 'right',  toAnchor: 'left', style: 'http' },
    { from: 'talkieServer', to: 'iPhone',       fromAnchor: 'right',  toAnchor: 'left', style: 'http' },
    { from: 'talkie',       to: 'iCloud',       fromAnchor: 'bottom', toAnchor: 'left',  style: 'cloudkit', curve: 'natural' },
    { from: 'iPhone',       to: 'iCloud',       fromAnchor: 'bottomLeft', toAnchor: 'right', style: 'cloudkit', curve: 'natural' },
    { from: 'iPhone',       to: 'watch',        fromAnchor: 'bottom', toAnchor: 'top',  style: 'peer' },
  ],

  connectorStyles: {
    xpc:      { color: 'emerald', strokeWidth: 1.4, label: 'XPC' },
    http:     { color: 'amber',   strokeWidth: 1.4, label: 'HTTP' },
    cloudkit: { color: 'sky',     strokeWidth: 1.2, dashed: true, label: 'CloudKit' },
    peer:     { color: 'zinc',    strokeWidth: 1.1, dashed: true },
  },
}

export default diagram
