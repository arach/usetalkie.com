"use client"
import { useState } from 'react'
import { Construction, ArrowRight, Check } from 'lucide-react'

export default function ComingSoonBanner({ topic }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('https://app.usetalkie.com/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          intent: topic || 'coming-soon',
          source: 'docs',
        }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="not-prose mb-10">
      <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
        <div className="flex items-start gap-3">
          <Construction className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              This page is a preview — details may change as development continues.
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 mb-3">
              Interested in this feature? Leave your email and we'll reach out when it's ready.
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                Got it — we'll be in touch.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="h-8 px-3 rounded-md border border-amber-300 dark:border-amber-500/40 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50 w-56"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="h-8 px-3 rounded-md bg-amber-600 dark:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-amber-700 dark:hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {status === 'loading' ? 'Sending...' : (
                    <>Notify me <ArrowRight className="w-3 h-3" /></>
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">Something went wrong — try again.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
