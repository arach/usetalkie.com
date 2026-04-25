'use client'

import { useEffect } from 'react'
import { trackAppStoreClick } from '../../../../lib/analytics'

/**
 * /v2/go/app-store — client-side redirect to the iOS App Store.
 *
 * Mirrors the canonical /go/app-store behavior 1:1:
 *   1. Read `utm_source` (or `ref`, falling back to `'direct'`) and
 *      `utm_campaign` from the query string.
 *   2. Fire `trackAppStoreClick(source, campaign)` for GA attribution.
 *   3. After a 150ms delay (so the analytics beacon flushes), redirect
 *      via `window.location.replace` so this page does not pollute history.
 *
 * The visible "Redirecting…" UI is only seen for ~150ms or when JS is
 * disabled — re-authored here on the oscilloscope canvas using semantic
 * tokens so it matches every other /v2/* surface during that flash.
 */

const APP_STORE_URL = 'https://apps.apple.com/us/app/talkie-mobile/id6755734109'

export default function V2AppStoreRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const source = params.get('utm_source') || params.get('ref') || 'direct'
    const campaign = params.get('utm_campaign') || null

    trackAppStoreClick(source, campaign)

    // Small delay to let the analytics event fire before redirecting.
    const timeout = setTimeout(() => {
      window.location.replace(APP_STORE_URL)
    }, 150)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="relative overflow-hidden bg-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(var(--trace-faint) 1px, transparent 1px), linear-gradient(90deg, var(--trace-faint) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col items-center justify-center px-4 py-20 text-center md:px-6">
        {/* Status strip */}
        <div
          className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-trace"
          style={{ textShadow: '0 0 4px var(--trace-glow)' }}
        >
          <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--trace-dim)' }} />
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-trace animate-pulse"
            style={{ boxShadow: '0 0 6px var(--trace)' }}
          />
          <span>SIGNAL · ROUTING</span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-trace animate-pulse"
            style={{ boxShadow: '0 0 6px var(--trace)' }}
          />
          <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--trace-dim)' }} />
        </div>

        <h1
          className="mt-8 font-display text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-ink md:text-4xl"
        >
          Redirecting to{' '}
          <span
            className="italic text-trace"
            style={{ textShadow: '0 0 18px var(--trace-glow), 0 0 6px var(--trace-glow)' }}
          >
            the App Store…
          </span>
        </h1>

        <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-muted">
          Hold on a moment while we hand you off to Apple.
        </p>

        <a
          href={APP_STORE_URL}
          className="mt-8 inline-flex items-center gap-2 rounded-sm border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trace transition-all hover:-translate-y-0.5"
          style={{
            background: 'color-mix(in oklab, var(--trace) 6%, transparent)',
            textShadow: '0 0 6px var(--trace-glow)',
          }}
        >
          OPEN MANUALLY <span aria-hidden>↗</span>
        </a>
      </div>
    </section>
  )
}
