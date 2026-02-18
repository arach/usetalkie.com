'use client'

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp, Terminal, X } from 'lucide-react'

type LogLevel = 'info' | 'success' | 'error' | 'warn'

interface LogEntry {
  id: number
  level: LogLevel
  message: string
  timestamp: Date
}

interface ActivityConsoleContext {
  log: (message: string, level?: LogLevel) => void
}

const ConsoleContext = createContext<ActivityConsoleContext>({
  log: () => {},
})

export function useConsole() {
  return useContext(ConsoleContext)
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  info: 'text-zinc-400',
  success: 'text-emerald-400',
  error: 'text-red-400',
  warn: 'text-amber-400',
}

const LEVEL_PREFIX: Record<LogLevel, string> = {
  info: 'INF',
  success: 'OK ',
  error: 'ERR',
  warn: 'WRN',
}

export function ActivityConsoleProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [expanded, setExpanded] = useState(false)
  const idRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const log = useCallback((message: string, level: LogLevel = 'info') => {
    const entry: LogEntry = {
      id: idRef.current++,
      level,
      message,
      timestamp: new Date(),
    }
    setEntries((prev) => [...prev.slice(-99), entry])
    setExpanded(true)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries])

  const hasEntries = entries.length > 0
  const lastEntry = entries[entries.length - 1]

  return (
    <ConsoleContext.Provider value={{ log }}>
      {children}
      {hasEntries && (
        <div className="fixed bottom-0 left-64 right-0 z-50 border-t border-zinc-800 bg-zinc-950">
          {/* Header bar */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              {!expanded && lastEntry && (
                <span className={`text-xs font-mono truncate ${LEVEL_COLORS[lastEntry.level]}`}>
                  {lastEntry.message}
                </span>
              )}
              {expanded && (
                <span className="text-xs text-zinc-500">{entries.length} events</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </div>
          </button>

          {/* Log entries */}
          {expanded && (
            <div
              ref={scrollRef}
              className="max-h-48 overflow-y-auto border-t border-zinc-800/50 px-4 py-2 font-mono text-xs space-y-0.5"
            >
              {entries.map((entry) => (
                <div key={entry.id} className="flex gap-3">
                  <span className="text-zinc-600 shrink-0">
                    {entry.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                  <span className={`shrink-0 ${LEVEL_COLORS[entry.level]}`}>
                    {LEVEL_PREFIX[entry.level]}
                  </span>
                  <span className={LEVEL_COLORS[entry.level]}>{entry.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ConsoleContext.Provider>
  )
}
