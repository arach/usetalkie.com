import DocsIndexPage from '../../../components/v2/docs/DocsIndexPage'

export const metadata = {
  title: 'Documentation — Talkie',
  description:
    'How Talkie works, end to end. Architecture, lifecycle, CLI, workflows, and setup.',
  openGraph: {
    title: 'Documentation — Talkie',
    description: 'How Talkie works, end to end.',
    images: [{ url: '/og/docs.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs.png'],
  },
}

export default function Page() {
  return <DocsIndexPage />
}
