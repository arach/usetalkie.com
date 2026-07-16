import Link from 'next/link'
import JsonLd from './JsonLd'
import DownloadBay from './DownloadBay'
import ExpandableCaptureTile from './ExpandableCaptureTile'
import { WORKFLOWS } from './workflows/workflowsData'
import { Graticule, Eyebrow } from './workflows/atoms'
import {
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
  FileJson,
  ShieldCheck,
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

const VARIABLES = ['{{TRANSCRIPT}}', '{{TITLE}}', '{{DATE}}', '{{TIME}}', '{{SUMMARY}}']

const MODELS = ['Claude', 'OpenAI', 'Gemini', 'Groq', 'Local MLX']

const WORKFLOW_ANSWERS = [
  {
    question: 'What are Talkie workflows?',
    answer:
      'Talkie workflows turn a spoken transcript into ordered steps: LLM cleanup, shell commands, file saves, email drafts, notifications, calendar events, clipboard actions, or webhooks.',
  },
  {
    question: 'Do Talkie workflows have to use cloud AI?',
    answer:
      'No. Capture, files, clipboard, local shell, and Local MLX flows can stay on your Mac. Outside providers such as Claude, OpenAI, Linear, Slack, or webhooks run only when you configure them.',
  },
  {
    question: 'Can agents use Talkie workflows?',
    answer:
      'Yes. The Talkie CLI exposes memos, dictations, searches, workflow runs, transcription, and local inference as structured output that agents can read from the terminal.',
  },
]

const CAPTURE_INPUTS = [
  {
    label: 'Mac hotkey',
    detail: 'hold, speak, release',
    src: '/screenshots/workflow-hotkey-mac-v2.webp',
    alt: 'Talkie global recording shortcut shown as Mac keycaps',
    frame: 'laptop',
  },
  {
    label: 'iPhone capture',
    detail: 'one tap away',
    src: '/screenshots/workflow-capture-iphone-v2.webp',
    alt: 'Talkie recording on iPhone with a live waveform and stop control',
    frame: 'phone',
  },
  {
    label: 'Apple Watch',
    detail: 'tap, record, stop',
    src: '/screenshots/workflow-capture-watch-v2.webp',
    alt: 'Talkie recording on Apple Watch with a waveform and stop control',
    frame: 'watch',
  },
  {
    label: 'Workflow',
    detail: 'voice in, files out',
    src: '/screenshots/workflow-capture-workflow-v2.webp',
    alt: 'Talkie workflow actions including email cleanup, insights, and Obsidian',
    frame: 'laptop',
  },
]

const LOCAL_TOOL_GROUPS = [
  {
    icon: Mail,
    title: 'Apps you already use',
    items: ['Mail', 'Calendar', 'Notes', 'Obsidian'],
  },
  {
    icon: Terminal,
    title: 'Your local shell',
    items: ['@talkie/cli', 'gh', 'jq', 'bun'],
  },
  {
    icon: FileOutput,
    title: 'Files you own',
    items: ['Markdown', 'JSON', 'Journal', 'Inbox'],
  },
]

const OUTSIDE_TOOLS = [
  { label: 'Claude', src: 'https://cdn.simpleicons.org/anthropic/000000' },
  { label: 'OpenAI', src: '/icons/openai.svg' },
  { label: 'Linear', src: 'https://cdn.simpleicons.org/linear/5E6AD2' },
  { label: 'Make', src: 'https://cdn.simpleicons.org/make/000000' },
  { label: 'GitHub', src: 'https://cdn.simpleicons.org/github/000000' },
  { label: 'Zapier', src: 'https://cdn.simpleicons.org/zapier/FF4F00' },
  { label: 'Notion', src: 'https://cdn.simpleicons.org/notion/000000' },
  { label: 'Google', src: 'https://cdn.simpleicons.org/google' },
]

const HERO_READABILITY_SCRIM = {
  background:
    'linear-gradient(90deg, color-mix(in oklab, var(--canvas) 10%, transparent) 0%, color-mix(in oklab, var(--canvas) 6%, transparent) 58%, transparent 100%)',
  backdropFilter: 'blur(22px) saturate(1.04)',
  WebkitBackdropFilter: 'blur(22px) saturate(1.04)',
  maskImage: 'linear-gradient(90deg, black 0%, black 58%, rgba(0,0,0,0.55) 76%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 58%, rgba(0,0,0,0.55) 76%, transparent 100%)',
}

// ---------------------------------------------------------------------------
// Reusable atoms
// ---------------------------------------------------------------------------

function ChoiceKicker({ children }) {
  return (
    <p
      className="font-mono text-[9px] uppercase tracking-[0.24em]"
      style={{ color: 'color-mix(in oklab, var(--choice-accent) 72%, var(--ink-muted) 28%)' }}
    >
      <span
        aria-hidden
        className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
        style={{ background: 'var(--choice-accent)', boxShadow: '0 0 8px var(--choice-accent-glow)' }}
      />
      {children}
    </p>
  )
}

function ChoiceTitle({ children }) {
  return (
    <h3
      className="mt-3 font-display text-2xl font-normal tracking-[-0.01em]"
      style={{
        color: 'color-mix(in oklab, var(--choice-accent) 44%, var(--ink) 56%)',
        textShadow: '0 0 18px var(--choice-accent-glow)',
      }}
    >
      {children}
    </h3>
  )
}

// ---------------------------------------------------------------------------
// ToolChoiceDiagram — a calmer replacement for the old patchbay schematic.
// The message is control: most workflows stay on your Mac and use your tools.
// Outside services only appear when you connect them.
// ---------------------------------------------------------------------------

function ToolChoiceDiagram() {
  return (
    <div
      className="relative overflow-hidden rounded-sm border border-edge p-5 md:p-7"
      style={{
        '--choice-accent': '#2f8f72',
        '--choice-accent-soft': 'rgba(47, 143, 114, 0.10)',
        '--choice-accent-glow': 'rgba(47, 143, 114, 0.22)',
        background:
          'linear-gradient(135deg, color-mix(in oklab, var(--choice-accent) 3%, var(--surface)) 0%, var(--surface) 62%)',
      }}
    >
      <Graticule opacity={0.35} />

      <div className="relative grid gap-5 lg:grid-cols-3 lg:items-stretch">
        <div className="group/panel flex min-h-[430px] flex-col rounded-sm border border-edge-dim bg-surface/75 p-5 transition-colors duration-200 hover:border-[color:var(--choice-accent)] hover:bg-canvas/70 hover:shadow-[0_0_28px_-10px_var(--choice-accent-glow)]">
          <div className="min-h-[132px]">
            <ChoiceKicker>Start</ChoiceKicker>
            <ChoiceTitle>Say the thing.</ChoiceTitle>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              Dictation, quick capture, or a longer memo. Same transcript, same library.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {CAPTURE_INPUTS.map((input) => (
              <ExpandableCaptureTile key={input.label} input={input} />
            ))}
          </div>
        </div>

        <div className="group/panel flex min-h-[430px] flex-col rounded-sm border border-edge-dim bg-surface/75 p-5 transition-colors duration-200 hover:border-[color:var(--choice-accent)] hover:bg-canvas/70 hover:shadow-[0_0_28px_-10px_var(--choice-accent-glow)]">
          <div className="min-h-[132px]">
            <ChoiceKicker>Default</ChoiceKicker>
            <ChoiceTitle>Your Mac. Your tools.</ChoiceTitle>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              Local apps, local files, local commands. This is where most workflows stay.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {LOCAL_TOOL_GROUPS.map((group) => {
              const Icon = group.icon
              return (
                <div key={group.title} className="rounded-sm border border-edge-dim bg-canvas/35 p-3 transition-all duration-200 group-hover/panel:border-edge group-hover/panel:bg-surface">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-ink-subtle transition-colors duration-200 group-hover/panel:text-[color:var(--choice-accent)]" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-dim transition-colors duration-200 group-hover/panel:text-ink">{group.title}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-sm border border-edge-dim px-2 py-1 font-mono text-[9px] text-ink-muted transition-colors duration-200 group-hover/panel:text-ink-dim">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="group/panel flex min-h-[430px] flex-col rounded-sm border border-edge-dim bg-surface/75 p-5 transition-colors duration-200 hover:border-[color:var(--choice-accent)] hover:bg-canvas/70 hover:shadow-[0_0_28px_-10px_var(--choice-accent-glow)]">
          <div className="min-h-[132px]">
            <ChoiceKicker>Optional</ChoiceKicker>
            <ChoiceTitle>Outside calls are your call.</ChoiceTitle>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              Connect a provider or webhook when you want one. Use your account, your keys.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {OUTSIDE_TOOLS.map((tool) => (
              <div
                key={tool.label}
                className="flex min-h-[62px] items-center gap-3 rounded-sm border border-edge-dim bg-canvas/35 px-3 transition-colors duration-200 group-hover/panel:border-[color:var(--choice-accent)] group-hover/panel:bg-surface"
              >
                <img
                  src={tool.src}
                  alt={`${tool.label} logo`}
                  className="h-5 w-5 opacity-55 grayscale transition-all duration-300 group-hover/panel:opacity-100 group-hover/panel:grayscale-0"
                  loading="lazy"
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted transition-colors duration-200 group-hover/panel:text-ink">
                  {tool.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WorkflowsPage() {
  return (
    <>
      <JsonLd data={workflowAnswersSchema()} />
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <Graticule opacity={0.3} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[-4vw] hidden w-[58%] lg:block"
          style={{
            maskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 32%, black 54%, black 100%)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 32%, black 54%, black 100%)',
          }}
        >
          <img
            src="/images/workflows/voice-in-drafts-tasks-files-processed.png"
            alt=""
            className="h-full w-full object-cover object-center opacity-80 mix-blend-multiply"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[76%] lg:block"
          style={HERO_READABILITY_SCRIM}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-[44rem]">
            <Eyebrow>· CH-D / WORKFLOWS · 0.12s LATENCY</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
              Voice in.
              <br />
              <span className="italic">Drafts, tasks, files out.</span>
            </h1>
            <p className="mt-6 max-w-2xl border-l-2 border-trace pl-5 text-[15px] leading-relaxed text-ink-muted">
              Start with something you said. Send it to the app, file, command, or model that should handle it.
              Most of the time that means your Mac and your tools. When it does not, you choose the outside service.
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
              <Link
                href="/workflows/templates"
                className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-all hover:-translate-y-0.5 hover:border-trace hover:text-trace"
              >
                <FileJson className="h-3.5 w-3.5" />
                Browse templates <span>→</span>
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
        </div>
      </section>

      {/* ========== QUICK ANSWERS ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>· 01 / DIRECT ANSWERS</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
                The short version.
              </h2>
            </div>
            <Link
              href="/workflows/templates"
              className="inline-flex items-center gap-2 self-start rounded-sm border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:border-trace hover:text-trace md:self-auto"
            >
              Template library <FileJson className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {WORKFLOW_ANSWERS.map((item) => (
              <div key={item.question} className="rounded-sm border border-edge bg-surface p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-trace" />
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                    {item.question}
                  </h3>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EXAMPLES ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 02 / STARTING POINTS</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            Start with simple workflows.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Small on purpose. Open one for the full recipe, then swap a path and make it yours.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WORKFLOWS.map((ex) => (
              <Link
                key={ex.slug}
                href={`/workflows/${ex.slug}`}
                className="group relative block overflow-hidden rounded-sm border border-edge bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-[0_0_22px_-6px_var(--trace-glow)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-200 group-hover:text-amber">
                    {ex.name}
                  </span>
                  <div
                    className="flex items-center gap-1 text-trace"
                    aria-label={ex.flow}
                  >
                    {ex.icons.map((Icon, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <Icon
                          aria-hidden
                          className="h-3 w-3 transition-transform duration-200 group-hover:scale-110"
                          style={{ filter: 'drop-shadow(0 0 2px var(--trace-glow))' }}
                        />
                        {i < ex.icons.length - 1 && (
                          <span aria-hidden className="text-[10px] text-ink-faint">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">{ex.body}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-edge-faint pt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-trace">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-trace transition-transform duration-200 group-hover:scale-150"
                    style={{ boxShadow: '0 0 4px var(--trace)' }}
                  />
                  {ex.outcome}
                  <span
                    aria-hidden
                    className="ml-auto text-ink-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STEP TYPES ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 03 / STEP LIBRARY</Eyebrow>
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
      <section
        className="relative border-t border-b border-panel-edge-dim"
        style={{ background: 'var(--panel-bg-deep)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, var(--panel-scanline) 3px, var(--panel-scanline) 4px)',
            animation: 'scan-drift 0.8s linear infinite',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
            · 04 / SHELL STEP
          </p>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-screen-ink">
            Your terminal, <span className="italic text-amber">hooked up to your voice.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-screen-ink-muted">
            We put a Ghostty terminal next to the workflow editor, with Talkie prompts, skills, and PATH
            already set up. Ask your memos questions, tune workflows with Claude or Codex, or hand a
            capture to a favorite open-weights model without jumping to another terminal and cd-ing into
            your library directory.
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
                  'Ghostty shell with Talkie prompts and skills preloaded',
                  'Multi-line script templates with variable substitution',
                  'Claude, Codex, and local model CLIs resolve from the same PATH',
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
          <Eyebrow>· 05 / FILE SINKS</Eyebrow>
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
                  Filenames that fill themselves in.
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

      {/* ========== TOOL CHOICE ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 06 / TOOL CHOICE</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            Your tools first. Outside tools when you ask.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Talkie does not need to turn every workflow into a cloud diagram. Keep it local when that is enough.
            Bring in Claude, OpenAI, Linear, Slack, or a webhook only when the workflow actually needs it.
          </p>

          <div className="mt-10">
            <ToolChoiceDiagram />
          </div>
        </div>
      </section>

      {/* ========== DOWNLOAD — focused install footer ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-24">
          <DownloadBay caption="One hotkey. One transcript. Routed to the file, the issue, the journal, or the agent you pointed it at." />
        </div>
      </section>
    </>
  )
}

function workflowAnswersSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://usetalkie.com/workflows/#workflow-answers',
    mainEntity: WORKFLOW_ANSWERS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
