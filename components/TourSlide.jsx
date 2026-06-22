"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Volume2, Laptop, Smartphone, Watch, Link2, Quote } from 'lucide-react'
import { getTourBySlug, getAdjacentTour } from '../lib/tour'

/**
 * Tour slide — v2 oscilloscope canvas.
 *
 * Client component. Three pieces of behavior force this:
 *   1. <audio> playback toggling and end-of-track reset
 *   2. global keyboard navigation (←, →, Esc)
 *   3. clipboard copy of the share URL with transient feedback
 *
 * The data fetch (`getTourBySlug` / `getAdjacentTour`) is synchronous and
 * pure (lib/tour.js is a static array), so reading it from a client
 * component is fine — no fs, no network. Internal links route through
 * /tour/[slug].
 *
 * Theme tokens flow through tailwind semantic colors; inline `style` is
 * limited to `--trace`-glow shadows that the token system can't express.
 */

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }
const TRACE_GLOW_DOT = { boxShadow: '0 0 6px var(--trace)' }

export default function TourSlide({ slug }) {
  const router = useRouter()
  const item = getTourBySlug(slug)
  const { prev, next } = getAdjacentTour(slug)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const audioRef = useRef(null)

  const copyLink = async () => {
    const url = `${window.location.origin}/tour/${slug}/`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Stop audio when slug changes
  useEffect(() => {
    setAudioPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [slug])

  // Reset playing state when audio ends
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnd = () => setAudioPlaying(false)
    audio.addEventListener('ended', onEnd)
    return () => audio.removeEventListener('ended', onEnd)
  }, [slug])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowLeft' && prev) router.push(`/tour/${prev.slug}/`)
      if (e.key === 'ArrowRight' && next) router.push(`/tour/${next.slug}/`)
      if (e.key === 'Escape') router.push('/tour#gallery')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prev, next, router])

  if (!item) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-canvas">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-faint">
            TOUR SLIDE NOT FOUND
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-trace hover:underline"
          >
            <span aria-hidden>←</span> BACK HOME
          </Link>
        </div>
      </section>
    )
  }

  const isPhone = item.platform === 'iphone'
  const isWatch = item.platform === 'watch'
  const isPortrait = isPhone || isWatch
  const PlatformIcon = isPhone ? Smartphone : isWatch ? Watch : Laptop
  const platformLabel = isPhone ? 'IPHONE' : isWatch ? 'WATCH' : 'MAC'
  const imageMaxWidth = isPhone
    ? 'min(40vw, calc(55vh * 0.46))'
    : isWatch
      ? 'min(46vw, calc(55vh * 0.84))'
      : 'min(90vw, calc(60vh * 1.15))'

  return (
    <section className="relative flex min-h-[80vh] flex-col bg-canvas">
      {/* Audio element */}
      {item.audio && <audio ref={audioRef} src={item.audio} preload="none" />}

      {/* ========== TOP BAR ========== */}
      <div className="flex items-center justify-between border-b border-edge-faint px-4 py-3 md:px-8">
        <Link
          href="/tour#gallery"
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint transition-colors duration-200 hover:text-amber"
        >
          <span aria-hidden className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
          <span>BACK TO GALLERY</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle sm:inline-flex">
            <PlatformIcon className="h-3.5 w-3.5" aria-hidden />
            <span>TALKIE FOR {platformLabel}</span>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] transition-all ${
              copied
                ? 'border-edge text-trace'
                : 'border-edge-dim text-ink-faint hover:border-edge hover:text-trace'
            }`}
            style={
              copied
                ? { background: 'color-mix(in oklab, var(--trace) 8%, transparent)' }
                : undefined
            }
            aria-label="Copy link to this slide"
            title="Copy link"
          >
            <Link2 className="h-3 w-3" aria-hidden />
            <span>{copied ? 'COPIED' : `usetalkie.com/tour/${slug}`}</span>
          </button>
        </div>
      </div>

      {/* ========== STAGE ========== */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 md:px-10">
        <div className="relative flex w-full flex-col items-center">
          {/* Screenshot bezel + caption */}
          <div
            className="overflow-hidden rounded-md border border-edge bg-surface shadow-lg"
            style={{ maxWidth: imageMaxWidth }}
          >
            <img
              src={item.src}
              alt={item.title}
              className="h-auto w-full select-none"
              style={isPortrait ? { maxHeight: '50vh', width: 'auto', margin: '0 auto' } : undefined}
              draggable={false}
            />
            <div className="border-t border-edge-faint bg-canvas-alt px-6 py-3">
              <span
                className="font-mono text-[9px] uppercase tracking-[0.24em] text-trace"
                style={TRACE_GLOW_SOFT}
              >
                · {item.title}
              </span>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">{item.caption}</p>
            </div>
          </div>

          {/* Narration + listen */}
          <div
            className="mt-4 flex w-full items-start gap-3 px-2 md:px-6"
            style={{ maxWidth: imageMaxWidth }}
          >
            <Quote className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
            <p className="flex-1 text-[13px] italic leading-relaxed text-ink-muted">
              {item.narration}
            </p>

            {item.audio && (
              <button
                type="button"
                onClick={() => {
                  if (!audioRef.current) return
                  if (audioPlaying) {
                    audioRef.current.pause()
                    setAudioPlaying(false)
                  } else {
                    audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {})
                  }
                }}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] transition-all ${
                  audioPlaying
                    ? 'border-edge text-trace'
                    : 'border-edge-dim text-ink-faint hover:border-edge hover:text-trace'
                }`}
                style={
                  audioPlaying
                    ? { background: 'color-mix(in oklab, var(--trace) 8%, transparent)' }
                    : undefined
                }
                aria-label={audioPlaying ? 'Pause narration' : 'Listen to narration'}
              >
                <Volume2 className="h-3 w-3" aria-hidden />
                <span>{audioPlaying ? 'PLAYING' : 'LISTEN'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========== PREV / NEXT ========== */}
      {(prev || next) && (
        <div className="flex items-center justify-between border-t border-edge-faint px-4 py-5 md:px-8">
          {prev ? (
            <Link
              href={`/tour/${prev.slug}/`}
              className="group flex items-center gap-3 text-ink-faint transition-colors duration-200 hover:text-amber"
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden />
              <div className="text-left">
                <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                  PREVIOUS
                </span>
                <span className="text-[12px]">{prev.title}</span>
              </div>
            </Link>
          ) : (
            <span aria-hidden />
          )}

          <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle sm:inline-flex">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-trace"
              style={TRACE_GLOW_DOT}
            />
            <span>← / → TO NAVIGATE</span>
          </div>

          {next ? (
            <Link
              href={`/tour/${next.slug}/`}
              className="group flex items-center gap-3 text-right text-ink-faint transition-colors duration-200 hover:text-amber"
            >
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                  NEXT
                </span>
                <span className="text-[12px]">{next.title}</span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </Link>
          ) : (
            <span aria-hidden />
          )}
        </div>
      )}
    </section>
  )
}
