import LifecyclePage from '../../../components/docs/LifecyclePage'

export const metadata = {
  title: 'Lifecycle - Talkie Docs',
  description: 'Understanding the journey from voice to action. Every recording flows through distinct phases, each with natural extension points.',
  openGraph: {
    title: 'Lifecycle — Talkie Docs',
    description: 'The journey from voice to action with extension points.',
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
