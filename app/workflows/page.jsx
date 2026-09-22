import WorkflowsPage from '../../components/WorkflowsPage'
import MainShell from '../../components/MainShell'

const PAGE_TITLE = 'Workflows — Talkie'
const PAGE_DESCRIPTION =
  'Talkie workflows turn captured speech into drafts, tasks, files, and follow-up actions on your Mac. Private, editable recipes you can run again.'

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: 'https://usetalkie.com/workflows/',
    types: { 'text/markdown': 'https://usetalkie.com/workflows.md' },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://usetalkie.com/workflows/',
    siteName: 'Talkie',
    type: 'website',
  },
}

export default function Page() {
  return (
    <MainShell>
      <WorkflowsPage />
    </MainShell>
  )
}
