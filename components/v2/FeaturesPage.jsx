import Link from 'next/link'
import {
  Mic,
  CornerDownLeft,
  Clock,
  Eye,
  Send,
  Signal,
  Workflow,
  Cpu,
  Terminal,
  FileOutput,
  Globe,
  Mail,
  Calendar,
  Copy,
  Bell,
  FolderTree,
  Lock,
  Layers,
  Zap,
} from 'lucide-react'

/**
 * FeaturesPage (v2) — full Talkie feature catalog as oscilloscope panels.
 *
 * Composition:
 *   1. Hero — phosphor eyebrow + headline + supporting copy
 *   2. Capture features — 2x3 channel-strip grid (the core dictation behaviors)
 *   3. Workflow pipeline — four-stage signal flow (capture → transform → route → log)
 *   4. Step type registry — table of available workflow step types
 *   5. Path aliases + smart output — split panel, mono ledger
 *   6. Privacy posture — three-tile spec strip
 *   7. Cross-surface tie-back to /v2/agents + install CTA
 *
 * Pure server component. The donor's animated orchestrator is reframed
 * as a static four-stage pipeline; the screenshots/widget/security
 * sub-components are intentionally not ported here — they live (or will
 * live) on their own surfaces. This page is the catalog index.
 */
const CAPTURE_FEATURES = [
  { icon: Mic,            title: 'Hold-to-Talk',     body: 'Press and hold the hotkey, speak, release. No recording state to babysit.' },
  { icon: CornerDownLeft, title: 'Return to Origin', body: 'Cursor lands back where you left it. Typing flow resumes without a stutter.' },
  { icon: Clock,          title: '48-Hour Echoes',   body: 'Every capture stays searchable for 48 hours. Past words come back fast.' },
  { icon: Eye,            title: 'Minimal HUD',      body: 'A tiny waveform appears when you speak. No modal dialog, no interruption.' },
  { icon: Send,           title: 'Smart Routing',    body: 'Talkie pastes into the focused app. No copy-and-paste step at the end.' },
  { icon: Signal,         title: 'Always Ready',     body: 'Lives in the menu bar. One hotkey away from any app at any time.' },
]

const PIPELINE_STAGES = [
  { n: '01', icon: Mic,        label: 'Capture',   sub: 'CH-01 · INPUT',   desc: 'Hold-to-talk into the focused app.' },
  { n: '02', icon: Cpu,        label: 'Transform', sub: 'CH-02 · LLM',     desc: 'On-device or your model of choice.' },
  { n: '03', icon: Terminal,   label: 'Route',     sub: 'CH-03 · OUTPUT',  desc: 'CLI, file, webhook, or clipboard.' },
  { n: '04', icon: FileOutput, label: 'Log',       sub: 'CH-04 · LEDGER',  desc: 'Local, searchable, replayable.' },
]

const STEP_TYPES = [
  { icon: Cpu,        label: 'LLM',           desc: 'Summarize, extract, restructure.' },
  { icon: Terminal,   label: 'Shell',         desc: 'Run CLI tools (gh, jq, claude).' },
  { icon: FileOutput, label: 'Save to file',  desc: 'Write to disk via path aliases.' },
  { icon: Globe,      label: 'Webhook',       desc: 'POST JSON to any endpoint.' },
  { icon: Mail,       label: 'Email',         desc: 'Send via Mail.app, in your voice.' },
  { icon: Calendar,   label: 'Calendar',      desc: 'Create events from a transcript.' },
  { icon: Copy,       label: 'Clipboard',     desc: 'Copy result to system clipboard.' },
  { icon: Bell,       label: 'Notification',  desc: 'Native macOS alert on completion.' },
]

const ALIASES = [
  { token: '@Notes',    target: '~/Documents/Obsidian/Vault' },
  { token: '@Projects', target: '~/Dev/Current' },
  { token: '@Inbox',    target: '~/Documents/Talkie/Inbox' },
  { token: '@Daily',    target: '~/Documents/Journal/{{DATE}}.md' },
]

const PRIVACY = [
  { icon: Cpu,    title: 'On-device transcription', body: 'Whisper runs locally. Your speech never leaves the Mac unless you route it that way.' },
  { icon: Lock,   title: 'Auditable signal path',   body: 'Every workflow step is visible. You see exactly where a transcript goes.' },
  { icon: Signal, title: 'No telemetry on speech',  body: 'No analytics on transcripts, no account required to use the app.' },
]

export default function FeaturesPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
              style={{ boxShadow: '0 0 6px var(--trace)' }}
            />
            <p
              className="text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · WORKFLOWS · CATALOG
            </p>
          </div>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Voice in. <span className="italic">Anything out.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Talkie is two products in one signal path: a fast dictation surface and a workflow runner that turns speech into drafts, tasks, files, and CLI calls. The chain is local, auditable, and yours.
          </p>
        </div>
      </section>

      {/* CAPTURE FEATURES */}
      <section className="relative border-t border-edge-faint bg-canvas font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · CAPTURE
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Six behaviors. <span className="italic text-ink-muted">One instrument.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              The dictation surface stays the same in every app — same hold-to-talk, same return-to-origin, same fast search of what you said.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {CAPTURE_FEATURES.map((f, i) => (
              <CaptureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW PIPELINE */}
      <section className="relative border-t border-edge-faint bg-canvas-alt font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · PIPELINE
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Capture → Transform → Route → Log.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Every workflow is a four-stage signal chain. Plug or unplug stages. The whole chain runs on your Mac.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
            {PIPELINE_STAGES.map((stage) => (
              <StageCard key={stage.n} stage={stage} />
            ))}
          </div>

          <p className="mt-8 text-center text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
            · auto-paced · local-first · auditable ·
          </p>
        </div>
      </section>

      {/* STEP TYPE REGISTRY */}
      <section className="relative border-t border-edge-faint bg-canvas font-mono">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr,1.2fr] md:gap-12">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.26em] text-trace"
                style={{ textShadow: '0 0 4px var(--trace-glow)' }}
              >
                · STEP TYPES
              </p>
              <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
                The patch bay.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                Eight stage types, mixed and matched. Each one is a small, focused module — chain them with template variables like{' '}
                <code className="rounded-sm border border-edge-subtle bg-surface px-1.5 py-0.5 text-[12px] text-trace">
                  {'{{TRANSCRIPT}}'}
                </code>
                ,{' '}
                <code className="rounded-sm border border-edge-subtle bg-surface px-1.5 py-0.5 text-[12px] text-trace">
                  {'{{TITLE}}'}
                </code>
                , and{' '}
                <code className="rounded-sm border border-edge-subtle bg-surface px-1.5 py-0.5 text-[12px] text-trace">
                  {'{{DATE}}'}
                </code>
                .
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-md border border-edge-dim bg-surface p-3">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">MODELS</p>
                  <p className="mt-1.5 leading-relaxed text-ink-dim">Anthropic · OpenAI · Gemini · Groq · Local MLX</p>
                </div>
                <div className="rounded-md border border-edge-dim bg-surface p-3">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">VARIABLES</p>
                  <p className="mt-1.5 leading-relaxed text-ink-dim">
                    {'{{TRANSCRIPT}}'} · {'{{TITLE}}'} · {'{{DATE}}'}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-edge-dim bg-surface">
              <div className="flex items-center justify-between border-b border-edge-subtle px-4 py-3">
                <span className="text-[9px] uppercase tracking-[0.24em] text-ink-subtle">· REGISTRY</span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-ink-faint">{STEP_TYPES.length} STAGES</span>
              </div>
              <ul>
                {STEP_TYPES.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <li
                      key={step.label}
                      className="flex items-start gap-3 border-b border-edge-subtle px-4 py-3 last:border-b-0"
                    >
                      <div
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-edge"
                        style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                      >
                        <Icon
                          className="h-3.5 w-3.5 text-trace"
                          style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
                            {step.label}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] leading-snug text-ink-muted">{step.desc}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PATH ALIASES + SMART OUTPUT */}
      <section className="relative border-t border-edge-faint bg-canvas-alt font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            {/* Aliases ledger */}
            <div className="rounded-md border border-edge-dim bg-surface p-5 md:p-6">
              <div className="flex items-center gap-2">
                <FolderTree className="h-3.5 w-3.5 text-trace" style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }} />
                <p className="text-[10px] uppercase tracking-[0.26em] text-trace" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
                  · PATH ALIASES
                </p>
              </div>
              <h3 className="mt-3 font-display text-2xl tracking-[-0.01em] text-ink">Shortcuts to where things go.</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                Map a token to a directory or template path. Use the alias inside any "Save to file" step.
              </p>
              <ul className="mt-5 space-y-2">
                {ALIASES.map((a) => (
                  <li
                    key={a.token}
                    className="flex items-center gap-3 rounded-sm border border-edge-subtle bg-canvas px-3 py-2 text-[12px]"
                  >
                    <span
                      className="font-semibold text-trace"
                      style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                    >
                      {a.token}
                    </span>
                    <span className="text-ink-subtle">→</span>
                    <span className="truncate text-ink-muted">{a.target}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Smart output */}
            <div className="rounded-md border border-edge-dim bg-surface p-5 md:p-6">
              <div className="flex items-center gap-2">
                <FileOutput className="h-3.5 w-3.5 text-trace" style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }} />
                <p className="text-[10px] uppercase tracking-[0.26em] text-trace" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
                  · SMART OUTPUT
                </p>
              </div>
              <h3 className="mt-3 font-display text-2xl tracking-[-0.01em] text-ink">Save the result, exactly.</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                Workflows write to disk where you tell them. No mystery folders, no scattered drafts.
              </p>
              <ul className="mt-5 space-y-2.5 text-[13px] text-ink-muted">
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3 w-3 shrink-0 text-trace" />
                  <span>Template filenames with date, time, and title.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3 w-3 shrink-0 text-trace" />
                  <span>Auto-create directories that do not exist yet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3 w-3 shrink-0 text-trace" />
                  <span>Append mode for daily logs and rolling journals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3 w-3 shrink-0 text-trace" />
                  <span>Markdown-first, frontmatter optional.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY POSTURE */}
      <section className="relative border-t border-edge-faint bg-canvas font-mono">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.26em] text-trace"
              style={{ textShadow: '0 0 4px var(--trace-glow)' }}
            >
              · POSTURE
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Local-first, by default.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Privacy is the architecture, not a setting. The signal path is on your Mac unless you route a stage outward.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {PRIVACY.map((p, i) => {
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                      backgroundImage:
                        'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
                        style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                      >
                        <Icon
                          className="h-4 w-4 text-trace"
                          style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
                        />
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
                        SEC-{String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg tracking-[-0.01em] text-ink">{p.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{p.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CROSS-SURFACE TIE-BACK + INSTALL */}
      <section className="relative border-t border-edge-faint bg-canvas-alt font-mono">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            <Link
              href="/v2/agents"
              className="group block rounded-md border border-edge bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-trace"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim"
                />
                <span className="text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  KEEP READING · AGENTS
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                Hand the chain to an agent.
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                The same pipeline, kicked off by voice and run by Claude or your CLI of choice. →
              </p>
            </Link>

            <div className="flex flex-col justify-between rounded-md border border-edge bg-surface p-6">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.26em] text-trace"
                  style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                >
                  · READY TO INSTALL
                </p>
                <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                  Download Talkie for Mac.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  DMG, App Store, or one CLI command.
                </p>
              </div>
              <Link
                href="/download"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                  textShadow: '0 0 6px var(--trace-glow)',
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

function CaptureCard({ feature, index }) {
  const Icon = feature.icon
  const chNum = String(index + 1).padStart(2, '0')
  return (
    <div className="group relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-trace">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
              style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
            >
              <Icon
                className="h-4 w-4 text-trace"
                style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
              />
            </div>
            <h3 className="font-display text-lg tracking-[-0.01em] text-ink">{feature.title}</h3>
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">CH-{chNum}</span>
        </div>
        <div className="mt-4 h-px w-full bg-edge-subtle" />
        <p className="mt-4 flex-1 text-[13px] leading-relaxed text-ink-muted">{feature.body}</p>
      </div>
    </div>
  )
}

function StageCard({ stage }) {
  const Icon = stage.icon
  return (
    <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
          <span>{stage.sub}</span>
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-trace"
            style={{ boxShadow: '0 0 4px var(--trace)' }}
          />
        </div>
        <div
          className="mt-4 font-display text-[11px] tracking-[0.2em] text-trace"
          style={{ textShadow: '0 0 4px var(--trace-glow)' }}
        >
          {stage.n}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-edge"
            style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
          >
            <Icon
              className="h-4 w-4 text-trace"
              style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
            />
          </div>
          <h3 className="font-display text-xl tracking-[-0.01em] text-ink">{stage.label}</h3>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{stage.desc}</p>
      </div>
    </div>
  )
}
