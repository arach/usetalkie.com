"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Github, Linkedin, Mail, MapPin, Building2, Sparkles } from 'lucide-react'

const ConsoleHeader = ({ label, green }) => (
  <div className="mb-6 select-none">
    <h2 className={`text-xs font-mono font-bold uppercase transition-colors ${green ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-500'}`}>&gt; {label}</h2>
    <div className={`w-full border-b mt-2 transition-colors ${green ? 'border-emerald-500/30' : 'border-zinc-300 dark:border-zinc-700 group-hover:border-emerald-500/30'}`}></div>
  </div>
)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            BACK
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700"></div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">ABOUT</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-24 px-6">
        <article className="mx-auto max-w-3xl">

          {/* THE STORY */}
          <div className="mb-12 group">
            <ConsoleHeader label="THE STORY" />

            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight uppercase mb-4">
              You don't get the full value of AI unless you can communicate at high velocity.
            </h1>

            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Typing is a bottleneck. The faster you can get ideas out of your head and into your tools,
                the more you can leverage AI to amplify your work. Voice is the unlock.
              </p>
              <p>
                I was a power user of early voice tools like SuperWhisper and Whisper Flow — they were great
                and opened my eyes to what was possible. But none of them treated developers as first-class
                citizens. So I built Talkie for engineers and tech-forward people who want control: open data,
                everything is a file, fully pluggable and hookable. Your data. We want you to tinker.
              </p>
              <p>
                A native macOS app that lives in your menu bar, transcribes locally with state-of-the-art AI,
                and gets out of your way. No subscriptions, no cloud dependency. Just press a key, talk, and
                your words appear wherever you're typing.
              </p>
              <p>
                Dictation is just the beginning. When you take voice-first workflows seriously, a whole surface
                opens up: memory, analysis, automation, context. That's where Talkie is headed.
              </p>
            </div>
          </div>

          {/* THE FOUNDER */}
          <div className="mb-12 group">
            <ConsoleHeader label="THE FOUNDER" />

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile photo */}
                <img
                  src="/arach-circle.png"
                  alt="Arach Tchoupani"
                  className="w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-0.5">
                    Arach Tchoupani
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    Founder & Developer
                  </p>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    15+ years in tech, from software engineer to CTO. Previously co-founded
                    Breathe Life (acquired 2022), worked at Meta on Creators and Facebook.
                    Now focused on AI-powered tools that make work feel more natural.
                    Based in Montreal, visits SF often.
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>4 ventures, 1 exit</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Montreal / SF</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI/ML enthusiast</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://x.com/arach"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      @arach
                    </a>
                    <a
                      href="https://github.com/arach"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      arach
                    </a>
                    <a
                      href="https://linkedin.com/in/arach"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      arach
                    </a>
                    <a
                      href="https://arach.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      arach.io
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONNECT */}
          <div className="group">
            <ConsoleHeader label="CONNECT" green />

            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Follow Talkie for updates, tips, and behind-the-scenes development.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://x.com/usetalkieapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Follow @usetalkieapp
              </a>
              <a
                href="mailto:hey@usetalkie.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 rounded text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <Mail className="w-4 h-4" />
                hey@usetalkie.com
              </a>
            </div>
          </div>

        </article>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 text-center text-[10px] font-mono uppercase text-zinc-400">
          <p>&copy; {new Date().getFullYear()} Talkie Systems Inc.</p>
        </div>
      </footer>
    </div>
  )
}
