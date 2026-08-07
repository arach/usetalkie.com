"use client"
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize, List } from 'lucide-react'
import { trackVideoPlay, trackVideoProgress } from '../lib/analytics'

/** Desktop category cards — semantic page chrome (outside the black player). */
function CategoryCard({ title, description, isActive, isAvailable, onClick, videoCount }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable}
      className={`flex-1 p-4 rounded-lg border text-left transition-all ${
        isActive
          ? 'border-trace/30 bg-[color-mix(in_oklab,var(--trace)_8%,transparent)]'
          : isAvailable
            ? 'border-edge bg-surface hover:border-edge-dim cursor-pointer'
            : 'border-edge-faint opacity-40 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isActive && (
            <div
              className="w-2 h-2 rounded-full bg-trace"
              style={{ boxShadow: '0 0 6px var(--trace)' }}
              aria-hidden
            />
          )}
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
            {title}
          </h3>
        </div>
        {isAvailable ? (
          <span className="text-[9px] font-mono text-ink-faint">
            {videoCount} video{videoCount !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-[9px] font-mono text-ink-subtle uppercase">Soon</span>
        )}
      </div>
      <p className="text-[10px] text-ink-muted leading-relaxed">{description}</p>
    </button>
  )
}

/** Icon control with 44×44 minimum target — dark player chrome. */
function PlayerButton({ onClick, disabled, ariaLabel, ariaExpanded, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center text-white transition-colors hover:text-trace disabled:opacity-30 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${className}`}
    >
      {children}
    </button>
  )
}

export default function DemoViewer({ sections = [] }) {
  const videoRef = useRef(null)
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || null)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const trackedMilestones = useRef(new Set())
  const prefersReducedMotion = useRef(false)

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0]
  const activeVideo = activeSection?.videos?.[activeVideoIndex] || activeSection?.videos?.[0]
  const hasMultipleVideos = (activeSection?.videos?.length || 0) > 1
  const hasPrev = activeVideoIndex > 0
  const hasNext = activeVideoIndex < (activeSection?.videos?.length || 1) - 1

  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    setActiveVideoIndex(0)
    setHasStarted(false)
    setShowPlaylist(false)
    trackedMilestones.current.clear()
  }, [activeSectionId])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => setDuration(video.duration || 0)
    const handleTimeUpdate = () => {
      const d = video.duration || 0
      const t = video.currentTime || 0
      const currentProgress = d > 0 ? (t / d) * 100 : 0
      setProgress(currentProgress)
      setCurrentTime(t)

      const milestones = [25, 50, 75, 100]
      for (const milestone of milestones) {
        if (currentProgress >= milestone && !trackedMilestones.current.has(milestone)) {
          trackedMilestones.current.add(milestone)
          trackVideoProgress(activeVideo?.title || 'demo', milestone)
        }
      }
    }
    const handlePlay = () => {
      setIsPlaying(true)
      if (!hasStarted) {
        setHasStarted(true)
        trackVideoPlay(activeVideo?.title || 'demo', video.duration)
      }
    }
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      // Auto-advance only when motion is allowed
      if (hasNext && !prefersReducedMotion.current) {
        setActiveVideoIndex((i) => i + 1)
        setTimeout(() => videoRef.current?.play(), 100)
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [activeVideo?.title, hasStarted, hasNext])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) videoRef.current.pause()
    else videoRef.current.play()
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const seekToPercent = useCallback((percent) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    const clamped = Math.max(0, Math.min(1, percent))
    video.currentTime = clamped * video.duration
    setProgress(clamped * 100)
    setCurrentTime(video.currentTime)
  }, [])

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    seekToPercent(clickX / rect.width)
  }

  const handleSeekKeyDown = (e) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    const step = e.shiftKey ? 10 : 5
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      video.currentTime = Math.max(0, video.currentTime - step)
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      video.currentTime = Math.min(video.duration, video.currentTime + step)
    } else if (e.key === 'Home') {
      e.preventDefault()
      video.currentTime = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      video.currentTime = video.duration
    }
  }

  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return
    if (video.requestFullscreen) video.requestFullscreen()
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen()
  }

  const goToPrev = () => {
    if (!hasPrev) return
    setActiveVideoIndex((i) => i - 1)
    setHasStarted(false)
    trackedMilestones.current.clear()
  }

  const goToNext = () => {
    if (!hasNext) return
    setActiveVideoIndex((i) => i + 1)
    setHasStarted(false)
    trackedMilestones.current.clear()
  }

  const selectSection = (sectionId) => {
    if (sectionId !== activeSectionId) setActiveSectionId(sectionId)
  }

  const selectVideo = (index) => {
    if (index === activeVideoIndex) return
    setActiveVideoIndex(index)
    setHasStarted(false)
    trackedMilestones.current.clear()
    setShowPlaylist(false)
    setTimeout(() => videoRef.current?.play(), 100)
  }

  const formatTime = (seconds) => {
    const s = Number.isFinite(seconds) ? seconds : 0
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Control dock: always visible by default (touch / coarse). On fine-pointer
  // hover devices, hide until hover or focus-within; drop pointer events when
  // hidden so the play overlay still receives taps/clicks.
  const controlDockClass =
    'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pb-3 pt-8 ' +
    'opacity-100 pointer-events-auto ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:opacity-0 ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:pointer-events-none ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:group-hover/video:opacity-100 ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:group-hover/video:pointer-events-auto ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:group-focus-within/video:opacity-100 ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:group-focus-within/video:pointer-events-auto ' +
    'transition-opacity motion-reduce:transition-none'

  const sideNavClass =
    'absolute top-1/2 -translate-y-1/2 min-h-11 min-w-11 rounded-full bg-black/60 flex items-center justify-center ' +
    'opacity-100 pointer-events-auto ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:opacity-0 ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:pointer-events-none ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:group-hover/video:opacity-100 ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:group-hover/video:pointer-events-auto ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:group-focus-within/video:opacity-100 ' +
    'md:[@media(hover:hover)_and_(pointer:fine)]:group-focus-within/video:pointer-events-auto ' +
    'hover:bg-black/80 transition-all motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:opacity-30 disabled:pointer-events-none'

  return (
    <div className="flex w-full flex-col items-center">
      {/* Mobile segmented demo selector */}
      <div className="mb-4 w-full max-w-4xl md:hidden">
        <div
          role="tablist"
          aria-label="Demo section"
          className="flex items-stretch gap-1 rounded-md border border-edge bg-surface p-1"
        >
          {sections.map((section) => {
            const isActive = section.id === activeSectionId
            const available = section.videos && section.videos.length > 0
            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="demo-panel"
                id={`demo-tab-${section.id}`}
                disabled={!available}
                onClick={() => available && selectSection(section.id)}
                className={`relative min-h-11 flex-1 px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace ${
                  isActive
                    ? 'text-ink'
                    : available
                      ? 'text-ink-muted hover:text-ink'
                      : 'text-ink-subtle opacity-40 cursor-not-allowed'
                }`}
              >
                {section.title}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-1 block h-0.5 bg-trace"
                  />
                )}
              </button>
            )
          })}
        </div>
        {activeSection?.description && (
          <p
            id={`demo-desc-${activeSection.id}`}
            className="mt-3 text-[13px] leading-relaxed text-ink-muted"
          >
            {activeSection.description}
          </p>
        )}
      </div>

      {/* Video Player */}
      <div className="w-full max-w-4xl">
        <div
          className="relative group/video overflow-hidden rounded-lg border border-zinc-800 bg-black"
          id="demo-panel"
          role="tabpanel"
          aria-labelledby={activeSection ? `demo-tab-${activeSection.id}` : undefined}
          aria-describedby={activeSection ? `demo-desc-${activeSection.id}` : undefined}
        >
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              src={activeVideo?.src}
              poster={activeVideo?.poster}
              preload="metadata"
              className="h-full w-full bg-black object-contain"
              muted={isMuted}
              playsInline
              onClick={togglePlay}
              aria-label={activeVideo?.title ? `Video: ${activeVideo.title}` : 'Demo video'}
            />

            {/* Play overlay */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 flex cursor-pointer items-center justify-center"
                aria-label="Play video"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl transition-all hover:scale-105 hover:bg-white motion-reduce:hover:scale-100">
                  <Play className="ml-1 h-6 w-6 text-zinc-900" fill="currentColor" />
                </div>
              </button>
            )}

            {/* Pause overlay (click-to-pause, no chrome) */}
            {isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 cursor-pointer"
                aria-label="Pause video"
              />
            )}

            {/* Prev / Next — always reachable on touch */}
            {hasMultipleVideos && (
              <>
                <button
                  type="button"
                  onClick={goToPrev}
                  disabled={!hasPrev}
                  aria-label="Previous video"
                  className={`${sideNavClass} left-2 md:left-4`}
                >
                  <ChevronLeft className="h-5 w-5 text-white" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={!hasNext}
                  aria-label="Next video"
                  className={`${sideNavClass} right-2 md:right-4`}
                >
                  <ChevronRight className="h-5 w-5 text-white" aria-hidden />
                </button>
              </>
            )}

            {/* Playlist panel (toggle-driven, not hover-only) */}
            {hasMultipleVideos && showPlaylist && (
              <div
                className="absolute right-3 top-3 z-20 max-h-[280px] w-52 overflow-y-auto rounded-lg border border-zinc-700/50 bg-black/90 p-2 shadow-2xl backdrop-blur-lg"
                role="listbox"
                aria-label="Playlist"
              >
                <p className="mb-2 px-1 font-mono text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                  {activeSection?.title} ({activeVideoIndex + 1}/{activeSection?.videos?.length})
                </p>
                <div className="space-y-1">
                  {activeSection?.videos?.map((video, index) => {
                    const isCurrent = index === activeVideoIndex
                    return (
                      <button
                        key={video.id}
                        type="button"
                        role="option"
                        aria-selected={isCurrent}
                        onClick={(e) => {
                          e.stopPropagation()
                          selectVideo(index)
                        }}
                        className={`flex min-h-11 w-full gap-2 rounded p-1.5 text-left transition-colors ${
                          isCurrent
                            ? 'border border-emerald-500/30 bg-emerald-500/20'
                            : 'border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/10'
                        }`}
                      >
                        <div className="h-7 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
                          {video.poster ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={video.poster}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Play className="h-3 w-3 text-zinc-500" aria-hidden />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4
                            className={`truncate text-[10px] font-bold uppercase ${
                              isCurrent ? 'text-emerald-400' : 'text-zinc-300'
                            }`}
                          >
                            {video.title}
                          </h4>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Transport dock */}
            <div className={controlDockClass}>
              {/* Seek — larger hit area, keyboard slider */}
              <div
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration) || 0}
                aria-valuenow={Math.round(currentTime)}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                className="mb-1 flex min-h-11 cursor-pointer items-center py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                onClick={handleSeekClick}
                onKeyDown={handleSeekKeyDown}
              >
                <div className="h-1 w-full rounded-full bg-white/30">
                  <div
                    className="relative h-full rounded-full bg-emerald-500"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-0.5">
                  <PlayerButton
                    onClick={togglePlay}
                    ariaLabel={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" aria-hidden />
                    ) : (
                      <Play className="h-5 w-5" fill="currentColor" aria-hidden />
                    )}
                  </PlayerButton>
                  <PlayerButton
                    onClick={toggleMute}
                    ariaLabel={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" aria-hidden />
                    ) : (
                      <Volume2 className="h-5 w-5" aria-hidden />
                    )}
                  </PlayerButton>
                  <span className="ml-1 font-mono text-[10px] text-white/80 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {hasMultipleVideos && (
                    <>
                      <span className="mr-1 hidden font-mono text-[10px] text-white/60 sm:inline">
                        {activeVideoIndex + 1} / {activeSection?.videos?.length}
                      </span>
                      <PlayerButton
                        onClick={() => setShowPlaylist((v) => !v)}
                        ariaLabel="Playlist"
                        ariaExpanded={showPlaylist}
                      >
                        <List className="h-5 w-5" aria-hidden />
                      </PlayerButton>
                    </>
                  )}
                  <PlayerButton onClick={handleFullscreen} ariaLabel="Fullscreen">
                    <Maximize className="h-4 w-4" aria-hidden />
                  </PlayerButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Always-visible mobile clip rail */}
      {hasMultipleVideos && (
        <div className="mt-3 w-full max-w-4xl md:hidden">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="toolbar"
            aria-label="Clips in this section"
          >
            {activeSection.videos.map((video, index) => {
              const isCurrent = index === activeVideoIndex
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => selectVideo(index)}
                  aria-current={isCurrent ? 'true' : undefined}
                  aria-pressed={isCurrent}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace ${
                    isCurrent
                      ? 'border-trace/40 text-ink bg-[color-mix(in_oklab,var(--trace)_10%,transparent)]'
                      : 'border-edge text-ink-muted hover:border-edge-dim hover:text-ink'
                  }`}
                >
                  <span className="text-ink-muted tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{video.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Desktop category cards */}
      <div className="mt-6 hidden w-full max-w-4xl md:block">
        <div className="flex gap-4">
          {sections.map((section) => (
            <CategoryCard
              key={section.id}
              title={section.title}
              description={section.description}
              isActive={section.id === activeSectionId}
              isAvailable={section.videos && section.videos.length > 0}
              videoCount={section.videos?.length || 0}
              onClick={() => section.videos?.length > 0 && selectSection(section.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
