"use client"
import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'
import { trackVideoPlay, trackVideoProgress } from '../lib/analytics'

/**
 * VideoPlayer - A custom video player with tracking
 *
 * @param {string} src - Video source URL
 * @param {string} poster - Optional poster image
 * @param {string} title - Video title for analytics
 * @param {string} aspectRatio - 'square' (1:1) or 'wide' (16:9)
 * @param {boolean} autoPlay - Auto-play on mount (muted)
 * @param {boolean} loop - Loop the video
 * @param {boolean} showControls - Show custom controls
 */
export default function VideoPlayer({
  src,
  poster,
  title = 'video',
  aspectRatio = 'square',
  autoPlay = false,
  loop = false,
  showControls = true,
  className = '',
}) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(autoPlay) // Muted if autoplay
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const trackedMilestones = useRef(new Set())

  const aspectClasses = {
    square: 'aspect-square',
    wide: 'aspect-video',
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100
      setProgress(currentProgress)

      // Track milestones
      const milestones = [25, 50, 75, 100]
      for (const milestone of milestones) {
        if (currentProgress >= milestone && !trackedMilestones.current.has(milestone)) {
          trackedMilestones.current.add(milestone)
          trackVideoProgress(title, milestone)
        }
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
      if (!hasStarted) {
        setHasStarted(true)
        trackVideoPlay(title, video.duration)
      }
    }

    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

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
  }, [title, hasStarted])

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

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`relative group ${className}`}>
      <div className={`relative ${aspectClasses[aspectRatio]} bg-black rounded-lg overflow-hidden`}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          playsInline
          className="w-full h-full object-contain"
        />

        {/* Click to play overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-end justify-center pb-[12%] cursor-pointer"
            aria-label="Play video"
          >
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md transform hover:scale-110 transition-transform">
              <Play className="w-4 h-4 text-black ml-0.5" fill="currentColor" />
            </div>
          </button>
        )}

        {/* Controls bar */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Progress bar */}
            <div
              className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-emerald-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-emerald-400 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" fill="currentColor" />
                  )}
                </button>
                <button
                  onClick={handleRestart}
                  className="text-white hover:text-emerald-400 transition-colors"
                  aria-label="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-emerald-400 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <span className="text-[10px] font-mono text-white/80">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="text-white hover:text-emerald-400 transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
