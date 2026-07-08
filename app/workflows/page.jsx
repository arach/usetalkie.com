import WorkflowsPage from '../../components/WorkflowsPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Workflows — Talkie',
  description: 'Turn captured speech into drafts, tasks, files, and follow-up actions with private workflows on Mac.',
  alternates: { canonical: 'https://usetalkie.com/workflows/' },
  openGraph: {
    title: 'Workflows — Talkie',
    description: 'Turn captured speech into drafts, tasks, files, and follow-up actions with private workflows on Mac.',
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
