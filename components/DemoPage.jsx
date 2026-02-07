"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Laptop, Play } from 'lucide-react'
import Container from './Container'
import VideoPlayer from './VideoPlayer'
import ThemeToggle from './ThemeToggle'
import { trackDownload } from '../lib/analytics'

export default function DemoPage() {
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
