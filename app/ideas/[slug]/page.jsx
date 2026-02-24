import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllSlugs, getIdeaBySlug } from '../../../lib/ideas'
import IdeaLayout from '../../../components/IdeaLayout'
import TranscriptionDiff from '../../../components/TranscriptionDiff'

const mdxComponents = {
  TranscriptionDiff,
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
      <MDXRemote source={idea.content} components={mdxComponents} />
    </IdeaLayout>
  )
}
