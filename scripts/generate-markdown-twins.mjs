import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { TALKIE_MAC_OFFER, TALKIE_PHONE_APP } from '../shared/config/product-links.js'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const ideasDir = join(rootDir, 'content', 'ideas')
const publicDir = join(rootDir, 'public')
const compareDir = join(publicDir, 'compare')

mkdirSync(compareDir, { recursive: true })

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) throw new Error('Markdown file is missing frontmatter.')

  const frontmatter = match[1]
  const field = (name) => {
    const value = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim()
    if (!value) return null
    if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value)
    return value
  }
  const tags = field('tags')

  return {
    data: {
      title: field('title'),
      description: field('description'),
      date: field('date'),
      draft: field('draft') === 'true',
      tags: tags ? JSON.parse(tags) : [],
    },
    content: source.slice(match[0].length),
  }
}

const homepage = `# Talkie

Talkie is a local-first voice dictation app for Mac users who want searchable captures, workflows, and voice input for agents.

Canonical page: https://usetalkie.com/

## How do I dictate into any Mac app?

Set the Talkie hotkey once, then speak into any app. Talkie enters the speech in the active app and stores the capture in a searchable local library.

## What can Talkie do with a voice capture?

A capture can become a note, a draft, a search, or the start of a workflow. Talkie supports Mac hotkey dictation, voice memos, search, workflows, and structured CLI output.

## How can I find a voice note later?

Talkie stores the transcript, time, app, and project context with each capture so it stays searchable.

## Where does Talkie store voice data?

Talkie stores recordings and transcripts on your devices. Optional sync uses your iCloud account. External models are opt-in and use keys that you provide.

## How much does Talkie cost?

The current Talkie for Mac build is free. A ${TALKIE_MAC_OFFER.trialLabel} and ${TALKIE_MAC_OFFER.displayPrice} USD one-time Mac license are planned. The trial and checkout are not active yet. ${TALKIE_PHONE_APP.name} and the Apple Watch app are free.

## Where can I compare Talkie with other apps?

Read the first-party comparison index at https://usetalkie.com/compare/.
`

const primaryPages = {
  'mac.md': `# What is Talkie for Mac?

Talkie for Mac is a local-first voice dictation app that enters speech in the active app and stores each capture in a searchable local library.

Canonical page: https://usetalkie.com/mac/

## How does dictation work on Mac?

Set a global hotkey, press it from the active app, and speak. Talkie transcribes on the Mac and returns the text to the active app.

## What happens after dictation?

Talkie keeps the capture in a local library. Search, workflows, and the Talkie CLI can use the stored transcript later.
`,
  'mobile.md': `# What is Talkie for iPhone and Apple Watch?

Talkie for iPhone and Apple Watch is free. It captures voice away from the desk and can sync captures to Talkie on Mac through the user's iCloud account.

Canonical page: https://usetalkie.com/mobile/

## What can I capture?

Record a voice memo on iPhone or Apple Watch. Talkie keeps the recording and transcript with the rest of the Talkie library.
`,
  'downloads.md': `# How do I download Talkie?

Download Talkie for Mac, iPhone, and Apple Watch. The Mac app is available as a direct DMG or through a package-manager command. The iPhone app is available from the App Store.

Canonical page: https://usetalkie.com/downloads/

## How much does Talkie cost?

The current Talkie for Mac build is free. A ${TALKIE_MAC_OFFER.trialLabel} and ${TALKIE_MAC_OFFER.displayPrice} USD one-time Mac license are planned. The trial and checkout are not active yet. ${TALKIE_PHONE_APP.name} and the Apple Watch app are free.
`,
  'security.md': `# How does Talkie handle voice data?

Talkie stores recordings and transcripts on the user's devices. Optional sync uses the user's Private CloudKit database. External model providers are optional and use keys supplied by the user.

Canonical page: https://usetalkie.com/security/

## Does Talkie upload audio to its own servers?

No. Talkie does not store audio, transcripts, API keys, or library content on Talkie servers.

## Can transcription stay on the device?

Yes. Core transcription can run on Apple silicon without sending audio to an external transcription service.
`,
  'workflows.md': `# What are Talkie workflows?

Talkie workflows turn captured speech into drafts, tasks, files, and follow-up actions on Mac.

Canonical page: https://usetalkie.com/workflows/

## What can a workflow do?

A workflow can transform a transcript, save a file, run a shell step, or send selected text to a configured provider or webhook.

## Are external providers required?

No. Local steps do not require an external provider. Provider and webhook steps are optional and use the configuration supplied by the user.
`,
}

function comparisonIndex(entries) {
  const links = entries
    .map(({ slug, title, description }) => `- [${title}](https://usetalkie.com/compare/${slug}/) — ${description}`)
    .join('\n')

  return `# How does Talkie compare?

Talkie comparisons explain when Talkie or another dictation, transcription, or voice-control app is the better choice. Each comparison links to first-party sources.

Canonical page: https://usetalkie.com/compare/

${links}
`
}

function markdownTwin({ slug, title, description, date, content }) {
  const cleanContent = content
    .replace(/<EvidenceComparison competitor="[^"]+"\s*\/>/g, 'See the sourced comparison matrix on the canonical HTML page.')
    .trim()

  return `# ${title}

${description}

- Canonical page: https://usetalkie.com/compare/${slug}/
- Author: Arach Tchoupani
- Published: ${date}

${cleanContent}
`
}

const entries = readdirSync(ideasDir)
  .filter((filename) => filename.endsWith('.mdx'))
  .map((filename) => {
    const source = readFileSync(join(ideasDir, filename), 'utf8')
    const { data, content } = parseFrontmatter(source)
    const isComparison = (data.tags || []).includes('comparison')
    if (!isComparison || data.draft) return null

    const sourceSlug = filename.replace(/\.mdx$/, '')
    const slug = sourceSlug.replace(/^talkie-vs-/, '')
    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      content,
    }
  })
  .filter(Boolean)
  .sort((a, b) => a.title.localeCompare(b.title))

writeFileSync(join(publicDir, 'index.md'), homepage)
writeFileSync(join(publicDir, 'compare.md'), comparisonIndex(entries))

for (const [filename, content] of Object.entries(primaryPages)) {
  writeFileSync(join(publicDir, filename), content)
}

for (const entry of entries) {
  writeFileSync(join(compareDir, `${entry.slug}.md`), markdownTwin(entry))
}

console.log(`Generated ${entries.length + Object.keys(primaryPages).length + 2} Markdown twins.`)
