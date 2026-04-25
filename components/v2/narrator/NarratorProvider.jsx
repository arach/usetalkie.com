"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * NarratorProvider — single audio graph for the floating narrator dock.
 *
 * Mounted once at the v2 layout level. Owns:
 *   - one AudioContext (lazy, autoplay-policy safe)
 *   - one shared <audio> element
 *   - one MediaElementAudioSourceNode (created exactly once for that element)
 *   - one AnalyserNode (consumed by NarratorDock's mini LiveTrace)
 *
 * Triggers throughout /v2 call `play(clip)` from context. The dock
 * subscribes to `clip` and renders itself when non-null.
 *
 * Clip shape (data-driven, matches /v2 captures contract + future hooks):
 *   {
 *     slug:   string,           // unique id, used as React key + missing-set key
 *     audio:  string,           // URL to MP3
 *     vtt?:   string,           // URL to WebVTT track (optional — captions just don't render)
 *     caption?: string,         // human-readable label shown in dock header
 *     anchor?: string,          // CSS selector or '#id' — for future scroll-into-view behavior
 *     media?: { type, src }     // for future image/video alongside the trace
 *   }
 *
 * `anchor` and `media` are intentionally read-through fields — accepted by
 * provider, exposed via context, but NOT yet consumed by the dock UI. They
 * land here now so triggers can author the full shape from day one and the
 * destination ("Full" scope) is a render-only addition, not a refactor.
 */

const NarratorCtx = createContext(null)

export function useNarrator() {
  const v = useContext(NarratorCtx)
  if (!v) throw new Error('useNarrator() must be called inside <NarratorProvider>')
  return v
}

export function NarratorProvider({ children }) {
  // -------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------
  const [clip, setClip] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [captionText, setCaptionText] = useState('')
  const [missingSet, setMissingSet] = useState(() => new Set())

  // -------------------------------------------------------------------
  // Refs (Web Audio + DOM)
  // -------------------------------------------------------------------
  const audioRef = useRef(null)
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null) // MediaElementAudioSourceNode

  // -------------------------------------------------------------------
  // Lazy AudioContext setup. Built on first user-initiated play (autoplay
  // policy). Single MediaElementSource per <audio>; re-creating throws
  // InvalidStateError so we cache it.
  // -------------------------------------------------------------------
  const ensureGraph = useCallback(() => {
    if (typeof window === 'undefined') return null
    const audio = audioRef.current
    if (!audio) return null

    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      ctxRef.current = new Ctx()
      const a = ctxRef.current.createAnalyser()
      a.fftSize = 1024
      a.smoothingTimeConstant = 0.6
      a.connect(ctxRef.current.destination)
      analyserRef.current = a
    }

    if (!sourceRef.current) {
      try {
        sourceRef.current = ctxRef.current.createMediaElementSource(audio)
        sourceRef.current.connect(analyserRef.current)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[Narrator] media source already attached', err)
      }
    }

    return ctxRef.current
  }, [])

  // -------------------------------------------------------------------
  // Public API: play / pause / close
  // -------------------------------------------------------------------
  const play = useCallback(
    async (next) => {
      if (!next) return
      if (missingSet.has(next.slug)) {
        // Missing-audio fallback: still show the dock so the user gets
        // visual feedback ("no audio yet"), but don't try to play.
        setClip(next)
        return
      }
      const audio = audioRef.current
      if (!audio) return

      ensureGraph()

      const desired = next.audio
      const cur = audio.currentSrc || audio.src
      if (!cur.endsWith(desired)) {
        audio.src = desired
        audio.load()
      }

      setClip(next)

      try {
        if (ctxRef.current && ctxRef.current.state === 'suspended') {
          await ctxRef.current.resume()
        }
        await audio.play()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[Narrator] play failed for "${next.slug}":`, err)
      }
    },
    [ensureGraph, missingSet]
  )

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const close = useCallback(() => {
    audioRef.current?.pause()
    setClip(null)
    setCaptionText('')
  }, [])

  // -------------------------------------------------------------------
  // <audio> event wiring. Re-bound when `clip` changes because `onError`
  // closes over the active slug for the missing-set update.
  // -------------------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      setIsPlaying(false)
      setCaptionText('')
    }
    const onError = () => {
      const slug = clip?.slug
      if (!slug) return
      // eslint-disable-next-line no-console
      console.warn(`[Narrator] audio error for "${slug}" (likely 404)`)
      setMissingSet((prev) => (prev.has(slug) ? prev : new Set([...prev, slug])))
      setIsPlaying(false)
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [clip])

  // -------------------------------------------------------------------
  // Captions via TextTrack `cuechange`. Re-bind on clip change because
  // each clip ships its own <track> child.
  // -------------------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audio.textTracks || audio.textTracks.length === 0) return
    const track = audio.textTracks[0]
    track.mode = 'hidden' // 'hidden' still fires cuechange; 'showing' would render native UI
    const onCue = () => {
      const cues = track.activeCues
      if (!cues || cues.length === 0) {
        setCaptionText('')
        return
      }
      setCaptionText(Array.from(cues).map((c) => c.text).join(' '))
    }
    track.addEventListener('cuechange', onCue)
    return () => track.removeEventListener('cuechange', onCue)
  }, [clip])

  // -------------------------------------------------------------------
  // Esc closes the dock.
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!clip) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clip, close])

  // -------------------------------------------------------------------
  // Cleanup on unmount.
  // -------------------------------------------------------------------
  useEffect(
    () => () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {})
        ctxRef.current = null
      }
      analyserRef.current = null
      sourceRef.current = null
    },
    []
  )

  const value = useMemo(
    () => ({
      clip,
      isPlaying,
      captionText,
      missing: clip ? missingSet.has(clip.slug) : false,
      analyserRef,
      audioRef,
      play,
      pause,
      close,
    }),
    [clip, isPlaying, captionText, missingSet, play, pause, close]
  )

  return (
    <NarratorCtx.Provider value={value}>
      {children}
      {/* Single shared <audio>. Lives at provider level so the source node
          stays attached across clip switches (re-attaching throws). The
          <track> remounts per clip via its `key`. */}
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" className="sr-only">
        {clip?.vtt && (
          <track key={clip.slug} kind="captions" src={clip.vtt} srcLang="en" label="English" default />
        )}
      </audio>
    </NarratorCtx.Provider>
  )
}
