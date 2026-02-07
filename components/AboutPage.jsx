"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Github, Linkedin, Twitter, Mail, MapPin, Building2, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Talkie</span>
          </Link>
          <a
            href="https://x.com/usetalkieapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            @usetalkieapp
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            About Talkie
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Voice-first productivity, built by someone who believes talking is faster than typing.
          </p>
        </div>

        {/* Product Story */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">The Story</h2>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Talkie started as a personal frustration. As someone who spends all day coding and writing,
              I found myself wishing I could just <em>talk</em> to my computer instead of typing everything out.
              Existing voice tools were clunky, required internet, or didn't integrate well with my workflow.
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
              So I built what I wanted: a native macOS app that lives in your menu bar, transcribes locally
              with state-of-the-art AI, and gets out of your way. No subscriptions, no cloud dependency,
              no privacy concerns. Just press a key, talk, and your words appear wherever you're typing.
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Meet the Founder</h2>

          <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar placeholder */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl md:text-5xl font-bold text-white">A</span>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  Arach Tchoupani
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Founder & Developer
                </p>

                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  15+ years in tech, from software engineer to CTO. Previously co-founded
                  Breathe Life (acquired 2022), worked at Meta on Creators and Facebook.
                  Now focused on AI-powered tools that make work feel more natural.
                  Based in the SF Bay Area.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Building2 className="w-4 h-4" />
                    <span>4 ventures, 1 exit</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4" />
                    <span>SF Bay Area</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Sparkles className="w-4 h-4" />
                    <span>AI/ML enthusiast</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://x.com/araborni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    @araborni
                  </a>
                  <a
                    href="https://github.com/arach"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    arach
                  </a>
                  <a
                    href="https://linkedin.com/in/arach"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    arach
                  </a>
                  <a
                    href="https://arach.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    arach.io
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Stay Connected</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto">
            Follow Talkie for updates, tips, and behind-the-scenes development.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://x.com/usetalkieapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              <Twitter className="w-5 h-5" />
              Follow @usetalkieapp
            </a>
            <a
              href="mailto:hey@usetalkie.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Mail className="w-5 h-5" />
              hey@usetalkie.com
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Talkie. Built with care in San Francisco.</p>
        </div>
      </footer>
    </div>
  )
}
