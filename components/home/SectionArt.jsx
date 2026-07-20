export default function SectionArt({
  slice = '50%',
  variant = 'architectural',
  tone = 'alt',
}) {
  return (
    <div
      aria-hidden
      className={`home-section-art home-section-art--${variant} home-section-art--${tone} pointer-events-none absolute inset-0`}
      style={{ '--art-slice': slice }}
    />
  )
}
