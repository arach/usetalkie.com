import { getAllComparisons } from '../../lib/ideas'
import IdeasPage from '../../components/IdeasPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Compare Talkie',
  description: 'Compare Talkie with dictation, transcription, and voice-control apps for Mac.',
  alternates: { canonical: 'https://usetalkie.com/compare/' },
  openGraph: {
    title: 'Compare Talkie',
    description: 'Compare Talkie with dictation, transcription, and voice-control apps for Mac.',
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
        title="Compare Talkie."
        description="Straightforward comparisons of Talkie and other dictation, transcription, and voice-control apps."
      />
    </MainShell>
  )
}
