"use client"
import { trackAppStoreClick, trackDownload } from '../../lib/analytics'

/**
 * v2 TrackedAnchor — fires a GA event on click, then lets the browser follow
 * the href normally. Tiny client island so the surrounding card stays a server
 * component.
 *
 * `event` is one of:
 *   - { type: 'download', release: string, source: string }
 *   - { type: 'appStore', source: string }
 */
export default function TrackedAnchor({
  href,
  event,
  className = '',
  children,
  target,
  rel,
  ariaLabel,
}) {
  const handleClick = () => {
    if (!event) return
    if (event.type === 'download') {
      trackDownload(event.release ?? 'latest', event.source ?? 'v2_download_page')
    } else if (event.type === 'appStore') {
      trackAppStoreClick(event.source ?? 'v2_download_page')
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}
