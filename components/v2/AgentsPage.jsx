import Link from 'next/link'
import {
  Mic,
  Bot,
  RefreshCw,
  Terminal,
  Code,
  GitBranch,
  Layers,
  Workflow,
  Hash,
  Zap,
  ArrowRight,
  Check,
  Cpu,
} from 'lucide-react'

/**
 * AgentsPage (v2) — Talkie for Agents.
 *
 * Distinct from FeaturesPage: this page is about voice-initiated AGENT
 * loops (Talkie → Claude → Feedback) rather than the dictation catalog.
 *
 * Composition:
 *   1. Hero — agents-flavored eyebrow + headline
 *   2. The loop — three-stage capture/agent/feedback diagram (static)
 *   3. Recipes — 2x2 grid of voice-initiated agent flows
 *   4. Terminal exemplar — static "talk → gh issue create" sample
 *   5. Trigger primitives — what voice can kick off
 *   6. Install + tie-back to /v2/features
 *
 * Pure server component. The donor's animated activeStep is replaced
 * with a CSS-only chase glow so the rhythm reads without a client hook.
 */
const RECIPES = [
  {
    code: 'AGT-01',
    icon: Hash,
    title: 'Voice → GitHub Issue',
    line: '"Bug: file picker hangs on big folders"',
    out: 'gh issue create — body, labels, repo inferred',
  },
  {
    code: 'AGT-02',
    icon: Code,
    title: 'Voice → Claude Code',
    line: '"Refactor the auth module to use the new client"',
    out: 'Claude opens a branch, drafts the diff, waits for review',
  },
  {
    code: 'AGT-03',
    icon: Workflow,
    title: 'Voice → Daily Standup',
    line: '"Yesterday I shipped the migration, today the dashboard…"',
    out: 'Markdown digest appended to the team channel',
  },
  {
    code: 'AGT-04',
    icon: GitBranch,
    title: 'Voice → PR Review Notes',
    line: '"Comment on PR 412: rename the helper, swap the import"',
    out: 'Inline review comments posted via gh pr review',
  },
]

const TRIGGERS = [
  { icon: Mic,      label: 'Hotkey burst', desc: 'Hold-to-talk fires the workflow without leaving the focused app.' },
  { icon: Hash,     label: 'Slash phrase', desc: 'Voice prefixes like "issue", "review", "summary" route to specific agents.' },
  { icon: Layers,   label: 'Context bind', desc: 'Frontmost app + current file are passed in as workflow variables.' },
  { icon: Cpu,      label: 'Local compute', desc: 'Transcription on-device. Routing to Claude or local MLX is a per-stage choice.' },
]

export default function AgentsPage() {
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
              · TALKIE FOR AGENTS · BETA
            </p>
          </div>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
            Voice-initiated <span className="italic">agents.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Talkie hands the transcript to an agent and stays on the line. Speak the intent, the agent runs the steps, the result lands back in your editor. The whole loop is auditable and runs from your Mac.
          </p>
        </div>
      </section>

      {/* THE LOOP */}
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
              · THE LOOP
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Capture → Agent → Feedback.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Three nodes, one closed loop. The agent is whichever model you point it at — Claude Code, a local MLX model, or your own CLI binary.
            </p>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-md border border-edge bg-surface p-6 md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                  style={{ boxShadow: '0 0 4px var(--trace)' }}
                />
                <span>· LOOP · LIVE</span>
              </div>
              <div className="flex items-center gap-2 text-ink-faint">
                <Zap className="h-3 w-3 text-trace" />
                <span>≈ 120ms HANDOFF</span>
              </div>
            </div>

            {/* Mobile: vertical */}
            <div className="relative mt-8 flex flex-col gap-4 md:hidden">
              <LoopNode index={0} icon={Mic}     label="Talkie Capture" sub="CH-01 · INPUT" />
              <LoopArrow vertical />
              <LoopNode index={1} icon={Bot}     label="Agent"          sub="CH-02 · CLAUDE" />
              <LoopArrow vertical />
              <LoopNode index={2} icon={RefreshCw} label="Feedback"     sub="CH-03 · LEDGER" />
            </div>

            {/* Desktop: horizontal */}
            <div className="relative mt-8 hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-4">
              <LoopNode index={0} icon={Mic}       label="Talkie Capture" sub="CH-01 · INPUT" />
              <LoopArrow />
              <LoopNode index={1} icon={Bot}       label="Agent"          sub="CH-02 · CLAUDE" />
              <LoopArrow />
              <LoopNode index={2} icon={RefreshCw} label="Feedback"       sub="CH-03 · LEDGER" />
            </div>

            <p className="relative mt-8 text-center text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
              · auto-paced loop · accelerates collaboration with the agent ·
            </p>
          </div>
        </div>

        {/* CSS-only chase glow — no client state */}
        <style>{`
          @keyframes osc-loop-chase {
            0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
            40%,60%  { box-shadow: 0 0 24px 0 var(--trace-glow); }
          }
          .osc-loop-node[data-i="0"] { animation: osc-loop-chase 3s ease-in-out 0s infinite; }
          .osc-loop-node[data-i="1"] { animation: osc-loop-chase 3s ease-in-out 1s infinite; }
          .osc-loop-node[data-i="2"] { animation: osc-loop-chase 3s ease-in-out 2s infinite; }
        `}</style>
      </section>

      {/* RECIPES */}
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
              · RECIPES
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              Four agent flows. <span className="italic text-ink-muted">All voice-first.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Each recipe is a transcript pattern bound to an agent. Speak the line, the agent does the rest.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {RECIPES.map((r) => (
              <RecipeCard key={r.code} recipe={r} />
            ))}
          </div>
        </div>
      </section>

      {/* TERMINAL EXEMPLAR */}
      <section className="relative border-t border-edge-faint bg-canvas-alt font-mono">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr,1.2fr] md:items-center md:gap-12">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.26em] text-trace"
                style={{ textShadow: '0 0 4px var(--trace-glow)' }}
              >
                · EXEMPLAR
              </p>
              <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
                One line of voice. <span className="italic text-ink-muted">One CLI call.</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                The "Voice → GitHub Issue" recipe wired up. Talkie captures the transcript, fills the template, and runs the agent's CLI binary on your behalf.
              </p>
              <ul className="mt-6 space-y-2 text-[13px] text-ink-muted">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-trace" />
                  <span>Executable allowlist for safety.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-trace" />
                  <span>Multi-line templates with variable interpolation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-trace" />
                  <span>Respectful PATH merging — brew, node, bun all visible.</span>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-md border border-edge bg-surface">
              <div className="flex items-center justify-between border-b border-edge-subtle px-4 py-2.5">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                  <Terminal className="h-3 w-3 text-trace" />
                  <span>~/talkie/recipes/issue.sh</span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.22em] text-ink-faint">SHELL</span>
              </div>
              <pre className="overflow-x-auto p-5 text-[12px] leading-relaxed">
                <code className="block text-ink">
                  <span className="text-ink-subtle"># Voice → GitHub Issue</span>
                  {'\n'}
                  <span
                    className="text-trace"
                    style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                  >
                    gh
                  </span>{' '}
                  <span className="text-ink-dim">issue create</span>
                  {'\n'}
                  {'  '}
                  <span className="text-ink-muted">--repo</span>{' '}
                  <span className="text-amber">{'"{{REPO}}"'}</span>
                  {'\n'}
                  {'  '}
                  <span className="text-ink-muted">--title</span>{' '}
                  <span className="text-amber">{'"{{TITLE}}"'}</span>
                  {'\n'}
                  {'  '}
                  <span className="text-ink-muted">--body</span>{' '}
                  <span className="text-amber">{'"{{TRANSCRIPT}}"'}</span>
                  {'\n'}
                  {'  '}
                  <span className="text-ink-muted">--label</span>{' '}
                  <span className="text-amber">&quot;voice-memo&quot;</span>
                  {'\n\n'}
                  <span className="text-ink-subtle"># Variables filled by Talkie:</span>
                  {'\n'}
                  <span className="text-ink-subtle">#   {'{{REPO}}'}      = frontmost-app inference</span>
                  {'\n'}
                  <span className="text-ink-subtle">#   {'{{TITLE}}'}     = first sentence, summarized</span>
                  {'\n'}
                  <span className="text-ink-subtle">#   {'{{TRANSCRIPT}}'} = full capture</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* TRIGGER PRIMITIVES */}
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
              · TRIGGERS
            </p>
            <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
              How voice starts the agent.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              Four primitives decide which agent fires and what context it receives.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {TRIGGERS.map((t, i) => {
              const Icon = t.icon
              return (
                <div
                  key={t.label}
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
                  <div className="relative flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-edge"
                      style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                    >
                      <Icon
                        className="h-4 w-4 text-trace"
                        style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-display text-lg tracking-[-0.01em] text-ink">{t.label}</h3>
                        <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
                          TRG-{String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{t.desc}</p>
                    </div>
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
              href="/v2/features"
              className="group block rounded-md border border-edge bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-trace"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim"
                />
                <span className="text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  KEEP READING · WORKFLOWS
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                The full workflow catalog.
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                Every step type, alias, and routing primitive that an agent recipe is built on. →
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
                  Wire up your first agent.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  macOS 26+ · Claude CLI optional · works with your existing model.
                </p>
              </div>
              <Link
                href="/v2/download"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
                  textShadow: '0 0 6px var(--trace-glow)',
                }}
              >
                <Bot className="h-3.5 w-3.5" />
                GO TO INSTALL <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function RecipeCard({ recipe }) {
  const Icon = recipe.icon
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
            <h3 className="font-display text-lg tracking-[-0.01em] text-ink">{recipe.title}</h3>
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            {recipe.code}
          </span>
        </div>

        <div className="mt-4 h-px w-full bg-edge-subtle" />

        <p className="mt-4 font-display text-[16px] italic leading-snug tracking-[-0.01em] text-ink-muted">
          <span className="text-ink-subtle">&ldquo;</span>
          {recipe.line}
          <span className="text-ink-subtle">&rdquo;</span>
        </p>

        <div className="mt-4 flex items-center gap-2" aria-hidden>
          <span className="block h-px w-6 bg-trace opacity-40" />
          <span
            className="text-[11px] leading-none text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            →
          </span>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-ink">{recipe.out}</p>
      </div>
    </div>
  )
}

function LoopNode({ index, icon: Icon, label, sub }) {
  return (
    <div
      data-i={index}
      className="osc-loop-node relative flex flex-col items-center gap-3 rounded-sm border border-edge-dim bg-canvas p-5"
    >
      <span className="text-[9px] uppercase tracking-[0.22em] text-ink-subtle">{sub}</span>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-md border border-edge"
        style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
      >
        <Icon
          className="h-6 w-6 text-trace"
          style={{ filter: 'drop-shadow(0 0 6px var(--trace-glow))' }}
        />
      </div>
      <span className="font-display text-[15px] tracking-[-0.01em] text-ink">{label}</span>
    </div>
  )
}

function LoopArrow({ vertical = false }) {
  return (
    <div
      className={`relative flex items-center justify-center self-center ${vertical ? 'h-6 w-full' : 'h-full w-12'}`}
      aria-hidden
    >
      <span
        className={`block bg-trace opacity-40 ${vertical ? 'h-full w-px' : 'h-px w-full'}`}
      />
      <ArrowRight
        className={`absolute h-3 w-3 text-trace ${vertical ? 'rotate-90' : ''}`}
        style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
      />
    </div>
  )
}
