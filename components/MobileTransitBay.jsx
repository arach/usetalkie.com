/**
 * MobileTransitBay — dark scope-bay beat for /mobile. Slots between
 * MobileCaptureModes and MobileMoments to break up the warm-cream
 * stretch with a single dark section. Shows three capture surfaces
 * firing simultaneously with distinct phosphor colors:
 *
 *   • iPhone — amber phosphor + waveform burst
 *   • Watch — emerald pulse + heart-rate-style stripe
 *   • Ambient — cyan ambient-noise floor
 *
 * Each is a stylized live-capture indicator, not a real video. Sells
 * "captures happen everywhere, in parallel" without needing screenshots
 * of real apps. Multi-color is the point — the page was a single warm
 * tone before this section.
 */
export default function MobileTransitBay() {
  return (
    <section className="relative border-t border-b border-panel-edge-dim bg-panel-bg-deep font-mono">
      {/* Faint scanline overlay — drifts via scan-drift keyframe for live-CRT motion */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, var(--panel-scanline) 3px, var(--panel-scanline) 4px)',
          animation: 'scan-drift 0.8s linear infinite',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 flex-wrap">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-screen-trace" style={{ boxShadow: '0 0 6px var(--screen-trace-glow)' }} />
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.7)' }} />
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" style={{ boxShadow: '0 0 6px rgba(6,182,212,0.7)' }} />
          <span className="text-[10px] uppercase tracking-[0.28em] text-screen-ink-faint ml-2">
            3 CHANNELS · LIVE
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-[0.26em] text-screen-ink-faint tabular-nums">
            CATCH-IT-ON-THE-MOVE
          </span>
        </div>

        {/* Headline */}
        <h2 className="mt-6 font-display text-3xl md:text-4xl font-normal tracking-[-0.02em] text-screen-ink leading-[1.05]">
          Catch it on the move.
          <br />
          <span className="italic text-screen-ink-dim">Three surfaces, one library.</span>
        </h2>

        {/* Three live channels */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* iPhone — amber */}
          <div
            className="group/ch relative overflow-hidden rounded-md border bg-screen-bg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_-6px_var(--screen-trace-glow)]"
            style={{
              borderColor: 'color-mix(in oklab, var(--screen-trace) 42%, transparent)',
              boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--screen-trace) 8%, transparent)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-40 transition-opacity duration-300 group-hover/ch:opacity-70"
              style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--screen-trace) 40%, transparent) 0%, transparent 65%)' }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-screen-trace">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-screen-trace" style={{ boxShadow: '0 0 6px var(--screen-trace-glow)', animation: 'mtb-pulse 1.6s ease-in-out infinite' }} />
                iPHONE · ACTIVE
              </div>
              <div className="mt-4 text-[12px] leading-snug text-screen-ink-dim">
                <span className="text-screen-ink-faint">&gt; </span>
                forgot to pick up the dry cleaning, also the airpod case is in the
              </div>
              {/* Mini waveform — screen-trace cascades via currentColor */}
              <svg viewBox="0 0 220 36" className="mt-4 w-full h-10" preserveAspectRatio="none" aria-hidden style={{ color: 'var(--screen-trace)' }}>
                {Array.from({ length: 32 }).map((_, i) => {
                  const x = i * 7
                  const seed = Math.sin(i * 0.9) * 0.5 + Math.sin(i * 2.1) * 0.3
                  const h = Math.abs(seed) * 22 + 3
                  return <rect key={i} x={x} y={18 - h / 2} width="3" height={h} rx="1" fill="currentColor" fillOpacity="0.85" />
                })}
              </svg>
              <div className="mt-3 text-[9px] uppercase tracking-[0.26em] text-screen-ink-faint">
                00:00:04.18 · 48 kHz
              </div>
            </div>
          </div>

          {/* Watch — emerald */}
          <div
            className="group/ch relative overflow-hidden rounded-md border bg-screen-bg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_-6px_rgba(16,185,129,0.5)]"
            style={{
              borderColor: 'rgba(16,185,129,0.42)',
              boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.06)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full opacity-40 transition-opacity duration-300 group-hover/ch:opacity-70"
              style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.45) 0%, transparent 65%)' }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-emerald-400">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)', animation: 'mtb-pulse 1.2s ease-in-out infinite' }} />
                WATCH · TAP
              </div>
              <div className="mt-4 text-[12px] leading-snug text-screen-ink-dim">
                <span className="text-screen-ink-faint">&gt; </span>
                idea — caching layer for the latency report, talk to alex
              </div>
              {/* Heart-rate style stripe */}
              <svg viewBox="0 0 220 36" className="mt-4 w-full h-10" preserveAspectRatio="none" aria-hidden>
                <path
                  d="M 0 18 L 30 18 L 38 8 L 46 28 L 54 18 L 90 18 L 98 6 L 106 30 L 114 18 L 150 18 L 158 14 L 166 22 L 174 18 L 220 18"
                  fill="none"
                  stroke="rgba(16,185,129,0.95)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <div className="mt-3 text-[9px] uppercase tracking-[0.26em] text-screen-ink-faint">
                00:00:02.96 · WRIST
              </div>
            </div>
          </div>

          {/* Ambient — cyan */}
          <div
            className="group/ch relative overflow-hidden rounded-md border bg-screen-bg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_-6px_rgba(6,182,212,0.5)]"
            style={{
              borderColor: 'rgba(6,182,212,0.42)',
              boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.06)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full opacity-40 transition-opacity duration-300 group-hover/ch:opacity-70"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.45) 0%, transparent 65%)' }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-cyan-400">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" style={{ boxShadow: '0 0 6px rgba(6,182,212,0.8)', animation: 'mtb-pulse 2.2s ease-in-out infinite' }} />
                AMBIENT · IDLE
              </div>
              <div className="mt-4 text-[12px] leading-snug text-screen-ink-dim">
                <span className="text-screen-ink-faint">&gt; </span>
                <span className="italic text-screen-ink-faint">listening for keyword cue…</span>
              </div>
              {/* Noise floor stripe */}
              <svg viewBox="0 0 220 36" className="mt-4 w-full h-10" preserveAspectRatio="none" aria-hidden>
                {Array.from({ length: 60 }).map((_, i) => {
                  const x = i * 3.7
                  const seed = (Math.sin(i * 1.5) * 0.5 + Math.cos(i * 0.7) * 0.5) * 0.4
                  const h = Math.abs(seed) * 8 + 2
                  return <rect key={i} x={x} y={18 - h / 2} width="1.8" height={h} rx="0.5" fill="rgba(6,182,212,0.7)" />
                })}
              </svg>
              <div className="mt-3 text-[9px] uppercase tracking-[0.26em] text-screen-ink-faint">
                FLOOR · -54 dB
              </div>
            </div>
          </div>
        </div>

        {/* Foot caption */}
        <p className="mt-8 max-w-2xl text-[12px] leading-relaxed text-screen-ink-muted">
          Whatever you say, wherever you are — iPhone, Watch, or Ambient — lands in the
          same library. By the time you sit down at your Mac, the captures are already
          transcribed and stitched together for you.
        </p>
      </div>

      <style>{`
        @keyframes mtb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </section>
  )
}
