import { getAllIdeas } from '../../lib/ideas'
import IdeasPage from '../../components/IdeasPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Ideas - Talkie'
const PAGE_DESCRIPTION =
  'Essays and notes on voice computing, local models, and the tools built around Talkie. Read about CLI agents, on-device models, and capture workflows.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/ideas/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/ideas/',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
  },
}

export default function IdeasRoute() {
  const ideas = getAllIdeas()
  return <IdeasPage ideas={ideas} />
}
