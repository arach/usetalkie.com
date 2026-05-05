import SiteShell from './SiteShell'
import { NarratorProvider, NarratorDock } from './narrator'

/**
 * Shared shell for top-level routes (`/`, `/downloads`, etc.). Wraps the
 * page in NarratorProvider + SiteShell + a canvas-themed root div so the
 * shared chrome (header, footer, narrator) renders consistently across
 * canonical routes.
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
