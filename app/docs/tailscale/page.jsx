import TailscalePage from '../../../components/docs/TailscalePage'

export const metadata = {
  title: 'Tailscale Setup — Talkie Docs',
  description: 'Configure Tailscale for secure, peer-to-peer networking between your Mac and iPhone. No port forwarding required.',
  openGraph: {
    title: 'Tailscale Setup — Talkie Docs',
    description: 'Secure peer-to-peer networking between Mac and iPhone.',
    images: [{ url: '/og/docs-tailscale.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-tailscale.png'],
  },
}

export default function Page() {
  return <TailscalePage />
}
