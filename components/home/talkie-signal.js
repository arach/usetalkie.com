/**
 * Shared signal maths for the homepage's Talkie flourishes.
 *
 * Both the recording bar and the cursor companion are ports of the real
 * macOS overlay (TalkieAgent/Views/Overlay/RecordingOverlay.swift and
 * CursorMicrophoneIndicator.swift). The native views read a live microphone
 * level. The website asks for no microphone permission, so the same pipeline is
 * fed either by a synthesised speech envelope or — where a real capture is
 * playing, as in the hero — by that clip's own waveform. The animation is the
 * real algorithm; only its input is substituted.
 */

// Tuning defaults lifted from ParticleTuning (Debug/DebugKit.swift).
export const PARTICLE_TUNING = {
  baseSpeed: 0.1,
  speedVariation: 0.08,
  waveSpeed: 2.5,
  baseAmplitude: 0.3,
  audioAmplitude: 0.85,
  baseSize: 2,
  inputSensitivity: 2.6,
}

// `calm` mode in the native overlay. The website only ever uses the calm
// variant: this is decoration beside the copy, not the app's own foreground.
export const CALM_FACTOR = 0.42

// Level smoothing windows, in seconds (recordingOverlayParticleLevel*Duration).
const ATTACK = 0.08
const RELEASE = 0.28

/**
 * Golden-ratio seeds. Each particle's whole path is a function of its seed and
 * the clock, so there is no per-particle state to carry between frames.
 */
export function buildParticleConstants(count) {
  return Array.from({ length: count }, (_, i) => {
    const seed = i * 1.618033988749
    return {
      seed,
      speedSeed: seed % 1,
      primaryPhase: seed * 4,
      secondaryPhase: seed * 6,
      laneOffset: ((i % 10) / 10 - 0.5) * 0.3,
      sizeVariation: 0.5 + Math.sin(seed * 5) * 0.5,
    }
  })
}

/**
 * A stand-in for a voice. Three incommensurate rates layered so the result
 * never audibly loops: a slow phrase gate that opens and closes for breaths,
 * a syllable rate inside it, and a faster grain on top.
 */
export function speechEnvelope(t) {
  const phrase = 0.5 + 0.5 * Math.sin(t * 0.61 + 1.3)
  const syllable = 0.5 + 0.5 * Math.sin(t * 5.1)
  const grain = 0.5 + 0.5 * Math.sin(t * 11.7 + 0.4)
  // Hold the gate shut below its floor so phrases are separated by near-silence.
  const gate = Math.max(0, phrase - 0.18) / 0.82
  return Math.min(1, gate * (0.28 + 0.52 * syllable + 0.2 * grain))
}

/**
 * The level of whatever is currently playing through `analyser`, as RMS over
 * one time-domain window.
 *
 * Where `speechEnvelope` stands in for a voice, this *is* the voice: the hero
 * plays a real capture, so its mark can fill from the same waveform you hear.
 * Spoken RMS sits around 0.05–0.2, well below the 0–1 range the overlay's
 * compression curve expects, so it is lifted to match a live microphone's.
 */
const ANALYSER_GAIN = 2.6

export function readAnalyserLevel(analyser, buffer) {
  if (!analyser) return 0
  analyser.getByteTimeDomainData(buffer)
  let sum = 0
  for (let i = 0; i < buffer.length; i += 1) {
    const sample = (buffer[i] - 128) / 128
    sum += sample * sample
  }
  return Math.min(1, Math.sqrt(sum / buffer.length) * ANALYSER_GAIN)
}

/** Asymmetric smoothing: quick to rise with the voice, slow to fall away. */
export function smoothTowards(current, target, dt) {
  const duration = target > current ? ATTACK : RELEASE
  return current + (target - current) * (1 - Math.exp(-dt / duration))
}

/**
 * The overlay's compression curve. `floor` keeps a trace of movement alive
 * through the silent stretches, exactly as the native canvas does.
 */
export function compressLevel(rawLevel, floor = 0.08) {
  const scaled = rawLevel * PARTICLE_TUNING.inputSensitivity
  return Math.max(floor, 1 - Math.exp(-scaled))
}

/**
 * Draw one frame of the wavy particle field onto a 2D context, in CSS pixels.
 * A direct port of WavyParticlesCanvas' inner loop, flowing left to right.
 */
export function drawParticleField(ctx, { width, height, time, level, constants, color }) {
  const {
    baseSpeed,
    speedVariation,
    waveSpeed,
    baseAmplitude,
    audioAmplitude,
    baseSize,
  } = PARTICLE_TUNING

  const centerY = height / 2
  const resolvedBaseSpeed = baseSpeed * CALM_FACTOR
  const waveAmplitude = (baseAmplitude + level * audioAmplitude) * CALM_FACTOR
  const resolvedWaveSpeed = waveSpeed * CALM_FACTOR
  const levelBonus = level * 6

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = color

  for (const particle of constants) {
    const speed = resolvedBaseSpeed + particle.speedSeed * speedVariation
    const xProgress = (time * speed + particle.seed) % 1
    const x = xProgress * width

    const primaryWave = Math.sin(time * resolvedWaveSpeed + particle.primaryPhase) * waveAmplitude
    const secondaryWave =
      Math.sin(time * (resolvedWaveSpeed * 0.6) + particle.secondaryPhase) * waveAmplitude * 0.3
    const y = centerY + (primaryWave + secondaryWave + particle.laneOffset) * centerY * 0.7

    // Particles fade in off the left edge and out before the right, so nothing
    // pops into existence at the pill's rounded ends.
    const edgeScale = Math.min(xProgress * 3, 1) * Math.min((1 - xProgress) * 2, 1)
    const size = (baseSize + levelBonus * particle.sizeVariation) * Math.max(0.35, edgeScale)

    ctx.beginPath()
    ctx.arc(x, y, size / 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * Size a canvas to its element box at device resolution and return the CSS-pixel
 * dimensions to draw in. Returns null while the element has no layout.
 */
export function fitCanvas(canvas) {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (!width || !height) return null
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const pixelWidth = Math.round(width * dpr)
  const pixelHeight = Math.round(height * dpr)
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { ctx, width, height }
}
