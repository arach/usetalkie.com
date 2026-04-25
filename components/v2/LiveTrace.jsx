"use client"

import { useEffect, useRef, useState } from 'react'
import HeroWaveform from './HeroWaveform'

/**
 * LiveTrace — render-only client island that paints either:
 *   - the static idle waveform (HeroWaveform) when nothing is playing
 *   - a live amplitude trace driven by an AnalyserNode when audio plays
 *
 * Receives a *ref* to an AnalyserNode (created and owned by the parent
 * SignalTable) plus a `playing` flag. Owns its own RAF loop, cleans up
 * on unmount + on play→pause transitions.
 *
 * Why a ref to the analyser instead of the analyser itself? The parent
 * builds the AudioContext lazily on first user interaction (autoplay
 * policy) and may rebuild it across clip switches; a ref means React
 * doesn't need to re-render this island every time that node identity
 * changes.
 */

const SAMPLE_COUNT = 512

export default function LiveTrace({
  analyserRef,
  playing,
  channelLabel = 'CH-01',
  scaleLabel,
  viewW = 1200,
  viewH = 220,
  compact = false,
  hideLabels = false,
  freeze = false,
}) {
  // Compact = the dock variant. Drops corner ticks + instrument labels and
  // halves graticule density so the trace reads cleanly at ~80px tall.
  // hideLabels = the parent wants to render labels externally (e.g. as a
  // proper top/bottom status bar around the trace, with cinematic caption
  // overlay sitting on top). Skips just the SVG <text> elements but keeps
  // graticules + corner ticks at the non-compact density.
  const VIEW_W = viewW
  const VIEW_H = viewH
  const gridX = compact ? 4 : 7
  const gridY = compact ? 1 : 3
  const showLabels = !compact && !hideLabels
  const svgRef = useRef(null)
  const polyTopRef = useRef(null)
  const polyGlowRef = useRef(null)
  const rafRef = useRef(0)
  const bufferRef = useRef(new Uint8Array(SAMPLE_COUNT))

  // Toggle between idle SVG and live SVG based on `playing`. Keeping
  // both rendered (one with display:none) means the swap is instant —
  // no flash, no remount.
  const [showLive, setShowLive] = useState(false)

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current)
      // When `freeze` is true, the parent wants the live polyline held
      // on screen at its last shape (e.g., during the post-audio
      // TRANSCRIBING beat, where the trace acts as a still-frame
      // backdrop for the engine indicator). Without freeze, fall back
      // to the decorative idle HeroWaveform — the dimmed frozen
      // polyline alone reads as flat, less beautiful than the
      // authored idle shape.
      if (!freeze) setShowLive(false)
      return
    }

    setShowLive(true)

    const draw = () => {
      const analyser = analyserRef.current
      const polyTop = polyTopRef.current
      const polyGlow = polyGlowRef.current

      if (analyser && polyTop && polyGlow) {
        // Resize buffer if analyser's fftSize changed underneath us.
        if (bufferRef.current.length !== analyser.fftSize) {
          bufferRef.current = new Uint8Array(analyser.fftSize)
        }
        analyser.getByteTimeDomainData(bufferRef.current)

        const buf = bufferRef.current
        const n = buf.length
        const stepX = VIEW_W / (n - 1)
        // Build a "x,y x,y …" polyline string. Byte 128 = silence; map
        // 0..255 → -1..1 → vertical pixels around mid-line.
        let pts = ''
        for (let i = 0; i < n; i++) {
          const v = (buf[i] - 128) / 128 // -1..1
          const y = VIEW_H / 2 - v * (VIEW_H * 0.42)
          pts += `${(i * stepX).toFixed(1)},${y.toFixed(1)} `
        }
        polyTop.setAttribute('points', pts)
        polyGlow.setAttribute('points', pts)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [playing, freeze, analyserRef])

  return (
    <div className="relative">
      {/* Idle layer — only the hero variant renders the full HeroWaveform.
          The compact (dock) variant skips it: dimensions don't scale and
          the dock only ever appears once a clip is active anyway. */}
      {!compact && (
        <div style={{ display: showLive ? 'none' : 'block' }}>
          <HeroWaveform channelLabel={channelLabel} scaleLabel={scaleLabel} />
        </div>
      )}

      {/* Live layer — same shell as HeroWaveform but with mutable polylines.
          Compact variant always shows this; non-compact toggles. */}
      <div style={{ display: compact || showLive ? 'block' : 'none' }} aria-hidden>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width="100%"
          height="auto"
          preserveAspectRatio="none"
          className="block"
        >
          {/* Major graticule lines (density derived from compact flag). */}
          {Array.from({ length: gridX }, (_, i) => {
            const x = ((i + 1) * VIEW_W) / (gridX + 1)
            return <line key={`v-${i}`} x1={x} x2={x} y1={0} y2={VIEW_H} stroke="var(--trace-faint)" strokeWidth={1} />
          })}
          {Array.from({ length: gridY }, (_, i) => {
            const y = ((i + 1) * VIEW_H) / (gridY + 1)
            return <line key={`h-${i}`} x1={0} x2={VIEW_W} y1={y} y2={y} stroke="var(--trace-faint)" strokeWidth={1} />
          })}

          {/* Center axis */}
          <line
            x1={0}
            x2={VIEW_W}
            y1={VIEW_H / 2}
            y2={VIEW_H / 2}
            stroke="var(--trace-dim)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />

          {/* Corner ticks — instrument-style framing. Compact mode drops
              these because at small heights they read as visual noise. */}
          {!compact &&
            [
              [0, 0],
              [VIEW_W, 0],
              [0, VIEW_H],
              [VIEW_W, VIEW_H],
            ].map(([cx, cy], i) => {
              const xSign = cx === 0 ? 1 : -1
              const ySign = cy === 0 ? 1 : -1
              return (
                <g key={`tick-${i}`} stroke="var(--trace)" strokeWidth={1.5}>
                  <line x1={cx} y1={cy} x2={cx + xSign * 12} y2={cy} />
                  <line x1={cx} y1={cy} x2={cx} y2={cy + ySign * 12} />
                </g>
              )
            })}

          {/* Live trace — soft glow underlay then crisp top stroke.
              Both polylines share the same `points` attr, written
              imperatively in the RAF loop above. When not playing, the
              opacities + glow get smoothly dialed down to a "passive"
              state — the trace stays visible (so a paused mid-clip
              keeps its frozen waveform on screen) but reads as not-
              currently-active, freeing the eye to look elsewhere. */}
          <polyline
            ref={polyGlowRef}
            fill="none"
            stroke="var(--trace)"
            strokeOpacity={playing ? 0.4 : 0.12}
            strokeWidth={playing ? 4 : 2}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{
              filter: playing ? 'drop-shadow(0 0 6px var(--trace))' : 'none',
              transition: 'stroke-opacity 0.4s ease-out, stroke-width 0.4s ease-out, filter 0.4s ease-out',
            }}
          />
          <polyline
            ref={polyTopRef}
            fill="none"
            stroke={playing ? 'var(--trace)' : 'var(--ink-faint)'}
            strokeOpacity={playing ? 0.95 : 0.45}
            strokeWidth={1.4}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ transition: 'stroke 0.4s ease-out, stroke-opacity 0.4s ease-out' }}
          />

          {/* Instrument labels — hero-only; the dock has its own header. */}
          {showLabels && (
            <>
              <text x={14} y={20} fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize="10" fill="var(--ink-subtle)" letterSpacing="2">
                {channelLabel}
              </text>
              {scaleLabel && (
                <text x={VIEW_W - 14} y={20} fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize="10" fill="var(--ink-subtle)" letterSpacing="2" textAnchor="end">
                  {scaleLabel}
                </text>
              )}
              <text x={14} y={VIEW_H - 10} fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize="9" fill="var(--ink-subtle)" letterSpacing="2">
                TRIG · LIVE
              </text>
              <text
                x={VIEW_W - 14}
                y={VIEW_H - 10}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                fontSize="9"
                fill="var(--trace)"
                letterSpacing="2"
                textAnchor="end"
                style={{ filter: 'drop-shadow(0 0 4px var(--trace-glow))' }}
              >
                ● PLAYING
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  )
}
