import MacPage from '../../components/MacPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Talkie for Mac - Local Voice Dictation'
const PAGE_DESCRIPTION =
  'Talkie for Mac is local-first voice dictation. Speak into any app, keep searchable captures, and run workflows. Current build free; $39 license planned.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ['dictation', 'voice to text', 'macos', 'workflow', 'local', 'privacy', 'productivity'],
  alternates: {
    canonical: 'https://usetalkie.com/mac/',
    types: { 'text/markdown': 'https://usetalkie.com/mac.md' },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/mac/',
    siteName: 'Talkie',
    images: [
      {
        url: '/og-live.png',
        width: 1200,
        height: 630,
        alt: 'Talkie for Mac',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og-live.png'],
  },
}

export default function Page() {
  return (
    <MainShell>
      <MacPage />
    </MainShell>
  )
}
