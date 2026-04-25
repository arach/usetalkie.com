import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import ArchitectureDiagram from '../../../../components/v2/docs/ArchitectureDiagram'

export const metadata = {
  title: 'Architecture — Talkie Docs',
  description:
    "Deep dive into Talkie's multi-process architecture. Understand how Talkie, TalkieAgent, TalkieEngine, and TalkieServer work together.",
  openGraph: {
    title: 'Architecture — Talkie Docs',
    description: 'How Talkie, TalkieAgent, TalkieEngine, and TalkieServer work together.',
    images: [{ url: '/og/docs-architecture.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-architecture.png'],
  },
}

const TOC = [
  { id: 'system-overview', label: 'System Overview',     level: 2 },
  { id: 'components',      label: 'Components',          level: 2 },
  { id: 'talkie',          label: 'Talkie',              level: 3 },
  { id: 'talkieagent',     label: 'TalkieAgent',         level: 3 },
  { id: 'talkieengine',    label: 'TalkieEngine',        level: 3 },
  { id: 'talkieserver',    label: 'TalkieServer',        level: 3 },
  { id: 'xpc',             label: 'XPC Communication',   level: 2 },
  { id: 'lifecycle',       label: 'Process Lifecycle',   level: 2 },
  { id: 'next-steps',      label: 'Continue Reading',    level: 2 },
]

const COMPONENTS = [
  {
    id: 'talkie',
    code: 'CH-01',
    name: 'Talkie',
    subtitle: 'Main Application · Swift / SwiftUI',
    duties: [
      'User interface and settings',
      'Workflow orchestration and execution',
      'Data management (GRDB database)',
      'Process lifecycle for helper processes',
    ],
  },
  {
    id: 'talkieagent',
    code: 'CH-02',
    name: 'TalkieAgent',
    subtitle: 'Always-on voice recorder · Swift',
    duties: [
      'Microphone capture and audio processing',
      'Live dictation with real-time feedback',
      'Keyboard simulation for text insertion',
      'Hotkey handling and interstitial UI',
    ],
  },
  {
    id: 'talkieengine',
    code: 'CH-03',
    name: 'TalkieEngine',
    subtitle: 'Transcription engine · Swift',
    duties: [
      'Local Whisper model management',
      'Audio-to-text transcription',
      'Model downloading and caching',
      'GPU acceleration via Metal (when available)',
    ],
  },
  {
    id: 'talkieserver',
    code: 'CH-04',
    name: 'TalkieServer',
    subtitle: 'iOS bridge · TypeScript / Bun',
    duties: [
      'HTTP API for iOS app communication',
      'Device pairing and authentication',
      'Voice recording sync from iPhone / Apple Watch',
      'Tailscale network integration',
    ],
  },
]

export default function Page() {
  return (
    <DocsLayout
      slug="architecture"
      title="Architecture"
      description="A deep dive into Talkie's multi-process architecture. Each component has a single responsibility, making the system reliable and maintainable."
      toc={TOC}
    >
      <h2 id="system-overview">System Overview</h2>
      <p>
        Talkie&rsquo;s architecture separates concerns across multiple processes. This isn&rsquo;t complexity for
        complexity&rsquo;s sake — it provides real benefits: fault isolation, security boundaries, and the ability to evolve
        components independently.
      </p>

      <ArchitectureDiagram />

      <p>
        The main Talkie app is the orchestrator — it manages the UI, workflows, and data. The helper processes
        (TalkieAgent, TalkieEngine, TalkieServer) handle specific tasks that benefit from isolation.
      </p>

      <h2 id="components">Components</h2>
      <p>Each component has a clear responsibility and communicates through well-defined interfaces.</p>

      <div className="not-prose my-6 grid gap-4">
        {COMPONENTS.map((c) => (
          <div
            key={c.id}
            id={c.id}
            className="scroll-mt-24 rounded-md border border-edge-faint bg-canvas-alt p-5 md:p-6"
          >
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ink-subtle">
              <span>{c.code} · CHANNEL</span>
              <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-trace" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-normal leading-tight tracking-[-0.01em] text-ink">
              {c.name}
            </h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {c.subtitle}
            </p>
            <ul className="mt-4 space-y-1.5 text-[13px] leading-relaxed text-ink-muted">
              {c.duties.map((d) => (
                <li key={d} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-trace" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 id="xpc">XPC Communication</h2>
      <p>
        XPC (Cross-Process Communication) is Apple&rsquo;s secure mechanism for processes to talk to each other. Talkie
        uses XPC to communicate with TalkieAgent and TalkieEngine.
      </p>

      <p><strong>Why XPC?</strong></p>
      <ul>
        <li><strong>Security.</strong> Each process runs with minimal permissions.</li>
        <li><strong>Crash isolation.</strong> A helper crash doesn&rsquo;t take down the main app.</li>
        <li><strong>Lifecycle management.</strong> macOS handles process start and stop.</li>
        <li><strong>Type safety.</strong> Protocol-based communication with compile-time checks.</li>
      </ul>

      <p>
        When you start a dictation, Talkie sends an XPC message to TalkieAgent. TalkieAgent captures audio, sends it to
        TalkieEngine for transcription, and simulates keyboard input with the result — all without the main app needing
        microphone or accessibility permissions.
      </p>

      <h2 id="lifecycle">Process Lifecycle</h2>
      <p>Helper processes are managed by launchd, macOS&rsquo;s service manager. That means:</p>
      <ul>
        <li><strong>On-demand start.</strong> Helpers launch when needed, not at login.</li>
        <li><strong>Automatic restart.</strong> If a helper crashes, launchd restarts it.</li>
        <li><strong>Resource efficiency.</strong> Idle helpers use minimal resources.</li>
        <li><strong>Clean shutdown.</strong> Helpers terminate when Talkie quits.</li>
      </ul>
      <p>
        You can see the helper processes in Activity Monitor: look for TalkieAgent, TalkieEngine, and TalkieServer (when
        iPhone sync is enabled).
      </p>

      <h2 id="next-steps">Continue Reading</h2>
      <p>
        Want to follow a recording from microphone to memo? Read{' '}
        <a href="/v2/docs/lifecycle">the lifecycle deep dive →</a>
      </p>
    </DocsLayout>
  )
}
