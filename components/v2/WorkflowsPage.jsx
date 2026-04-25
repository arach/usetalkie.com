import Link from 'next/link'
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
// PipelineSchematic — pure SVG patch-bay diagram for /v2/workflows.
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
  const strokeWidth = highlighted ? 1.4 : 1
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
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={highlighted ? { filter: 'drop-shadow(0 0 4px var(--trace-glow))' } : undefined}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - (subLabel ? 4 : 0)}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="10"
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
          fontSize="7"
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
            <line x1={x} y1={py} x2={x - 8} y2={py} stroke={stroke} strokeWidth="0.8" />
            <circle cx={x - 8} cy={py} r="1.5" fill={stroke} />
            <text
              x={x - 14}
              y={py + 3}
              fontFamily="ui-monospace, monospace"
              fontSize="7"
              fill="var(--ink-faint)"
              letterSpacing="0.5"
              textAnchor="end"
            >
              {pin}
            </text>
          </g>
        )
      })}
      {pinsRight.map((pin, i) => {
        const py = y + ((i + 1) * h) / (pinsRight.length + 1)
        return (
          <g key={`r-${pin}-${i}`}>
            <line x1={x + w} y1={py} x2={x + w + 8} y2={py} stroke={stroke} strokeWidth="0.8" />
            <circle cx={x + w + 8} cy={py} r="1.5" fill={stroke} />
            <text
              x={x + w + 14}
              y={py + 3}
              fontFamily="ui-monospace, monospace"
              fontSize="7"
              fill="var(--ink-faint)"
              letterSpacing="0.5"
              textAnchor="start"
            >
              {pin}
            </text>
          </g>
        )
      })}
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
    <div className="relative w-full overflow-hidden rounded-sm border border-edge bg-surface">
      <Graticule opacity={0.5} />

      <div className="relative flex items-center justify-between border-b border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        <span>WF-01 / TALKIE.WORKFLOW.PATCHBAY</span>
        <span>REV A.0</span>
      </div>

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

        {/* CAP trunk */}
        <path d={capTrunk}  fill="none" stroke="var(--trace)" strokeWidth="1.4" style={{ filter: 'drop-shadow(0 0 2px var(--trace-glow))' }} />
        <path d={trunkUp}   fill="none" stroke="var(--trace)" strokeWidth="1.0" strokeOpacity="0.65" markerEnd="url(#wf-arrow)" />
        <path d={trunkMid}  fill="none" stroke="var(--trace)" strokeWidth="1.4" markerEnd="url(#wf-arrow)" style={{ filter: 'drop-shadow(0 0 2px var(--trace-glow))' }} />
        <path d={trunkDown} fill="none" stroke="var(--trace)" strokeWidth="1.0" strokeOpacity="0.65" markerEnd="url(#wf-arrow)" />

        {/* Step → Router */}
        <path d={s1Route} fill="none" stroke="var(--trace)" strokeWidth="1.0" strokeOpacity="0.65" markerEnd="url(#wf-arrow)" />
        <path d={s2Route} fill="none" stroke="var(--trace)" strokeWidth="1.4" markerEnd="url(#wf-arrow)" style={{ filter: 'drop-shadow(0 0 2px var(--trace-glow))' }} />
        <path d={s3Route} fill="none" stroke="var(--trace)" strokeWidth="1.0" strokeOpacity="0.65" markerEnd="url(#wf-arrow)" />

        {/* Router → Sinks */}
        <path d={routeOut1} fill="none" stroke="var(--trace)" strokeWidth="1.0" strokeOpacity="0.65" markerEnd="url(#wf-arrow)" />
        <path d={routeOut2} fill="none" stroke="var(--trace)" strokeWidth="1.4" markerEnd="url(#wf-arrow)" style={{ filter: 'drop-shadow(0 0 2px var(--trace-glow))' }} />
        <path d={routeOut3} fill="none" stroke="var(--trace)" strokeWidth="1.0" strokeOpacity="0.65" markerEnd="url(#wf-arrow)" />

        {/* Net labels */}
        <text x={155} y={capOutY - 8} fontFamily="ui-monospace, monospace" fontSize="8" fill="var(--ink-faint)" letterSpacing="1" textAnchor="middle">
          BUS.IN
        </text>
        <text x={365} y={ROUTE.y - 6} fontFamily="ui-monospace, monospace" fontSize="8" fill="var(--trace)" letterSpacing="1" textAnchor="middle">
          MIX
        </text>
        <text x={545} y={ROUTE.y - 6} fontFamily="ui-monospace, monospace" fontSize="8" fill="var(--ink-faint)" letterSpacing="1" textAnchor="middle">
          SEND
        </text>

        {/* Legend */}
        <g transform="translate(20, 290)">
          <line x1="0" y1="4" x2="20" y2="4" stroke="var(--trace)" strokeWidth="1.4" />
          <text x="26" y="8" fontFamily="ui-monospace, monospace" fontSize="8" fill="var(--ink-faint)" letterSpacing="1">
            solid = active patch · audit-logged · local by default
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
              href="/download"
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
                  className={`relative bg-surface p-5 ${
                    i % 4 !== 3 ? 'lg:border-r lg:border-edge-faint' : ''
                  } ${i % 2 !== 1 ? 'sm:border-r sm:border-edge-faint' : ''} ${
                    i < STEP_TYPES.length - (STEP_TYPES.length % 4 || 4)
                      ? 'border-b border-edge-faint'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-sm border border-edge"
                      style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                    >
                      <Icon
                        className="h-3.5 w-3.5 text-trace"
                        style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                      />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                      {step.label}
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">{step.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Models + variables row */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-edge-dim bg-surface p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· MODELS</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MODELS.map((m) => (
                  <span
                    key={m}
                    className="rounded-sm border border-edge-dim px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim"
                  >
                    {m}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
                Bring your own keys. Local MLX runs without leaving the device.
              </p>
            </div>

            <div className="rounded-sm border border-edge-dim bg-surface p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· VARIABLES</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {VARIABLES.map((v) => (
                  <span
                    key={v}
                    className="rounded-sm border border-edge-dim px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-trace"
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

      {/* ========== SHELL CONSOLE ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 03 / SHELL STEP</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            Your terminal, on the end of a sentence.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Shell steps run real binaries on your machine. There is an executable allowlist and a respectful
            PATH merge — brew, node, bun, Claude CLI all resolve the way they do in your terminal.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Bullet column */}
            <div className="rounded-sm border border-edge bg-surface p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                · WHAT IT GETS YOU
              </p>
              <ul className="mt-5 space-y-3 text-[13px] leading-relaxed text-ink-muted">
                <li className="flex gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace" style={{ boxShadow: '0 0 4px var(--trace)' }} />
                  Executable allowlist for predictable, reviewable runs
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace" style={{ boxShadow: '0 0 4px var(--trace)' }} />
                  Native Claude CLI integration via MCP
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace" style={{ boxShadow: '0 0 4px var(--trace)' }} />
                  Multi-line script templates with variable substitution
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace" style={{ boxShadow: '0 0 4px var(--trace)' }} />
                  Respectful PATH merge — brew, node, bun, claude
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace" style={{ boxShadow: '0 0 4px var(--trace)' }} />
                  Stdout captured back into the workflow as the next variable
                </li>
              </ul>
            </div>

            {/* Console panel */}
            <div className="relative overflow-hidden rounded-sm border border-edge bg-surface">
              <div className="flex items-center justify-between border-b border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-trace" />
                  <span>STEP · SHELL · gh issue create</span>
                </div>
                <span>READY</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-ink-dim">
{`# template: file an issue from a dictated bug report
`}<span style={{ color: 'var(--amber)' }}>{`gh`}</span>{` issue create \\
  --repo `}<span style={{ color: 'var(--trace)' }}>{`"arach/talkie"`}</span>{` \\
  --title `}<span style={{ color: 'var(--trace)' }}>{`"{{TITLE}}"`}</span>{` \\
  --body  `}<span style={{ color: 'var(--trace)' }}>{`"{{TRANSCRIPT}}"`}</span>{` \\
  --label `}<span style={{ color: 'var(--trace)' }}>{`"voice-memo"`}</span>{`

# stdout becomes {{LAST_OUTPUT}} for the next step
`}<span style={{ color: 'var(--ink-faint)' }}>{`# https://github.com/arach/talkie/issues/421`}</span>
              </pre>
              <div className="flex items-center gap-2 border-t border-edge-dim px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                  style={{ boxShadow: '0 0 4px var(--trace)' }}
                />
                <span>EXIT 0 · 412ms · audit:wf-01</span>
                <span className="ml-auto"><Zap className="inline h-3 w-3 text-amber" /> dry-run available</span>
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
            {/* Aliases */}
            <div className="relative overflow-hidden rounded-sm border border-edge bg-surface p-6">
              <Graticule opacity={0.4} />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <FolderTree className="h-3.5 w-3.5 text-trace" style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }} />
                  <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                    · PATH ALIASES
                  </p>
                </div>
                <h3 className="mt-3 font-display text-lg font-normal tracking-[-0.01em] text-ink">
                  Shortcuts for the directories you actually use.
                </h3>
                <ul className="mt-6 space-y-2 font-mono text-[11px]">
                  {ALIASES.map((a) => (
                    <li
                      key={a.token}
                      className="flex items-center gap-3 rounded-sm border border-edge-faint bg-canvas px-3 py-2"
                    >
                      <span className="text-trace" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
                        {a.token}
                      </span>
                      <span className="text-ink-faint">→</span>
                      <span className="text-ink-muted">{a.path}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Smart output */}
            <div className="relative overflow-hidden rounded-sm border border-edge bg-surface p-6">
              <Graticule opacity={0.4} />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <FileOutput className="h-3.5 w-3.5 text-trace" style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }} />
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
                <div
                  className="mt-6 rounded-sm border border-edge-faint bg-canvas px-3 py-2 font-mono text-[11px] text-ink-muted"
                >
                  @Notes/<span className="text-trace">{'{{DATE}}'}</span>-<span className="text-trace">{'{{TITLE}}'}</span>.md
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
                className="relative overflow-hidden rounded-sm border border-edge bg-surface p-6 transition-colors hover:border-trace"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Mic
                      className="h-3.5 w-3.5 text-trace"
                      style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                      {ex.name}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
                    {ex.flow}
                  </span>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{ex.body}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-edge-faint pt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-trace">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                    style={{ boxShadow: '0 0 4px var(--trace)' }}
                  />
                  PATCH READY
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TIE-BACK ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              href="/v2/mac"
              className="group block rounded-md border border-edge bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-trace"
            >
              <div className="flex items-center gap-2.5">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim" />
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  WHERE IT LIVES · CH-A
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                Workflows run on your Mac.
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                The patch bay sits in the menu bar — one hotkey, one transcript, one signal path. Read more →
              </p>
            </Link>

            <div className="flex flex-col justify-between rounded-md border border-edge bg-surface p-6">
              <div>
                <Eyebrow>· READY TO INSTALL</Eyebrow>
                <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                  Download Talkie for Mac.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  DMG, App Store, or a single CLI command.
                </p>
              </div>
              <Link
                href="/download"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  background: 'color-mix(in oklab, var(--trace) 5%, transparent)',
                  textShadow: '0 0 6px var(--trace-glow)',
                  boxShadow: '0 0 18px color-mix(in oklab, var(--trace) 8%, transparent)',
                }}
              >
                GO TO INSTALL <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
