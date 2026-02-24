import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ideasDirectory = path.join(process.cwd(), 'content/ideas')

export function getAllIdeas() {
  const files = fs.readdirSync(ideasDirectory).filter(f => f.endsWith('.mdx'))

  const ideas = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '')
    const filePath = path.join(ideasDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags || [],
      draft: data.draft || false,
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
    content,
  }
}

export function getAllSlugs() {
  const files = fs.readdirSync(ideasDirectory).filter(f => f.endsWith('.mdx'))
  return files.map(f => f.replace(/\.mdx$/, ''))
}
