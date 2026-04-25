import SiteShell from '../../components/v2/SiteShell'
import { NarratorProvider, NarratorDock } from '../../components/v2/narrator'

/**
 * v2 layout — applies the oscilloscope canvas to every /v2/* route without
 * disturbing donor pages on canonical URLs. The layout itself stays a
 * server component; the NarratorProvider is a client island that wraps
 * the tree so any server-rendered child can host a <NarrateTrigger/>.
 *
 * On promotion this wrapper moves up to app/layout.jsx and the v2 prefix
 * goes away.
 */
export default function V2Layout({ children }) {
  return (
    <NarratorProvider>
      <div className="min-h-screen bg-canvas text-ink antialiased">
        <SiteShell>{children}</SiteShell>
      </div>
      <NarratorDock />
    </NarratorProvider>
  )
}
