import AgentsPage from '../../components/AgentsPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Talkie for Agents — Voice-initiated workflows',
  description: 'Talkie with agents. Build voice-initiated agents on Mac that turn speech into structured output.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function Page() {
  return (
    <MainShell>
      <AgentsPage />
    </MainShell>
  )
}
