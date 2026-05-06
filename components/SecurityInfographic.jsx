"use client"
import React, { useState } from 'react'
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Cloud,
  Monitor,
  ArrowRight,
  Globe,
  Database,
  FileKey,
  Wifi,
  Info
} from 'lucide-react'

const ServiceBadge = ({ label, icon: Icon, imgSrc }) => (
  <div className="group flex cursor-default items-center gap-2.5 rounded border border-edge-dim bg-surface px-3 py-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-[0_0_18px_-6px_var(--trace-glow)]">
    {imgSrc ? (
       <img src={imgSrc} alt={label} className="h-3.5 w-3.5 object-contain opacity-70 grayscale transition-all duration-200 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0" />
    ) : (
       Icon && <Icon className="h-3.5 w-3.5 text-ink-muted transition-transform duration-200 group-hover:scale-110" />
    )}
    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted transition-colors duration-200 group-hover:text-ink">{label}</span>
  </div>
)

export function SecurityInfographic() {
  const [activeZone, setActiveZone] = useState(null)

  // Focus States
  const isInput = activeZone === 'input'      // Specific iPhone focus
  const isProcessing = activeZone === 'processing' // Specific Mac focus
  const isUserZone = activeZone === 'user-zone'    // General Zone focus
  const isBarrier = activeZone === 'barrier'       // Lock/Gate focus
  const isExternal = activeZone === 'external'     // Services focus

  // Derived Color States
  // Single-accent rule: any "user-owned" activity lights with the trace
  // (phosphor) accent. External / barrier light with amber.
  const iphoneActive = isUserZone || isInput
  const macActive = isUserZone || isProcessing
  const icloudActive = isUserZone || isInput || isProcessing // iCloud lights up for any internal activity

  // Outbound Path Highlight: Active if Processing (Mac) OR Barrier OR External is hovered
  const isOutboundActive = isProcessing || isBarrier || isExternal

  // Helper: card chrome — single trace accent on activation.
  const getThemeClasses = (active) =>
    active
      ? 'border-trace/40'
      : 'border-edge-dim'

  const getCardStyle = (active) =>
    active
      ? {
          background: 'color-mix(in oklab, var(--trace) 8%, transparent)',
          boxShadow: '0 0 18px -6px var(--trace-glow)',
        }
      : { background: 'color-mix(in oklab, var(--surface) 92%, transparent)' }

  const getIconClass = (active) =>
    active ? 'text-trace' : 'text-ink-faint'

  const getTextClass = (active) =>
    active ? 'text-trace' : 'text-ink-muted'

  return (
    <div className="relative select-none overflow-visible rounded-sm border border-edge-dim bg-canvas-alt p-6 md:p-12" onMouseLeave={() => setActiveZone(null)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
            <ShieldCheck
              className="h-6 w-6 text-trace transition-transform duration-200"
              style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
            />
            <div className="flex flex-col">
                <h2 className="text-xl font-bold uppercase leading-none tracking-wide text-ink">Security Architecture</h2>
                <span className="mt-1 font-mono text-[10px] uppercase text-ink-subtle">Data Sovereignty Model v1.2</span>
            </div>
            </div>
             <div className="flex items-center gap-4 font-mono text-[10px] uppercase text-ink-subtle">
                {/* Legend: Input */}
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${activeZone && !iphoneActive ? 'opacity-30' : 'opacity-100'}`}>
                    <div
                      className="h-2 w-2 rounded-full bg-trace transition-all duration-300"
                      style={{ boxShadow: iphoneActive ? '0 0 6px var(--trace-glow)' : 'none' }}
                    />
                    <span>Input (iOS)</span>
                </div>
                {/* Legend: Processing */}
                 <div className={`flex items-center gap-2 transition-opacity duration-300 ${activeZone && !macActive ? 'opacity-30' : 'opacity-100'}`}>
                    <div
                      className="h-2 w-2 rounded-full bg-trace transition-all duration-300"
                      style={{ boxShadow: macActive ? '0 0 6px var(--trace-glow)' : 'none' }}
                    />
                    <span>Processing (macOS)</span>
                </div>
                {/* Legend: Services */}
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${activeZone && !isExternal && !isBarrier && !isProcessing ? 'opacity-30' : 'opacity-100'}`}>
                    <div className={`h-2 w-2 rounded-full bg-amber transition-colors ${isBarrier ? 'animate-pulse' : ''}`} />
                    <span>Services</span>
                </div>
            </div>
        </div>

        {/* Main Grid Layout */}
        <div className="relative grid grid-cols-1 overflow-visible rounded-sm border border-edge-dim bg-surface lg:grid-cols-12">

          {/* === USER OWNED ZONE (Left 8 Cols) === */}
          <div
            className="group/zone relative z-20 flex flex-col p-8 lg:col-span-8"
            onMouseOver={() => setActiveZone('user-zone')}
          >

             {/* Zone Header */}
             <div className="pointer-events-none z-20 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Lock
                      className={`h-3 w-3 transition-colors ${icloudActive ? 'text-trace' : 'text-ink-subtle'}`}
                      style={icloudActive ? { filter: 'drop-shadow(0 0 3px var(--trace-glow))' } : undefined}
                    />
                    <span
                      className={`font-mono text-xs font-bold uppercase tracking-widest transition-colors ${icloudActive ? 'text-trace' : 'text-ink-subtle'}`}
                      style={icloudActive ? { textShadow: '0 0 4px var(--trace-glow)' } : undefined}
                    >User Owned Zone</span>
                </div>
             </div>

             {/* SVG Overlay for Internal Flows
                 currentColor cascade: the wrapping <g> sets `color`,
                 strokes/fills inherit via currentColor. */}
             <svg
               className="pointer-events-none absolute inset-0 z-0 h-full w-full"
               xmlns="http://www.w3.org/2000/svg"
             >
                <defs>
                  <marker id="arrowhead-trace" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 L0,0" fill="currentColor" />
                  </marker>
                  <marker id="arrowhead-edge" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 L0,0" fill="currentColor" />
                  </marker>
                </defs>

                {/* iPhone <-> iCloud */}
                <g style={{ color: iphoneActive ? 'var(--trace)' : 'var(--ink-subtle)' }}>
                  <line
                    x1="23%" y1="62%" x2="23%" y2="45%"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity={iphoneActive ? 1 : 0.35}
                    strokeDasharray={iphoneActive ? '0' : '4 4'}
                    className="transition-all duration-500"
                    markerEnd="url(#arrowhead-trace)"
                    style={iphoneActive ? { filter: 'drop-shadow(0 0 2px var(--trace-glow))' } : undefined}
                  />
                  <line
                    x1="27%" y1="45%" x2="27%" y2="62%"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity={iphoneActive ? 1 : 0.35}
                    strokeDasharray={iphoneActive ? '0' : '4 4'}
                    className="transition-all duration-500"
                    markerEnd="url(#arrowhead-trace)"
                    style={iphoneActive ? { filter: 'drop-shadow(0 0 2px var(--trace-glow))' } : undefined}
                  />
                </g>

                {/* Mac <-> iCloud */}
                <g style={{ color: macActive ? 'var(--trace)' : 'var(--ink-subtle)' }}>
                  <line
                    x1="73%" y1="62%" x2="73%" y2="45%"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity={macActive ? 1 : 0.35}
                    strokeDasharray={macActive ? '0' : '4 4'}
                    className="transition-all duration-500"
                    markerEnd="url(#arrowhead-trace)"
                    style={macActive ? { filter: 'drop-shadow(0 0 2px var(--trace-glow))' } : undefined}
                  />
                  <line
                    x1="77%" y1="45%" x2="77%" y2="62%"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity={macActive ? 1 : 0.35}
                    strokeDasharray={macActive ? '0' : '4 4'}
                    className="transition-all duration-500"
                    markerEnd="url(#arrowhead-trace)"
                    style={macActive ? { filter: 'drop-shadow(0 0 2px var(--trace-glow))' } : undefined}
                  />
                </g>
             </svg>

             {/* Content Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 relative z-10">

                {/* --- ROW 1: iCloud (Spans 2) --- */}
                <div className="col-span-1 md:col-span-2">
                   <div
                      className={`flex w-full items-center justify-between gap-4 rounded-sm border p-4 transition-all duration-300 ${
                          icloudActive ? 'border-trace/30' : 'border-edge-dim'
                      }`}
                      style={
                        icloudActive
                          ? {
                              background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                              boxShadow: '0 0 18px -8px var(--trace-glow)',
                            }
                          : undefined
                      }
                  >
                     <div className="flex items-center gap-4">
                        <div
                          className={`rounded-sm border p-2 transition-colors ${
                            icloudActive ? 'border-trace/30 text-trace' : 'border-edge-dim text-ink-subtle'
                          }`}
                          style={
                            icloudActive
                              ? { background: 'color-mix(in oklab, var(--trace) 8%, transparent)' }
                              : undefined
                          }
                        >
                            <Cloud className="h-5 w-5" />
                        </div>
                        <div>
                            <h4
                              className={`mb-1 text-xs font-bold uppercase tracking-wider transition-colors ${icloudActive ? 'text-trace' : 'text-ink'}`}
                              style={icloudActive ? { textShadow: '0 0 4px var(--trace-glow)' } : undefined}
                            >iCloud</h4>
                            <span className="font-mono text-[10px] text-ink-subtle">Encrypted CloudKit Container</span>
                        </div>
                     </div>

                     <div className="hidden items-center gap-6 pr-4 md:flex">
                        <div className="flex items-center gap-2 font-mono text-[9px] uppercase text-ink-subtle">
                           <Database className="h-3 w-3" /> Private DB
                        </div>
                         <div className="flex items-center gap-2 font-mono text-[9px] uppercase text-ink-subtle">
                           <FileKey className="h-3 w-3" /> User Keys Only
                        </div>
                         <div className="flex items-center gap-2 font-mono text-[9px] uppercase text-ink-subtle">
                           <Wifi className="h-3 w-3" /> Sync Only
                        </div>
                     </div>
                  </div>
                </div>

                {/* --- ROW 2: iPhone (Left) --- */}
                <div className="flex flex-col gap-2">
                   {/* Card */}
                   <div
                      onMouseOver={(e) => {
                          e.stopPropagation()
                          setActiveZone('input')
                      }}
                      className={`flex h-full flex-col rounded-sm border transition-all duration-300 ${getThemeClasses(iphoneActive)}`}
                      style={getCardStyle(iphoneActive)}
                  >
                     {/* Card Header */}
                     <div className="flex items-center gap-3 border-b border-inherit p-4">
                        <Smartphone
                          className={`h-4 w-4 transition-colors ${getIconClass(iphoneActive)}`}
                          style={iphoneActive ? { filter: 'drop-shadow(0 0 3px var(--trace-glow))' } : undefined}
                        />
                        <h4
                          className={`text-xs font-bold uppercase tracking-wider transition-colors ${getTextClass(iphoneActive)}`}
                          style={iphoneActive ? { textShadow: '0 0 4px var(--trace-glow)' } : undefined}
                        >iPhone</h4>
                     </div>

                     {/* Details Block */}
                     <div className="flex-1 p-4">
                        <div
                          className={`mb-3 font-mono text-[9px] font-bold uppercase tracking-widest transition-colors ${
                            iphoneActive ? 'text-trace' : 'text-ink-subtle'
                          }`}
                          style={iphoneActive ? { textShadow: '0 0 4px var(--trace-glow)' } : undefined}
                        >
                           Input Context
                        </div>
                        <div className="space-y-2">
                           {[
                              "1. Audio Capture (VAD)",
                              "2. Local Encryption",
                              "3. Sync Push"
                           ].map((step, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-2 rounded-sm border p-1.5 transition-colors ${
                                  iphoneActive ? 'border-trace/30 text-trace' : 'border-edge-dim text-ink-muted'
                                }`}
                                style={
                                  iphoneActive
                                    ? { background: 'color-mix(in oklab, var(--trace) 12%, transparent)' }
                                    : undefined
                                }
                              >
                                 <span className="font-mono text-[9px] uppercase tracking-wide">{step}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>

                {/* --- ROW 2: Mac (Right) --- */}
                <div className="relative flex flex-col gap-2">
                   {/* Card */}
                   <div
                      onMouseOver={(e) => {
                          e.stopPropagation()
                          setActiveZone('processing')
                      }}
                      className={`flex h-full flex-col rounded-sm border transition-all duration-300 ${getThemeClasses(macActive)}`}
                      style={getCardStyle(macActive)}
                  >
                     {/* Card Header */}
                     <div className="flex items-center gap-3 border-b border-inherit p-4">
                        <Monitor
                          className={`h-4 w-4 transition-colors ${getIconClass(macActive)}`}
                          style={macActive ? { filter: 'drop-shadow(0 0 3px var(--trace-glow))' } : undefined}
                        />
                        <h4
                          className={`text-xs font-bold uppercase tracking-wider transition-colors ${getTextClass(macActive)}`}
                          style={macActive ? { textShadow: '0 0 4px var(--trace-glow)' } : undefined}
                        >Mac</h4>
                     </div>

                     {/* Details Block */}
                     <div className="flex-1 p-4">
                        <div
                          className={`mb-3 font-mono text-[9px] font-bold uppercase tracking-widest transition-colors ${
                            macActive ? 'text-trace' : 'text-ink-subtle'
                          }`}
                          style={macActive ? { textShadow: '0 0 4px var(--trace-glow)' } : undefined}
                        >
                           Runtime Details
                        </div>
                        <div className="space-y-2">
                           {[
                              "1. Context Assembly",
                              "2. PII Redaction",
                              "3. Secure Dispatch"
                           ].map((step, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-2 rounded-sm border p-1.5 transition-colors ${
                                  macActive ? 'border-trace/30 text-trace' : 'border-edge-dim text-ink-muted'
                                }`}
                                style={
                                  macActive
                                    ? { background: 'color-mix(in oklab, var(--trace) 12%, transparent)' }
                                    : undefined
                                }
                              >
                                 <span className="font-mono text-[9px] uppercase tracking-wide">{step}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Outbound Arrow (Interactive via Barrier) */}
                  <div className="pointer-events-none absolute left-full top-[60%] z-50 -ml-px flex items-center pl-2">
                       <div
                         className="relative h-0.5 w-24 transition-all delay-75 duration-200"
                         style={{
                           background: isOutboundActive ? 'var(--amber)' : 'var(--ink-subtle)',
                           boxShadow: isOutboundActive ? '0 0 10px color-mix(in oklab, var(--amber) 60%, transparent)' : 'none',
                         }}
                       />
                       <ArrowRight
                         className="-ml-1 h-4 w-4 transition-colors delay-75"
                         style={{ color: isOutboundActive ? 'var(--amber)' : 'var(--ink-subtle)' }}
                       />
                  </div>
                </div>

             </div>

             {/* SANITIZATION BARRIER (Interactive) */}
             <div
                className="group/barrier absolute bottom-0 right-0 top-0 z-40 hidden w-[40px] translate-x-1/2 cursor-crosshair flex-col items-center justify-center lg:flex"
                onMouseOver={(e) => {
                    e.stopPropagation()
                    setActiveZone('barrier')
                }}
             >
                 {/* Visual Line */}
                 <div
                   className="absolute inset-y-0 w-[8px] border-l border-r transition-all duration-300"
                   style={{
                     borderColor: isBarrier ? 'color-mix(in oklab, var(--amber) 50%, transparent)' : 'var(--edge-dim)',
                     background: isBarrier ? 'color-mix(in oklab, var(--amber) 12%, var(--surface))' : 'var(--surface)',
                     boxShadow: isBarrier ? '0 0 15px -4px color-mix(in oklab, var(--amber) 60%, transparent)' : 'none',
                   }}
                 />

                 {/* Hatch Pattern — uses currentColor through amber token */}
                 <div
                   aria-hidden
                   className="absolute inset-y-0 w-[6px] transition-opacity duration-300"
                   style={{
                     opacity: isBarrier ? 0.45 : 0.22,
                     backgroundImage:
                       'repeating-linear-gradient(45deg, transparent 0 3px, var(--amber) 3px 6px)',
                   }}
                 />

                 {/* Lock Icon — single accent: amber. Pulses on barrier hover. */}
                 <div
                   className={`relative z-10 rounded-full border bg-canvas p-1.5 transition-all duration-300 ${
                     isBarrier ? 'scale-110' : ''
                   }`}
                   style={{
                     borderColor: (isBarrier || isProcessing) ? 'var(--amber)' : 'var(--edge)',
                     color: (isBarrier || isProcessing) ? 'var(--amber)' : 'var(--ink-subtle)',
                     boxShadow: isBarrier ? '0 0 15px -4px color-mix(in oklab, var(--amber) 60%, transparent)' : 'none',
                   }}
                 >
                    <Lock className={`h-3.5 w-3.5 ${isBarrier ? 'animate-pulse' : ''}`} />
                 </div>
             </div>

          </div>

          {/* === EXTERNAL SERVICES (Right 4 Cols) === */}
          <div
            onMouseOver={() => setActiveZone('external')}
            className="relative z-10 flex flex-col bg-canvas-alt p-8 transition-colors duration-500 lg:col-span-4"
            style={
              isExternal
                ? { background: 'color-mix(in oklab, var(--amber) 8%, var(--canvas-alt))' }
                : undefined
            }
          >

             {/* Header */}
             <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Globe
                      className="h-3 w-3 transition-colors"
                      style={{ color: isOutboundActive ? 'var(--amber)' : 'color-mix(in oklab, var(--amber) 70%, transparent)' }}
                    />
                    <span
                      className="font-mono text-xs font-bold uppercase tracking-widest transition-colors"
                      style={{ color: isOutboundActive ? 'var(--amber)' : 'color-mix(in oklab, var(--amber) 70%, transparent)' }}
                    >External Services</span>
                </div>
             </div>

             {/* Content */}
             <div className="flex flex-1 flex-col items-center justify-center gap-8">
                 <div className="grid w-full max-w-[280px] grid-cols-2 gap-3">
                    <ServiceBadge label="OpenAI" imgSrc="/openai-logo.png" />
                    <ServiceBadge label="Anthropic" imgSrc="https://cdn.simpleicons.org/anthropic/white" />
                    <ServiceBadge label="Google" imgSrc="https://cdn.simpleicons.org/google" />
                    <ServiceBadge label="Notion" imgSrc="https://cdn.simpleicons.org/notion/white" />
                    <ServiceBadge label="Zapier" imgSrc="https://cdn.simpleicons.org/zapier/FF4F00" />
                    <ServiceBadge label="Linear" imgSrc="https://cdn.simpleicons.org/linear/5E6AD2" />
                 </div>

                 <div
                   className="mt-2 w-full max-w-[200px] border-t border-dashed transition-colors"
                   style={{
                     borderColor: isOutboundActive ? 'color-mix(in oklab, var(--amber) 50%, transparent)' : 'var(--edge-dim)',
                   }}
                 />

                 <div className={`group/tooltip relative transition-all duration-300 ${isBarrier ? 'scale-105' : ''}`}>
                    <p
                      className="inline-block max-w-[250px] cursor-help border-b border-dotted pb-0.5 text-center text-[10px] leading-relaxed transition-colors"
                      style={{
                        color: isOutboundActive ? 'var(--ink)' : 'var(--ink-subtle)',
                        borderColor: isOutboundActive ? 'var(--amber)' : 'color-mix(in oklab, var(--ink-subtle) 50%, transparent)',
                      }}
                    >
                      Outbound: <span
                        className="font-bold transition-colors"
                        style={{ color: isOutboundActive ? 'var(--amber)' : 'var(--ink-muted)' }}
                      >Text-Only Stream</span>
                    </p>

                    {/* Tooltip Pop-up */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-56 -translate-x-1/2 rounded border border-edge-dim bg-surface p-3 text-[10px] leading-relaxed text-ink-muted opacity-0 shadow-xl transition-all duration-300 group-hover/tooltip:opacity-100">
                       <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-edge-dim bg-surface" />
                       <div className="flex gap-2">
                          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                          <span>
                             Only the final, sanitized text prompt is sent. Audio files never leave your device.
                          </span>
                       </div>
                    </div>
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
