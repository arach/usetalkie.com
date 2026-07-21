/**
 * sfx.js — small synth ticks for the SignalTable / Narrator choreography.
 *
 * Built on top of the existing AudioContext owned by SignalTable /
 * NarratorProvider, so we reuse one graph instead of spinning up
 * another (Safari has a hard limit on concurrent contexts). Each tick
 * is a short oscillator → gain envelope → destination chain that
 * cleans itself up via osc.stop().
 *
 * Tones are deliberately quiet (peak gain ~0.12) and short (<70ms each)
 * — they should feel like keyboard / typewriter feedback, not a UI alert.
 *
 * Two tick families:
 *   playPressTick(ctx) — high-pitched downward chirp, ~50ms.
 *                        "key down" feel. Fires when ⌘⇧A is pressed
 *                        to start a capture.
 *   playPasteTick(ctx) — two low ticks ~60ms apart, ~50ms each.
 *                        "drop into the buffer" feel. Fires when the
 *                        captured signal lands in the dictation table.
 *
 * Both gracefully no-op if `ctx` is null/undefined or in a state where
 * scheduling would fail (defensive — this is decorative, not load-
 * bearing). Caller is responsible for calling `ctx.resume()` before
 * the first tick (the existing AudioContext lazy-init paths already do).
 */

export function playPressTick(ctx) {
  if (!ctx || ctx.state === 'closed') return
  try {
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(960, t0)
    osc.frequency.exponentialRampToValueAtTime(520, t0 + 0.045)

    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(0.11, t0 + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05)

    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.06)
  } catch {
    // Decorative — never throw on failure.
  }
}

export function playPasteTick(ctx) {
  if (!ctx || ctx.state === 'closed') return
  try {
    const t0 = ctx.currentTime
    // Two low ticks, slightly different pitch — reads as "drop · in"
    const tones = [
      { freq: 380, start: 0,    dur: 0.05, peak: 0.13 },
      { freq: 280, start: 0.07, dur: 0.06, peak: 0.10 },
    ]
    for (const tone of tones) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(tone.freq, t0 + tone.start)
      gain.gain.setValueAtTime(0, t0 + tone.start)
      gain.gain.linearRampToValueAtTime(tone.peak, t0 + tone.start + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + tone.start + tone.dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t0 + tone.start)
      osc.stop(t0 + tone.start + tone.dur + 0.01)
    }
  } catch {
    // Decorative — never throw on failure.
  }
}

/** A quieter, single-note relay tick for user-driven surface changes. */
export function playSurfaceTick(ctx, surfaceIndex = 0) {
  if (!ctx || ctx.state === 'closed') return
  try {
    const t0 = ctx.currentTime
    const frequencies = [410, 470, 540, 620]
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(
      frequencies[surfaceIndex % frequencies.length],
      t0
    )
    osc.frequency.exponentialRampToValueAtTime(
      frequencies[surfaceIndex % frequencies.length] * 0.82,
      t0 + 0.045
    )

    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(0.035, t0 + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.055)

    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.065)
  } catch {
    // Decorative — never throw on failure.
  }
}

/** A soft two-note aperture sound for opening and closing the spotlight. */
export function playSpotlightTick(ctx, opening = true) {
  if (!ctx || ctx.state === 'closed') return
  try {
    const t0 = ctx.currentTime
    const frequencies = opening ? [330, 495] : [495, 330]

    frequencies.forEach((frequency, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = t0 + index * 0.045

      osc.type = 'sine'
      osc.frequency.setValueAtTime(frequency, start)
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.028, start + 0.006)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.075)

      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.085)
    })
  } catch {
    // Decorative — never throw on failure.
  }
}
