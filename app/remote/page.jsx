import RemoteControlPage from '../../components/remote/RemoteControlPage'
import MainShell from '../../components/MainShell'

/**
 * Staging route. Noindex until the claim pass in the upstream handoff is
 * complete and the route posture (/remote vs /features) is decided.
 */
export const metadata = {
  title: 'Remote — Talkie',
  description:
    'Talkie is a remote control for your agents: send the instruction, carry the working context, and receive the result where the work already is.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return (
    <MainShell>
      <RemoteControlPage />
    </MainShell>
  )
}
