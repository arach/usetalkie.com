"use client"
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  Mic,
  Cloud,
  ShieldCheck,
  Smartphone,
  Laptop,
  Download,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Lock,
  Quote,
  HardDrive,
  Menu,
  X,
  Bot,
  DollarSign,
  Zap,
  Sparkles,
  Wand2,
  Book,
  Terminal,
  Layers,
  User,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Link2,
} from 'lucide-react'
import Container from './Container'
import HeroBadge from './HeroBadge'
import PricingSection from './PricingSection'
import ThemeToggle from './ThemeToggle'
import { trackScrollDepth, trackFeatureTab, captureUTMParams } from '../lib/analytics'
import { MAC_GALLERY, IPHONE_GALLERY } from '../lib/tour'
import { FEATURES } from '../shared/config/features'

// Feature flags
const SHOW_AGENTS = FEATURES.SHOW_AGENTS

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [pricingActive, setPricingActive] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [featureTab, setFeatureTab] = useState('mac')
  const [gallery, setGallery] = useState(null) // null | { images: string[], index: number }
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const audioRef = useRef(null)
  const scrollMilestones = useRef(new Set())

  // Share/copy tour slide URL
  const shareTourSlide = async (item) => {
    const slug = item.audio.replace('/audio/tour/', '').replace('.mp3', '')
    const url = `${window.location.origin}/tour/${slug}/`
    if (navigator.share) {
      try { await navigator.share({ title: `${item.title} — Talkie Tour`, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Capture UTM params on mount
  useEffect(() => {
    captureUTMParams()
  }, [])

  // Gallery keyboard navigation
  useEffect(() => {
    if (!gallery) return
    const onKey = (e) => {
      if (e.key === 'Escape') setGallery(null)
      if (e.key === 'ArrowRight') setGallery(g => g ? { ...g, index: (g.index + 1) % g.images.length } : null)
      if (e.key === 'ArrowLeft') setGallery(g => g ? { ...g, index: (g.index - 1 + g.images.length) % g.images.length } : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gallery])

  // Gallery audio — preload on slide change, no auto-play
  useEffect(() => {
    if (!gallery) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setAudioPlaying(false)
      return
    }

    const current = gallery.images[gallery.index]
    if (!current?.audio) {
      if (audioRef.current) audioRef.current.pause()
      audioRef.current = null
      setAudioPlaying(false)
      return
    }

    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      setAudioPlaying(false)
    }

    // Preload only — user clicks to play
    const audio = new Audio(current.audio)
    audio.preload = 'auto'
    audioRef.current = audio

    const onEnded = () => setAudioPlaying(false)
    const onError = () => setAudioPlaying(false)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [gallery?.index, gallery?.images])

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)

      // Track scroll depth milestones
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      const milestones = [25, 50, 75, 100]
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone)
          trackScrollDepth(milestone)
        }
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll spy for pricing section
  useEffect(() => {
    if (typeof window === 'undefined') return
    const priceEl = document.getElementById('pricing')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target.id === 'pricing') setPricingActive(e.isIntersecting)
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0.1 }
    )
    if (priceEl) obs.observe(priceEl)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0f0d] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-600 selection:text-white dark:selection:bg-emerald-500 dark:selection:text-black">
      {/* Navigation */}
      <a href="#get" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn-ghost">Skip to content</a>
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 backdrop-blur-md ${
        scrolled
          ? 'bg-white/85 dark:bg-zinc-950/85 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
          : 'bg-white/70 dark:bg-zinc-950/70 border-zinc-200/40 dark:border-zinc-800/40'
      }`}>
        <Container className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/talkie-icon.png" alt="Talkie" className="h-7 w-7 rounded" />
            <span className="font-bold text-base tracking-tight font-mono uppercase">Talkie</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            <Link
              href="/demo"
              className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/philosophy"
              className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
            >
              Philosophy
            </Link>
            <Link
              href="/ideas"
              className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
            >
              Ideas
            </Link>
            <Link
              href="/docs"
              className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/security"
              className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
            >
              Security
            </Link>
            <Link
              href="/about"
              className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <a
              href="#pricing"
              className={`cursor-pointer transition-colors ${
                pricingActive ? 'text-zinc-900 dark:text-white' : 'hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Pricing
            </a>
            <ThemeToggle floating={false} />
          </div>
          {/* Mobile: theme toggle + menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle floating={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </Container>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
            <Container className="py-4 flex flex-col gap-3">
              <Link
                href="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm font-mono font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Demo
              </Link>
              <Link
                href="/philosophy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm font-mono font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Quote className="w-4 h-4" />
                Philosophy
              </Link>
              <Link
                href="/ideas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm font-mono font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                Ideas
              </Link>
              <Link
                href="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm font-mono font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Book className="w-4 h-4" />
                Docs
              </Link>
              <Link
                href="/security"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm font-mono font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Security
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm font-mono font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <User className="w-4 h-4" />
                About
              </Link>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm font-mono font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                Pricing
              </a>
            </Container>
          </div>
        )}
      </nav>

      {/* Hero Section - Technical Grid Background */}
      <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-gradient-to-b from-stone-100 to-stone-50 dark:from-[#0d1210] dark:to-[#0a0f0d]">
        <div className="absolute inset-0 z-0 bg-grid-fade pointer-events-none opacity-40" />
        <div className="bg-glow-emerald top-[-200px] left-1/2 -translate-x-1/2 z-0" />



        <Container className="relative z-10 text-center">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-6 leading-[0.9] group cursor-default">
            <span className="font-display italic font-medium transition-all duration-300 group-hover:drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]">Voice</span>{' '}
            <span className="text-zinc-400 dark:text-zinc-600 font-normal">to</span>{' '}
            <span className="relative inline-flex items-center">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Action.</span>
              <Sparkles className="absolute -top-5 -right-7 h-5 w-5 text-emerald-400/80" />
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 mb-4 leading-snug font-display">
            Your unified voice system.
          </p>
          <p className="mx-auto max-w-2xl text-base text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
            Drive all your Mac apps when you&apos;re working. Capture memos on iPhone and Watch when you&apos;re on the go.
          </p>

          <div className={`mt-8 grid grid-cols-1 gap-4 text-left ${SHOW_AGENTS ? 'sm:grid-cols-3' : 'sm:grid-cols-2 max-w-2xl mx-auto'}`}>
            <Link href="/mac" className="group/triad rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 p-4 backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-zinc-900/70 hover:border-emerald-400/70 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_12px_30px_rgba(16,185,129,0.16)] cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Laptop className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover/triad:text-emerald-600 dark:group-hover/triad:text-emerald-400 transition-colors">Talkie for Mac</span>
                <ArrowRight className="w-3 h-3 text-zinc-400 ml-auto opacity-0 -translate-x-2 group-hover/triad:opacity-100 group-hover/triad:translate-x-0 transition-all" />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Voice to action with dictation and workflows.
              </p>
            </Link>
            <Link href="/mobile" className="group/triad rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 p-4 backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-zinc-900/70 hover:border-emerald-400/70 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_12px_30px_rgba(16,185,129,0.16)] cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover/triad:text-emerald-600 dark:group-hover/triad:text-emerald-400 transition-colors">Talkie for Mobile</span>
                <ArrowRight className="w-3 h-3 text-zinc-400 ml-auto opacity-0 -translate-x-2 group-hover/triad:opacity-100 group-hover/triad:translate-x-0 transition-all" />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Capture on iPhone and Watch, synced to Mac.
              </p>
            </Link>
            {SHOW_AGENTS && (
              <Link href="/agents" className="group/triad rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 p-4 backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-zinc-900/70 hover:border-emerald-400/70 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_12px_30px_rgba(16,185,129,0.16)] cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover/triad:text-emerald-600 dark:group-hover/triad:text-emerald-400 transition-colors">Talkie for Agents</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400 ml-auto opacity-0 -translate-x-2 group-hover/triad:opacity-100 group-hover/triad:translate-x-0 transition-all" />
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  Voice-initiated workflows for tasks and documents.
                </p>
              </Link>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/download"
              className="h-12 px-8 rounded bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 dark:hover:bg-emerald-400 hover:scale-105 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Download Talkie</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* App Showcase */}
      <section className="relative py-16 md:py-24 bg-white dark:bg-[#0a0f0d] border-b border-stone-200/70 dark:border-emerald-900/20 overflow-hidden">
        <Container>
          <div className="flex flex-col md:flex-row items-end justify-center gap-8 md:gap-12">
            {/* Mac screenshot */}
            <div className="relative w-full md:w-[62%] flex-shrink-0">
              <button
                onClick={() => setGallery({ images: MAC_GALLERY, index: 0 })}
                className="block w-full rounded-xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50 border border-zinc-200/50 dark:border-zinc-700/50 cursor-zoom-in hover:shadow-3xl hover:scale-[1.01] transition-all duration-300"
              >
                <img
                  src="/screenshots/mac-home.png"
                  alt="Talkie for Mac — dashboard with recordings, transcripts, and activity"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="border-t border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50 dark:bg-black px-10 py-3 text-center">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Talkie for Mac</span>
                </div>
              </button>
            </div>

            {/* iPhone screenshot */}
            <div className="relative w-[200px] md:w-[185px] flex-shrink-0">
              <button
                onClick={() => setGallery({ images: IPHONE_GALLERY, index: 0 })}
                className="block w-full rounded-xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50 border border-zinc-200/50 dark:border-zinc-700/50 cursor-zoom-in hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 bg-zinc-50 dark:bg-black"
              >
                <div className="px-4 pt-4 pb-10">
                  <img
                    src="/screenshots/iphone-16-pro-max-6.png"
                    alt="Talkie for iPhone — memo detail with transcript and quick actions"
                    className="w-full h-auto rounded-lg shadow-lg shadow-black/10 dark:shadow-black/30"
                    loading="lazy"
                  />
                </div>
                <div className="border-t border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50 dark:bg-black px-4 py-3 text-center">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Talkie for iPhone</span>
                </div>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-24 bg-white dark:bg-[#0a0f0d] border-y border-stone-200/70 dark:border-emerald-900/20">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-tight">
              <span className="font-display italic font-medium">Voice</span> to Everything, <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Instantly.</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Talkie is the connective tissue - driving your favorite tools with the right context, then pinging you when it's done.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-2xl overflow-hidden">
            <div className="p-2">
              <div className="flex flex-wrap justify-center gap-2 rounded-lg bg-white/80 dark:bg-zinc-950/60 px-2.5 py-1.5 backdrop-blur-2xl">
                {[
                  { id: 'mac', label: 'Talkie for Mac', icon: Laptop },
                  { id: 'go', label: 'Talkie for Mobile', icon: Smartphone },
                  ...(SHOW_AGENTS ? [{ id: 'agents', label: 'Talkie for Agents', icon: Bot }] : []),
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setFeatureTab(id); trackFeatureTab(id) }}
                  className={`group inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                    featureTab === id
                      ? 'bg-zinc-800 text-white dark:bg-white dark:text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
                      : 'bg-white/70 text-zinc-600 dark:bg-zinc-900/70 dark:text-zinc-400 hover:backdrop-blur-2xl hover:text-zinc-900 dark:hover:text-white'
                    }`}
                    aria-pressed={featureTab === id}
                  >
                    <Icon className={`h-3.5 w-3.5 ${featureTab === id ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 md:p-6">
              {featureTab === 'mac' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  {[
                    {
                      icon: Terminal,
                      title: 'Universal Voice Input',
                      body: 'Dictate into any app. Talkie types wherever your cursor is, no plugins required.',
                    },
                    {
                      icon: Wand2,
                      title: 'Blazing-Fast & Accurate',
                      body: 'Real-time transcription that keeps up with your thoughts, powered by a state-of-the-art audio engine.',
                    },
                    {
                      icon: Book,
                      title: 'Teach It Your Language',
                      body: 'Ensure near-perfect accuracy for your specific jargon with Personal Dictionaries.',
                    },
                    {
                      icon: Cpu,
                      title: 'Local-First Engine',
                      body: 'Process speech on-device by default, with privacy built into every step.',
                    },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="rounded-lg border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/50 p-5 backdrop-blur-lg transition-all hover:backdrop-blur-2xl hover:border-emerald-400/70 hover:shadow-[0_10px_30px_rgba(16,185,129,0.14)]">
                      <Icon className="w-6 h-6 mx-auto text-emerald-500 mb-3" />
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">{title}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{body}</p>
                    </div>
                  ))}
                </div>
              )}

              {featureTab === 'go' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  {[
                    {
                      icon: Zap,
                      title: 'Instant Capture',
                      body: 'Open, speak, done. Capture ideas anywhere with iPhone or Apple Watch.',
                    },
                    {
                      icon: ShieldCheck,
                      title: 'On-Device Transcription',
                      body: 'Get a high-quality, private transcript immediately - no internet required.',
                    },
                    {
                      icon: Cloud,
                      title: 'Seamless iCloud Sync',
                      body: 'Your notes show up on your Mac moments later, ready for the next step.',
                    },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="rounded-lg border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/50 p-5 backdrop-blur-lg transition-all hover:backdrop-blur-2xl hover:border-emerald-400/70 hover:shadow-[0_10px_30px_rgba(16,185,129,0.14)]">
                      <Icon className="w-6 h-6 mx-auto text-emerald-500 mb-3" />
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">{title}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{body}</p>
                    </div>
                  ))}
                </div>
              )}

              {SHOW_AGENTS && featureTab === 'agents' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  {[
                    {
                      icon: Layers,
                      title: 'Agent Pipelines',
                      body: 'Chain steps that transform raw speech into structured output.',
                    },
                    {
                      icon: Wand2,
                      title: 'LLM Steps',
                      body: 'Summaries, extraction, and transformations tuned for your workflows.',
                    },
                    {
                      icon: Terminal,
                      title: 'Tool Actions',
                      body: 'Trigger scripts, export files, and route results where you work.',
                    },
                    {
                      icon: Book,
                      title: 'Personal Knowledge',
                      body: 'Keep outputs consistent with your language, style, and taxonomy.',
                    },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="rounded-lg border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/50 p-5 backdrop-blur-lg transition-all hover:backdrop-blur-2xl hover:border-emerald-400/70 hover:shadow-[0_10px_30px_rgba(16,185,129,0.14)]">
                      <Icon className="w-6 h-6 mx-auto text-emerald-500 mb-3" />
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">{title}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{body}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                {featureTab === 'mac' && (
                  <Link
                    href="/mac"
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Explore Talkie for Mac <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
                {featureTab === 'go' && (
                  <Link
                    href="/mobile"
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Explore Talkie for Mobile <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
                {SHOW_AGENTS && featureTab === 'agents' && (
                  <Link
                    href="/agents"
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Explore Automation <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

        </Container>
      </section>

      {/* Manifesto Section (Preview) */}
      <section id="philosophy" className="py-12 md:py-16 bg-stone-50 dark:bg-[#0d1210] border-t border-b border-stone-200/70 dark:border-emerald-900/20">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Header/Intro */}
            <div className="space-y-4 group/philosophy-header">
              <div className="flex items-center gap-3">
                <Quote className="w-3 h-3 text-zinc-400 transition-colors group-hover/philosophy-header:text-emerald-500" />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 transition-colors group-hover/philosophy-header:text-emerald-500">Our Philosophy</h3>
              </div>
              <h2 className="text-xl md:text-2xl tracking-tight text-zinc-900 dark:text-white leading-[1.2] transition-transform origin-left group-hover/philosophy-header:scale-[1.02]">
                <span className="font-display italic">Your best ideas</span> <span className="font-bold">don&apos;t wait for you to sit down.</span>
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                Your ideas show up anywhere, at any time. On a walk, between meetings, in the middle of something unrelated. Builders know this rhythm well. Sparks arrive fast, unpolished, and usually at inconvenient times.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center py-2">
              <div className="w-12 h-px bg-zinc-200 dark:bg-zinc-800"></div>
            </div>

            {/* Two Column Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group/devices p-4 -m-4 rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-2 transition-colors group-hover/devices:text-emerald-500">001 / DEVICES</span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-tight transition-colors group-hover/devices:text-emerald-600 dark:group-hover/devices:text-emerald-400">iPhone + Mac = The Perfect Pair</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs">
                  Your iPhone is the perfect capture device - always on you, always ready. Your Mac is where raw ideas become real output.
                </p>
              </div>
              <div className="group/apps p-4 -m-4 rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-2 transition-colors group-hover/apps:text-emerald-500">002 / APPS</span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-tight transition-colors group-hover/apps:text-emerald-600 dark:group-hover/apps:text-emerald-400">Apps, clouds and AI disconnect.</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs">
                  Voice Memos and Notes keep ideas trapped. AI tools pull your ideas into their clouds. Your thoughts get scattered or absorbed into someone else&apos;s system.
                </p>
              </div>
            </div>

            {/* Outro */}
            <div className="text-center pt-4 space-y-4">
              <Link href="/philosophy" className="group/believe inline-flex items-center gap-2 px-4 py-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/50 transition-all hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse group-hover/believe:scale-125 transition-transform"></div>
                <p className="text-zinc-900 dark:text-white font-bold text-[10px] uppercase tracking-wide transition-colors group-hover/believe:text-emerald-600 dark:group-hover/believe:text-emerald-400">
                  We believe something essential is missing.
                </p>
                <ArrowRight className="w-3 h-3 text-zinc-400 opacity-0 -translate-x-1 group-hover/believe:opacity-100 group-hover/believe:translate-x-0 transition-all" />
              </Link>
            </div>

          </div>
        </Container>
      </section>

      {/* Security Architecture Preview Section */}
      <section id="security-preview" className="py-16 md:py-24 bg-gradient-to-b from-[#0f1a16] to-[#0a1410] border-t border-b border-emerald-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-tactical-grid-dark opacity-15 pointer-events-none" />

        <Container className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">Data Sovereignty</span>
              </div>
              <h2 className="text-2xl md:text-3xl text-white tracking-tight leading-tight">
                <span className="font-display italic">Our servers don&apos;t listen.</span><br/>
                <span className="text-zinc-500 font-bold">Your voice stays yours.</span>
              </h2>
            </div>
            <Link
              href="/security"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-400 transition-colors shrink-0"
            >
              Security Deep Dive <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Condensed 3-column stance */}
          <div className="bg-[#081210] border border-emerald-900/30 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-emerald-900/20">

              {/* Local Storage */}
              <div className="p-6 group/local transition-colors hover:bg-emerald-950/30">
                <div className="flex items-center gap-3 mb-3">
                  <HardDrive className="w-4 h-4 text-emerald-500 transition-transform group-hover/local:scale-110" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 transition-colors group-hover/local:text-emerald-500">Local-First</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Data lives on your device. Delete the app, delete the data. No cloud database we control.
                </p>
              </div>

              {/* iCloud */}
              <div className="p-6 group/icloud transition-colors hover:bg-emerald-950/30">
                <div className="flex items-center gap-3 mb-3">
                  <Cloud className="w-4 h-4 text-emerald-500 transition-transform group-hover/icloud:scale-110" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 transition-colors group-hover/icloud:text-emerald-500">Your iCloud</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Sync uses Apple&apos;s Private CloudKit. Keys stay with your Apple ID. We never see them.
                </p>
              </div>

              {/* On-Device AI */}
              <div className="p-6 group/ai transition-colors hover:bg-emerald-950/30">
                <div className="flex items-center gap-3 mb-3">
                  <Cpu className="w-4 h-4 text-emerald-500 transition-transform group-hover/ai:scale-110" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 transition-colors group-hover/ai:text-emerald-500">On-Device AI</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Transcription runs locally on Neural Engine. Use local LLMs for full offline workflows.
                </p>
              </div>

            </div>
          </div>

          {/* Privacy Highlights */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-[10px] font-mono uppercase">
            <div className="group/highlight1 flex items-center gap-2 cursor-default">
              <Mic className="w-3 h-3 text-emerald-500 transition-transform group-hover/highlight1:scale-125" />
              <span className="text-emerald-400 transition-colors group-hover/highlight1:text-emerald-300">Voice transcribed on-device</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-emerald-800/40"></div>
            <div className="group/highlight2 flex items-center gap-2 cursor-default">
              <ShieldCheck className="w-3 h-3 text-emerald-500 transition-transform group-hover/highlight2:scale-125" />
              <span className="text-emerald-400 transition-colors group-hover/highlight2:text-emerald-300">Memos stay on your Mac</span>
            </div>
          </div>

        </Container>
      </section>

      <PricingSection />

      {/* Condensed CTA */}
      <section id="get" className="relative py-24 bg-gradient-to-b from-white to-stone-50 dark:from-[#0d1210] dark:to-[#0a0f0d] border-t border-stone-200/70 dark:border-emerald-900/20 group/cta">
        <div className="absolute inset-0 pointer-events-none bg-noise" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Cpu className="w-8 h-8 mx-auto text-zinc-400 mb-6 transition-all duration-500 group-hover/cta:text-emerald-500 group-hover/cta:rotate-180" strokeWidth={1} />
          <h2 className="text-xl md:text-3xl text-zinc-900 dark:text-white mb-8 tracking-tight leading-tight transition-transform duration-300 group-hover/cta:scale-[1.01]">
            <span className="font-display italic">Stop uploading your thoughts</span> <br className="hidden md:block" /> <span className="font-bold">to someone else&apos;s cloud.</span>
          </h2>
          <div className="flex justify-center">
            <Link href="/download" className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider overflow-hidden rounded hover:bg-emerald-700 dark:hover:bg-emerald-400 hover:shadow-lg transition-all">
              <span className="relative z-10">Download Talkie</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="mt-6 text-[10px] font-mono uppercase text-zinc-400">Your data stays yours • Always</p>
        </div>
      </section>

      <footer className="py-12 bg-stone-100 dark:bg-[#081210] border-t border-stone-200/70 dark:border-emerald-900/20">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/talkie-icon.png" alt="Talkie" className="h-5 w-5 rounded" />
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Talkie</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[10px] font-mono uppercase text-zinc-500">
            <a href="https://x.com/usetalkieapp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors font-bold">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @usetalkieapp
            </a>
            <a href="mailto:hello@usetalkie.com" className="hover:text-black dark:hover:text-white transition-colors">Email</a>
            <a href="/about" className="hover:text-black dark:hover:text-white transition-colors">About</a>
            <a href="/docs" className="hover:text-black dark:hover:text-white transition-colors">Docs</a>
            <a href="/ideas" className="hover:text-black dark:hover:text-white transition-colors">Ideas</a>
            <a href="/security" className="hover:text-black dark:hover:text-white transition-colors">Security</a>
            <a href="/philosophy" className="hover:text-black dark:hover:text-white transition-colors">Philosophy</a>
            <a href="/support" className="hover:text-black dark:hover:text-white transition-colors">Support</a>
            <a href="/privacypolicy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
          </div>
          <p className="text-[10px] font-mono uppercase text-zinc-400">© {new Date().getFullYear()} Talkie Systems Inc.</p>
        </Container>
      </footer>

      {/* Gallery Carousel */}
      {gallery && (() => {
        const current = gallery.images[gallery.index]
        return (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-10"
            onClick={() => setGallery(null)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Fixed-size slide container — image + narration share the same width */}
            {(() => {
              // Mac screenshots ~1.15:1 (landscape), iPhone ~0.46:1 (portrait)
              const isPortrait = gallery.images === IPHONE_GALLERY
              // Landscape: width derived from height. Portrait: height-constrained, width from aspect ratio
              const imageMaxWidth = isPortrait
                ? 'min(40vw, calc(55vh * 0.46))'
                : 'min(90vw, calc(60vh * 1.15))'
              return (
            <div className="relative z-10 w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              {/* Screenshot + caption bezel */}
              <div className="rounded-xl border border-white/20 overflow-hidden shadow-2xl" style={{ maxWidth: imageMaxWidth }}>
                <img
                  src={current.src}
                  alt={current.title}
                  className="w-full h-auto select-none"
                  style={isPortrait ? { maxHeight: '50vh', width: 'auto', margin: '0 auto' } : undefined}
                  draggable={false}
                />
                <div className="border-t border-white/20 bg-black px-10 py-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">{current.title}</span>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">{current.caption}</p>
                </div>
              </div>

              {/* Narration + listen */}
              <div className="w-full mt-3 flex items-start gap-3 px-10" style={{ maxWidth: imageMaxWidth }}>
                <Quote className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
                <p className="flex-1 text-xs text-white/60 leading-relaxed italic">{current.narration}</p>
                {current.audio && (
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
              )
            })()}

            {/* Nav arrows */}
            {gallery.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setGallery(g => ({ ...g, index: (g.index - 1 + g.images.length) % g.images.length }))
                  }}
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setGallery(g => ({ ...g, index: (g.index + 1) % g.images.length }))
                  }}
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dots */}
            {gallery.images.length > 1 && (
              <div className="relative z-20 mt-5 flex items-center gap-2">
                {gallery.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      setGallery(g => ({ ...g, index: i }))
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === gallery.index
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Top-right actions: link + close */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); shareTourSlide(current) }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                aria-label={copied ? 'Link copied' : 'Copy link to this slide'}
                title="Copy link"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGallery(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Counter */}
            {gallery.images.length > 1 && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 text-[10px] font-mono uppercase tracking-widest text-white/70">
                {gallery.index + 1} / {gallery.images.length}
              </div>
            )}
          </div>
        )
      })()}

    </div>
  )
}
