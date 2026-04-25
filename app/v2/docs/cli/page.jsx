import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import CodeBlock from '../../../../components/v2/docs/CodeBlock'
import CopyCommand from '../../../../components/v2/CopyCommand'
import PackageManagerTabs from '../../../../components/v2/PackageManagerTabs'
import { Card, CategoryRule, FieldRow, PinTag } from '../../../../components/v2/docs/atoms'

export const metadata = {
  title: 'CLI — Talkie Docs',
  description:
    'Command-line access to memos, dictations, search, workflows, and the local engine. Designed for agents and pipelines.',
}

const TOC = [
  { id: 'install', label: 'Install', level: 2 },
  { id: 'output', label: 'Output & Global Flags', level: 2 },
  { id: 'commands', label: 'Commands', level: 2 },
  { id: 'memos', label: 'memos', level: 3 },
  { id: 'dictations', label: 'dictations', level: 3 },
  { id: 'search', label: 'search', level: 3 },
  { id: 'workflows', label: 'workflows', level: 3 },
  { id: 'stats', label: 'stats', level: 3 },
  { id: 'engine', label: 'engine', level: 3 },
  { id: 'inference', label: 'inference', level: 3 },
  { id: 'agents', label: 'For Agents', level: 2 },
]

const COMMANDS = [
  {
    id: 'memos',
    name: 'memos',
    blurb: 'List and inspect voice memos with transcripts, summaries, and tasks.',
    examples: [
      'talkie memos',
      'talkie memos --since 7d --limit 10',
      'talkie memos a1b2c3                # by ID prefix',
      'talkie memos a1b2c3 --segments     # word timestamps',
    ],
    flags: ['--since', '--limit', '--segments'],
  },
  {
    id: 'dictations',
    name: 'dictations',
    blurb: 'List keyboard dictations with the app context they were captured in.',
    examples: [
      'talkie dictations',
      'talkie dictations --since 24h',
      'talkie dictations f9e8d7',
    ],
    flags: ['--since', '--limit'],
  },
  {
    id: 'search',
    name: 'search',
    blurb: 'Full-text search across every recording with structural filters.',
    examples: [
      'talkie search "product launch"',
      'talkie search "meeting" --type memo',
      'talkie search "notes" --app "Chrome"',
      'talkie search "long" --longer-than 60 --has summary',
    ],
    flags: [
      '--type',
      '--app',
      '--source',
      '--has',
      '--sort',
      '--longer-than',
      '--shorter-than',
      '--since',
      '--until',
    ],
  },
  {
    id: 'workflows',
    name: 'workflows',
    blurb: 'Workflow run history — status, timings, and per-step details.',
    examples: [
      'talkie workflows',
      'talkie workflows --status completed',
      'talkie workflows --status failed --since 7d',
      'talkie workflows a1b2c3            # full run details',
    ],
    flags: ['--status', '--since', '--limit'],
  },
  {
    id: 'stats',
    name: 'stats',
    blurb: 'Aggregate counters — dictation totals, streaks, top apps.',
    examples: ['talkie stats', 'talkie stats | jq .streak'],
  },
  {
    id: 'engine',
    name: 'engine',
    blurb: 'Manage the on-device transcription engine — status, models, ad-hoc files.',
    examples: [
      'talkie engine status',
      'talkie engine models',
      'talkie engine transcribe ~/audio.m4a',
      'talkie engine transcribe ~/audio.m4a --model parakeet:v3 --timings',
    ],
    flags: ['--model', '--timings', '--raw'],
  },
  {
    id: 'inference',
    name: 'inference',
    blurb: 'Local LLM inference — generate, chat, and inspect installed models.',
    examples: [
      'talkie inference status',
      'talkie inference models',
      'talkie inference generate "Summarize this meeting"',
      'talkie inference chat --model llama:7b',
    ],
    flags: ['--model', '--system', '--temp', '--tokens', '--verbose'],
  },
]

function CommandCard({ id, name, blurb, examples, flags }) {
  return (
    <Card id={id} className="my-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h4 className="font-mono text-[14px] font-bold text-ink">
          <span className="text-trace">$ </span>talkie {name}
        </h4>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          cmd
        </span>
      </div>
      <p className="mb-4 text-[13px] text-ink-muted">{blurb}</p>
      <div className="space-y-1.5">
        {examples.map((ex) => (
          <div key={ex} className="flex items-start gap-2 font-mono text-[12px]">
            <span aria-hidden className="select-none text-trace">
              $
            </span>
            <code className="text-ink-dim">{ex}</code>
          </div>
        ))}
      </div>
      {flags && flags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-edge-faint pt-3">
          {flags.map((f) => (
            <PinTag key={f}>{f}</PinTag>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function Page() {
  return (
    <DocsLayout
      slug="cli"
      title="CLI"
      description="Command-line access to your memos, dictations, search, workflows, and the local engine. JSON by default when piped, human tables in the terminal."
      toc={TOC}
    >
      <h2 id="install">Install</h2>
      <p>
        The CLI ships as an npm package and reads directly from Talkie&rsquo;s local SQLite
        database — no server, no auth flow, no telemetry. If Talkie isn&rsquo;t installed yet,
        the meta-package below installs both.
      </p>

      <div className="not-prose my-5 space-y-5 rounded-sm border border-edge-dim bg-surface p-4 md:p-5">
        {/* Primary: meta-package via the canonical PM toggle */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
            · PRIMARY · META-PACKAGE
          </p>
          <div className="mt-3">
            <PackageManagerTabs />
          </div>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-faint">
            Installs the app, the CLI, and launches Talkie.
          </p>
        </div>

        {/* Secondary: curl one-liner */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
            · OR · CURL ONE-LINER
          </p>
          <div className="mt-3">
            <CopyCommand command="curl -fsSL go.usetalkie.com/install | bash" />
          </div>
        </div>

        {/* Tertiary: CLI only */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
            · OR · CLI ONLY
          </p>
          <div className="mt-3">
            <CopyCommand command="bun add -g @talkie/cli" variant="ghost" />
          </div>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-faint">
            Skip the app bundle — just the <code className="text-ink">talkie</code> binary.
          </p>
        </div>
      </div>

      <p>
        Once installed the <code>talkie</code> binary is on <code>$PATH</code>. Every command
        respects a small set of global flags so you can drop them into pipes and agent
        scripts without ceremony.
      </p>

      <h2 id="output">Output & Global Flags</h2>
      <p>
        Output is auto-detected from the TTY: when piped, commands emit JSON; in an
        interactive terminal you get a compact table. You can pin the format with{' '}
        <code>--json</code> or <code>--pretty</code>.
      </p>

      <Card className="my-5">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          global flags
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <FieldRow name="--json" desc="Force JSON output" />
          <FieldRow name="--pretty" desc="Force human table output" />
          <FieldRow name="--since" desc="Window: 24h, 7d, 2025-02-01" />
          <FieldRow name="--limit" desc="Max rows returned" />
        </div>
      </Card>

      <h2 id="commands">Commands</h2>
      <p>
        Seven verbs cover the full local surface — recordings, indexing, automation,
        and the engines that power them. IDs accept any unique prefix, so agents can
        reference rows without juggling full UUIDs.
      </p>

      <CategoryRule id="memos" label="Recordings" count={2} />
      <CommandCard {...COMMANDS[0]} />
      <CommandCard {...COMMANDS[1]} />

      <CategoryRule id="search" label="Index" count={1} />
      <CommandCard {...COMMANDS[2]} />

      <CategoryRule id="workflows" label="Automation" count={2} />
      <CommandCard {...COMMANDS[3]} />
      <CommandCard {...COMMANDS[4]} />

      <CategoryRule id="engine" label="Engines" count={2} />
      <CommandCard {...COMMANDS[5]} />
      <CommandCard {...COMMANDS[6]} />

      <h2 id="agents">For Agents</h2>
      <p>
        The CLI was shaped around agent workflows. Output is structured, IDs are
        prefix-matched, and every verb composes cleanly with <code>jq</code>, Claude
        Code, or any MCP-compatible runner.
      </p>

      <CodeBlock title="agent recipes" lang="sh">{`# Feed last week of memos to a model
talkie memos --since 7d | jq '.[].text'

# Pull context for a topic
talkie search "project alpha" --type memo | jq '.[0]'

# Triage workflow failures
talkie workflows --status failed | jq '.[] | {name: .workflowName, error: .errorMessage}'

# Transcribe a file and pipe the text out
talkie engine transcribe recording.m4a | jq -r '.text'`}</CodeBlock>

      <p>
        Because everything is local, there&rsquo;s no rate limit and no network round-trip.
        Agents can iterate as fast as their loop allows.
      </p>
    </DocsLayout>
  )
}
