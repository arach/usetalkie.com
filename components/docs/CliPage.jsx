"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Terminal, Search, BarChart3, Workflow, Mic, Cpu, HardDrive, Download, Bot } from 'lucide-react'
import DocsLayout from './DocsLayout'

const sections = [
  { id: 'install', title: 'Installation', level: 2 },
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
  <div className="rounded-lg border border-zinc-800 overflow-hidden my-4 not-prose">
    {title && (
      <div className="px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <span className="text-xs font-mono text-zinc-400">{title}</span>
      </div>
    )}
    <pre className="p-4 bg-zinc-900 overflow-x-auto">
      <code className="text-sm font-mono text-zinc-300">{children}</code>
    </pre>
  </div>
)

const CommandCard = ({ id, icon: Icon, name, description, examples, flags }) => (
  <div id={id} className="scroll-mt-20 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 not-prose">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
        <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <h4 className="font-bold font-mono text-zinc-900 dark:text-white">talkie {name}</h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
    </div>
    <div className="space-y-2">
      {examples.map((ex, i) => (
        <div key={i} className="flex items-start gap-2 text-xs font-mono">
          <span className="text-emerald-500 select-none shrink-0">$</span>
          <span className="text-zinc-300">{ex}</span>
        </div>
      ))}
    </div>
    {flags && flags.length > 0 && (
      <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2">
        {flags.map((flag, i) => (
          <span key={i} className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
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

      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 my-4 not-prose">
        <div className="text-xs font-mono text-zinc-500 mb-2">Global flags (all commands)</div>
        <div className="flex flex-wrap gap-3 text-xs font-mono">
          <span className="text-zinc-300"><span className="text-emerald-500">--json</span> Force JSON output</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300"><span className="text-emerald-500">--pretty</span> Force table output</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300"><span className="text-emerald-500">--since</span> Filter by date (7d, 24h, 2025-02-01)</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300"><span className="text-emerald-500">--limit</span> Max results</span>
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
          className="group flex-1 flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 group-hover:-translate-x-1 transition-all" />
          <div>
            <span className="text-xs text-zinc-500">Previous</span>
            <span className="block font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Workflows
            </span>
          </div>
        </Link>

        <Link
          href="/docs/extensibility"
          className="group flex-1 flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <div>
            <span className="text-xs text-zinc-500">Next</span>
            <span className="block font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              Extensibility
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </DocsLayout>
  )
}
