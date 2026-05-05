'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Static-export 404 page. GitHub Pages serves the generated 404.html for any
 * missing path. Two responsibilities:
 *
 *   1. Bounce legacy /v2/<x>/ URLs to /<x>/ — the v2 oscilloscope redesign
 *      shipped at /v2/* and external links/bookmarks may still point there.
 *      Once this page redirects, those visitors land on the canonical route
 *      where the same content now lives.
 *   2. Render a real 404 for anything else.
 *
 * The redirect runs in a client effect because static export has no server
 * runtime to issue HTTP 301s. JS-driven redirect is intentional here.
 */
export default function NotFound() {
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    const path = window.location.pathname
    if (path.startsWith('/v2/')) {
      setRedirecting(true)
      const target = path.replace(/^\/v2/, '') + window.location.search + window.location.hash
      window.location.replace(target || '/')
    }
  }, [])

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink font-mono text-sm">
        Redirecting…
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-canvas text-ink p-6">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-ink-faint">404</p>
      <h1 className="font-display text-4xl tracking-tight text-center">Not the page you wanted.</h1>
      <Link href="/" className="font-mono text-xs uppercase tracking-widest underline underline-offset-4 hover:text-amber transition-colors">
        Back to home
      </Link>
    </div>
  )
}
