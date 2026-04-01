import LivePage from '../../components/LivePage'

export const metadata = {
  title: 'Talkie for Mac - Talk to your Mac',
  description: 'Capture a thought, shape a draft, search what you said, or kick off a workflow from your Mac. A mic is all you need.',
  keywords: ['dictation', 'voice to text', 'macos', 'workflow', 'local', 'privacy', 'productivity'],
  openGraph: {
    title: 'Talkie for Mac - Talk to your Mac',
    description: 'Capture a thought, shape a draft, search what you said, or kick off a workflow from your Mac. A mic is all you need.',
    url: 'https://usetalkie.com/live',
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
    title: 'Talkie for Mac - Talk to your Mac',
    description: 'Capture a thought, shape a draft, search what you said, or kick off a workflow from your Mac. A mic is all you need.',
    images: ['/og-live.png'],
  },
}

export default function Page() {
  return <LivePage />
}
