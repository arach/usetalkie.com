import TourLandingPage from '../../components/TourLandingPage'

export const metadata = {
  title: 'Tour — See Talkie in action',
  description:
    'Watch the high-level demo, then explore every screen in detail. Mac, iPhone, and Watch.',
  alternates: { canonical: 'https://usetalkie.com/tour/' },
  openGraph: {
    title: 'Tour — See Talkie in action',
    description:
      'Watch the high-level demo, then explore every screen in detail. Mac, iPhone, and Watch.',
    url: 'https://usetalkie.com/tour/',
    siteName: 'Talkie',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Talkie Tour' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tour — See Talkie in action',
    description:
      'Watch the high-level demo, then explore every screen in detail. Mac, iPhone, and Watch.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <TourLandingPage />
}
