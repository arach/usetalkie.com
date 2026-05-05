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
    <div className={`group relative inline-block transition-transform duration-500 ease-out hover:-translate-y-1 ${className}`}>
      {/* Soft phosphor halo — only visible on hover. Sits behind the
          frame so the device appears to glow from within. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: '0 0 60px -10px var(--trace-glow), 0 0 24px -4px var(--trace-glow)',
        }}
      />

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
        {/* Slow scanline shimmer — pure CSS, masked to the screen so it
            sells the "live phosphor" feel without overpowering the video. */}
        <div
          aria-hidden
          className="iphone-mockup-scanline pointer-events-none absolute inset-0 mix-blend-overlay opacity-25"
        />
      </div>

      <style>{`
        @keyframes iphone-mockup-scanline {
          0%   { transform: translateY(-30%); }
          100% { transform: translateY(30%); }
        }
        .iphone-mockup-scanline {
          background-image: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 3px,
            rgba(255,255,255,0.10) 3px,
            rgba(255,255,255,0.10) 4px
          );
          animation: iphone-mockup-scanline 7s linear infinite;
        }
      `}</style>
    </div>
  )
}
