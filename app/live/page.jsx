import MacPage from '../../components/MacPage'
import MainShell from '../../components/MainShell'

// Alias of /mac — keep shareable, but do not compete as a duplicate index entry.
export const metadata = {
  title: 'Talkie Live Dictation for Mac',
  description:
    'Talkie for Mac is local-first voice dictation. Speak into any app, keep searchable captures, and run workflows. Current build free; $39 license planned.',
  keywords: ['dictation', 'voice to text', 'macos', 'workflow', 'local', 'privacy', 'productivity'],
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://usetalkie.com/mac/' },
  openGraph: {
    title: 'Talkie Live Dictation for Mac',
    description:
      'Talkie for Mac is local-first voice dictation. Speak into any app, keep searchable captures, and run workflows. Current build free; $39 license planned.',
    url: 'https://usetalkie.com/mac/',
    siteName: 'Talkie',
    images: [
      {
        url: '/og-live.png',
        width: 1200,
        height: 630,
        alt: 'Talkie Dictation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talkie Live Dictation for Mac',
    description:
      'Talkie for Mac is local-first voice dictation. Speak into any app, keep searchable captures, and run workflows. Current build free; $39 license planned.',
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
