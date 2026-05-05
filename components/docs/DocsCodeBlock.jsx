/**
 * DocsCodeBlock — server-rendered <pre><code> with an optional caption
 * strip. No copy button. Styling rides the prose-pre overrides from
 * DocsLayout, then layers an oscilloscope frame on top.
 */
export default function DocsCodeBlock({ caption, children, lang }) {
  return (
    <div className="not-prose my-5 overflow-hidden rounded-sm border border-edge-faint bg-surface">
      {(caption || lang) && (
        <div className="flex items-center justify-between border-b border-edge-faint px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em]">
          <span className="text-ink-faint">{caption}</span>
          {lang && <span className="text-trace">{lang}</span>}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.65] text-ink-dim">
        <code>{children}</code>
      </pre>
    </div>
  )
}
