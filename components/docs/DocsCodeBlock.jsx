/**
 * DocsCodeBlock — server-rendered <pre><code> with an optional caption
 * strip. No copy button. Paint matches CodeBlock: panel chassis tokens
 * so caption and body stay readable in both Warm and Modern.
 */
export default function DocsCodeBlock({ caption, children, lang }) {
  return (
    <div className="not-prose my-5 overflow-hidden rounded-sm border border-panel-edge bg-panel-bg">
      {(caption || lang) && (
        <div className="flex items-center justify-between border-b border-panel-edge-dim bg-panel-bg-alt px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em]">
          <span className="text-panel-ink-muted">{caption}</span>
          {lang && <span className="text-panel-trace">{lang}</span>}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.65] text-panel-ink-dim">
        <code className="font-mono text-panel-ink-dim">{children}</code>
      </pre>
    </div>
  )
}
