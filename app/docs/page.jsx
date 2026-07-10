import DocsIndexPage from '../../components/docs/DocsIndexPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Documentation — Talkie',
  description: 'Setup guides and technical documentation for Talkie. Learn how to configure TalkieServer, Tailscale, and connect your devices.',
  alternates: { canonical: 'https://usetalkie.com/docs/' },
  openGraph: {
    title: 'Documentation — Talkie',
    description: 'Setup guides and technical documentation for Talkie.',
    url: 'https://usetalkie.com/docs/',
    siteName: 'Talkie',
    images: [{ url: '/og/docs.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs.png'],
  },
}

export default function Page() {
  return (
    <MainShell>
      <DocsIndexPage />
    </MainShell>
  )
}
