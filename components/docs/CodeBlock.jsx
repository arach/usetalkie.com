/**
 * Server-rendered code block in the v2 oscilloscope idiom.
 * No client interactivity — DocsLayout's prose styling owns typography,
 * we just paint the chrome with theme tokens.
 */
export default function CodeBlock({ title, lang, children }) {
  return (
    <figure className="not-prose my-5 overflow-hidden rounded-sm border border-edge-dim bg-surface">
      {(title || lang) && (
        <figcaption className="flex items-center justify-between border-b border-edge-faint px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          <span>{title}</span>
          {lang && <span className="text-ink-subtle">{lang}</span>}
        </figcaption>
      )}
      <pre className="overflow-x-auto bg-canvas-alt p-4 font-mono text-[12px] leading-relaxed text-ink-dim">
        <code>{children}</code>
      </pre>
    </figure>
  )
}
