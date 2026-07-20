'use client'

import { useEffect } from 'react'
import { trackAppStoreClick } from '../../../lib/analytics'
import { TALKIE_PHONE_APP } from '../../../shared/config/product-links'

export default function AppStoreRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const source = params.get('utm_source') || params.get('ref') || 'direct'
    const campaign = params.get('utm_campaign') || null

    trackAppStoreClick(source, campaign)

    // Small delay to let the analytics event fire before redirecting
    const timeout = setTimeout(() => {
      window.location.replace(TALKIE_PHONE_APP.appStoreUrl)
    }, 150)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-lg text-neutral-400">Redirecting to the App Store...</p>
        <a
          href={TALKIE_PHONE_APP.appStoreUrl}
          className="mt-4 inline-block text-sm text-neutral-500 underline"
        >
          Click here if not redirected
        </a>
      </div>
    </div>
  )
}
