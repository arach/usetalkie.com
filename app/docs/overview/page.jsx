import OverviewPage from '../../../components/docs/OverviewPage'

export const metadata = {
  title: 'Overview — Talkie Docs',
  description: "Overview of Talkie's philosophy, local-first design, and multi-process architecture. See how privacy, performance, and device capture fit together.",
  alternates: { canonical: 'https://usetalkie.com/docs/overview/' },
  openGraph: {
    title: 'Overview — Talkie Docs',
    description: 'Philosophy, local-first design, and multi-process architecture.',
    url: 'https://usetalkie.com/docs/overview/',
    siteName: 'Talkie',
    images: [{ url: '/og/docs-overview.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-overview.png'],
  },
}

export default function Page() {
  return <OverviewPage />
}
