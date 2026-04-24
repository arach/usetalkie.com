import SiteShell from '../../components/v2/SiteShell'

/**
 * v2 layout — applies the oscilloscope canvas to every /v2/* route without
 * disturbing donor pages on canonical URLs. Pure server component; theme
 * lives in CSS variables, not in JS.
 *
 * On promotion this wrapper moves up to app/layout.jsx and the v2 prefix
 * goes away.
 */
export default function V2Layout({ children }) {
  return (
    <div className="min-h-screen bg-canvas text-ink antialiased">
      <SiteShell>{children}</SiteShell>
    </div>
  )
}
