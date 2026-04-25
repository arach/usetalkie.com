import ThankYouPage from '../../../components/v2/ThankYouPage'

export const metadata = {
  title: 'Thank You — Talkie',
  description: 'Thanks for signing up for early access to Talkie.',
}

/**
 * /v2/thank-you — server-rendered confirmation page on the oscilloscope canvas.
 * Layout (app/v2/layout.jsx) wraps this in <SiteShell> with bg-canvas + text-ink.
 */
export default function V2ThankYouRoute() {
  return <ThankYouPage />
}
