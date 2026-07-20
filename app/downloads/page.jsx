import DownloadAllPage from '../../components/DownloadAllPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Download Talkie — Free Voice Dictation App for Mac & iPhone'
const PAGE_DESCRIPTION =
  'Download Talkie free for Mac and iPhone. On-device speech-to-text with iCloud sync across Mac, iPhone, and Apple Watch. Install the app, use the CLI, or scan the QR code for iOS.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/downloads/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/downloads/',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: PAGE_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return (
    <MainShell>
      <DownloadAllPage />
    </MainShell>
  )
}
