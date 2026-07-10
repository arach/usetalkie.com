import ExtensibilityPage from '../../../components/docs/ExtensibilityPage'

export const metadata = {
  title: 'Extensibility — Talkie Docs',
  description: 'Extend Talkie with hooks, webhooks, custom workflows, and integration points. Build on top of the Talkie platform.',
  alternates: { canonical: 'https://usetalkie.com/docs/extensibility/' },
  openGraph: {
    title: 'Extensibility — Talkie Docs',
    description: 'Hooks, webhooks, and building on the Talkie platform.',
    url: 'https://usetalkie.com/docs/extensibility/',
    siteName: 'Talkie',
    images: [{ url: '/og/docs-extensibility.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-extensibility.png'],
  },
}

export default function Page() {
  return <ExtensibilityPage />
}
