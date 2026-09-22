import MainShell from '../../../components/MainShell'
import WorkflowTemplatesPage from '../../../components/workflows/WorkflowTemplatesPage'

const PAGE_TITLE = 'Workflow Templates — Talkie'
const PAGE_DESCRIPTION =
  'Talkie workflow templates for voice-to-file, email, Obsidian, Claude, CLI, and GitHub. Download recipes that turn speech into structured follow-up work.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://usetalkie.com/workflows/templates/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/workflows/templates/',
    siteName: 'Talkie',
    type: 'website',
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
      <WorkflowTemplatesPage />
    </MainShell>
  )
}
