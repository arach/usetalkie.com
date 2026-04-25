import { getAllTourSlugs, getTourBySlug } from '../../../../lib/tour'
import TourSlide from '../../../../components/v2/TourSlide'

/**
 * v2 tour slide page.
 *
 * Server wrapper (static params + per-slide metadata). The slide body
 * itself is a client component because it owns audio playback, keyboard
 * nav, and clipboard interaction.
 */

export function generateStaticParams() {
  return getAllTourSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = getTourBySlug(slug)
  if (!item) return { title: 'Tour — Talkie' }

  const platformLabel = item.platform === 'iphone' ? 'iPhone' : 'Mac'
  const title = `${item.title} — Talkie Tour`
  const description = item.caption

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://usetalkie.com/v2/tour/${slug}`,
      siteName: 'Talkie',
      locale: 'en_US',
      type: 'article',
      images: [{ url: item.src, alt: `${item.title} — Talkie for ${platformLabel}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.src],
    },
  }
}

export default async function V2TourPage({ params }) {
  const { slug } = await params
  return <TourSlide slug={slug} />
}
