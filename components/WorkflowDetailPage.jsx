import Link from 'next/link'
import { ArrowLeft, Download, FileJson, Terminal } from 'lucide-react'
import DownloadBay from './DownloadBay'
import { Graticule, Eyebrow } from './workflows/atoms'
import { getWorkflowTemplate } from './workflows/templatesData'

// Full page for a single workflow. Driven entirely by one entry from
// components/workflows/workflowsData.jsx — see that file's note on interim copy.

export default function WorkflowDetailPage({ workflow }) {
  const { name, flow, icons, headline, subhead, when, steps, setup, variations, outcome, prereq } = workflow
  const template = getWorkflowTemplate(workflow.slug)

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden border-b border-edge-faint bg-canvas">
        <Graticule opacity={0.3} />
        <div className="relative mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
          <Link
            href="/workflows"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-subtle transition-colors hover:text-trace"
          >
            <ArrowLeft className="h-3 w-3" />
            All workflows
          </Link>

          <div className="mt-8">
            <Eyebrow>· {flow}</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-normal leading-[1.04] tracking-[-0.02em] text-ink md:text-6xl">
              {headline.lead}
              <br />
              <span className="italic">{headline.accent}</span>
            </h1>
            <p className="mt-6 max-w-2xl border-l-2 border-trace pl-5 text-[15px] leading-relaxed text-ink-muted">
              {subhead}
            </p>
          </div>

          {/* Flow strip */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-sm border border-edge px-3 py-2 text-trace">
              {icons.map((Icon, i) => (
                <span key={i} className="flex items-center gap-2">
                  <Icon
                    aria-hidden
                    className="h-4 w-4"
                    style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                  />
                  {i < icons.length - 1 && <span aria-hidden className="text-[11px] text-ink-faint">→</span>}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-trace">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
                style={{ boxShadow: '0 0 4px var(--trace)' }}
              />
              {outcome}
            </span>
            {prereq && (
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-amber/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-amber">
                <Terminal className="h-3 w-3" />
                {prereq}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ========== WHEN YOU REACH FOR THIS ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
          <Eyebrow>· 01 / WHEN YOU REACH FOR THIS</Eyebrow>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-muted">{when}</p>
        </div>
      </section>

      {/* ========== THE STEPS ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
          <Eyebrow>· 02 / THE STEPS</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink">
            {flow}
          </h2>

          <ol className="mt-10 space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <li
                  key={i}
                  className="group relative flex gap-5 rounded-sm border border-edge bg-surface p-5 transition-all duration-200 hover:border-amber/50 hover:shadow-[0_0_22px_-8px_var(--trace-glow)]"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-sm border border-edge transition-all duration-200 group-hover:scale-105 group-hover:border-amber/60"
                      style={{ background: 'color-mix(in oklab, var(--trace) 5%, transparent)' }}
                    >
                      <Icon
                        className="h-4 w-4 text-trace transition-colors duration-200 group-hover:text-amber"
                        style={{ filter: 'drop-shadow(0 0 3px var(--trace-glow))' }}
                      />
                    </div>
                    {i < steps.length - 1 && (
                      <span aria-hidden className="mt-2 w-px flex-1 bg-edge-dim" style={{ minHeight: '1.25rem' }} />
                    )}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tabular-nums text-ink-faint">0{i + 1}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-200 group-hover:text-amber">
                        {step.label}
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{renderTokens(step.what)}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {template && (
        <section className="relative border-t border-edge-faint bg-canvas">
          <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-16">
            <div className="rounded-sm border border-edge bg-surface p-5 md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4 text-trace" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                      Template JSON
                    </p>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-normal tracking-[-0.02em] text-ink">
                    Download the {template.name} recipe.
                  </h2>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                    The JSON template names the trigger, variables, steps, setup notes, and privacy boundary for this workflow.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <a
                    href={template.jsonHref}
                    download
                    className="inline-flex items-center gap-2 rounded-sm border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-trace transition-colors hover:border-trace"
                  >
                    JSON <Download className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    href="/workflows/templates"
                    className="inline-flex items-center gap-2 rounded-sm border border-edge-dim px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted transition-colors hover:border-amber/60 hover:text-amber"
                  >
                    All templates
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== SET IT UP ONCE + VARIATIONS ========== */}
      <section className="relative border-t border-edge-faint bg-canvas-alt">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-edge-dim bg-surface p-6 transition-all duration-200 hover:border-trace/40">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· 03 / SET IT UP ONCE</p>
              <ul className="mt-5 space-y-3">
                {setup.map((item) => (
                  <li key={item} className="flex gap-3 text-[13px] leading-relaxed text-ink-muted">
                    <span
                      aria-hidden
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-trace"
                      style={{ boxShadow: '0 0 4px var(--trace-glow)' }}
                    />
                    {renderTokens(item)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm border border-edge-dim bg-surface p-6 transition-all duration-200 hover:border-amber/40">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· 04 / VARIATIONS</p>
              <ul className="mt-5 space-y-3">
                {variations.map((item) => (
                  <li key={item} className="flex gap-3 text-[13px] leading-relaxed text-ink-muted">
                    <span aria-hidden className="mt-0.5 text-amber">↳</span>
                    {renderTokens(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DOWNLOAD ========== */}
      <section className="relative border-t border-edge-faint bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-24">
          <DownloadBay caption={`One hotkey. One transcript. Routed the way "${name}" describes, and any flow you build next.`} />
        </div>
      </section>
    </>
  )
}

// Highlight template tokens ({{...}}) and path aliases (@Word) in body copy so
// they read as interpolated values, matching the index page's treatment.
function renderTokens(text) {
  const parts = text.split(/(\{\{[A-Z_]+\}\}|@[A-Za-z/]+)/g)
  return parts.map((part, i) => {
    if (/^\{\{[A-Z_]+\}\}$/.test(part)) {
      return (
        <span key={i} className="font-mono italic text-amber" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
          {part}
        </span>
      )
    }
    if (/^@[A-Za-z/]+$/.test(part)) {
      return (
        <span key={i} className="font-mono font-bold text-amber" style={{ textShadow: '0 0 4px var(--trace-glow)' }}>
          {part}
        </span>
      )
    }
    return part
  })
}
