"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Terminal, Search, BarChart3, Workflow, Mic, Cpu, HardDrive, Download, Bot } from 'lucide-react'
import DocsLayout from './DocsLayout'

const sections = [
  { id: 'install', title: 'Installation', level: 2 },
  { id: 'agent-access', title: 'Agent Access Answers', level: 2 },
  { id: 'commands', title: 'Commands', level: 2 },
  { id: 'memos', title: 'memos', level: 3 },
  { id: 'dictations', title: 'dictations', level: 3 },
  { id: 'search', title: 'search', level: 3 },
  { id: 'workflows', title: 'workflows', level: 3 },
  { id: 'stats', title: 'stats', level: 3 },
  { id: 'engine', title: 'engine', level: 3 },
  { id: 'inference', title: 'inference', level: 3 },
  { id: 'agents', title: 'For Agents', level: 2 },
  { id: 'navigation', title: 'Continue Reading', level: 2 },
]

const CodeBlock = ({ children, title }) => (
  <div className="rounded-lg border border-screen-edge overflow-hidden my-4 not-prose">
    {title && (
      <div className="px-4 py-2 bg-panel-bg-alt border-b border-screen-edge-dim">
        <span className="text-xs font-mono text-ink-muted">{title}</span>
      </div>
    )}
    <pre className="p-4 bg-panel-bg overflow-x-auto">
      <code className="text-sm font-mono text-screen-ink-dim">{children}</code>
    </pre>
  </div>
)

const CommandCard = ({ id, icon: Icon, name, description, examples, flags }) => (
  <div id={id} className="scroll-mt-20 p-5 rounded-lg border border-edge bg-canvas-alt not-prose">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-amber/20">
        <Icon className="w-4 h-4 text-amber" />
      </div>
      <div>
        <h4 className="font-bold font-mono text-ink">talkie {name}</h4>
        <p className="text-xs text-ink-faint">{description}</p>
      </div>
    </div>
    <div className="space-y-2">
      {examples.map((ex, i) => (
        <div key={i} className="flex items-start gap-2 text-xs font-mono">
          <span className="text-amber select-none shrink-0">$</span>
          <span className="text-screen-ink-dim">{ex}</span>
        </div>
      ))}
    </div>
    {flags && flags.length > 0 && (
      <div className="mt-3 pt-3 border-t border-edge flex flex-wrap gap-2">
        {flags.map((flag, i) => (
          <span key={i} className="px-2 py-0.5 text-[10px] font-mono rounded bg-surface dark:bg-panel-bg-alt text-ink-muted">
            {flag}
          </span>
        ))}
      </div>
    )}
  </div>
)

export default function CliPage() {
  return (
    <DocsLayout
      title="Talkie CLI"
      description="Access your voice memos, dictations, and workflows from the command line. Designed for agents and power users who want programmatic access to their voice data."
      badge="Power Users"
      badgeColor="emerald"
      sections={sections}
    >
      {/* Installation */}
      <h2 id="install">Installation</h2>
      <p>
        The CLI is available as an npm package. It reads directly from Talkie's local SQLite database — no server required.
      </p>

      <CodeBlock title="Install via npm">
{`bun add -g @talkie/app

# Or CLI only
bun add -g @talkie/cli

# Or with the one-liner (installs CLI + app)
curl -fsSL go.usetalkie.com/install | bash`}
      </CodeBlock>

      <p>
        Once installed, the <code>talkie</code> command is available globally. All commands output <strong>JSON by default</strong> when piped, and human-readable tables in the terminal.
      </p>

      <h2 id="agent-access">Agent Access Answers</h2>
      <div className="grid md:grid-cols-3 gap-3 my-6 not-prose">
        {[
          [Terminal, 'Can agents read Talkie data?', 'Yes. Agents can call the Talkie CLI to read memos, dictations, searches, workflow runs, transcription results, and local inference output as JSON.'],
          [HardDrive, 'Does the CLI need a server?', 'No. The CLI reads from the local Talkie library and works without a hosted API for normal memo, dictation, search, and workflow history access.'],
          [Bot, 'What tools compose with it?', 'The output is designed for jq, shell scripts, Claude Code, Codex, MCP-compatible agents, and local model CLIs.'],
        ].map(([Icon, title, body]) => (
          <div key={title} className="p-4 rounded-lg border border-edge bg-canvas-alt">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-amber" />
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink">{title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg border border-edge bg-canvas-alt my-4 not-prose">
        <div className="text-xs font-mono text-ink-faint mb-2">Global flags (all commands)</div>
        <div className="flex flex-wrap gap-3 text-xs font-mono">
          <span className="text-screen-ink-dim"><span className="text-amber">--json</span> Force JSON output</span>
          <span className="text-ink-faint">|</span>
          <span className="text-screen-ink-dim"><span className="text-amber">--pretty</span> Force table output</span>
          <span className="text-ink-faint">|</span>
          <span className="text-screen-ink-dim"><span className="text-amber">--since</span> Filter by date (7d, 24h, 2025-02-01)</span>
          <span className="text-ink-faint">|</span>
          <span className="text-screen-ink-dim"><span className="text-amber">--limit</span> Max results</span>
        </div>
      </div>

      {/* Commands */}
      <h2 id="commands">Commands</h2>

      <div className="space-y-4 my-6 not-prose">
        <CommandCard
          id="memos"
          icon={Mic}
          name="memos"
          description="List and view voice memos with transcripts, summaries, and tasks"
          examples={[
            'talkie memos',
            'talkie memos --since 7d --limit 10',
            'talkie memos a1b2c3      # Get memo by ID prefix',
            'talkie memos a1b2c3 --segments   # With word timestamps',
          ]}
          flags={['--since', '--limit', '--segments']}
        />

        <CommandCard
          id="dictations"
          icon={Terminal}
          name="dictations"
          description="List keyboard dictations with app context metadata"
          examples={[
            'talkie dictations',
            'talkie dictations --since 24h',
            'talkie dictations f9e8d7   # By ID prefix',
          ]}
          flags={['--since', '--limit']}
        />

        <CommandCard
          id="search"
          icon={Search}
          name="search"
          description="Full-text search across all recordings with powerful filters"
          examples={[
            'talkie search "product launch"',
            'talkie search "meeting" --type memo',
            'talkie search "notes" --app "Chrome"',
            'talkie search "recent" --sort newest --has summary',
            'talkie search "long" --longer-than 60',
          ]}
          flags={['--type', '--app', '--source', '--has', '--sort', '--longer-than', '--shorter-than', '--since', '--until']}
        />

        <CommandCard
          id="workflows"
          icon={Workflow}
          name="workflows"
          description="View workflow execution history with step-by-step details"
          examples={[
            'talkie workflows',
            'talkie workflows --status completed',
            'talkie workflows --status failed --since 7d',
            'talkie workflows a1b2c3   # Full run details',
          ]}
          flags={['--status', '--since', '--limit']}
        />

        <CommandCard
          id="stats"
          icon={BarChart3}
          name="stats"
          description="App statistics — dictation counts, streaks, top apps"
          examples={[
            'talkie stats',
            'talkie stats | jq .streak',
          ]}
        />

        <CommandCard
          id="engine"
          icon={Cpu}
          name="engine"
          description="Manage the transcription engine — status, models, transcribe files"
          examples={[
            'talkie engine status',
            'talkie engine models',
            'talkie engine transcribe ~/audio.m4a',
            'talkie engine transcribe ~/audio.m4a --model parakeet:v3 --timings',
          ]}
          flags={['--model', '--timings', '--raw']}
        />

        <CommandCard
          id="inference"
          icon={Bot}
          name="inference"
          description="Local LLM inference — generate text, chat, manage models"
          examples={[
            'talkie inference status',
            'talkie inference models',
            'talkie inference generate "Summarize this meeting"',
            'talkie inference chat --model llama:7b',
          ]}
          flags={['--model', '--system', '--temp', '--tokens', '--verbose']}
        />
      </div>

      {/* For Agents */}
      <h2 id="agents">For Agents</h2>
      <p>
        The CLI is designed for AI agent integration. All commands output structured JSON when piped, making it easy to compose with tools like <code>jq</code>, Claude Code, or any MCP-compatible agent.
      </p>

      <CodeBlock title="Agent examples">
{`# Feed recent memos to an agent
talkie memos --since 7d | jq '.[].text'

# Search for context on a topic
talkie search "project alpha" --type memo | jq '.[0]'

# Check workflow failures
talkie workflows --status failed | jq '.[] | {name: .workflowName, error: .errorMessage}'

# Transcribe and process a file
talkie engine transcribe recording.m4a | jq '.text'`}
      </CodeBlock>

      <p>
        Every command supports <strong>prefix ID matching</strong> — you don't need the full UUID, just enough characters to be unique. This makes it natural for agents to reference specific recordings.
      </p>

      {/* Navigation */}
      <h2 id="navigation">Continue Reading</h2>
      <div className="flex flex-col sm:flex-row gap-4 not-prose">
        <Link
          href="/docs/workflows"
          className="group flex-1 flex items-center gap-4 p-4 rounded-lg border border-edge bg-canvas-alt hover:border-amber/40 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-ink-muted group-hover:text-indigo-500 group-hover:-translate-x-1 transition-all" />
          <div>
            <span className="text-xs text-ink-faint">Previous</span>
            <span className="block font-bold text-ink group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Workflows
            </span>
          </div>
        </Link>

        <Link
          href="/docs/extensibility"
          className="group flex-1 flex items-center justify-between p-4 rounded-lg border border-edge bg-canvas-alt hover:border-amber/40 transition-colors"
        >
          <div>
            <span className="text-xs text-ink-faint">Next</span>
            <span className="block font-bold text-ink group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              Extensibility
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </DocsLayout>
  )
}
