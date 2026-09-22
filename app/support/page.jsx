import SupportPage from '../../components/SupportPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Support — Talkie'
const PAGE_DESCRIPTION =
  'Support for Talkie on Mac, iPhone, and Apple Watch. Browse common topics, troubleshooting for dictation and sync, and contact the Talkie support team.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/support/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/support/',
    siteName: 'Talkie',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
}

export default function Page() {
  return (
    <MainShell>
      <SupportPage />
    </MainShell>
  )
}
