import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import CodeBlock from '../../../../components/v2/docs/CodeBlock'
import WorkflowPatchBay from '../../../../components/v2/docs/WorkflowPatchBay'
import { Card, CategoryRule, FieldRow } from '../../../../components/v2/docs/atoms'

export const metadata = {
  title: 'Workflows — Talkie Docs',
  description:
    '21 step types, 6 LLM providers, and a template system that turns voice into structured action — all running on your Mac.',
}

const TOC = [
  { id: 'what', label: 'What Workflows Are', level: 2 },
  { id: 'anatomy', label: 'Anatomy', level: 2 },
  { id: 'pipeline', label: 'The Pipeline', level: 2 },
  { id: 'step-types', label: 'Step Types', level: 2 },
  { id: 'ai', label: 'AI Processing', level: 3 },
  { id: 'comms', label: 'Communication', level: 3 },
  { id: 'apple', label: 'Apple Apps', level: 3 },
  { id: 'integrations', label: 'Integrations', level: 3 },
  { id: 'output', label: 'Output', level: 3 },
  { id: 'logic', label: 'Logic', level: 3 },
  { id: 'triggers', label: 'Triggers', level: 3 },
  { id: 'templates', label: 'Template Variables', level: 2 },
  { id: 'providers', label: 'LLM Providers', level: 2 },
  { id: 'shell-security', label: 'Shell Security', level: 2 },
  { id: 'execution', label: 'Execution Lifecycle', level: 2 },
]

// ---------------------------------------------------------------------------
// Step type catalogue — re-authored from the donor.
// ---------------------------------------------------------------------------

const STEP_GROUPS = [
  {
    id: 'ai',
    label: 'AI Processing',
    count: 3,
    steps: [
      {
        name: 'LLM',
        enumCase: 'llm',
        desc: 'Generate text using any configured provider. Supports auto-routing across all 6.',
        fields: [
          ['provider', 'Explicit provider or auto-route'],
          ['prompt', 'Template string with variables'],
          ['systemPrompt', 'System instructions'],
          ['temperature', '0.0 – 1.0 (default 0.7)'],
          ['maxTokens', 'Output limit (default 1024)'],
          ['costTier', 'budget / balanced / capable'],
        ],
      },
      {
        name: 'Transcribe',
        enumCase: 'transcribe',
        desc: 'Audio → text using on-device, quality-tiered models.',
        fields: [
          ['qualityTier', 'fast (Apple) / balanced (Whisper S) / high (Whisper L)'],
          ['fallbackStrategy', 'automatic / onTimeout / none'],
          ['overwriteExisting', 'Replace the current transcript'],
        ],
      },
      {
        name: 'Speak',
        enumCase: 'speak',
        desc: 'Text-to-speech output. Walkie-talkie mode — Talkie talks back.',
        fields: [
          ['text', 'Text to synthesize'],
          ['provider', 'system / openai / elevenlabs / local (Kokoro)'],
          ['voice', 'Voice identifier'],
          ['rate', 'Speech rate (0.0 – 1.0)'],
          ['playImmediately', 'Play now or just generate the file'],
        ],
      },
    ],
  },
  {
    id: 'comms',
    label: 'Communication',
    count: 3,
    steps: [
      {
        name: 'Notification',
        enumCase: 'notification',
        desc: 'Display a macOS system notification.',
        fields: [
          ['title', 'Notification title'],
          ['body', 'Notification body'],
          ['sound', 'Play sound'],
        ],
      },
      {
        name: 'iOS Push',
        enumCase: 'iOSPush',
        desc: 'Push to your iPhone via CloudKit.',
        fields: [
          ['title', 'Notification title'],
          ['body', 'Notification body'],
          ['includeOutput', 'Attach workflow output'],
        ],
      },
      {
        name: 'Email',
        enumCase: 'email',
        desc: 'Compose and send via Mail.app.',
        fields: [
          ['to / cc / bcc', 'Recipients (templated)'],
          ['subject', 'Email subject'],
          ['body', 'Email body'],
          ['isHTML', 'HTML formatted email'],
        ],
      },
    ],
  },
  {
    id: 'apple',
    label: 'Apple Apps',
    count: 3,
    steps: [
      {
        name: 'Apple Notes',
        enumCase: 'appleNotes',
        desc: 'Create a note in the Notes app.',
        fields: [
          ['folderName', 'Target folder'],
          ['title', 'Note title'],
          ['body', 'Note content'],
          ['attachTranscript', 'Append transcript to body'],
        ],
      },
      {
        name: 'Apple Reminders',
        enumCase: 'appleReminders',
        desc: 'Create a reminder with optional due date and priority.',
        fields: [
          ['listName', 'Target reminder list'],
          ['title', 'Reminder title'],
          ['dueDate', 'Date math: {{NOW+1d}}'],
          ['priority', 'none / low / medium / high'],
        ],
      },
      {
        name: 'Apple Calendar',
        enumCase: 'appleCalendar',
        desc: 'Create calendar events with date, duration, and location.',
        fields: [
          ['title', 'Event title'],
          ['startDate', 'Template or ISO'],
          ['duration', 'Duration in seconds'],
          ['location', 'Event location'],
          ['isAllDay', 'All-day event'],
        ],
      },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    count: 3,
    steps: [
      {
        name: 'Shell Command',
        enumCase: 'shell',
        desc: 'Run CLI tools through a strict allowlist — jq, curl, gh, claude, python, node…',
        fields: [
          ['executable', 'Path (allowlist-checked)'],
          ['arguments', 'Command args (sanitized)'],
          ['stdin', 'Pipe input via stdin'],
          ['timeout', '1 – 300 s (default 30)'],
          ['environment', 'Env vars'],
        ],
      },
      {
        name: 'Webhook',
        enumCase: 'webhook',
        desc: 'HTTP requests to any external endpoint.',
        fields: [
          ['url', 'Target URL'],
          ['method', 'GET / POST / PUT / PATCH / DELETE'],
          ['headers', 'Custom HTTP headers'],
          ['bodyTemplate', 'JSON body template'],
          ['auth', 'Bearer or API key'],
        ],
      },
      {
        name: 'Cloud Upload',
        enumCase: 'cloudUpload',
        desc: 'Upload memo audio to S3 or Cloudflare R2.',
        fields: [
          ['provider', 's3 / r2'],
          ['bucket', 'Bucket name'],
          ['pathTemplate', 'Templated upload path'],
          ['credentialId', 'Stored AWS credential ref'],
        ],
      },
    ],
  },
  {
    id: 'output',
    label: 'Output',
    count: 2,
    steps: [
      {
        name: 'Clipboard',
        enumCase: 'clipboard',
        desc: 'Copy text to the macOS pasteboard.',
        fields: [['content', 'Text to copy (default {{OUTPUT}})']],
      },
      {
        name: 'Save File',
        enumCase: 'saveFile',
        desc: 'Write output to disk. Supports path aliases like @Obsidian.',
        fields: [
          ['filename', 'Templated: {{DATE}}-{{TITLE}}.md'],
          ['directory', '@alias or absolute path'],
          ['content', 'File content'],
          ['appendIfExists', 'Append rather than overwrite'],
        ],
      },
    ],
  },
  {
    id: 'logic',
    label: 'Logic',
    count: 2,
    steps: [
      {
        name: 'Conditional',
        enumCase: 'conditional',
        desc: 'Branch execution on a condition expression.',
        fields: [
          ['condition', 'e.g. {{OUTPUT}} contains "urgent"'],
          ['thenSteps', 'Steps to run if true'],
          ['elseSteps', 'Steps to run if false'],
        ],
      },
      {
        name: 'Transform',
        enumCase: 'transform',
        desc: 'Extract, format, or process text without an LLM.',
        fields: [
          ['operation', 'extractJSON / extractList / formatMarkdown / regex / template'],
          ['parameters', 'Operation-specific params'],
        ],
      },
    ],
  },
  {
    id: 'triggers',
    label: 'Triggers',
    count: 3,
    steps: [
      {
        name: 'Keyword Trigger',
        enumCase: 'trigger',
        desc: 'Gate the workflow on phrase detection in the transcript.',
        fields: [
          ['phrases', 'e.g. "hey talkie"'],
          ['searchLocation', 'end / anywhere / start'],
          ['contextWindowSize', 'Words around match'],
          ['stopIfNoMatch', 'Halt if no match'],
        ],
      },
      {
        name: 'Extract Intents',
        enumCase: 'intentExtract',
        desc: 'Detect structured actions from the transcript.',
        fields: [
          ['extractionMethod', 'llm / keywords / hybrid'],
          ['recognizedIntents', 'Supported intents + synonyms'],
          ['confidenceThreshold', '0.0 – 1.0 (default 0.5)'],
        ],
      },
      {
        name: 'Execute Workflows',
        enumCase: 'executeWorkflows',
        desc: 'Dynamically dispatch workflows for each detected intent.',
        fields: [
          ['intentsKey', 'Key with the intents array'],
          ['stopOnError', 'Stop on first failure'],
          ['parallel', 'Run concurrently'],
        ],
      },
    ],
  },
]

const PROVIDERS = [
  { name: 'Gemini', budget: 'Flash Lite', balanced: 'Flash', capable: '2.5 Pro', ctx: '1M' },
  { name: 'OpenAI', budget: 'GPT-4.1 Mini', balanced: 'GPT-4.1', capable: 'o3', ctx: '1M' },
  {
    name: 'Anthropic',
    budget: 'Haiku 4.5',
    balanced: 'Sonnet 4.6',
    capable: 'Opus 4.6',
    ctx: '200K',
  },
  { name: 'Groq', budget: 'Llama 3.3 70B', balanced: 'Llama 8B', capable: '—', ctx: '128K' },
  {
    name: 'Grok',
    budget: 'Grok 3 Mini Fast',
    balanced: 'Grok 3 Mini',
    capable: 'Grok 3',
    ctx: '131K',
  },
  {
    name: 'MLX (Local)',
    budget: 'Llama 3.2 1B',
    balanced: 'Qwen 2.5 3B',
    capable: 'Mistral 7B',
    ctx: '8 – 32K',
  },
]

const TEMPLATE_VARS = [
  ['{{TRANSCRIPT}}', 'Full transcription of the memo'],
  ['{{TITLE}}', 'Memo title (sanitized for filenames)'],
  ['{{DATE}}', 'YYYY-MM-DD'],
  ['{{DATETIME}}', 'YYYY-MM-DD_HH-mm'],
  ['{{OUTPUT}}', 'Output from the previous step'],
  ['{{WORKFLOW_NAME}}', 'Name of the current workflow'],
  ['{{stepOutputKey}}', 'Output of any named step (by its outputKey)'],
]

const DATE_MATH = [
  ['{{NOW+1d}}', 'Tomorrow'],
  ['{{NOW+2h}}', '2 hours from now'],
  ['{{NOW+30m}}', '30 minutes from now'],
  ['{{NOW+1w}}', '1 week from now'],
]

const SHELL_ALLOW = [
  ['Text', 'echo, cat, head, tail, wc, sort, grep, sed, awk, tr'],
  ['Data', 'jq, base64, shasum'],
  ['HTTP', 'curl'],
  ['Dev CLIs', 'gh, claude, npx'],
  ['Runtimes', 'python3, node, bun'],
  ['macOS', 'osascript, open, pbcopy, pbpaste'],
  ['Utilities', 'date, uuidgen, file, which'],
]

const SHELL_BLOCK = [
  ['Destructive', 'rm, rmdir, mv'],
  ['Privilege', 'sudo, su, doas'],
  ['Permissions', 'chmod, chown'],
  ['Processes', 'kill, killall'],
  ['Raw shells', 'sh, bash, zsh, fish'],
  ['Network', 'ssh, scp, sftp, nc'],
  ['Disk', 'diskutil, mount, umount'],
]

const LIFECYCLE = [
  ['1', 'Check', 'Is the step enabled?'],
  ['2', 'Evaluate', 'Does the condition pass?'],
  ['3', 'Resolve', 'Replace {{VARIABLES}} in every config field'],
  ['4', 'Validate', 'Shell steps: check executable against allowlist'],
  ['5', 'Execute', 'Run the step'],
  ['6', 'Store', 'Save output under the step’s outputKey'],
]

// ---------------------------------------------------------------------------
// Local building blocks — server-only.
// ---------------------------------------------------------------------------

function StepTypeCard({ name, enumCase, desc, fields }) {
  return (
    <Card className="my-3">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h4 className="font-bold text-ink">{name}</h4>
        <code className="font-mono text-[10px] text-ink-faint">.{enumCase}</code>
      </div>
      <p className="mb-3 text-[13px] text-ink-muted">{desc}</p>
      <div className="space-y-1">
        {fields.map(([f, d]) => (
          <FieldRow key={f} name={f} desc={d} />
        ))}
      </div>
    </Card>
  )
}

export default function Page() {
  return (
    <DocsLayout
      slug="workflows"
      title="Workflows"
      description="21 step types, 6 LLM providers, and a template system that turns voice into structured action — all running locally on your Mac."
      toc={TOC}
    >
      <h2 id="what">What Workflows Are</h2>
      <p>
        Workflows are automation pipelines that fire when a recording finishes. They
        can transcribe, summarize, send notifications, create reminders, run shell
        commands, or push HTTP requests — chained together so the output of one step
        feeds into the next.
      </p>
      <p>
        Each step produces an output that subsequent steps reference through template
        variables. That means an LLM summary can flow into a shell command, then save
        to a file — all triggered by a single voice memo.
      </p>

      <h2 id="anatomy">Anatomy</h2>
      <p>Every workflow has three parts:</p>
      <div className="not-prose my-5 grid gap-3 md:grid-cols-3">
        <Card>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-trace">
            01 · Triggers
          </div>
          <p className="text-[13px] text-ink-muted">
            When does it run? After transcription, on keyword detection, or manually.
          </p>
        </Card>
        <Card>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-trace">
            02 · Conditions
          </div>
          <p className="text-[13px] text-ink-muted">
            Should it run? Gate on memo length, time of day, or transcript content.
          </p>
        </Card>
        <Card>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-trace">
            03 · Steps
          </div>
          <p className="text-[13px] text-ink-muted">
            What does it do? Steps run in order. Each step can read every previous
            step’s output.
          </p>
        </Card>
      </div>

      <h2 id="pipeline">The Pipeline</h2>
      <p>
        A capture enters on the left as <code>{`{{TRANSCRIPT}}`}</code>, fans out to
        the configured steps, and the router resolves template variables before the
        results land in their sinks.
      </p>
      <WorkflowPatchBay />

      <h2 id="step-types">Step Types</h2>
      <p>
        Twenty-one built-in step types across seven categories. Every field supports
        template variables like <code>{`{{TRANSCRIPT}}`}</code> and{' '}
        <code>{`{{OUTPUT}}`}</code>.
      </p>

      {STEP_GROUPS.map((group) => (
        <div key={group.id}>
          <CategoryRule id={group.id} label={group.label} count={group.count} />
          <div className="not-prose grid gap-3 md:grid-cols-2">
            {group.steps.map((s) => (
              <StepTypeCard key={s.name} {...s} />
            ))}
          </div>
        </div>
      ))}

      <h2 id="templates">Template Variables</h2>
      <p>
        Every step configuration field supports <code>{`{{VARIABLE}}`}</code> syntax.
        Variables are resolved at runtime, immediately before the step executes.
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-sm border border-edge-dim">
        <table className="w-full text-[13px]">
          <thead className="bg-canvas-alt">
            <tr className="text-left">
              <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Variable
              </th>
              <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {TEMPLATE_VARS.map(([v, d]) => (
              <tr key={v} className="border-t border-edge-faint">
                <td className="px-3 py-2">
                  <code className="font-mono text-amber">{v}</code>
                </td>
                <td className="px-3 py-2 text-ink-muted">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Date Math</h3>
      <p>
        Steps that take dates (Reminders, Calendar) accept relative expressions of
        the form <code>{`{{NOW±N<unit>}}`}</code> where unit is <code>d</code>,{' '}
        <code>h</code>, <code>m</code>, or <code>w</code>.
      </p>
      <div className="not-prose my-4 overflow-x-auto rounded-sm border border-edge-dim">
        <table className="w-full text-[13px]">
          <thead className="bg-canvas-alt">
            <tr className="text-left">
              <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Expression
              </th>
              <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {DATE_MATH.map(([v, d]) => (
              <tr key={v} className="border-t border-edge-faint">
                <td className="px-3 py-2">
                  <code className="font-mono text-amber">{v}</code>
                </td>
                <td className="px-3 py-2 text-ink-muted">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="providers">LLM Providers</h2>
      <p>
        The LLM step supports six providers with three cost tiers each. With
        auto-routing on, Talkie picks the first provider with a valid API key,
        respecting your cost-tier preference.
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-sm border border-edge-dim">
        <table className="w-full text-[13px]">
          <thead className="bg-canvas-alt">
            <tr className="text-left">
              {['Provider', 'Budget', 'Balanced', 'Capable', 'Context'].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROVIDERS.map((p) => (
              <tr key={p.name} className="border-t border-edge-faint">
                <td className="px-3 py-2 font-bold text-ink">{p.name}</td>
                <td className="px-3 py-2 font-mono text-ink-muted">{p.budget}</td>
                <td className="px-3 py-2 font-mono text-ink-muted">{p.balanced}</td>
                <td className="px-3 py-2 font-mono text-ink-muted">{p.capable}</td>
                <td className="px-3 py-2 font-mono text-ink-faint">{p.ctx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        <strong>Auto-routing priority:</strong> Groq → Gemini → OpenAI → Anthropic →
        MLX. MLX runs entirely on-device via the Apple Neural Engine — no API key,
        nothing leaves the machine.
      </p>

      <h2 id="shell-security">Shell Security</h2>
      <p>
        Shell steps enforce a strict allowlist / blocklist model. Only approved
        executables can run, and arguments are sanitized — null bytes stripped,
        500&nbsp;KB length cap, command-substitution patterns logged.
      </p>

      <div className="not-prose my-5 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-trace">
            Allowed
          </div>
          <div className="space-y-1.5 font-mono text-[12px] text-ink-muted">
            {SHELL_ALLOW.map(([cat, list]) => (
              <p key={cat}>
                <span className="text-ink">{cat}:</span> {list}
              </p>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-amber">
            Blocked
          </div>
          <div className="space-y-1.5 font-mono text-[12px] text-ink-muted">
            {SHELL_BLOCK.map(([cat, list]) => (
              <p key={cat}>
                <span className="text-ink">{cat}:</span> {list}
              </p>
            ))}
          </div>
        </Card>
      </div>

      <p>
        Add custom executables in <strong>Settings → Workflows → Allowed Commands</strong>.
        Sanitization runs unconditionally regardless of who put the binary on the list.
      </p>

      <h2 id="execution">Execution Lifecycle</h2>
      <p>
        Steps execute sequentially. Every step goes through the same six phases — and
        the workflow context accumulates outputs from all of them, so any later step
        can reference any earlier step’s <code>outputKey</code>.
      </p>

      <div className="not-prose my-5">
        <ol className="space-y-0">
          {LIFECYCLE.map(([n, label, desc], i) => (
            <li key={n} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-edge-dim bg-surface font-mono text-[11px] font-bold text-trace">
                  {n}
                </div>
                {i < LIFECYCLE.length - 1 && (
                  <div className="h-6 w-px bg-edge-faint" aria-hidden />
                )}
              </div>
              <div className="pt-1.5">
                <span className="font-bold text-ink">{label}</span>
                <span className="ml-2 text-[13px] text-ink-muted">{desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <CodeBlock title="example workflow context" lang="json">{`{
  "transcript": "Plan the Q3 launch with marketing.",
  "summary": "<output of the LLM step, outputKey: summary>",
  "tasks":   "<output of the Transform step, outputKey: tasks>",
  "OUTPUT":  "<output of the most recent step>"
}`}</CodeBlock>
    </DocsLayout>
  )
}
