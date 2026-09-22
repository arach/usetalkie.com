import ThankYouPage from '../../components/ThankYouPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Thank You | Talkie',
  description:
    'Thanks for signing up for early access to Talkie. Check your inbox for confirmation, then download the current free Mac build or the free iPhone app.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function Page() {
  return (
    <MainShell>
      <ThankYouPage />
    </MainShell>
  )
}
