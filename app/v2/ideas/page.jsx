import { getAllIdeas } from '../../../lib/ideas'
import IdeasPage from '../../../components/v2/IdeasPage'

export const metadata = {
  title: 'Ideas — Talkie',
  description: 'Concepts and thinking on voice, computing, and the tools we build.',
  openGraph: {
    title: 'Ideas — Talkie',
    description: 'Concepts and thinking on voice, computing, and the tools we build.',
    url: 'https://usetalkie.com/v2/ideas',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
  },
}

export default function V2IdeasRoute() {
  const ideas = getAllIdeas()
  return <IdeasPage ideas={ideas} />
}
