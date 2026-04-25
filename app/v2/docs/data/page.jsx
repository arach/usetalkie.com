import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import DocsNotice from '../../../../components/v2/docs/DocsNotice'
import DocsCodeBlock from '../../../../components/v2/docs/DocsCodeBlock'

export const metadata = {
  title: 'Data — Talkie Docs',
  description:
    "Where Talkie keeps your recordings on disk, how the unified GRDB schema is laid out, and the formats you can export to.",
  openGraph: {
    title: 'Data — Talkie Docs',
    description: 'GRDB schema, audio storage, exports, and sync.',
    images: [{ url: '/og/docs-data.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-data.png'],
  },
}

const toc = [
  { id: 'philosophy', label: 'Philosophy', level: 2 },
  { id: 'storage-layout', label: 'Storage layout', level: 2 },
  { id: 'database', label: 'Database', level: 3 },
  { id: 'audio', label: 'Audio files', level: 3 },
  { id: 'models', label: 'Core models', level: 2 },
  { id: 'exports', label: 'Exports', level: 2 },
  { id: 'sync', label: 'Sync architecture', level: 2 },
]

// ---------------------------------------------------------------------------
// Server-rendered storage diagram. Pure SVG, no JS — every fill/stroke uses
// theme CSS vars, so it flips between cream and phosphor without a hook.
// ---------------------------------------------------------------------------
function StorageMap() {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-sm border border-edge-faint bg-canvas p-5">
        <svg
          viewBox="0 0 720 280"
          role="img"
          aria-label="Talkie local storage layout"
          className="block w-full h-auto"
        >
          {/* Graticule */}
          <defs>
            <pattern id="data-grat" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--trace-faint)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="720" height="280" fill="url(#data-grat)" />

          {/* Root folder bracket */}
          <g fontFamily="var(--font-mono)" fontSize="11">
            <text x="24" y="32" fill="var(--ink-faint)" letterSpacing="2">
              ~/Library/Application Support/Talkie/
            </text>
            <line x1="24" y1="44" x2="696" y2="44" stroke="var(--edge-faint)" />

            {/* Database node */}
            <g transform="translate(60, 80)">
              <rect
                x="0"
                y="0"
                width="260"
                height="120"
                fill="var(--surface)"
                stroke="var(--edge)"
                strokeWidth="1"
                rx="2"
              />
              <text x="14" y="22" fill="var(--trace)" fontSize="10" letterSpacing="2">
                · DATABASE
              </text>
              <text x="14" y="48" fill="var(--ink)" fontSize="13">
                talkie_grdb.sqlite
              </text>
              <text x="14" y="68" fill="var(--ink-muted)" fontSize="11">
                recordings · settings · workflows
              </text>
              <text x="14" y="88" fill="var(--ink-faint)" fontSize="10">
                unified table — type=memo|dictation
              </text>
              <text x="14" y="106" fill="var(--ink-subtle)" fontSize="10">
                writers: Talkie, TalkieAgent
              </text>
            </g>

            {/* Audio node */}
            <g transform="translate(400, 80)">
              <rect
                x="0"
                y="0"
                width="260"
                height="120"
                fill="var(--surface)"
                stroke="var(--edge)"
                strokeWidth="1"
                rx="2"
              />
              <text x="14" y="22" fill="var(--trace)" fontSize="10" letterSpacing="2">
                · AUDIO
              </text>
              <text x="14" y="48" fill="var(--ink)" fontSize="13">
                Audio/
              </text>
              <text x="14" y="68" fill="var(--ink-muted)" fontSize="11">
                M4A · AAC codec
              </text>
              <text x="14" y="88" fill="var(--ink-faint)" fontSize="10">
                one file per recording, UUID-keyed
              </text>
              <text x="14" y="106" fill="var(--ink-subtle)" fontSize="10">
                referenced by audioPath
              </text>
            </g>

            {/* Connector — DB to audio */}
            <path
              d="M 320 140 L 400 140"
              stroke="var(--trace)"
              strokeWidth="1.25"
              strokeDasharray="3 3"
              fill="none"
            />
            <circle cx="320" cy="140" r="3" fill="var(--trace)" />
            <circle cx="400" cy="140" r="3" fill="var(--trace)" />
            <text x="328" y="134" fill="var(--ink-faint)" fontSize="9" letterSpacing="2">
              audioPath →
            </text>

            {/* Footnote */}
            <text x="24" y="240" fill="var(--ink-subtle)" fontSize="10" letterSpacing="2">
              local-first · plain-format · backup with Time Machine
            </text>
            <line x1="24" y1="252" x2="696" y2="252" stroke="var(--edge-faint)" />
            <text x="24" y="268" fill="var(--ink-faint)" fontSize="9" letterSpacing="3">
              FIG. 01 — STORAGE LAYOUT
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
        FIG. 01 — Local storage map
      </figcaption>
    </figure>
  )
}

// Tiny inline schema card, server-side, prose-friendly.
function SchemaCard({ name, summary, fields }) {
  return (
    <div className="not-prose my-4 rounded-sm border border-edge-faint bg-canvas p-4">
      <div className="flex items-baseline gap-3 border-b border-edge-faint pb-2">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.24em] text-trace"
          style={{ textShadow: '0 0 4px var(--trace-glow)' }}
        >
          · MODEL
        </span>
        <span className="font-mono text-[13px] text-ink">{name}</span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{summary}</p>
      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
        {fields.map((f) => (
          <li
            key={f.name}
            className="flex items-baseline justify-between gap-3 border-b border-edge-subtle py-1 font-mono text-[12px]"
          >
            <span className="text-ink">{f.name}</span>
            <span className="text-ink-faint">{f.type}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Page() {
  return (
    <DocsLayout
      slug="data"
      title="Data"
      description="Where your recordings live on disk, how the unified GRDB schema is laid out, and the formats you can export to. You own the bytes — Talkie just reads and writes them."
      toc={toc}
    >
      <h2 id="philosophy">Philosophy</h2>
      <p>
        Voice recordings are personal. They carry half-formed ideas, drafts of
        difficult emails, the occasional venting session. Talkie treats those
        bytes as <strong>yours</strong>, full stop:
      </p>
      <ul>
        <li>
          <strong>Local first</strong> — everything lives in
          <code> ~/Library/Application Support/Talkie/</code>, not a cloud you
          rent.
        </li>
        <li>
          <strong>Plain formats</strong> — SQLite for metadata, M4A for audio,
          flat text for exports.
        </li>
        <li>
          <strong>No lock-in</strong> — single-click bulk export plus a CLI to
          script the same thing.
        </li>
        <li>
          <strong>Optional sync</strong> — iCloud is a layer on top of the
          local truth, never the truth itself.
        </li>
      </ul>

      <h2 id="storage-layout">Storage layout</h2>
      <p>
        Talkie writes into the standard macOS Application Support tree, which
        means Time Machine, Migration Assistant and your favourite folder-sync
        tool already know how to back it up.
      </p>

      <StorageMap />

      <h3 id="database">Database</h3>
      <p>
        A single SQLite database holds memos, dictations, workflows, and app
        settings. Memos and live dictations share one
        {' '}<em>unified recordings table</em>, distinguished by a{' '}
        <code>type</code> column. Both Talkie and TalkieAgent (the dictation
        helper) write to it; GRDB serialises access so they never collide.
      </p>

      <DocsCodeBlock caption="Inspect the database" lang="bash">
{`# Default location
~/Library/Application\\ Support/Talkie/talkie_grdb.sqlite

# Open it read-only and list tables
sqlite3 ~/Library/Application\\ Support/Talkie/talkie_grdb.sqlite ".tables"

# Tail the schema
sqlite3 ~/Library/Application\\ Support/Talkie/talkie_grdb.sqlite ".schema recordings"`}
      </DocsCodeBlock>

      <h3 id="audio">Audio files</h3>
      <p>
        Recordings are encoded as <code>.m4a</code> (AAC) — small enough to
        carry around, lossless enough to re-transcribe. Each file is keyed by
        the parent recording's UUID so the database row and the audio blob
        can always be re-paired.
      </p>

      <DocsCodeBlock caption="Audio directory" lang="bash">
{`~/Library/Application Support/Talkie/Audio/
  ├── 2c4b9a31-…-c8.m4a
  ├── 7f1d2e44-…-9a.m4a
  └── …`}
      </DocsCodeBlock>

      <h2 id="models">Core models</h2>
      <p>
        Three models cover almost everything Talkie persists. Knowing their
        shape is enough to script reports, build a backup tool, or pipe data
        into another app.
      </p>

      <SchemaCard
        name="Memo"
        summary="A captured voice recording with transcript and metadata."
        fields={[
          { name: 'id', type: 'UUID' },
          { name: 'title', type: 'String?' },
          { name: 'transcript', type: 'String' },
          { name: 'audioPath', type: 'String?' },
          { name: 'createdAt', type: 'Date' },
          { name: 'duration', type: 'TimeInterval' },
          { name: 'isFavorite', type: 'Bool' },
        ]}
      />

      <SchemaCard
        name="Dictation"
        summary="A live dictation session driven by TalkieAgent."
        fields={[
          { name: 'id', type: 'UUID' },
          { name: 'text', type: 'String' },
          { name: 'appBundleId', type: 'String?' },
          { name: 'startedAt', type: 'Date' },
          { name: 'endedAt', type: 'Date?' },
        ]}
      />

      <SchemaCard
        name="Workflow"
        summary="An automation rule with a trigger and an ordered list of steps."
        fields={[
          { name: 'id', type: 'UUID' },
          { name: 'name', type: 'String' },
          { name: 'isEnabled', type: 'Bool' },
          { name: 'trigger', type: 'TriggerConfig' },
          { name: 'steps', type: '[WorkflowStep]' },
        ]}
      />

      <h2 id="exports">Exports</h2>
      <p>
        Every memo can leave Talkie in one of four shapes. Use{' '}
        <strong>Share → Export</strong> on a single memo, or{' '}
        <strong>Settings → Data → Export All</strong> to ship the whole
        library.
      </p>

      <div className="not-prose my-5 overflow-hidden rounded-sm border border-edge-faint">
        <table className="w-full font-mono text-[12.5px]">
          <thead className="bg-surface">
            <tr className="text-left">
              <th className="border-b border-edge-faint px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                Format
              </th>
              <th className="border-b border-edge-faint px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                Contents
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-edge-faint">
              <td className="px-4 py-2 text-trace">.txt</td>
              <td className="px-4 py-2 text-ink-muted">Plain transcript, no metadata.</td>
            </tr>
            <tr className="border-b border-edge-faint">
              <td className="px-4 py-2 text-trace">.md</td>
              <td className="px-4 py-2 text-ink-muted">
                Markdown body with YAML frontmatter (title, date, duration, tags).
              </td>
            </tr>
            <tr className="border-b border-edge-faint">
              <td className="px-4 py-2 text-trace">.json</td>
              <td className="px-4 py-2 text-ink-muted">
                Full record — every field on the model, ready for scripting.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-trace">.m4a</td>
              <td className="px-4 py-2 text-ink-muted">Original audio, untouched.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocsNotice variant="info" label="TIP" title="Scripted exports">
        The Talkie CLI can dump any subset of memos as JSON or Markdown — see
        the <a href="/v2/docs/cli">CLI reference</a> for query flags.
      </DocsNotice>

      <h2 id="sync">Sync architecture</h2>
      <p>
        Talkie is <strong>GRDB-primary</strong>. The local SQLite file is
        always the source of truth; sync, when enabled, is an additive layer
        that pushes changes outward and merges remote changes back in.
      </p>

      <ol>
        <li>App writes a record to the local GRDB database.</li>
        <li>A change observer notices the new or updated row.</li>
        <li>If iCloud sync is on, the bridge pushes the delta to CloudKit.</li>
        <li>Remote changes arrive, get merged into GRDB on a background queue.</li>
      </ol>

      <DocsNotice variant="ok" label="WHY THIS MATTERS">
        Talkie works fully offline. When connectivity returns, sync just
        catches up — there is no "online mode" to lose.
      </DocsNotice>
    </DocsLayout>
  )
}
