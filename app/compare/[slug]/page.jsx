import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllComparisonSlugs, getComparisonBySlug } from '../../../lib/ideas'
import JsonLd from '../../../components/JsonLd'
import IdeaLayout from '../../../components/IdeaLayout'
import MainShell from '../../../components/MainShell'
import ComparisonTable from '../../../components/blog/ComparisonTable'
import EvidenceComparison from '../../../components/blog/EvidenceComparison'
import ComparisonGuide from '../../../components/blog/ComparisonGuide'
import { hasEvidenceComparison } from '../../../lib/comparisons'

const mdxComponents = {
  table: ComparisonTable,
  EvidenceComparison,
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllComparisonSlugs().map(slug => ({ slug }))
}

function comparisonSeoTitle(comparison) {
  // Prefer an explicit short title when present. Otherwise avoid appending
  // " - Talkie" when the H1 already ends with Talkie (keeps SERP titles under ~60).
  if (comparison.seoTitle) return comparison.seoTitle
  const base = comparison.title.trim()
  if (/talkie\s*$/i.test(base)) return base
  return `${base} - Talkie`
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const comparison = getComparisonBySlug(slug)
  const url = `https://usetalkie.com/compare/${slug}/`
  const image = `/og/ideas/${comparison.sourceSlug}.png`
  const title = comparisonSeoTitle(comparison)
  const description = comparison.description

  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { 'text/markdown': `https://usetalkie.com/compare/${slug}.md` },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Talkie',
      locale: 'en_US',
      type: 'article',
      publishedTime: comparison.date,
      tags: comparison.tags,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

function comparisonSchema(comparison, slug) {
  const url = `https://usetalkie.com/compare/${slug}/`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: comparison.title,
        description: comparison.description,
        url,
        mainEntityOfPage: url,
        datePublished: comparison.date,
        dateModified: comparison.date,
        image: `https://usetalkie.com/og/ideas/${comparison.sourceSlug}.png`,
        keywords: (comparison.tags || []).join(', '),
        author: {
          '@type': 'Person',
          name: 'Arach Tchoupani',
          url: 'https://usetalkie.com/about/',
        },
        publisher: { '@id': 'https://usetalkie.com/#organization' },
        isPartOf: { '@id': 'https://usetalkie.com/#website' },
        inLanguage: 'en-US',
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
            name: 'Compare Talkie',
            item: 'https://usetalkie.com/compare/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: comparison.title,
            item: url,
          },
        ],
      },
    ],
  }
}

export default async function ComparisonPage({ params }) {
  const { slug } = await params
  const comparison = getComparisonBySlug(slug)

  return (
    <MainShell>
      <JsonLd data={comparisonSchema(comparison, slug)} />
      <IdeaLayout
        title={comparison.title}
        description={comparison.description}
        date={comparison.date}
        tags={comparison.tags}
        readMinutes={comparison.readMinutes}
        indexHref="/compare"
        indexLabel="ALL COMPARISONS"
        lead={hasEvidenceComparison(slug) ? <ComparisonGuide competitor={slug} /> : null}
      >
        <MDXRemote source={comparison.content} components={mdxComponents} options={mdxOptions} />
      </IdeaLayout>
    </MainShell>
  )
}
