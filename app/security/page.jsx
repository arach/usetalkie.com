import SecurityPage from '../../components/SecurityPage'

export const metadata = {
  title: 'Security & Privacy - Talkie',
  description: 'Local library, iCloud sync, on-device transcription, and optional external providers with your own keys.',
  openGraph: {
    title: 'Security & Privacy - Talkie',
    description: 'Local library, iCloud sync, on-device transcription, and optional external providers with your own keys.',
    url: 'https://usetalkie.com/security',
    siteName: 'Talkie',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Talkie security and privacy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security & Privacy - Talkie',
    description: 'Local library, iCloud sync, on-device transcription, and optional external providers with your own keys.',
    images: ['/og-image.png'],
  },
}

export default function Security() {
  return <SecurityPage />
}
