import TourLandingPage from '../../components/TourLandingPage'

const PAGE_TITLE = 'Tour — See Talkie in action'
const PAGE_DESCRIPTION =
  'Tour Talkie on Mac, iPhone, and Apple Watch. Watch the product demo, then browse screens for dictation, library, workflows, and mobile capture.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/tour/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/tour/',
    siteName: 'Talkie',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Talkie Tour' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <TourLandingPage />
}
