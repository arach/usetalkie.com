"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  Smartphone,
  Watch,
  Command,
  Clock,
  Clipboard,
  MousePointer2,
  Zap,
  Timer,
  Eye,
  Laptop,
  Download,
  Cpu,
  HardDrive,
  Sparkles,
  Lightbulb,
  Target,
  Rocket,
  CheckCircle2,
  Code2,
  Mail,
  PenLine,
  FileText,
  Palette,
  RefreshCw,
  Circle,
} from 'lucide-react'
import Container from './Container'
import ThemeToggle from './ThemeToggle'
import SubNav from './SubNav'
import VideoPlayer from './VideoPlayer'
import DemoViewer from './DemoViewer'
import HubDiagram from './HubDiagram'

// Demo sections data
const DEMO_SECTIONS = [
  {
    id: 'dictate',
    title: 'Dictate',
    description: 'Voice to text in any app',
    videos: [
      { id: 'overview', title: 'Overview', src: '/videos/TalkieOverview.mp4' },
      { id: 'dictation', title: 'Dictation', src: '/videos/TalkieDictation.mp4' },
    ],
  },
  {
    id: 'orchestrate',
    title: 'Orchestrate',
    description: 'Workflows & automation',
    videos: [], // Coming soon
  },
  {
    id: 'manage',
    title: 'Manage',
    description: 'Library & search',
    videos: [], // Coming soon
  },
]

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-emerald-500/10 rounded">
        <Icon className="w-4 h-4 text-emerald-500" />
      </div>
      <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide">{title}</h3>
    </div>
    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
  </div>
)

const FlowStep = ({ number, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
      {number}
    </div>
    <div>
      <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide mb-1">{title}</h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  </div>
)

const BenefitCard = ({ icon: Icon, title, description, highlight }) => (
  <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 rounded-xl hover:border-emerald-500/50 transition-colors">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-emerald-500/10 rounded-xl flex-shrink-0">
        <Icon className="w-5 h-5 text-emerald-500" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide mb-2">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
        {highlight && (
          <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-3 uppercase tracking-wide">{highlight}</p>
        )}
      </div>
    </div>
  </div>
)

const StatCard = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-1">{value}</div>
    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</div>
  </div>
)

const TechPill = ({ label, value, valueClass = 'text-emerald-500' }) => (
  <div className="flex flex-col gap-1 p-3 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg">
    <span className="text-[8px] font-mono font-bold uppercase text-zinc-400 tracking-widest">{label}</span>
    <span className={`text-xs font-mono font-bold ${valueClass}`}>{value}</span>
  </div>
)

const ConfigLine = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
    <span className="text-[10px] font-mono text-zinc-500 uppercase">{label}</span>
    <span className="text-[10px] font-mono text-zinc-800 dark:text-zinc-200">{value}</span>
  </div>
)

export default function LivePage() {
  const [scrolled, setScrolled] = useState(false)
  const [hubSectionHovered, setHubSectionHovered] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <Container className="h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            BACK
          </Link>

          {/* Platform Nav - Center */}
          <SubNav />

          <div className="w-16" /> {/* Spacer for balance */}
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-18 pb-12 md:pt-20 md:pb-16 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <div className="absolute inset-0 z-0 bg-grid-fade pointer-events-none opacity-40" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl tracking-tighter text-zinc-900 dark:text-white leading-[0.95] mb-6">
              <span className="font-display italic">Voice</span> <span className="text-zinc-400 dark:text-zinc-500">to</span>{' '}
              <span className="font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Action.</span>
            </h1>

            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto mb-8">
              Speak and Talkie types, transcribes, or runs workflows. Local-first, private.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://github.com/arach/usetalkie.com/releases/latest/download/Talkie.dmg" className="h-12 px-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/25">
                <Download className="w-4 h-4" />
                <span>Download for Mac</span>
              </a>
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
                  <Laptop className="w-3 h-3" />
                  macOS 26+ • Apple Silicon
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Signed & Notarized by Apple
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Demos Section */}
      <section className="py-16 md:py-20 bg-zinc-950 border-t border-zinc-800">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl text-white tracking-tight">
              <span className="font-display italic">See</span> <span className="font-bold">Talkie in action.</span>
            </h2>
          </div>
          <DemoViewer sections={DEMO_SECTIONS} />
        </Container>
      </section>

      {/* The Hub */}
      <section
        className="py-16 md:py-20 bg-zinc-950 border-t border-zinc-800"
        onMouseEnter={() => setHubSectionHovered(true)}
        onMouseLeave={() => setHubSectionHovered(false)}
      >
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl text-white tracking-tight mb-3">
              <span className="font-display italic">One app.</span> <span className="font-bold">Everywhere.</span>
            </h2>
            <p className="text-zinc-500 leading-relaxed max-w-xl mx-auto">
              Talkie connects your voice to everything - apps, devices, services, and AI.
            </p>
          </div>

          <HubDiagram sectionHovered={hubSectionHovered} />
        </Container>
      </section>

      {/* Why Voice */}
      <section className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-800">
        <Container>
          {/* Centered Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">Why Voice?</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-6">
              Execute at the<br /><span className="text-emerald-500">speed of thought.</span>
            </h2>

            <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Speaking is the most natural way to express complex thoughts. Talkie turns your voice into text instantly, so you can capture ideas at the speed you think them.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-16 md:gap-24 mb-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-500">~40</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Keyboard WPM</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-500">200+</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Talkie WPM</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white">5x</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Faster</div>
            </div>
          </div>

          {/* Three Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Speed */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Speed</h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                We speak at 150 words per minute but type at 40. Voice capture lets you get thoughts out before they evolve or fade.
              </p>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-500">4x Faster Capture</p>
            </div>

            {/* Rest Your Eyes */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Rest Your Eyes</h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Look away from the screen while you speak. Mid-length thoughts flow better when you're not staring at a cursor waiting for words.
              </p>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-500">Natural Expression</p>
            </div>

            {/* Ecosystem */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Ecosystem</h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Capture on iPhone or Watch, then continue on Mac with workflows that turn speech into action.
              </p>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-500">Memo → Workflow → Action</p>
            </div>
          </div>

          {/* Menu Bar - Works in Any App */}
          <div className="mt-16 max-w-lg mx-auto text-center">
            <div className="bg-zinc-800/80 backdrop-blur rounded-lg px-4 py-2 flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium">
                <span></span>
                <span>Cursor</span>
                <span className="text-zinc-600">File</span>
                <span className="text-zinc-600">Edit</span>
                <span className="text-zinc-600">View</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-zinc-700 flex items-center justify-center">
                  <Circle className="w-2 h-2 text-zinc-500" />
                </div>
                <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                  <Mic className="w-2 h-2 text-emerald-400" />
                </div>
                <div className="w-4 h-4 rounded bg-zinc-700 flex items-center justify-center">
                  <span className="text-[8px] text-zinc-500">≡</span>
                </div>
                <span className="text-[10px] text-zinc-500 ml-1">9:41 AM</span>
              </div>
            </div>
            <p className="text-sm text-zinc-500">Lives in your menu bar. <span className="text-zinc-300">Works in any app.</span></p>
          </div>
        </Container>
      </section>

      {/* The Philosophy */}
      <section className="py-20 md:py-28 bg-zinc-950 text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">Philosophy</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6 leading-tight">
                Work is changing fast,<br/>
                <span className="text-emerald-400">and we're leaning</span><br/>
                into it.
              </h2>
              <div className="space-y-6 text-zinc-400 leading-relaxed">
                <p>
                  For the first time in our careers, we can turn ideas into action at the speed of the tools around us.
                </p>
                <p>
                  <span className="text-white font-medium">It's the age of AI.</span> Typing every idea by hand is no longer required.
                </p>
                <p>
                  You get to talk, move faster, and actually enjoy the upgrade.
                </p>
              </div>
            </div>

            {/* Visual: Idea → Action Flow */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-xl"></div>
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-zinc-500 mb-1">Moment 0</div>
                      <div className="text-white font-bold">Idea arrives</div>
                    </div>
                  </div>

                  <div className="w-px h-4 bg-zinc-800 ml-6"></div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mic className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-zinc-500 mb-1">+0.3 seconds</div>
                      <div className="text-white font-bold">Hold key, speak</div>
                    </div>
                  </div>

                  <div className="w-px h-4 bg-zinc-800 ml-6"></div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-zinc-500 mb-1">+1.2 seconds</div>
                      <div className="text-white font-bold">Transcribed locally</div>
                    </div>
                  </div>

                  <div className="w-px h-4 bg-zinc-800 ml-6"></div>

                  {/* Step 4 */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-zinc-500 mb-1">+1.5 seconds</div>
                      <div className="text-white font-bold">Text appears exactly where you need it</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-500">Total time</span>
                    <span className="text-2xl font-bold text-emerald-400">~2 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-white dark:bg-zinc-900 border-t border-b border-zinc-200 dark:border-zinc-800">
        <Container>
          <div className="flex items-center gap-3 mb-12">
            <Zap className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Flow Steps */}
            <div className="space-y-8">
              <FlowStep
                number="1"
                title="Hold the Hotkey"
                description="Press and hold your configured key (default: Right Option). Recording starts instantly. No click, no menu."
              />
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 ml-4"></div>
              <FlowStep
                number="2"
                title="Speak Your Mind"
                description="Talk naturally. A subtle HUD appears. Your original app stays in focus. You never leave what you were doing."
              />
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 ml-4"></div>
              <FlowStep
                number="3"
                title="Release to Transcribe"
                description="Let go of the key. On-device AI transcribes your speech in about a second. Nothing leaves your Mac."
              />
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 ml-4"></div>
              <FlowStep
                number="4"
                title="Text Appears"
                description="Your transcription is pasted directly where your cursor was, or copied to clipboard. You're already back to work."
              />
            </div>

            {/* Visual Demo */}
            <div className="bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 flex items-center justify-center min-h-[450px]">
              <div className="text-center">
                {/* Simulated HUD */}
                <div className="inline-flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3 px-6 py-3 bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    <span className="text-white text-lg font-mono font-medium">0:03.2</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[4, 7, 3, 6, 4, 8, 5, 3, 6, 4].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"
                        style={{
                          height: `${h * 4}px`,
                          animationDelay: `${i * 50}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                    <Command className="w-3 h-3 text-zinc-500" />
                    <span className="text-xs font-mono text-zinc-500">Right Option</span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider mt-2">Release to transcribe</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Use Cases */}
      <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-950">
        <Container>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Rocket className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Real World Uses</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              Ideas → Action
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Every bit of friction between thought and capture is a chance for an idea to vanish. Here are a few ways Talkie gets used in real work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide mb-2">While Coding</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed mb-2">
                "Alright, thinking out loud: first fix the auth flow, then clean up these tests, then rename this module…"
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Keep a running stream of code notes without leaving your editor.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-emerald-500 uppercase">→ Paste into TODO comment or issue</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide mb-2">Email Drafts</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed mb-2">
                "Hey Sarah, quick update on the launch. We're on track for Friday, but we need a final sign-off on pricing…"
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Dictate the rough draft, then tweak tone instead of typing from scratch.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-emerald-500 uppercase">→ Paste into your email field</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide mb-2">Meeting Notes</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed mb-2">
                "Key decisions: ship v1 as-is, move analytics to next sprint. Action items: John owns rollout, I own bug triage…"
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Capture the debrief right after the call while it's still fresh.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-emerald-500 uppercase">→ Paste into Notion, Obsidian, or your notes app</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide mb-2">Context Switching</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed mb-2">
                "Where I left off: debugging the memory leak in the worker pool, next step is to isolate the new job type…"
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Leave yourself a breadcrumb so you can drop back into deep work fast.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-emerald-500 uppercase">→ Paste into your task tracker</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <PenLine className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide mb-2">Draft a Blog Post</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed mb-2">
                "Title idea: Why I stopped writing specs by hand. Intro: I used to… now I just…"
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Talk through the messy first draft instead of staring at a blank page.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-emerald-500 uppercase">→ Paste into your editor</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide mb-2">Creative Briefs</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed mb-2">
                "Visual direction: dark background, single accent color, feels like a focused tool not a dashboard. References: Linear, Raycast…"
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Capture nuance and small details before they slip away.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-emerald-500 uppercase">→ Paste into your design doc</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28 bg-white dark:bg-zinc-900 border-t border-b border-zinc-200 dark:border-zinc-800">
        <Container>
          <div className="flex items-center gap-3 mb-12">
            <Command className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Mic}
              title="Hold-to-Talk"
              description="No buttons to click. Hold a hotkey to record, release to transcribe. Builds muscle memory in minutes."
            />
            <FeatureCard
              icon={MousePointer2}
              title="Return to Origin"
              description="Talkie remembers which app and text field you were in. Text gets pasted right back where you were working."
            />
            <FeatureCard
              icon={Timer}
              title="48-Hour Echoes"
              description="Your transcriptions are stored locally for 48 hours. Quick access to recent captures, no permanent clutter."
            />
            <FeatureCard
              icon={Eye}
              title="Minimal HUD"
              description="A subtle floating pill shows recording state. Expands on hover for details, disappears when not needed."
            />
            <FeatureCard
              icon={Clipboard}
              title="Smart Routing"
              description="Auto-paste into text fields, or copy to clipboard for non-editable contexts. Intelligently adapts."
            />
            <FeatureCard
              icon={Clock}
              title="Always Ready"
              description="Lives silently in your menu bar. No app to launch, no window to find. Ready the instant you need it."
            />
          </div>
        </Container>
      </section>

      {/* Privacy Section */}
      <section className="py-20 md:py-28 bg-zinc-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <HardDrive className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">100% Local Processing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight leading-tight mb-6">
              Your voice stays on your Mac.
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto">
              No audio leaves your computer. No cloud processing. No API keys. No cloud accounts.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Neural Engine<br/>Processing</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">48h Auto<br/>Cleanup</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Zero<br/>Telemetry</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Works<br/>Offline</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* One Product, Three Surfaces */}
      <section className="py-20 md:py-28 bg-white dark:bg-zinc-900">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              One product, three surfaces.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Dictate on Mac, capture on iPhone and Watch, and keep everything in one local-first library.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 bg-white dark:bg-zinc-950/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center">
                  <Laptop className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase">Mac</h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Dictation + workflows</span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Talk to Talkie, then turn speech into structured tasks, summaries, and output.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 bg-white dark:bg-zinc-950/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase">iPhone</h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Quick capture</span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Grab a thought in seconds, sync it to Mac, and keep moving.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 bg-white dark:bg-zinc-950/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <Watch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase">Watch</h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Hands-free moments</span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Tap once, speak once, and let the rest happen when you&apos;re back at the Mac.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/capture"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Explore on-the-go capture <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-28 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black border-t border-zinc-200 dark:border-zinc-800">
        <Container className="text-center">
          <div className="w-16 h-16 mx-auto mb-8 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
            Accelerate thoughts<br/>to action.
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg mx-auto">
            Get early access to Talkie and turn voice into action across Mac, iPhone, and Watch.
          </p>
          <a href="https://github.com/arach/usetalkie.com/releases/latest/download/Talkie.dmg" className="inline-flex h-14 px-10 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider hover:scale-105 transition-all items-center gap-3 shadow-xl shadow-emerald-500/25">
            <Download className="w-5 h-5" />
            <span>Download for Mac</span>
          </a>
          <p className="mt-8 text-xs font-mono uppercase text-zinc-400">macOS 26+ • Apple Silicon optimized • Signed & Notarized</p>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Talkie</span>
          </div>
          <div className="flex gap-8 text-[10px] font-mono uppercase text-zinc-500">
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
            <Link href="/dictation" className="hover:text-black dark:hover:text-white transition-colors">Dictation</Link>
            <Link href="/capture" className="hover:text-black dark:hover:text-white transition-colors">On The Go</Link>
            <Link href="/workflows" className="hover:text-black dark:hover:text-white transition-colors">Workflows</Link>
            <Link href="/security" className="hover:text-black dark:hover:text-white transition-colors">Security</Link>
            <Link href="/privacypolicy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-[10px] font-mono uppercase text-zinc-400">&copy; {new Date().getFullYear()} Talkie Systems Inc.</p>
        </Container>
      </footer>

      <ThemeToggle />
    </div>
  )
}
