/**
 * Small server-only atoms shared by /v2/docs/* pages.
 * Kept local to docs so they don't leak into the marketing pages.
 */

export function CategoryRule({ id, label, count }) {
  return (
    <div
      id={id}
      className="not-prose mt-10 mb-4 flex items-center gap-3 scroll-mt-24"
    >
      <span aria-hidden className="h-px flex-1 bg-edge-faint" />
      <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-muted">
        {label}
      </span>
      {count != null && (
        <span className="font-mono text-[10px] tracking-[0.18em] text-ink-faint">
          [{count}]
        </span>
      )}
      <span aria-hidden className="h-px flex-1 bg-edge-faint" />
    </div>
  )
}

export function PinTag({ children, tone = 'default' }) {
  const toneCls =
    tone === 'amber'
      ? 'border-amber/40 text-amber'
      : tone === 'trace'
      ? 'border-trace/50 text-trace'
      : 'border-edge-dim text-ink-muted'
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em] ${toneCls}`}
    >
      {children}
    </span>
  )
}

export function Card({ id, children, className = '' }) {
  return (
    <div
      id={id}
      className={`not-prose rounded-sm border border-edge-dim bg-surface p-5 scroll-mt-24 ${className}`}
    >
      {children}
    </div>
  )
}

export function FieldRow({ name, desc }) {
  return (
    <div className="flex items-baseline gap-3 text-[12px]">
      <code className="whitespace-nowrap font-mono text-amber">{name}</code>
      <span className="text-ink-muted">{desc}</span>
    </div>
  )
}
