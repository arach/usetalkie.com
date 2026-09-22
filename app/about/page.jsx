import AboutPage from '../../components/AboutPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'About - Talkie'
const PAGE_DESCRIPTION =
  'About Talkie and founder Arach Tchoupani. Local-first voice dictation for Mac, iPhone, and Apple Watch for searchable captures, workflows, and agents.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/about/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/about/',
    siteName: 'Talkie',
    type: 'website',
  },
}

export default function About() {
  return (
    <MainShell>
      <AboutPage />
    </MainShell>
  )
}
