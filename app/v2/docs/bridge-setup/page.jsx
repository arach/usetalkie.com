import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import DocsNotice from '../../../../components/v2/docs/DocsNotice'
import DocsCodeBlock from '../../../../components/v2/docs/DocsCodeBlock'

export const metadata = {
  title: 'Bridge Setup — Talkie Docs',
  description:
    'Install and run TalkieServer, the local bridge that lets your iPhone reach your Mac. Bun runtime, dependency manifest, and step-by-step install.',
  openGraph: {
    title: 'Bridge Setup — Talkie Docs',
    description: 'Local bridge between Mac and iPhone via Bun + TalkieServer.',
    images: [{ url: '/og/docs-bridge-setup.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-bridge-setup.png'],
  },
}

const toc = [
  { id: 'what-is-talkieserver', label: 'What it is', level: 2 },
  { id: 'topology', label: 'Topology', level: 2 },
  { id: 'prerequisites', label: 'Prerequisites', level: 2 },
  { id: 'dependencies', label: 'Dependencies', level: 2 },
  { id: 'install', label: 'Install', level: 2 },
  { id: 'manual', label: 'Manual install', level: 2 },
  { id: 'troubleshooting', label: 'Troubleshooting', level: 2 },
  { id: 'next', label: 'Next', level: 2 },
]

// ---------------------------------------------------------------------------
// Device topology — Mac running TalkieServer, iPhone, dotted tunnel between
// them. Pure SVG. Themes via CSS vars.
// ---------------------------------------------------------------------------
function BridgeTopology() {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-sm border border-edge-faint bg-canvas p-5">
        <svg
          viewBox="0 0 720 260"
          role="img"
          aria-label="TalkieServer device topology"
          className="block w-full h-auto"
        >
          <defs>
            <pattern id="bridge-grat" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--trace-faint)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="720" height="260" fill="url(#bridge-grat)" />

          <g fontFamily="var(--font-mono)">
            {/* Title */}
            <text x="24" y="28" fill="var(--ink-faint)" fontSize="10" letterSpacing="3">
              FIG. 02 — LOCAL BRIDGE TOPOLOGY
            </text>
            <line x1="24" y1="40" x2="696" y2="40" stroke="var(--edge-faint)" />

            {/* Mac chassis */}
            <g transform="translate(60, 80)">
              <rect
                x="0"
                y="0"
                width="240"
                height="120"
                fill="var(--surface)"
                stroke="var(--edge)"
                rx="2"
              />
              <text x="14" y="22" fill="var(--trace)" fontSize="10" letterSpacing="2">
                · MAC
              </text>
              <text x="14" y="48" fill="var(--ink)" fontSize="13">
                Talkie.app
              </text>
              {/* Inner chip — TalkieServer */}
              <rect
                x="14"
                y="60"
                width="212"
                height="46"
                fill="var(--canvas-alt)"
                stroke="var(--edge-faint)"
                rx="1"
              />
              <text x="22" y="78" fill="var(--trace)" fontSize="9" letterSpacing="2">
                · TALKIESERVER
              </text>
              <text x="22" y="96" fill="var(--ink-muted)" fontSize="11">
                bun · elysia · :8765
              </text>
            </g>

            {/* iPhone */}
            <g transform="translate(540, 70)">
              <rect
                x="0"
                y="0"
                width="120"
                height="140"
                fill="var(--surface)"
                stroke="var(--edge)"
                rx="10"
              />
              <rect
                x="10"
                y="20"
                width="100"
                height="100"
                fill="var(--canvas-alt)"
                stroke="var(--edge-faint)"
                rx="2"
              />
              <text x="50" y="14" fill="var(--ink-faint)" fontSize="9" letterSpacing="2" textAnchor="middle">
                · iPHONE
              </text>
              <text x="60" y="56" fill="var(--ink)" fontSize="12" textAnchor="middle">
                Talkie
              </text>
              <text x="60" y="74" fill="var(--ink-faint)" fontSize="10" textAnchor="middle">
                iOS app
              </text>
              <text x="60" y="100" fill="var(--trace)" fontSize="9" textAnchor="middle" letterSpacing="2">
                paired
              </text>
              <text x="60" y="134" fill="var(--ink-subtle)" fontSize="9" letterSpacing="2" textAnchor="middle">
                ⌒
              </text>
            </g>

            {/* Tunnel */}
            <path
              d="M 300 140 L 540 140"
              stroke="var(--trace)"
              strokeWidth="1.25"
              strokeDasharray="4 4"
              fill="none"
            />
            <circle cx="300" cy="140" r="3" fill="var(--trace)" />
            <circle cx="540" cy="140" r="3" fill="var(--trace)" />
            <text x="420" y="132" fill="var(--ink-faint)" fontSize="9" textAnchor="middle" letterSpacing="3">
              HTTP · LAN or Tailscale
            </text>
            <text x="420" y="156" fill="var(--ink-subtle)" fontSize="9" textAnchor="middle" letterSpacing="2">
              tweetnacl handshake
            </text>

            {/* Footer hairline */}
            <line x1="24" y1="232" x2="696" y2="232" stroke="var(--edge-faint)" />
            <text x="24" y="248" fill="var(--ink-subtle)" fontSize="9" letterSpacing="3">
              SIGNAL STAYS LOCAL — no relay, no third-party server
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
        FIG. 02 — Device bridge topology
      </figcaption>
    </figure>
  )
}

// Numbered step row, server-side.
function Step({ n, title, children }) {
  return (
    <li className="not-prose flex gap-4 border-b border-edge-faint py-5 last:border-b-0">
      <div
        aria-hidden
        className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-edge font-mono text-[11px] tracking-[0.04em] text-trace"
        style={{
          background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
          textShadow: '0 0 4px var(--trace-glow)',
        }}
      >
        {String(n).padStart(2, '0')}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink">
          {title}
        </p>
        <div className="mt-2 text-[13.5px] leading-relaxed text-ink-muted [&_a]:text-trace [&_a]:underline [&_code]:rounded [&_code]:border [&_code]:border-edge-faint [&_code]:bg-surface [&_code]:px-1 [&_code]:py-px [&_code]:text-[0.92em] [&_code]:text-ink">
          {children}
        </div>
      </div>
    </li>
  )
}

export default function Page() {
  return (
    <DocsLayout
      slug="bridge-setup"
      title="Bridge Setup"
      description="TalkieServer is the local TypeScript service that lets your iPhone reach your Mac. It runs on Bun, lives inside the app bundle, and never phones home."
      toc={toc}
    >
      <DocsNotice variant="soon" title="The pairing UI is still landing.">
        The bridge itself is shipping; the in-app onboarding flow described
        below is rolling out behind a feature flag. Steps may shuffle slightly
        before the public release.
      </DocsNotice>

      <h2 id="what-is-talkieserver">What it is</h2>
      <p>
        TalkieServer is a small TypeScript service that lives inside Talkie's
        app bundle. It opens a local HTTP endpoint your iPhone can reach over
        your LAN — or, when you're roaming, over Tailscale.
      </p>
      <ul>
        <li>
          <strong>Pairing</strong> — a cryptographic handshake binds an iPhone
          to a Mac the first time they meet.
        </li>
        <li>
          <strong>Sync</strong> — voice memos captured on iPhone stream to the
          Mac for transcription and storage.
        </li>
        <li>
          <strong>Local-only</strong> — every byte stays on your network. No
          relay, no inbox, no Talkie servers in the path.
        </li>
      </ul>

      <h2 id="topology">Topology</h2>
      <p>
        At a glance: the Mac runs the bridge, the iPhone runs a thin client,
        and a tunnel sits between them. The tunnel is plain LAN HTTP at home,
        WireGuard via Tailscale on the road.
      </p>

      <BridgeTopology />

      <h2 id="prerequisites">Prerequisites</h2>
      <p>
        Talkie runs the bridge on <a href="https://bun.sh">Bun</a>, a fast
        JavaScript runtime. If Bun isn't already installed, Talkie will
        prompt you the first time you enable iPhone sync.
      </p>

      <DocsNotice variant="info" label="INSTALL BUN" title="Install Bun (one line)">
        <code>curl -fsSL https://bun.sh/install | bash</code>
        <br />
        Talkie can run this for you, or you can do it yourself in a terminal.
      </DocsNotice>

      <h2 id="dependencies">Dependencies</h2>
      <p>
        When you flip the switch the first time, Talkie runs{' '}
        <code>bun install</code> inside the bridge directory. Three packages
        land on disk; nothing global is touched.
      </p>

      <div className="not-prose my-5 overflow-hidden rounded-sm border border-edge-faint">
        <table className="w-full font-mono text-[12.5px]">
          <thead className="bg-surface">
            <tr className="text-left">
              <th className="border-b border-edge-faint px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                Package
              </th>
              <th className="border-b border-edge-faint px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-edge-faint">
              <td className="px-4 py-2 text-trace">elysia</td>
              <td className="px-4 py-2 text-ink-muted">Fast HTTP server framework.</td>
            </tr>
            <tr className="border-b border-edge-faint">
              <td className="px-4 py-2 text-trace">@elysiajs/cors</td>
              <td className="px-4 py-2 text-ink-muted">CORS handling for iPhone clients.</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-trace">tweetnacl</td>
              <td className="px-4 py-2 text-ink-muted">
                Public-key crypto for the pairing handshake.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocsNotice variant="ok" label="ISOLATED" title="No global side effects">
        All three packages install inside the TalkieServer directory. They
        cannot collide with system Node, Homebrew, or anything in your{' '}
        <code>~/.bun</code>.
      </DocsNotice>

      <h2 id="install">Install</h2>
      <p>The guided path takes about a minute on a fresh Mac.</p>

      <ol className="not-prose my-6 list-none space-y-0 rounded-sm border border-edge-faint bg-canvas px-5">
        <Step n={1} title="Open Talkie Settings">
          Click the menu-bar icon and choose <strong>Settings</strong>, or
          press <code>⌘,</code>.
        </Step>
        <Step n={2} title="Pick the iPhone tab">
          The sidebar entry sits between <em>Audio</em> and <em>Workflows</em>.
        </Step>
        <Step n={3} title="Enable iPhone Sync">
          Talkie checks Bun, dependencies, and port availability. Anything
          missing prompts inline.
        </Step>
        <Step n={4} title="Install dependencies">
          When prompted, click <strong>Install Dependencies</strong>. Talkie
          runs <code>bun install</code> in place.
        </Step>
        <Step n={5} title="Start the server">
          The bridge boots automatically. A green dot in the iPhone tab
          confirms <code>:8765</code> is live.
        </Step>
      </ol>

      <h2 id="manual">Manual install</h2>
      <p>
        If you'd rather wire it up yourself — or you're debugging a broken
        install — every step the GUI runs is exposed:
      </p>

      <DocsCodeBlock caption="Terminal" lang="bash">
{`# 1. Move into the bundled TalkieServer directory
cd ~/Library/Application\\ Support/Talkie/TalkieServer

# 2. Install local dependencies
bun install

# 3. (Optional) Boot the server in the foreground for live logs
bun run src/server.ts`}
      </DocsCodeBlock>

      <h2 id="troubleshooting">Troubleshooting</h2>

      <details className="not-prose my-3 rounded-sm border border-edge-faint bg-canvas">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[12px] tracking-[0.04em] text-ink hover:text-trace">
          <span className="mr-2 text-trace">›</span>
          Bun not found
        </summary>
        <div className="border-t border-edge-faint px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
          Install Bun from{' '}
          <a className="text-trace underline" href="https://bun.sh">
            bun.sh
          </a>
          , then quit and reopen Talkie so it picks up the new{' '}
          <code className="rounded border border-edge-faint bg-surface px-1 text-ink">PATH</code>.
        </div>
      </details>

      <details className="not-prose my-3 rounded-sm border border-edge-faint bg-canvas">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[12px] tracking-[0.04em] text-ink hover:text-trace">
          <span className="mr-2 text-trace">›</span>
          Cannot find package &quot;elysia&quot;
        </summary>
        <div className="border-t border-edge-faint px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
          The dependency install didn&apos;t complete. Click{' '}
          <strong>Install Dependencies</strong> in Settings → iPhone, or run{' '}
          <code className="rounded border border-edge-faint bg-surface px-1 text-ink">bun install</code>{' '}
          inside the TalkieServer directory.
        </div>
      </details>

      <details className="not-prose my-3 rounded-sm border border-edge-faint bg-canvas">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[12px] tracking-[0.04em] text-ink hover:text-trace">
          <span className="mr-2 text-trace">›</span>
          Port 8765 already in use
        </summary>
        <div className="border-t border-edge-faint px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
          Another process is sitting on the port. Quit Talkie, wait a couple
          of seconds, then reopen it — Talkie cleans up stray children at
          launch.
        </div>
      </details>

      <h2 id="next">Next</h2>
      <p>
        With the bridge running, the last piece is the network underneath.
        Tailscale gives the iPhone a stable address for the Mac no matter
        which Wi-Fi (or cellular) you&apos;re on.
      </p>
      <p>
        → <a href="/v2/docs/tailscale">Configure Tailscale</a>
      </p>
    </DocsLayout>
  )
}
