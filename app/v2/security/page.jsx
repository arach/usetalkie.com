import SecurityPage from '../../../components/v2/SecurityPage'

export const metadata = {
  title: 'Security & Privacy - Talkie',
  description:
    'Local library, iCloud sync, on-device transcription, and optional external providers with your own keys.',
  openGraph: {
    title: 'Security & Privacy - Talkie',
    description:
      'Local library, iCloud sync, on-device transcription, and optional external providers with your own keys.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security & Privacy - Talkie',
    description:
      'Local library, iCloud sync, on-device transcription, and optional external providers with your own keys.',
    images: ['/og-image.png'],
  },
}

/**
 * /v2/security — server-rendered security & privacy page.
 * Layout (app/v2/layout.jsx) wraps this in <SiteShell> with bg-canvas + text-ink.
 */
export default function V2SecurityRoute() {
  return <SecurityPage />
}
