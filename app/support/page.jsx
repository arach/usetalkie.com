import SupportPage from '../../components/SupportPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Support — Talkie',
  description: 'Get help with Talkie. Browse common topics, troubleshooting guides, and contact our support team.',
  openGraph: {
    title: 'Support — Talkie',
    description: 'Get help with Talkie. Browse common topics and contact support.',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function Page() {
  return (
    <MainShell>
      <SupportPage />
    </MainShell>
  )
}
