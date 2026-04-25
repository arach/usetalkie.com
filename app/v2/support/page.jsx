import SupportPage from '../../../components/v2/SupportPage'

export const metadata = {
  title: 'Support — Talkie',
  description:
    'Get help with Talkie. Browse common topics, troubleshooting guides, and contact our support team.',
  openGraph: {
    title: 'Support — Talkie',
    description: 'Get help with Talkie. Browse common topics and contact support.',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

/**
 * /v2/support — server-rendered support page on the oscilloscope canvas.
 * Layout (app/v2/layout.jsx) wraps this in <SiteShell> with bg-canvas + text-ink.
 */
export default function V2SupportRoute() {
  return <SupportPage />
}
