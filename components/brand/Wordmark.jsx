import geometry from './wordmark-paths.json'

/** Canonical Talkie lettering. Generated from the owned font; no font loading required. */
export function Wordmark({ size = 140, ink = 'var(--brand-wordmark-ink)' }) {
  return (
    <svg
      viewBox={geometry.viewBox}
      role="img"
      aria-label="Talkie"
      focusable="false"
      style={{ display: 'block', width: geometry.width * size / 1000, height: 'auto', maxWidth: '100%' }}
    >
      <g fill={ink}>
        {geometry.paths.map((path, index) => <path key={index} d={path} />)}
      </g>
      <circle {...geometry.dot} fill="#FF5346" />
    </svg>
  )
}
