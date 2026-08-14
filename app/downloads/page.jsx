import DownloadAllPage from '../../components/DownloadAllPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Download Talkie for Mac, iPhone, and Apple Watch'
const PAGE_DESCRIPTION =
  'Download the current free Mac build or get the free iPhone and Apple Watch apps. A 7-day trial and $39 one-time Mac license are planned.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: 'https://usetalkie.com/downloads/',
    types: { 'text/markdown': 'https://usetalkie.com/downloads.md' },
  },
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
