import MobilePage from '../../components/MobilePage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Free Talkie App for iPhone and Apple Watch',
  description: 'Talkie for iPhone and Apple Watch is free. Capture a thought away from your desk, then continue on your Mac.',
  alternates: { canonical: 'https://usetalkie.com/mobile/' },
  openGraph: {
    title: 'Free Talkie App for iPhone and Apple Watch',
    description: 'Talkie for iPhone and Apple Watch is free. Capture a thought away from your desk, then continue on your Mac.',
    url: 'https://usetalkie.com/mobile/',
    siteName: 'Talkie',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Talkie for Mobile',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Talkie App for iPhone and Apple Watch',
    description: 'Talkie for iPhone and Apple Watch is free. Capture a thought away from your desk, then continue on your Mac.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return (
    <MainShell>
      <MobilePage />
    </MainShell>
  )
}
