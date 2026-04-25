/**
 * DocsNotice — server-side, static notice block.
 *
 * Replaces the client-side ComingSoonBanner from v1: same visual role
 * (call out that the topic is incoming) but no email form, no client
 * JS. Honors the oscilloscope theme via CSS vars only.
 *
 * Variants:
 *   - "soon"    — amber wash, "in development"
 *   - "info"    — neutral edge, "good to know"
 *   - "warn"    — amber outline, mind-the-gap
 *   - "ok"      — phosphor outline, success/confirmation
 */
const VARIANTS = {
  soon: {
    label: 'COMING SOON',
    border: 'border-amber/60',
    accent: 'text-amber',
    bg: 'color-mix(in oklab, var(--amber) 6%, transparent)',
  },
  info: {
    label: 'NOTE',
    border: 'border-edge',
    accent: 'text-trace',
    bg: 'color-mix(in oklab, var(--trace) 5%, transparent)',
  },
  warn: {
    label: 'WATCH OUT',
    border: 'border-amber/60',
    accent: 'text-amber',
    bg: 'color-mix(in oklab, var(--amber) 6%, transparent)',
  },
  ok: {
    label: 'CONFIRMED',
    border: 'border-edge',
    accent: 'text-trace',
    bg: 'color-mix(in oklab, var(--trace) 7%, transparent)',
  },
}

export default function DocsNotice({ variant = 'info', label, title, children }) {
  const v = VARIANTS[variant] ?? VARIANTS.info
  return (
    <aside
      className={`not-prose my-6 rounded-sm border ${v.border} px-4 py-3 font-mono`}
      style={{ background: v.bg }}
    >
      <p
        className={`text-[9px] uppercase tracking-[0.26em] ${v.accent}`}
        style={{ textShadow: '0 0 4px var(--trace-glow)' }}
      >
        · {label ?? v.label}
      </p>
      {title && (
        <p className="mt-1.5 text-[13px] tracking-[0.02em] text-ink">{title}</p>
      )}
      <div className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted [&_a]:text-trace [&_a]:underline [&_code]:rounded [&_code]:border [&_code]:border-edge-faint [&_code]:bg-surface [&_code]:px-1 [&_code]:py-px [&_code]:text-[0.92em] [&_code]:text-ink">
        {children}
      </div>
    </aside>
  )
}
