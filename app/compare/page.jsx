import { getAllComparisons } from '../../lib/ideas'
import IdeasPage from '../../components/IdeasPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Compare Talkie'
const PAGE_DESCRIPTION =
  'Compare Talkie with Mac dictation, transcription, and voice-control apps. Fair first-party guides that say when Talkie or another tool fits better.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: 'https://usetalkie.com/compare/',
    types: { 'text/markdown': 'https://usetalkie.com/compare.md' },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/compare/',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
  },
}

export default function CompareRoute() {
  const comparisons = getAllComparisons()

  return (
    <MainShell>
      <IdeasPage
        ideas={comparisons}
        basePath="/compare"
        eyebrow="· COMPARE · TALKIE"
        title="How does Talkie compare?"
        description="Talkie comparisons explain when Talkie or another dictation, transcription, or voice-control app is the better choice. Each comparison links to first-party sources."
      />
    </MainShell>
  )
}
