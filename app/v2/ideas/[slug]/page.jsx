import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllSlugs, getIdeaBySlug } from '../../../../lib/ideas'
import IdeaLayout from '../../../../components/v2/IdeaLayout'
import TranscriptionDiff from '../../../../components/TranscriptionDiff'
import StatsRow from '../../../../components/blog/StatsRow'
import AccuracyBar from '../../../../components/blog/AccuracyBar'
import PipelineFlow from '../../../../components/blog/PipelineFlow'
import VocabGrid from '../../../../components/blog/VocabGrid'
import DomainGrid from '../../../../components/blog/DomainGrid'
import TrainingCurve from '../../../../components/blog/TrainingCurve'
import ParameterBudget from '../../../../components/blog/ParameterBudget'
import InputZones from '../../../../components/blog/InputZones'
import LoraExplainer from '../../../../components/blog/LoraExplainer'
import QuantizationSteps from '../../../../components/blog/QuantizationSteps'
import ModelComparison from '../../../../components/blog/ModelComparison'
import Part2Stats from '../../../../components/blog/Part2Stats'
import MindMap from '../../../../components/blog/MindMap'
import ObsidianNote from '../../../../components/blog/ObsidianNote'
import PromptShowcase from '../../../../components/blog/PromptShowcase'
import CopyableCode from '../../../../components/blog/CopyableCode'
import { VKNote, VKPrompt, VKCode } from '../../../../components/blog/VoiceKnowledgeBlocks'

/**
 * v2 idea slug page.
 *
 * Server component (RSC). Reuses lib/ideas.js verbatim, the existing
 * components/blog/* primitives, and next-mdx-remote/rsc — only the
 * surrounding layout chrome (IdeaLayout) is re-skinned for the v2 canvas.
 */

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
  ModelComparison,
  Part2Stats,
  MindMap,
  ObsidianNote,
  PromptShowcase,
  CopyableCode,
  VKNote,
  VKPrompt,
  VKCode,
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const idea = getIdeaBySlug(slug)

  return {
    title: `${idea.title} — Talkie Ideas`,
    description: idea.description,
    openGraph: {
      title: `${idea.title} — Talkie Ideas`,
      description: idea.description,
      url: `https://usetalkie.com/v2/ideas/${slug}`,
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

export default async function V2IdeaPost({ params }) {
  const { slug } = await params
  const idea = getIdeaBySlug(slug)

  return (
    <IdeaLayout
      title={idea.title}
      description={idea.description}
      date={idea.date}
      tags={idea.tags}
      entryType={idea.entryType}
      status={idea.status}
    >
      <MDXRemote source={idea.content} components={mdxComponents} options={mdxOptions} />
    </IdeaLayout>
  )
}
