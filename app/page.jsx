import HomePage from '../components/home/HomePage'
import MainShell from '../components/MainShell'

// SEO note: the title pairs search vocabulary ("voice dictation for Mac")
// with the Talkie-specific claim ("remote for agents"). Keep both halves
// and stay inside ~50–60 characters so the SERP title does not truncate.
const HOME_TITLE = 'Talkie - Voice Dictation for Mac, Remote for Agents'
const HOME_DESCRIPTION =
  'Talkie is a local-first voice dictation app for Mac, iPhone, and Apple Watch. It turns speech into text, searchable captures, workflows, and agent input.'

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
  alternates: {
    canonical: 'https://usetalkie.com/',
    types: { 'text/markdown': 'https://usetalkie.com/index.md' },
  },
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
