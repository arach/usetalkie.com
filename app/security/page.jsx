import SecurityPage from '../../components/SecurityPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Security & Privacy - Talkie'
const PAGE_DESCRIPTION =
  'Talkie keeps recordings and transcripts in a local library, syncs through your iCloud, and supports on-device models plus optional providers with your keys.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: 'https://usetalkie.com/security/',
    types: { 'text/markdown': 'https://usetalkie.com/security.md' },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/security/',
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
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function Security() {
  return (
    <MainShell>
      <SecurityPage />
    </MainShell>
  )
}
