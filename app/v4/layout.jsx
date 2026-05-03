import SiteShell from '../../components/v2/SiteShell'
import { NarratorProvider, NarratorDock } from '../../components/v2/narrator'

/**
 * v4 layout — same shell as v2, hosts the panoramic-instrument synthesis
 * at /v4/. Re-uses v2 chrome (header, footer, narrator) so the hero
 * composition can be evaluated against the rest of the site.
 */
export default function V4Layout({ children }) {
  return (
    <NarratorProvider>
      <div className="min-h-screen bg-canvas text-ink antialiased">
        <SiteShell>{children}</SiteShell>
      </div>
      <NarratorDock />
    </NarratorProvider>
  )
}
