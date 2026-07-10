import PhilosophyPage from '../../components/PhilosophyPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Philosophy — Talkie',
  description: 'Your best ideas don\'t wait for you to sit down. Read our philosophy on local-first voice capture and AI workflows.',
  alternates: { canonical: 'https://usetalkie.com/philosophy/' },
}

export default function Page() {
  return (
    <MainShell>
      <PhilosophyPage />
    </MainShell>
  )
}
