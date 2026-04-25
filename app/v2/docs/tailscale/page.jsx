import DocsLayout from '../../../../components/v2/docs/DocsLayout'
import DocsNotice from '../../../../components/v2/docs/DocsNotice'

export const metadata = {
  title: 'Tailscale — Talkie Docs',
  description:
    'Configure Tailscale to give your Mac and iPhone a stable, end-to-end-encrypted link with no port forwarding and no relay.',
  openGraph: {
    title: 'Tailscale — Talkie Docs',
    description: 'Stable peer-to-peer networking between Mac and iPhone.',
    images: [{ url: '/og/docs-tailscale.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-tailscale.png'],
  },
}

const toc = [
  { id: 'why', label: 'Why Tailscale', level: 2 },
  { id: 'how-it-works', label: 'How it works', level: 2 },
  { id: 'setup', label: 'Setup', level: 2 },
  { id: 'step-1', label: '1. Account', level: 3 },
  { id: 'step-2', label: '2. Mac client', level: 3 },
  { id: 'step-3', label: '3. iPhone client', level: 3 },
  { id: 'step-4', label: '4. Pair in Talkie', level: 3 },
  { id: 'troubleshooting', label: 'Troubleshooting', level: 2 },
  { id: 'next', label: 'Next', level: 2 },
]

// ---------------------------------------------------------------------------
// Tunnel diagram — Mac ⇄ Tailscale fabric ⇄ iPhone, with a control-plane
// note above the data path. Server-rendered SVG.
// ---------------------------------------------------------------------------
function TailscaleTunnel() {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-sm border border-edge-faint bg-canvas p-5">
        <svg
          viewBox="0 0 720 280"
          role="img"
          aria-label="Tailscale tunnel between Mac and iPhone"
          className="block w-full h-auto"
        >
          <defs>
            <pattern id="ts-grat" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--trace-faint)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="720" height="280" fill="url(#ts-grat)" />

          <g fontFamily="var(--font-mono)">
            {/* Title */}
            <text x="24" y="28" fill="var(--ink-faint)" fontSize="10" letterSpacing="3">
              FIG. 03 — TAILSCALE PRIVATE NETWORK
            </text>
            <line x1="24" y1="40" x2="696" y2="40" stroke="var(--edge-faint)" />

            {/* Control plane row */}
            <g transform="translate(260, 70)">
              <rect
                x="0"
                y="0"
                width="200"
                height="44"
                fill="var(--canvas-alt)"
                stroke="var(--edge-faint)"
                rx="2"
                strokeDasharray="3 3"
              />
              <text x="100" y="18" fill="var(--ink-faint)" fontSize="9" textAnchor="middle" letterSpacing="2">
                · CONTROL PLANE
              </text>
              <text x="100" y="34" fill="var(--ink-muted)" fontSize="11" textAnchor="middle">
                tailscale.com — coordinates only
              </text>
            </g>

            {/* Mac */}
            <g transform="translate(60, 160)">
              <rect
                x="0"
                y="0"
                width="180"
                height="80"
                fill="var(--surface)"
                stroke="var(--edge)"
                rx="2"
              />
              <text x="14" y="22" fill="var(--trace)" fontSize="10" letterSpacing="2">
                · MAC
              </text>
              <text x="14" y="44" fill="var(--ink)" fontSize="13">
                100.x.y.z
              </text>
              <text x="14" y="62" fill="var(--ink-muted)" fontSize="10">
                tailscale0 · WireGuard
              </text>
            </g>

            {/* iPhone */}
            <g transform="translate(480, 160)">
              <rect
                x="0"
                y="0"
                width="180"
                height="80"
                fill="var(--surface)"
                stroke="var(--edge)"
                rx="2"
              />
              <text x="14" y="22" fill="var(--trace)" fontSize="10" letterSpacing="2">
                · iPHONE
              </text>
              <text x="14" y="44" fill="var(--ink)" fontSize="13">
                100.a.b.c
              </text>
              <text x="14" y="62" fill="var(--ink-muted)" fontSize="10">
                tailscale0 · WireGuard
              </text>
            </g>

            {/* Direct tunnel */}
            <path
              d="M 240 200 L 480 200"
              stroke="var(--trace)"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="240" cy="200" r="3.5" fill="var(--trace)" />
            <circle cx="480" cy="200" r="3.5" fill="var(--trace)" />
            <text x="360" y="192" fill="var(--ink)" fontSize="10" textAnchor="middle" letterSpacing="2">
              ENCRYPTED · DIRECT
            </text>
            <text x="360" y="216" fill="var(--ink-faint)" fontSize="9" textAnchor="middle" letterSpacing="2">
              your data — never visits tailscale.com
            </text>

            {/* Control links — dashed up to control plane */}
            <path
              d="M 150 160 C 150 130, 280 110, 320 114"
              stroke="var(--edge)"
              strokeWidth="1"
              strokeDasharray="2 4"
              fill="none"
            />
            <path
              d="M 570 160 C 570 130, 440 110, 400 114"
              stroke="var(--edge)"
              strokeWidth="1"
              strokeDasharray="2 4"
              fill="none"
            />

            {/* Footer hairline */}
            <line x1="24" y1="252" x2="696" y2="252" stroke="var(--edge-faint)" />
            <text x="24" y="268" fill="var(--ink-subtle)" fontSize="9" letterSpacing="3">
              CONTROL = METADATA · DATA = PEER-TO-PEER
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-subtle">
        FIG. 03 — Tailscale tunnel
      </figcaption>
    </figure>
  )
}

// Numbered step row, server-side. Mirrors bridge-setup so the two pages
// feel like a single flow.
function Step({ id, n, title, children }) {
  return (
    <li
      id={id}
      className="not-prose flex scroll-mt-24 gap-4 border-b border-edge-faint py-5 last:border-b-0"
    >
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
      slug="tailscale"
      title="Tailscale"
      description="Tailscale gives every device a stable address on a private mesh. It's how Talkie's iPhone client finds your Mac with no port forwarding and no cloud relay in the data path."
      toc={toc}
    >
      <DocsNotice variant="soon" title="Tailscale support is feature-flagged for now.">
        The page is here for direct linking; the in-app Tailscale switch is
        rolling out gradually. Behaviour described below tracks the public
        Tailscale clients.
      </DocsNotice>

      <h2 id="why">Why Tailscale</h2>
      <p>
        Phones move; Wi-Fi changes; carrier IPs are not yours. A regular
        local-network bridge fails the moment the iPhone leaves the house.
        Tailscale fixes this with a small, signed address that follows the
        device wherever it goes.
      </p>

      <div className="not-prose my-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-edge-faint bg-canvas p-4">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · END-TO-END ENCRYPTED
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
            WireGuard between your devices. Tailscale itself never sees your
            data — only the metadata needed to coordinate the link.
          </p>
        </div>
        <div className="rounded-sm border border-edge-faint bg-canvas p-4">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · WORKS ANYWHERE
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
            Home, office, café, cellular. No firewall changes, no DNS hacks,
            no static IP at home.
          </p>
        </div>
      </div>

      <DocsNotice variant="info" label="PRIVACY" title="Coordinator vs. data path">
        Tailscale's coordinator handshakes the keys, then steps out of the
        way. Your voice memos travel directly between your iPhone and your
        Mac.
      </DocsNotice>

      <h2 id="how-it-works">How it works</h2>
      <p>
        Each device gets a stable <code>100.x.y.z</code> address inside your
        private tailnet. Your Mac and iPhone use that address to reach each
        other through a WireGuard tunnel — usually direct, falling back to a
        relay only when both ends are stuck behind hostile NATs.
      </p>

      <TailscaleTunnel />

      <h2 id="setup">Setup</h2>
      <p>Four steps, twice as fast as setting up a printer.</p>

      <ol className="not-prose my-6 list-none space-y-0 rounded-sm border border-edge-faint bg-canvas px-5">
        <Step id="step-1" n={1} title="Create a Tailscale account">
          Sign up at{' '}
          <a href="https://tailscale.com" rel="noopener noreferrer">
            tailscale.com
          </a>
          {' '}with Google, Microsoft, GitHub, Apple, or email. The free tier
          covers 100 devices — far more than a personal tailnet needs.
        </Step>
        <Step id="step-2" n={2} title="Install on your Mac">
          Grab Tailscale from the{' '}
          <a
            href="https://apps.apple.com/app/tailscale/id1475387142"
            rel="noopener noreferrer"
          >
            Mac App Store
          </a>
          {' '}or directly from{' '}
          <a href="https://tailscale.com/download" rel="noopener noreferrer">
            tailscale.com/download
          </a>
          . Sign in; your Mac shows up in the admin console as a new machine.
        </Step>
        <Step id="step-3" n={3} title="Install on your iPhone">
          Install the{' '}
          <a
            href="https://apps.apple.com/app/tailscale/id1470499037"
            rel="noopener noreferrer"
          >
            iOS Tailscale app
          </a>
          {' '}and sign in with the same account. Both devices are now on the
          same private network.
        </Step>
        <Step id="step-4" n={4} title="Pair in Talkie">
          Open <strong>Settings → iPhone</strong>. Talkie detects the local
          tailnet, shows a QR code, and the iPhone client scans it to
          complete pairing.
        </Step>
      </ol>

      <DocsNotice variant="ok" label="LINKED">
        Once both devices show <code>Connected</code> in the Tailscale menu,
        Talkie can reach the iPhone over any network — Wi-Fi at home, LTE in
        the car, hotel guest network in the wild.
      </DocsNotice>

      <h2 id="troubleshooting">Troubleshooting</h2>

      <details className="not-prose my-3 rounded-sm border border-edge-faint bg-canvas">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[12px] tracking-[0.04em] text-ink hover:text-trace">
          <span className="mr-2 text-trace">›</span>
          Tailscale not running
        </summary>
        <div className="border-t border-edge-faint px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
          Open the Tailscale menu-bar icon and confirm it reads{' '}
          <code className="rounded border border-edge-faint bg-surface px-1 text-ink">
            Connected
          </code>
          . If it says{' '}
          <code className="rounded border border-edge-faint bg-surface px-1 text-ink">
            Disconnected
          </code>
          , click to reconnect.
        </div>
      </details>

      <details className="not-prose my-3 rounded-sm border border-edge-faint bg-canvas">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[12px] tracking-[0.04em] text-ink hover:text-trace">
          <span className="mr-2 text-trace">›</span>
          No peers found
        </summary>
        <div className="border-t border-edge-faint px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
          Both devices need to be signed into the same tailnet. Cross-check
          the admin console at{' '}
          <a className="text-trace underline" href="https://login.tailscale.com/admin/machines">
            login.tailscale.com/admin
          </a>
          {' '}— if either device is missing, sign in again on that device.
        </div>
      </details>

      <details className="not-prose my-3 rounded-sm border border-edge-faint bg-canvas">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[12px] tracking-[0.04em] text-ink hover:text-trace">
          <span className="mr-2 text-trace">›</span>
          Connection times out
        </summary>
        <div className="border-t border-edge-faint px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
          Some networks (hotel Wi-Fi, locked-down corporate VLANs) block UDP.
          As a quick test, switch the iPhone to LTE — if the link comes up
          there, the Wi-Fi is the constraint, not Tailscale.
        </div>
      </details>

      <details className="not-prose my-3 rounded-sm border border-edge-faint bg-canvas">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[12px] tracking-[0.04em] text-ink hover:text-trace">
          <span className="mr-2 text-trace">›</span>
          Needs login
        </summary>
        <div className="border-t border-edge-faint px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
          Long-idle Tailscale sessions expire on purpose. Open the app on the
          flagged device and re-authenticate.
        </div>
      </details>

      <h2 id="next">Next</h2>
      <p>
        Once the tunnel is up, the rest is in Talkie itself. Head back to{' '}
        <a href="/v2/docs/bridge-setup">Bridge Setup</a> if you skipped the
        TalkieServer install, or browse the <a href="/v2/docs">docs index</a>{' '}
        for the next topic.
      </p>
    </DocsLayout>
  )
}
