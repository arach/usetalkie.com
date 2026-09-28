import BrandPage from '../../components/BrandPage'
import MainShell from '../../components/MainShell'

const pageMetadata = {
  title: 'Talkie Brand Assets and Wordmark Guidelines',
  description:
    'Download the official Talkie logos as SVG and PNG files for light or dark backgrounds. Find the brand colors and simple guidelines for using the wordmark consistently.',
  alternates: { canonical: 'https://usetalkie.com/brand/' },
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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: pageMetadata.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMetadata.title,
    description: pageMetadata.description,
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return (
    <MainShell>
      <BrandPage />
    </MainShell>
  )
}
