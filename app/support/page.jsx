import SupportPage from '../../components/SupportPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Support — Talkie',
  description: 'Get help with Talkie. Browse common topics, troubleshooting guides, and contact our support team.',
  alternates: { canonical: 'https://usetalkie.com/support/' },
  openGraph: {
    title: 'Support — Talkie',
    description: 'Get help with Talkie. Browse common topics and contact support.',
    url: 'https://usetalkie.com/support/',
    siteName: 'Talkie',
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
