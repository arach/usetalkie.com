"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Volume2, ArrowLeft, Laptop, Smartphone, Link2, Quote } from 'lucide-react'
import { getTourBySlug, getAdjacentTour } from '../lib/tour'

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

  // Stop audio on slug change
  useEffect(() => {
    setAudioPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [slug])

  // Handle audio end
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
      if (e.key === 'Escape') router.push('/')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prev, next, router])

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-white/50 text-sm font-mono">Tour slide not found</p>
          <Link href="/" className="text-white/80 hover:text-white text-sm mt-4 inline-block underline">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const isPortrait = item.platform === 'iphone'
  const PlatformIcon = isPortrait ? Smartphone : Laptop
  const imageMaxWidth = isPortrait
    ? 'min(40vw, calc(55vh * 0.46))'
    : 'min(90vw, calc(60vh * 1.15))'

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Audio element */}
      {item.audio && <audio ref={audioRef} src={item.audio} preload="none" />}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to tour</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono uppercase tracking-widest">
            <PlatformIcon className="w-3.5 h-3.5" />
            <span>Talkie for {isPortrait ? 'iPhone' : 'Mac'}</span>
          </div>
          <button
            onClick={copyLink}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
              copied
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-white/30 hover:text-white/60 hover:bg-white/5'
            }`}
            aria-label="Copy link to this slide"
            title="Copy link"
          >
            <Link2 className="w-3 h-3" />
            <span className="text-[10px] font-mono tracking-wide">
              {copied ? 'Copied!' : `usetalkie.com/tour/${slug}`}
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-10 pb-8">
        <div className="relative w-full flex flex-col items-center">
          {/* Screenshot + caption bezel */}
          <div className="rounded-xl border border-white/20 overflow-hidden shadow-2xl" style={{ maxWidth: imageMaxWidth }}>
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-auto select-none"
              style={isPortrait ? { maxHeight: '50vh', width: 'auto', margin: '0 auto' } : undefined}
              draggable={false}
            />
            <div className="border-t border-white/20 bg-black px-10 py-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">
                {item.title}
              </span>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">{item.caption}</p>
            </div>
          </div>

          {/* Narration + listen */}
          <div className="w-full mt-3 flex items-start gap-3 px-10" style={{ maxWidth: imageMaxWidth }}>
            <Quote className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-xs text-white/60 leading-relaxed italic">{item.narration}</p>
            {item.audio && (
              <button
                onClick={() => {
                  if (!audioRef.current) return
                  if (audioPlaying) {
                    audioRef.current.pause()
                    setAudioPlaying(false)
                  } else {
                    audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {})
                  }
                }}
                className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${
                  audioPlaying
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/10 text-white/60 border border-white/15 hover:bg-white/20 hover:text-white'
                }`}
                aria-label={audioPlaying ? 'Pause narration' : 'Listen to narration'}
              >
                <Volume2 className="w-3 h-3" />
                <span>{audioPlaying ? 'Playing' : 'Listen'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prev/Next navigation */}
      {(prev || next) && (
        <div className="flex items-center justify-between px-4 md:px-8 py-5 border-t border-white/10">
          {prev ? (
            <Link
              href={`/tour/${prev.slug}/`}
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-widest block text-white/30">Previous</span>
                <span className="text-xs">{prev.title}</span>
              </div>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={`/tour/${next.slug}/`}
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors text-right"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest block text-white/30">Next</span>
                <span className="text-xs">{next.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      )}
    </div>
  )
}
