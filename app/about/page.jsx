import AboutPage from '../../components/AboutPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'About Talkie: Voice Capture for Mac, iPhone, and Watch'
const PAGE_DESCRIPTION =
  'About Talkie and founder Arach Tchoupani. Local-first voice dictation for Mac, iPhone, and Apple Watch for searchable captures, workflows, and agents.'

const pageMetadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/about/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/about/',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
  },
}

export const metadata = {
  ...pageMetadata,
  openGraph: {
    title: pageMetadata.title,
    description: pageMetadata.description,
    url: pageMetadata.alternates.canonical,
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: pageMetadata.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMetadata.title,
    description: pageMetadata.description,
    images: ['/og/home.png'],
  },
}

export default function About() {
  return (
    <MainShell>
      <AboutPage />
    </MainShell>
  )
}
