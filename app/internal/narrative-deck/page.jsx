import fs from 'node:fs/promises'
import path from 'node:path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import InternalDeckPage from '../../../components/InternalDeckPage'
import QuickCopyButton from '../../../components/QuickCopyButton'

export const metadata = {
  title: 'Talkie Internal Narrative Deck',
  description: 'Internal narrative deck for Talkie positioning and campaign direction.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

const DOCS = [
  {
    title: 'Creative Brief',
    description: 'Positioning, audience, message pillars, and campaign territory.',
    filepath: 'docs/marketing/talkie-creative-brief.md',
  },
  {
    title: 'Pitch Deck Outline',
    description: 'The slide-by-slide story arc for internal or external presentation.',
    filepath: 'docs/marketing/talkie-pitch-deck.md',
  },
  {
    title: 'Repeatable Process',
    description: 'The reusable system that turns a product into messaging assets.',
    filepath: 'docs/marketing/repeatable-narrative-process.md',
  },
  {
    title: 'Demo Script Pack',
    description: 'Scenario lanes plus 30s, 45s, and 2 minute scripts.',
    filepath: 'docs/marketing/talkie-demo-script-pack.md',
  },
]

const mdxComponents = {
  h1: (props) => <h1 className="text-2xl font-bold tracking-[-0.03em] text-zinc-950 dark:text-white" {...props} />,
  h2: (props) => <h2 className="mt-8 text-xl font-bold tracking-[-0.03em] text-zinc-950 dark:text-white first:mt-0" {...props} />,
  h3: (props) => <h3 className="mt-6 text-sm font-mono font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400" {...props} />,
  p: (props) => <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 first:mt-0" {...props} />,
  ul: (props) => <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300" {...props} />,
  ol: (props) => <ol className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300" {...props} />,
  li: (props) => <li className="ml-5 list-disc marker:text-zinc-400" {...props} />,
  code: (props) => <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-800 dark:bg-white/10 dark:text-zinc-100" {...props} />,
  hr: () => <div className="my-6 h-px bg-zinc-200 dark:bg-white/10" />,
}

async function renderDoc(source) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  )
}

export default async function Page() {
  const renderedDocs = await Promise.all(
    DOCS.map(async (doc) => {
      const source = await fs.readFile(path.join(process.cwd(), doc.filepath), 'utf8')

      return {
        ...doc,
        source,
        content: await renderDoc(source),
      }
    })
  )

  return (
    <InternalDeckPage>
      <section
        id="source-materials"
        data-deck-section
        className="rounded-[34px] border border-zinc-200/80 bg-white/85 px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04] md:px-10 md:py-10"
      >
        <div className="mb-6 flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
          <span>10</span>
          <span className="h-px w-10 bg-zinc-300 dark:bg-zinc-800" />
          <span>Source Materials</span>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-5xl">
            Everything in one place.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            These are the working markdown files behind the narrative system, rendered directly inside the deck so the strategy, process, and scripts all live in one internal view.
          </p>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {renderedDocs.map((doc) => (
            <article
              key={doc.filepath}
              className="rounded-[28px] border border-zinc-200/80 bg-stone-50/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#11161b]"
            >
              <div className="mb-5">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  {doc.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {doc.description}
                </p>
                <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                  {doc.filepath}
                </p>
              </div>

              <div className="relative">
                <QuickCopyButton
                  text={doc.source}
                  label="Copy MD"
                  className="absolute right-3 top-3 z-10 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                />

                <div className="max-h-[44rem] overflow-y-auto rounded-[22px] border border-zinc-200/80 bg-white/80 px-5 pb-4 pt-14 dark:border-white/10 dark:bg-black/20">
                  {doc.content}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </InternalDeckPage>
  )
}
