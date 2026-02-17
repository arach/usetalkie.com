"use client"
import React, { useState, useEffect } from 'react'
import { Terminal, X, ToggleLeft, ToggleRight } from 'lucide-react'

/**
 * Universal dev console for debugging and testing
 * Opens with Cmd+Shift+D (or Ctrl+Shift+D on Windows)
 *
 * Features:
 * - Analytics tracking toggle
 * - Environment info
 * - Quick toggles for dev features
 */
export default function DevConsole() {
  const [isOpen, setIsOpen] = useState(false)
  const [analyticsDisabled, setAnalyticsDisabled] = useState(false)

  // Check analytics status on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const disabled = localStorage.getItem('disable_analytics') === 'true'
    setAnalyticsDisabled(disabled)
  }, [])

  // Keyboard shortcut: Cmd+Shift+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleAnalytics = () => {
    const newState = !analyticsDisabled
    if (newState) {
      localStorage.setItem('disable_analytics', 'true')
      console.log('🔴 Analytics disabled')
    } else {
      localStorage.removeItem('disable_analytics')
      console.log('🟢 Analytics enabled')
    }
    setAnalyticsDisabled(newState)
  }

  const getEnvironmentInfo = () => {
    if (typeof window === 'undefined') return {}
    return {
      host: window.location.hostname,
      path: window.location.pathname,
      userAgent: navigator.userAgent.split(' ')[0], // First part
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    }
  }

  const env = getEnvironmentInfo()

  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] animate-in slide-in-from-bottom duration-200">
      {/* Terminal panel */}
      <div className="mx-auto max-w-4xl mb-4 mx-4 bg-zinc-950 border border-emerald-500/30 rounded-t-lg shadow-2xl shadow-emerald-500/20 overflow-hidden font-mono text-xs">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-400 font-bold uppercase tracking-wider">Dev Console</span>
            <span className="text-zinc-600 text-[10px]">⌘⇧D</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 hover:text-white transition-colors p-1"
            aria-label="Close console"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[40vh] overflow-y-auto">

          {/* Analytics Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">Analytics Tracking</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    analyticsDisabled
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {analyticsDisabled ? 'DISABLED' : 'ENABLED'}
                  </span>
                </div>
                <p className="text-zinc-500 text-[10px] mt-0.5">
                  {analyticsDisabled
                    ? 'Your traffic is not being tracked'
                    : 'Your traffic is being sent to Google Analytics'}
                </p>
              </div>
              <button
                onClick={toggleAnalytics}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded transition-colors"
              >
                {analyticsDisabled ? (
                  <>
                    <ToggleLeft className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300">Enable</span>
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span className="text-zinc-300">Disable</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Environment Info */}
          <div className="space-y-1.5 pt-4 border-t border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Environment</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-zinc-500">Host:</span>{' '}
                <span className="text-zinc-300">{env.host}</span>
              </div>
              <div>
                <span className="text-zinc-500">Path:</span>{' '}
                <span className="text-zinc-300">{env.path}</span>
              </div>
              <div>
                <span className="text-zinc-500">Viewport:</span>{' '}
                <span className="text-zinc-300">{env.viewport}</span>
              </div>
              <div>
                <span className="text-zinc-500">Browser:</span>{' '}
                <span className="text-zinc-300">{env.userAgent}</span>
              </div>
            </div>
          </div>

          {/* Future expansion area */}
          <div className="pt-4 border-t border-zinc-800">
            <div className="text-zinc-600 text-[10px] italic">
              More dev tools coming soon...
            </div>
          </div>

        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 bg-zinc-900/50 border-t border-zinc-800 text-[10px] text-zinc-600">
          Press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">⌘⇧D</kbd> to toggle console
        </div>

      </div>
    </div>
  )
}
