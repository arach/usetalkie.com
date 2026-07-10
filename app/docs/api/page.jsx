import ApiPage from '../../../components/docs/ApiPage'

export const metadata = {
  title: 'API Reference — Talkie Docs',
  description: 'API reference for Talkie. TalkieServer HTTP endpoints, URL schemes, and integration points.',
  alternates: { canonical: 'https://usetalkie.com/docs/api/' },
  openGraph: {
    title: 'API Reference — Talkie Docs',
    description: 'HTTP endpoints, URL schemes, and integration points.',
    url: 'https://usetalkie.com/docs/api/',
    siteName: 'Talkie',
    images: [{ url: '/og/docs-api.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-api.png'],
  },
}

export default function Page() {
  return <ApiPage />
}
