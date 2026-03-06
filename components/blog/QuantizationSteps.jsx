"use client"

import { useState } from 'react'

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
    <div className="not-prose my-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5">
      <div className="space-y-3">
        {steps.map((step, i) => {
          const barPct = (step.sizeBytes / maxSize) * 100
          const isActive = active === i
          const isLast = i === steps.length - 1

          return (
            <div
              key={step.label}
              className={`rounded-lg border p-3 cursor-default transition-all ${
                isActive
                  ? isLast
                    ? 'border-emerald-500/40 dark:border-emerald-500/25 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                  : 'border-zinc-200/50 dark:border-zinc-800/50 bg-transparent'
              }`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{step.label}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{step.sublabel}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-sm font-mono font-medium ${
                    isLast ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-300'
                  }`}>
                    {step.size}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{step.precision}</span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLast ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'
                  }`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

              {/* Description on hover */}
              {isActive && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Reduction stat */}
      <div className="text-center mt-4">
        <span className="text-xs text-zinc-400">Size reduction: </span>
        <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">72%</span>
      </div>
    </div>
  )
}
