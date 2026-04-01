import CapturePage from '../../components/CapturePage'

export const metadata = {
  title: 'Talkie for Mobile - Catch it while it is still live',
  description: 'Capture on iPhone and Apple Watch when you are away from your desk, then pick the thread back up on your Mac.',
  openGraph: {
    title: 'Talkie for Mobile - Catch it while it is still live',
    description: 'Capture on iPhone and Apple Watch when you are away from your desk, then pick the thread back up on your Mac.',
    url: 'https://usetalkie.com/mobile',
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
    title: 'Talkie for Mobile - Catch it while it is still live',
    description: 'Capture on iPhone and Apple Watch when you are away from your desk, then pick the thread back up on your Mac.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <CapturePage />
}
