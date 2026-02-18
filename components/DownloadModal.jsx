"use client"
import React, { useState, useRef } from 'react'
import { X, ChevronDown, Download } from 'lucide-react'
import { trackSignup, getStoredUTMParams } from '../lib/analytics'

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
  const formLoadTime = useRef(Date.now())

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.usetalkie.com/api'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const em = email.trim()

    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setErrorMsg('Please enter a valid email')
      return
    }

    // Honeypot check - silently succeed and redirect
    if (trap) {
      setStatus('success')
      window.location.href = '/dl?ref=modal'
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

        // Redirect to download page
        window.location.href = '/dl?ref=modal'
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  const resetForm = () => {
    setEmail('')
    setReferralSource('')
    setUseCase('')
    setStatus('idle')
    setErrorMsg('')
    setTrap('')
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
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

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
      </div>
    </div>
  )
}
