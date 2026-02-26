"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  LifeBuoy,
  ChevronDown,
  Send,
  Check,
  Mic,
  Keyboard,
  Download,
  RefreshCw,
  Key,
  HardDrive,
  Terminal,
  Smartphone,
  Workflow,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import Container from './Container'

const CATEGORIES = [
  { value: '', label: 'Select a category' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'account', label: 'Account Issue' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'billing', label: 'Billing' },
  { value: 'general', label: 'General' },
]

const KB_SECTIONS = [
  {
    title: 'Getting Started',
    articles: [
      {
        icon: Download,
        title: 'Installing Talkie',
        content: 'Download Talkie from the Mac App Store or install via CLI with `curl -fsSL go.usetalkie.com/install | bash`. The CLI installer downloads the app, installs the command-line tools, and launches Talkie automatically.',
      },
      {
        icon: Mic,
        title: 'Your First Dictation',
        content: 'Press the global hotkey (default: Option+D) from anywhere on your Mac to start dictating. Speak naturally — Talkie transcribes locally on your device using the Neural Engine. Press the hotkey again or click the menu bar icon to stop. Your text is copied to the clipboard automatically.',
      },
      {
        icon: Keyboard,
        title: 'Keyboard Shortcuts',
        content: 'Option+D starts/stops dictation. Option+T opens Talkie. You can customize these in Talkie Settings > Shortcuts. The global hotkey works system-wide, even when Talkie is in the background.',
      },
    ],
  },
  {
    title: 'Data & Privacy',
    articles: [
      {
        icon: HardDrive,
        title: 'Where Is My Data Stored?',
        content: 'All data lives in a local SQLite database on your Mac. If you enable iCloud sync, data is encrypted with your Apple ID keys and stored in a Private CloudKit container. Talkie Systems has zero access to your data.',
      },
      {
        icon: RefreshCw,
        title: 'Syncing Across Devices',
        content: 'Talkie uses Apple iCloud (CloudKit) to sync between your devices. Data is encrypted end-to-end with your Apple ID. Enable sync in Settings > iCloud. All synced devices must be signed into the same Apple ID.',
      },
      {
        icon: Key,
        title: 'Setting Up API Keys',
        content: 'Go to Settings > API Keys. Enter your OpenAI or Anthropic key. Keys are stored in the macOS Keychain (Secure Enclave) and only accessed at runtime. Talkie never sends your keys to our servers.',
      },
    ],
  },
  {
    title: 'Advanced',
    articles: [
      {
        icon: Terminal,
        title: 'Using the CLI',
        content: 'The Talkie CLI lets you capture and transcribe from the terminal. Run `talkie capture` to record, `talkie list` to see recent captures, and `talkie transcribe` to process audio files. Run `talkie --help` for all commands.',
      },
      {
        icon: Workflow,
        title: 'Workflows & Automation',
        content: 'Workflows let you chain AI actions on your transcriptions — summarize, extract action items, translate, or send to external services. Create workflows in Settings > Workflows or use the built-in templates.',
      },
      {
        icon: Smartphone,
        title: 'Mobile Capture',
        content: 'Use Talkie for iOS to capture voice memos on the go. Recordings sync to your Mac via iCloud where they are transcribed locally. The mobile app is a lightweight capture tool — all AI processing happens on your Mac.',
      },
    ],
  },
  {
    title: 'Troubleshooting',
    articles: [
      {
        icon: Mic,
        title: 'Microphone Not Working',
        content: 'Go to System Settings > Privacy & Security > Microphone and ensure Talkie is enabled. If the hotkey doesn\'t trigger recording, check System Settings > Privacy & Security > Accessibility. Restart Talkie after granting permissions.',
      },
      {
        icon: RefreshCw,
        title: 'Sync Issues',
        content: 'Ensure all devices are on the same Apple ID with iCloud Drive enabled. Check Settings > iCloud in Talkie to confirm sync is active. If data isn\'t appearing, try toggling sync off and on. Large recordings may take a few minutes to sync.',
      },
      {
        icon: AlertCircle,
        title: 'App Won\'t Launch or Crashes',
        content: 'Try deleting and reinstalling from the App Store. If using the CLI version, run `talkie doctor` to diagnose issues. Check Console.app for crash logs. Talkie requires macOS 14 (Sonoma) or later.',
      },
    ],
  },
]

function KBArticle({ icon: Icon, title, content }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
          <Icon className="w-4 h-4" />
        </div>
        <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-white">
          {title}
        </span>
        <ChevronRight
          className={`w-4 h-4 text-zinc-400 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-15">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {content}
          </p>
        </div>
      )}
    </div>
  )
}

export default function SupportPage() {
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.usetalkie.com/api'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const em = email.trim()
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (!category) {
      setErrorMsg('Please select a category.')
      return
    }
    if (!message.trim()) {
      setErrorMsg('Please describe your issue.')
      return
    }

    setErrorMsg('')
    setStatus('sending')

    try {
      const res = await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback: message.trim(),
          email: em,
          url: window.location.href,
          userAgent: navigator.userAgent,
          category,
          source: 'support',
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Could not reach the server. Please try again later.')
    }
  }

  const resetForm = () => {
    setEmail('')
    setCategory('')
    setMessage('')
    setStatus('idle')
    setErrorMsg('')
  }

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

          <div className="flex items-center gap-2 sm:gap-3">
            <LifeBuoy className="w-3.5 h-3.5 text-emerald-500" />
            <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700"></div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">SUPPORT</span>
          </div>
        </Container>
      </nav>

      <main className="pt-32 pb-32 px-6">
        <div className="mx-auto max-w-4xl">

          {/* Hero */}
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase mb-6 leading-[0.9]">
              How can we help?
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl border-l-2 border-emerald-500 pl-6">
              Browse common topics below or send us a message. We typically respond within 24 hours.
            </p>
          </div>

          {/* Knowledge Base */}
          <section className="mb-24">
            <div className="space-y-10">
              {KB_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
                    {section.title}
                  </h2>
                  <div className="space-y-px">
                    {section.articles.map((article) => (
                      <KBArticle
                        key={article.title}
                        icon={article.icon}
                        title={article.title}
                        content={article.content}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-16">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              Still need help?
            </span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Contact Form */}
          <section className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden">
              {/* Form Header */}
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Contact Support
                  </span>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                  Send a Message
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  We&apos;ll get back to you via email.
                </p>
              </div>

              {status === 'success' ? (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      Message Sent
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    Thanks for reaching out. We&apos;ll respond to <strong className="text-zinc-900 dark:text-white">{email}</strong> as soon as possible.
                  </p>
                  <button
                    onClick={resetForm}
                    className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white appearance-none focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      {CATEGORIES.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-[38px] w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your issue or question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Error */}
                  {errorMsg && (
                    <p className="text-xs text-red-500">{errorMsg}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Footer links */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Documentation <ExternalLink className="w-3 h-3" />
              </Link>
              <Link
                href="/security"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Security <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
