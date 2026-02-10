"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Laptop, Play, Check, Loader2 } from 'lucide-react'
import Container from './Container'
import VideoPlayer from './VideoPlayer'
import ThemeToggle from './ThemeToggle'
import { trackDownload } from '../lib/analytics'

export default function DemoPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleNotify = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://marketing.usetalkie.com/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'demo' }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Simple header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60">
        <Container className="h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Back</span>
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Demo</span>
          <ThemeToggle floating={false} />
        </Container>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16">
        <Container className="max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 mb-4">
              <Play className="w-3 h-3" fill="currentColor" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Product Demo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              See Talkie in Action
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Watch how Talkie transforms voice into action on your Mac.
            </p>
          </div>

          {/* Note */}
          <div className="mb-10 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 text-center max-w-md mx-auto">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">
              Still working on some proper demo videos. What's here is a placeholder for now. Want a heads up when they're ready?
            </p>
            {status === 'success' ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded text-sm text-emerald-700 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                Got it. I'll let you know.
              </div>
            ) : (
              <form className="flex gap-2 max-w-xs mx-auto" onSubmit={handleNotify}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={status === 'loading'}
                  className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {status === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Notify'}
                </button>
              </form>
            )}
          </div>

          {/* Main Promo Video */}
          <div className="mb-12">
            <VideoPlayer
              src="/videos/TalkiePromo.mp4"
              title="TalkiePromo"
              aspectRatio="square"
              autoPlay={false}
              loop={false}
              className="max-w-xl mx-auto shadow-2xl rounded-lg"
            />
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-4 font-mono uppercase tracking-wider">
              23 second overview
            </p>
          </div>

          {/* Quick Demo Video */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-6">
              Quick Demo
            </h2>
            <VideoPlayer
              src="/videos/TalkieOverview.mp4"
              title="Talkie Overview"
              aspectRatio="video"
              autoPlay={false}
              loop={false}
              className="max-w-3xl mx-auto shadow-2xl rounded-lg"
            />
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <a
              href="https://github.com/arach/usetalkie.com/releases/latest/download/Talkie.dmg"
              onClick={() => trackDownload('latest', 'demo_page')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded hover:scale-105 transition-transform shadow-lg"
            >
              <Laptop className="w-4 h-4" />
              Download for Mac
            </a>
            <p className="text-[10px] font-mono uppercase text-zinc-400">
              macOS 26+ required
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center my-16">
            <div className="w-16 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Universal Dictation</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Dictate into any app. Talkie types wherever your cursor is.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Mobile Capture</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Capture ideas on iPhone and Watch, synced to your Mac.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Private by Design</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Local transcription. Your voice never leaves your device.
              </p>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800">
        <Container className="text-center">
          <Link href="/" className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </Container>
      </footer>
    </div>
  )
}
