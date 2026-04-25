import HomePage from '../../components/v2/HomePage'

/**
 * /v2 home — donor metadata copied verbatim from app/page.jsx's
 * sibling layout export so social cards and titles stay identical
 * to the canonical home. When v2 is promoted, the metadata simply
 * moves up to app/page.jsx alongside this body.
 */
export const metadata = {
  title: 'Talkie - A selfie. For your mind.',
  description:
    'A selfie. For your mind. Capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
  applicationName: 'Talkie',
  openGraph: {
    title: 'Talkie - A selfie. For your mind.',
    description:
      'A selfie. For your mind. Capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
    url: 'https://usetalkie.com',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Talkie - A selfie. For your mind.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talkie - A selfie. For your mind.',
    description:
      'A selfie. For your mind. Capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <HomePage />
}
