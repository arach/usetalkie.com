import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import LifecycleDiagram from '../../../../components/v2/docs/LifecycleDiagram'

export const metadata = {
  title: 'Lifecycle — Talkie Docs',
  description:
    'Understanding the journey from voice to action. Every recording flows through distinct phases, each with natural extension points.',
  openGraph: {
    title: 'Lifecycle — Talkie Docs',
    description: 'The journey from voice to action with extension points.',
    images: [{ url: '/og/docs-lifecycle.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-lifecycle.png'],
  },
}

const TOC = [
  { id: 'overview',             label: 'Overview',             level: 2 },
  { id: 'dictation-lifecycle',  label: 'Dictation Lifecycle',  level: 2 },
  { id: 'phase-capture',        label: 'Capture Phase',        level: 3 },
  { id: 'phase-transcribe',     label: 'Transcription Phase',  level: 3 },
  { id: 'phase-route',          label: 'Routing Phase',        level: 3 },
  { id: 'phase-store',          label: 'Storage Phase',        level: 3 },
  { id: 'memo-lifecycle',       label: 'Memo Lifecycle',       level: 2 },
  { id: 'memo-creation',        label: 'Creation',             level: 3 },
  { id: 'memo-workflows',       label: 'Workflow Execution',   level: 3 },
  { id: 'extension-points',     label: 'Extension Points',     level: 2 },
  { id: 'next-steps',           label: 'Continue Reading',     level: 2 },
]

const FLOWS = [
  {
    code: 'F-01',
    label: 'DICTATION',
    title: 'Press, speak, release.',
    body: 'Text appears where your cursor is. Fast, in-flow, ephemeral.',
    timing: '~500ms to paste',
  },
  {
    code: 'F-02',
    label: 'MEMO',
    title: 'Deliberate recording.',
    body: 'Becomes a searchable note. Triggers workflows for processing, summarizing, extracting.',
    timing: 'Permanent · indexed',
  },
]

const CAPTURE_STEPS = [
  { n: 1, label: 'Hotkey detected',     detail: 'Carbon event handler fires immediately' },
  { n: 2, label: 'Context captured',    detail: 'Active app, window, selected text', hook: true },
  { n: 3, label: 'Audio capture starts', detail: 'TalkieAgent begins recording via AudioCapture' },
  { n: 4, label: 'State broadcast',     detail: 'XPC notifies main app, UI updates' },
]

const TRANSCRIBE_STEPS = [
  { n: 5, label: 'Hotkey released',       detail: 'Stop capture, transition to transcribing' },
  { n: 6, label: 'Audio saved',           detail: 'Copied to permanent storage before processing' },
  { n: 7, label: 'Transcription request', detail: 'Sent to TalkieEngine via XPC', hook: true },
  { n: 8, label: 'Text returned',         detail: 'Whisper model returns transcript', hook: true },
]

const ROUTE_STEPS = [
  { n: 9,  label: 'Routing decision', detail: 'Paste, clipboard, or scratchpad', hook: true },
  { n: 10, label: 'Text delivered',   detail: 'Keyboard simulation or clipboard write' },
  { n: 11, label: 'Sound feedback',   detail: 'Confirmation that delivery succeeded' },
]

const STORE_STEPS = [
  { n: 12, label: 'Record created',      detail: 'LiveDictation saved to GRDB', hook: true },
  { n: 13, label: 'Context enrichment', detail: 'Async enhancement with bridge mapping' },
  { n: 14, label: 'XPC notification',   detail: 'Main app notified of new dictation' },
  { n: 15, label: 'State reset',        detail: 'Ready for next dictation' },
]

const HOOKS = [
  ['onCaptureStart',          'Capture',        'Auto-route based on app, disable in certain contexts'],
  ['onTranscriptionComplete', 'Transcription',  'Custom corrections, keyword detection, content filtering'],
  ['beforeRoute',             'Routing',        'Intercept commands ("hey talkie"), transform output'],
  ['onDictationStored',       'Storage',        'Sync to external service, trigger notifications'],
  ['onMemoCreated',           'Memo',           'Auto-categorize, trigger custom workflows'],
  ['beforeWorkflowStep',      'Workflow',       'Inject data, modify prompts, skip steps conditionally'],
]

const MEMO_STAGES = [
  { code: 'M-01', label: 'RECORD',     body: 'Audio captured via AVAudioRecorder.' },
  { code: 'M-02', label: 'TRANSCRIBE', body: 'Sent to TalkieEngine via EngineClient.' },
  { code: 'M-03', label: 'STORE',      body: 'Saved to GRDB with audio file reference.' },
  { code: 'M-04', label: 'TRIGGER',    body: 'Auto-run workflows execute in order.' },
]

function StepList({ id, steps }) {
  return (
    <div id={id} className="not-prose my-5 overflow-hidden rounded-md border border-edge-faint bg-canvas-alt">
      {steps.map((s, i) => (
        <div
          key={s.n}
          className={`grid grid-cols-[42px_1fr] gap-3 p-3 md:grid-cols-[56px_1fr] md:gap-4 md:p-4 ${
            i > 0 ? 'border-t border-edge-subtle' : ''
          }`}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-trace">
            {String(s.n).padStart(2, '0')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-ink">{s.label}</span>
              {s.hook && (
                <span className="rounded-sm border border-edge-dim px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-trace">
                  Hook
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <DocsLayout
      slug="lifecycle"
      title="Lifecycle"
      description="Understanding the journey from voice to action. Every recording flows through distinct phases, each with natural extension points where custom logic can plug in."
      toc={TOC}
    >
      <h2 id="overview">Overview</h2>
      <p>
        Talkie processes voice in two main flows: <strong>Dictation</strong> (real-time, handled by TalkieAgent) and{' '}
        <strong>Memos</strong> (deliberate recordings, handled by the main app). Both share similar phases but differ in
        timing and intent.
      </p>

      <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
        {FLOWS.map((f) => (
          <div key={f.code} className="rounded-md border border-edge-faint bg-canvas-alt p-5">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
              <span>{f.code} · {f.label}</span>
              <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-trace" />
            </div>
            <h3 className="mt-4 font-display text-xl font-normal leading-snug text-ink">{f.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{f.body}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-trace">{f.timing}</p>
          </div>
        ))}
      </div>

      <h2 id="dictation-lifecycle">Dictation Lifecycle</h2>
      <p>
        The dictation flow is optimized for speed. From hotkey press to text appearing, every millisecond counts.
        Here&rsquo;s the complete journey.
      </p>

      <LifecycleDiagram />

      <h3 id="phase-capture">Capture Phase</h3>
      <p>
        Audio flows from microphone to temporary file. Context is captured to know where you were when you started
        speaking. <em>~50ms setup.</em>
      </p>
      <StepList id="capture-steps" steps={CAPTURE_STEPS} />
      <blockquote>
        <strong>Hook · onCaptureStart.</strong> Inspect or modify the capture context. Could auto-route based on which
        app is active. <em>Fires after context captured, before audio starts.</em>
      </blockquote>

      <h3 id="phase-transcribe">Transcription Phase</h3>
      <p>
        Audio is sent to TalkieEngine for local Whisper transcription. The audio file is saved permanently first — your
        recording is never lost. <em>~300–800ms.</em>
      </p>
      <StepList id="transcribe-steps" steps={TRANSCRIBE_STEPS} />
      <blockquote>
        <strong>Hook · onTranscriptionComplete.</strong> Transform or validate the transcript. Apply custom corrections,
        filter content, or route differently based on what was said. <em>Fires after transcription, before routing.</em>
      </blockquote>

      <h3 id="phase-route">Routing Phase</h3>
      <p>
        The transcript reaches its destination — pasted into the active app, copied to clipboard, or routed to the
        scratchpad for editing. <em>~50ms.</em>
      </p>
      <StepList id="route-steps" steps={ROUTE_STEPS} />
      <blockquote>
        <strong>Hook · beforeRoute.</strong> Intercept before delivery. Could trigger different behavior based on
        keywords, app context, or custom rules. <em>Fires after routing decision, before text delivery.</em>
      </blockquote>

      <h3 id="phase-store">Storage Phase</h3>
      <p>
        The dictation is saved to the local database with full metadata. Available for search, review, and later
        processing. <em>~10ms.</em>
      </p>
      <StepList id="store-steps" steps={STORE_STEPS} />
      <blockquote>
        <strong>Hook · onDictationStored.</strong> React to completed dictations. Could trigger follow-up actions, sync
        to external services, or update statistics. <em>Fires after database write, before state reset.</em>
      </blockquote>

      <h2 id="memo-lifecycle">Memo Lifecycle</h2>
      <p>
        Memos are deliberate recordings that persist and get processed. Unlike dictation, memos trigger workflows that
        can summarize, extract tasks, or integrate with other systems.
      </p>

      <h3 id="memo-creation">Creation</h3>
      <p>
        When you create a memo via the main Talkie app, the recording follows a similar path but ends differently.
      </p>

      <ol className="not-prose my-6 space-y-3">
        {MEMO_STAGES.map((m, i) => (
          <li key={m.code} className="grid grid-cols-[80px_1fr] items-start gap-3 rounded-md border border-edge-faint bg-canvas-alt p-4 md:grid-cols-[100px_1fr] md:p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-trace">
              {m.code}
              <div className="mt-1 text-ink-subtle">STAGE {String(i + 1).padStart(2, '0')}</div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">{m.label}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{m.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <h3 id="memo-workflows">Workflow Execution</h3>
      <p>
        Workflows are multi-step pipelines that process memo content. Each step can transform, extract, or route the
        content.
      </p>
      <ol>
        <li>Load workflow definition (JSON).</li>
        <li>Build context from memo (transcript, title, date).</li>
        <li>Execute steps sequentially. <em>(Hook point.)</em></li>
        <li>Each step output becomes available to the next step.</li>
        <li>Save workflow run record with results.</li>
      </ol>
      <p>
        Step types include <strong>LLM prompts</strong> (transform via AI), <strong>file actions</strong> (save to
        disk), <strong>clipboard</strong> (copy result), and <strong>webhooks</strong> (POST to external URL).
      </p>

      <h2 id="extension-points">Extension Points</h2>
      <p>
        These are the natural seams in the lifecycle where custom logic could be injected. They represent moments where
        the flow pauses, a decision is made, or data transforms.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-md border border-edge-faint bg-canvas-alt">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-edge-subtle">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">Hook</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">Phase</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">Use Cases</th>
            </tr>
          </thead>
          <tbody>
            {HOOKS.map(([hook, phase, uses], i) => (
              <tr key={hook} className={i > 0 ? 'border-t border-edge-subtle' : ''}>
                <td className="px-4 py-3 font-mono text-[12px] text-trace">{hook}</td>
                <td className="px-4 py-3 text-ink">{phase}</td>
                <td className="px-4 py-3 text-ink-muted">{uses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        These extension points aren&rsquo;t implemented yet — this is documenting where they <em>could</em> exist. The
        lifecycle naturally pauses at these moments, making them ideal for hooks.
      </p>

      <h2 id="next-steps">Continue Reading</h2>
      <p>
        Curious how a workflow actually composes those step types? Continue with{' '}
        <a href="/v2/docs/workflows">the workflows reference →</a>
      </p>
    </DocsLayout>
  )
}
