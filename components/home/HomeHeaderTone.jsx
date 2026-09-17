'use client'

import { useEffect } from 'react'

const AT_TOP_CLASS = 'home-at-top'
const THRESHOLD = 24

/**
 * Header tone for the homepage. While the page rests at the top, the shared
 * header sits transparent over the scenic hero in white; once the visitor
 * scrolls, it settles into the paper bar every other route uses.
 *
 * MainShell renders the class in the initial markup so the first paint is
 * already transparent; this island only keeps it honest as scroll changes.
 */
export default function HomeHeaderTone() {
  useEffect(() => {
    const shell = document.querySelector('.talkie-home-shell')
    if (!shell) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      shell.classList.toggle(AT_TOP_CLASS, window.scrollY < THRESHOLD)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
