/**
 * MacDemoBay — dark scope-bay section for /mac. Two stacked beats:
 *
 *   1. TALKIE LISTENING simulator — stylized representation of the
 *      menu-bar instrument firing. Phosphor pulse (green REC), amber
 *      waveform graphic, cyan timestamp readout. Sells "the product
 *      is alive" without needing a real video file.
 *   2. WPM stat row — three callouts (~40 keyboard / 200+ Talkie /
 *      5× faster) in distinct accent colors. Brings the keyboard-vs-
 *      voice argument to the page in one glance.
 *
 * Why it exists: the v2/MacPage shipped without a "see it running"
 * beat. The page reads as a long stretch of warm cream paper with no
 * dark/scope contrast. This section flips to a dark chassis surface
 * for one beat, injects multi-tone color (green/amber/cyan/red), then
 * hands back to the cream paper sections that follow. Visual rhythm.
 */
export default function MacDemoBay() {
  return (
    <section className="relative border-t border-b border-panel-edge-dim bg-panel-bg-deep font-mono">
      {/* Faint scanline overlay for CRT feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,184,77,0.04) 3px, rgba(255,184,77,0.04) 4px)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-rose-500"
            style={{
              boxShadow: '0 0 8px rgba(244,63,94,0.85), 0 0 16px rgba(244,63,94,0.45)',
              animation: 'mac-rec-pulse 1.4s ease-in-out infinite',
            }}
          />
          <span className="text-[10px] uppercase tracking-[0.28em] text-rose-400">REC</span>
          <span className="text-screen-ink-faint">·</span>
          <span className="text-[10px] uppercase tracking-[0.28em] text-amber">TALKIE LISTENING</span>
          <span className="ml-auto text-[10px] uppercase tracking-[0.26em] text-cyan-400 tabular-nums">
            00:00:08.412
          </span>
        </div>

        {/* Demo waveform pane */}
        <div
          className="group/pane mt-6 relative overflow-hidden rounded-md border border-screen-edge bg-screen-bg p-8 transition-all duration-300 hover:border-amber/60"
          style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.30)' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,184,77,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,77,0.06) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative">
            {/* Quote / utterance line */}
            <p className="text-[13px] leading-relaxed text-screen-ink-dim">
              <span className="text-screen-ink-faint">&gt; </span>
              okay the intro is doing too much, lemme lead with the conflict instead, see if it lands
              <span aria-hidden className="ml-1 inline-block h-3 w-1.5 -mb-0.5 align-middle bg-amber" style={{ animation: 'mac-cursor-blink 0.9s steps(2) infinite' }} />
            </p>

            {/* Waveform SVG */}
            <svg
              viewBox="0 0 1200 160"
              className="mt-6 w-full h-24"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="mac-wave-grad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="rgba(255,184,77,0.20)" />
                  <stop offset="50%" stopColor="rgba(255,184,77,0.95)" />
                  <stop offset="100%" stopColor="rgba(255,184,77,0.20)" />
                </linearGradient>
              </defs>
              {Array.from({ length: 80 }).map((_, i) => {
                const x = i * 15 + 4
                const seed = Math.sin(i * 0.7) * 0.5 + Math.sin(i * 1.9) * 0.3 + Math.sin(i * 3.3) * 0.2
                const h = Math.abs(seed) * 60 + 4
                return (
                  <rect
                    key={i}
                    x={x}
                    y={80 - h / 2}
                    width="6"
                    height={h}
                    rx="1"
                    fill="url(#mac-wave-grad)"
                  />
                )
              })}
            </svg>

            {/* Status row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-screen-edge-dim pt-4 text-[10px] uppercase tracking-[0.26em]">
              <span className="text-emerald-400">
                <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.7)' }} />
                ON-DEVICE
              </span>
              <span className="text-cyan-400">
                <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-cyan-500 align-middle" style={{ boxShadow: '0 0 6px rgba(6,182,212,0.7)' }} />
                32.1 kHz · MONO
              </span>
              <span className="text-amber">
                <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber align-middle" style={{ boxShadow: '0 0 6px var(--trace-glow)' }} />
                APPLE NEURAL
              </span>
              <span className="ml-auto text-screen-ink-faint">CURSOR · CMD-OPT-T</span>
            </div>
          </div>
        </div>

        {/* WPM stats row */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Keyboard — slow / muted */}
          <div className="group/stat relative rounded-md border border-screen-edge bg-screen-bg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-screen-ink-faint">
            <div className="text-[9px] uppercase tracking-[0.28em] text-screen-ink-faint transition-colors duration-200 group-hover/stat:text-screen-ink-muted">
              KEYBOARD · WPM
            </div>
            <div className="mt-3 font-display text-5xl font-normal tracking-tight text-screen-ink-dim transition-colors duration-200 group-hover/stat:text-screen-ink">
              ~40
            </div>
            <div className="mt-2 text-[11px] leading-snug text-screen-ink-muted">
              The ceiling for most typists. Thoughts evaporate while fingers catch up.
            </div>
          </div>
          {/* Talkie — fast / amber phosphor */}
          <div
            className="group/stat relative overflow-hidden rounded-md border bg-screen-bg p-6 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(255,184,77,0.42)',
              boxShadow: 'inset 0 0 0 1px rgba(255,184,77,0.08), 0 0 20px -8px rgba(255,184,77,0.35)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-40 transition-opacity duration-300 group-hover/stat:opacity-70"
              style={{ background: 'radial-gradient(circle, rgba(255,184,77,0.45) 0%, transparent 65%)' }}
            />
            <div className="relative">
              <div className="text-[9px] uppercase tracking-[0.28em] text-amber">
                TALKIE · WPM
              </div>
              <div
                className="mt-3 font-display text-5xl font-normal tracking-tight text-amber transition-transform duration-200 group-hover/stat:scale-[1.04]"
                style={{ textShadow: '0 0 12px var(--trace-glow)', transformOrigin: 'left center' }}
              >
                200+
              </div>
              <div className="mt-2 text-[11px] leading-snug text-screen-ink-muted transition-colors duration-200 group-hover/stat:text-screen-ink-dim">
                Speak as fast as you think. Cleanup runs after, not in your head.
              </div>
            </div>
          </div>
          {/* Multiplier — emerald / pop */}
          <div
            className="group/stat relative overflow-hidden rounded-md border bg-screen-bg p-6 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(16,185,129,0.42)',
              boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.08)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full opacity-30 transition-opacity duration-300 group-hover/stat:opacity-60"
              style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 65%)' }}
            />
            <div className="relative">
              <div className="text-[9px] uppercase tracking-[0.28em] text-emerald-400">
                FASTER · ×
              </div>
              <div
                className="mt-3 font-display text-5xl font-normal tracking-tight text-emerald-400 transition-transform duration-200 group-hover/stat:scale-[1.04]"
                style={{ textShadow: '0 0 12px rgba(16,185,129,0.55)', transformOrigin: 'left center' }}
              >
                5×
              </div>
              <div className="mt-2 text-[11px] leading-snug text-screen-ink-muted transition-colors duration-200 group-hover/stat:text-screen-ink-dim">
                Capture-to-doc time, measured against keyboard-only flow.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mac-rec-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes mac-cursor-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
