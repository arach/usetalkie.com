"use client"

import { useState } from 'react'

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }
const TRACE_GLOW_BAR = { boxShadow: '0 0 6px var(--trace)' }

const steps = [
  {
    label: 'Base model',
    sublabel: 'Qwen3-1.7B',
    size: '3.4 GB',
    sizeBytes: 3400,
    precision: '16-bit',
    desc: 'Pre-trained weights at half precision (FP16). Each parameter stored as a 16-bit floating point number.',
  },
  {
    label: 'After LoRA merge',
    sublabel: 'Fused',
    size: '3.2 GB',
    sizeBytes: 3200,
    precision: '16-bit',
    desc: 'LoRA adapter weights merged into base model. Slightly smaller because the adapter replaces some base weights rather than adding to them.',
  },
  {
    label: 'After quantization',
    sublabel: '4-bit',
    size: '948 MB',
    sizeBytes: 948,
    precision: '4-bit',
    desc: 'Each weight stored in 4 bits instead of 16. For a constrained-vocabulary task, the model doesn\'t need fine-grained weight distinctions to map "dash" to "-".',
  },
]

const maxSize = 3400

export default function QuantizationSteps() {
  const [active, setActive] = useState(null)

  return (
    <div className="not-prose my-8 rounded-lg border border-edge-dim bg-canvas-alt p-5">
      <div className="space-y-3">
        {steps.map((step, i) => {
          const barPct = (step.sizeBytes / maxSize) * 100
          const isActive = active === i
          const isLast = i === steps.length - 1

          const cardStyle = isActive && isLast
            ? {
                background: 'color-mix(in oklab, var(--trace) 7%, transparent)',
                boxShadow:
                  'inset 0 0 0 1px color-mix(in oklab, var(--trace) 28%, transparent), 0 0 14px color-mix(in oklab, var(--trace-glow) 50%, transparent)',
              }
            : undefined

          return (
            <div
              key={step.label}
              className={`rounded-lg border p-3 cursor-default transition-all ${
                isActive
                  ? isLast
                    ? 'border-trace/40'
                    : 'border-edge bg-surface'
                  : 'border-edge-dim/60 bg-transparent'
              }`}
              style={cardStyle}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink">{step.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">{step.sublabel}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-sm font-mono font-medium ${
                      isLast ? 'text-trace' : 'text-ink-muted'
                    }`}
                    style={isLast ? TRACE_GLOW_SOFT : undefined}
                  >
                    {step.size}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">{step.precision}</span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2 w-full rounded-full bg-canvas overflow-hidden border border-edge-dim/60">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLast ? 'bg-trace' : ''
                  }`}
                  style={
                    isLast
                      ? { width: `${barPct}%`, ...TRACE_GLOW_BAR }
                      : {
                          width: `${barPct}%`,
                          background: 'color-mix(in oklab, var(--trace) 45%, var(--canvas))',
                        }
                  }
                />
              </div>

              {/* Description on hover */}
              {isActive && (
                <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                  {step.desc}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Reduction stat */}
      <div className="text-center mt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Size reduction: </span>
        <span
          className="text-xs font-mono font-medium text-trace"
          style={TRACE_GLOW_SOFT}
        >
          72%
        </span>
      </div>
    </div>
  )
}
