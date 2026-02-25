"use client"
import React, { useState, useRef } from 'react'
import { X, ChevronDown, Download, Terminal, Copy, Check, ArrowRight } from 'lucide-react'
import { trackSignup, getStoredUTMParams } from '../lib/analytics'

const CLI_INSTALL_CMD = 'curl -fsSL go.usetalkie.com/install | bash'

const REFERRAL_SOURCES = [
  { value: '', label: 'How did you hear about us?' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'search', label: 'Search engine' },
  { value: 'friend', label: 'Friend or colleague' },
  { value: 'blog', label: 'Blog or article' },
  { value: 'other', label: 'Other' },
]

const USE_CASES = [
  { value: '', label: 'What will you use Talkie for?' },
  { value: 'dictation', label: 'Dictation & writing' },
  { value: 'notes', label: 'Voice memos & notes' },
  { value: 'workflows', label: 'Automating workflows' },
  { value: 'coding', label: 'Coding & development' },
  { value: 'other', label: 'Something else' },
]

export default function DownloadModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [referralSource, setReferralSource] = useState('')
  const [useCase, setUseCase] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [trap, setTrap] = useState('') // honeypot
  const [cliCopied, setCliCopied] = useState(false)
  const formLoadTime = useRef(Date.now())

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.usetalkie.com/api'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const em = email.trim()

    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setErrorMsg('Please enter a valid email')
      return
    }

    // Honeypot check - silently succeed
    if (trap) {
      setStatus('success')
      return
    }

    setErrorMsg('')
    setStatus('sending')

    try {
      const res = await fetch(`${apiUrl}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: em,
          useCase: useCase || 'not_specified',
          referralSource: referralSource || 'not_specified',
          honeypot: trap,
          formLoadTime: formLoadTime.current,
          utm: getStoredUTMParams(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        trackSignup(useCase || 'not_specified', referralSource || 'not_specified', 'download-modal')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      // API unreachable — still show success so user can download
      setStatus('success')
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

  const resetForm = () => {
    setEmail('')
    setReferralSource('')
    setUseCase('')
    setStatus('idle')
    setErrorMsg('')
    setTrap('')
    setCliCopied(false)
    formLoadTime.current = Date.now()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm shadow-2xl max-w-md w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <>
            {/* Success Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  You're in
                </span>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                Welcome to Talkie
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Here's how to get started.
              </p>
            </div>

            {/* Success Content */}
            <div className="p-6 space-y-5">
              {/* CLI Install */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Quick install
                  </p>
                </div>
                <button
                  onClick={handleCliCopy}
                  className="group w-full flex items-center justify-between gap-3 bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded px-3 py-3 hover:border-zinc-700 transition-colors cursor-pointer"
                  title="Click to copy"
                >
                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 overflow-hidden">
                    <span className="text-zinc-500 select-none">&gt;</span>
                    <span className="text-emerald-400 truncate">{CLI_INSTALL_CMD}</span>
                  </div>
                  {cliCopied ? (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0 transition-colors" />
                  )}
                </button>
                <p className="text-[10px] font-mono text-zinc-400 mt-1.5">
                  Installs the CLI, downloads the app, and launches it.
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">or</span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Download page link */}
              <a
                href="/dl?ref=modal"
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download the DMG
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Early Access
                </span>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                Get Talkie for Mac
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                We'll keep track of your email — early testers get launch discounts.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="enter@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* How did you hear about us */}
              <div className="relative">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  How did you hear about us?
                </label>
                <select
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white appearance-none focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  {REFERRAL_SOURCES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-[38px] w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* Use case */}
              <div className="relative">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  What will you use it for?
                </label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white appearance-none focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  {USE_CASES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-[38px] w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* Honeypot - hidden from users */}
              <input
                type="text"
                tabIndex="-1"
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                className="absolute -left-[9999px]"
                aria-hidden="true"
              />

              {/* Error message */}
              {errorMsg && (
                <p className="text-xs text-red-500">{errorMsg}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  'Submitting...'
                ) : (
                  'Continue'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
