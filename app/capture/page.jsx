import MobilePage from '../../components/MobilePage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'On The Go — Talkie',
  description: 'Capture ideas on iPhone and Apple Watch, then continue on your Mac with dictation and workflows.',
  alternates: { canonical: 'https://usetalkie.com/mobile/' },
}

export default function Page() {
  return (
    <MainShell>
      <MobilePage />
    </MainShell>
  )
}
