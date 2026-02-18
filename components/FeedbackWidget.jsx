"use client"
import React, { useState, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2, History, Trash2, Copy } from 'lucide-react'

/**
 * Feedback widget - Opens with Cmd+K
 * Lets users send quick feedback via email
 * Tracks feedback history in localStorage
 */
export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [feedbackHistory, setFeedbackHistory] = useState([])

  // Load feedback history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('feedback_history')
      if (stored) {
        setFeedbackHistory(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Failed to load feedback history:', err)
    }
  }, [])

  // Save feedback to history
  const saveFeedbackToHistory = (feedbackText) => {
    try {
      const newEntry = {
        id: Date.now(),
        feedback: feedbackText,
        timestamp: new Date().toISOString(),
      }
      const updated = [newEntry, ...feedbackHistory].slice(0, 10) // Keep last 10
      setFeedbackHistory(updated)
      localStorage.setItem('feedback_history', JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to save feedback history:', err)
    }
  }

  // Clear all feedback history
  const clearHistory = () => {
    setFeedbackHistory([])
    localStorage.removeItem('feedback_history')
  }

  // Delete single feedback entry
  const deleteFeedback = (id) => {
    const updated = feedbackHistory.filter((f) => f.id !== id)
    setFeedbackHistory(updated)
    localStorage.setItem('feedback_history', JSON.stringify(updated))
  }

  // Copy feedback to clipboard
  const copyFeedback = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!feedback.trim()) return

    setStatus('sending')

    // Use environment variable or fallback to production
    const apiUrl = process.env.NEXT_PUBLIC_MARKETING_API_URL || 'https://marketing.usetalkie.com/api'

    try {
      // Send feedback via email using marketing API
      const res = await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback: feedback.trim(),
          email: email.trim() || 'anonymous',
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      })

      if (res.ok) {
        setStatus('success')
        saveFeedbackToHistory(feedback.trim())
        setFeedback('')
        setEmail('')
        setTimeout(() => {
          setIsOpen(false)
          setStatus('idle')
        }, 2000)
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error('Feedback error:', err)
      setStatus('error')
    }
  }

  if (!isOpen) {
    // Floating feedback button (bottom right)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9998] p-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Send feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-full max-w-md animate-in slide-in-from-bottom-4 duration-200">
      <div className="mx-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-900">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-wider">
              Send Feedback
            </span>
            <span className="text-zinc-400 text-[10px] font-mono">⌘K</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {status === 'success' ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Thanks for the feedback!
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                I'll read it and get back to you.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Your feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Found a bug? Have an idea? Let me know..."
                  className="w-full h-32 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Include your email if you'd like a response
                </p>
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Failed to send. Please try again or email arach@usetalkie.com
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !feedback.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-2.5 px-4 rounded font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Feedback
                  </>
                )}
              </button>
            </>
          )}
        </form>

        {/* Footer hint */}
        {status !== 'success' && (
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 text-center">
            Press <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-900 rounded text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">⌘K</kbd> to toggle
          </div>
        )}
      </div>
    </div>
  )
}
