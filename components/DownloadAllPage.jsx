"use client"
import React, { useState } from 'react'
import { Download, Terminal, Laptop, CheckCircle2, Smartphone, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { trackDownload, trackAppStoreClick } from '../lib/analytics'
import PackageManagerTabs from './PackageManagerTabs'

const GITHUB_DMG_URL = 'https://github.com/arach/usetalkie.com/releases/latest/download/Talkie.dmg'
const CLI_INSTALL_CMD = 'curl -fsSL go.usetalkie.com/install | bash'
const CLI_ONLY_CMD = 'bun add -g @talkie/cli'
const APP_STORE_URL = 'https://apps.apple.com/us/app/talkie-mobile/id6755734109'

function CopyableCommand({ command, label, id, copiedCmd, onCopy }) {
  return (
    <button
      onClick={() => onCopy(command, id)}
      className="group w-full bg-zinc-950 border border-zinc-700 dark:border-zinc-700 rounded-lg p-3 font-mono text-sm text-emerald-400 whitespace-nowrap overflow-x-auto text-left transition-colors hover:border-emerald-500/60 cursor-pointer shadow-inner"
      title="Click to copy"
    >
      <span className="text-emerald-500 font-bold select-none">&gt; </span>
      <span className="text-zinc-100">{command}</span>
      <span className="float-right text-[10px] font-sans uppercase tracking-wider text-zinc-500 group-hover:text-emerald-400 transition-colors ml-4">
        {copiedCmd === id ? '✓ copied' : 'copy'}
      </span>
    </button>
  )
}

export default function DownloadAllPage() {
  const [downloading, setDownloading] = useState(false)
  const [copiedCmd, setCopiedCmd] = useState(null)

  const handleDownload = () => {
    setDownloading(true)
    trackDownload('latest', 'download_page')
  }

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCmd(id)
      setTimeout(() => setCopiedCmd(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleAppStoreClick = () => {
    trackAppStoreClick('download_page')
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-grid-fade pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-5xl w-full">

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

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Mac */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="border-b border-zinc-100 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950/50 p-6 text-center">
              <Laptop className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold uppercase tracking-tight">Mac</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                macOS 26+ • Apple Silicon
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Terminal install — primary */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Install via terminal
                  </p>
                </div>
                <PackageManagerTabs />
                <p className="text-[10px] font-mono text-zinc-400 mt-1.5">
                  Installs the app, CLI, and launches Talkie.
                </p>
              </div>

              {/* DMG download — secondary */}
              <a
                href={GITHUB_DMG_URL}
                onClick={handleDownload}
                className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 py-3 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] border border-zinc-200 dark:border-zinc-700"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Downloading...' : 'Download DMG'}</span>
              </a>

              {/* curl — alternative */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Or via curl
                  </p>
                </div>
                <CopyableCommand
                  command={CLI_INSTALL_CMD}
                  label="One-liner"
                  id="curl"
                  copiedCmd={copiedCmd}
                  onCopy={handleCopy}
                />
              </div>

              {/* Trust badges + CLI-only link */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-mono uppercase text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Signed & Notarized</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Local-first</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(CLI_ONLY_CMD, 'cli')}
                  className="text-[10px] font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  title="Copy CLI-only install command"
                >
                  {copiedCmd === 'cli' ? '✓ copied' : 'CLI only →'}
                </button>
              </div>
            </div>
          </div>

          {/* iPhone */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="border-b border-zinc-100 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950/50 p-6 text-center">
              <Smartphone className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold uppercase tracking-tight">iPhone</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                iOS 18+
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* App Store link */}
              <a
                href={APP_STORE_URL}
                onClick={handleAppStoreClick}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-3 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>App Store</span>
              </a>

              {/* QR code */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                  Or scan with your phone
                </p>
                <div className="flex justify-center">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <img
                      src="/qr-app-store.svg"
                      alt="QR code to download Talkie on the App Store"
                      className="w-40 h-40"
                    />
                  </div>
                </div>
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

        <div className="mt-6 text-center">
          <p className="text-[10px] font-mono uppercase text-zinc-400 max-w-md mx-auto">
            Your data stays yours • Local-first • Private by default
          </p>
        </div>

      </div>
    </div>
  )
}
