import WorkflowsPage from '../../../components/docs/WorkflowsPage'

export const metadata = {
  title: 'Workflows — Talkie Docs',
  description: 'Learn about Talkie\'s workflow system. Triggers, actions, built-in workflows, and creating custom automations.',
  openGraph: {
    title: 'Workflows — Talkie Docs',
    description: 'Triggers, actions, and custom automations.',
    images: [{ url: '/og/docs-workflows.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-workflows.png'],
  },
}

export default function Page() {
  return <WorkflowsPage />
}
