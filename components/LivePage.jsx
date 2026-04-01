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
  Terminal,
  Copy,
  Check,
} from 'lucide-react'
import Container from './Container'
import ThemeToggle from './ThemeToggle'
import SubNav from './SubNav'
import VideoPlayer from './VideoPlayer'
import DemoViewer from './DemoViewer'
import HubDiagram from './HubDiagram'
import DownloadModal from './DownloadModal'

// Demo sections data
const DEMO_SECTIONS = [
  {
    id: 'dictate',
    title: 'Dictate',
    description: 'Voice to text in any app',
    videos: [
      { id: 'hold-to-talk', title: 'Hold-to-Talk', src: '/videos/TalkieHoldToTalk.mp4' },
      { id: 'return-to-origin', title: 'Return to Origin', src: '/videos/TalkieReturnToOrigin.mp4' },
      { id: 'smart-routing', title: 'Smart Routing', src: '/videos/TalkieSmartRouting.mp4' },
      { id: 'dictation', title: 'Use Cases', src: '/videos/TalkieDictation.mp4' },
    ],
  },
  {
    id: 'orchestrate',
    title: 'Orchestrate',
    description: 'Workflows & automation',
    videos: [
      { id: 'workflow-file', title: 'Voice → File', src: '/videos/TalkieWorkflowFile.mp4' },
      { id: 'workflow-shell', title: 'Voice → Shell', src: '/videos/TalkieWorkflowShell.mp4' },
      { id: 'workflow-agent', title: 'Voice → Agent', src: '/videos/TalkieWorkflowAgent.mp4' },
      { id: 'workflow-editor', title: 'Pipeline Editor', src: '/videos/TalkieWorkflowEditor.mp4' },
    ],
  },
  {
    id: 'manage',
    title: 'Manage',
    description: 'Library & search',
    videos: [
      { id: 'echoes', title: 'Echoes', src: '/videos/TalkieEchoes.mp4' },
      { id: 'search', title: 'Search', src: '/videos/TalkieSearch.mp4' },
      { id: 'export', title: 'Export', src: '/videos/TalkieExport.mp4' },
    ],
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

const CLI_INSTALL_CMD = 'curl -fsSL go.usetalkie.com/install | bash'

export default function LivePage() {
  const [scrolled, setScrolled] = useState(false)
  const [hubSectionHovered, setHubSectionHovered] = useState(false)
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)
  const [cliCopied, setCliCopied] = useState(false)

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
      <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <div className="absolute inset-0 z-0 bg-grid-fade pointer-events-none opacity-40" />
        <div className="bg-glow-emerald top-[-200px] left-1/2 -translate-x-1/2 z-0" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="mx-auto mb-4 inline-flex items-center rounded-full border border-emerald-500/20 bg-white/80 px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
              Built for daily Mac work
            </p>
            <h1 className="text-5xl md:text-7xl tracking-tighter text-zinc-900 dark:text-white leading-[0.95] mb-6">
              Talk to your <span className="font-display italic bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Mac.</span>
            </h1>

            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto mb-8">
              Capture a thought, shape a draft, search what you said, or kick off a workflow without leaving the app in front of you.
            </p>

            <p className="mb-8 text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-emerald-600 dark:text-zinc-300">
              A mic is all you need.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setDownloadModalOpen(true)} className="h-12 px-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/25">
                <Download className="w-4 h-4" />
                <span>Download for Mac</span>
              </button>
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
              <span className="font-display italic">One voice layer.</span> <span className="font-bold">Right on your Mac.</span>
            </h2>
            <p className="text-zinc-500 leading-relaxed max-w-xl mx-auto">
              Draft, search, route, and trigger follow-up work from the machine where you already spend your day.
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
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">Why It Works</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-6">
              Speak once.<br /><span className="text-emerald-500">Keep moving.</span>
            </h2>

            <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Talkie is useful because it lives close to the work. You talk, your Mac keeps going.
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
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Stay in Flow</h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Speak without opening another app or losing your place. The capture stays attached to the work already on screen.
              </p>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-500">Context Preserved</p>
            </div>

            {/* Ecosystem */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Continuity</h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Capture on iPhone or Watch, then continue on Mac with search, cleanup, workflows, and CLI access ready when you need them.
              </p>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-500">Capture → Recover → Action</p>
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
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">Continuity</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6 leading-tight">
                Your Mac already runs<br/>
                <span className="text-emerald-400">your day.</span>
              </h2>
              <div className="space-y-6 text-zinc-400 leading-relaxed">
                <p>
                  Talkie fits that reality instead of fighting it.
                </p>
                <p>
                  It is not just dictation. It is a way to drive drafts, search, workflows, and follow-up work with your voice.
                </p>
                <p>
                  Then, if something occurs away from your desk, iPhone and Watch feed the same thread back into your Mac.
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
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">Ownership Stays Legible</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight leading-tight mb-6">
                Keep the full chain on your side.
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto">
                Your library lives locally, sync can run through iCloud, transcription can stay on device, and external providers are optional with your own keys.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Local SQLite<br/>Library</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">iCloud / CloudKit<br/>Sync</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">On-device<br/>Transcription</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">BYO Providers<br/>and Keys</p>
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
              One product. Three ways in.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Mac is the main event. iPhone and Watch make sure a good thought still lands where it counts.
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
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Action surface</span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Search, clean up, transform, and route captured speech into useful work.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 bg-white dark:bg-zinc-950/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase">iPhone</h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Capture surface</span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Catch ideas away from the desk and send them back to the Mac you already use.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 bg-white dark:bg-zinc-950/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <Watch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase">Watch</h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Lightweight capture</span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                The quickest way to save a thought without stopping what you&apos;re doing.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/mobile"
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
            Talk to your Mac.
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg mx-auto">
            A mic is all you need.
          </p>
          <button onClick={() => setDownloadModalOpen(true)} className="inline-flex h-14 px-10 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider hover:scale-105 transition-all items-center gap-3 shadow-xl shadow-emerald-500/25">
            <Download className="w-5 h-5" />
            <span>Download for Mac</span>
          </button>

          {/* CLI install alternative */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">or via terminal</span>
              <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(CLI_INSTALL_CMD)
                setCliCopied(true)
                setTimeout(() => setCliCopied(false), 2000)
              }}
              className="group w-full flex items-center justify-between gap-3 bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 hover:border-zinc-700 transition-colors cursor-pointer"
              title="Click to copy"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 overflow-hidden">
                <Terminal className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-500 select-none">&gt;</span>
                <span className="text-emerald-400 truncate">{CLI_INSTALL_CMD}</span>
              </div>
              {cliCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0 transition-colors" />
              )}
            </button>
          </div>

          <p className="mt-6 text-xs font-mono uppercase text-zinc-400">macOS 26+ • Apple Silicon optimized • Signed & Notarized</p>
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
            <Link href="/mac" className="hover:text-black dark:hover:text-white transition-colors">Mac</Link>
            <Link href="/mobile" className="hover:text-black dark:hover:text-white transition-colors">Mobile</Link>
            <Link href="/agents" className="hover:text-black dark:hover:text-white transition-colors">Agents</Link>
            <Link href="/docs" className="hover:text-black dark:hover:text-white transition-colors">Docs</Link>
            <Link href="/security" className="hover:text-black dark:hover:text-white transition-colors">Security</Link>
            <Link href="/support" className="hover:text-black dark:hover:text-white transition-colors">Support</Link>
            <Link href="/privacypolicy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-[10px] font-mono uppercase text-zinc-400">&copy; {new Date().getFullYear()} Talkie Systems Inc.</p>
        </Container>
      </footer>

      <ThemeToggle />

      {/* Download Modal */}
      <DownloadModal isOpen={downloadModalOpen} onClose={() => setDownloadModalOpen(false)} />
    </div>
  )
}
