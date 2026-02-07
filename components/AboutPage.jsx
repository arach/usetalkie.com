"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black font-mono">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-100/80 dark:bg-black/80 border-b border-zinc-300 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>TALKIE</span>
          </Link>
          <a
            href="https://x.com/usetalkieapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
            </svg>
            @usetalkieapp
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Tactical Card */}
        <div className="relative bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
          {/* Corner Crosses */}
          <div className="absolute top-4 left-4 w-8 h-8">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-300 dark:bg-zinc-700 -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 w-[2px] h-full bg-zinc-300 dark:bg-zinc-700 -translate-x-1/2"></div>
          </div>
          <div className="absolute top-4 right-4 w-8 h-8">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-300 dark:bg-zinc-700 -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 w-[2px] h-full bg-zinc-300 dark:bg-zinc-700 -translate-x-1/2"></div>
          </div>
          <div className="absolute bottom-4 left-4 w-8 h-8">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-300 dark:bg-zinc-700 -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 w-[2px] h-full bg-zinc-300 dark:bg-zinc-700 -translate-x-1/2"></div>
          </div>
          <div className="absolute bottom-4 right-4 w-8 h-8">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-300 dark:bg-zinc-700 -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 w-[2px] h-full bg-zinc-300 dark:bg-zinc-700 -translate-x-1/2"></div>
          </div>

          {/* Tactical Header */}
          <div className="px-8 py-3 flex justify-between text-[10px] text-zinc-400 dark:text-zinc-600 tracking-widest border-b border-zinc-200 dark:border-zinc-800">
            <span>SECTOR: VOICE_OPS | GRID: 45.5017°N, 73.5673°W | AUTH: VERIFIED</span>
            <span>CLEARANCE: FOUNDER</span>
          </div>

          {/* Main Content */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-10 md:gap-16">
            {/* Left - Identity */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Callsign */}
              <div className="text-xs text-emerald-600 dark:text-emerald-400 tracking-[0.2em] mb-2">
                CALLSIGN: PERSIAN_EAGLE
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                ARACH_TCHOUPANI
              </h1>

              {/* Unit */}
              <div className="text-[11px] text-zinc-500 dark:text-zinc-500 tracking-wider mb-8">
                UNIT: ENGINEERING_CORPS | SPECIALIZATION: VOICE_TECH
              </div>

              {/* Mission Parameters */}
              <div className="border border-emerald-500/30 bg-emerald-500/5 p-4 mb-6">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wider mb-3">
                  ◆ MISSION PARAMETERS
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">OBJECTIVE:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">BUILD_VOICE_TOOLS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PRIORITY:</span>
                    <span className="text-amber-500">CRITICAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">STATUS:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Systems Status */}
              <div className="border border-emerald-500/30 bg-emerald-500/5 p-4 mb-6">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wider mb-3">
                  ◆ SYSTEMS STATUS
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-zinc-500 w-16">AI/ML:</span>
                    <div className="flex-1 h-2 bg-emerald-500/20 border border-emerald-500/30 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[88%]"></div>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 w-20 text-right">WHISPER</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-zinc-500 w-16">STACK:</span>
                    <div className="flex-1 h-2 bg-emerald-500/20 border border-emerald-500/30 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full"></div>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 w-20 text-right">SWIFT_NATIVE</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-zinc-500 w-16">PRODUCT:</span>
                    <div className="flex-1 h-2 bg-emerald-500/20 border border-emerald-500/30 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[94%]"></div>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 w-20 text-right">SHIPPING</span>
                  </div>
                </div>
              </div>

              {/* Command Interface */}
              <div className="flex items-center gap-3 p-4 bg-zinc-100 dark:bg-zinc-900 border-l-4 border-emerald-500">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 tracking-wider">[CONNECT] ► USETALKIE.COM</span>
              </div>
            </div>

            {/* Right - Polaroid */}
            <div className="flex-shrink-0 flex justify-center md:justify-end">
              <div className="bg-white p-3 shadow-2xl w-72">
                <img
                  src="/arach-circle.png"
                  alt="Arach Tchoupani"
                  className="w-full aspect-square object-cover"
                />
                <div className="pt-4 pb-2 px-1">
                  {/* Spec Header */}
                  <div className="flex justify-between items-center border-b border-zinc-200 pb-2 mb-3">
                    <span className="text-[11px] font-bold text-zinc-800 tracking-wide">ARACH_TCHOUPANI</span>
                    <span className="text-[9px] text-zinc-400 tracking-widest">CLASS_FOUNDER</span>
                  </div>
                  {/* Spec Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">TYPE:</span>
                      <span className="text-zinc-700 font-medium">FOUNDER</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">STACK:</span>
                      <span className="text-zinc-700 font-medium">FULL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">AI/ML:</span>
                      <span className="text-zinc-700 font-medium">WHISPER</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">EST:</span>
                      <span className="text-zinc-700 font-medium">2010</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">LOC:</span>
                      <span className="text-zinc-700 font-medium">MTL_SF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">STATUS:</span>
                      <span className="text-zinc-700 font-medium">SHIPPING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-12 max-w-3xl">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 tracking-wide">BIO</h2>
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              15+ years in tech leadership, from Software Engineer to CTO. Led engineering for 4 venture-backed companies in NY and Montreal.
            </p>
            <p>
              Co-founded Breathe Life in 2018 (acquired by Zinnia in 2022). Worked at Meta on Creators initiatives and the blue app.
            </p>
            <p>
              Now building voice tools that make work feel more natural. Based in Montreal, visits SF often.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 tracking-widest mb-2">YEARS_IN_FIELD</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">15+</div>
            </div>
            <div className="border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 tracking-widest mb-2">VENTURES_LED</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">4</div>
            </div>
            <div className="border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 tracking-widest mb-2">EXIT_STATUS</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">ACQ</div>
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 tracking-wide">CONNECT</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://x.com/arach"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
              </svg>
              @arach
            </a>
            <a
              href="https://github.com/arach"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              arach
            </a>
            <a
              href="https://linkedin.com/in/arach"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              arach
            </a>
            <a
              href="https://arach.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              arach.io
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4 text-center text-[10px] text-zinc-500 tracking-widest">
          <p>&copy; {new Date().getFullYear()} TALKIE. BUILT_IN_MONTREAL.</p>
        </div>
      </footer>
    </div>
  )
}
