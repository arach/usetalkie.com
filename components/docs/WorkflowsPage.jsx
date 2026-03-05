"use client"
import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Zap, Play, Sparkles, Settings, Filter,
  Brain, Mic, Speaker, Mail, Bell, Smartphone, Globe, StickyNote,
  CheckSquare, Calendar, Terminal, Cloud, Clipboard, FileOutput,
  GitBranch, Wand2, Radio, Search, RotateCw, Shield, Cpu, Lock,
} from 'lucide-react'
import DocsLayout from './DocsLayout'

const sections = [
  { id: 'what-are-workflows', title: 'What are Workflows?', level: 2 },
  { id: 'anatomy', title: 'Anatomy of a Workflow', level: 2 },
  { id: 'step-types', title: 'Step Types (21)', level: 2 },
  { id: 'steps-ai', title: 'AI Processing', level: 3 },
  { id: 'steps-communication', title: 'Communication', level: 3 },
  { id: 'steps-apple', title: 'Apple Apps', level: 3 },
  { id: 'steps-integrations', title: 'Integrations', level: 3 },
  { id: 'steps-output', title: 'Output', level: 3 },
  { id: 'steps-logic', title: 'Logic', level: 3 },
  { id: 'steps-triggers', title: 'Triggers', level: 3 },
  { id: 'template-variables', title: 'Template Variables', level: 2 },
  { id: 'llm-providers', title: 'LLM Providers', level: 2 },
  { id: 'shell-security', title: 'Shell Security', level: 2 },
  { id: 'execution', title: 'Execution Pipeline', level: 2 },
  { id: 'navigation', title: 'Continue Reading', level: 2 },
]

const StepTypeCard = ({ name, enumCase, description, fields }) => (
  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 not-prose">
    <div className="flex items-baseline justify-between mb-1">
      <h4 className="font-bold text-zinc-900 dark:text-white">{name}</h4>
      <code className="text-[10px] font-mono text-zinc-400">.{enumCase}</code>
    </div>
    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{description}</p>
    {fields && (
      <div className="space-y-1">
        {fields.map(([field, desc]) => (
          <div key={field} className="flex items-baseline gap-2 text-xs">
            <code className="font-mono text-orange-600 dark:text-orange-400 whitespace-nowrap">{field}</code>
            <span className="text-zinc-500">{desc}</span>
          </div>
        ))}
      </div>
    )}
  </div>
)

const CategoryHeader = ({ id, title, count, color }) => (
  <div id={id} className="flex items-center gap-3 mt-8 mb-4 not-prose">
    <div className={`h-1 w-6 rounded-full ${color}`} />
    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">{title}</h3>
    <span className="text-xs font-mono text-zinc-400">{count} steps</span>
  </div>
)

const ProviderRow = ({ name, budget, balanced, capable, context }) => (
  <tr className="border-b border-zinc-100 dark:border-zinc-800">
    <td className="py-2 pr-4 font-bold text-zinc-900 dark:text-white text-sm">{name}</td>
    <td className="py-2 pr-4 text-xs font-mono text-zinc-500">{budget}</td>
    <td className="py-2 pr-4 text-xs font-mono text-zinc-500">{balanced}</td>
    <td className="py-2 pr-4 text-xs font-mono text-zinc-500">{capable}</td>
    <td className="py-2 text-xs font-mono text-zinc-400">{context}</td>
  </tr>
)

export default function WorkflowsPage() {
  return (
    <DocsLayout
      title="Workflows"
      description="21 step types, 6 LLM providers, and a template system that turns voice into structured actions — all running locally on your Mac."
      badge="Automation"
      badgeColor="orange"
      sections={sections}
    >
      {/* What are Workflows */}
      <h2 id="what-are-workflows">What are Workflows?</h2>
      <p>
        Workflows are automation pipelines that process your voice memos. When you finish a recording, workflows can automatically transcribe, extract information, send notifications, create reminders, run shell commands, or trigger external actions.
      </p>
      <p>
        Each step produces an output that subsequent steps can reference via template variables. This means you can chain an LLM summary into a shell command, then save the result to a file — all triggered by a single voice memo.
      </p>

      {/* Anatomy */}
      <h2 id="anatomy">Anatomy of a Workflow</h2>
      <p>
        Every workflow has three parts:
      </p>

      <div className="grid md:grid-cols-3 gap-3 my-6 not-prose">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-3 mb-3">
            <Play className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-zinc-900 dark:text-white">Triggers</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            When does it run? After transcription, on keyword detection, or manually.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-zinc-900 dark:text-white">Conditions</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Should it run? Gate on memo length, time of day, or transcript content.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-zinc-900 dark:text-white">Steps</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            What does it do? Steps run in order. Each step can use output from previous steps.
          </p>
        </div>
      </div>

      {/* Step Types */}
      <h2 id="step-types">Step Types</h2>
      <p>
        Talkie includes 21 built-in step types across 7 categories. Every field supports template variables like <code>{'{{TRANSCRIPT}}'}</code> and <code>{'{{OUTPUT}}'}</code>.
      </p>

      {/* AI Processing */}
      <CategoryHeader id="steps-ai" title="AI Processing" count="3" color="bg-purple-500" />
      <div className="grid md:grid-cols-2 gap-3 my-4 not-prose">
        <StepTypeCard
          name="LLM"
          enumCase="llm"
          description="Generate text using any configured LLM provider. Supports auto-routing across 6 providers."
          fields={[
            ['provider', 'Explicit provider or auto-route'],
            ['prompt', 'Template string with variables'],
            ['systemPrompt', 'System instructions'],
            ['temperature', '0.0–1.0 (default 0.7)'],
            ['maxTokens', 'Output limit (default 1024)'],
            ['costTier', 'budget / balanced / capable'],
          ]}
        />
        <StepTypeCard
          name="Transcribe"
          enumCase="transcribe"
          description="Convert audio to text using quality-tiered models running on-device."
          fields={[
            ['qualityTier', 'fast (Apple) / balanced (Whisper S) / high (Whisper L)'],
            ['fallbackStrategy', 'automatic / onTimeout / none'],
            ['overwriteExisting', 'Replace current transcript'],
          ]}
        />
        <StepTypeCard
          name="Speak"
          enumCase="speak"
          description="Text-to-speech output. Walkie-talkie mode — Talkie talks back."
          fields={[
            ['text', 'Text to synthesize (supports templates)'],
            ['provider', 'system / openai / elevenlabs / local (Kokoro)'],
            ['voice', 'Voice identifier'],
            ['rate', 'Speech rate (0.0–1.0)'],
            ['playImmediately', 'Play now or just generate file'],
          ]}
        />
      </div>

      {/* Communication */}
      <CategoryHeader id="steps-communication" title="Communication" count="3" color="bg-blue-500" />
      <div className="grid md:grid-cols-2 gap-3 my-4 not-prose">
        <StepTypeCard
          name="Notification"
          enumCase="notification"
          description="Display a macOS system notification."
          fields={[
            ['title', 'Notification title'],
            ['body', 'Notification body'],
            ['sound', 'Play sound (boolean)'],
          ]}
        />
        <StepTypeCard
          name="iOS Push"
          enumCase="iOSPush"
          description="Send a push notification to your iPhone via CloudKit."
          fields={[
            ['title', 'Notification title'],
            ['body', 'Notification body'],
            ['includeOutput', 'Attach workflow output to notification'],
          ]}
        />
        <StepTypeCard
          name="Email"
          enumCase="email"
          description="Compose and send email via Mail.app."
          fields={[
            ['to / cc / bcc', 'Recipients (supports templates)'],
            ['subject', 'Email subject'],
            ['body', 'Email body'],
            ['isHTML', 'HTML formatted email'],
          ]}
        />
      </div>

      {/* Apple Apps */}
      <CategoryHeader id="steps-apple" title="Apple Apps" count="3" color="bg-emerald-500" />
      <div className="grid md:grid-cols-2 gap-3 my-4 not-prose">
        <StepTypeCard
          name="Apple Notes"
          enumCase="appleNotes"
          description="Create a note in the Notes app."
          fields={[
            ['folderName', 'Target folder'],
            ['title', 'Note title'],
            ['body', 'Note content'],
            ['attachTranscript', 'Append transcript to body'],
          ]}
        />
        <StepTypeCard
          name="Apple Reminders"
          enumCase="appleReminders"
          description="Create a reminder with optional due date and priority."
          fields={[
            ['listName', 'Target reminder list'],
            ['title', 'Reminder title'],
            ['dueDate', 'Supports date math: {{NOW+1d}}'],
            ['priority', 'none / low / medium / high'],
          ]}
        />
        <StepTypeCard
          name="Apple Calendar"
          enumCase="appleCalendar"
          description="Create calendar events with date, time, duration, and location."
          fields={[
            ['title', 'Event title'],
            ['startDate', 'Start date (template or ISO)'],
            ['duration', 'Duration in seconds'],
            ['location', 'Event location'],
            ['isAllDay', 'All-day event'],
          ]}
        />
      </div>

      {/* Integrations */}
      <CategoryHeader id="steps-integrations" title="Integrations" count="3" color="bg-orange-500" />
      <div className="grid md:grid-cols-2 gap-3 my-4 not-prose">
        <StepTypeCard
          name="Shell Command"
          enumCase="shell"
          description="Execute CLI commands with a security allowlist. Access to jq, curl, gh, claude, python, node, and more."
          fields={[
            ['executable', 'Path (checked against allowlist)'],
            ['arguments', 'Command args (sanitized)'],
            ['stdin', 'Pipe input via stdin'],
            ['timeout', '1–300 seconds (default 30)'],
            ['environment', 'Environment variables'],
          ]}
        />
        <StepTypeCard
          name="Webhook"
          enumCase="webhook"
          description="Send HTTP requests to external endpoints."
          fields={[
            ['url', 'Target URL'],
            ['method', 'GET / POST / PUT / PATCH / DELETE'],
            ['headers', 'Custom HTTP headers'],
            ['bodyTemplate', 'Custom JSON body template'],
            ['auth', 'Bearer token or API key'],
          ]}
        />
        <StepTypeCard
          name="Cloud Upload"
          enumCase="cloudUpload"
          description="Upload memo audio to S3 or Cloudflare R2."
          fields={[
            ['provider', 's3 / r2'],
            ['bucket', 'Bucket name'],
            ['pathTemplate', 'Upload path with templates'],
            ['credentialId', 'Stored AWS credential reference'],
          ]}
        />
      </div>

      {/* Output */}
      <CategoryHeader id="steps-output" title="Output" count="2" color="bg-cyan-500" />
      <div className="grid md:grid-cols-2 gap-3 my-4 not-prose">
        <StepTypeCard
          name="Clipboard"
          enumCase="clipboard"
          description="Copy text to the macOS pasteboard."
          fields={[
            ['content', 'Text to copy (default {{OUTPUT}})'],
          ]}
        />
        <StepTypeCard
          name="Save File"
          enumCase="saveFile"
          description="Write output to a local file. Supports path aliases like @Obsidian."
          fields={[
            ['filename', 'Supports templates: {{DATE}}-{{TITLE}}.md'],
            ['directory', 'Path or @alias (e.g., @Obsidian/notes)'],
            ['content', 'File content'],
            ['appendIfExists', 'Append instead of overwrite'],
          ]}
        />
      </div>

      {/* Logic */}
      <CategoryHeader id="steps-logic" title="Logic" count="2" color="bg-amber-500" />
      <div className="grid md:grid-cols-2 gap-3 my-4 not-prose">
        <StepTypeCard
          name="Conditional"
          enumCase="conditional"
          description="Branch workflow execution based on a condition expression."
          fields={[
            ['condition', 'e.g., {{OUTPUT}} contains "urgent"'],
            ['thenSteps', 'Steps to run if true'],
            ['elseSteps', 'Steps to run if false'],
          ]}
        />
        <StepTypeCard
          name="Transform"
          enumCase="transform"
          description="Extract, format, or process text data without an LLM."
          fields={[
            ['operation', 'extractJSON / extractList / formatMarkdown / regex / template'],
            ['parameters', 'Operation-specific params (pattern, maxLength, etc.)'],
          ]}
        />
      </div>

      {/* Triggers */}
      <CategoryHeader id="steps-triggers" title="Triggers" count="3" color="bg-rose-500" />
      <div className="grid md:grid-cols-2 gap-3 my-4 not-prose">
        <StepTypeCard
          name="Keyword Trigger"
          enumCase="trigger"
          description="Gate workflow on phrase detection in the transcript."
          fields={[
            ['phrases', 'Trigger phrases (e.g., "hey talkie")'],
            ['searchLocation', 'end / anywhere / start'],
            ['contextWindowSize', 'Words to extract around match'],
            ['stopIfNoMatch', 'Gate workflow if no match found'],
          ]}
        />
        <StepTypeCard
          name="Extract Intents"
          enumCase="intentExtract"
          description="Detect structured actions and commands from transcript using LLM, keywords, or hybrid."
          fields={[
            ['extractionMethod', 'llm / keywords / hybrid'],
            ['recognizedIntents', 'Supported intents with synonyms'],
            ['confidenceThreshold', '0.0–1.0 (default 0.5)'],
          ]}
        />
        <StepTypeCard
          name="Execute Workflows"
          enumCase="executeWorkflows"
          description="Dynamically run workflows for each detected intent. The routing layer."
          fields={[
            ['intentsKey', 'Key containing intents array'],
            ['stopOnError', 'Stop on first failure'],
            ['parallel', 'Run concurrently'],
          ]}
        />
      </div>

      {/* Template Variables */}
      <h2 id="template-variables">Template Variables</h2>
      <p>
        Every step configuration field supports <code>{'{{VARIABLE}}'}</code> syntax. Variables are resolved at runtime before each step executes.
      </p>

      <div className="overflow-x-auto my-6 not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left">
              <th className="py-2 pr-4 font-bold text-zinc-900 dark:text-white">Variable</th>
              <th className="py-2 font-bold text-zinc-900 dark:text-white">Description</th>
            </tr>
          </thead>
          <tbody className="text-zinc-600 dark:text-zinc-400">
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{TRANSCRIPT}}'}</code></td>
              <td className="py-2">Full transcription of the memo</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{TITLE}}'}</code></td>
              <td className="py-2">Memo title (sanitized for filenames)</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{DATE}}'}</code></td>
              <td className="py-2">Date in YYYY-MM-DD format</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{DATETIME}}'}</code></td>
              <td className="py-2">Date and time in YYYY-MM-DD_HH-mm format</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{OUTPUT}}'}</code></td>
              <td className="py-2">Output from the previous step</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{WORKFLOW_NAME}}'}</code></td>
              <td className="py-2">Name of the current workflow</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{stepOutputKey}}'}</code></td>
              <td className="py-2">Output from any named step (by its outputKey)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Date Math</h3>
      <p>
        For steps that accept dates (Reminders, Calendar), you can use relative expressions:
      </p>
      <div className="overflow-x-auto my-4 not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left">
              <th className="py-2 pr-4 font-bold text-zinc-900 dark:text-white">Expression</th>
              <th className="py-2 font-bold text-zinc-900 dark:text-white">Result</th>
            </tr>
          </thead>
          <tbody className="text-zinc-600 dark:text-zinc-400">
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{NOW+1d}}'}</code></td>
              <td className="py-2">Tomorrow</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{NOW+2h}}'}</code></td>
              <td className="py-2">2 hours from now</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{NOW+30m}}'}</code></td>
              <td className="py-2">30 minutes from now</td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4"><code className="text-orange-600 dark:text-orange-400">{'{{NOW+1w}}'}</code></td>
              <td className="py-2">1 week from now</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Format: <code>{'{{NOW±N<unit>}}'}</code> where unit is <code>d</code> (day), <code>h</code> (hour), <code>m</code> (minute), or <code>w</code> (week).
      </p>

      {/* LLM Providers */}
      <h2 id="llm-providers">LLM Providers</h2>
      <p>
        The LLM step supports 6 providers with 3 cost tiers each. When <code>autoRoute</code> is enabled, Talkie selects the best available provider at runtime.
      </p>

      <div className="overflow-x-auto my-6 not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left">
              <th className="py-2 pr-4 font-bold text-zinc-900 dark:text-white">Provider</th>
              <th className="py-2 pr-4 font-bold text-zinc-900 dark:text-white">Budget</th>
              <th className="py-2 pr-4 font-bold text-zinc-900 dark:text-white">Balanced</th>
              <th className="py-2 pr-4 font-bold text-zinc-900 dark:text-white">Capable</th>
              <th className="py-2 font-bold text-zinc-900 dark:text-white">Context</th>
            </tr>
          </thead>
          <tbody>
            <ProviderRow name="Gemini" budget="Flash Lite" balanced="Flash" capable="2.5 Pro" context="1M" />
            <ProviderRow name="OpenAI" budget="GPT-4.1 Mini" balanced="GPT-4.1" capable="o3" context="1M" />
            <ProviderRow name="Anthropic" budget="Haiku 4.5" balanced="Sonnet 4.6" capable="Opus 4.6" context="200K" />
            <ProviderRow name="Groq" budget="Llama 3.3 70B" balanced="Llama 8B" capable="—" context="128K" />
            <ProviderRow name="Grok" budget="Grok 3 Mini Fast" balanced="Grok 3 Mini" capable="Grok 3" context="131K" />
            <ProviderRow name="MLX (Local)" budget="Llama 3.2 1B" balanced="Qwen 2.5 3B" capable="Mistral 7B" context="8–32K" />
          </tbody>
        </table>
      </div>

      <p>
        <strong>Auto-routing priority:</strong> Groq → Gemini → OpenAI → Anthropic → MLX. The system picks the first provider with a valid API key, respecting your cost tier preference.
      </p>

      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 my-4 not-prose">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-zinc-900 dark:text-white">MLX runs entirely on-device</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No API key needed. Models run on Apple Silicon via the Neural Engine. Best for: simple extraction, formatting, and privacy-critical workflows where nothing should leave the machine.
        </p>
      </div>

      {/* Shell Security */}
      <h2 id="shell-security">Shell Security</h2>
      <p>
        Shell steps enforce a strict allowlist/blocklist model. Only approved executables can run. Arguments are sanitized to prevent injection.
      </p>

      <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Allowed</span>
          </div>
          <div className="space-y-1 text-xs font-mono text-emerald-700 dark:text-emerald-400">
            <p><strong>Text:</strong> echo, cat, head, tail, wc, sort, grep, sed, awk, tr</p>
            <p><strong>Data:</strong> jq, base64, shasum</p>
            <p><strong>HTTP:</strong> curl</p>
            <p><strong>Dev CLIs:</strong> gh, claude, npx</p>
            <p><strong>Runtimes:</strong> python3, node, bun</p>
            <p><strong>macOS:</strong> osascript, open, pbcopy, pbpaste</p>
            <p><strong>Utilities:</strong> date, uuidgen, file, which</p>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold text-red-900 dark:text-red-300">Blocked</span>
          </div>
          <div className="space-y-1 text-xs font-mono text-red-700 dark:text-red-400">
            <p><strong>Destructive:</strong> rm, rmdir, mv</p>
            <p><strong>Privilege:</strong> sudo, su, doas</p>
            <p><strong>Permissions:</strong> chmod, chown</p>
            <p><strong>Processes:</strong> kill, killall</p>
            <p><strong>Raw shells:</strong> sh, bash, zsh, fish</p>
            <p><strong>Network:</strong> ssh, scp, sftp, nc</p>
            <p><strong>Disk:</strong> diskutil, mount, umount</p>
          </div>
        </div>
      </div>

      <p>
        You can add custom executables in <strong>Settings → Workflows → Allowed Commands</strong>. All arguments are sanitized: null bytes removed, length-limited to 500KB, and injection patterns (command substitution, shell operators) are detected and logged.
      </p>

      {/* Execution Pipeline */}
      <h2 id="execution">Execution Pipeline</h2>
      <p>
        Steps execute sequentially. Each step goes through the same lifecycle:
      </p>

      <div className="my-6 not-prose">
        <div className="flex flex-col gap-0">
          {[
            ['1', 'Check', 'Is the step enabled?'],
            ['2', 'Evaluate', 'Does the condition pass?'],
            ['3', 'Resolve', 'Replace {{VARIABLES}} in all config fields'],
            ['4', 'Validate', 'For shell steps: check executable against allowlist'],
            ['5', 'Execute', 'Run the step'],
            ['6', 'Store', 'Save output to context under the step\'s outputKey'],
          ].map(([num, label, desc], i) => (
            <div key={num} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-900 dark:text-white">
                  {num}
                </div>
                {i < 5 && <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />}
              </div>
              <div className="pt-1">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{label}</span>
                <span className="text-sm text-zinc-500 ml-2">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p>
        The workflow context accumulates outputs from every step. Reference any previous step's output by its <code>outputKey</code> — e.g., if a step has <code>outputKey: "summary"</code>, later steps can use <code>{'{{summary}}'}</code>.
      </p>

      {/* Navigation */}
      <h2 id="navigation">Continue Reading</h2>
      <div className="flex flex-col sm:flex-row gap-4 not-prose">
        <Link
          href="/docs/data"
          className="group flex-1 flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-rose-500 group-hover:-translate-x-1 transition-all" />
          <div>
            <span className="text-xs text-zinc-500">Previous</span>
            <span className="block font-bold text-zinc-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Your Data
            </span>
          </div>
        </Link>

        <Link
          href="/docs/api"
          className="group flex-1 flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <div>
            <span className="text-xs text-zinc-500">Next</span>
            <span className="block font-bold text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              API Reference
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </DocsLayout>
  )
}
