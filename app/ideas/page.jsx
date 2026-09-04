import { getAllIdeas } from '../../lib/ideas'
import IdeasPage from '../../components/IdeasPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Ideas - Talkie',
  description: 'Essays and notes on voice computing, local models, and the tools we build around Talkie.',
  alternates: { canonical: 'https://usetalkie.com/ideas/' },
  openGraph: {
    title: 'Ideas - Talkie',
    description: 'Essays and notes on voice computing, local models, and the tools we build around Talkie.',
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
