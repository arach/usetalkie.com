"use client"

import { useEffect, useState } from 'react'
import KeypressCue from './KeypressCue'

/**
 * PasteMock — destination-app preview rendered inside a Mac-desktop
 * frame (menu bar + dock + traffic-light window chrome). Sits between
 * the SignalTable's play bar and dictation buffer.
 *
 * Visibility model:
 *   The DESKTOP FRAME is always visible — empty state has identity
 *   ("ready to receive") rather than a void. The MOCK WINDOW inside
 *   it animates in during the review phase. A LIVE CAPTURE OVERLAY
 *   (slim wave bar, top-center) appears during recording. A KEYPRESS
 *   CUE replays the parent SignalTable's hotkey HUD at bottom-right
 *   so the same gesture lands in two places visually.
 *
 * Kind is derived from the capture's eyebrow first token (SMS, EMAIL,
 * PROMPT → claude, CLI → terminal, ISSUE, NOTE/MEETING/JOURNAL → note).
 *
 * Hardcoded colors (iMessage blue, Claude orange, traffic-light dots,
 * GitHub black, dock translucency) are deliberate Mac-mock vocabulary,
 * scoped here rather than living in design tokens.
 */

/* ──────────────────────────────────────────────────────────────────
 * App registry — drives the dock + the active-app menu-bar label.
 * ──────────────────────────────────────────────────────────────── */
const APPS = [
  { kind: 'sms',      label: 'Messages', bg: '#34c759', color: '#fff' },
  { kind: 'email',    label: 'Mail',     bg: '#fff',    color: '#1d77fc', border: '1px solid rgba(0,0,0,0.12)' },
  { kind: 'claude',   label: 'Claude',   bg: '#cc785c', color: '#fff' },
  { kind: 'terminal', label: 'Terminal', bg: '#1f2937', color: '#10b981' },
  { kind: 'note',     label: 'Notes',    bg: '#fbbf24', color: '#000' },
  { kind: 'issue',    label: 'GitHub',   bg: '#0d1117', color: '#fff' },
]

function deriveKind(eyebrow) {
  if (!eyebrow) return 'note'
  const head = eyebrow.split('·')[0].trim().toUpperCase()
  switch (head) {
    case 'SMS': return 'sms'
    case 'EMAIL': return 'email'
    case 'PROMPT': return 'claude'
    case 'CLI': return 'terminal'
    case 'ISSUE': return 'issue'
    case 'MEETING':
    case 'JOURNAL':
    case 'NOTE':
    default:
      return 'note'
  }
}

/* ──────────────────────────────────────────────────────────────────
 * Inline CSS — wave-bar keyframe + reduced-motion guard. Scoped to
 * the .paste-mock-desktop root via a class prefix so it doesn't
 * collide with anything else in globals.css.
 * ──────────────────────────────────────────────────────────────── */
const PASTE_MOCK_CSS = `
.paste-mock-wave-bar {
  animation: paste-mock-wave 0.9s ease-in-out infinite;
  transform-origin: bottom;
}
@keyframes paste-mock-wave {
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(1); }
}
@media (prefers-reduced-motion: reduce) {
  .paste-mock-wave-bar { animation: none; transform: scaleY(0.7); }
}
`

/* ──────────────────────────────────────────────────────────────────
 * Inline icon glyphs (SVG). Sized for a small dock — 14×14.
 * ──────────────────────────────────────────────────────────────── */
const Icon = {
  sms: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M4 6 a3 3 0 0 1 3 -3 h10 a3 3 0 0 1 3 3 v8 a3 3 0 0 1 -3 3 h-7 l-4 4 v-4 a3 3 0 0 1 -2 -2.83 z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="M3 7 l9 7 l9 -7" />
    </svg>
  ),
  /* Stylized Anthropic-flavored A — clean two-stroke letterform with
   * crossbar. Not the official mark; an evocative substitute that
   * reads as Claude's voice without grabbing licensed assets. */
  claude: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M5 20 L11 4 L13 4 L19 20 L16.4 20 L15 16 L9 16 L7.6 20 Z M9.8 14 L14.2 14 L12 8.2 Z" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
      <path d="M5 7 L9 12 L5 17" />
      <line x1="11" y1="17" x2="19" y2="17" />
    </svg>
  ),
  note: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <line x1="9" y1="8.5" x2="15" y2="8.5" />
      <line x1="9" y1="12.5" x2="15" y2="12.5" />
      <line x1="9" y1="16.5" x2="13" y2="16.5" />
    </svg>
  ),
  /* GitHub octocat — canonical public mark, 16×16 path. */
  issue: (
    <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
}

/* Talkie status-menubar mic icon — tiny, monochrome. */
const TalkieMicIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
    <rect x="9" y="3" width="6" height="12" rx="3" />
    <path d="M5 11v1a7 7 0 0014 0v-1" />
    <line x1="12" y1="19" x2="12" y2="23" />
  </svg>
)

/* ──────────────────────────────────────────────────────────────────
 * Live clock — minute-precision is plenty for a marketing mock.
 * ──────────────────────────────────────────────────────────────── */
function formatTime(d) {
  const h = d.getHours() % 12 || 12
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM'
  return `${h}:${m} ${ampm}`
}

function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()))
  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()))
    tick()
    const id = setInterval(tick, 30 * 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ──────────────────────────────────────────────────────────────────
 * Main export.
 * ──────────────────────────────────────────────────────────────── */
export default function PasteMock({ capture, phase, keypressCue, revealProgress = 0 }) {
  const reveal = Math.max(0, Math.min(1, revealProgress))
  const visible = (phase === 'review' || reveal > 0) && capture != null
  const recording = phase === 'recording'
  const kind = capture ? deriveKind(capture.eyebrow) : 'note'
  const activeApp = APPS.find((a) => a.kind === kind) ?? APPS[0]
  const time = useClock()

  return (
    <div className="paste-mock-desktop mt-3">
      <style dangerouslySetInnerHTML={{ __html: PASTE_MOCK_CSS }} />
      <div
        className="relative overflow-hidden rounded-md border border-edge"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, var(--canvas) 0%, var(--canvas-alt) 70%, var(--surface) 100%)',
          minHeight: 240,
        }}
      >
        {/* ────── Mac menu bar (theme-aware via canvas-overlay token) ────── */}
        <div
          className="relative z-20 flex items-center gap-3 border-b border-edge-faint px-3 py-1 text-[11px] text-ink"
          style={{
            background: 'var(--canvas-overlay)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span aria-hidden style={{ fontSize: 12, lineHeight: 1 }}></span>
          <span className="font-semibold">{activeApp.label}</span>
          <span className="text-ink-muted">File</span>
          <span className="text-ink-muted">Edit</span>
          <span className="text-ink-muted">View</span>
          <span className="text-ink-muted">Window</span>
          <span className="text-ink-muted">Help</span>
          <span className="ml-auto inline-flex items-center gap-3 text-[10px] text-ink-muted">
            {/* Talkie status — recording state lights phosphor green */}
            <span
              className="inline-flex items-center gap-1"
              style={{
                color: recording ? '#10b981' : undefined,
                transition: 'color 0.3s',
              }}
              title="Talkie"
            >
              {TalkieMicIcon}
            </span>
            <span aria-hidden>⌬</span>
            <span aria-hidden>◐</span>
            <span className="font-mono">{time}</span>
          </span>
        </div>

        {/* ────── Recording wave overlay (top center, only during recording) ────── */}
        {recording && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-9 z-10 flex h-5 -translate-x-1/2 items-end gap-[3px]"
          >
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className="paste-mock-wave-bar block w-[2px] rounded-full"
                style={{
                  height: 16,
                  background: '#10b981',
                  boxShadow: '0 0 4px rgba(16,185,129,0.55)',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* ────── Desktop body — mock window opens here on review ────── */}
        <div
          className="relative flex items-start justify-center px-4 pt-8 pb-16 sm:px-8"
          style={{ minHeight: 220 }}
        >
          <div
            className="w-full max-w-md"
            style={{
              opacity: visible ? Math.max(0.15, reveal || 1) : 0,
              transform: visible
                ? `translateY(${Math.round((1 - (reveal || 1)) * -6)}px) scale(${0.96 + (reveal || 1) * 0.04})`
                : 'translateY(-10px) scale(0.96)',
              transition: 'opacity 0.55s, transform 0.65s',
              transitionTimingFunction: visible
                ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'cubic-bezier(0.4, 0, 1, 1)',
            }}
          >
            {/* Window chrome with traffic-light controls */}
            <div
              className="overflow-hidden rounded-lg"
              style={{
                background: '#fff',
                boxShadow:
                  '0 1px 0 rgba(255,255,255,0.5) inset, 0 12px 32px -8px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.10)',
              }}
            >
              <div
                className="flex items-center gap-1.5 border-b px-3 py-2"
                style={{ borderBottomColor: 'rgba(0,0,0,0.08)' }}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: '#ed6a5e' }} />
                <span className="h-3 w-3 rounded-full" style={{ background: '#f5bf4f' }} />
                <span className="h-3 w-3 rounded-full" style={{ background: '#62c554' }} />
                <span className="ml-3 text-[11px] font-medium text-black/70">{activeApp.label}</span>
              </div>
              <div className="p-5">
                {capture && kind === 'sms'      && <SmsMock     capture={capture} />}
                {capture && kind === 'email'    && <EmailMock   capture={capture} />}
                {capture && kind === 'claude'   && <ClaudeMock  capture={capture} />}
                {capture && kind === 'terminal' && <TerminalMock capture={capture} />}
                {capture && kind === 'issue'    && <IssueMock   capture={capture} />}
                {capture && kind === 'note'     && <NoteMock    capture={capture} />}
              </div>
            </div>
          </div>
        </div>

        {/* ────── Dock — small, theme-aware glass via surface tint ────── */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
          <div
            className="flex items-end gap-1 rounded-2xl border border-edge-dim px-1.5 py-1"
            style={{
              background: 'color-mix(in oklab, var(--surface) 78%, transparent)',
              backdropFilter: 'blur(14px)',
              boxShadow:
                '0 1px 0 color-mix(in oklab, var(--canvas) 70%, transparent) inset, 0 6px 16px -6px rgba(0,0,0,0.18)',
            }}
          >
            {APPS.map((app) => {
              const isActive = app.kind === kind && visible
              return (
                <div key={app.kind} className="relative flex flex-col items-center" title={app.label}>
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-[5px]"
                    style={{
                      background: app.bg,
                      color: app.color,
                      border: app.border ?? 'none',
                      transform: isActive ? 'translateY(-2px) scale(1.12)' : 'translateY(0) scale(1)',
                      transition: 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      boxShadow: '0 1.5px 4px rgba(0,0,0,0.18)',
                    }}
                  >
                    <span style={{ display: 'inline-flex', transform: 'scale(0.86)' }}>
                      {Icon[app.kind]}
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="mt-px h-[2px] w-[2px] rounded-full transition-opacity duration-300"
                    style={{
                      background: 'var(--ink)',
                      opacity: isActive ? 0.55 : 0,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* ────── Keypress cue replay (bottom-right of desktop) ────── */}
        {keypressCue && (
          <KeypressCue
            key={`desktop-${keypressCue.at}`}
            keys={['⌘', '⇧', 'A']}
            variant={keypressCue.kind}
          />
        )}
      </div>
    </div>
  )
}

/* ────── iMessage bubble ────────────────────────────────────────── */
function SmsMock({ capture }) {
  const recipient = guessRecipient(capture.input) || 'Sarah'
  const body = stripRoutingPrefix(capture.input)
  return (
    <div className="font-sans">
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-black/50">
        To: <span className="text-black">{recipient}</span>
      </div>
      <div className="flex justify-end">
        <div
          className="max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2 text-[13px] leading-snug text-white"
          style={{ background: '#3b82f6' }}
        >
          {body}
        </div>
      </div>
    </div>
  )
}

/* ────── Mail compose ───────────────────────────────────────────── */
function EmailMock({ capture }) {
  return (
    <div className="font-sans text-[12px] text-black">
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-black/50">To:</span>
        <span>David</span>
      </div>
      <div
        className="mb-2 flex items-baseline gap-2 border-b pb-2"
        style={{ borderBottomColor: 'rgba(0,0,0,0.08)' }}
      >
        <span className="text-[10px] uppercase tracking-[0.18em] text-black/50">Subject:</span>
        <span className="font-medium">Re: Spec — auth flow questions</span>
      </div>
      <p className="text-[12px] leading-relaxed text-black/70">{capture.input}</p>
    </div>
  )
}

/* ────── Claude prompt + reply ──────────────────────────────────── */
function ClaudeMock({ capture }) {
  return (
    <div className="font-sans text-[12px]">
      <div className="mb-3 flex items-start gap-2">
        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black text-[8px] font-bold text-white">
          You
        </span>
        <p className="text-black leading-relaxed">{capture.input}</p>
      </div>
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: '#cc785c' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="9" height="9">
            <path d="M5 20 L11 4 L13 4 L19 20 L16.4 20 L15 16 L9 16 L7.6 20 Z M9.8 14 L14.2 14 L12 8.2 Z" />
          </svg>
        </span>
        <p className="text-black/70 leading-relaxed italic">
          Three options: <span className="text-black not-italic">"Signal Lossy"</span>,{' '}
          <span className="text-black not-italic">"Tape & Tangent"</span>,{' '}
          <span className="text-black not-italic">"The Loose Track"</span>.
        </p>
      </div>
    </div>
  )
}

/* ────── Terminal ───────────────────────────────────────────────── */
function TerminalMock({ capture }) {
  return (
    <div
      className="rounded-sm p-3 font-mono text-[11px] leading-relaxed"
      style={{ background: '#0a0a0a', color: '#d4d4d4' }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: '#10b981' }}>$</span>
        <span style={{ color: '#a3a3a3' }}>talkie search</span>
        <span style={{ color: '#fafafa' }}>"reconnect"</span>
      </div>
      <div className="mt-2 space-y-0.5 text-[10px]" style={{ color: '#737373' }}>
        <div><span style={{ color: '#10b981' }}>→</span> 2026-04-21 · cli-reconnect-debug · 8 min ago</div>
        <div><span style={{ color: '#10b981' }}>→</span> 2026-04-19 · search-rerank-bug · 2 days ago</div>
        <div><span style={{ color: '#10b981' }}>→</span> 2026-04-18 · gateway-flap · 3 days ago</div>
      </div>
    </div>
  )
}

/* ────── GitHub Issue ───────────────────────────────────────────── */
function IssueMock({ capture }) {
  return (
    <div className="font-sans text-[12px]">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] text-white"
          style={{ background: '#10b981' }}
        >
          ●
        </span>
        <span className="font-medium text-black">Issue tab loses router state on reload</span>
      </div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        <span className="rounded-full px-2 py-0.5 text-[9px]" style={{ background: '#fee2e2', color: '#991b1b' }}>bug</span>
        <span className="rounded-full px-2 py-0.5 text-[9px]" style={{ background: '#fef3c7', color: '#92400e' }}>p1</span>
        <span
          className="rounded-full border px-2 py-0.5 text-[9px] text-black/60"
          style={{ borderColor: 'rgba(0,0,0,0.12)' }}
        >
          due Friday
        </span>
      </div>
      <p className="text-[11px] leading-relaxed text-black/70">{capture.input}</p>
    </div>
  )
}

/* ────── Note (default + meeting + journal variants) ────────────── */
function NoteMock({ capture }) {
  const isJournal = /^JOURNAL/i.test(capture.eyebrow || '')
  const isMeeting = /^MEETING/i.test(capture.eyebrow || '')
  const dateLabel = isJournal
    ? 'Today · ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null
  return (
    <div className="font-sans text-[12px]">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-medium text-black">
          {isJournal ? 'Journal' : isMeeting ? 'Design system meeting' : 'Untitled note'}
        </span>
        {dateLabel && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-black/50">{dateLabel}</span>
        )}
      </div>
      <p className="text-[11px] leading-relaxed text-black/70">{capture.input}</p>
      {isMeeting && (
        <div className="mt-2 inline-flex items-center gap-1.5 text-[10px]" style={{ color: '#1d77fc' }}>
          <span aria-hidden>↗</span>
          <span>
            linked to <span className="underline decoration-1 underline-offset-2">design-system</span>
          </span>
        </div>
      )}
      {!isJournal && !isMeeting && (
        <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-black/50">
          <span
            className="rounded-sm border px-1.5 py-0.5 font-mono text-[9px]"
            style={{ borderColor: 'rgba(0,0,0,0.12)' }}
          >
            #idea
          </span>
        </div>
      )}
    </div>
  )
}

/* ────── helpers ─────────────────────────────────────────────────── */
function stripRoutingPrefix(s) {
  if (!s) return ''
  return s.replace(/^tell\s+\w+\s+/i, '').replace(/^[a-z]/, (c) => c.toUpperCase())
}

function guessRecipient(s) {
  if (!s) return null
  const m = s.match(/^tell\s+(\w+)/i)
  return m ? m[1] : null
}
