import MacPage from '../../../components/v2/MacPage'

export const metadata = {
  title: 'Talkie for Mac - Talk to your Mac',
  description:
    'Capture a thought, shape a draft, search what you said, or kick off a workflow from your Mac. A mic is all you need.',
  keywords: ['dictation', 'voice to text', 'macos', 'workflow', 'local', 'privacy', 'productivity'],
  openGraph: {
    title: 'Talkie for Mac - Talk to your Mac',
    description:
      'Capture a thought, shape a draft, search what you said, or kick off a workflow from your Mac. A mic is all you need.',
    type: 'website',
    images: ['/og-live.png'],
  },
}

export default function Page() {
  return <MacPage />
}
