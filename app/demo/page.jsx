import DemoPage from '../../components/DemoPage'

export const metadata = {
  title: 'Demo - Talkie',
  description: 'See Talkie in action. Watch how voice-to-action works on your Mac with iPhone and Watch capture.',
  openGraph: {
    title: 'Demo - Talkie',
    description: 'See Talkie in action. Watch how voice-to-action works on your Mac.',
    images: ['/og-image.png'],
  },
}

export default function Demo() {
  return <DemoPage />
}
