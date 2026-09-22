import DocsIndexPage from '../../components/docs/DocsIndexPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Documentation — Talkie'
const PAGE_DESCRIPTION =
  'Talkie docs cover local-first architecture, CLI, workflows, API, and setup. Learn how dictation, captures, and agents work across Mac, iPhone, and Watch.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/docs/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/docs/',
    siteName: 'Talkie',
    images: [{ url: '/og/docs.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og/docs.png'],
  },
}

export default function Page() {
  return (
    <MainShell>
      <DocsIndexPage />
    </MainShell>
  )
}
