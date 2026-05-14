'use client'

/**
 * Talkie Wordmark — the canonical lockup.
 *
 * Renders "talkie" in Talkie Medium (custom JBM-derived font, see
 * public/fonts/Talkie-Medium.ttf, loaded via next/font/local in
 * app/layout.jsx as the --font-talkie variable).
 *
 * The font's `i` is a dotless bar — the Hot Mic dot is the only SVG
 * overlay so it can pulse and change color per state.
 *
 *   <Wordmark />
 *   <Wordmark size={180} state="listening" pulse />
 *   <Wordmark size={120} state="idle" ink="var(--brand-canvas)" />
 *   <Wordmark size={96} showDot={false} />
 */

import React from 'react'

// Talkie Medium glyph metrics in 1000 UPM (matches the v5 TTF in
// /public/fonts/). Cumulative advance up to the i stem center is
// computed from buildWordmark + Pad L.
const TALKIE_FONT = 'var(--font-talkie), "JetBrains Mono", ui-monospace, monospace'
const I_STEM_CENTER_UPM = 2445 // 4×600 (t,a,l,k cells) + 45 (i stem center after Pad L)
const TOTAL_ADVANCE_UPM = 3340 // t+a+l+k+i+e = 600+600+600+600+340+600
const I_STEM_TOP_UPM = 550     // i_height
const FONT_UPM = 1000

const COLORS = {
  hotMic:  '#FF5346',
  tapeTan: '#7A6E5C',
}

// Default ink resolves through CSS — `--brand-wordmark-ink` flips between
// Studio Cream (dark mode) and Ribbon Black (light mode) per globals.css.
// Override the `ink` prop only when you need to force a specific color.
export function Wordmark({
  size = 140,
  state = 'listening',
  pulse = false,
  ink = 'var(--brand-wordmark-ink)',
  showDot = true,
  squeeze = 0.92,
}) {
  // Hot Mic dot stays red regardless of theme (it's a state semantic, not a
  // theme token). Idle dot is Tape Tan which works on both canvases.
  const dotColor = state === 'listening' ? COLORS.hotMic : COLORS.tapeTan
  const u = size / FONT_UPM
  // Horizontal squeeze via SVG textLength + lengthAdjust="spacingAndGlyphs".
  // Compresses glyph widths *and* spacing uniformly, so the i-stem center
  // stays proportionally aligned — multiply both the viewBox width and the
  // dot's cx by the same factor.
  const squeezedAdvanceUPM = TOTAL_ADVANCE_UPM * squeeze
  const squeezedStemUPM = I_STEM_CENTER_UPM * squeeze
  const totalW = squeezedAdvanceUPM * u
  const totalH = size * 1.05
  const baseline = size * 0.82
  const dotCx = squeezedStemUPM * u
  // Compact sizes render the indicator as a ring rather than a filled
  // circle. At nav-scale (≤ ~28px) a filled red dot subpixels into a
  // blurry blob; a 1.5px-stroke ring with slightly larger radius reads
  // crisp at any pixel density and keeps brand semantics (Hot Mic = red).
  const isCompact = size < 40
  const dotR = isCompact ? size * 0.11 : size * 0.075
  const dotStrokeWidth = isCompact ? 1.5 : 0
  const dotCy = baseline - I_STEM_TOP_UPM * u - dotR * 1.4
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
        <text
          x={0}
          y={baseline}
          fontFamily={TALKIE_FONT}
          fontWeight={500}
          fontSize={size}
          fill={ink}
          textLength={totalW}
          lengthAdjust="spacingAndGlyphs"
        >
          talkie
        </text>
        {showDot && (
          isCompact ? (
            <circle
              className={animClass}
              cx={dotCx}
              cy={dotCy}
              r={dotR}
              fill="none"
              stroke={dotColor}
              strokeWidth={dotStrokeWidth}
            />
          ) : (
            <circle
              className={animClass}
              cx={dotCx}
              cy={dotCy}
              r={dotR}
              fill={dotColor}
            />
          )
        )}
      </svg>
    </>
  )
}
