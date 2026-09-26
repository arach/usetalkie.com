import Image from 'next/image'
import { Download } from 'lucide-react'
import { Wordmark } from './brand/Wordmark'

const variants = [
  { name: 'For light backgrounds', file: 'dark', background: '#F4EFE6', ink: '#15140F' },
  { name: 'For dark backgrounds', file: 'light', background: '#0E0D0A', ink: '#F4EFE6' },
]

export default function BrandPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-ink md:px-6 md:py-20">
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl leading-tight md:text-6xl">The Talkie logo.</h1>
        <p className="mt-5 text-base leading-relaxed text-ink-muted">
          The Talkie wordmark and icons. Download the original files for use on websites, in apps, and in print.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2">
        {variants.map(({ name, file, background, ink }) => (
          <figure key={file} className="min-w-0">
            <div
              className="flex aspect-[2/1] items-center justify-center px-8 sm:px-12"
              style={{ background }}
            >
              <Wordmark size={120} ink={ink} />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-3">
              <span className="text-sm text-ink-muted">{name}</span>
              <a
                href={`/brand/talkie-wordmark-${file}.svg`}
                download
                aria-label={`Download Talkie SVG ${name.toLowerCase()}`}
                className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4 hover:text-trace focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              >
                Download SVG <Download size={16} aria-hidden="true" />
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      <section className="mt-12 border-t border-edge-faint pt-8" aria-labelledby="brand-icons">
        <h2 id="brand-icons" className="font-display text-3xl">Icons.</h2>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          Use the app icon for app listings and the favicon for browser tabs.
        </p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {[
            { name: 'App icon', preview: '/icon-1024.png', links: [['PNG · 1024 × 1024', '/icon-1024.png'], ['PNG · 512 × 512', '/icon-512.png']] },
            { name: 'Favicon', preview: '/favicon.svg', links: [['SVG', '/favicon.svg'], ['ICO', '/favicon.ico']] },
          ].map(({ name, preview, links }) => (
            <figure key={name} className="min-w-0">
              <div className="flex h-56 items-center justify-center bg-canvas-alt">
                <Image src={preview} alt={`Talkie ${name.toLowerCase()}`} width={144} height={144} />
              </div>
              <figcaption className="pt-4">
                <h3 className="text-base">{name}</h3>
                <div className="mt-1 flex flex-wrap gap-x-6">
                  {links.map(([label, href]) => (
                    <a key={href} href={href} download aria-label={`Download Talkie ${name.toLowerCase()} ${label}`}
                      className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4 hover:text-trace focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                      {label} <Download size={16} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 border-t border-edge-faint pt-8 md:grid-cols-[1fr_2fr] md:gap-12">
        <h2 className="font-display text-3xl">Keep it clear.</h2>
        <ul className="max-w-2xl space-y-3 text-base leading-relaxed text-ink-muted">
          <li>Keep the original proportions, letter spacing, and red dot.</li>
          <li>Leave clear space around the logo. Use the height of the “t” as a guide.</li>
          <li>Choose a background with strong contrast. Keep images and text outside the clear space.</li>
          <li>Use the supplied files. Do not retype, stretch, or animate the logo.</li>
        </ul>
      </section>

      <section className="mt-10 grid gap-5 border-t border-edge-faint pt-8 md:grid-cols-[1fr_2fr] md:gap-12">
        <h2 className="font-display text-3xl">Logo colors.</h2>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            ['Dark ink', '#15140F'],
            ['Light ink', '#F4EFE6'],
            ['Red dot', '#FF5346'],
          ].map(([name, hex]) => (
            <div key={name}>
              <div className="mb-3 h-12 border border-edge-faint" style={{ background: hex }} aria-hidden="true" />
              <dt className="text-sm">{name}</dt>
              <dd className="mt-1 font-mono text-xs text-ink-muted">{hex}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
