import ThankYouPage from '../../components/ThankYouPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Thank You | Talkie',
  description: 'Thanks for signing up for early access to Talkie.',
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
