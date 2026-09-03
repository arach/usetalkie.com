/**
 * Chassis-style code block. Uses panel-* tokens so the type stays on
 * the instrument surface (light ink on a dark bay in Warm, dark ink
 * on a light bay in Modern). Do not use screen-* here: those inks are
 * for the always-dark CRT and wash out on paper cards.
 */
export default function CodeBlock({ title, lang, children }) {
  return (
    <figure className="not-prose my-5 overflow-hidden rounded-sm border border-panel-edge bg-panel-bg">
      {(title || lang) && (
        <figcaption className="flex items-center justify-between border-b border-panel-edge-dim bg-panel-bg-alt px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-panel-ink-muted">
          <span>{title}</span>
          {lang && <span className="text-panel-trace">{lang}</span>}
        </figcaption>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-panel-ink-dim">
        <code className="font-mono text-panel-ink-dim">{children}</code>
      </pre>
    </figure>
  )
}
