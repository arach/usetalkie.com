import TourLandingPage from '../../components/TourLandingPage'

export const metadata = {
  title: 'Tour — See Talkie in action',
  description:
    'Watch the high-level demo, then explore every screen in detail. Mac and iPhone, frame by frame.',
  openGraph: {
    title: 'Tour — See Talkie in action',
    description:
      'Watch the high-level demo, then explore every screen in detail. Mac and iPhone, frame by frame.',
    url: 'https://usetalkie.com/tour',
    siteName: 'Talkie',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Talkie Tour' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tour — See Talkie in action',
    description:
      'Watch the high-level demo, then explore every screen in detail. Mac and iPhone, frame by frame.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <TourLandingPage />
}
