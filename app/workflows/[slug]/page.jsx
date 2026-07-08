import { notFound } from 'next/navigation'
import MainShell from '../../../components/MainShell'
import WorkflowDetailPage from '../../../components/WorkflowDetailPage'
import { WORKFLOWS, getWorkflow } from '../../../components/workflows/workflowsData'

// Static export: emit one HTML page per workflow slug.
export function generateStaticParams() {
  return WORKFLOWS.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const workflow = getWorkflow(slug)
  if (!workflow) return { title: 'Workflow — Talkie' }
  const title = `${workflow.name} — Talkie Workflows`
  return {
    title,
    description: workflow.subhead,
    openGraph: {
      title,
      description: workflow.subhead,
      url: `https://usetalkie.com/workflows/${workflow.slug}`,
      siteName: 'Talkie',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: workflow.subhead,
    },
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const workflow = getWorkflow(slug)
  if (!workflow) notFound()
  return (
    <MainShell>
      <WorkflowDetailPage workflow={workflow} />
    </MainShell>
  )
}
