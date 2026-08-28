import PhilosophyPage from '../../components/PhilosophyPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Philosophy — Talkie',
  description: 'Talkie began as a remote control for agents. Voice, local context, and Apple devices make remote use practical.',
  alternates: { canonical: 'https://usetalkie.com/philosophy/' },
}

export default function Page() {
  return (
    <MainShell>
      <PhilosophyPage />
    </MainShell>
  )
}
