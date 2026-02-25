"use client"
import React, { useState } from 'react'
import { Download, CheckCircle2, Laptop, Copy, Check, Terminal } from 'lucide-react'
import Link from 'next/link'

const GITHUB_DMG_URL = 'https://github.com/arach/usetalkie.com/releases/latest/download/Talkie.dmg'
const CLI_INSTALL_CMD = 'curl -fsSL go.usetalkie.com/install | bash'

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [cliCopied, setCliCopied] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    window.location.href = GITHUB_DMG_URL
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(GITHUB_DMG_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCliCopy = async () => {
    try {
      await navigator.clipboard.writeText(CLI_INSTALL_CMD)
      setCliCopied(true)
      setTimeout(() => setCliCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans flex items-center justify-center p-6">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-fade pointer-events-none opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-xl w-full">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/talkie-icon.png"
              alt="Talkie"
              className="h-12 w-12 rounded-lg transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-bold tracking-tight font-mono uppercase">
              Talkie
            </span>
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-sm shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
              <Download className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
              Get Talkie
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Voice to action for Mac
            </p>
          </div>

          {/* Download button */}
          <div className="p-8 space-y-6">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-4 px-6 text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <span>{downloading ? 'Downloading...' : 'Download Talkie for Mac'}</span>
            </button>

            {/* Download URL */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Direct Download Link
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={GITHUB_DMG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3 transition-colors overflow-hidden"
                  title={GITHUB_DMG_URL}
                >
                  <span className="block truncate">
                    github.com/arach/usetalkie.com/releases/.../Talkie.dmg
                  </span>
                </a>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 h-[42px] w-[42px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  title="Copy download link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  )}
                </button>
              </div>
            </div>

            {/* CLI Install */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Or install via terminal
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded p-3 font-mono text-xs text-emerald-400 overflow-hidden">
                  <span className="text-zinc-500 select-none">&gt; </span>
                  <span className="select-all">{CLI_INSTALL_CMD}</span>
                </div>
                <button
                  onClick={handleCliCopy}
                  className="flex-shrink-0 h-[42px] w-[42px] flex items-center justify-center bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded hover:bg-zinc-800 dark:hover:bg-zinc-900 transition-colors"
                  title="Copy install command"
                >
                  {cliCopied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 mt-2">
                Installs the CLI, downloads the app, and launches it.
              </p>
            </div>

            {/* System requirements */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <Laptop className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono">macOS 26+ (Tahoe) • Apple Silicon</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono">Signed & Notarized by Apple</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono uppercase text-zinc-500">
          <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Documentation
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <Link href="/security" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Security
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <Link href="/philosophy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Philosophy
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <a href="mailto:hello@usetalkie.com" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Support
          </a>
        </div>

        {/* Privacy note */}
        <div className="mt-6 text-center">
          <p className="text-[10px] font-mono uppercase text-zinc-400 max-w-md mx-auto">
            Your data stays yours • Local-first • Private by default
          </p>
        </div>

      </div>
    </div>
  )
}
