import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ideasDirectory = path.join(process.cwd(), 'content/ideas')

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

export function getAllIdeas() {
  const files = fs.readdirSync(ideasDirectory).filter(f => f.endsWith('.mdx'))

  const ideas = files.map(filename => {
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

  return ideas
    .filter(idea => !idea.draft)
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
  const files = fs.readdirSync(ideasDirectory).filter(f => f.endsWith('.mdx'))
  return files.map(f => f.replace(/\.mdx$/, ''))
}
