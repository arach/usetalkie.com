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
import SignalTable from './SignalTable'
import ThemeToggle from './ThemeToggle'
import capturesCatalog from '../content/captures.json'
import { trackScrollDepth, captureUTMParams } from '../lib/analytics'
import { MAC_GALLERY, IPHONE_GALLERY } from '../lib/tour'
import { TALKIE_PHONE_APP } from '../shared/config/product-links'

const HERO_QR_SIZE = 80
const HERO_QR_EXPANDED_SIZE = 288

const NAV_LINKS = [
  { label: 'Capture', href: '#capture' },
  { label: 'Context', href: '#context' },
  { label: 'Ownership', href: '#ownership' },
  { label: 'Pricing', href: '#pricing' },
]

const USE_CASES = {
  Computer: [
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
  Agents: [
    { action: 'Talk through the problem', outcome: 'Your agent gets the full context' },
    { action: 'Send the thought to your Mac', outcome: 'The work continues at your desk' },
    { action: 'Ask for the next step', outcome: 'The result comes back to you' },
  ],
}

/* Generic device categories rather than Apple brand names — the
 * rolodex is brand-agnostic framing ("Talk to your X" works for any
 * surface). Mac/iPhone-specific copy stays on the per-product pages. */
const HERO_STORIES = [
  { surface: 'Computer' },
  { surface: 'Phone' },
  { surface: 'Watch' },
  { surface: 'Agents' },
]

const WORK_STORIES = [
  { surface: 'Mac', useCaseKey: 'Computer' },
  { surface: 'Phone', useCaseKey: 'Phone' },
  { surface: 'Watch', useCaseKey: 'Watch' },
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
    title: 'Private dictation stays local',
    body: 'Everyday dictation can be transcribed on-device. The recording and transcript stay in your library, on your devices.',
  },
  {
    icon: Cpu,
    title: 'Meetings can stay straightforward',
    body: 'Record a meeting and use regular transcription when you do not need speaker labels. No diarization, no cloud diarization step.',
  },
  {
    icon: Cloud,
    title: 'Diarization uses the cloud',
    body: 'When you ask Talkie to separate speakers, the meeting audio is sent to a cloud transcription provider. Talkie tells you before that happens, and Max users can use their own provider keys.',
  },
]

const OWNERSHIP_PILLS = [
  'On-device dictation',
  'Local meeting transcription',
  'Cloud diarization disclosed',
  'Encrypted iCloud sync',
]

function SimpleProductHero({ openMacGallery, openPhoneGallery }) {
  return (
    <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
      <div className="relative z-10 max-w-xl text-center lg:text-left">
        <p className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
          From voice to useful work
        </p>
        <h1 className="mt-5 font-display text-[clamp(3.2rem,4.9vw,4.9rem)] font-normal leading-[0.88] tracking-[-0.05em] text-zinc-950 dark:text-white">
          <span className="block lg:whitespace-nowrap">An assistant</span>
          <span className="block lg:whitespace-nowrap">that moves your</span>
          <span className="block lg:whitespace-nowrap">ideas forward.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-xl lg:mx-0">
          Capture a thought on your phone. Turn it into a draft, task, or workflow on your Mac.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
          <Link
            href="/download"
            prefetch={false}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-zinc-950 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-transform hover:scale-[1.02] dark:bg-white dark:text-black"
          >
            <Download className="h-4 w-4" />
            Download for Mac
          </Link>
          <Link
            href={TALKIE_PHONE_APP.appStoreUrl}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-zinc-300 bg-white/70 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-800 transition-colors hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            <Smartphone className="h-4 w-4" />
            iPhone app
          </Link>
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
          Free build · macOS 26+ · Apple silicon
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[66rem] px-1 pb-10 sm:px-6 md:pb-16 lg:px-0">
        <div className="pointer-events-none absolute inset-x-[5%] bottom-[4%] h-[62%] rounded-full bg-amber-500/[0.07] blur-[96px] dark:bg-white/[0.06]" />

        <button
          type="button"
          onClick={openMacGallery}
          aria-label="Open the Talkie for Mac tour"
          className="group relative mx-auto block w-[92%] -translate-x-[2%] text-left sm:w-[88%] md:w-[88%]"
        >
          <div className="rounded-t-[18px] border border-zinc-300 bg-gradient-to-b from-zinc-100 to-zinc-300 p-[5px] shadow-[0_30px_70px_-34px_rgba(15,23,42,0.34)] transition-transform duration-300 group-hover:-translate-y-1 dark:border-zinc-600 dark:from-zinc-700 dark:to-zinc-900 md:rounded-t-[26px] md:p-[7px]">
            <div className="relative overflow-hidden rounded-t-[12px] border border-black/80 bg-black md:rounded-t-[18px]">
              <span className="absolute left-1/2 top-[5px] z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-zinc-700 ring-1 ring-black md:top-[7px]" />
              <img
                src="/screenshots/mac-home.png"
                alt="Talkie open on a MacBook"
                className="block h-auto w-full contrast-[1.12] saturate-[1.04]"
                loading="eager"
              />
            </div>
          </div>
          <div className="relative h-4 rounded-b-[40%] border-x border-b border-zinc-300 bg-gradient-to-b from-zinc-100 to-zinc-300 shadow-[0_12px_18px_-12px_rgba(15,23,42,0.5)] dark:border-zinc-600 dark:from-zinc-600 dark:to-zinc-800 md:h-6">
            <span className="absolute left-1/2 top-0 h-[3px] w-[18%] -translate-x-1/2 rounded-b-md bg-zinc-400/70 dark:bg-zinc-500" />
          </div>
          <div className="mx-auto h-1.5 w-[94%] rounded-b-full bg-zinc-400/60 blur-[0.2px] dark:bg-black/80" />
        </button>

        <div className="absolute bottom-[5%] left-[2%] z-10 hidden w-[172px] rounded-2xl border border-zinc-200/80 bg-white/85 p-3 text-left shadow-[0_20px_45px_-28px_rgba(15,23,42,0.24)] backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/90 sm:block md:left-[3%] md:w-[184px]">
          <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Captured on iPhone
          </div>
          <p className="mt-2.5 text-[13px] leading-snug text-zinc-800 dark:text-zinc-100">
            Turn the meeting notes into tomorrow’s action list.
          </p>
          <p className="mt-3 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
            Ready on your Mac
          </p>
        </div>

        <button
          type="button"
          onClick={openPhoneGallery}
          aria-label="Open the Talkie for iPhone tour"
          className="group absolute -bottom-[9%] right-[-3%] z-20 w-[37%] min-w-[180px] max-w-[300px] transition-transform duration-500 ease-out hover:-translate-y-2 hover:rotate-[1deg] sm:right-[-1%] md:right-0"
        >
          <img
            src="/screenshots/talkie-phone-3d-light.png"
            alt="Talkie open on a dimensional iPhone"
            className="block h-auto w-full drop-shadow-[0_34px_28px_rgba(15,23,42,0.22)] dark:hidden"
            loading="eager"
          />
          <img
            src="/screenshots/talkie-phone-3d-dark.png"
            alt="Talkie open on a dimensional iPhone"
            className="hidden h-auto w-full drop-shadow-[0_36px_30px_rgba(0,0,0,0.56)] dark:block"
            loading="eager"
          />
        </button>
      </div>
    </div>
  )
}

export default function LandingPage({ simplifiedHero = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [gallery, setGallery] = useState(null)
  const [qrExpanded, setQrExpanded] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [heroSurfaceIndex, setHeroSurfaceIndex] = useState(0)
  const [flipPhase, setFlipPhase] = useState('idle') // 'idle' | 'out' | 'in'
  const [useCaseVisible, setUseCaseVisible] = useState(true)
  const [heroPaused, setHeroPaused] = useState(false)
  const [heroEntered, setHeroEntered] = useState(false)
  const audioRef = useRef(null)
  const scrollMilestones = useRef(new Set())
  const heroStories = simplifiedHero ? WORK_STORIES : HERO_STORIES
  const currentHeroStory = heroStories[heroSurfaceIndex % heroStories.length]
  const currentUseCases = USE_CASES[currentHeroStory.useCaseKey ?? currentHeroStory.surface]

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
        setHeroSurfaceIndex((current) => (current + 1) % heroStories.length)
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
  }, [heroPaused, heroStories.length])

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
    if (!qrExpanded) return
    const onKey = (event) => {
      if (event.key === 'Escape') setQrExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [qrExpanded])

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
              <Link href="/ideas" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
                Ideas
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle floating={false} />
              <Link
                href="/download"
                prefetch={false}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-900 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white transition-all hover:scale-[1.02] hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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
                href="/ideas"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Ideas
              </Link>
              <Link
                href="/download"
                prefetch={false}
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
          className={simplifiedHero
            ? 'relative overflow-hidden border-b border-stone-200/55 bg-[#fbfbf9] pt-28 pb-24 dark:border-zinc-800/70 dark:bg-[#0c1013] md:pt-40 md:pb-32'
            : 'relative overflow-hidden border-b border-stone-200/70 bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-24 pb-20 dark:border-zinc-800/70 dark:from-[#111519] dark:via-[#0d1115] dark:to-[#090c10] md:pt-32 md:pb-24'}
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          <div className={`absolute inset-0 bg-grid-fade pointer-events-none ${simplifiedHero ? 'opacity-[0.12] dark:opacity-20' : 'opacity-45'}`} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_62%)] opacity-0 dark:opacity-100" />

          <Container className="relative z-10">
            {simplifiedHero && (
              <SimpleProductHero
                openMacGallery={() => setGallery({ images: MAC_GALLERY, index: 0 })}
                openPhoneGallery={() => setGallery({ images: IPHONE_GALLERY, index: 0 })}
              />
            )}

            <div className={`${simplifiedHero ? 'mx-auto mt-28 max-w-4xl border-t border-zinc-200/70 pt-16 dark:border-zinc-800/80 md:mt-36 md:pt-20' : 'mx-auto max-w-4xl'} text-center transition-[opacity,transform] duration-700 ease-out ${heroEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/90 px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.2em] shadow-[0_12px_40px_rgba(2,6,23,0.06)] dark:border-white/10 dark:bg-zinc-900/70">
                {heroStories.map(({ surface: label }, idx, arr) => (
                  <React.Fragment key={label}>
                    <button
                      onClick={() => jumpToSurface(idx)}
                      className={`transition-colors duration-200 ${heroSurfaceIndex === idx ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                    >
                      {label}
                    </button>
                    {idx < arr.length - 1 && (
                      <span className="text-zinc-300 dark:text-zinc-600">,</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <h1
                className={`${simplifiedHero ? 'flex-wrap gap-y-3 text-[clamp(1.85rem,4.2vw,3.2rem)]' : 'text-[clamp(2.8rem,9vw,5.6rem)]'} mt-8 flex items-end justify-center gap-x-[0.28em] font-display font-normal tracking-[-0.025em] leading-[0.92] text-zinc-950 dark:text-white`}
                aria-label={simplifiedHero
                  ? `Talkie works with you on your ${currentHeroStory.surface}`
                  : `Talk to your ${currentHeroStory.surface}`}
              >
                <span className="shrink-0">{simplifiedHero ? 'Talkie works with you on your' : 'Talk to your'}</span>
                <span className="shrink-0" style={{ perspective: '600px' }}>
                  <span
                    onClick={() => jumpToSurface((heroSurfaceIndex + 1) % heroStories.length)}
                    className="relative mb-[-0.18em] inline-flex min-w-[3.8em] cursor-pointer items-center justify-center overflow-hidden rounded-[0.18em] border border-black/20 bg-[#191917] px-[0.28em] py-[0.18em] font-display text-[1em] font-semibold tracking-[-0.01em] text-[#f4f2ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_18px_40px_rgba(15,15,14,0.2)] dark:border-white/12 dark:bg-[#171716] dark:text-[#f1efe9] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_44px_rgba(0,0,0,0.38)]"
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
                {currentUseCases.map((item, i) => (
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
                      className={`text-left text-sm text-zinc-900 dark:text-zinc-100 transition-all duration-300 ${useCaseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                      style={{ transitionDelay: useCaseVisible ? `${i * 60}ms` : '0ms' }}
                    >
                      {item.outcome}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              {!simplifiedHero && <div className="mx-auto mt-10 w-full max-w-[30rem]">
                <div className="relative rounded-2xl border border-zinc-200/60 bg-white/70 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.14)] backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.55)]">
                  <span className="absolute -top-2 left-5 bg-stone-50 px-2 text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-zinc-500 dark:bg-[#0d1115] dark:text-zinc-400">
                    Install
                  </span>

                  <div className="grid grid-cols-2 gap-2 p-2">
                    <Link
                      href="/download"
                      prefetch={false}
                      className="group flex h-[7.25rem] flex-col items-center justify-center gap-2 rounded-xl px-4 py-4 text-center transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform group-hover:scale-105 dark:bg-white dark:text-black">
                        <Download className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col items-center leading-tight">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                          For Mac
                        </span>
                        <span className="mt-1 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                          Download .dmg
                        </span>
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setQrExpanded(true)}
                      aria-label="Expand QR code to install Talkie on iPhone"
                      className="group flex h-[7.25rem] items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                    >
                      <span className="shrink-0 rounded-md bg-white p-1">
                        <img
                          src="/qr-app-store.svg"
                          alt="QR code to open Talkie on the App Store"
                          style={{ width: HERO_QR_SIZE, height: HERO_QR_SIZE }}
                        />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                          For iPhone
                        </span>
                        <span className="mt-1 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                          Scan or tap
                        </span>
                        <span className="mt-1 flex items-center gap-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                          Expand
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 rounded-b-2xl bg-zinc-50/40 px-4 py-2.5 dark:bg-zinc-950/30">
                    <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                      <Terminal className="h-3 w-3" />
                      Developers
                    </span>
                    <code className="flex-1 truncate rounded-md bg-zinc-100/60 px-2 py-1 text-left text-[11px] font-mono text-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                      bun add -g @talkie/app
                    </code>
                  </div>
                </div>
              </div>}

            </div>

            {!simplifiedHero && <div className={`relative mx-auto mt-16 max-w-5xl transition-[opacity,transform] duration-700 ease-out delay-200 ${heroEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
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
            </div>}
          </Container>
        </section>

        <section id="capture" className="border-b border-[var(--ed-line)] bg-[var(--ed-paper-alt)] py-24 md:py-32">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-16">
              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[var(--ed-accent)]">
                  Every fast path, one system
                </p>
                <h2 className="mt-5 max-w-2xl font-display text-[clamp(2.8rem,4.7vw,4rem)] font-normal leading-[0.94] tracking-[-0.035em] text-[var(--ed-ink)]">
                  <span className="block">One voice path.</span>
                  <span className="block lg:whitespace-nowrap">More than one use.</span>
                </h2>
              </div>
              <p className="max-w-2xl text-[17px] leading-[1.68] text-[var(--ed-ink-2)] lg:pb-1">
                A quick note, a dictated paragraph, a search, or the start of a workflow. Voice is simply the shortest distance between the thought and useful work.
              </p>
            </div>

            <div className="mt-16 grid border-t border-[var(--ed-line)] md:grid-cols-2">
              {CAPTURE_MODES.map(({ body, eyebrow, href, icon: Icon, title }, index) => (
                <Link
                  key={title}
                  href={href}
                  className={`group grid grid-cols-[auto_1fr] gap-5 border-b border-[var(--ed-line)] py-8 transition-colors hover:bg-[var(--ed-accent-soft)] md:px-8 ${index % 2 === 0 ? 'md:border-r' : ''}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--ed-accent-soft)] text-[var(--ed-accent)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--ed-ink-3)]">
                        {String(index + 1).padStart(2, '0')} · {eyebrow}
                      </p>
                      <ArrowRight className="h-4 w-4 text-[var(--ed-ink-3)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--ed-accent)]" />
                    </div>
                    <h3 className="mt-4 text-[17px] font-semibold leading-[1.35] tracking-[-0.01em] text-[var(--ed-ink)]">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-md text-[15px] leading-[1.65] text-[var(--ed-ink-2)]">
                      {body}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section aria-label="Talkie live capture examples" className="clean-home-signal border-b border-[var(--ed-line)] bg-[var(--ed-paper)] py-20 md:py-24">
          <Container>
            <div className="flex flex-col gap-3 border-b border-[var(--ed-line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[var(--ed-accent)]">
                Live capture
              </p>
              <p className="text-[14px] text-[var(--ed-ink-2)]">
                Choose a thought. Press play. Watch it land.
              </p>
            </div>
            <div className="mt-8">
              <SignalTable catalog={capturesCatalog} />
            </div>
          </Container>
        </section>

        <section id="context" className="border-b border-[var(--ed-line)] bg-[var(--ed-paper)] py-24 md:py-32">
          <Container>
            <div className="grid gap-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-24">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[var(--ed-accent)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Context that survives the moment
                </p>
                <h2 className="mt-5 font-display text-[clamp(2.55rem,4.4vw,3.8rem)] font-normal leading-[0.98] tracking-[-0.03em] text-[var(--ed-ink)]">
                  Voice notes are easy to save. Harder to use.
                </h2>
                <p className="mt-6 max-w-xl text-[17px] leading-[1.68] text-[var(--ed-ink-2)]">
                  Talkie keeps the moment intact, so returning later feels less like archaeology and more like picking the work back up.
                </p>

                <div className="mt-12 border-t border-[var(--ed-line)]">
                  {FLOW_STEPS.map((step) => (
                    <div key={step.id} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[var(--ed-line)] py-6">
                      <span className="pt-0.5 font-mono text-[11px] font-medium tracking-[0.16em] text-[var(--ed-accent)]">
                        {step.id}
                      </span>
                      <div>
                        <h3 className="text-[17px] font-semibold leading-[1.35] tracking-[-0.01em] text-[var(--ed-ink)]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[15px] leading-[1.65] text-[var(--ed-ink-2)]">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-5">
                  <Link href="/mobile" className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.01em] text-[var(--ed-ink)] transition-colors hover:text-[var(--ed-accent)]">
                    iPhone capture <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="/mac" className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.01em] text-[var(--ed-ink)] transition-colors hover:text-[var(--ed-accent)]">
                    Mac workflow <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="self-start rounded-[20px] border border-[var(--ed-line)] bg-[var(--ed-paper-alt)] p-5 shadow-[var(--ed-shadow-lift)] md:p-8">
                <div className="flex items-start justify-between gap-6 pb-6">
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--ed-ink-3)]">Recent captures</p>
                    <p className="mt-2 text-[17px] font-semibold tracking-[-0.01em] text-[var(--ed-ink)]">The idea keeps its surroundings.</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-medium uppercase tracking-[0.18em] text-[var(--ed-ink-3)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-signal-green)]" />
                    Search ready
                  </div>
                </div>

                <div className="border-t border-[var(--ed-line)]">
                  {CONTEXT_TIMELINE.map((item) => (
                    <div key={`${item.source}-${item.time}`} className="grid grid-cols-[auto_1fr_auto] gap-4 border-b border-[var(--ed-line)] py-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--ed-ink)] text-[9px] font-mono font-bold uppercase tracking-[0.12em] text-[var(--ed-paper)]">
                        {item.source.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <p className="text-[14px] font-semibold text-[var(--ed-ink)]">{item.source}</p>
                          <p className="text-[9px] font-mono font-medium uppercase tracking-[0.16em] text-[var(--ed-ink-3)]">{item.label}</p>
                        </div>
                        <p className="mt-2 text-[15px] leading-[1.6] text-[var(--ed-ink-2)]">{item.note}</p>
                      </div>
                      <p className="pt-1 text-[10px] font-mono text-[var(--ed-ink-3)]">{item.time}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[16px] bg-[var(--ed-ink-slab)] p-5 text-[#f4efe6]">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#e68a3c]">CLI example</p>
                    <code className="mt-3 block text-[13px] leading-relaxed text-[#b8b2a4]">talkie search "pricing page" --app Figma</code>
                  </div>
                  <div className="border-l border-[var(--ed-line)] px-1 py-2 md:pl-5">
                    <p className="text-[10px] font-mono font-medium uppercase tracking-[0.18em] text-[var(--ed-ink-3)]">Then use it</p>
                    <p className="mt-3 text-[14px] leading-[1.6] text-[var(--ed-ink-2)]">Turn the memo into a summary, export, or task list back at your desk.</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="ownership" className="bg-[var(--ed-ink-slab)] py-24 text-[#f4efe6] md:py-32">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#e68a3c]">
                  <Lock className="h-3.5 w-3.5" />
                  A clear processing boundary
                </p>
                <h2 className="mt-5 max-w-xl font-display text-[clamp(2.7rem,4.8vw,4.2rem)] font-normal leading-[0.96] tracking-[-0.035em]">
                  Dictation stays local. Diarization uses the cloud.
                </h2>
                <p className="mt-6 max-w-xl text-[17px] leading-[1.68] text-[#b8b2a4]">
                  Talkie keeps the boundary simple and visible. Private dictation can stay entirely on-device. Meetings only leave your device when you choose cloud diarization to separate speakers.
                </p>
              </div>

              <div className="border-t border-white/10">
                {OWNERSHIP_CARDS.map(({ body, icon: Icon, title }) => (
                  <div key={title} className="grid grid-cols-[2.75rem_1fr] gap-5 border-b border-white/10 py-7">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/[0.06] text-[#e68a3c]">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-semibold leading-[1.35] tracking-[-0.01em]">{title}</h3>
                      <p className="mt-2 text-[15px] leading-[1.65] text-[#b8b2a4]">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
              {OWNERSHIP_PILLS.map((item) => (
                <div key={item} className="inline-flex items-center gap-2 text-[13px] font-medium text-[#b8b2a4]">
                  <ShieldCheck className="h-4 w-4 text-[#e68a3c]" />
                  {item}
                </div>
              ))}
            </div>
          </Container>
        </section>

        <PricingSection />

        <section id="get" className="border-b border-[var(--ed-line)] bg-[var(--ed-paper-alt)] py-24 md:py-32">
          <Container>
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-24">
              <div className="max-w-2xl">
                <p className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[var(--ed-accent)]">Ready when you are</p>
                <h2 className="mt-5 font-display text-[clamp(2.8rem,5vw,4.4rem)] font-normal leading-[0.96] tracking-[-0.035em] text-[var(--ed-ink)]">Start with your Mac.</h2>
                <p className="mt-6 max-w-xl text-[17px] leading-[1.68] text-[var(--ed-ink-2)]">iPhone and Watch catch the thought. Your Mac is where Talkie turns it into something useful.</p>
                <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
                <Link
                  href="/download"
                  prefetch={false}
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--ed-ink)] px-6 text-[13px] font-semibold tracking-[0.01em] text-[var(--ed-paper)] transition-transform hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  Download for Mac
                </Link>
                <a
                  href={TALKIE_PHONE_APP.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-[var(--ed-line)] bg-[var(--ed-paper)] px-6 text-[13px] font-semibold tracking-[0.01em] text-[var(--ed-ink)] transition-colors hover:border-[var(--ed-accent-line)] hover:text-[var(--ed-accent)]"
                >
                  <Smartphone className="h-4 w-4" />
                  iPhone &amp; iPad
                </a>
              </div>
              </div>

              <div className="flex items-center gap-5 rounded-[20px] border border-[var(--ed-line)] bg-[var(--ed-paper)] p-5 shadow-[var(--ed-shadow-lift)]">
                <div className="rounded-[12px] bg-white p-3">
                  <img
                    src="/qr-app-store.svg"
                    alt="QR code to download Talkie on the App Store"
                    className="h-28 w-28"
                  />
                </div>
                <div className="max-w-[9rem]">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--ed-ink-3)]">On your phone</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ed-ink-2)]">Scan to open Talkie in the App Store.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <footer className="bg-[var(--ed-paper-alt)] py-12">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <img src="/talkie-icon.png" alt="Talkie" className="h-5 w-5 rounded" />
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--ed-ink)]">Talkie</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ed-ink-2)]">
              An assistant that moves your ideas forward.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] font-medium text-[var(--ed-ink-2)]">
            <Link href="/docs" className="transition-colors hover:text-[var(--ed-accent)]">Docs</Link>
            <Link href="/mac" className="transition-colors hover:text-[var(--ed-accent)]">Mac</Link>
            <Link href="/mobile" className="transition-colors hover:text-[var(--ed-accent)]">Mobile</Link>
            <Link href="/security" className="transition-colors hover:text-[var(--ed-accent)]">Security</Link>
            <Link href="/about" className="transition-colors hover:text-[var(--ed-accent)]">About</Link>
            <a href="mailto:hello@usetalkie.com" className="transition-colors hover:text-[var(--ed-accent)]">Email</a>
            <a href="https://x.com/usetalkieapp" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--ed-accent)]">@usetalkieapp</a>
          </div>

          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ed-ink-3)]">
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

      {qrExpanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          onClick={() => setQrExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Install Talkie via App Store QR code"
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          <div
            className="relative z-10 flex flex-col items-center rounded-2xl border border-white/15 bg-zinc-950/80 p-6 shadow-2xl md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-white/60">
              Scan with your iPhone camera
            </p>
            <div className="mt-4 rounded-xl bg-white p-4">
              <img
                src="/qr-app-store.svg"
                alt="QR code to open Talkie on the App Store"
                style={{ width: HERO_QR_EXPANDED_SIZE, height: HERO_QR_EXPANDED_SIZE }}
              />
            </div>
            <a
              href={TALKIE_PHONE_APP.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/20"
            >
              Open in App Store
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <p className="mt-3 text-[10px] font-mono text-white/40">
              Press Esc or tap outside to close
            </p>

            <button
              type="button"
              onClick={() => setQrExpanded(false)}
              className="absolute top-3 right-3 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
