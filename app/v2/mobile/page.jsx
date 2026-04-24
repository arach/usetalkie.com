import MobilePage from '../../../components/v2/MobilePage'

export const metadata = {
  title: 'Talkie for Mobile - Catch it while it is still live',
  description:
    'Capture on iPhone and Apple Watch when you are away from your desk, then pick the thread back up on your Mac.',
  openGraph: {
    title: 'Talkie for Mobile - Catch it while it is still live',
    description:
      'Capture on iPhone and Apple Watch when you are away from your desk, then pick the thread back up on your Mac.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talkie for Mobile - Catch it while it is still live',
    description:
      'Capture on iPhone and Apple Watch when you are away from your desk, then pick the thread back up on your Mac.',
    images: ['/og-image.png'],
  },
}

/**
 * /v2/mobile — server route. The /v2 layout already wraps this in
 * <SiteShell> on the canvas + ink shell.
 */
export default function V2MobileRoute() {
  return <MobilePage />
}
