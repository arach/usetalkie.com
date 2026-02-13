"use client"
import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'
import { trackVideoPlay, trackVideoProgress } from '../lib/analytics'

const CategoryCard = ({ icon: Icon, title, description, isActive, isAvailable, onClick, videoCount }) => (
  <button
    onClick={onClick}
    disabled={!isAvailable}
    className={`flex-1 p-4 rounded-lg border text-left transition-all ${
      isActive
        ? 'border-emerald-500/30'
        : isAvailable
          ? 'border-zinc-700 hover:border-zinc-600 cursor-pointer'
          : 'border-zinc-800 opacity-40 cursor-not-allowed'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {isActive && (
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
        )}
        <h3 className={`text-sm font-bold uppercase tracking-wide ${
          isActive ? 'text-white' : 'text-white'
        }`}>
          {title}
        </h3>
      </div>
      {isAvailable ? (
        <span className="text-[9px] font-mono text-zinc-500">{videoCount} video{videoCount !== 1 ? 's' : ''}</span>
      ) : (
        <span className="text-[9px] font-mono text-zinc-600 uppercase">Soon</span>
      )}
    </div>
    <p className="text-[10px] text-zinc-500 leading-relaxed">{description}</p>
  </button>
)

export default function DemoViewer({ sections = [] }) {
  const videoRef = useRef(null)
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || null)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const trackedMilestones = useRef(new Set())

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0]
  const activeVideo = activeSection?.videos?.[activeVideoIndex] || activeSection?.videos?.[0]
  const hasMultipleVideos = activeSection?.videos?.length > 1
  const hasPrev = activeVideoIndex > 0
  const hasNext = activeVideoIndex < (activeSection?.videos?.length || 1) - 1

  useEffect(() => {
    setActiveVideoIndex(0)
    setHasStarted(false)
    trackedMilestones.current.clear()
  }, [activeSectionId])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100
      setProgress(currentProgress)

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
      if (hasNext) {
        setActiveVideoIndex(i => i + 1)
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
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = clickX / rect.width
    video.currentTime = percent * video.duration
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen()
      }
    }
  }

  const goToPrev = () => {
    if (hasPrev) {
      setActiveVideoIndex(i => i - 1)
      setHasStarted(false)
      trackedMilestones.current.clear()
    }
  }

  const goToNext = () => {
    if (hasNext) {
      setActiveVideoIndex(i => i + 1)
      setHasStarted(false)
      trackedMilestones.current.clear()
    }
  }

  const selectSection = (sectionId) => {
    if (sectionId !== activeSectionId) {
      setActiveSectionId(sectionId)
    }
  }

  const selectVideo = (index) => {
    if (index !== activeVideoIndex) {
      setActiveVideoIndex(index)
      setHasStarted(false)
      trackedMilestones.current.clear()
      setTimeout(() => videoRef.current?.play(), 100)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center">
      {/* Video Player - Centered */}
      <div className="w-full max-w-4xl">
        <div
          className="relative group/video rounded-lg overflow-hidden bg-black border border-zinc-800"
          onMouseEnter={() => setShowPlaylist(true)}
          onMouseLeave={() => setShowPlaylist(false)}
        >
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              src={activeVideo?.src}
              poster={activeVideo?.poster}
              preload="metadata"
              className="w-full h-full object-contain bg-black"
              muted={isMuted}
              playsInline
              onClick={togglePlay}
            />

            {/* Play overlay */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                aria-label="Play video"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xl hover:scale-105 transition-all">
                  <Play className="w-6 h-6 text-zinc-900 ml-1" fill="currentColor" />
                </div>
              </button>
            )}

            {/* Pause overlay */}
            {isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 cursor-pointer"
                aria-label="Pause video"
              />
            )}

            {/* Prev/Next */}
            {hasMultipleVideos && (
              <>
                <button
                  onClick={goToPrev}
                  disabled={!hasPrev}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center transition-all ${
                    hasPrev ? 'opacity-0 group-hover/video:opacity-100 hover:bg-black/80 cursor-pointer' : 'opacity-0'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={!hasNext}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center transition-all ${
                    hasNext ? 'opacity-0 group-hover/video:opacity-100 hover:bg-black/80 cursor-pointer' : 'opacity-0'
                  }`}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}

            {/* Playlist overlay */}
            {hasMultipleVideos && showPlaylist && (
              <div className="absolute top-3 right-3 w-48 bg-black/90 backdrop-blur-lg rounded-lg p-2 shadow-2xl border border-zinc-700/50 max-h-[280px] overflow-y-auto">
                <p className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 px-1">
                  {activeSection?.title} ({activeVideoIndex + 1}/{activeSection?.videos?.length})
                </p>
                <div className="space-y-1">
                  {activeSection?.videos?.map((video, index) => {
                    const isCurrent = index === activeVideoIndex
                    return (
                      <button
                        key={video.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          selectVideo(index)
                        }}
                        className={`w-full flex gap-2 p-1.5 rounded transition-colors ${
                          isCurrent
                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                            : 'border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/10'
                        }`}
                      >
                        <div className="w-12 h-7 rounded bg-zinc-800 flex-shrink-0 overflow-hidden">
                          <video src={video.src} className="w-full h-full object-cover" muted />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className={`text-[10px] font-bold uppercase truncate ${
                            isCurrent ? 'text-emerald-400' : 'text-zinc-300'
                          }`}>
                            {video.title}
                          </h4>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover/video:opacity-100 transition-opacity">
              <div
                className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-emerald-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white hover:text-emerald-400 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-emerald-400 transition-colors">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-[10px] font-mono text-white/80">
                    {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasMultipleVideos && (
                    <span className="text-[10px] font-mono text-white/60">
                      {activeVideoIndex + 1} / {activeSection?.videos?.length}
                    </span>
                  )}
                  <button onClick={handleFullscreen} className="text-white hover:text-emerald-400 transition-colors">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards - Three side by side below video */}
      <div className="w-full max-w-4xl mt-6">
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
