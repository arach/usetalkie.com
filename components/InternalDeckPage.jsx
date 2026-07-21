"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Cpu,
  HardDrive,
  Laptop,
  Layers,
  Lock,
  Mic,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Watch,
  Workflow,
} from 'lucide-react'
import Container from './Container'
import ThemeToggle from './ThemeToggle'

const SECTIONS = [
  { id: 'cover', number: '01', title: 'Cover' },
  { id: 'problem', number: '02', title: 'Problem' },
  { id: 'breakage', number: '03', title: 'Where Tools Break' },
  { id: 'loop', number: '04', title: 'System Loop' },
  { id: 'surfaces', number: '05', title: 'Product Surfaces' },
  { id: 'edge', number: '06', title: 'Why It Wins' },
  { id: 'trust', number: '07', title: 'Trust Story' },
  { id: 'brief', number: '08', title: 'Creative Brief' },
  { id: 'territories', number: '09', title: 'Campaign Territory' },
  { id: 'source-materials', number: '10', title: 'Source Materials' },
  { id: 'close', number: '11', title: 'Closing' },
]

const PROBLEM_MOMENTS = [
  'walking between meetings',
  'in the middle of coding',
  'right after a call',
  'switching between tasks',
]

const BREAKAGE_CARDS = [
  {
    title: 'Voice memos',
    body: 'Easy to record. Hard to recover. Weak connection to the rest of the work.',
  },
  {
    title: 'Dictation tools',
    body: 'Good at getting words onto a screen. Weak at preserving the thread around the thought.',
  },
  {
    title: 'Cloud AI tools',
    body: 'Strong at transformation. Weak on custody, continuity, and long-term retrieval.',
  },
]

const LOOP_STEPS = [
  {
    icon: Mic,
    title: 'Capture',
    body: 'Catch the thought on iPhone, Watch, or Mac before it mutates.',
  },
  {
    icon: Search,
    title: 'Transcript',
    body: 'Store the raw material in a form that stays searchable and useful later.',
  },
  {
    icon: Layers,
    title: 'Context',
    body: 'Keep timing, app state, project clues, and the broader working moment intact.',
  },
  {
    icon: Workflow,
    title: 'Action',
    body: 'Turn speech into drafts, tasks, files, workflows, and follow-up work on Mac.',
  },
]

const SURFACES = [
  {
    icon: Smartphone,
    title: 'iPhone',
    body: 'The capture surface. Quick, low-friction, always on you.',
    detail: 'Built for the moment an idea appears.',
  },
  {
    icon: Watch,
    title: 'Apple Watch',
    body: 'The smallest capture path. Tap once, speak once, keep moving.',
    detail: 'A lightweight entry point, not a destination.',
  },
  {
    icon: Laptop,
    title: 'Mac',
    body: 'The action surface. Search, edit, transform, route, and recover the full thread.',
    detail: 'This is where Talkie becomes useful work.',
  },
]

const EDGE_PILLARS = [
  {
    icon: Sparkles,
    title: 'Speed',
    body: 'Catch ideas with less friction than typing.',
  },
  {
    icon: Layers,
    title: 'Continuity',
    body: 'Keep the transcript and surrounding context intact.',
  },
  {
    icon: ShieldCheck,
    title: 'Ownership',
    body: 'Local-first storage, iCloud sync, on-device options, and provider choice.',
  },
  {
    icon: Terminal,
    title: 'Extensibility',
    body: 'Workflows, shell actions, CLI access, and agent paths for advanced users.',
  },
]

const TRUST_POINTS = [
  {
    icon: HardDrive,
    title: 'Local library',
    body: 'Your capture history lives in a local SQLite library on Mac.',
  },
  {
    icon: Cloud,
    title: 'iCloud custody',
    body: 'Sync runs through CloudKit and your Apple ID rather than a Talkie-owned database.',
  },
  {
    icon: Lock,
    title: 'Bring your own model',
    body: 'On-device paths and external providers are opt-in. Keys stay in Keychain.',
  },
]

const BRIEF_COLUMNS = [
  {
    label: 'Audience',
    items: [
      'builders and operators',
      'Mac-centric knowledge workers',
      'people who think faster than they type',
    ],
  },
  {
    label: 'Tone',
    items: [
      'precise',
      'opinionated',
      'calm',
      'technical without turning cold',
    ],
  },
  {
    label: 'What not to say',
    items: [
      'not a generic AI app',
      'not just dictation',
      'not mobile-first in its core story',
      'not agent-first on the homepage',
    ],
  },
]

const CAMPAIGNS = [
  {
    title: 'Think in Motion',
    lines: [
      'For people who think in motion',
      'Catch the thought before it mutates',
      'Your best ideas do not arrive at your desk',
    ],
  },
  {
    title: 'Capture Anywhere, Resolve on Mac',
    lines: [
      'Catch it on the move. Finish it on Mac.',
      'Capture anywhere. Continue where the work happens.',
      'Voice on the go, structure at your desk.',
    ],
  },
  {
    title: 'Private by Architecture',
    lines: [
      'Your voice stays on your side',
      'Privacy is not a setting. It is the system.',
      'Keep the chain on your side.',
    ],
  },
]

function SectionEyebrow({ number, title }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
      <span>{number}</span>
      <span className="h-px w-10 bg-zinc-300 dark:bg-zinc-800" />
      <span>{title}</span>
    </div>
  )
}

function InfoCard({ className = '', children }) {
  return (
    <div className={`rounded-[28px] border border-zinc-200/80 bg-white/88 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_30px_90px_rgba(0,0,0,0.28)] ${className}`}>
      {children}
    </div>
  )
}

export default function InternalDeckPage({ children }) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)

  useEffect(() => {
    const sections = document.querySelectorAll('[data-deck-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target?.id) setActiveSection(visible.target.id)
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: [0.25, 0.5, 0.75],
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-stone-100 text-zinc-900 dark:bg-[#0b0f14] dark:text-zinc-100">
      <ThemeToggle />

      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-stone-100/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0f14]/85">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-800" />
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Internal Narrative Deck
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-200">
                Talkie, positioned as one product
              </p>
            </div>
          </div>

          <div className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300">
            Noindex / Internal
          </div>
        </Container>
      </header>

      <Container className="grid gap-10 py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[28px] border border-zinc-200/80 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
            <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Slide Index
            </p>
            <div className="mt-4 space-y-1.5">
              {SECTIONS.map((section) => {
                const active = section.id === activeSection
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors ${
                      active
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                      {section.number}
                    </span>
                    <span className="text-sm">{section.title}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </aside>

        <main className="space-y-10">
          <section
            id="cover"
            data-deck-section
            className="relative overflow-hidden rounded-[34px] border border-zinc-200/80 bg-gradient-to-b from-white via-stone-50 to-stone-100 px-6 py-8 shadow-[0_36px_120px_rgba(15,23,42,0.1)] dark:border-white/10 dark:from-[#11161b] dark:via-[#0d1217] dark:to-[#0b0f14] md:px-10 md:py-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-35" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_60%)]" />
            <div className="relative z-10">
              <SectionEyebrow number="01" title="Cover" />
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:items-end">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Talkie
                  </p>
                  <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] text-zinc-950 dark:text-white md:text-7xl">
                    Private voice capture for people who think in motion.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-xl">
                    Capture anywhere. Recover the full thread later. Turn speech into usable output on Mac.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {[
                      'capture -> transcript -> context -> action',
                      'Mac as the action surface',
                      'local-first and private',
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-zinc-200/80 bg-white/80 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <InfoCard className="relative overflow-hidden p-4 md:p-5">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_70%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_70%)]" />
                  <div className="relative min-h-[470px] pt-4 pr-12 md:pr-[140px]">
                    <div className="w-full overflow-hidden rounded-[28px] border border-zinc-200/80 bg-black shadow-[0_28px_80px_rgba(15,23,42,0.16)] dark:border-white/10 dark:shadow-[0_28px_80px_rgba(0,0,0,0.34)]">
                      <div className="aspect-[4/3]">
                        <img
                          src="/screenshots/mac-home.png"
                          alt="Talkie for Mac dashboard"
                          className="h-full w-full object-cover object-left-top"
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-0 right-0 flex w-full max-w-[220px] flex-col overflow-hidden rounded-[28px] border border-zinc-200/80 bg-stone-100 shadow-[0_28px_80px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-[#0f1419] dark:shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
                      <div className="flex min-h-[410px] items-center justify-center px-4 py-5">
                        <img
                          src="/screenshots/iphone-16-pro-max-3.png"
                          alt="Talkie for iPhone terminal view"
                          className="h-auto w-full rounded-[22px] bg-transparent shadow-lg shadow-black/10 dark:hidden"
                        />
                        <img
                          src="/screenshots/iphone-dark-3.png"
                          alt="Talkie for iPhone terminal keyboard"
                          className="hidden h-auto w-full rounded-[22px] bg-transparent shadow-lg shadow-black/40 dark:block"
                        />
                      </div>
                    </div>
                  </div>
                </InfoCard>
              </div>
            </div>
          </section>

          <section
            id="problem"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-white/85 px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04] md:px-10 md:py-10"
          >
            <SectionEyebrow number="02" title="The Problem" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_320px]">
              <div>
                <h2 className="text-4xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-5xl">
                  The best ideas show up in motion.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                  They appear while moving through work, not while waiting politely for a clean blank document.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {PROBLEM_MOMENTS.map((moment) => (
                    <div
                      key={moment}
                      className="rounded-[24px] border border-zinc-200/80 bg-stone-50/90 p-5 text-sm text-zinc-700 dark:border-white/10 dark:bg-[#11161b] dark:text-zinc-200"
                    >
                      {moment}
                    </div>
                  ))}
                </div>
              </div>

              <InfoCard className="h-full">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  Core tension
                </p>
                <p className="mt-4 text-2xl font-bold leading-tight text-zinc-950 dark:text-white">
                  Most tools break the thread at exactly the moment the thought arrives.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  People do not need another place to dump thoughts. They need a system that can catch a thought quickly, keep the surrounding context, and make it useful later.
                </p>
              </InfoCard>
            </div>
          </section>

          <section
            id="breakage"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-zinc-950 px-6 py-8 text-white shadow-[0_28px_90px_rgba(15,23,42,0.14)] dark:border-white/10 md:px-10 md:py-10"
          >
            <SectionEyebrow number="03" title="Where Current Tools Break" />
            <div className="grid gap-5 lg:grid-cols-3">
              {BREAKAGE_CARDS.map((card) => (
                <div key={card.title} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-400">
                    {card.title}
                  </p>
                  <p className="mt-4 text-xl font-bold tracking-[-0.03em] text-white">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="loop"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-white/85 px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04] md:px-10 md:py-10"
          >
            <SectionEyebrow number="04" title="The Thesis" />
            <h2 className="max-w-3xl text-4xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-5xl">
              Talkie is a private voice capture system.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              The breakthrough is not just transcription. It is continuity.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {LOOP_STEPS.map(({ body, icon: Icon, title }) => (
                <InfoCard key={title} className="h-full p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-zinc-950 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {body}
                  </p>
                </InfoCard>
              ))}
            </div>
          </section>

          <section
            id="surfaces"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-gradient-to-b from-stone-50 to-white px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:from-[#11161b] dark:to-[#0d1217] md:px-10 md:py-10"
          >
            <SectionEyebrow number="05" title="Product Surfaces" />
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <h2 className="text-4xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-5xl">
                  One system, distinct roles.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                  The cleanest product truth is simple: iPhone and Watch are capture surfaces. Mac is where capture becomes search, structure, and action.
                </p>
                <div className="mt-8 space-y-4">
                  {SURFACES.map(({ body, detail, icon: Icon, title }) => (
                    <div
                      key={title}
                      className="rounded-[24px] border border-zinc-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold tracking-[-0.03em] text-zinc-950 dark:text-white">
                            {title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {body}
                          </p>
                          <p className="mt-2 text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                            {detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <InfoCard className="flex items-center justify-center p-5">
                <div className="grid w-full gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
                  <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-[28px] border border-zinc-200/80 bg-stone-100 dark:border-white/10 dark:bg-[#0f1419]">
                    <div className="flex min-h-[420px] items-center justify-center px-4 py-5">
                      <img
                        src="/screenshots/iphone-light-1.png"
                        alt="Talkie for iPhone memos list"
                        className="h-auto w-full rounded-[22px] bg-transparent shadow-lg shadow-black/10 dark:hidden"
                      />
                      <img
                        src="/screenshots/iphone-dark-1.png"
                        alt="Talkie for iPhone dictations list"
                        className="hidden h-auto w-full rounded-[22px] bg-transparent shadow-lg shadow-black/40 dark:block"
                      />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[24px] border border-zinc-200/80 bg-black dark:border-white/10">
                    <img
                      src="/screenshots/mac-home.png"
                      alt="Talkie for Mac dashboard"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </InfoCard>
            </div>
          </section>

          <section
            id="edge"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-white/85 px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04] md:px-10 md:py-10"
          >
            <SectionEyebrow number="06" title="Why It Wins" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {EDGE_PILLARS.map(({ body, icon: Icon, title }) => (
                <InfoCard key={title} className="h-full p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-zinc-950 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {body}
                  </p>
                </InfoCard>
              ))}
            </div>
          </section>

          <section
            id="trust"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-zinc-950 px-6 py-8 text-white shadow-[0_28px_90px_rgba(15,23,42,0.14)] dark:border-white/10 md:px-10 md:py-10"
          >
            <SectionEyebrow number="07" title="Trust Story" />
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <h2 className="text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
                  Privacy here is architectural, not cosmetic.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
                  Talkie is not built around a company-owned thought database. That matters because users are speaking unfinished work, not polished public content.
                </p>
                <div className="mt-8 grid gap-4 lg:grid-cols-3">
                  {TRUST_POINTS.map(({ body, icon: Icon, title }) => (
                    <div key={title} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-white">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Credibility stack
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    'local SQLite library on Mac',
                    'CloudKit / iCloud sync path',
                    'on-device transcription option',
                    'API keys in Keychain',
                    'CLI and workflow access for advanced users',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      <span className="text-sm text-zinc-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id="brief"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-white/85 px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04] md:px-10 md:py-10"
          >
            <SectionEyebrow number="08" title="Creative Brief Snapshot" />
            <h2 className="max-w-3xl text-4xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-5xl">
              The story only works if the product feels like one thing.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              The internal rule is simple: Talkie can be capture, dictation, workflows, search, and AI, but it should always be introduced as one coherent system.
            </p>

            <div className="mt-8 grid gap-4 xl:grid-cols-3">
              {BRIEF_COLUMNS.map(({ items, label }) => (
                <InfoCard key={label} className="h-full p-5">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    {label}
                  </p>
                  <div className="mt-4 space-y-3">
                    {items.map((item) => (
                      <div key={item} className="rounded-2xl border border-zinc-200/80 bg-stone-50/90 px-4 py-3 text-sm text-zinc-700 dark:border-white/10 dark:bg-[#11161b] dark:text-zinc-200">
                        {item}
                      </div>
                    ))}
                  </div>
                </InfoCard>
              ))}
            </div>
          </section>

          <section
            id="territories"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-gradient-to-b from-white via-stone-50 to-stone-100 px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:from-[#11161b] dark:via-[#0f1419] dark:to-[#0b0f14] md:px-10 md:py-10"
          >
            <SectionEyebrow number="09" title="Campaign Territory" />
            <div className="grid gap-5 xl:grid-cols-3">
              {CAMPAIGNS.map(({ lines, title }) => (
                <InfoCard key={title} className="h-full p-5">
                  <h3 className="text-2xl font-bold tracking-[-0.03em] text-zinc-950 dark:text-white">
                    {title}
                  </h3>
                  <div className="mt-5 space-y-3">
                    {lines.map((line) => (
                      <div key={line} className="rounded-2xl border border-zinc-200/80 bg-stone-50/90 px-4 py-3 text-sm text-zinc-700 dark:border-white/10 dark:bg-[#11161b] dark:text-zinc-200">
                        {line}
                      </div>
                    ))}
                  </div>
                </InfoCard>
              ))}
            </div>
          </section>

          {children}

          <section
            id="close"
            data-deck-section
            className="rounded-[34px] border border-zinc-200/80 bg-zinc-950 px-6 py-8 text-white shadow-[0_28px_90px_rgba(15,23,42,0.14)] dark:border-white/10 md:px-10 md:py-10"
          >
            <SectionEyebrow number="11" title="Closing" />
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
              <div>
                <h2 className="max-w-4xl text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">
                  Talkie gives people a way to think out loud without losing the thread.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
                  It starts as capture. It becomes memory, structure, and action. It stays on your side.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Recommended next moves
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    'turn this into a designed PDF deck',
                    'rewrite homepage / Mac / mobile pages from one message hierarchy',
                    'script a 45-second demo around capture -> context -> action',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      <span className="text-sm text-zinc-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </Container>
    </div>
  )
}
