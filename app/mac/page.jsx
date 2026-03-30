import LivePage from '../../components/LivePage'

export const metadata = {
  title: 'Talkie for Mac — Context-aware capture on desktop',
  description: 'Talkie for Mac is a keyboard-first capture system for knowledge workers. Dictate anywhere, keep transcripts searchable, and turn captured thoughts into workflows, files, and actions.',
  keywords: ['dictation', 'voice to text', 'macos', 'workflow', 'local', 'privacy', 'productivity'],
  openGraph: {
    title: 'Talkie for Mac — Context-aware capture on desktop',
    description: 'Talkie for Mac is a keyboard-first capture system for knowledge workers. Dictate anywhere, keep transcripts searchable, and turn captured thoughts into workflows, files, and actions.',
    url: 'https://usetalkie.com/mac',
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
    title: 'Talkie for Mac — Context-aware capture on desktop',
    description: 'Talkie for Mac is a keyboard-first capture system for knowledge workers. Dictate anywhere, keep transcripts searchable, and turn captured thoughts into workflows, files, and actions.',
    images: ['/og-live.png'],
  },
}

export default function Page() {
  return <LivePage />
}
