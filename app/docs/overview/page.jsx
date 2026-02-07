import OverviewPage from '../../../components/docs/OverviewPage'

export const metadata = {
  title: 'Overview — Talkie Docs',
  description: 'Introduction to Talkie\'s philosophy, local-first design, and multi-process architecture. Learn how privacy and performance work together.',
  openGraph: {
    title: 'Overview — Talkie Docs',
    description: 'Philosophy, local-first design, and multi-process architecture.',
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
