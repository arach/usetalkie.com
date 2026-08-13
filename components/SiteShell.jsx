import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import MobileNav from './MobileNav'
import { supportingLine, ANCHOR_VARIANT } from '../content/tagline'
import { Wordmark } from './brand/Wordmark'

const PRIMARY_NAV = [
  { label: 'Tour',       href: '/tour' },
  { label: 'Workflows',  href: '/workflows' },
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Ideas',      href: '/ideas' },
  { label: 'Docs',       href: '/docs' },
]

const FOOTER_SECTIONS = [
  {
    label: 'Product',
    links: [
      { label: 'Mac',       href: '/mac' },
      { label: 'iPhone',    href: '/mobile' },
      { label: 'Watch',     href: '/mobile' },
      { label: 'Workflows', href: '/workflows' },
    ],
  },
  {
    label: 'Substance',
    links: [
      { label: 'Philosophy', href: '/philosophy' },
      { label: 'Brand',      href: '/brand' },
      { label: 'Security',   href: '/security' },
      { label: 'About',      href: '/about' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Docs',    href: '/docs' },
      { label: 'Support', href: '/support' },
      { label: 'CLI',     href: '/docs/cli' },
      { label: 'Privacy', href: '/privacypolicy.html' },
      { label: 'Ideas',   href: '/ideas' },
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
 * whole shell re-skins in one frame. Mobile nav is a tiny client island.
 */
export default function SiteShell({ children }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-edge-faint bg-canvas-overlay backdrop-blur-md font-mono">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-2 px-4 md:px-6">
          <Link
            href="/"
            className="inline-flex h-11 min-w-11 items-center group"
            aria-label="Talkie home"
          >
            <Wordmark size={28} state="listening" pulse />
          </Link>

          <nav className="hidden items-center gap-5 text-[9px] uppercase tracking-[0.24em] text-ink-faint lg:flex">
            {PRIMARY_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-trace">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <MobileNav />
            <ThemeToggle />
            <Link
              href="/downloads"
              className="site-header-cta inline-flex h-11 items-center gap-2 rounded-sm border border-edge px-3 text-[9px] uppercase tracking-[0.22em] transition-all hover:-translate-y-px"
            >
              <span
                aria-hidden
                className="site-header-cta-dot inline-block h-1.5 w-1.5 rounded-full"
              />
              DOWNLOADS
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
              <Wordmark size={48} state="listening" pulse />
              <p className="mt-5 font-display text-2xl leading-tight tracking-[-0.01em] text-ink">
                Talk to your Mac.
                <br />
                <span className="text-base italic text-ink-muted">{supportingLine(ANCHOR_VARIANT)}</span>
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
                Local-first voice capture. Your words stay on your devices.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/downloads"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-edge px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink transition-all hover:-translate-y-px"
                style={{ background: 'color-mix(in oklab, var(--ink) 6%, transparent)' }}
              >
                CURRENT MAC BUILD <span>→</span>
              </Link>
              <Link
                href="/mobile"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-edge-dim px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink hover:border-edge"
              >
                FREE MOBILE APPS <span>↗</span>
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· {section.label}</p>
                <ul className="mt-3 space-y-0.5">
                  {section.links.map((link) =>
                    link.external ? (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1.5 py-2 text-[11px] tracking-[0.08em] text-ink-dim transition-colors hover:text-trace sm:min-h-0 sm:py-0"
                        >
                          <span>{link.label}</span>
                          <span className="text-ink-subtle">↗</span>
                        </a>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="inline-flex min-h-11 items-center py-2 text-[11px] tracking-[0.08em] text-ink-dim transition-colors hover:text-trace sm:min-h-0 sm:py-0"
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
          <div className="mt-12 border-t border-edge-subtle pt-6 text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
            <span>(C) {new Date().getFullYear()} TALKIE</span>
          </div>
        </div>
      </footer>
    </>
  )
}
