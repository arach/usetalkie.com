import BridgeSetupPage from '../../../components/docs/BridgeSetupPage'

export const metadata = {
  title: 'TalkieServer Setup — Talkie Docs',
  description: 'Install and configure TalkieServer, the local bridge that connects your Mac and iPhone. Learn about Bun runtime and dependencies.',
  alternates: { canonical: 'https://usetalkie.com/docs/bridge-setup/' },
  openGraph: {
    title: 'TalkieServer Setup — Talkie Docs',
    description: 'Install and configure the local bridge for Mac and iPhone.',
    url: 'https://usetalkie.com/docs/bridge-setup/',
    siteName: 'Talkie',
    images: [{ url: '/og/docs-bridge-setup.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-bridge-setup.png'],
  },
}

export default function Page() {
  return <BridgeSetupPage />
}
