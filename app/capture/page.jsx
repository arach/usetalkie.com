import MobilePage from '../../components/MobilePage'
import MainShell from '../../components/MainShell'

// Alias of /mobile — canonical elsewhere; do not index this thin duplicate.
export const metadata = {
  title: 'On The Go — Talkie',
  description:
    'Talkie for iPhone and Apple Watch is free. Capture a thought away from your desk, sync through iCloud, and continue with dictation and workflows on Mac.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://usetalkie.com/mobile/' },
}

export default function Page() {
  return (
    <MainShell>
      <MobilePage />
    </MainShell>
  )
}
