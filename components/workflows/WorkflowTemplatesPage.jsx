import Link from 'next/link'
import { ArrowRight, Bot, Download, FileJson, Shield, Terminal } from 'lucide-react'
import JsonLd from '../JsonLd'
import { Graticule, Eyebrow } from './atoms'
import { WORKFLOW_TEMPLATES } from './templatesData'

export default function WorkflowTemplatesPage() {
  return (
    <>
      <JsonLd data={templatesSchema()} />

      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <Graticule opacity={0.28} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="max-w-3xl">
            <Eyebrow>· WORKFLOW TEMPLATES</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-normal leading-[1.04] tracking-[-0.02em] text-ink md:text-6xl">
              Recipes worth linking to.
            </h1>
            <p className="mt-6 max-w-2xl border-l-2 border-trace pl-5 text-[15px] leading-relaxed text-ink-muted">
              Each template is a concrete Talkie workflow pattern with a readable recipe page and a JSON file
              that shows the trigger, variables, steps, and privacy boundary.
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              ['Local by default', 'Capture, files, clipboard, and shell steps start on your Mac.'],
              ['Composable steps', 'Dictate, LLM, shell, file, email, webhook, and notification steps can be stacked.'],
              ['Agent-readable', 'Templates expose predictable variables for CLI and coding-agent workflows.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-sm border border-edge-dim bg-surface/75 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-trace">{title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>· TEMPLATE LIBRARY</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
                Six starting recipes.
              </h2>
            </div>
            <Link
              href="/docs/workflows/"
              className="inline-flex items-center gap-2 self-start rounded-sm border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:border-trace hover:text-trace md:self-auto"
            >
              Workflow docs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WORKFLOW_TEMPLATES.map((template) => (
              <article
                key={template.slug}
                className="group flex min-h-[340px] flex-col rounded-sm border border-edge bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-[0_0_22px_-8px_var(--trace-glow)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-subtle">
                      {template.flow}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-normal tracking-[-0.01em] text-ink transition-colors group-hover:text-amber">
                      {template.name}
                    </h3>
                  </div>
                  <FileJson className="mt-1 h-5 w-5 shrink-0 text-trace" />
                </div>

                <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{template.summary}</p>
                <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
                  <span className="font-mono uppercase tracking-[0.16em] text-ink-subtle">Best for</span>
                  <br />
                  {template.bestFor}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {template.targets.map((target) => (
                    <span
                      key={target}
                      className="rounded-sm border border-edge-dim px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted"
                    >
                      {target}
                    </span>
                  ))}
                </div>

                <p className="mt-5 border-t border-edge-faint pt-4 text-[12px] leading-relaxed text-ink-faint">
                  {template.localNote}
                </p>

                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <Link
                    href={template.workflowHref}
                    className="inline-flex items-center gap-2 rounded-sm border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-trace transition-colors hover:border-trace"
                  >
                    Read recipe <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={template.jsonHref}
                    download
                    className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted transition-colors hover:border-amber/60 hover:text-amber"
                  >
                    JSON <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-6 md:py-20">
          <div>
            <Eyebrow>· WHY TEMPLATES HELP</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
              Clear enough for people. Structured enough for agents.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              The page explains the workflow in human terms. The JSON gives directories, integration
              pages, and agent indexes a stable artifact to inspect and cite.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              [Shield, 'Privacy boundary', 'Each template names what stays local and what only leaves the Mac when you configure an outside provider.'],
              [Terminal, 'CLI handoff', 'Recipes use explicit variables like {{TRANSCRIPT}}, {{TITLE}}, and {{LAST_OUTPUT}} so terminal tools can compose with them.'],
              [Bot, 'Agent context', 'Coding agents can read the JSON shape before asking Talkie for recent memos, searches, or workflow runs.'],
            ].map(([Icon, title, body]) => (
              <div key={title} className="flex gap-4 rounded-sm border border-edge-dim bg-surface p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-edge text-trace">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">{title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function templatesSchema() {
  const url = 'https://usetalkie.com/workflows/templates/'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        name: 'Talkie workflow templates',
        description:
          'Downloadable Talkie workflow recipe templates for voice-to-file, voice-to-email, voice-to-agent, and voice-to-GitHub workflows.',
        url,
        isPartOf: { '@id': 'https://usetalkie.com/#website' },
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#templates`,
        itemListElement: WORKFLOW_TEMPLATES.map((template, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: template.name,
          url: `https://usetalkie.com${template.workflowHref}`,
        })),
      },
    ],
  }
}
