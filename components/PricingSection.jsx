"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Check, Clock, ChevronDown } from 'lucide-react'
import { trackSignup, getStoredUTMParams } from '../lib/analytics'

const USE_CASES = [
  { value: '', label: 'What will you use Talkie for?' },
  { value: 'dictation', label: 'Dictation & writing' },
  { value: 'notes', label: 'Voice memos & notes' },
  { value: 'workflows', label: 'Automating workflows' },
  { value: 'coding', label: 'Coding & development' },
  { value: 'other', label: 'Something else' },
]

export default function PricingSection() {
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [trap, setTrap] = useState('') // honeypot
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const formLoadTime = useRef(Date.now())

  // Countdown to end of January 2026
  useEffect(() => {
    const launchDate = new Date('2026-03-21T23:59:59')

    const updateCountdown = () => {
      const now = new Date()
      const diff = launchDate - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // API endpoint - api.usetalkie.com
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.usetalkie.com/api'
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    const em = email.trim()
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setErrorMsg('Please enter a valid email')
      return
    }

    // Honeypot check - silently succeed
    if (trap) {
      setStatus('success')
      setIsSubmitted(true)
      return
    }

    setErrorMsg('')
    setStatus('sending')

    try {
      // Try the marketing API (deployed to api.usetalkie.com)
      const res = await fetch(`${apiUrl}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: em,
          useCase: useCase || 'not_specified',
          honeypot: trap,
          formLoadTime: formLoadTime.current,
          utm: getStoredUTMParams(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setIsSubmitted(true)
        setEmail('')
        setUseCase('')
        trackSignup(useCase || 'not_specified', 'general', 'pricing')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <section id="pricing" className="py-24 bg-zinc-50 dark:bg-black relative">
      <div className="absolute inset-0 bg-tactical-grid dark:bg-tactical-grid-dark bg-[size:40px_40px] opacity-50 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 rounded-sm shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left: Value Prop */}
            <div className="group/value">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse transition-transform group-hover/value:scale-150"></div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Launch Access</span>
              </div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight uppercase transition-transform origin-left group-hover/value:scale-[1.02]">
                You own <br/> the tool.
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                No subscription. Buy once. Your recordings, your workflows, your devices.
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  "Mac app + iPhone + Watch companion",
                  "Encrypted iCloud Sync",
                  "Unlimited Local Transcription",
                  "Zero Vendor Lock-in"
                ].map((item, i) => (
                  <li key={i} className="group/item flex items-center gap-3 text-xs font-mono text-zinc-700 dark:text-zinc-300 cursor-default transition-colors hover:text-zinc-900 dark:hover:text-white">
                    <Check className="w-3 h-3 text-zinc-400 transition-all group-hover/item:text-emerald-500 group-hover/item:scale-110" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Pricing note */}
              <div className="p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                  I haven't figured out pricing yet. I'd love to add as much value in a free tier as possible — which is why everything is built local-first so it doesn't cost me much to support. At the same time, for me to spend more time on this project, some transparent pricing would be more sustainable.
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                  If you have input on pricing, send me a quick email — would love your thoughts.
                </p>
                <p className="text-xs text-zinc-900 dark:text-white font-semibold">
                  Sign up now and you'll be included in the early supporters discount.
                </p>
                <a
                  href="mailto:arach@usetalkie.com?subject=Pricing feedback"
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors inline-block mt-2"
                >
                  arach@usetalkie.com
                </a>
              </div>
            </div>

            {/* Right: Pricing Card */}
            <div className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-6 relative group/card transition-all hover:border-emerald-500/30">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-900 dark:border-white transition-all group-hover/card:w-4 group-hover/card:h-4 group-hover/card:border-emerald-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-900 dark:border-white transition-all group-hover/card:w-4 group-hover/card:h-4 group-hover/card:border-emerald-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-900 dark:border-white transition-all group-hover/card:w-4 group-hover/card:h-4 group-hover/card:border-emerald-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-900 dark:border-white transition-all group-hover/card:w-4 group-hover/card:h-4 group-hover/card:border-emerald-500" />

              <div className="text-center mb-6">
                <p className="text-[10px] font-mono uppercase text-zinc-400 mb-2">Mac + iPhone + Watch</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-3">Public Launch 2026</p>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mb-3">
                  <Clock className="w-3 h-3" />
                  <span className="text-zinc-900 dark:text-white font-bold">{timeLeft.days}d</span>
                  <span className="text-zinc-900 dark:text-white font-bold">{timeLeft.hours}h</span>
                  <span className="text-zinc-900 dark:text-white font-bold">{timeLeft.minutes}m</span>
                  <span className="text-zinc-900 dark:text-white font-bold">{timeLeft.seconds}s</span>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Get early access now.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <p className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2 py-1 rounded w-full text-center tracking-wider">
                    Get Early Access
                  </p>
                  <input
                    type="email"
                    required
                    placeholder="enter@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono text-center text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                  />
                  <div className="relative">
                    <select
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono text-center text-zinc-900 dark:text-white appearance-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors cursor-pointer"
                    >
                      {USE_CASES.map(({ value, label }) => (
                        <option key={value} value={value} className="text-left">
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>
                  {/* Honeypot - hidden from users */}
                  <input type="text" tabIndex="-1" autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} className="absolute -left-[9999px]" aria-hidden="true" />
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending…' : 'Join Early Testers'}
                  </button>
                  {errorMsg && (
                    <p className="text-[10px] text-center text-red-500 mt-1">{errorMsg}</p>
                  )}
                  <p className="text-[10px] text-center text-zinc-400 mt-2">
                    Early testers get launch discounts.
                  </p>
                </form>
              ) : (
                <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide">You&apos;re on the list.</p>
                  <div className="mt-4 space-y-3">
                    <a
                      href="/dl?ref=pricing"
                      className="w-full inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-100"
                    >
                      Download Talkie for Mac
                    </a>
                    <a
                      href="https://api.usetalkie.com/testflight"
                      className="w-full inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors hover:border-zinc-400 dark:hover:border-zinc-500"
                    >
                      Get iPhone TestFlight
                    </a>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-3">Check your email for setup instructions.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
