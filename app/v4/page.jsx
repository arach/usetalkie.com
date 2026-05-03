import HomePage from '../../components/v4/HomePage'

export const metadata = {
  title: 'Talkie - A selfie. For your thoughts.',
  description:
    'A selfie. For your thoughts. Capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
  applicationName: 'Talkie',
  openGraph: {
    title: 'Talkie - A selfie. For your thoughts.',
    description:
      'A selfie. For your thoughts. Capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
    url: 'https://usetalkie.com',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Talkie - A selfie. For your thoughts.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talkie - A selfie. For your thoughts.',
    description:
      'A selfie. For your thoughts. Capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <HomePage />
}
