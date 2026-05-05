import Link from 'next/link'
import DownloadBay from './DownloadBay'
import {
  Mic,
  Cpu,
  Terminal,
  FileOutput,
  Globe,
  Mail,
  Calendar,
  Copy,
  Bell,
  FolderTree,
  Workflow,
  Zap,
  Bot,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Content data — re-authored from the donor FeaturesPage.
// ---------------------------------------------------------------------------

const STEP_TYPES = [
  { icon: Cpu,        label: 'LLM',          desc: 'Summaries, extraction, restructuring' },
  { icon: Terminal,   label: 'Shell',        desc: 'Run CLI tools — claude, gh, jq' },
  { icon: FileOutput, label: 'Save to File', desc: 'Write results to disk with aliases' },
  { icon: Globe,      label: 'Webhook',      desc: 'POST JSON or text to any endpoint' },
  { icon: Mail,       label: 'Email',        desc: 'Send results via Mail.app' },
  { icon: Calendar,   label: 'Calendar',     desc: 'Create events from a transcript' },
  { icon: Copy,       label: 'Clipboard',    desc: 'Copy results to system clipboard' },
  { icon: Bell,       label: 'Notification', desc: 'Native macOS alerts' },
]

const ALIASES = [
  { token: '@Notes',     path: '~/Documents/Obsidian/Vault' },
  { token: '@Projects',  path: '~/Dev/Current' },
  { token: '@Inbox',     path: '~/Documents/Talkie/Inbox' },
  { token: '@Journal',   path: '~/Documents/Journal' },
]

const OUTPUT_RULES = [
  'Template filenames with date and time tokens',
  'Auto-create missing directories',
  'Append-mode for logs and rolling journals',
  'Per-workflow custom output paths',
]

const EXAMPLES = [
  {
    name: 'Voice → Obsidian',
    flow: 'Capture · LLM · Save',
    body:
      'Extract the headline and bullet points from a thought, then drop a Markdown file straight into your vault.',
  },
  {
    name: 'Meeting → Tasks',
    flow: 'Capture · LLM · Webhook',
    body:
      'Pull todos out of a recap, structure them as JSON, and POST to Todoist or Linear.',
  },
  {
    name: 'Daily Journal',
    flow: 'Capture · LLM · Append',
    body:
      'Summarize what you said and append a timestamped section to today’s journal file.',
  },
  {
    name: 'GitHub Issue',
    flow: 'Capture · Shell · gh',
    body:
      'Dictate a bug report, reshape it into title and body, then run gh issue create — no browser.',
  },
]

const VARIABLES = ['{{TRANSCRIPT}}', '{{TITLE}}', '{{DATE}}', '{{TIME}}', '{{SUMMARY}}']

const MODELS = ['Claude', 'OpenAI', 'Gemini', 'Groq', 'Local MLX']

// ---------------------------------------------------------------------------
// Reusable atoms (server-only — match SecurityPage.jsx idiom)
// ---------------------------------------------------------------------------

function Graticule({ opacity = 0.3 }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage:
          'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
  )
}

function Eyebrow({ children }) {
  return (
    <p
      className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
      style={{ textShadow: '0 0 4px var(--trace-glow)' }}
    >
      {children}
    </p>
  )
}

// ---------------------------------------------------------------------------
// PipelineSchematic — pure SVG patch-bay diagram for /workflows.
// viewBox 0 0 720 320:
//   CAP   x=20  y=130  w=120 h=70   — capture source
//   S1    x=200 y=50   w=130 h=60   — LLM
//   S2    x=200 y=130  w=130 h=60   — Shell
//   S3    x=200 y=210  w=130 h=60   — Save
//   ROUTE x=388 y=120  w=132 h=80   — router / variables
//   OUT1  x=560 y=50   w=140 h=60   — file sink
//   OUT2  x=560 y=130  w=140 h=60   — webhook sink
//   OUT3  x=560 y=210  w=140 h=60   — notification sink
// ---------------------------------------------------------------------------

function PipelineBlock({
  x,
  y,
  w,
  h,
  label,
  subLabel,
  pinsLeft = [],
  pinsRight = [],
  highlighted = false,
  amber = false,
}) {
  const stroke = highlighted
    ? 'var(--trace)'
    : amber
    ? 'var(--amber)'
    : 'var(--ink-muted)'
  // Thinner strokes for a cleaner schematic look
  const strokeWidth = highlighted ? 0.85 : 0.55
  const fill = highlighted
    ? 'var(--trace-faint)'
    : amber
    ? 'color-mix(in oklab, var(--amber) 6%, transparent)'
    : 'transparent'
  const labelFill = highlighted
    ? 'var(--trace)'
    : amber
    ? 'var(--amber)'
    : 'var(--ink)'

  return (
    <g className="wf-block">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        rx="2"
        ry="2"
        style={highlighted ? { filter: 'drop-shadow(0 0 4px var(--trace-glow))' } : undefined}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - (subLabel ? 5 : 0)}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="10"
        fontWeight="600"
        fill={labelFill}
        textAnchor="middle"
        letterSpacing="1"
        style={highlighted ? { filter: 'drop-shadow(0 0 3px var(--trace-glow))' } : undefined}
      >
        {label}
      </text>
      {subLabel && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          fontFamily="ui-monospace, monospace"
          fontSize="6.5"
          fill="var(--ink-faint)"
          textAnchor="middle"
          letterSpacing="1"
        >
          {subLabel}
        </text>
      )}
      {pinsLeft.map((pin, i) => {
        const py = y + ((i + 1) * h) / (pinsLeft.length + 1)
        return (
          <g key={`l-${pin}-${i}`}>
            <line x1={x} y1={py} x2={x - 6} y2={py} stroke={stroke} strokeWidth="0.5" strokeLinecap="round" />
            <circle cx={x - 6} cy={py} r="1.1" fill={stroke} />
          </g>
        )
      })}
      {pinsRight.map((pin, i) => {
        const py = y + ((i + 1) * h) / (pinsRight.length + 1)
        return (
          <g key={`r-${pin}-${i}`}>
            <line x1={x + w} y1={py} x2={x + w + 6} y2={py} stroke={stroke} strokeWidth="0.5" strokeLinecap="round" />
            <circle cx={x + w + 6} cy={py} r="1.1" fill={stroke} />
          </g>
        )
      })}
    </g>
  )
}

// NetTag — small inline label that sits ON a wire with a fill-matched
// background rect so it visually breaks the line. Like real schematic
// wire tags. Resolves the "text overlapping lines" feedback.
function NetTag({ x, y, label, color = 'var(--ink-faint)', fill = 'var(--surface)' }) {
  // Approximate width based on character count; SVG measure-text is tricky
  const w = Math.max(label.length * 5 + 8, 18)
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 5}
        width={w}
        height={10}
        fill={fill}
        rx="1.5"
        ry="1.5"
      />
      <text
        x={x}
        y={y + 3}
        fontFamily="ui-monospace, monospace"
        fontSize="7"
        fill={color}
        textAnchor="middle"
        letterSpacing="1"
      >
        {label}
      </text>
    </g>
  )
}

function PipelineSchematic() {
  const CAP   = { x: 20,  y: 130, w: 120, h: 70 }
  const S1    = { x: 200, y: 50,  w: 130, h: 60 }
  const S2    = { x: 200, y: 130, w: 130, h: 60 }
  const S3    = { x: 200, y: 210, w: 130, h: 60 }
  const ROUTE = { x: 388, y: 120, w: 132, h: 80 }
  const OUT1  = { x: 560, y: 50,  w: 140, h: 60 }
  const OUT2  = { x: 560, y: 130, w: 140, h: 60 }
  const OUT3  = { x: 560, y: 210, w: 140, h: 60 }

  // Trunk leaving CAP
  const capOutY = CAP.y + CAP.h / 2
  const trunkX = 170
  // S1/S2/S3 inputs
  const s1InY = S1.y + S1.h / 2
  const s2InY = S2.y + S2.h / 2
  const s3InY = S3.y + S3.h / 2
  // Router
  const routeInTopY = ROUTE.y + ROUTE.h * 0.25
  const routeInMidY = ROUTE.y + ROUTE.h * 0.5
  const routeInBotY = ROUTE.y + ROUTE.h * 0.75
  const routeOutTopY = ROUTE.y + ROUTE.h * 0.25
  const routeOutMidY = ROUTE.y + ROUTE.h * 0.5
  const routeOutBotY = ROUTE.y + ROUTE.h * 0.75
  // Sinks
  const out1InY = OUT1.y + OUT1.h / 2
  const out2InY = OUT2.y + OUT2.h / 2
  const out3InY = OUT3.y + OUT3.h / 2

  // Bus from CAP to vertical trunk, then to each step
  const capTrunk = `M ${CAP.x + CAP.w} ${capOutY} L ${trunkX} ${capOutY}`
  const trunkUp = `M ${trunkX} ${capOutY} L ${trunkX} ${s1InY} L ${S1.x} ${s1InY}`
  const trunkMid = `M ${trunkX} ${capOutY} L ${S2.x} ${s2InY}`
  const trunkDown = `M ${trunkX} ${capOutY} L ${trunkX} ${s3InY} L ${S3.x} ${s3InY}`

  // Step → router (each step joins the router on a different pin)
  const s1Route = `M ${S1.x + S1.w} ${s1InY} L 360 ${s1InY} L 360 ${routeInTopY} L ${ROUTE.x} ${routeInTopY}`
  const s2Route = `M ${S2.x + S2.w} ${s2InY} L ${ROUTE.x} ${routeInMidY}`
  const s3Route = `M ${S3.x + S3.w} ${s3InY} L 360 ${s3InY} L 360 ${routeInBotY} L ${ROUTE.x} ${routeInBotY}`

  // Router → sinks
  const routeOut1 = `M ${ROUTE.x + ROUTE.w} ${routeOutTopY} L 540 ${routeOutTopY} L 540 ${out1InY} L ${OUT1.x} ${out1InY}`
  const routeOut2 = `M ${ROUTE.x + ROUTE.w} ${routeOutMidY} L ${OUT2.x} ${out2InY}`
  const routeOut3 = `M ${ROUTE.x + ROUTE.w} ${routeOutBotY} L 540 ${routeOutBotY} L 540 ${out3InY} L ${OUT3.x} ${out3InY}`

  return (
    <div className="group relative w-full overflow-hidden rounded-sm border border-edge bg-surface transition-all duration-200 hover:border-amber/50 hover:shadow-[0_0_28px_-8px_var(--trace-glow)]">
      <Graticule opacity={0.5} />

      <div className="relative flex items-center justify-between border-b border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint transition-colors duration-200 group-hover:text-ink-muted">
        <span>WF-01 / TALKIE.WORKFLOW.PATCHBAY</span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-trace"
            style={{ boxShadow: '0 0 4px var(--trace-glow)', animation: 'wf-rev-pulse 2.4s ease-in-out infinite' }}
          />
          REV A.0
        </span>
      </div>
      <style>{`
        @keyframes wf-rev-pulse {
          0%, 100% { opacity: 0.55; box-shadow: 0 0 3px var(--trace-glow); }
          50%      { opacity: 1;    box-shadow: 0 0 7px var(--trace-glow); }
        }
      `}</style>

      <svg
        viewBox="0 0 720 320"
        className="relative block w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ height: 'auto' }}
      >
        <defs>
          <marker
            id="wf-arrow"
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

        {/* Blocks */}
        <PipelineBlock
          x={CAP.x} y={CAP.y} w={CAP.w} h={CAP.h}
          label="CAP · VOICE"
          subLabel="hotkey or widget"
          pinsRight={['SIG']}
          highlighted
        />
        <PipelineBlock
          x={S1.x} y={S1.y} w={S1.w} h={S1.h}
          label="S1 · LLM"
          subLabel="shape · extract · summarize"
          pinsLeft={['IN']}
          pinsRight={['OUT']}
        />
        <PipelineBlock
          x={S2.x} y={S2.y} w={S2.w} h={S2.h}
          label="S2 · SHELL"
          subLabel="claude · gh · jq · curl"
          pinsLeft={['IN']}
          pinsRight={['OUT']}
          highlighted
        />
        <PipelineBlock
          x={S3.x} y={S3.y} w={S3.w} h={S3.h}
          label="S3 · SAVE"
          subLabel="aliased paths · append"
          pinsLeft={['IN']}
          pinsRight={['OUT']}
        />
        <PipelineBlock
          x={ROUTE.x} y={ROUTE.y} w={ROUTE.w} h={ROUTE.h}
          label="ROUTER"
          subLabel="vars · branches · audit"
          pinsLeft={['A', 'B', 'C']}
          pinsRight={['1', '2', '3']}
          highlighted
        />
        <PipelineBlock
          x={OUT1.x} y={OUT1.y} w={OUT1.w} h={OUT1.h}
          label="OUT · FILE"
          subLabel="vault · journal · inbox"
          pinsLeft={['IN']}
        />
        <PipelineBlock
          x={OUT2.x} y={OUT2.y} w={OUT2.w} h={OUT2.h}
          label="OUT · WEBHOOK"
          subLabel="todoist · linear · slack"
          pinsLeft={['IN']}
        />
        <PipelineBlock
          x={OUT3.x} y={OUT3.y} w={OUT3.w} h={OUT3.h}
          label="OUT · NOTIFY"
          subLabel="mail · calendar · alert"
          pinsLeft={['IN']}
        />

        {/* Wire group — thin strokes, rounded joins, single accent.
            Active path (capOutY → S2 → middle of router → OUT2) at full
            opacity; secondary paths at 0.5 opacity. */}
        <g fill="none" stroke="var(--trace)" strokeLinecap="round" strokeLinejoin="round">
          {/* CAP trunk */}
          <path d={capTrunk}  strokeWidth="0.9" style={{ filter: 'drop-shadow(0 0 1.5px var(--trace-glow))' }} />
          <path d={trunkUp}   strokeWidth="0.65" strokeOpacity="0.5" markerEnd="url(#wf-arrow)" />
          <path d={trunkMid}  strokeWidth="0.9" markerEnd="url(#wf-arrow)" style={{ filter: 'drop-shadow(0 0 1.5px var(--trace-glow))' }} />
          <path d={trunkDown} strokeWidth="0.65" strokeOpacity="0.5" markerEnd="url(#wf-arrow)" />

          {/* Step → Router */}
          <path d={s1Route} strokeWidth="0.65" strokeOpacity="0.5" markerEnd="url(#wf-arrow)" />
          <path d={s2Route} strokeWidth="0.9" markerEnd="url(#wf-arrow)" style={{ filter: 'drop-shadow(0 0 1.5px var(--trace-glow))' }} />
          <path d={s3Route} strokeWidth="0.65" strokeOpacity="0.5" markerEnd="url(#wf-arrow)" />

          {/* Router → Sinks */}
          <path d={routeOut1} strokeWidth="0.65" strokeOpacity="0.5" markerEnd="url(#wf-arrow)" />
          <path d={routeOut2} strokeWidth="0.9" markerEnd="url(#wf-arrow)" style={{ filter: 'drop-shadow(0 0 1.5px var(--trace-glow))' }} />
          <path d={routeOut3} strokeWidth="0.65" strokeOpacity="0.5" markerEnd="url(#wf-arrow)" />
        </g>

        {/* Net tags — boxed labels that sit ON the wire (fill matches
            surface bg so the wire visually breaks around the label).
            Resolves text-overlapping-wires issue. */}
        <NetTag x={155} y={capOutY} label="BUS.IN" />
        <NetTag x={365} y={routeInMidY} label="MIX" color="var(--trace)" />
        <NetTag x={545} y={routeOutMidY} label="SEND" />

        {/* Legend */}
        <g transform="translate(20, 290)">
          <line x1="0" y1="4" x2="20" y2="4" stroke="var(--trace)" strokeWidth="0.9" strokeLinecap="round" />
          <text x="26" y="7" fontFamily="ui-monospace, monospace" fontSize="7.5" fill="var(--ink-faint)" letterSpacing="1">
            solid = active patch
          </text>
          <line x1="160" y1="4" x2="180" y2="4" stroke="var(--trace)" strokeWidth="0.65" strokeOpacity="0.5" strokeLinecap="round" />
          <text x="186" y="7" fontFamily="ui-monospace, monospace" fontSize="7.5" fill="var(--ink-faint)" letterSpacing="1">
            faded = available
          </text>
          <text x="290" y="7" fontFamily="ui-monospace, monospace" fontSize="7.5" fill="var(--ink-faint)" letterSpacing="1">
            · audit-logged · local by default
          </text>
        </g>
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WorkflowsPage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <Graticule opacity={0.3} />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· CH-D / WORKFLOWS · 0.12s LATENCY</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Voice in.
            <br />
            <span className="italic">Drafts, tasks, files out.</span>
          </h1>
          <p className="mt-6 max-w-2xl border-l-2 border-trace pl-5 text-[15px] leading-relaxed text-ink-muted">
            A workflow is a patch cable. One end is the thought you just spoke. The other end is wherever it
            needs to land — a Markdown note, a GitHub issue, a Linear ticket, a calendar event. Everything
            in between is yours to wire.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 font-mono">
            <Link
              href="/downloads"
              className="inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
              style={{
                background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                textShadow: '0 0 6px var(--trace-glow)',
              }}
            >
              <Bot className="h-3.5 w-3.5" />
              DOWNLOAD FOR MAC <span>→</span>
            </Link>
            <span className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              <Workflow className="h-3.5 w-3.5 text-trace" />
              macOS 26+ · Workflow Editor
            </span>
            <span className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              <Terminal className="h-3.5 w-3.5 text-amber" />
              Claude CLI · Shell Steps
            </span>
          </div>
        </div>
      </section>

      {/* ========== PIPELINE SCHEMATIC ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 01 / SIGNAL FLOW</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            From capture to sink, on a patch bay.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Capture feeds a bus. Steps tap the bus to shape, transform, or persist. The router holds your
            variables and branches and writes an audit line for every send. Sinks are the surfaces you
            already work in.
          </p>

          <div className="mt-10">
            <PipelineSchematic />
          </div>
        </div>
      </section>

      {/* ========== STEP TYPES ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 02 / STEP LIBRARY</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            Eight step types. Stack them in any order.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Every step is composable. Chain an LLM into a shell command into a save. Branch the router by
            keyword. Tee the same transcript into a journal and a webhook in one pass.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-0 overflow-hidden rounded-sm border border-edge sm:grid-cols-2 lg:grid-cols-4">
            {STEP_TYPES.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.label}
                  className={`group relative bg-surface p-5 transition-all duration-200 hover:bg-canvas-alt ${
                    i % 4 !== 3 ? 'lg:border-r lg:border-edge-faint' : ''
                  } ${i % 2 !== 1 ? 'sm:border-r sm:border-edge-faint' : ''} ${
                    i < STEP_TYPES.length - (STEP_TYPES.length % 4 || 4)
                      ? 'border-b border-edge-faint'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-sm border border-edge transition-all duration-200 group-hover:scale-110 group-hover:border-amber/60"
                      style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                    >
                      <Icon
                        className="h-3.5 w-3.5 text-trace transition-all duration-200 group-hover:text-amber"
                        style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                      />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-200 group-hover:text-amber">
                      {step.label}
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Models + variables row */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-edge-dim bg-surface p-5 transition-all duration-200 hover:border-amber/40">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· MODELS</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MODELS.map((m) => (
                  <span
                    key={m}
                    className="rounded-sm border border-edge-dim px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:text-amber"
                  >
                    {m}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
                Bring your own keys. Local MLX runs without leaving the device.
              </p>
            </div>

            <div className="rounded-sm border border-edge-dim bg-surface p-5 transition-all duration-200 hover:border-trace/40">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· VARIABLES</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {VARIABLES.map((v) => (
                  <span
                    key={v}
                    className="rounded-sm border border-edge-dim px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-trace transition-all duration-200 hover:-translate-y-0.5 hover:border-trace/50"
                    style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                  >
                    {v}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
                Substitute anywhere — prompt bodies, shell args, file paths, request bodies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SHELL CONSOLE — dark scope-bay beat ==========
           Flips to dark panel-bg-deep so the syntax-highlighted code
           reads as a real terminal. Code colors brighten to neon-grade
           cyan / emerald / amber / rose for visual pop the cream
           background couldn't carry. */}
      <section className="relative border-t border-b border-panel-edge-dim bg-panel-bg-deep">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, var(--panel-scanline) 3px, var(--panel-scanline) 4px)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
            · 03 / SHELL STEP
          </p>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-screen-ink">
            Your terminal, <span className="italic text-amber">on the end of a sentence.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-screen-ink-muted">
            Shell steps run real binaries on your machine. There is an executable allowlist and a respectful
            PATH merge — brew, node, bun, Claude CLI all resolve the way they do in your terminal.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Bullet column — single accent (amber) for unity, like @notes/@projects */}
            <div className="rounded-md border border-screen-edge bg-screen-bg p-6 transition-all duration-200 hover:border-amber/40">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-amber">
                · WHAT IT GETS YOU
              </p>
              <ul className="mt-5 space-y-3 text-[13px] leading-relaxed text-screen-ink-dim">
                {[
                  'Executable allowlist for predictable, reviewable runs',
                  'Native Claude CLI integration via MCP',
                  'Multi-line script templates with variable substitution',
                  'Respectful PATH merge — brew, node, bun, claude',
                  'Stdout captured back into the workflow as the next variable',
                ].map((label) => (
                  <li key={label} className="flex gap-3">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber" style={{ boxShadow: '0 0 6px var(--trace-glow)' }} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Console panel — single-accent syntax highlighting (amber for
                keywords/strings/flags; dim ink for body; faint ink for
                comments). Two colors max, no rainbow. */}
            <div
              className="relative overflow-hidden rounded-md border border-screen-edge bg-screen-bg-deep transition-all duration-200 hover:border-screen-trace/60"
              style={{
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.55), 0 0 24px -8px var(--screen-trace-glow)',
              }}
            >
              {/* Header — neutral mac-style window chrome */}
              <div className="flex items-center justify-between border-b border-screen-edge-dim px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-screen-ink-faint">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-screen-ink-faint/40" />
                  <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-screen-ink-faint/40" />
                  <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-screen-ink-faint/40" />
                  <Terminal className="ml-2 h-3 w-3 text-amber" />
                  <span className="text-screen-ink-muted">step · shell · gh issue create</span>
                </div>
                <span className="text-amber">READY</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-screen-ink-dim">
{`# template: file an issue from a dictated bug report
`}<span className="text-amber">{`gh`}</span>{` issue create \\
  --repo  `}<span className="text-amber">{`"arach/talkie"`}</span>{` \\
  --title `}<span className="text-amber">{`"`}</span><span className="italic text-amber">{`{{TITLE}}`}</span><span className="text-amber">{`"`}</span>{` \\
  --body  `}<span className="text-amber">{`"`}</span><span className="italic text-amber">{`{{TRANSCRIPT}}`}</span><span className="text-amber">{`"`}</span>{` \\
  --label `}<span className="text-amber">{`"voice-memo"`}</span>{`

`}<span className="text-screen-ink-faint">{`# stdout becomes `}</span><span className="italic text-amber">{`{{LAST_OUTPUT}}`}</span><span className="text-screen-ink-faint">{` for the next step
# https://github.com/arach/talkie/issues/421`}</span>
              </pre>
              <div className="flex items-center gap-2 border-t border-screen-edge-dim px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-screen-ink-faint">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-amber"
                  style={{ boxShadow: '0 0 6px var(--trace-glow)' }}
                />
                <span className="text-amber">EXIT 0</span>
                <span>·</span>
                <span>412ms</span>
                <span>·</span>
                <span>audit:wf-01</span>
                <span className="ml-auto flex items-center gap-1 text-amber">
                  <Zap className="h-3 w-3" /> dry-run available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ALIASES + OUTPUT ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 04 / FILE SINKS</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            Land it exactly where you want it.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Aliases — polished syntax-highlighted token chips */}
            <div className="group relative overflow-hidden rounded-sm border border-edge bg-surface p-6 transition-all duration-200 hover:border-amber/50">
              <Graticule opacity={0.4} />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <FolderTree className="h-3.5 w-3.5 text-trace transition-transform duration-200 group-hover:scale-110" style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }} />
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · PATH ALIASES
                  </p>
                </div>
                <h3 className="mt-3 font-display text-lg font-normal tracking-[-0.01em] text-ink">
                  Shortcuts for the directories you actually use.
                </h3>
                <ul className="mt-6 space-y-1 font-mono text-[11px]">
                  {ALIASES.map((a) => (
                    <li
                      key={a.token}
                      className="group/row flex items-center gap-3 rounded-sm border border-transparent px-3 py-2 transition-all duration-200 hover:border-amber/40 hover:bg-canvas/40"
                    >
                      {/* Bold amber — no border, the boldness + amber phosphor IS the highlight */}
                      <span
                        className="font-bold text-amber"
                        style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                      >
                        {a.token}
                      </span>
                      <span className="text-ink-faint transition-all duration-200 group-hover/row:text-amber group-hover/row:translate-x-0.5">→</span>
                      <span className="text-ink-muted transition-colors duration-200 group-hover/row:text-ink-dim">{a.path}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Smart output */}
            <div className="group relative overflow-hidden rounded-sm border border-edge bg-surface p-6 transition-all duration-200 hover:border-amber/50">
              <Graticule opacity={0.4} />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <FileOutput className="h-3.5 w-3.5 text-trace transition-transform duration-200 group-hover:scale-110" style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }} />
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · SMART OUTPUT
                  </p>
                </div>
                <h3 className="mt-3 font-display text-lg font-normal tracking-[-0.01em] text-ink">
                  Filenames that compose themselves.
                </h3>
                <ul className="mt-6 space-y-3">
                  {OUTPUT_RULES.map((rule) => (
                    <li key={rule} className="flex items-start gap-3">
                      <Zap
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trace"
                        style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                      />
                      <span className="text-[13px] leading-snug text-ink-muted">{rule}</span>
                    </li>
                  ))}
                </ul>
                {/* Filename composition example — borderless inline block
                    so it integrates with the parent surface; alias chip
                    is the only visual frame. Template vars get italic +
                    dotted-underline to read as "interpolated value"
                    while staying full-amber for legibility on cream. */}
                <div className="mt-6 font-mono text-[12px] text-ink-dim leading-loose">
                  <span className="font-bold text-amber" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
                    @Notes
                  </span>
                  <span className="text-ink-faint">/</span>
                  <span className="italic text-amber">{'{{DATE}}'}</span>
                  <span className="text-ink-faint">-</span>
                  <span className="italic text-amber">{'{{TITLE}}'}</span>
                  <span className="text-ink-faint">.md</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== EXAMPLE WORKFLOWS ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 05 / SAMPLE PATCHES</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            Four workflows to wire on day one.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Each one ships as a starting template. Open the editor, swap the model or the path, and it is
            yours.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <div
                key={ex.name}
                className="group relative overflow-hidden rounded-sm border border-edge bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Mic
                      className="h-3.5 w-3.5 text-trace transition-transform duration-200 group-hover:scale-110"
                      style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-200 group-hover:text-amber">
                      {ex.name}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
                    {ex.flow}
                  </span>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">{ex.body}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-edge-faint pt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-trace">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-trace transition-transform duration-200 group-hover:scale-150"
                    style={{ boxShadow: '0 0 4px var(--trace)' }}
                  />
                  PATCH READY
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== DOWNLOAD — focused install footer ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-24">
          <DownloadBay caption="One hotkey. One transcript. Routed to the file, the issue, the journal, the agent — anywhere your patch bay sends it." />
        </div>
      </section>
    </>
  )
}
