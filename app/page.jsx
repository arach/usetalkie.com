import HomePage from '../components/v4/HomePage'
import SiteShell from '../components/v2/SiteShell'
import { NarratorProvider, NarratorDock } from '../components/v2/narrator'

/**
 * Root homepage `/` — renders the v4 panoramic-instrument hero with the
 * shared site chrome (header, footer, narrator). The original donor
 * landing page is preserved at `components/LandingPage.jsx` for reference;
 * `/v4/` continues to serve the same composition for direct comparison.
 *
 * Open-graph + Twitter metadata mirrors `app/v4/page.jsx` so the canonical
 * URL `https://usetalkie.com/` and `/v4/` produce identical social cards.
 */
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
  return (
    <NarratorProvider>
      <div className="min-h-screen bg-canvas text-ink antialiased">
        <SiteShell>
          <HomePage />
        </SiteShell>
      </div>
      <NarratorDock />
    </NarratorProvider>
  )
}
