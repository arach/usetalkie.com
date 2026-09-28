import fs from 'node:fs'
import { getAllIdeas, getAllComparisons } from '../lib/ideas.js'

// Static route inventory is explicit. Article routes and dates come from content.
const origin = 'https://usetalkie.com'
const sitemapPath = 'public/sitemap.xml'
const staticUrls = [
  "https://usetalkie.com/",
  "https://usetalkie.com/downloads/",
  "https://usetalkie.com/mac/",
  "https://usetalkie.com/mobile/",
  "https://usetalkie.com/workflows/",
  "https://usetalkie.com/workflows/templates/",
  "https://usetalkie.com/workflows/dictate-to-claude/",
  "https://usetalkie.com/workflows/dictate-to-email/",
  "https://usetalkie.com/workflows/voice-memo-to-obsidian/",
  "https://usetalkie.com/workflows/iterate-in-compose/",
  "https://usetalkie.com/workflows/quick-idea-to-cli/",
  "https://usetalkie.com/workflows/bug-note-to-github/",
  "https://usetalkie.com/docs/",
  "https://usetalkie.com/docs/overview/",
  "https://usetalkie.com/docs/architecture/",
  "https://usetalkie.com/docs/lifecycle/",
  "https://usetalkie.com/docs/cli/",
  "https://usetalkie.com/docs/workflows/",
  "https://usetalkie.com/docs/api/",
  "https://usetalkie.com/docs/extensibility/",
  "https://usetalkie.com/docs/data/",
  "https://usetalkie.com/docs/bridge-setup/",
  "https://usetalkie.com/security/",
  "https://usetalkie.com/tour/",
  "https://usetalkie.com/ideas/",
  "https://usetalkie.com/compare/",
  "https://usetalkie.com/about/",
  "https://usetalkie.com/support/",
  "https://usetalkie.com/privacypolicy.html",
  "https://usetalkie.com/philosophy/",
  "https://usetalkie.com/brand/"
]
const entries = staticUrls.map(url => ({ url }))
for (const [prefix, articles] of [['ideas', getAllIdeas()], ['compare', getAllComparisons()]]) {
  for (const article of articles) {
    const date = new Date(article.updated)
    if (!Number.isFinite(date.valueOf())) throw new Error(`Invalid article date: ${article.slug}`)
    entries.push({ url: `${origin}/${prefix}/${article.slug}/`, modified: date.toISOString() })
  }
}
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  entries.map(entry => `  <url>\n    <loc>${escape(entry.url)}</loc>${entry.modified ? `\n    <lastmod>${entry.modified}</lastmod>` : ''}\n  </url>`).join('\n') + '\n</urlset>\n'
fs.writeFileSync(sitemapPath, xml)
console.log(`Generated sitemap with ${entries.length} URLs. Undocumented static-page dates omitted.`)
