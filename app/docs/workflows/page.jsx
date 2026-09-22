import WorkflowsPage from '../../../components/docs/WorkflowsPage'

export const metadata = {
  title: 'Workflows — Talkie Docs',
  description: 'Talkie workflow system docs: triggers, step types, template variables, LLM providers, shell security, and how custom automations run on Mac.',
  alternates: { canonical: 'https://usetalkie.com/docs/workflows/' },
  openGraph: {
    title: 'Workflows — Talkie Docs',
    description: 'Triggers, actions, and custom automations.',
    url: 'https://usetalkie.com/docs/workflows/',
    siteName: 'Talkie',
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
