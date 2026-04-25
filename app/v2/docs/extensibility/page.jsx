import Link from 'next/link'
import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import CodeBlock from '../../../../components/v2/docs/CodeBlock'
import { Card, CategoryRule, FieldRow, PinTag } from '../../../../components/v2/docs/atoms'

export const metadata = {
  title: 'Extensibility — Talkie Docs',
  description:
    'Build on top of Talkie. Webhooks, custom workflows, URL schemes, AppleScript, and a draft file-based context system.',
}

const TOC = [
  { id: 'surfaces', label: 'Integration Surfaces', level: 2 },
  { id: 'webhooks', label: 'Webhooks', level: 2 },
  { id: 'events', label: 'Events', level: 3 },
  { id: 'payload', label: 'Payload Format', level: 3 },
  { id: 'verify', label: 'Verifying Signatures', level: 3 },
  { id: 'custom', label: 'Custom Workflows', level: 2 },
  { id: 'url-schemes', label: 'URL Schemes', level: 2 },
  { id: 'applescript', label: 'AppleScript', level: 2 },
  { id: 'fbcs', label: 'File-Based Context', level: 2 },
  { id: 'partners', label: 'Common Integrations', level: 2 },
]

const SURFACES = [
  {
    name: 'Webhooks',
    sub: 'event.push',
    desc: 'POST event payloads to any URL when memos save, workflows finish, or dictations end.',
  },
  {
    name: 'Custom Workflows',
    sub: 'workflow.json',
    desc: 'Drop a JSON file into the Workflows directory and it shows up in the app.',
  },
  {
    name: 'URL Schemes',
    sub: 'talkie://',
    desc: 'Deep-link from Shortcuts, Raycast, or any app — start recording, open memos, run a workflow.',
  },
  {
    name: 'AppleScript',
    sub: 'osascript',
    desc: 'Full Talkie scripting dictionary for Alfred, Keyboard Maestro, and shell pipelines.',
  },
  {
    name: 'File-Based Context',
    sub: 'rfc · draft',
    desc: 'Discover rules, tools, and automations from disk — keep behavior in source control.',
  },
]

const EVENTS = [
  ['memo.created', 'A new memo was saved with a transcript'],
  ['memo.updated', 'A memo was edited or had metadata changes'],
  ['workflow.completed', 'A workflow finished executing'],
  ['workflow.failed', 'A workflow run failed before reaching its sinks'],
  ['dictation.ended', 'A live dictation session ended'],
]

const URL_SCHEMES = [
  ['talkie://record/start', 'Start a memo recording'],
  ['talkie://record/stop', 'Stop the current recording'],
  ['talkie://memo/{id}', 'Open a memo by id (prefix-matched)'],
  ['talkie://workflow/run/{slug}', 'Run a named workflow against the last memo'],
  ['talkie://search?q={text}', 'Open the library with a query pre-filled'],
]

const PARTNERS = [
  ['Notion', 'Send transcripts to a database via the webhook step'],
  ['Obsidian', 'Drop Markdown into your vault with Save File + @aliases'],
  ['Slack', 'Post summaries to a channel via incoming webhook'],
  ['Raycast', 'Quick capture and library access via URL schemes'],
  ['Things / Todoist', 'Create tasks with URL schemes or webhooks'],
  ['Zapier / Make / n8n', 'Bridge to 1000+ services via the webhook step'],
]

export default function Page() {
  return (
    <DocsLayout
      slug="extensibility"
      title="Extensibility"
      description="Build on top of Talkie. Webhooks, custom workflows, URL schemes, AppleScript, and a draft file-based context system."
      toc={TOC}
    >
      <h2 id="surfaces">Integration Surfaces</h2>
      <p>
        Talkie is designed to be extended without forking. Five surfaces — each
        addresses a different integration shape, from real-time event push to
        config-on-disk.
      </p>

      <div className="not-prose my-5 grid gap-3 md:grid-cols-2">
        {SURFACES.map((s) => (
          <Card key={s.name}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <h4 className="font-bold text-ink">{s.name}</h4>
              <code className="font-mono text-[10px] text-ink-faint">{s.sub}</code>
            </div>
            <p className="text-[13px] text-ink-muted">{s.desc}</p>
          </Card>
        ))}
      </div>

      <h2 id="webhooks">Webhooks</h2>
      <p>
        Webhooks push events out of Talkie when something interesting happens.
        Configure them in <strong>Settings → Workflows → Webhooks</strong>. Every
        endpoint can subscribe to a subset of events and gets its own signing secret.
      </p>

      <h3 id="events">Events</h3>
      <div className="not-prose my-4 overflow-x-auto rounded-sm border border-edge-dim">
        <table className="w-full text-[13px]">
          <thead className="bg-canvas-alt">
            <tr className="text-left">
              <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Event
              </th>
              <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Fires when…
              </th>
            </tr>
          </thead>
          <tbody>
            {EVENTS.map(([name, desc]) => (
              <tr key={name} className="border-t border-edge-faint">
                <td className="px-3 py-2">
                  <code className="font-mono text-amber">{name}</code>
                </td>
                <td className="px-3 py-2 text-ink-muted">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 id="payload">Payload Format</h3>
      <p>
        Payloads are JSON with a stable envelope. The <code>data</code> shape varies
        per event; the envelope does not.
      </p>

      <CodeBlock title="memo.created" lang="json">{`{
  "event": "memo.created",
  "timestamp": "2026-04-24T10:30:00Z",
  "deliveryId": "wh_8a3f2c…",
  "data": {
    "id": "abc-123-def",
    "title": "Meeting Notes",
    "transcript": "Today we discussed the Q1 roadmap…",
    "duration": 45.2,
    "language": "en",
    "createdAt": "2026-04-24T10:29:15Z"
  }
}`}</CodeBlock>

      <h3 id="verify">Verifying Signatures</h3>
      <p>
        Talkie signs every webhook with HMAC-SHA256 and sends the digest in the{' '}
        <code>X-Talkie-Signature</code> header alongside a timestamp in{' '}
        <code>X-Talkie-Timestamp</code>. Reject requests where the timestamp is more
        than five minutes old.
      </p>

      <CodeBlock title="verify.ts" lang="typescript">{`import { createHmac, timingSafeEqual } from 'node:crypto'

export function verifyTalkieSignature({
  secret, body, signature, timestamp,
}: {
  secret: string
  body: string
  signature: string  // hex digest from X-Talkie-Signature
  timestamp: string  // unix seconds from X-Talkie-Timestamp
}) {
  const ageSec = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (ageSec > 300) return false

  const expected = createHmac('sha256', secret)
    .update(\`\${timestamp}.\${body}\`)
    .digest('hex')

  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(signature, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}`}</CodeBlock>

      <h2 id="custom">Custom Workflows</h2>
      <p>
        Workflows are JSON files. Drop one into your Application Support directory
        and Talkie picks it up automatically. Sharing a workflow means sharing the
        file.
      </p>

      <Card className="my-5">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          location
        </div>
        <code className="block rounded-sm border border-edge-faint bg-canvas-alt px-3 py-2 font-mono text-[12px] text-ink-dim">
          ~/Library/Application Support/Talkie/Workflows/
        </code>
      </Card>

      <CodeBlock title="send-to-notion.json" lang="json">{`{
  "id": "send-to-notion",
  "name": "Send to Notion",
  "trigger": {
    "type": "keyword",
    "keywords": ["note", "notion"]
  },
  "steps": [
    {
      "type": "transform",
      "operation": "formatMarkdown",
      "outputKey": "formatted"
    },
    {
      "type": "webhook",
      "url": "https://api.notion.com/v1/pages",
      "headers": {
        "Authorization": "Bearer {{secrets.NOTION_TOKEN}}",
        "Notion-Version": "2022-06-28"
      },
      "bodyTemplate": {
        "parent":  { "database_id": "{{secrets.NOTION_DB}}" },
        "properties": {
          "title": { "title": [{ "text": { "content": "{{TITLE}}" } }] }
        },
        "children": [{ "paragraph": { "text": "{{formatted}}" } }]
      }
    }
  ]
}`}</CodeBlock>

      <p>
        Workflows referenced by other workflows (via <code>executeWorkflows</code>)
        share the same context, so a router workflow can hand off to specialized
        ones without losing variable bindings.
      </p>

      <h2 id="url-schemes">URL Schemes</h2>
      <p>
        Talkie registers the <code>talkie://</code> scheme on first launch. Any app
        that can open a URL — Shortcuts, Raycast, Alfred, your terminal — can drive
        it.
      </p>

      <CategoryRule label="endpoints" count={URL_SCHEMES.length} />
      <Card className="my-3">
        <div className="space-y-2">
          {URL_SCHEMES.map(([url, desc]) => (
            <FieldRow key={url} name={url} desc={desc} />
          ))}
        </div>
      </Card>

      <CodeBlock title="from the shell" lang="sh">{`# Start a memo
open "talkie://record/start"

# Run a workflow on the last memo
open "talkie://workflow/run/daily-journal"

# Search the library
open "talkie://search?q=Q3%20launch"`}</CodeBlock>

      <h2 id="applescript">AppleScript</h2>
      <p>
        Talkie ships a full scripting dictionary. Inspect it from{' '}
        <strong>Script Editor → File → Open Dictionary…</strong> and pick Talkie.
        Useful for Keyboard Maestro macros, Stream Deck buttons, or shell
        automation via <code>osascript</code>.
      </p>

      <CodeBlock title="last-memo.applescript" lang="applescript">{`tell application "Talkie"
  set m to last memo
  set t to transcript of m
  set s to summary of m
  return {title:title of m, words:(count of words of t), summary:s}
end tell`}</CodeBlock>

      <div className="not-prose my-3 flex flex-wrap gap-2">
        <PinTag tone="trace">read</PinTag>
        <PinTag tone="trace">record</PinTag>
        <PinTag tone="trace">workflows</PinTag>
        <PinTag>search</PinTag>
        <PinTag>library</PinTag>
      </div>

      <h2 id="fbcs">File-Based Context</h2>
      <p>
        Webhooks and JSON workflows cover most of what people actually want. The next
        step — currently a draft RFC — is letting Talkie discover behavior from
        conventional folders such as <code>rules/</code>, <code>tools/</code>,{' '}
        <code>workflows/</code>, and <code>automations/</code>. The goal: keep
        Talkie&rsquo;s behavior in source control, define project-local rules without
        waiting on UI support, and still let Talkie own validation and execution
        policy.
      </p>

      <details className="not-prose my-5 group rounded-sm border border-edge-dim bg-surface">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-ink">
          <span className="mr-2 text-trace">›</span>
          Proposed directory layout
        </summary>
        <div className="border-t border-edge-faint">
          <CodeBlock>
{`.talkie/
├── rules/
│   └── meeting-notes.md         # always-on guidance for the LLM step
├── tools/
│   └── ship.sh                  # whitelisted shell tools (signed)
├── workflows/
│   └── triage.json              # standard workflow definitions
└── automations/
    └── on-memo-saved.ts         # reactive scripts compiled at load`}
          </CodeBlock>
        </div>
      </details>

      <Card className="my-5 border-amber/40">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="max-w-md">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-amber">
              draft rfc
            </div>
            <p className="text-[13px] text-ink-muted">
              The RFC covers directory contract, reload semantics, sandbox model, and
              how custom rules compose with built-in ones.
            </p>
          </div>
          <Link
            href="/v2/ideas/file-based-context-system"
            className="inline-flex items-center gap-2 rounded-sm border border-amber/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-amber transition-colors hover:bg-amber/10"
          >
            Read RFC →
          </Link>
        </div>
      </Card>

      <h2 id="partners">Common Integrations</h2>
      <p>
        Patterns Talkie users land on most often. Each is a recipe over the surfaces
        above, not a vendored integration — your data path stays under your control.
      </p>

      <div className="not-prose my-5 grid gap-3 md:grid-cols-2">
        {PARTNERS.map(([name, desc]) => (
          <Card key={name}>
            <h4 className="mb-1 font-bold text-ink">{name}</h4>
            <p className="text-[13px] text-ink-muted">{desc}</p>
          </Card>
        ))}
      </div>
    </DocsLayout>
  )
}
