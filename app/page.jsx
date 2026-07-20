import HomePage from '../components/home/HomePage'
import MainShell from '../components/MainShell'

// SEO note: the title pairs the brand line with search vocabulary —
// "voice dictation for Mac" is what people actually type; "a remote
// control for your agents" is what makes it Talkie. Keep both halves.
const HOME_TITLE = 'Talkie — Voice Dictation for Mac & a Remote Control for Your Agents'
const HOME_DESCRIPTION =
  'Free, local-first voice dictation for Mac, iPhone, and Apple Watch. On-device speech-to-text, and workflows that turn talk into drafts, tasks, files — and moving agents.'

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
