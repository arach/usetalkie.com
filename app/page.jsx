import HomePage from '../components/home/HomePage'
import MainShell from '../components/MainShell'

/**
 * Root homepage `/` — renders the panoramic-instrument hero with the
 * shared site chrome via MainShell. The donor `LandingPage.jsx` is
 * preserved in components/ for reference but no longer mounted at any
 * route.
 */
export const metadata = {
  title: 'Talkie - A selfie. For your brain.',
  description:
    'A selfie. For your brain. Talk, and the work starts moving.',
  applicationName: 'Talkie',
  openGraph: {
    title: 'Talkie - A selfie. For your brain.',
    description:
      'A selfie. For your brain. Talk, and the work starts moving.',
    url: 'https://usetalkie.com',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Talkie - A selfie. For your brain.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talkie - A selfie. For your brain.',
    description:
      'A selfie. For your brain. Talk, and the work starts moving.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return (
    <MainShell>
      <HomePage />
    </MainShell>
  )
}
