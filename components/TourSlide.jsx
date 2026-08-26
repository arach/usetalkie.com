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
 * Mobile chrome is intentionally compact: short Gallery/Copy labels,
 * full-width narration decoupled from screenshot max-width, and
 * 44px primary touch targets.
 */

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }
const TRACE_GLOW_DOT = { boxShadow: '0 0 6px var(--trace)' }

function isEditableTarget(target) {
  if (!target || !(target instanceof Element)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return Boolean(target.closest('[contenteditable="true"]'))
}

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

  // Keyboard navigation — skip when typing in fields
  useEffect(() => {
    function handleKey(e) {
      if (isEditableTarget(e.target)) return
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
            className="mt-4 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-trace hover:underline"
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
  // Screenshot width only — narration is intentionally not bound to this.
  const imageMaxWidth = isPhone
    ? 'min(40vw, calc(55vh * 0.46))'
    : isWatch
      ? 'min(46vw, calc(55vh * 0.84))'
      : 'min(90vw, calc(60vh * 1.15))'

  return (
    <main id="main" className="relative flex min-h-[80vh] flex-col bg-canvas">
      {/* Audio element */}
      {item.audio && <audio ref={audioRef} src={item.audio} preload="none" />}

      {/* ========== TOP BAR ========== */}
      <div className="flex items-center justify-between gap-3 border-b border-edge-faint px-4 py-2 md:px-8 md:py-3">
        <Link
          href="/tour#gallery"
          className="group inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint transition-colors duration-200 hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace"
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 motion-reduce:transition-none motion-safe:group-hover:-translate-x-0.5"
          >
            ←
          </span>
          <span className="sm:hidden">Gallery</span>
          <span className="hidden sm:inline">BACK TO GALLERY</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle sm:inline-flex">
            <PlatformIcon className="h-3.5 w-3.5" aria-hidden />
            <span>TALKIE FOR {platformLabel}</span>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-sm border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace ${
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
            <span className="sm:hidden">{copied ? 'Copied' : 'Copy'}</span>
            <span className="hidden sm:inline">
              {copied ? 'COPIED' : `usetalkie.com/tour/${slug}`}
            </span>
          </button>
        </div>
      </div>

      {/* ========== STAGE ========== */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 md:px-10">
        <div className="relative flex w-full max-w-3xl flex-col items-center">
          {/* Screenshot bezel + caption — constrained by imageMaxWidth */}
          <div
            className="overflow-hidden rounded-md border border-edge bg-surface shadow-lg"
            style={{ maxWidth: imageMaxWidth }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.title}
              className="h-auto w-full select-none"
              style={isPortrait ? { maxHeight: '50vh', width: 'auto', margin: '0 auto' } : undefined}
              draggable={false}
            />
            <div className="border-t border-edge-faint bg-canvas-alt px-6 py-3">
              <h1
                className="font-mono text-[9px] uppercase tracking-[0.24em] text-trace"
                style={TRACE_GLOW_SOFT}
              >
                · {item.title}
              </h1>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">{item.caption}</p>
            </div>
          </div>

          {/* Narration + listen — full content width, stacked on small screens */}
          <div className="mt-4 flex w-full max-w-prose flex-col items-stretch gap-3 px-1 sm:px-2 md:max-w-2xl md:flex-row md:items-start md:gap-4 md:px-0">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
              <p className="flex-1 text-[13px] italic leading-relaxed text-ink-muted sm:text-[14px]">
                {item.narration}
              </p>
            </div>

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
                className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 self-stretch rounded-full border px-4 font-mono text-[9px] uppercase tracking-[0.24em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace md:self-start ${
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
                <Volume2 className="h-3.5 w-3.5" aria-hidden />
                <span>{audioPlaying ? 'PLAYING' : 'LISTEN'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========== PREV / NEXT ========== */}
      {(prev || next) && (
        <div className="flex items-center justify-between gap-3 border-t border-edge-faint px-4 py-3 md:px-8 md:py-5">
          {prev ? (
            <Link
              href={`/tour/${prev.slug}/`}
              className="group flex min-h-11 min-w-0 flex-1 items-center gap-2 py-2 text-ink-faint transition-colors duration-200 hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace sm:gap-3"
            >
              <ChevronLeft
                className="h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none motion-safe:group-hover:-translate-x-1"
                aria-hidden
              />
              <div className="min-w-0 text-left">
                <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                  PREVIOUS
                </span>
                <span className="block truncate text-[12px]">{prev.title}</span>
              </div>
            </Link>
          ) : (
            <span className="min-w-0 flex-1" aria-hidden />
          )}

          <div className="hidden shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle sm:inline-flex">
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
              className="group flex min-h-11 min-w-0 flex-1 items-center justify-end gap-2 py-2 text-right text-ink-faint transition-colors duration-200 hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace sm:gap-3"
            >
              <div className="min-w-0">
                <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-ink-subtle">
                  NEXT
                </span>
                <span className="block truncate text-[12px]">{next.title}</span>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none motion-safe:group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          ) : (
            <span className="min-w-0 flex-1" aria-hidden />
          )}
        </div>
      )}
    </main>
  )
}
