import Link from 'next/link'
import { getEvidenceComparison } from '../../lib/comparisons'

export default function ComparisonGuide({ competitor: competitorSlug }) {
  const { competitor, page } = getEvidenceComparison(competitorSlug)

  return (
    <section className="border-b border-edge-faint bg-canvas-alt" aria-labelledby="comparison-guide-title">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trace">
            · AT A GLANCE
          </p>
          <Link
            href="#comparison-matrix"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted underline decoration-edge-dim underline-offset-4 transition-colors hover:text-trace"
          >
            Jump to matrix ↓
          </Link>
        </div>

        <h2 id="comparison-guide-title" className="mt-4 font-display text-2xl font-normal leading-tight text-ink md:text-3xl">
          Choose the voice workflow that fits.
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-edge-dim bg-surface p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-amber">Talkie</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{page.picks.talkie.title}</p>
          </div>
          <div className="rounded-md border border-edge-dim bg-surface p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{competitor.name}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{page.picks.competitor.title}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
