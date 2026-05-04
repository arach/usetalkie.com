import SiteShell from './v2/SiteShell'
import { NarratorProvider, NarratorDock } from './v2/narrator'

/**
 * Shared shell for top-level routes (`/`, `/downloads`, etc.). Wraps the
 * page in NarratorProvider + SiteShell + a canvas-themed root div so the
 * v2 chrome (header, footer, narrator) renders consistently across the
 * canonical routes that aren't under `/v2/*` (which has its own layout).
 */
export default function MainShell({ children }) {
  return (
    <NarratorProvider>
      <div className="min-h-screen bg-canvas text-ink antialiased">
        <SiteShell>{children}</SiteShell>
      </div>
      <NarratorDock />
    </NarratorProvider>
  )
}
