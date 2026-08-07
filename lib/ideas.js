import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ideasDirectory = path.join(process.cwd(), 'content/ideas')

function isComparison(entry) {
  return (entry.tags || []).includes('comparison')
}

function comparisonSlug(sourceSlug) {
  return sourceSlug.replace(/^talkie-vs-/, '')
}

// Strip MDX/JSX/markdown chrome before counting so reading time reflects prose only.
function estimateReadMinutes(content) {
  if (!content) return 1
  const stripped = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#*_>~]/g, ' ')
  const words = stripped.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

function getAllEntries() {
  const files = fs.readdirSync(ideasDirectory).filter(f => f.endsWith('.mdx'))

  return files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '')
    const filePath = path.join(ideasDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags || [],
      entryType: data.entryType || null,
      status: data.status || null,
      draft: data.draft || false,
      readMinutes: estimateReadMinutes(content),
    }
  })

}

export function getAllIdeas() {
  return getAllEntries()
    .filter(idea => !idea.draft && !isComparison(idea))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getAllComparisons() {
  return getAllEntries()
    .filter(entry => !entry.draft && isComparison(entry))
    .map(entry => ({
      ...entry,
      sourceSlug: entry.slug,
      slug: comparisonSlug(entry.slug),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getIdeaBySlug(slug) {
  const filePath = path.join(ideasDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags || [],
    entryType: data.entryType || null,
    status: data.status || null,
    readMinutes: estimateReadMinutes(content),
    content,
  }
}

export function getAllSlugs() {
  return getAllIdeas().map(idea => idea.slug)
}

export function getAllComparisonSlugs() {
  return getAllComparisons().map(comparison => comparison.slug)
}

export function getComparisonBySlug(slug) {
  const comparison = getAllComparisons().find(entry => entry.slug === slug)
  if (!comparison) throw new Error(`Unknown comparison: ${slug}`)

  return {
    ...getIdeaBySlug(comparison.sourceSlug),
    slug,
    sourceSlug: comparison.sourceSlug,
  }
}
