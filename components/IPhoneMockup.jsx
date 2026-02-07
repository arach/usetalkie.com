"use client"
import React, { useRef, useEffect, useState } from 'react'
import { trackVideoPlay, trackVideoProgress } from '../lib/analytics'

/**
 * IPhoneMockup - Display video inside an iPhone frame
 *
 * @param {string} videoSrc - Video source URL
 * @param {string} title - Video title for analytics
 * @param {boolean} autoPlay - Auto-play (muted)
 * @param {boolean} loop - Loop the video
 */
export default function IPhoneMockup({
  videoSrc,
  title = 'iphone-video',
  autoPlay = true,
  loop = true,
  className = '',
}) {
  const videoRef = useRef(null)
  const [hasStarted, setHasStarted] = useState(false)
  const trackedMilestones = useRef(new Set())

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      if (!hasStarted) {
        setHasStarted(true)
        trackVideoPlay(title, video.duration)
      }
    }

    const handleTimeUpdate = () => {
      if (!video.duration) return
      const progress = (video.currentTime / video.duration) * 100
      const milestones = [25, 50, 75, 100]
      for (const m of milestones) {
        if (progress >= m && !trackedMilestones.current.has(m)) {
          trackedMilestones.current.add(m)
          trackVideoProgress(title, m)
        }
      }
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [title, hasStarted])

  return (
    <div className={`relative inline-block ${className}`}>
      {/* iPhone frame image */}
      <img
        src="/images/iphone-mockup.png"
        alt="iPhone"
        className="w-full h-auto relative z-10 pointer-events-none"
      />

      {/* Video positioned inside the screen area */}
      {/* Adjust these values to match the screen position in the mockup */}
      <div
        className="absolute z-0 overflow-hidden rounded-[2.5rem]"
        style={{
          top: '6.8%',
          left: '5.8%',
          width: '88.5%',
          height: '87.5%',
        }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay={autoPlay}
          loop={loop}
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
