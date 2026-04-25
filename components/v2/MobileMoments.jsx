import { Hand, Headphones, Mic, Watch, Radio, Signal } from 'lucide-react'

/**
 * MobileMoments — terminal-log-style list of in-between capture moments
 * that explain when mobile capture earns its keep.
 *
 * Server component. Theme through CSS-variable Tailwind tokens; only the
 * pulse-dot animation needs a tiny scoped <style> block (no client JS).
 */
const MOMENTS = [
  { Icon: Hand,       text: 'Walking to the next meeting — the idea that just came up' },
  { Icon: Headphones, text: 'On the commute — the podcast moment you want to follow up' },
  { Icon: Mic,        text: "Giving feedback out loud on someone's draft or PR" },
  { Icon: Watch,      text: "Hands busy (cooking, driving, kid on hip) — the 3am thought you can't type" },
  { Icon: Radio,      text: 'In a conversation, need to remember the thing you just said' },
  { Icon: Signal,     text: "Flash of insight that won't survive the elevator ride" },
]

export default function MobileMoments() {
  const total = MOMENTS.length

  return (
    <section
      id="moments"
      className="relative border-t border-edge-faint bg-canvas"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        {/* Header */}
        <div className="max-w-3xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
            style={{ textShadow: '0 0 4px var(--trace-glow)' }}
          >
            · MOMENTS
          </p>
          <h2 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">
            Catch it on the move.{' '}
            <span className="italic text-ink-muted">Finish it on Mac.</span>
          </h2>
        </div>

        {/* Framing block */}
        <div className="mt-10 max-w-3xl rounded-md border border-edge-dim bg-surface p-5">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            <span>· FRAMING</span>
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full bg-trace"
              style={{ boxShadow: '0 0 4px var(--trace)' }}
            />
          </div>
          <p className="mt-3 font-display text-lg leading-snug tracking-[-0.01em] text-ink">
            Talkie is built for the in-between moments where ideas tend to disappear.
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
            Catch it now. Work from it later. Every mobile capture drops back
            into the same library on your Mac.
          </p>
        </div>

        {/* Moments log */}
        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            <span>· LOG · IN-BETWEEN MOMENTS</span>
            <span>{String(total).padStart(2, '0')} ENTRIES</span>
          </div>
          <div className="relative overflow-hidden rounded-md border border-edge-dim bg-surface">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {MOMENTS.map((moment, i) => (
                <MomentRow
                  key={i}
                  moment={moment}
                  index={i}
                  total={total}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scoped pulse keyframes — keeps this server-only without a global edit. */}
      <style>{`
        @keyframes osc-moment-pulse {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 0.95; }
        }
      `}</style>
    </section>
  )
}

function MomentRow({ moment, index, total }) {
  const { Icon } = moment
  const num = String(index + 1).padStart(2, '0')

  // 2-col grid: hide bottom border on the last row, hide right border on
  // the right column (and the final cell when total is odd).
  const isRightCol = index % 2 === 1
  const isBottomRow = index >= total - 2
  const hideRightBorder = isRightCol || index === total - 1

  return (
    <div
      className="flex items-center gap-3 px-4 py-4"
      style={{
        borderBottom: !isBottomRow ? '1px solid var(--edge-subtle)' : 'none',
        borderRight: !hideRightBorder ? '1px solid var(--edge-subtle)' : 'none',
      }}
    >
      {/* line number */}
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] tabular-nums text-ink-subtle">
        {num}
      </span>

      {/* icon */}
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-edge"
        style={{
          background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
        }}
      >
        <Icon
          className="h-3.5 w-3.5 text-trace"
          strokeWidth={1.5}
          style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
        />
      </div>

      {/* text */}
      <p className="flex-1 text-[14px] leading-snug text-ink-dim">
        {moment.text}
      </p>

      {/* pulse dot */}
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace"
        style={{
          boxShadow: '0 0 4px var(--trace)',
          animation: 'osc-moment-pulse 2.8s ease-in-out infinite',
          animationDelay: `${(index % 4) * 0.35}s`,
        }}
      />
    </div>
  )
}
