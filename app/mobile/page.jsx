import MobilePage from '../../components/MobilePage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Free Talkie App for iPhone and Apple Watch'
const PAGE_DESCRIPTION =
  'Talkie for iPhone and Apple Watch is free. Capture a thought away from your desk, sync through iCloud, and continue with dictation and workflows on Mac.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: 'https://usetalkie.com/mobile/',
    types: { 'text/markdown': 'https://usetalkie.com/mobile.md' },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/mobile/',
    siteName: 'Talkie',
    images: [
      {
        url: '/og/mobile.png',
        width: 1200,
        height: 630,
        alt: 'Talkie for Mobile',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og/mobile.png'],
  },
}

export default function Page() {
  return (
    <MainShell>
      <MobilePage />
    </MainShell>
  )
}
