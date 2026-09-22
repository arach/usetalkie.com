import PhilosophyPage from '../../components/PhilosophyPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Philosophy — Talkie'
const PAGE_DESCRIPTION =
  'Philosophy behind Talkie: local-first voice capture for agents and everyday work. Voice, local context, and Apple devices make remote and desk use practical.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/philosophy/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/philosophy/',
    siteName: 'Talkie',
    type: 'website',
  },
}

export default function Page() {
  return (
    <MainShell>
      <PhilosophyPage />
    </MainShell>
  )
}
