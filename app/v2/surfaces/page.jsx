import SurfacesPage from '../../../components/v2/SurfacesPage'

export const metadata = {
  title: 'Surfaces — Talkie',
  description:
    'Mac, iPhone, Apple Watch — many surfaces, one trace. Every capture lands in the same library on your Mac.',
  keywords: ['surfaces', 'mac', 'iphone', 'apple watch', 'cli', 'dictation', 'voice', 'multi-device'],
  openGraph: {
    title: 'Surfaces — Talkie',
    description:
      'Mac, iPhone, Apple Watch — many surfaces, one trace. Every capture lands in the same library on your Mac.',
    type: 'website',
    images: ['/og-live.png'],
  },
}

export default function Page() {
  return <SurfacesPage />
}
