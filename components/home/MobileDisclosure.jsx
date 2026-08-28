"use client"

import { useEffect, useRef, useState } from 'react'

const DESKTOP_QUERY = '(min-width: 768px)'

export default function MobileDisclosure({ summary, children, className = '' }) {
  const detailsRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return (
    <details
      ref={detailsRef}
      open={isDesktop || isOpen}
      onToggle={(event) => {
        if (!isDesktop) setIsOpen(event.currentTarget.open)
      }}
      className={`group rounded-md border border-edge-dim bg-surface md:block md:border-0 md:bg-transparent ${className}`}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-ink-muted marker:content-none md:hidden">
        <span>{summary}</span>
        <span aria-hidden className="text-base text-ink-faint transition-transform group-open:rotate-45">+</span>
      </summary>
      {children}
    </details>
  )
}
