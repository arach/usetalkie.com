'use client'

import { useState } from 'react'
import { FAMILIES, CAPABILITY_COUNT } from '../../lib/capabilities'

/**
 * The ledger — 10,000 feet down to the specific thing.
 *
 * A channel rail on the left, the selected channel's full inventory on
 * the right. The rail is the altitude control: five verbs you can hold
 * in your head, each opening onto twenty concrete capabilities with the
 * surface that implements them.
 *
 * Deliberately not a card grid of marketing tiles. These are entries in
 * an inventory, so they are typeset as entries in an inventory — name,
 * what it does, where it runs. The interest comes from the density and
 * from the fact that all hundred are real, not from decorating twenty
 * boxes.
 *
 * One accent, five channels. The upstream study gave each family its own
 * hue; here they are told apart by number and label the way strips on a
 * physical console are. Talkie's own Console numbers its sessions the
 * same way.
 */
export default function CapabilityLedger() {
  const [activeId, setActiveId] = useState(FAMILIES[0].id)
  const active = FAMILIES.find((family) => family.id === activeId) ?? FAMILIES[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[230px_1fr] lg:gap-8">
      {/* Channel rail */}
      <div className="overflow-hidden rounded-md border border-edge-dim bg-surface">
        <div className="border-b border-edge-subtle px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-subtle">· CHANNELS</p>
        </div>
        <div role="tablist" aria-orientation="vertical" aria-label="Capability families">
          {FAMILIES.map((family, index) => {
            const selected = family.id === active.id
            return (
              <button
                key={family.id}
                type="button"
                role="tab"
                id={`family-tab-${family.id}`}
                aria-selected={selected}
                aria-controls={`family-panel-${family.id}`}
                onClick={() => setActiveId(family.id)}
                className={[
                  // border-l-2 exists in every state so selection recolors
                  // rather than reflows. Square rows because the accent
                  // runs the full height of the edge — a radius here
                  // would nibble the bar's ends into nubs.
                  'block w-full border-l-2 px-4 py-3 text-left transition-colors duration-200',
                  'focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--amber)]',
                  index > 0 ? 'border-t border-t-edge-subtle' : '',
                  selected
                    ? 'border-l-amber'
                    : 'border-l-transparent hover:border-l-edge hover:bg-canvas-alt',
                ].join(' ')}
                style={selected ? { background: 'color-mix(in oklab, var(--amber) 7%, transparent)' } : undefined}
              >
                <span className={`block font-mono text-[9px] uppercase tracking-[0.24em] ${selected ? 'text-amber' : 'text-ink-subtle'}`}>
                  {family.channel}
                </span>
                <span className={`mt-1 block font-display text-lg leading-tight ${selected ? 'text-ink' : 'text-ink-dim'}`}>
                  {family.verb}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-ink-faint">{family.role}</span>
              </button>
            )
          })}
        </div>
        <div className="border-t border-edge-subtle px-4 py-3">
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ink-subtle">
            {CAPABILITY_COUNT} MAPPED
            <br />
            CAPABILITIES
          </p>
        </div>
      </div>

      {/* Ledger */}
      <div
        role="tabpanel"
        id={`family-panel-${active.id}`}
        aria-labelledby={`family-tab-${active.id}`}
        className="min-w-0 overflow-hidden rounded-md border border-edge-dim bg-surface"
      >
        <div className="border-b border-edge-subtle p-5 md:p-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber">{active.channel}</span>
            <h3 className="font-display text-2xl leading-tight tracking-[-0.015em] text-ink">{active.verb}</h3>
          </div>
          <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-ink-muted">{active.summary}</p>
        </div>

        <div className="grid gap-x-8 gap-y-7 p-5 md:grid-cols-2 md:p-6">
          {active.groups.map((group) => (
            <section key={group.label} className="min-w-0">
              <div className="flex items-center gap-3">
                <h4 className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">· {group.label}</h4>
                <span aria-hidden className="block h-px flex-1" style={{ background: 'var(--edge-subtle)' }} />
              </div>
              <dl className="mt-3 space-y-3">
                {group.items.map((item) => (
                  <div key={item.name} className="group/item">
                    <dt className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-medium leading-snug text-ink transition-colors duration-150 group-hover/item:text-amber">
                        {item.name}
                      </span>
                      <span className="flex-shrink-0 font-mono text-[8px] uppercase tracking-[0.18em] text-ink-subtle">
                        {item.surface}
                      </span>
                    </dt>
                    <dd className="mt-0.5 text-[12px] leading-relaxed text-ink-faint">{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* The constraint that has to survive a copy edit. */}
        <div className="flex flex-col gap-2 border-t border-edge-subtle bg-canvas-alt px-5 py-4 md:flex-row md:items-start md:gap-5 md:px-6">
          <span className="flex-shrink-0 font-mono text-[9px] uppercase tracking-[0.24em] text-amber">· THE LIMITS</span>
          <p className="max-w-3xl text-[12px] leading-relaxed text-ink-faint">{active.guardrail}</p>
        </div>
      </div>
    </div>
  )
}
