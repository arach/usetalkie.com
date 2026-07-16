import LifecyclePage from '../../../components/docs/LifecyclePage'

export const metadata = {
  title: 'Lifecycle - Talkie Docs',
  description: 'What happens between speaking and the result. Every recording moves through distinct phases, each with extension points.',
  alternates: { canonical: 'https://usetalkie.com/docs/lifecycle/' },
  openGraph: {
    title: 'Lifecycle — Talkie Docs',
    description: 'Recording phases and their extension points.',
    url: 'https://usetalkie.com/docs/lifecycle/',
    siteName: 'Talkie',
    images: [{ url: '/og/docs-lifecycle.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-lifecycle.png'],
  },
}

export default function Page() {
  return <LifecyclePage />
}
