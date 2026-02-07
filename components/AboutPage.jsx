"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Talkie</span>
          </Link>
          <a
            href="https://x.com/usetalkieapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
            </svg>
            @usetalkieapp
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 mb-16">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white dark:bg-zinc-900 p-2 shadow-lg">
              <img
                src="/arach-circle.png"
                alt="Arach Tchoupani"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
              Arach Tchoupani
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Founder & Developer
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
              15+ years in tech, from engineer to CTO. Co-founded Breathe Life (acquired 2022),
              worked at Meta on Creators. Now building voice tools that make work feel more natural.
              Based in Montreal, visits SF often.
            </p>

            {/* Links */}
            <div className="flex flex-wrap gap-2">
              <a
                href="https://x.com/arach"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
                </svg>
                @arach
              </a>
              <a
                href="https://github.com/arach"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                arach
              </a>
              <a
                href="https://linkedin.com/in/arach"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                arach
              </a>
              <a
                href="https://arach.io"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                arach.io
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">15+</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide">Years</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">4</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide">Ventures</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">1</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide">Exit</div>
          </div>
        </div>

        {/* About Talkie */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">About Talkie</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              Talkie started as a personal frustration. As someone who spends all day coding and writing,
              I found myself wishing I could just talk to my computer instead of typing everything out.
            </p>
            <p>
              So I built what I wanted: a native macOS app that lives in your menu bar, transcribes locally
              with state-of-the-art AI, and gets out of your way. No subscriptions, no cloud dependency,
              no privacy concerns. Just press a key, talk, and your words appear.
            </p>
          </div>
        </div>

        {/* Connect */}
        <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Stay Connected</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Follow Talkie for updates, tips, and behind-the-scenes development.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://x.com/usetalkieapp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
              </svg>
              Follow @usetalkieapp
            </a>
            <a
              href="mailto:hey@usetalkie.com"
              className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              hey@usetalkie.com
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Talkie. Built in Montreal.</p>
        </div>
      </footer>
    </div>
  )
}
