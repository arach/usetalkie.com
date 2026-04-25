import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import { SimpleArchitectureDiagram } from '../../../../components/v2/docs/ArchitectureDiagram'

export const metadata = {
  title: 'Overview — Talkie Docs',
  description:
    "Introduction to Talkie's philosophy, local-first design, and multi-process architecture. Learn how privacy and performance work together.",
  openGraph: {
    title: 'Overview — Talkie Docs',
    description: 'Philosophy, local-first design, and multi-process architecture.',
    images: [{ url: '/og/docs-overview.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-overview.png'],
  },
}

const TOC = [
  { id: 'philosophy',         label: 'Philosophy',                  level: 2 },
  { id: 'design-principles',  label: 'Design Principles',           level: 2 },
  { id: 'local-first',        label: 'Local-First Design',          level: 2 },
  { id: 'multi-process',      label: 'Multi-Process Architecture',  level: 2 },
  { id: 'communication',      label: 'How Components Communicate',  level: 2 },
  { id: 'xpc',                label: 'XPC',                         level: 3 },
  { id: 'http',               label: 'HTTP',                        level: 3 },
  { id: 'next-steps',         label: 'Continue Reading',            level: 2 },
]

const PRINCIPLES = [
  {
    n: '01',
    title: 'Everything is a file',
    body: 'Your data lives in readable formats on disk. SQLite databases, JSON exports, audio files — all accessible and portable.',
  },
  {
    n: '02',
    title: 'Small, focused data stores',
    body: 'Each component owns its data. Memos in one place, live dictations in another. Clear boundaries, easy to reason about.',
  },
  {
    n: '03',
    title: 'Data stores exposed by default',
    body: 'No opaque containers. Browse your recordings, query your databases, export anything. Your data, your access.',
  },
  {
    n: '04',
    title: 'Well-defined lifecycles',
    body: 'Every recording flows through clear phases — capture, transcription, routing, storage — each with hooks where custom logic can plug in.',
  },
  {
    n: '05',
    title: 'Protect the critical path',
    body: 'Recording and transcription are sacred. Nothing should block them — not sync, not workflows, not UI rendering. The happy path is always fast.',
  },
  {
    n: '06',
    title: 'Smart defaults, full control',
    body: 'Talkie works great out of the box. When you want to customize — workflows, shortcuts, data locations, export formats — everything is configurable.',
  },
]

const PILLARS = [
  {
    code: 'P-01',
    label: 'LOCAL-FIRST',
    title: 'Voice never leaves the device',
    body: 'Transcription happens on your Mac. No upload, no API key, no cloud round-trip.',
  },
  {
    code: 'P-02',
    label: 'PRIVATE BY DESIGN',
    title: 'No accounts. No telemetry tax.',
    body: 'No cloud processing required. No accounts needed. Your data is yours.',
  },
  {
    code: 'P-03',
    label: 'TRANSPARENT',
    title: 'No black boxes',
    body: 'Every process is observable. Every store is browseable. Every step has a name.',
  },
]

export default function Page() {
  return (
    <DocsLayout
      slug="overview"
      title="Overview"
      description="Talkie is a voice-first productivity suite for macOS. Built with privacy at its core, it processes everything locally while maintaining a seamless experience across devices."
      toc={TOC}
    >
      <h2 id="philosophy">Philosophy</h2>
      <p>
        Talkie is designed around three core pillars that guide every architectural decision. They aren&rsquo;t marketing
        — they fundamentally shape how the app works.
      </p>

      <div className="not-prose my-6 grid gap-4 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div
            key={p.code}
            className="relative rounded-md border border-edge-faint bg-canvas-alt p-4"
          >
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
              <span>{p.code} · {p.label}</span>
              <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-trace" />
            </div>
            <h3 className="mt-4 font-display text-lg font-normal leading-snug text-ink">{p.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{p.body}</p>
          </div>
        ))}
      </div>

      <h2 id="design-principles">Design Principles</h2>
      <p>
        We treat every user as a potential developer. These principles guide how we build Talkie — visibility and control
        over everything, with smart defaults so you don&rsquo;t have to think about them.
      </p>

      <div className="not-prose my-6 divide-y divide-edge-subtle overflow-hidden rounded-md border border-edge-faint bg-canvas-alt">
        {PRINCIPLES.map((p) => (
          <div key={p.n} className="grid grid-cols-[64px_1fr] gap-4 p-4 md:grid-cols-[80px_1fr] md:gap-6 md:p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-trace">{p.n}</div>
            <div>
              <h4 className="font-display text-base font-normal text-ink">{p.title}</h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="local-first">Local-First Design</h2>
      <p>
        &ldquo;Local-first&rdquo; means your data lives on your device first, always. The cloud is optional, not required.
        That has real implications:
      </p>
      <ul>
        <li><strong>Works offline.</strong> Record, transcribe, and create memos without internet.</li>
        <li><strong>Instant startup.</strong> No waiting for cloud connections or sync.</li>
        <li><strong>You own your data.</strong> Readable formats, on your disk, exportable anywhere.</li>
        <li><strong>No accounts required.</strong> Start using Talkie immediately.</li>
      </ul>
      <p>
        When you do enable sync (like iCloud), it&rsquo;s additive. The app works perfectly without it, and sync just keeps
        your devices in harmony.
      </p>

      <h2 id="multi-process">Multi-Process Architecture</h2>
      <p>
        Most apps run as a single process. Talkie splits responsibilities across multiple specialized ones. The cost is
        a little extra plumbing; the upside is reliability, security, and performance you can audit.
      </p>

      <SimpleArchitectureDiagram />

      <p><strong>Why multiple processes?</strong></p>
      <ul>
        <li><strong>Fault isolation.</strong> If one component crashes, others keep running.</li>
        <li><strong>Security boundaries.</strong> Each process has only the permissions it needs.</li>
        <li><strong>Resource management.</strong> Heavy transcription work doesn&rsquo;t block the UI.</li>
        <li><strong>Independent updates.</strong> Components can evolve separately.</li>
      </ul>

      <h2 id="communication">How Components Communicate</h2>
      <p>
        The processes talk to each other using two transports, each chosen for specific reasons.
      </p>

      <h3 id="xpc">XPC</h3>
      <p>
        XPC is Apple&rsquo;s secure inter-process communication mechanism. It provides automatic process lifecycle
        management, type-safe messaging, and sandboxing support. <strong>Talkie ↔ TalkieAgent ↔ TalkieEngine</strong>{' '}
        all use XPC.
      </p>

      <h3 id="http">HTTP</h3>
      <p>
        TalkieServer exposes HTTP endpoints that the iPhone app connects to. All traffic flows over Tailscale&rsquo;s
        encrypted WireGuard tunnel — cross-device sync without any cloud intermediary.{' '}
        <strong>TalkieServer ↔ iPhone</strong> uses HTTP.
      </p>

      <h2 id="next-steps">Continue Reading</h2>
      <p>Ready to go deeper? The architecture docs explain each component in detail.</p>

      <p>
        <a href="/v2/docs/architecture">Architecture deep dive →</a>
      </p>
    </DocsLayout>
  )
}
