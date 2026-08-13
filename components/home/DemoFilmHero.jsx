"use client"

import { useMemo, useRef, useState } from 'react'

const DEMO_VIDEO_URL =
  'https://kyuduglcwb3yapbw.public.blob.vercel-storage.com/website/videos/talkie-cross-app-demo-2026-08-13-22786010.mp4'

const DICTATION_CUES = [
  {
    app: 'Cursor',
    start: 3.5,
    voiceStart: 6.566,
    stop: 14.752,
    ready: 15.241,
    caption:
      'Friday release update. Dictation now works across the editor, the terminal, and the browser. The release candidate is ready for review.',
  },
  {
    app: 'ChatGPT',
    start: 23.366,
    voiceStart: 26.01,
    stop: 29.155,
    ready: 29.723,
    caption: 'Great progress. Please share any blockers before Friday.',
  },
  {
    app: 'Ghostty',
    start: 36.067,
    voiceStart: 39.127,
    stop: 44.821,
    ready: 45.091,
    caption:
      'Commit the Talkie demo updates with the real-time timer, the calm recording indicator, and the final metadata view.',
  },
]

const KEYCAST_DURATION = 2
const KEYCAST_FADE_START = 1.35

function getKeycastState(currentTime) {
  for (const cue of DICTATION_CUES) {
    for (const eventTime of [cue.start, cue.stop]) {
      const elapsed = currentTime - eventTime

      if (elapsed >= 0 && elapsed < KEYCAST_DURATION) {
        const fadeProgress = Math.max(
          0,
          (elapsed - KEYCAST_FADE_START) / (KEYCAST_DURATION - KEYCAST_FADE_START)
        )

        return { opacity: 1 - fadeProgress }
      }
    }
  }

  return null
}

function getInteractionState(currentTime) {
  const cue = DICTATION_CUES.find(
    (candidate) => currentTime >= candidate.start && currentTime <= candidate.ready + 0.9
  )

  if (!cue) {
    return {
      app: 'Global dictation',
      caption: null,
    }
  }

  const caption =
    currentTime >= cue.voiceStart && currentTime <= cue.stop ? cue.caption : null

  if (currentTime < cue.ready) {
    return { ...cue, caption }
  }

  return { ...cue, caption: null }
}

export default function DemoFilmHero() {
  const [currentTime, setCurrentTime] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const videoRef = useRef(null)
  const interaction = useMemo(() => getInteractionState(currentTime), [currentTime])
  const keycast = useMemo(() => getKeycastState(currentTime), [currentTime])

  const startPlayback = async () => {
    if (!videoRef.current || isStarting) return

    setIsStarting(true)
    try {
      await videoRef.current.play()
    } catch {
      setIsStarting(false)
    }
  }

  return (
    <section
      aria-labelledby="demo-film-title"
      className="home-demo-film-stage relative overflow-hidden border-b border-edge-faint bg-canvas font-mono"
    >
      <h1 id="demo-film-title" className="sr-only">
        Talkie dictation across Cursor, ChatGPT, Ghostty, and Talkie
      </h1>

      <div className="mx-auto max-w-[1600px] sm:px-4 sm:py-4 lg:px-6 lg:py-6">
        <figure className="overflow-hidden bg-[#050504] sm:rounded-md sm:border sm:border-white/10 sm:shadow-[0_24px_72px_-44px_rgba(0,0,0,0.58)]">
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              className="block h-full w-full object-contain"
              src={DEMO_VIDEO_URL}
              poster="/videos/talkie-cross-app-demo-poster.jpg"
              aria-describedby="demo-film-description"
              controls={hasStarted}
              playsInline
              preload="none"
              onPlaying={() => {
                setHasStarted(true)
                setIsStarting(false)
              }}
              onLoadedMetadata={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onSeeked={(event) => setCurrentTime(event.currentTarget.currentTime)}
            >
              <track
                kind="captions"
                src="/videos/talkie-cross-app-demo.vtt"
                srcLang="en"
                label="English"
              />
            </video>

            {!hasStarted && (
              <button
                type="button"
                onClick={startPlayback}
                aria-label={isStarting ? 'Loading Talkie demo' : 'Play Talkie demo'}
                className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--amber)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-sm border border-white/25 bg-[#0e0d0a]/90 text-[#f4efe6] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.8)] transition-colors duration-200 hover:border-[#e68a3c] hover:text-[#e68a3c]">
                  {isStarting ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/30 border-t-current" />
                  ) : (
                    <svg
                      viewBox="0 0 16 16"
                      className="ml-0.5 h-4 w-4 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M3.5 2.6v10.8L13 8 3.5 2.6Z" />
                    </svg>
                  )}
                </span>
              </button>
            )}

            {keycast && (
              <div
                aria-hidden="true"
                data-demo-keycast
                className="pointer-events-none absolute bottom-[22%] left-1/2 z-20 -translate-x-1/2"
                style={{ opacity: keycast.opacity }}
              >
                <div className="flex items-center gap-1.5 rounded-md border border-white/15 bg-[#0e0d0a]/90 p-2 shadow-[0_10px_28px_-12px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:gap-2 sm:p-2.5">
                  {['⌃', '⇧', '⌘', 'L'].map((key) => (
                    <kbd
                      key={key}
                      className="flex h-7 min-w-7 items-center justify-center rounded-[4px] border border-white/25 bg-white/[0.09] px-1.5 font-mono text-[12px] leading-none text-[#f4efe6] shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)] sm:h-8 sm:min-w-8 sm:text-[13px]"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            )}

          </div>

          <figcaption
            id="demo-film-description"
            className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch border-t border-[#e68a3c]/25 bg-[#15130f] text-[8px] uppercase tracking-[0.2em] text-[#c9bfad] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:min-h-12 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:text-[9px]"
          >
            <span className="order-1 flex min-h-9 items-center gap-2.5 px-3 sm:min-h-0 sm:px-4">
              <span className="shrink-0 text-[#e5dccd]">Real demo</span>
              <span className="hidden text-white/50 lg:inline">
                Cursor → ChatGPT → Ghostty → Talkie
              </span>
            </span>

            <span className="order-3 col-span-2 flex min-h-10 min-w-0 items-center gap-2.5 border-t border-white/10 px-3 py-1.5 sm:order-2 sm:col-span-1 sm:min-h-0 sm:border-l sm:border-t-0 sm:px-4 sm:py-0">
              <span className={interaction.caption ? 'shrink-0 text-[#e68a3c]' : 'shrink-0 text-[#a9a08f]'}>
                {interaction.caption ? `Voice · ${interaction.app}` : 'Voice'}
              </span>
              <span
                className={interaction.caption
                  ? 'min-w-0 normal-case tracking-[0.02em] text-[#f4efe6] max-sm:line-clamp-2 sm:truncate'
                  : 'min-w-0 truncate text-[#8f8778]'}
              >
                {interaction.caption || 'Transcript appears during dictation.'}
              </span>
            </span>

            <span className="order-2 flex min-h-9 items-center border-white/10 bg-[#18150f] px-3 text-[#eaa469] sm:order-3 sm:min-h-0 sm:border-l sm:px-4">
              1:31 · Original speed
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
