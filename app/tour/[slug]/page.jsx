import { getAllTourSlugs, getTourBySlug } from '../../../lib/tour'
import TourSlide from '../../../components/TourSlide'

// Required for static export — tells Next.js which slugs to pre-render
export function generateStaticParams() {
  return getAllTourSlugs().map(slug => ({ slug }))
}

// Per-slide OG tags — screenshot as social preview image
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
