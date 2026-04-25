import WorkflowsPage from '../../../components/v2/WorkflowsPage'

export const metadata = {
  title: 'Workflows — Talkie',
  description:
    'Turn captured speech into drafts, tasks, files, and follow-up actions with private workflows on Mac.',
  keywords: [
    'voice workflows',
    'dictation automation',
    'local-first',
    'shell command',
    'claude cli',
    'macos',
  ],
  openGraph: {
    title: 'Workflows — Talkie',
    description:
      'Voice-driven pipelines that turn captured speech into drafts, tasks, files, and follow-up actions — local-first and auditable.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workflows — Talkie',
    description:
      'Voice-driven pipelines that turn captured speech into drafts, tasks, files, and follow-up actions — local-first and auditable.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <WorkflowsPage />
}
