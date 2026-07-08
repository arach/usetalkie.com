import { notFound } from 'next/navigation'
import MainShell from '../../../components/MainShell'
import WorkflowDetailPage from '../../../components/WorkflowDetailPage'
import JsonLd from '../../../components/JsonLd'
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
  const url = `https://usetalkie.com/workflows/${workflow.slug}/`
  return {
    title,
    description: workflow.subhead,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: workflow.subhead,
      url,
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
      <JsonLd data={workflowSchema(workflow)} />
      <WorkflowDetailPage workflow={workflow} />
    </MainShell>
  )
}

function workflowSchema(workflow) {
  const url = `https://usetalkie.com/workflows/${workflow.slug}/`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        '@id': `${url}#workflow-recipe`,
        name: `${workflow.name} workflow`,
        description: workflow.subhead,
        url,
        image: 'https://usetalkie.com/images/workflows/voice-in-drafts-tasks-files-processed.png',
        supply: [
          { '@type': 'HowToSupply', name: 'Talkie for Mac' },
          { '@type': 'HowToSupply', name: workflow.flow },
        ],
        step: workflow.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.label,
          text: step.what,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Talkie',
            item: 'https://usetalkie.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Workflows',
            item: 'https://usetalkie.com/workflows/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: workflow.name,
            item: url,
          },
        ],
      },
    ],
  }
}
