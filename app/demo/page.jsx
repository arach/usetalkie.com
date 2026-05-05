import DemoPage from '../../components/DemoPage'
import MainShell from '../../components/MainShell'

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
  return (
    <MainShell>
      <DemoPage />
    </MainShell>
  )
}
