import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { supportingLine, ANCHOR_VARIANT } from '../../content/v2/tagline'

const PRIMARY_NAV = [
  { label: 'Surfaces',   href: '/v2/surfaces' },
  { label: 'Workflows',  href: '/v2/workflows' },
  { label: 'Philosophy', href: '/v2/philosophy' },
  { label: 'Ideas',      href: '/v2/ideas' },
  { label: 'Docs',       href: '/v2/docs' },
]

const FOOTER_SECTIONS = [
  {
    label: 'Product',
    links: [
      { label: 'Mac',       href: '/v2/mac' },
      { label: 'iPhone',    href: '/v2/mobile' },
      { label: 'Watch',     href: '/v2/mobile' },
      { label: 'Workflows', href: '/v2/workflows' },
    ],
  },
  {
    label: 'Substance',
    links: [
      { label: 'Philosophy', href: '/v2/philosophy' },
      { label: 'Security',   href: '/v2/security' },
      { label: 'About',      href: '/v2/about' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Docs',    href: '/v2/docs' },
      { label: 'CLI',     href: '/v2/docs/cli' },
      { label: 'Pricing', href: '/v2#pricing' },
      { label: 'Ideas',   href: '/v2/ideas' },
    ],
  },
  {
    label: 'Contact',
    links: [
      { label: 'Email',         href: 'mailto:hello@usetalkie.com',          external: true },
      { label: '@usetalkieapp', href: 'https://x.com/usetalkieapp',           external: true },
      { label: 'GitHub',        href: 'https://github.com/arach/usetalkie.com', external: true },
    ],
  },
]

/**
 * Server-rendered site chrome. No client hooks, no scoped CSS.
 * All theming flows through CSS variables — flip `html.dark` and the
 * whole shell re-skins in one frame.
 */
export default function SiteShell({ children }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-edge-faint bg-canvas-overlay backdrop-blur-md font-mono">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/v2" className="flex items-center gap-3 group">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-trace animate-pulse"
              style={{ boxShadow: '0 0 8px var(--trace)' }}
            />
            <span className="text-[10px] uppercase tracking-[0.28em] text-ink-dim transition-colors group-hover:text-trace">
              TALKIE
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-[9px] uppercase tracking-[0.24em] text-ink-faint lg:flex">
            {PRIMARY_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-trace">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/v2/downloads"
              className="inline-flex items-center gap-2 rounded-sm border border-edge px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-trace transition-all hover:-translate-y-px"
              style={{
                background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
              }}
            >
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                style={{ boxShadow: '0 0 4px var(--trace)' }}
              />
              GET APP
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="relative mt-16 border-t border-edge-faint bg-canvas-alt font-mono">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          {/* Wordmark + tagline + primary CTA */}
          <div className="flex flex-col gap-8 border-b border-edge-subtle pb-10 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full bg-trace"
                  style={{ boxShadow: '0 0 8px var(--trace)' }}
                />
                <span className="text-[10px] uppercase tracking-[0.28em] text-ink-dim">TALKIE</span>
              </div>
              <p className="mt-4 font-display text-2xl leading-tight tracking-[-0.01em] text-ink">
                A selfie. For your thoughts.
                <br />
                <span className="text-base italic text-ink-muted">{supportingLine(ANCHOR_VARIANT)}</span>
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
                Voice capture, local-first, auditable signal path. Your words stay on your devices.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/v2/downloads"
                className="inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-px"
                style={{ background: 'color-mix(in oklab, var(--trace) 6%, transparent)' }}
              >
                DOWNLOAD · MAC <span>→</span>
              </Link>
              <Link
                href="/v2/mobile"
                className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink hover:border-edge"
              >
                APP STORE <span>↗</span>
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· {section.label}</p>
                <ul className="mt-3 space-y-2">
                  {section.links.map((link) =>
                    link.external ? (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] text-ink-dim transition-colors hover:text-trace"
                        >
                          <span>{link.label}</span>
                          <span className="text-ink-subtle">↗</span>
                        </a>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-[11px] tracking-[0.08em] text-ink-dim transition-colors hover:text-trace"
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom metadata row */}
          <div className="mt-12 flex flex-col items-start gap-3 border-t border-edge-subtle pt-6 text-[9px] uppercase tracking-[0.22em] text-ink-subtle md:flex-row md:items-center md:justify-between">
            <span>(C) {new Date().getFullYear()} TALKIE SYSTEMS</span>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                style={{ boxShadow: '0 0 6px var(--trace)' }}
              />
              <span>SIGNAL · LIVE</span>
              <span className="opacity-50">·</span>
              <span>ALL TRACES LOCAL</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
