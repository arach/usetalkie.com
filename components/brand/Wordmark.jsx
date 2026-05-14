'use client'

/**
 * Talkie Wordmark — the canonical lockup.
 *
 * Renders "talkie" in Talkie Medium (Hero's derived font, loaded via
 * next/font/local in app/layout.jsx as --font-talkie). The font's `i`
 * is a dotless bar — the Hot Mic dot is the only SVG overlay so it can
 * pulse and change color per state.
 *
 *   <Wordmark />
 *   <Wordmark size={180} state="listening" pulse />
 *   <Wordmark size={120} state="idle" ink="var(--brand-canvas)" />
 *
 * Mirrors narrative-studio/src/app/deck/talkie/_brand/wordmark.tsx —
 * keep in sync until both consumers move to a shared `@talkie/wordmark`.
 */

import React from 'react'

const TALKIE_FONT = 'var(--font-talkie), "JetBrains Mono", ui-monospace, monospace'
// Per-letter advances in UPM, matching the v6 TTF (Hero R1 geometry:
// l_advance=550, i_advance=340, everything else 600).
const ADV = { t: 600, a: 600, l: 600, k: 600, i: 340, e: 600 }
const TOTAL_ADVANCE_UPM = ADV.t + ADV.a + ADV.l + ADV.k + ADV.i + ADV.e
const I_STEM_OFFSET_UPM = 45     // i stem center offset within the i cell
const I_STEM_TOP_UPM = 550       // i_height
const I_STEM_WIDTH_UPM = 108     // Hero's DEFAULT_PARAMS.i_stemWidth
const FONT_UPM = 1000

// Per-pair extra tightening in UPM, on top of the uniform squeeze.
// v6 ships balanced (9u spread); the +24 lk pull is wordmark-specific
// polish (owner wants k visibly closer to l in the lockup).
const DEFAULT_KERN = { ta: 0, al: 0, lk: 24, ki: 0, ie: 0 }

const COLORS = {
  hotMic: '#FF5346',
  tapeTan: '#7A6E5C',
}

export function Wordmark({
  size = 140,
  state = 'listening',
  pulse = false,
  ink = 'var(--brand-wordmark-ink)',
  showDot = true,
  squeeze = 0.92,
  thinness = 0,
  dotGap = 2.5,
  dotScale = 1.4,
  monotone = false,
  guides = false,
  kern,
}) {
  // Hot Mic dot stays red regardless of theme (it's a state semantic, not a
  // theme token). Idle dot is Tape Tan which works on both canvases.
  const dotColor = monotone
    ? ink
    : state === 'listening'
      ? COLORS.hotMic
      : COLORS.tapeTan

  const u = size / FONT_UPM

  // Squeeze = letter-spacing only. Glyphs keep native widths; the 5 inter-letter
  // gaps tighten. Per-pair kerning bias addresses the lk/ki/ie rhythm.
  const baseGapUPM = (TOTAL_ADVANCE_UPM * (1 - squeeze)) / 5
  const k = { ...DEFAULT_KERN, ...(kern ?? {}) }
  const gapUPM = [k.ta, k.al, k.lk, k.ki, k.ie].map((bias) => baseGapUPM + bias)
  const advArr = [ADV.t, ADV.a, ADV.l, ADV.k, ADV.i, ADV.e]
  const xsUPM = [0]
  for (let g = 0; g < 5; g++) {
    xsUPM.push(xsUPM[g] + advArr[g] - gapUPM[g])
  }
  const squeezedStemUPM = xsUPM[4] + I_STEM_OFFSET_UPM
  const totalAdvanceUPM = xsUPM[5] + ADV.e
  const totalW = totalAdvanceUPM * u
  const totalH = size * 1.05
  const baseline = size * 0.82

  // Dot diameter scales with the rendered i-stem width (post-erode). At
  // dotScale=1.4 the dot is ~1.4× the visible stroke width — proportionate
  // without being chunky.
  const nominalStemPx = I_STEM_WIDTH_UPM * u
  const renderedStemPx = Math.max(nominalStemPx * 0.4, nominalStemPx - 2 * thinness)
  const dotCx = squeezedStemUPM * u
  const dotR = (renderedStemPx / 2) * dotScale
  const dotCy = baseline - I_STEM_TOP_UPM * u - dotR * dotGap

  const filterId = `talkie-thin-${size}-${Math.round(thinness * 100)}-${Math.round(squeeze * 100)}`
  const animClass = pulse ? 'talkie-dot' : undefined

  return (
    <>
      {pulse && showDot && (
        <style>{`
          @keyframes talkie-pulse {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.55; }
          }
          .talkie-dot { animation: talkie-pulse 1000ms ease-in-out infinite; }
        `}</style>
      )}
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        role="img"
        aria-label={`Talkie wordmark — ${state}`}
        style={{
          display: 'block',
          width: totalW,
          height: totalH,
          maxWidth: '100%',
        }}
      >
        {thinness > 0 && (
          <defs>
            <filter id={filterId} x="-2%" y="-2%" width="104%" height="104%">
              <feMorphology operator="erode" radius={thinness} />
            </filter>
          </defs>
        )}
        <text
          x={xsUPM.map((v) => v * u).join(' ')}
          y={baseline}
          fontFamily={TALKIE_FONT}
          fontWeight={500}
          fontSize={size}
          fill={ink}
          filter={thinness > 0 ? `url(#${filterId})` : undefined}
        >
          talkie
        </text>
        {showDot && (
          <circle
            className={animClass}
            cx={dotCx}
            cy={dotCy}
            r={dotR}
            fill={dotColor}
          />
        )}
        {guides && (
          <g
            stroke={ink}
            strokeOpacity={0.18}
            strokeWidth={Math.max(0.5, size * 0.005)}
            strokeDasharray={`${Math.max(1, size * 0.012)} ${Math.max(2, size * 0.024)}`}
            fill="none"
            pointerEvents="none"
          >
            <line x1={0} y1={0} x2={totalW} y2={0} />
            <line x1={0} y1={totalH} x2={totalW} y2={totalH} />
            <line x1={0} y1={0} x2={0} y2={totalH} />
            <line x1={totalW} y1={0} x2={totalW} y2={totalH} />
          </g>
        )}
      </svg>
    </>
  )
}
