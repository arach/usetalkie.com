import MainShell from '../../../components/MainShell'
import WorkflowTemplatesPage from '../../../components/workflows/WorkflowTemplatesPage'

export const metadata = {
  title: 'Workflow Templates — Talkie',
  description:
    'Downloadable Talkie workflow recipes for voice-to-file, voice-to-email, voice-to-agent, and voice-to-GitHub automation.',
  alternates: { canonical: 'https://usetalkie.com/workflows/templates/' },
  openGraph: {
    title: 'Workflow Templates — Talkie',
    description:
      'Downloadable Talkie workflow recipes for voice-to-file, voice-to-email, voice-to-agent, and voice-to-GitHub automation.',
    url: 'https://usetalkie.com/workflows/templates/',
    siteName: 'Talkie',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workflow Templates — Talkie',
    description:
      'Downloadable Talkie workflow recipes for voice-to-file, voice-to-email, voice-to-agent, and voice-to-GitHub automation.',
  },
}

export default function Page() {
  return (
    <MainShell>
      <WorkflowTemplatesPage />
    </MainShell>
  )
}
