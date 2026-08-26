"use client"
import React, { useState, useRef } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { trackSignup, getStoredUTMParams } from '../lib/analytics'

const USE_CASES = [
  { value: '', label: 'How do you want to use Talkie?' },
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
  const formLoadTime = useRef(Date.now())

  // API endpoint - api.usetalkie.com
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.usetalkie.com/api'
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
    <section id="pricing" className="border-b border-[var(--ed-line)] bg-[var(--ed-paper)] py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-24">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[var(--ed-accent)]">Get Talkie</p>
          <h2 className="mt-5 max-w-xl font-display text-[clamp(2.7rem,4.8vw,4.2rem)] font-normal leading-[0.96] tracking-[-0.035em] text-[var(--ed-ink)]">
            Keep the system close.
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.68] text-[var(--ed-ink-2)]">
            Start with Talkie on your Mac. Add iPhone and Apple Watch whenever you want the shortest path from a passing thought to usable text.
          </p>

          <ul className="mt-10 grid border-t border-[var(--ed-line)] sm:grid-cols-2">
            {[
              'Mac app + mobile companions',
              'Searchable memos + dictations',
              'Encrypted iCloud sync',
              'Compose, workflows, and CLI',
            ].map((item, index) => (
              <li key={item} className={`flex items-center gap-3 border-b border-[var(--ed-line)] py-4 text-[14px] text-[var(--ed-ink-2)] ${index % 2 === 0 ? 'sm:border-r sm:pr-5' : 'sm:pl-5'}`}>
                <Check className="h-4 w-4 shrink-0 text-[var(--ed-accent)]" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-l-2 border-[var(--ed-accent-line)] pl-5">
            <p className="text-[13px] font-semibold text-[var(--ed-ink)]">One useful email, not a funnel.</p>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--ed-ink-2)]">We send the current setup details and write again only when something meaningful ships.</p>
          </div>
        </div>

        <div className="rounded-[20px] border border-[var(--ed-line)] bg-[var(--ed-paper-alt)] p-6 shadow-[var(--ed-shadow-lift)] md:p-9">
          <div className="border-b border-[var(--ed-line)] pb-6">
            <p className="text-[10px] font-mono font-medium uppercase tracking-[0.18em] text-[var(--ed-ink-3)]">Mac · iPhone · Watch</p>
            <h3 className="mt-3 text-[21px] font-semibold tracking-[-0.02em] text-[var(--ed-ink)]">Send me the current setup</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--ed-ink-2)]">A download link, mobile details, and the shortest way to get started.</p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-[10px] font-mono font-medium uppercase tracking-[0.18em] text-[var(--ed-ink-3)]">Email</span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-[10px] border border-[var(--ed-line)] bg-[var(--ed-paper)] px-4 text-[15px] text-[var(--ed-ink)] placeholder:text-[var(--ed-ink-3)] focus:border-[var(--ed-accent-line)] focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] font-mono font-medium uppercase tracking-[0.18em] text-[var(--ed-ink-3)]">What brings you here?</span>
                <div className="relative">
                  <select
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="h-12 w-full appearance-none rounded-[10px] border border-[var(--ed-line)] bg-[var(--ed-paper)] px-4 pr-11 text-[15px] text-[var(--ed-ink)] focus:border-[var(--ed-accent-line)] focus:outline-none"
                  >
                    {USE_CASES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ed-ink-3)]" />
                </div>
              </label>
              <input type="text" tabIndex="-1" autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} className="absolute -left-[9999px]" aria-hidden="true" />
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--ed-ink)] px-6 text-[13px] font-semibold tracking-[0.01em] text-[var(--ed-paper)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send download link'}
              </button>
              {errorMsg && <p className="text-center text-[11px] text-red-500">{errorMsg}</p>}
              <p className="text-center text-[11px] text-[var(--ed-ink-3)]">No drip campaign. Unsubscribe any time.</p>
            </form>
          ) : (
            <div className="py-10 text-center animate-in fade-in zoom-in duration-300">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--ed-accent-soft)]">
                <Check className="h-5 w-5 text-[var(--ed-accent)]" />
              </div>
              <p className="mt-4 text-[17px] font-semibold text-[var(--ed-ink)]">Link sent.</p>
              <p className="mt-2 text-[14px] text-[var(--ed-ink-2)]">Check your inbox for setup details.</p>
              <div className="mt-6 flex flex-col gap-3">
                <a href="/dl?ref=pricing" className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--ed-ink)] px-5 text-[13px] font-semibold text-[var(--ed-paper)]">Download Talkie for Mac</a>
                <a href="https://app.usetalkie.com/testflight" className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--ed-line)] px-5 text-[13px] font-semibold text-[var(--ed-ink)]">Get iPhone TestFlight</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
