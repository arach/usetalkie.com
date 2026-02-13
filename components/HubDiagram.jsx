"use client"
import React, { useState } from 'react'
import {
  Smartphone,
  Watch,
  Laptop,
  Tablet,
  Cloud,
  Workflow,
  FolderOpen,
  MapPin,
  ArrowRight,
  FileText,
  Database,
  HardDrive,
  Shield,
  Lock,
  Cpu,
} from 'lucide-react'

// Talkie logo
const TalkieLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor">
    <g transform="translate(24, 78) scale(0.224)">
      <path d="M 839.627 520 C 847.364 501.125 931.222 235.968 908.513 41 C 902.475 28.238 811.336 108.927 494.396 218.132 C 728.641 121.383 914.67 -6.086 921.429 41 C 943.823 197.002 895.556 350.504 850.24 520 C 738.195 483.002 678.239 386.245 508.018 375.452 C 379.096 366.88 84.649 500 4.31 520 C 1.848 506.006 5.481 467.638 8.177 436.689 C 16.703 338.686 29.063 240.806 48.051 144.284 C 55.209 107.904 59.605 63.569 88.874 41 C 144.668 -2.593 232.968 62.743 292.038 101.562 C 400.313 178.642 693.242 439.827 839.627 520 Z" />
    </g>
  </svg>
)

// App badge with logo
const AppBadge = ({ label, imgSrc, icon: Icon }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800 transition-all cursor-default">
    {imgSrc ? (
      <img src={imgSrc} alt={label} className="w-4 h-4 object-contain" />
    ) : Icon ? (
      <Icon className="w-4 h-4 text-zinc-400" />
    ) : null}
    <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-300">{label}</span>
  </div>
)

// Destination badge for output
const DestinationBadge = ({ label, imgSrc }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800 transition-all cursor-default">
    {imgSrc && <img src={imgSrc} alt={label} className="w-4 h-4 object-contain" />}
    <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-300">{label}</span>
  </div>
)

// Mini icon for feature details
const MiniIcon = ({ icon: Icon, label, imgSrc, comingSoon = false }) => (
  <div className={`flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 ${comingSoon ? 'opacity-50' : ''}`}>
    {imgSrc ? (
      <img src={imgSrc} alt={label} className="w-3 h-3 object-contain" />
    ) : (
      <Icon className="w-3 h-3 text-zinc-500" />
    )}
    <span className="text-[8px] font-bold uppercase tracking-wide text-zinc-500">{label}</span>
    {comingSoon && <span className="text-[6px] font-mono text-zinc-600 uppercase">Soon</span>}
  </div>
)

// Feature cell with dynamic color theming
const FeatureCell = ({ icon: Icon, title, description, activeColor, defaultColor, dimmed, children }) => {
  // Color themes: blue (left), emerald (center), amber (right), or default
  const colorStyles = {
    blue: {
      border: 'border-blue-500/60',
      bg: 'bg-blue-500/10',
      icon: 'text-blue-400',
      shadow: 'shadow-lg shadow-blue-500/10',
    },
    emerald: {
      border: 'border-emerald-500/60',
      bg: 'bg-emerald-500/10',
      icon: 'text-emerald-400',
      shadow: 'shadow-lg shadow-emerald-500/10',
    },
    amber: {
      border: 'border-amber-500/60',
      bg: 'bg-amber-500/10',
      icon: 'text-amber-400',
      shadow: 'shadow-lg shadow-amber-500/10',
    },
    // Subtle "lights on" default states for each color - more visible than off, less than active
    'blue-subtle': {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/[0.06]',
      icon: 'text-blue-500/70',
      shadow: 'shadow-sm shadow-blue-500/5',
    },
    'emerald-subtle': {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/[0.06]',
      icon: 'text-emerald-500/70',
      shadow: 'shadow-sm shadow-emerald-500/5',
    },
    'amber-subtle': {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/[0.06]',
      icon: 'text-amber-500/70',
      shadow: 'shadow-sm shadow-amber-500/5',
    },
    default: {
      border: 'border-zinc-700/50',
      bg: 'bg-zinc-800/30',
      icon: 'text-zinc-500',
      shadow: '',
    },
  }

  // Use active color if set, otherwise use subtle default color, otherwise plain default
  const effectiveColor = activeColor || (defaultColor ? `${defaultColor}-subtle` : 'default')
  const style = colorStyles[effectiveColor] || colorStyles.default
  const opacityClass = dimmed ? 'opacity-30' : 'opacity-100'

  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${style.border} ${style.bg} ${style.shadow} ${opacityClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 transition-all duration-300 ${style.icon}`} />
        <h4 className="text-xs font-bold text-white uppercase tracking-wide">{title}</h4>
      </div>
      <p className="text-[10px] text-zinc-500 leading-relaxed mb-3">{description}</p>
      {children}
    </div>
  )
}

export default function HubDiagram({ sectionHovered = false }) {
  const [activeZone, setActiveZone] = useState(null)

  // Dominant color: the hover initiator sets the color for ALL highlighted elements
  const dominantColorMap = {
    'left': 'blue',
    'center': 'emerald',
    'right': 'amber',
    'provenance': 'blue',
    'sync': 'blue',
    'localFirst': 'emerald',
    'workflow': 'amber',
    'files': 'amber',
  }

  const dominantColor = activeZone ? dominantColorMap[activeZone] || 'emerald' : null

  // Detailed zone mapping for precise highlighting
  // top: which top sections highlight
  // bottom: which bottom features highlight
  const zoneConfig = {
    'left': { top: ['left', 'center'], bottom: [] },  // Dictate Into → highlights self + flow to Talkie
    'center': { top: ['center'], bottom: ['sync', 'localFirst', 'workflow'] },  // Talkie → its connected features
    'right': { top: ['center', 'right'], bottom: [] },  // Orchestrate With → highlights self + flow from Talkie
    'provenance': { top: ['left'], bottom: ['provenance', 'sync'] },  // Whole left continent
    'sync': { top: ['left', 'center'], bottom: ['provenance', 'sync', 'localFirst'] },
    'localFirst': { top: ['center'], bottom: ['sync', 'localFirst', 'workflow'] },
    'workflow': { top: ['center', 'right'], bottom: ['localFirst', 'workflow', 'files'] },
    'files': { top: ['right'], bottom: ['workflow', 'files'] },  // Whole right continent
  }

  const config = activeZone ? zoneConfig[activeZone] || { top: [], bottom: [] } : { top: [], bottom: [] }

  // Derived states for top row sections
  const isLeft = config.top.includes('left')
  const isCenter = config.top.includes('center')
  const isRight = config.top.includes('right')

  const hasActiveZone = activeZone !== null

  // Feature highlight states - explicit from config
  const provenanceHighlighted = config.bottom.includes('provenance')
  const syncHighlighted = config.bottom.includes('sync')
  const localFirstHighlighted = config.bottom.includes('localFirst')
  const workflowHighlighted = config.bottom.includes('workflow')
  const filesHighlighted = config.bottom.includes('files')

  // All colors now use the dominant color from the hover initiator
  const getProvenanceColor = () => provenanceHighlighted ? dominantColor : null
  const getSyncColor = () => syncHighlighted ? dominantColor : null
  const getWorkflowColor = () => workflowHighlighted ? dominantColor : null
  const getFilesColor = () => filesHighlighted ? dominantColor : null

  // Dimmed states - only dim when something specific is hovered
  const provenanceDimmed = hasActiveZone && !provenanceHighlighted
  const syncDimmed = hasActiveZone && !syncHighlighted
  const workflowDimmed = hasActiveZone && !workflowHighlighted
  const filesDimmed = hasActiveZone && !filesHighlighted

  // "Lights on" state - activated when section is hovered but no specific zone is active
  const lightsOn = sectionHovered && !hasActiveZone

  // "Lights on" default backgrounds - visible glow when section hovered but no zone active
  const defaultLeftBg = 'bg-blue-500/[0.05]'
  const defaultCenterBg = 'bg-emerald-500/[0.05]'
  const defaultRightBg = 'bg-amber-500/[0.05]'

  // Zone background colors - dominant color when active, subtle default when lights on, off otherwise
  const bgColorMap = {
    'blue': 'bg-blue-500/5',
    'emerald': 'bg-emerald-500/5',
    'amber': 'bg-amber-500/5',
  }
  const leftBg = isLeft ? (bgColorMap[dominantColor] || '') : (lightsOn ? defaultLeftBg : '')
  const centerBg = isCenter ? (bgColorMap[dominantColor] || '') : (lightsOn ? defaultCenterBg : '')
  const rightBg = isRight ? (bgColorMap[dominantColor] || '') : (lightsOn ? defaultRightBg : '')

  // Zone label colors - dominant color when active, subtle default when lights on, dim otherwise
  const labelColorMap = {
    'blue': 'text-blue-400',
    'emerald': 'text-emerald-400',
    'amber': 'text-amber-400',
  }
  const leftLabelColor = isLeft ? (labelColorMap[dominantColor] || 'text-zinc-500') : (lightsOn ? 'text-blue-500/80' : 'text-zinc-600')
  const centerLabelColor = isCenter ? (labelColorMap[dominantColor] || 'text-emerald-500') : (lightsOn ? 'text-emerald-500/80' : 'text-zinc-600')
  const rightLabelColor = isRight ? (labelColorMap[dominantColor] || 'text-zinc-500') : (lightsOn ? 'text-amber-500/80' : 'text-zinc-600')

  // Arrow colors - dominant color when active, subtle when lights on, dim otherwise
  const arrowColorMap = {
    'blue': 'text-blue-500',
    'emerald': 'text-emerald-500',
    'amber': 'text-amber-500',
  }
  const leftArrowColor = hasActiveZone ? (arrowColorMap[dominantColor] || 'text-zinc-700') : (lightsOn ? 'text-zinc-500' : 'text-zinc-700')
  const rightArrowColor = hasActiveZone ? (arrowColorMap[dominantColor] || 'text-zinc-700') : (lightsOn ? 'text-zinc-500' : 'text-zinc-700')

  // Hub glow and border - dominant color when active, subtle when lights on, dim otherwise
  const hubGlowMap = {
    'blue': 'bg-blue-500/30',
    'emerald': 'bg-emerald-500/30',
    'amber': 'bg-amber-500/30',
  }
  const hubBorderMap = {
    'blue': 'border-blue-500/70 scale-105',
    'emerald': 'border-emerald-500/70 scale-105',
    'amber': 'border-amber-500/70 scale-105',
  }
  const hubGlow = isCenter ? (hubGlowMap[dominantColor] || 'bg-emerald-500/30') : (lightsOn ? 'bg-emerald-500/20' : 'bg-emerald-500/10')
  const hubBorder = isCenter ? (hubBorderMap[dominantColor] || 'border-emerald-500/70 scale-105') : (lightsOn ? 'border-emerald-500/40' : 'border-emerald-500/20')

  // Talkie logo color - matches dominant color when active, emerald otherwise
  const logoColorMap = {
    'blue': 'text-blue-500',
    'emerald': 'text-emerald-500',
    'amber': 'text-amber-500',
  }
  const talkieLogoColor = hasActiveZone ? (logoColorMap[dominantColor] || 'text-emerald-500') : 'text-emerald-500'

  // Zone outer border colors - colored border when zone is highlighted or lights on
  const zoneBorderMap = {
    'blue': 'border-blue-500/40',
    'emerald': 'border-emerald-500/40',
    'amber': 'border-amber-500/40',
  }
  const leftZoneBorder = isLeft ? (zoneBorderMap[dominantColor] || '') : (lightsOn ? 'border-blue-500/20' : '')
  const centerZoneBorder = isCenter ? (zoneBorderMap[dominantColor] || '') : (lightsOn ? 'border-emerald-500/20' : '')
  const rightZoneBorder = isRight ? (zoneBorderMap[dominantColor] || '') : (lightsOn ? 'border-amber-500/20' : '')

  // Bottom row cell borders - match their zone colors
  // Border visibility: full border when highlighted, minimal when not
  const provenanceBorder = provenanceHighlighted ? (zoneBorderMap[dominantColor] || '') : (lightsOn ? 'border-blue-500/20' : 'border-zinc-800/50')
  const syncBorder = syncHighlighted ? (zoneBorderMap[dominantColor] || '') : (lightsOn ? 'border-blue-500/20' : 'border-zinc-800/50')
  const localFirstBorder = localFirstHighlighted ? (zoneBorderMap[dominantColor] || '') : (lightsOn ? 'border-emerald-500/20' : 'border-zinc-800/50')
  const workflowBorder = workflowHighlighted ? (zoneBorderMap[dominantColor] || '') : (lightsOn ? 'border-amber-500/20' : 'border-zinc-800/50')
  const filesBorder = filesHighlighted ? (zoneBorderMap[dominantColor] || '') : (lightsOn ? 'border-amber-500/20' : 'border-zinc-800/50')

  // Conditional border edges - only show internal/top borders when cell is highlighted
  const syncExtraBorders = syncHighlighted ? 'border-t border-l' : 'border-t-0 border-l-0'
  const workflowExtraBorders = workflowHighlighted ? 'border-t border-r' : 'border-t-0 border-r-0'
  const provenanceExtraBorders = provenanceHighlighted ? 'border-r' : 'border-r-0'
  const filesExtraBorders = filesHighlighted ? 'border-l' : 'border-l-0'

  return (
    <div
      className="relative rounded-lg bg-zinc-900/30 overflow-hidden"
      onMouseLeave={() => setActiveZone(null)}
    >
      <div className="absolute inset-0 bg-tactical-grid-dark opacity-10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Row: Apps / Hub / Destinations */}
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr_4fr]">
          {/* LEFT (40%): Dictate Into */}
          <div
            className={`p-6 md:p-8 border rounded-tl-lg transition-all duration-300 cursor-default ${leftBg} ${leftZoneBorder || 'border-zinc-800/50'}`}
            onMouseEnter={() => setActiveZone('left')}
          >
            <p className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${leftLabelColor}`}>
              Dictate Into
            </p>

            {/* Row 1: AI Chat */}
            <div className="flex flex-wrap gap-2 mb-2">
              <AppBadge label="Claude" imgSrc="https://cdn.simpleicons.org/anthropic/white" />
              <AppBadge label="ChatGPT" imgSrc="https://cdn.simpleicons.org/openai/white" />
              <AppBadge label="Gemini" imgSrc="https://cdn.simpleicons.org/google" />
            </div>

            {/* Row 2: AI Dev */}
            <div className="flex flex-wrap gap-2 mb-2">
              <AppBadge label="Cursor" imgSrc="https://cdn.simpleicons.org/cursor/white" />
              <AppBadge label="Windsurf" imgSrc="https://cdn.simpleicons.org/codeium/09B6A2" />
              <AppBadge label="Zed" imgSrc="/icons/zed.webp" />
            </div>

            {/* Row 3: Productivity */}
            <div className="flex flex-wrap gap-2">
              <AppBadge label="Notes" imgSrc="https://cdn.simpleicons.org/apple/white" />
              <AppBadge label="Mail" imgSrc="https://cdn.simpleicons.org/maildotru/white" />
              <AppBadge label="Slack" imgSrc="https://cdn.simpleicons.org/slack" />
              <AppBadge label="VS Code" imgSrc="https://cdn.simpleicons.org/visualstudiocode/007ACC" />
            </div>
          </div>

          {/* CENTER (20%): Talkie Hub */}
          <div
            className={`flex flex-col items-center justify-center py-8 border transition-all duration-300 cursor-default ${centerBg} ${centerZoneBorder || 'border-zinc-800/50'}`}
            onMouseEnter={() => setActiveZone('center')}
          >
            {/* Arrow from left */}
            <div className={`hidden lg:flex items-center gap-2 mb-4 transition-colors duration-300 ${leftArrowColor}`}>
              <ArrowRight className="w-4 h-4" />
              <div className="w-6 h-px bg-current" />
            </div>

            {/* Hub */}
            <div className={`w-24 h-24 rounded-full bg-zinc-900 border-2 flex items-center justify-center transition-all duration-300 ${hubBorder}`}>
              <TalkieLogo className={`w-12 h-12 transition-colors duration-300 ${talkieLogoColor}`} />
            </div>
            <span className={`mt-3 text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${centerLabelColor}`}>Talkie</span>

            {/* Arrow to right */}
            <div className={`hidden lg:flex items-center gap-2 mt-4 transition-colors duration-300 ${rightArrowColor}`}>
              <div className="w-6 h-px bg-current" />
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* RIGHT (40%): Orchestrate With */}
          <div
            className={`p-6 md:p-8 border rounded-tr-lg transition-all duration-300 cursor-default ${rightBg} ${rightZoneBorder || 'border-zinc-800/50'}`}
            onMouseEnter={() => setActiveZone('right')}
          >
            <p className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${rightLabelColor}`}>
              Orchestrate With
            </p>

            {/* Row 1: Productivity */}
            <div className="flex flex-wrap gap-2 mb-2">
              <DestinationBadge label="Notion" imgSrc="https://cdn.simpleicons.org/notion/white" />
              <DestinationBadge label="Obsidian" imgSrc="https://cdn.simpleicons.org/obsidian/7C3AED" />
              <DestinationBadge label="Linear" imgSrc="https://cdn.simpleicons.org/linear/5E6AD2" />
            </div>

            {/* Row 2: Dev */}
            <div className="flex flex-wrap gap-2 mb-2">
              <DestinationBadge label="GitHub" imgSrc="https://cdn.simpleicons.org/github/white" />
              <DestinationBadge label="Terminal" imgSrc="https://cdn.simpleicons.org/gnometerminal/white" />
              <DestinationBadge label="Shortcuts" imgSrc="https://cdn.simpleicons.org/apple/white" />
            </div>

            {/* Row 3: Communication */}
            <div className="flex flex-wrap gap-2">
              <DestinationBadge label="Mail" imgSrc="https://cdn.simpleicons.org/maildotru/white" />
              <DestinationBadge label="Calendar" imgSrc="https://cdn.simpleicons.org/googlecalendar" />
              <DestinationBadge label="Messages" imgSrc="https://cdn.simpleicons.org/imessage/34C759" />
            </div>
          </div>
        </div>

        {/* Bottom Row: 5 Columns (4 features + center sovereignty) */}
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_2fr_1fr_2fr_2fr]">
          {/* Provenance - activates Left + Center */}
          <div
            className={`p-4 border border-t-0 rounded-bl-lg transition-all duration-300 ${provenanceHighlighted ? bgColorMap[dominantColor] : (lightsOn ? defaultLeftBg : '')} ${provenanceBorder} ${provenanceExtraBorders}`}
            onMouseEnter={() => setActiveZone('provenance')}
          >
            <FeatureCell
              icon={MapPin}
              title="Provenance"
              description="Auto-track device, location, and time."
              activeColor={getProvenanceColor()}
              defaultColor={lightsOn ? 'blue' : null}
              dimmed={provenanceDimmed}
            >
              <div className="flex flex-wrap gap-1.5">
                <MiniIcon icon={Smartphone} label="iPhone" />
                <MiniIcon icon={Watch} label="Watch" />
                <MiniIcon icon={Laptop} label="Mac" />
                <MiniIcon icon={Tablet} label="iPad" />
              </div>
            </FeatureCell>
          </div>

          {/* Sync - activates Left + Center */}
          <div
            className={`p-4 border border-r border-b transition-all duration-300 ${syncHighlighted ? bgColorMap[dominantColor] : (lightsOn ? defaultLeftBg : '')} ${syncBorder} ${syncExtraBorders}`}
            onMouseEnter={() => setActiveZone('sync')}
          >
            <FeatureCell
              icon={Cloud}
              title="Sync"
              description="Transcripts sync across all devices."
              activeColor={getSyncColor()}
              defaultColor={lightsOn ? 'blue' : null}
              dimmed={syncDimmed}
            >
              <div className="flex flex-wrap gap-1.5">
                <MiniIcon imgSrc="https://cdn.simpleicons.org/icloud/3693F9" label="iCloud" />
                <MiniIcon imgSrc="https://cdn.simpleicons.org/amazons3/569A31" label="S3" comingSoon />
                <MiniIcon imgSrc="https://cdn.simpleicons.org/dropbox/0061FF" label="Dropbox" comingSoon />
              </div>
            </FeatureCell>
          </div>

          {/* CENTER: Local-First - activates Center only */}
          <div
            className={`hidden lg:flex flex-col items-center justify-center p-4 border border-t-0 transition-all duration-300 ${localFirstHighlighted ? bgColorMap[dominantColor] : (lightsOn ? defaultCenterBg : '')} ${localFirstBorder}`}
            onMouseEnter={() => setActiveZone('localFirst')}
          >
            {(() => {
              const iconBoxMap = {
                'blue': 'border-blue-500/40 bg-blue-500/10',
                'emerald': 'border-emerald-500/40 bg-emerald-500/10',
                'amber': 'border-amber-500/40 bg-amber-500/10',
              }
              const iconBoxClass = localFirstHighlighted
                ? (iconBoxMap[dominantColor] || iconBoxMap.emerald)
                : (lightsOn ? 'border-emerald-500/30 bg-emerald-500/[0.06]' : 'border-zinc-700/50 bg-zinc-800/30')
              const iconClass = localFirstHighlighted
                ? (labelColorMap[dominantColor] || 'text-emerald-400')
                : (lightsOn ? 'text-emerald-500/70' : 'text-zinc-600')

              return (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-2 rounded-lg border transition-all duration-300 ${iconBoxClass}`}>
                      <Shield className={`w-4 h-4 transition-colors duration-300 ${iconClass}`} />
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-300 ${iconBoxClass}`}>
                      <Lock className={`w-4 h-4 transition-colors duration-300 ${iconClass}`} />
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-300 ${iconBoxClass}`}>
                      <Cpu className={`w-4 h-4 transition-colors duration-300 ${iconClass}`} />
                    </div>
                  </div>
                  <p className={`mt-3 text-[8px] font-mono font-bold uppercase tracking-widest text-center transition-colors duration-300 ${iconClass}`}>
                    Local-First
                  </p>
                </>
              )
            })()}
          </div>

          {/* Workflow Builder - activates Center + Right */}
          <div
            className={`p-4 border border-l border-b transition-all duration-300 ${workflowHighlighted ? bgColorMap[dominantColor] : (lightsOn ? defaultRightBg : '')} ${workflowBorder} ${workflowExtraBorders}`}
            onMouseEnter={() => setActiveZone('workflow')}
          >
            <FeatureCell
              icon={Workflow}
              title="Workflow Builder"
              description="Chain voice commands into actions."
              activeColor={getWorkflowColor()}
              defaultColor={lightsOn ? 'amber' : null}
              dimmed={workflowDimmed}
            >
              <div className="flex flex-wrap gap-1.5">
                <MiniIcon icon={Workflow} label="Multi-step" />
                <MiniIcon icon={FolderOpen} label="Templates" />
              </div>
            </FeatureCell>
          </div>

          {/* Everything is a File - activates Right only */}
          <div
            className={`p-4 border border-t-0 border-r border-b rounded-br-lg transition-all duration-300 ${filesHighlighted ? bgColorMap[dominantColor] : (lightsOn ? defaultRightBg : '')} ${filesBorder} ${filesExtraBorders}`}
            onMouseEnter={() => setActiveZone('files')}
          >
            <FeatureCell
              icon={FolderOpen}
              title="Everything is a File"
              description="Scripts read/write directly - no API."
              activeColor={getFilesColor()}
              defaultColor={lightsOn ? 'amber' : null}
              dimmed={filesDimmed}
            >
              <div className="flex flex-wrap gap-1.5">
                <MiniIcon icon={FileText} label="Markdown" />
                <MiniIcon icon={Database} label="JSON" />
                <MiniIcon icon={HardDrive} label="Local" />
              </div>
            </FeatureCell>
          </div>
        </div>
      </div>
    </div>
  )
}
