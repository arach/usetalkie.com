import { getAllTourSlugs, getTourBySlug, tourPlatformLabel, tourSeoTitle } from '../../../lib/tour'
import TourSlide from '../../../components/TourSlide'

const TOUR_HUB = 'https://usetalkie.com/tour/'

// Required for static export — tells Next.js which slugs to pre-render
export function generateStaticParams() {
  return getAllTourSlugs().map(slug => ({ slug }))
}

// Per-slide OG tags for sharing. Slides are screenshot pages, so they
// noindex and canonicalize to the /tour/ hub instead of competing as
// thin standalone results.
export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = getTourBySlug(slug)
  if (!item) {
    return {
      title: 'Tour — Talkie',
      robots: { index: false, follow: true },
      alternates: { canonical: TOUR_HUB },
    }
  }

  const platformLabel = tourPlatformLabel(item.platform)
  const title = tourSeoTitle(item)
  const description = item.description
  const url = `https://usetalkie.com/tour/${slug}/`

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: TOUR_HUB },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Talkie',
      images: [{ url: item.src, alt: `${item.title} — Talkie for ${platformLabel}` }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.src],
    },
  }
}

export default async function TourPage({ params }) {
  const { slug } = await params
  return <TourSlide slug={slug} />
}
