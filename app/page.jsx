import HomePage from '../components/home/HomePage'
import MainShell from '../components/MainShell'

const HOME_TITLE = 'Talkie - Talk to your Mac'
const HOME_DESCRIPTION =
  'Capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.'

/**
 * Root homepage `/` — renders the panoramic-instrument hero with the
 * shared site chrome via MainShell. The donor `LandingPage.jsx` is
 * preserved in components/ for reference but no longer mounted at any
 * route.
 */
export const metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  applicationName: 'Talkie',
  alternates: { canonical: 'https://usetalkie.com/' },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: 'https://usetalkie.com/',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
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
