import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Cpu,
  Database,
  HardDrive,
  CloudOff,
  Eye,
  EyeOff,
  Check,
  X,
  ExternalLink,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Content data
// ---------------------------------------------------------------------------

const STORED_ITEMS = [
  'Voice memos (locally, on your device)',
  'Transcripts (locally, in SQLite)',
  'Your library index (encrypted on disk)',
  'API keys you provide (macOS Keychain only)',
  'iCloud sync data (your Private CloudKit DB)',
]

const NOT_STORED_ITEMS = [
  'Audio files on Talkie servers',
  'Transcripts on Talkie servers',
  'Your API keys on Talkie servers',
  'Any library content on Talkie servers',
  'Usage telemetry linked to your content',
]

const PRINCIPLES = [
  {
    num: '01',
    title: 'On-device first',
    icon: HardDrive,
    body:
      'Your data lives in a local SQLite database file on your device’s encrypted disk. It is not just “cached” locally; it is authoritative locally. Deleting the app deletes the data.',
  },
  {
    num: '02',
    title: 'You own the keys',
    icon: KeyRound,
    body:
      'We use Apple’s CloudKit for sync. Your data is encrypted with keys managed by your Apple ID. We (Talkie Systems) have no access to these keys and cannot decrypt your data.',
  },
  {
    num: '03',
    title: 'On-device transcription',
    icon: Cpu,
    body:
      'Transcription can stay 100% on device using Apple silicon. For later transformations, you can keep using local models or opt into external providers only when you choose to.',
  },
  {
    num: '04',
    title: 'BYO providers',
    icon: KeyRound,
    body:
      'When you use an external provider, audio can stay on your device and only the text you choose to send leaves the machine. That keeps the trust boundary clear. Your keys are stored in the macOS Keychain and accessed only at runtime to sign requests.',
  },
  {
    num: '05',
    title: 'Audit trails',
    icon: Eye,
    body:
      'Every network request initiated by a workflow is logged in a local, immutable audit trail. You can inspect exactly what text was sent to which API and when.',
  },
]

const COMPARISON_ROWS = [
  { feature: 'Audio Processing', talkie: 'Local (Neural Engine)', other: 'Cloud Server' },
  { feature: 'Database Location', talkie: 'Local Disk + iCloud', other: 'Vendor’s Cloud SQL' },
  { feature: 'Offline Access', talkie: '100% Full Functionality', other: 'Limited / None' },
  { feature: 'Model Training', talkie: 'Never', other: 'Default Opt-in' },
  { feature: 'API Key Ownership', talkie: 'User Owned', other: 'Vendor Owned' },
]

// ---------------------------------------------------------------------------
// Reusable atoms
// ---------------------------------------------------------------------------

/**
 * Graticule — fine-grid background overlay using CSS vars.
 * Inline style required: Tailwind can’t express linear-gradient pairs cleanly.
 */
function Graticule({ opacity = 0.3 }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage:
          'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
  )
}

function Eyebrow({ children }) {
  return (
    <p
      className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
      style={{ textShadow: '0 0 4px var(--trace-glow)' }}
    >
      {children}
    </p>
  )
}

function ExternalDocsLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-all hover:-translate-y-0.5 hover:text-ink hover:border-edge"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}

// ---------------------------------------------------------------------------
// SecBlock — single rectangle in the schematic, with optional pin labels.
// SVG paint goes via inline style (Tailwind can’t target stroke/fill cleanly).
// ---------------------------------------------------------------------------

const PIN_CLEARANCE = 14

function SecBlock({
  x,
  y,
  w,
  h,
  label,
  subLabel,
  pinsLeft = [],
  pinsRight = [],
  highlighted = false,
  dashed = false,
  amber = false,
}) {
  const stroke = highlighted
    ? 'var(--trace)'
    : amber
    ? 'var(--amber)'
    : dashed
    ? 'var(--ink-faint)'
    : 'var(--ink-muted)'
  const strokeWidth = highlighted ? 1.4 : 1
  const fill = highlighted
    ? 'var(--trace-faint)'
    : amber
    ? 'color-mix(in oklab, var(--amber) 6%, transparent)'
    : 'transparent'
  const labelFill = highlighted
    ? 'var(--trace)'
    : amber
    ? 'var(--amber)'
    : 'var(--ink)'

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '4 3' : undefined}
        style={highlighted ? { filter: 'drop-shadow(0 0 4px var(--trace-glow))' } : undefined}
      />

      <text
        x={x + w / 2}
        y={y + h / 2 - (subLabel ? 4 : 0)}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="10"
        fill={labelFill}
        textAnchor="middle"
        letterSpacing="1"
        style={highlighted ? { filter: 'drop-shadow(0 0 3px var(--trace-glow))' } : undefined}
      >
        {label}
      </text>

      {subLabel && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          fontFamily="ui-monospace, monospace"
          fontSize="7"
          fill="var(--ink-faint)"
          textAnchor="middle"
          letterSpacing="1"
        >
          {subLabel}
        </text>
      )}

      {pinsLeft.map((pin, i) => {
        const py = y + ((i + 1) * h) / (pinsLeft.length + 1)
        return (
          <g key={`l-${pin}-${i}`}>
            <line x1={x} y1={py} x2={x - 8} y2={py} stroke={stroke} strokeWidth="0.8" />
            <circle cx={x - 8} cy={py} r="1.5" fill={stroke} />
            <text
              x={x - PIN_CLEARANCE}
              y={py + 3}
              fontFamily="ui-monospace, monospace"
              fontSize="7"
              fill="var(--ink-faint)"
              letterSpacing="0.5"
              textAnchor="end"
            >
              {pin}
            </text>
          </g>
        )
      })}

      {pinsRight.map((pin, i) => {
        const py = y + ((i + 1) * h) / (pinsRight.length + 1)
        return (
          <g key={`r-${pin}-${i}`}>
            <line x1={x + w} y1={py} x2={x + w + 8} y2={py} stroke={stroke} strokeWidth="0.8" />
            <circle cx={x + w + 8} cy={py} r="1.5" fill={stroke} />
            <text
              x={x + w + PIN_CLEARANCE}
              y={py + 3}
              fontFamily="ui-monospace, monospace"
              fontSize="7"
              fill="var(--ink-faint)"
              letterSpacing="0.5"
              textAnchor="start"
            >
              {pin}
            </text>
          </g>
        )
      })}
    </g>
  )
}

// ---------------------------------------------------------------------------
// SecuritySchematic — pure SVG, server-rendered.
// Geometry constants re-derived. Paint references CSS vars directly so the
// figure flips colors with the theme without any client hooks.
// viewBox 0 0 720 320:
//   VOICE.IN  x=20  y=120  w=110 h=70
//   U1        x=178 y=80   w=148 h=90  (highlighted)
//   U2        x=178 y=200  w=148 h=70  (highlighted)
//   U3        x=370 y=175  w=138 h=65
//   OPT       x=558 y=72   w=138 h=70  (amber dashed)
//   OUT       x=558 y=192  w=138 h=70
// ---------------------------------------------------------------------------

function SecuritySchematic() {
  const V = { x: 20, y: 120, w: 110, h: 70 }
  const U1 = { x: 178, y: 80, w: 148, h: 90 }
  const U2 = { x: 178, y: 200, w: 148, h: 70 }
  const U3 = { x: 370, y: 175, w: 138, h: 65 }
  const OPT = { x: 558, y: 72, w: 138, h: 70 }
  const OUT = { x: 558, y: 192, w: 138, h: 70 }

  // Pin y-coordinates
  const vSigY = V.y + V.h / 2
  const u1SigY = U1.y + U1.h / 3
  const u1TxtY = U1.y + U1.h / 2
  const u2InY = U2.y + U2.h / 2
  const u2SyncY = U2.y + U2.h / 2
  const u3InY = U3.y + U3.h / 2
  const u3OutY = U3.y + U3.h / 2
  const optInY = OPT.y + OPT.h / 2
  const outInY = OUT.y + OUT.h / 2

  // Trace paths
  const voiceU1 = `M ${V.x + V.w} ${vSigY} L 152 ${vSigY} L 152 ${u1SigY} L ${U1.x} ${u1SigY}`
  const voiceU2 = `M ${V.x + V.w} ${vSigY} L 158 ${vSigY} L 158 ${u2InY} L ${U2.x} ${u2InY}`
  const u1Opt = `M ${U1.x + U1.w} ${u1TxtY} L 524 ${u1TxtY} L 524 ${optInY} L ${OPT.x} ${optInY}`
  const u1Out = `M ${U1.x + U1.w} ${u1TxtY + 16} L 534 ${u1TxtY + 16} L 534 ${outInY} L ${OUT.x} ${outInY}`
  const u2U3 = `M ${U2.x + U2.w} ${u2SyncY} L ${U3.x} ${u2SyncY}`
  const u3Out = `M ${U3.x + U3.w} ${u3OutY} L 540 ${u3OutY} L 540 ${outInY + 10} L ${OUT.x} ${outInY + 10}`

  // Net label positions
  const net01X = 144
  const net01Y = (vSigY + u1SigY) / 2 - 5
  const optLabelX = (U1.x + U1.w + OPT.x) / 2 - 26
  const optLabelY = u1TxtY - 6
  const netOutX = 537
  const netOutY = (u1TxtY + 16 + outInY) / 2 - 4

  return (
    <div className="relative w-full overflow-hidden rounded-sm border border-edge bg-surface">
      <Graticule opacity={0.5} />

      <div className="relative flex items-center justify-between border-b border-edge-dim px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        <span>SEC-01 / TALKIE.DATA.FLOW</span>
        <span>REV A.1</span>
      </div>

      <svg
        viewBox="0 0 720 320"
        className="relative block w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ height: 'auto' }}
      >
        <defs>
          <marker
            id="sec-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--trace)" />
          </marker>
          <marker
            id="sec-arrow-amber"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--amber)" />
          </marker>
        </defs>

        {/* Blocks */}
        <SecBlock
          x={V.x}
          y={V.y}
          w={V.w}
          h={V.h}
          label="VOICE.IN"
          subLabel="mic capture"
          pinsRight={['SIG']}
        />
        <SecBlock
          x={U1.x}
          y={U1.y}
          w={U1.w}
          h={U1.h}
          label="U1 · TRANSCRIPTION"
          subLabel="apple silicon / on-device"
          pinsLeft={['SIG']}
          pinsRight={['TXT']}
          highlighted
        />
        <SecBlock
          x={U2.x}
          y={U2.y}
          w={U2.w}
          h={U2.h}
          label="U2 · LOCAL STORE"
          subLabel="sqlite · encrypted disk"
          pinsLeft={['IN']}
          pinsRight={['SYNC']}
          highlighted
        />
        <SecBlock
          x={U3.x}
          y={U3.y}
          w={U3.w}
          h={U3.h}
          label="U3 · ICLOUD SYNC"
          subLabel="your apple-id · private db"
          pinsLeft={['IN']}
          pinsRight={['OUT']}
        />
        <SecBlock
          x={OPT.x}
          y={OPT.y}
          w={OPT.w}
          h={OPT.h}
          label="OPT · EXT.MODEL"
          subLabel="byo keys · text only"
          pinsLeft={['TXT']}
          dashed
          amber
        />
        <SecBlock
          x={OUT.x}
          y={OUT.y}
          w={OUT.w}
          h={OUT.h}
          label="OUT · YOU"
          subLabel="drafts · tasks · search"
          pinsLeft={['IN']}
        />

        {/* Traces */}
        <path
          d={voiceU1}
          fill="none"
          stroke="var(--trace)"
          strokeWidth="1.4"
          markerEnd="url(#sec-arrow)"
          style={{ filter: 'drop-shadow(0 0 2px var(--trace-glow))' }}
        />
        <path
          d={voiceU2}
          fill="none"
          stroke="var(--trace)"
          strokeWidth="1.0"
          strokeOpacity="0.65"
          markerEnd="url(#sec-arrow)"
        />
        <path
          d={u1Opt}
          fill="none"
          stroke="var(--amber)"
          strokeWidth="1"
          strokeDasharray="4 3"
          markerEnd="url(#sec-arrow-amber)"
        />
        <path
          d={u1Out}
          fill="none"
          stroke="var(--trace)"
          strokeWidth="1.4"
          markerEnd="url(#sec-arrow)"
          style={{ filter: 'drop-shadow(0 0 2px var(--trace-glow))' }}
        />
        <path
          d={u2U3}
          fill="none"
          stroke="var(--trace)"
          strokeWidth="1.0"
          strokeOpacity="0.65"
          markerEnd="url(#sec-arrow)"
        />
        <path
          d={u3Out}
          fill="none"
          stroke="var(--trace)"
          strokeWidth="1.0"
          strokeOpacity="0.65"
          markerEnd="url(#sec-arrow)"
        />

        {/* Net labels */}
        <text
          x={net01X}
          y={net01Y}
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          fill="var(--ink-faint)"
          letterSpacing="1"
          textAnchor="middle"
        >
          NET.01
        </text>
        <text
          x={optLabelX}
          y={optLabelY}
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          fill="var(--amber)"
          letterSpacing="1"
          textAnchor="middle"
        >
          OPT.TEXT.ONLY
        </text>
        <text
          x={netOutX}
          y={netOutY}
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          fill="var(--trace)"
          letterSpacing="1"
          textAnchor="start"
        >
          NET.OUT
        </text>

        {/* Legend */}
        <g transform="translate(20, 285)">
          <line x1="0" y1="4" x2="20" y2="4" stroke="var(--trace)" strokeWidth="1.4" />
          <text
            x="26"
            y="8"
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="var(--ink-faint)"
            letterSpacing="1"
          >
            solid = your data path · stays on your devices
          </text>
          <line
            x1="0"
            y1="20"
            x2="20"
            y2="20"
            stroke="var(--amber)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text
            x="26"
            y="24"
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="var(--ink-faint)"
            letterSpacing="1"
          >
            dashed = opt-in · byo keys · text only leaves device
          </text>
        </g>
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SecurityPage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <Graticule opacity={0.3} />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· TALKIE / SECURITY</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-ink md:text-5xl">
            Privacy is not a setting.
            <br />
            <span className="italic">It&apos;s the architecture.</span>
          </h1>
          <p
            className="mt-6 max-w-2xl border-l-2 border-trace pl-5 text-[15px] leading-relaxed text-ink-muted"
          >
            Talkie is built so unfinished thoughts stay on your devices by default. Your library lives
            locally, sync can run through your iCloud, transcription can stay on device, and external
            providers are opt-in with your own keys.
          </p>
        </div>
      </section>

      {/* ========== DATA-FLOW SCHEMATIC ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 01 / DATA FLOW</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            Where your data goes &mdash; and where it doesn&apos;t.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Solid traces are your data path. Dashed amber traces are opt-in only &mdash; text leaves the
            device solely when you explicitly route a workflow to an external provider.
          </p>

          <div className="mt-10">
            <SecuritySchematic />
          </div>
        </div>
      </section>

      {/* ========== STORED / NOT STORED ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 02 / DATA INVENTORY</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            What is stored. What is not.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Stored */}
            <div className="relative overflow-hidden rounded-sm border border-edge bg-surface p-6">
              <Graticule opacity={0.5} />
              <div className="relative">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  · STORED
                </div>
                <h3 className="font-display text-lg font-normal tracking-[-0.01em] text-ink">
                  On your devices only.
                </h3>
                <ul className="mt-6 space-y-3">
                  {STORED_ITEMS.map((label) => (
                    <li key={label} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trace"
                        style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                      />
                      <span className="text-[13px] leading-snug text-ink-muted">{label}</span>
                    </li>
                  ))}
                </ul>
                <div
                  className="mt-6 border-t border-edge-subtle pt-4 font-mono text-[9px] uppercase tracking-[0.24em] text-trace"
                  style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                >
                  ON-DEVICE · LOCAL-FIRST
                </div>
              </div>
            </div>

            {/* Not stored */}
            <div className="relative overflow-hidden rounded-sm border border-edge-dim bg-surface p-6">
              <Graticule opacity={0.5} />
              <div className="relative">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  · NOT STORED
                </div>
                <h3 className="font-display text-lg font-normal tracking-[-0.01em] text-ink">
                  Never on Talkie servers.
                </h3>
                <ul className="mt-6 space-y-3">
                  {NOT_STORED_ITEMS.map((label) => (
                    <li key={label} className="flex items-start gap-3">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                      <span className="text-[13px] leading-snug text-ink-muted">{label}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-edge-subtle pt-4 font-mono text-[9px] uppercase tracking-[0.24em] text-amber">
                  TALKIE SYSTEMS · NO ACCESS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRINCIPLES ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 03 / PRINCIPLES</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            How the trust model is built.
          </h2>

          <div className="mt-12 space-y-0">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon
              return (
                <div
                  key={p.num}
                  className="grid grid-cols-1 gap-6 border-t border-edge-faint py-8 md:grid-cols-[80px_1fr]"
                >
                  <div className="flex items-start gap-4 md:flex-col md:gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-subtle">
                      {p.num}
                    </span>
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
                      style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                    >
                      <Icon
                        className="h-4 w-4 text-trace"
                        style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-normal tracking-[-0.01em] text-ink">
                      <span className="italic">{p.title}</span>
                    </h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                      {p.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========== VENDOR ISOLATION ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 04 / VENDOR ISOLATION</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            The wall of separation.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Understanding who holds the keys to your data is critical. We utilize Apple&apos;s
            &ldquo;Private CloudKit Container&rdquo; architecture, which structurally segregates your
            data from us.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <ExternalDocsLink href="https://developer.apple.com/documentation/cloudkit/deciding-whether-cloudkit-is-right-for-your-app">
              Apple Docs: Private DB Privacy
            </ExternalDocsLink>
            <ExternalDocsLink href="https://developer.apple.com/documentation/cloudkit/encrypting-user-data">
              Apple Docs: Data Encryption
            </ExternalDocsLink>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-0 overflow-hidden rounded-sm border border-edge lg:grid-cols-3">
            {/* Talkie Systems — No Access */}
            <div className="flex flex-col border-b border-edge-faint bg-surface p-8 lg:border-b-0 lg:border-r">
              <div className="mb-1 self-end rounded-sm border border-edge-dim px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-amber">
                No Access
              </div>
              <div className="mt-6 flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-edge-dim">
                  <CloudOff className="h-6 w-6 text-ink-faint" />
                </div>
                <h3 className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                  Talkie Systems Inc.
                </h3>
                <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-subtle">
                  (The Vendor)
                </span>
                <div className="mt-6 space-y-2 text-[12px] leading-relaxed text-ink-muted">
                  <p>We publish the app binary to the App Store.</p>
                  <p>We push updates and bug fixes.</p>
                </div>
                <div className="mt-8 w-full border-t border-edge-subtle pt-4 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-amber">
                  · Cannot Decrypt Data
                </div>
              </div>
            </div>

            {/* Wall of separation */}
            <div className="flex flex-col items-center justify-center gap-6 border-b border-edge-faint bg-canvas-alt p-8 lg:border-b-0 lg:border-r">
              <div className="flex flex-col items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
                  One-Way Delivery
                </span>
                <span className="text-ink-faint">↓</span>
              </div>
              <div className="rounded-sm border border-edge-dim px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-dim">
                App Store Binary
              </div>
              <div className="flex w-full items-center gap-3">
                <div className="h-px flex-1 bg-edge-dim" />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber">
                  Wall of Separation
                </span>
                <div className="h-px flex-1 bg-edge-dim" />
              </div>
              <div className="flex flex-col items-center gap-2 opacity-50">
                <span className="text-amber">↑</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-amber line-through">
                  User Data
                </span>
              </div>
            </div>

            {/* You & Apple ID — Full Custody */}
            <div className="flex flex-col bg-surface p-8">
              <div
                className="mb-1 self-end rounded-sm border border-edge px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-trace"
                style={{ textShadow: '0 0 4px var(--trace-glow)' }}
              >
                Full Custody
              </div>
              <div className="mt-6 flex flex-col items-center text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-sm border border-edge"
                  style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                >
                  <Database
                    className="h-6 w-6 text-trace"
                    style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
                  />
                </div>
                <h3 className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                  You &amp; Apple ID
                </h3>
                <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-subtle">
                  (The Data Owner)
                </span>
                <div className="mt-6 space-y-2 text-[12px] leading-relaxed text-ink-muted">
                  <p>Your devices generate the encryption keys.</p>
                  <p>Data resides in your Private CloudKit Database.</p>
                  <p>Only your authenticated devices can read it.</p>
                </div>
                <div
                  className="mt-8 w-full border-t border-edge-subtle pt-4 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-trace"
                  style={{ textShadow: '0 0 4px var(--trace-glow)' }}
                >
                  · Sole Proprietor
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ADVANCED DATA PROTECTION ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 05 / ADVANCED DATA PROTECTION</Eyebrow>

          <div className="relative mt-6 overflow-hidden rounded-sm border border-edge bg-surface p-8 md:p-12">
            <Graticule opacity={0.4} />

            <ShieldCheck
              aria-hidden
              className="pointer-events-none absolute right-8 top-8 text-trace opacity-[0.04]"
              style={{ width: 160, height: 160 }}
            />

            <div className="relative max-w-2xl">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge"
                  style={{ background: 'color-mix(in oklab, var(--trace) 6%, transparent)' }}
                >
                  <ShieldCheck
                    className="h-4 w-4 text-trace"
                    style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
                  />
                </div>
                <h2 className="font-display text-2xl font-normal tracking-[-0.01em] text-ink">
                  Advanced Data Protection Ready
                </h2>
              </div>

              <h3 className="mt-4 font-display text-lg font-normal tracking-[-0.01em] text-ink-dim">
                Total Decryption Immunity. Even from Apple.
              </h3>

              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                Talkie fully supports Apple&apos;s optional{' '}
                <strong className="text-ink-dim">Advanced Data Protection</strong> for iCloud.
                Because we utilize standard CloudKit Private Databases, enabling ADP in your Apple ID
                settings automatically extends strict end-to-end encryption to your Talkie data.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <Lock
                    className="mt-0.5 h-4 w-4 shrink-0 text-trace"
                    style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                  />
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                      Keys stay with you
                    </h4>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-faint">
                      Encryption keys are stored only on your trusted devices, not on iCloud servers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <EyeOff
                    className="mt-0.5 h-4 w-4 shrink-0 text-trace"
                    style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                  />
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                      Zero Server Access
                    </h4>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-faint">
                      Neither Apple nor Talkie Systems can decrypt your data, even under warrant.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://support.apple.com/en-us/108756"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  background: 'color-mix(in oklab, var(--trace) 5%, transparent)',
                  textShadow: '0 0 6px var(--trace-glow)',
                }}
              >
                Learn about ADP
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMPARISON TABLE ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <Eyebrow>· 06 / COMPARISON</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            Talkie vs. hosted AI apps.
          </h2>

          <div className="mt-10 overflow-hidden rounded-sm border border-edge">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-edge bg-surface px-4 py-3 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
              <div>Feature</div>
              <div
                className="text-trace"
                style={{ textShadow: '0 0 4px var(--trace-glow)' }}
              >
                Talkie
              </div>
              <div>Hosted AI Apps</div>
            </div>

            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 border-b border-edge-subtle px-4 py-3.5 text-[12px] last:border-0 ${
                  i % 2 === 0 ? 'bg-canvas' : 'bg-canvas-alt'
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
                  {row.feature}
                </div>
                <div className="flex items-center gap-2 text-trace">
                  <span
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace"
                    style={{ boxShadow: '0 0 4px var(--trace)' }}
                  />
                  <span className="text-[11px]">{row.talkie}</span>
                </div>
                <div className="text-[11px] text-ink-faint">{row.other}</div>
              </div>
            ))}
          </div>

          {/* Bottom statement */}
          <div className="mt-10 rounded-sm border border-edge-dim bg-surface p-6 text-center">
            <p className="font-display text-lg font-normal tracking-[-0.01em] text-ink">
              We don&apos;t run a cloud that stores your library.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-muted">
              By design, Talkie is built around local storage, iCloud custody, and provider choice.
              That keeps your memos, transcripts, and unfinished thoughts on your side of the line.
            </p>
          </div>
        </div>
      </section>

      {/* ========== TIE-BACK ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              href="/v2/philosophy"
              className="group block rounded-md border border-edge bg-surface p-6 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full border border-edge-dim" />
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">
                  FURTHER READING
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                Why local-first matters.
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                The philosophy behind building a tool that stays out of your way. Keep reading →
              </p>
            </Link>

            <div className="flex flex-col justify-between rounded-md border border-edge bg-surface p-6">
              <div>
                <Eyebrow>· READY TO INSTALL</Eyebrow>
                <h3 className="mt-3 font-display text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-ink">
                  Download Talkie for Mac.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  DMG, App Store, or a single CLI command.
                </p>
              </div>
              <Link
                href="/download"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
                style={{
                  background: 'color-mix(in oklab, var(--trace) 5%, transparent)',
                  textShadow: '0 0 6px var(--trace-glow)',
                  boxShadow: '0 0 18px color-mix(in oklab, var(--trace) 8%, transparent)',
                }}
              >
                GO TO INSTALL
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
