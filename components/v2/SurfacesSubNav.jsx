import Link from 'next/link'

/**
 * SurfacesSubNav — tab strip shared between /v2/mac and /v2/mobile.
 * Server-rendered. Theme flows entirely through CSS-variable-backed
 * Tailwind tokens; the active tab gets a glowing trace underline that
 * re-skins atomically on theme flip.
 *
 * Sticks just below the SiteShell header (h-12 = top-12).
 */
const SURFACES = [
  { id: 'mac',    label: 'MAC',    channel: 'CH-A', freq: '32.1kHz', href: '/v2/mac' },
  { id: 'mobile', label: 'MOBILE', channel: 'CH-B', freq: '48.0kHz', href: '/v2/mobile' },
]

export default function SurfacesSubNav({ active }) {
  return (
    <div className="sticky top-12 z-30 border-b border-edge-faint bg-canvas-overlay backdrop-blur-md font-mono">
      <div className="mx-auto flex max-w-6xl items-stretch gap-1 px-4 md:px-6">
        {/* Breadcrumb back to /v2/surfaces */}
        <Link
          href="/v2/surfaces"
          className="group flex items-center gap-2 py-3 pr-4 text-[9px] uppercase tracking-[0.26em] text-ink-subtle transition-colors hover:text-ink-muted"
        >
          <span>SURFACES</span>
          <span className="text-ink-faint">/</span>
        </Link>

        {SURFACES.map((surface) => {
          const isActive = surface.id === active
          return (
            <Link
              key={surface.id}
              href={surface.href}
              aria-current={isActive ? 'page' : undefined}
              className={
                'relative flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-[0.22em] transition-colors ' +
                (isActive ? 'text-ink' : 'text-ink-faint hover:text-ink-muted')
              }
            >
              <span
                aria-hidden
                className={
                  'inline-block h-1.5 w-1.5 rounded-full transition-all ' +
                  (isActive ? 'bg-trace' : 'bg-transparent border border-edge-dim')
                }
                style={isActive ? { boxShadow: '0 0 8px var(--trace)' } : undefined}
              />
              <span className={isActive ? 'text-ink-muted' : 'text-ink-subtle'}>
                {surface.channel}
              </span>
              <span className="font-semibold tracking-[0.2em]">{surface.label}</span>
              <span className="hidden text-[9px] text-ink-faint md:inline">
                · {surface.freq}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-[-1px] h-px bg-trace"
                  style={{ boxShadow: '0 0 8px var(--trace)' }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
