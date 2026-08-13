import MacPage from '../../components/MacPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Talkie for Mac - Local Voice Dictation',
  description: 'Download the current free Mac build. A 7-day trial and a $39 one-time license for up to two Macs are planned.',
  keywords: ['dictation', 'voice to text', 'macos', 'workflow', 'local', 'privacy', 'productivity'],
  alternates: { canonical: 'https://usetalkie.com/mac/' },
  openGraph: {
    title: 'Talkie for Mac - Local Voice Dictation',
    description: 'Download the current free Mac build. A 7-day trial and a $39 one-time license for up to two Macs are planned.',
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
    title: 'Talkie for Mac - Local Voice Dictation',
    description: 'Download the current free Mac build. A 7-day trial and a $39 one-time license for up to two Macs are planned.',
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
