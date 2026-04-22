"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Cpu,
  Download,
  HardDrive,
  Laptop,
  Layers,
  Link2,
  Lock,
  Menu,
  Mic,
  Play,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Volume2,
  Wand2,
  X,
} from 'lucide-react'
import Container from './Container'
import PricingSection from './PricingSection'
import ThemeToggle from './ThemeToggle'
import { trackScrollDepth, captureUTMParams } from '../lib/analytics'
import { MAC_GALLERY, IPHONE_GALLERY } from '../lib/tour'

const NAV_LINKS = [
  { label: 'Capture', href: '#capture' },
  { label: 'Context', href: '#context' },
  { label: 'Ownership', href: '#ownership' },
  { label: 'Pricing', href: '#pricing' },
]

const USE_CASES = {
  Mac: [
    { action: 'Voice a rough draft', outcome: 'Your cleanup rule runs automatically' },
    { action: 'Record the meeting', outcome: 'Your summary format, every time' },
    { action: 'Describe the bug while it\'s fresh', outcome: 'GitHub issue filed, not forgotten' },
  ],
  Phone: [
    { action: 'Ramble for five minutes', outcome: 'Researches, pings you back' },
    { action: 'Snap a photo, voice your idea', outcome: 'Spec ready at your desk' },
    { action: 'Describe the problem out loud', outcome: 'Mac investigates, notifies you' },
  ],
  Watch: [
    { action: 'Tap mid-thought', outcome: 'Searchable by tonight' },
    { action: 'Capture without breaking stride', outcome: "It's waiting on your Mac" },
    { action: 'The 3am idea', outcome: 'Still there in the morning' },
  ],
}

const HERO_STORIES = [
  { surface: 'Mac' },
  { surface: 'Phone' },
  { surface: 'Watch' },
]

const CAPTURE_MODES = [
  {
    icon: Mic,
    eyebrow: 'Capture',
    title: 'Catch the thought before it mutates.',
    body: 'Record on iPhone, Apple Watch, or Mac and keep the full transcript in the same system.',
    href: '/mobile',
  },
  {
    icon: Laptop,
    eyebrow: 'Dictation',
    title: 'Speak straight into the work.',
    body: 'Use global shortcuts on Mac to dictate into whatever app you are already using, without switching tools.',
    href: '/mac',
  },
  {
    icon: Wand2,
    eyebrow: 'Compose',
    title: 'Structure it after the moment.',
    body: 'Rewrite, expand, summarize, and compare edits once the raw idea is safely recorded.',
    href: '/mac',
  },
  {
    icon: Search,
    eyebrow: 'Recovery',
    title: 'Recover the full thread later.',
    body: 'Search across memos and dictations, with app context attached when capture starts on desktop.',
    href: '/docs/cli',
  },
  {
    icon: Layers,
    eyebrow: 'Workflows',
    title: 'Turn raw speech into useful output.',
    body: 'Route captures into summaries, task lists, files, and follow-up actions without copy-paste.',
    href: '/docs/workflows',
  },
  {
    icon: Terminal,
    eyebrow: 'CLI',
    title: 'Keep the advanced layer open.',
    body: 'Query your voice data from scripts and tools instead of trapping it inside a single interface.',
    href: '/docs/cli',
  },
]

const FLOW_STEPS = [
  {
    id: '01',
    title: 'Capture in the cheapest mode.',
    body: 'Use the lowest-friction input available: iPhone, watch, Mac memo, or keyboard dictation.',
  },
  {
    id: '02',
    title: 'Recover the surrounding context.',
    body: 'Talkie remembers the transcript, time, app, and project clues that make a later search actually useful.',
  },
  {
    id: '03',
    title: 'Turn it into output when you are ready.',
    body: 'Summaries, tasks, cleaned-up notes, diffs, and workflows happen after the idea is safely stored.',
  },
]

const CONTEXT_TIMELINE = [
  {
    source: 'VS Code',
    time: '09:14',
    label: 'Dictation',
    note: 'The reconnect state machine should back off instead of retrying instantly.',
  },
  {
    source: 'Figma',
    time: '10:27',
    label: 'Memo',
    note: 'The pricing page needs less explanation and a stronger point of view at the top.',
  },
  {
    source: 'Safari',
    time: '12:08',
    label: 'Quick capture',
    note: 'Bring the voice memo into a doc and turn it into a launch checklist before the afternoon.',
  },
]

const OWNERSHIP_CARDS = [
  {
    icon: HardDrive,
    title: 'Local-first library',
    body: 'Your recordings and transcripts live on your devices instead of disappearing into a database we control.',
  },
  {
    icon: Cloud,
    title: 'Sync through your iCloud',
    body: 'When devices stay in step, the sync path runs through Apple\'s infrastructure and your Apple ID.',
  },
  {
    icon: Cpu,
    title: 'Models on your terms',
    body: 'Use on-device models, bring your own provider, or keep workflows fully offline when privacy matters more than convenience.',
  },
]

const OWNERSHIP_PILLS = [
  'On-device transcription',
  'Encrypted iCloud sync',
  'Searchable memos + dictations',
  'No vendor lock-in',
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [gallery, setGallery] = useState(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [heroSurfaceIndex, setHeroSurfaceIndex] = useState(0)
  const [flipPhase, setFlipPhase] = useState('idle') // 'idle' | 'out' | 'in'
  const [useCaseVisible, setUseCaseVisible] = useState(true)
  const [heroPaused, setHeroPaused] = useState(false)
  const [heroEntered, setHeroEntered] = useState(false)
  const audioRef = useRef(null)
  const scrollMilestones = useRef(new Set())
  const currentHeroStory = HERO_STORIES[heroSurfaceIndex]

  const jumpToSurface = (targetIndex) => {
    if (targetIndex === heroSurfaceIndex || flipPhase !== 'idle') return
    setFlipPhase('out')
    setUseCaseVisible(false)
    window.setTimeout(() => {
      setHeroSurfaceIndex(targetIndex)
      setFlipPhase('in')
      setUseCaseVisible(true)
    }, 150)
    window.setTimeout(() => setFlipPhase('idle'), 370)
  }

  const shareTourSlide = async (item) => {
    const slug = item.audio.replace('/audio/tour/', '').replace('.mp3', '')
    const url = `${window.location.origin}/tour/${slug}/`

    if (navigator.share) {
      try {
        await navigator.share({ title: `${item.title} - Talkie Tour`, url })
      } catch {}
      return
    }

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    captureUTMParams()
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeroEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (heroPaused) {
      setFlipPhase('idle')
      setUseCaseVisible(true)
      return
    }

    let t1, t2

    const interval = window.setInterval(() => {
      // Flap starts rotating out; use cases fade out simultaneously
      setFlipPhase('out')
      setUseCaseVisible(false)

      // At ~140ms the card is edge-on (-90°) — invisible — swap content then start flip-in
      t1 = window.setTimeout(() => {
        setHeroSurfaceIndex((current) => (current + 1) % HERO_STORIES.length)
        setFlipPhase('in')
        setUseCaseVisible(true)
      }, 150)

      // After flip-in animation completes, back to idle
      t2 = window.setTimeout(() => setFlipPhase('idle'), 150 + 220)
    }, 4000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [heroPaused])

  useEffect(() => {
    if (!gallery) return

    const onKey = (event) => {
      if (event.key === 'Escape') setGallery(null)
      if (event.key === 'ArrowRight') {
        setGallery((current) => current ? { ...current, index: (current.index + 1) % current.images.length } : null)
      }
      if (event.key === 'ArrowLeft') {
        setGallery((current) => current ? { ...current, index: (current.index - 1 + current.images.length) % current.images.length } : null)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gallery])

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

    if (audioRef.current) {
      audioRef.current.pause()
      setAudioPlaying(false)
    }

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
  }, [gallery?.index, gallery?.images, gallery])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)

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

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900 font-sans selection:bg-emerald-600 selection:text-white dark:bg-[#0a0f0d] dark:text-zinc-100 dark:selection:bg-white dark:selection:text-black">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] btn-ghost">
        Skip to content
      </a>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 backdrop-blur-xl ${
          scrolled
            ? 'border-zinc-200/70 bg-white/88 shadow-[0_12px_40px_rgba(2,6,23,0.08)] dark:border-zinc-800/70 dark:bg-zinc-950/82'
            : 'border-zinc-200/50 bg-white/72 dark:border-zinc-800/50 dark:bg-zinc-950/68'
        }`}
      >
        <Container className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/talkie-icon.png" alt="Talkie" className="h-7 w-7 rounded" />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold uppercase tracking-[0.28em] text-zinc-900 dark:text-white">Talkie</span>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <div className="flex items-center gap-5 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <Link href="/docs" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
                Docs
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle floating={false} />
              <Link
                href="/download"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-900 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white transition-all hover:scale-[1.02] hover:bg-emerald-600 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle floating={false} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="rounded-full border border-zinc-200/70 bg-white/80 p-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:border-zinc-800/70 dark:bg-zinc-950/75 dark:text-zinc-400 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>

        {mobileMenuOpen && (
          <div className="border-t border-zinc-200/70 bg-white/95 dark:border-zinc-800/70 dark:bg-zinc-950/95 md:hidden">
            <Container className="flex flex-col gap-3 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Docs
              </Link>
              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white dark:bg-white dark:text-black"
              >
                <Download className="h-3.5 w-3.5" />
                Download Talkie
              </Link>
            </Container>
          </div>
        )}
      </nav>

      <main id="main">
        <section
          className="relative overflow-hidden border-b border-stone-200/70 bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-24 pb-20 dark:border-zinc-800/70 dark:from-[#111519] dark:via-[#0d1115] dark:to-[#090c10] md:pt-32 md:pb-24"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          <div className="absolute inset-0 bg-grid-fade opacity-45 pointer-events-none" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_62%)] opacity-0 dark:opacity-100" />

          <Container className="relative z-10">
            <div className={`mx-auto max-w-4xl text-center transition-[opacity,transform] duration-700 ease-out ${heroEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/90 px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.2em] shadow-[0_12px_40px_rgba(2,6,23,0.06)] dark:border-white/10 dark:bg-zinc-900/70">
                {[{ label: 'Mac', idx: 0 }, { label: 'iPhone', idx: 1 }, { label: 'Watch', idx: 2 }].map(({ label, idx }, i, arr) => (
                  <React.Fragment key={label}>
                    <button
                      onClick={() => jumpToSurface(idx)}
                      className={`transition-colors duration-200 ${heroSurfaceIndex === idx ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                    >
                      {label}
                    </button>
                    {i < arr.length - 1 && (
                      <span className="text-zinc-300 dark:text-zinc-600">,</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <h1
                className="mt-8 flex items-end justify-center gap-x-[0.28em] font-display text-[clamp(2.8rem,9vw,5.6rem)] font-normal tracking-[-0.025em] leading-[0.92] text-zinc-950 dark:text-white"
                aria-label={`Talk to your ${currentHeroStory.surface}`}
              >
                <span className="shrink-0">Talk to your</span>
                <span className="shrink-0" style={{ perspective: '600px' }}>
                  <span
                    onClick={() => jumpToSurface((heroSurfaceIndex + 1) % HERO_STORIES.length)}
                    className="relative mb-[-0.18em] inline-flex min-w-[3.8em] cursor-pointer items-center justify-center overflow-hidden rounded-[0.18em] border border-zinc-700/50 bg-zinc-900 px-[0.28em] py-[0.18em] font-display text-[1em] font-normal tracking-[-0.01em] text-zinc-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-zinc-800"
                    style={{
                      animation:
                        flipPhase === 'out' ? 'flap-out 140ms ease-in forwards' :
                        flipPhase === 'in'  ? 'flap-in 200ms cubic-bezier(0.22, 1.2, 0.36, 1) forwards' :
                        undefined,
                    }}
                  >
                    <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/10 dark:bg-white/10" />
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent)]" />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18))]" />
                    <span className="relative inline-block w-full text-center">
                      {currentHeroStory.surface}
                    </span>
                  </span>
                </span>
              </h1>

              <div className="mx-auto mt-9 grid w-full max-w-[38rem] grid-cols-[1fr_2.5rem_1fr] items-center gap-y-3" aria-live="polite">
                {USE_CASES[currentHeroStory.surface].map((item, i) => (
                  <React.Fragment key={item.action}>
                    <span
                      className={`text-right text-sm text-zinc-500 dark:text-zinc-400 transition-all duration-300 ${useCaseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                      style={{ transitionDelay: useCaseVisible ? `${i * 60}ms` : '0ms' }}
                    >
                      {item.action}
                    </span>
                    <span className="select-none text-center text-zinc-400 dark:text-zinc-500">
                      →
                    </span>
                    <span
                      className={`text-left text-sm text-emerald-600 dark:text-emerald-400 transition-all duration-300 ${useCaseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                      style={{ transitionDelay: useCaseVisible ? `${i * 60}ms` : '0ms' }}
                    >
                      {item.outcome}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/download"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-600 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-all hover:scale-[1.02] hover:bg-emerald-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  <Download className="h-4 w-4" />
                  Download Talkie
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
                >
                  <Play className="h-4 w-4" />
                  Watch Demo
                </Link>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-400">
                <Terminal className="h-3 w-3" />
                <span>or</span>
                <code className="rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">bun add -g @talkie/app</code>
              </div>

            </div>

            <div className={`relative mx-auto mt-16 max-w-5xl transition-[opacity,transform] duration-700 ease-out delay-200 ${heroEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="absolute inset-x-8 top-5 hidden h-full rounded-[32px] bg-black/5 blur-3xl md:block dark:bg-white/10 dark:opacity-90" />
              <div className="absolute inset-x-14 top-10 hidden h-[78%] rounded-[36px] bg-white/[0.08] blur-[90px] md:block dark:opacity-100" />

              <div className="relative rounded-[32px] border border-zinc-200/70 bg-white/72 p-4 shadow-[0_36px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.045] dark:shadow-[0_44px_140px_rgba(0,0,0,0.48)] md:p-6">
                <div className="pointer-events-none absolute inset-[1px] rounded-[30px] border border-white/50 opacity-0 dark:opacity-100" />
                <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-end lg:grid-cols-[minmax(0,1fr)_260px]">
                  <button
                    type="button"
                    onClick={() => setGallery({ images: MAC_GALLERY, index: 0 })}
                    className="group relative block overflow-hidden rounded-[24px] border border-zinc-200/80 bg-white shadow-2xl transition-transform hover:scale-[1.01] dark:border-white/5 dark:bg-[#0b0e12] dark:shadow-[0_28px_80px_rgba(0,0,0,0.46)]"
                  >
                    <div className="pointer-events-none absolute inset-x-10 top-0 h-20 bg-white/0 opacity-0 blur-3xl dark:bg-white/10 dark:opacity-100" />
                    <img
                      src="/screenshots/mac-home.png"
                      alt="Talkie for Mac dashboard"
                      className="w-full h-auto"
                      loading="lazy"
                    />
                    <div className="flex items-center justify-between border-t border-zinc-200/70 bg-stone-50 px-5 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="text-left">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Mac</p>
                        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">Dashboard, search, actions, compose</p>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-300">
                        Open tour
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGallery({ images: IPHONE_GALLERY, index: 0 })}
                    className="group relative mx-auto flex w-full max-w-[240px] flex-col overflow-hidden rounded-[28px] border border-zinc-200/80 bg-stone-100 shadow-2xl transition-transform hover:scale-[1.02] dark:border-white/5 dark:bg-[#0f1419] dark:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
                  >
                    <div className="pointer-events-none absolute inset-x-6 top-2 h-16 rounded-full bg-white/0 opacity-0 blur-3xl dark:bg-white/10 dark:opacity-100" />
                    <div className="flex min-h-[430px] items-center justify-center px-5 pt-5 pb-8">
                      <img
                        src="/screenshots/iphone-16-pro-max-3.png"
                        alt="Talkie for iPhone terminal view"
                        className="h-auto w-full rounded-[22px] bg-transparent shadow-lg shadow-black/10 dark:shadow-black/40"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex min-h-[68px] items-center justify-between border-t border-zinc-200/70 bg-stone-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="text-left">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">iPhone</p>
                        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">On the go</p>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-300">
                        Tour
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  {
                    title: 'Talk through the work',
                    body: 'Use your voice to get a thought, draft, or instruction into motion without breaking focus.',
                  },
                  {
                    title: 'Pick the thread back up',
                    body: 'Search what you said later with the transcript, timing, and context still attached.',
                  },
                  {
                    title: 'Let your Mac run with it',
                    body: 'Turn speech into a draft, task list, export, or workflow when it is time to do real work.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-zinc-200/70 bg-white/75 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/55"
                  >
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-zinc-300">
                      {item.title}
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section id="capture" className="border-b border-stone-200/70 bg-white py-20 dark:border-zinc-800/70 dark:bg-[#0a0f0d] md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-zinc-300">
                Every fast path, one system
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-5xl">
                One voice path. More than one use.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Talkie can start as a quick note, a dictated paragraph, a search query, or the start of a workflow. The point is not voice for its own sake. The point is moving work forward.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {CAPTURE_MODES.map(({ body, eyebrow, href, icon: Icon, title }) => (
                <Link
                  key={title}
                  href={href}
                  className="group rounded-[24px] border border-zinc-200/70 bg-stone-50/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-white hover:shadow-[0_24px_60px_rgba(16,185,129,0.12)] dark:border-zinc-800/70 dark:bg-zinc-950/55 dark:hover:border-zinc-700 dark:hover:bg-zinc-950/80 dark:hover:shadow-[0_24px_60px_rgba(255,255,255,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500/15 dark:bg-white/5 dark:text-zinc-100 dark:group-hover:bg-white/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                      {eyebrow}
                    </p>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {body}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors group-hover:text-emerald-600 dark:group-hover:text-white">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section id="context" className="border-b border-stone-200/70 bg-stone-50 py-20 dark:border-zinc-800/70 dark:bg-[#0d1012] md:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/75 px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/50 dark:text-zinc-300">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500 dark:text-zinc-200" />
                  Context that survives the moment
                </div>

                <h2 className="mt-6 text-4xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-5xl">
                  Voice notes are easy to save. Harder to use.
                </h2>

                <p className="mt-5 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Talkie keeps enough of the moment intact that coming back later feels less like archaeology and more like picking work back up.
                </p>

                <div className="mt-8 space-y-5">
                  {FLOW_STEPS.map((step) => (
                    <div
                      key={step.id}
                      className="flex gap-4 rounded-[24px] border border-zinc-200/70 bg-white/80 p-5 dark:border-zinc-800/70 dark:bg-zinc-950/55"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-emerald-600 dark:bg-white/5 dark:text-zinc-100">
                        {step.id}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/mobile"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-700 transition-colors hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/55 dark:text-zinc-300 dark:hover:text-white"
                  >
                    iPhone capture
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/mac"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-700 transition-colors hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/55 dark:text-zinc-300 dark:hover:text-white"
                  >
                    Mac workflow
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[30px] border border-zinc-200/70 bg-white/88 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-zinc-800/70 dark:bg-zinc-950/62">
                <div className="flex items-center justify-between border-b border-zinc-200/70 pb-4 dark:border-zinc-800/70">
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Recent captures</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">The idea keeps its surroundings.</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-emerald-600 dark:bg-white/5 dark:text-zinc-200">
                    Search-ready
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {CONTEXT_TIMELINE.map((item) => (
                    <div
                      key={`${item.source}-${item.time}`}
                      className="rounded-[24px] border border-zinc-200/70 bg-stone-50/80 p-4 dark:border-zinc-800/70 dark:bg-zinc-900/45"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-white dark:bg-white dark:text-black">
                            {item.source.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-950 dark:text-white">{item.source}</p>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                          </div>
                        </div>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-400">
                          {item.time}
                        </p>
                      </div>
                      <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[22px] border border-zinc-200/70 bg-zinc-950 p-4 text-white dark:border-zinc-800">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-emerald-400 dark:text-zinc-300">
                      CLI example
                    </p>
                    <code className="mt-3 block text-sm leading-relaxed text-zinc-200">
                      talkie search "pricing page" --app Figma
                    </code>
                  </div>
                  <div className="rounded-[22px] border border-zinc-200/70 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/55">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">
                      Next step
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                      Turn the memo into a summary, export, or task list once you are back at your desk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="ownership" className="relative overflow-hidden border-b border-zinc-800/70 bg-[#0a0d11] py-20 md:py-24">
          <div className="absolute inset-0 bg-tactical-grid-dark opacity-20 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_65%)] pointer-events-none" />

          <Container className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-200">
                <Lock className="h-3.5 w-3.5" />
                Private by architecture
              </div>

              <h2 className="mt-6 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
                Your voice stays on your side.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
                Your library lives on your devices. Sync runs through your iCloud. On-device transcription is available. External providers are opt-in and use your keys.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {OWNERSHIP_CARDS.map(({ body, icon: Icon, title }) => (
                <div
                  key={title}
                  className="rounded-[26px] border border-zinc-800/70 bg-white/[0.03] p-6 backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-zinc-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-300">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {OWNERSHIP_PILLS.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-800/70 bg-black/20 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-200"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-300" />
                  {item}
                </div>
              ))}
            </div>
          </Container>
        </section>

        <PricingSection />

        <section id="get" className="border-b border-stone-200/70 bg-white py-20 dark:border-zinc-800/70 dark:bg-[#0a0f0d] md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Ready when you are
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-5xl">
                Start with your Mac.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                iPhone and Watch help you catch the thought. Mac is where Talkie earns its keep.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/download"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-zinc-900 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-all hover:scale-[1.02] hover:bg-emerald-600 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  <Download className="h-4 w-4" />
                  Download Talkie
                </Link>
                <Link
                  href="/philosophy"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-700 transition-colors hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/55 dark:text-zinc-300 dark:hover:text-white"
                >
                  Read the philosophy
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <footer className="bg-stone-100 py-12 dark:bg-[#081210]">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <img src="/talkie-icon.png" alt="Talkie" className="h-5 w-5 rounded" />
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-zinc-900 dark:text-white">Talkie</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Talk to your Mac. A mic is all you need.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            <Link href="/docs" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Docs</Link>
            <Link href="/mac" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Mac</Link>
            <Link href="/mobile" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Mobile</Link>
            <Link href="/security" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Security</Link>
            <Link href="/about" className="transition-colors hover:text-zinc-900 dark:hover:text-white">About</Link>
            <a href="mailto:hello@usetalkie.com" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Email</a>
            <a href="https://x.com/usetalkieapp" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-900 dark:hover:text-white">@usetalkieapp</a>
          </div>

          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400">
            (C) {new Date().getFullYear()} Talkie Systems Inc.
          </p>
        </Container>
      </footer>

      {gallery && (() => {
        const current = gallery.images[gallery.index]
        return (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-10"
            onClick={() => setGallery(null)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {(() => {
              const isPortrait = gallery.images === IPHONE_GALLERY
              const imageMaxWidth = isPortrait
                ? 'min(40vw, calc(55vh * 0.46))'
                : 'min(90vw, calc(60vh * 1.15))'

              return (
                <div className="relative z-10 flex w-full flex-col items-center" onClick={(event) => event.stopPropagation()}>
                  <div className="overflow-hidden rounded-xl border border-white/20 shadow-2xl" style={{ maxWidth: imageMaxWidth }}>
                    <img
                      src={current.src}
                      alt={current.title}
                      className="w-full h-auto select-none"
                      style={isPortrait ? { maxHeight: '50vh', width: 'auto', margin: '0 auto' } : undefined}
                      draggable={false}
                    />
                    <div className="border-t border-white/20 bg-black px-10 py-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">{current.title}</span>
                      <p className="mt-1 text-xs leading-relaxed text-white/80">{current.caption}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex w-full items-start gap-3 px-10" style={{ maxWidth: imageMaxWidth }}>
                    <Mic className="mt-0.5 h-4 w-4 shrink-0 text-white/20" />
                    <p className="flex-1 text-xs italic leading-relaxed text-white/60">{current.narration}</p>
                    {current.audio && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!audioRef.current) return

                          if (audioPlaying) {
                            audioRef.current.pause()
                            setAudioPlaying(false)
                            return
                          }

                          audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {})
                        }}
                        className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest transition-all ${
                          audioPlaying
                        ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400 dark:border-white/15 dark:bg-white/10 dark:text-zinc-100'
                        : 'border-white/15 bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                        }`}
                        aria-label={audioPlaying ? 'Pause narration' : 'Listen to narration'}
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>{audioPlaying ? 'Playing' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })()}

            {gallery.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setGallery((currentGallery) => ({
                      ...currentGallery,
                      index: (currentGallery.index - 1 + currentGallery.images.length) % currentGallery.images.length,
                    }))
                  }}
                  className="absolute left-3 top-1/2 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:left-6"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setGallery((currentGallery) => ({
                      ...currentGallery,
                      index: (currentGallery.index + 1) % currentGallery.images.length,
                    }))
                  }}
                  className="absolute right-3 top-1/2 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {gallery.images.length > 1 && (
              <div className="relative z-20 mt-5 flex items-center gap-2">
                {gallery.images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setGallery((currentGallery) => ({ ...currentGallery, index }))
                    }}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === gallery.index ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  shareTourSlide(current)
                }}
                className={`rounded-full p-2 backdrop-blur-sm transition-colors ${
                  copied ? 'bg-emerald-500/20 text-emerald-400 dark:bg-white/10 dark:text-zinc-100' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={copied ? 'Link copied' : 'Copy link to this slide'}
                title="Copy link"
              >
                <Link2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setGallery(null)}
                className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {gallery.images.length > 1 && (
              <div className="absolute top-5 left-1/2 z-20 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-white/70">
                {gallery.index + 1} / {gallery.images.length}
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
