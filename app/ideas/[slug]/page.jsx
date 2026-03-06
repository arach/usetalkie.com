import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllSlugs, getIdeaBySlug } from '../../../lib/ideas'
import IdeaLayout from '../../../components/IdeaLayout'
import TranscriptionDiff from '../../../components/TranscriptionDiff'
import StatsRow from '../../../components/blog/StatsRow'
import AccuracyBar from '../../../components/blog/AccuracyBar'
import PipelineFlow from '../../../components/blog/PipelineFlow'
import VocabGrid from '../../../components/blog/VocabGrid'
import DomainGrid from '../../../components/blog/DomainGrid'
import TrainingCurve from '../../../components/blog/TrainingCurve'
import ParameterBudget from '../../../components/blog/ParameterBudget'
import InputZones from '../../../components/blog/InputZones'
import LoraExplainer from '../../../components/blog/LoraExplainer'
import QuantizationSteps from '../../../components/blog/QuantizationSteps'

const mdxComponents = {
  TranscriptionDiff,
  StatsRow,
  AccuracyBar,
  PipelineFlow,
  VocabGrid,
  DomainGrid,
  TrainingCurve,
  ParameterBudget,
  InputZones,
  LoraExplainer,
  QuantizationSteps,
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
}

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const idea = getIdeaBySlug(slug)

  return {
    title: `${idea.title} - Talkie Ideas`,
    description: idea.description,
    openGraph: {
      title: `${idea.title} - Talkie Ideas`,
      description: idea.description,
      url: `https://usetalkie.com/ideas/${slug}`,
      siteName: 'Talkie',
      locale: 'en_US',
      type: 'article',
      publishedTime: idea.date,
      tags: idea.tags,
      images: [{ url: `/og/ideas/${slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/og/ideas/${slug}.png`],
    },
  }
}

export default async function IdeaPost({ params }) {
  const { slug } = await params
  const idea = getIdeaBySlug(slug)

  return (
    <IdeaLayout
      title={idea.title}
      description={idea.description}
      date={idea.date}
      tags={idea.tags}
    >
      <MDXRemote source={idea.content} components={mdxComponents} options={mdxOptions} />
    </IdeaLayout>
  )
}
