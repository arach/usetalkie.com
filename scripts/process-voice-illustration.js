import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const DEFAULT_INPUT = 'public/images/workflows/voice-in-drafts-tasks-files-source.png'
const DEFAULT_OUTPUT = 'public/images/workflows/voice-in-drafts-tasks-files-processed.png'
const DEFAULT_MANIFEST = 'public/images/workflows/voice-in-drafts-tasks-files-processed.manifest.json'

const PROGRAM = {
  name: 'talkie-signal-weave',
  version: '1.1.0',
  description:
    'Preserves the source illustration, then adds deterministic signal lanes, packet marks, and edge-derived trace fields so the final asset reads as programmatically processed.',
}

const BAYER_8 = [
  0, 48, 12, 60, 3, 51, 15, 63,
  32, 16, 44, 28, 35, 19, 47, 31,
  8, 56, 4, 52, 11, 59, 7, 55,
  40, 24, 36, 20, 43, 27, 39, 23,
  2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29,
  10, 58, 6, 54, 9, 57, 5, 53,
  42, 26, 38, 22, 41, 25, 37, 21,
]

const PALETTE = [
  [246, 240, 226], // canvas
  [232, 222, 201], // parchment shadow
  [207, 199, 179], // grid and soft depth
  [142, 153, 139], // quiet sage gray
  [69, 91, 79],    // sage ink
  [47, 143, 114],  // accent
  [43, 42, 36],    // soft ink
  [22, 20, 17],    // deepest ink
]

function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    manifest: DEFAULT_MANIFEST,
    workWidth: 1440,
    outputWidth: 1440,
    strength: 22,
    paletteMix: 0.58,
    traceBoost: 1.65,
    writeManifest: true,
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === '--input') options.input = args[++i]
    else if (arg === '--output') options.output = args[++i]
    else if (arg === '--manifest') options.manifest = args[++i]
    else if (arg === '--work-width') options.workWidth = Number(args[++i])
    else if (arg === '--output-width') options.outputWidth = Number(args[++i])
    else if (arg === '--strength') options.strength = Number(args[++i])
    else if (arg === '--palette-mix') options.paletteMix = Number(args[++i])
    else if (arg === '--trace-boost') options.traceBoost = Number(args[++i])
    else if (arg === '--no-manifest') options.writeManifest = false
  }

  if (!Number.isFinite(options.workWidth) || options.workWidth <= 0) {
    throw new Error('--work-width must be a positive number')
  }
  if (!Number.isFinite(options.outputWidth) || options.outputWidth <= 0) {
    throw new Error('--output-width must be a positive number')
  }
  if (!Number.isFinite(options.strength) || options.strength < 0) {
    throw new Error('--strength must be a non-negative number')
  }
  if (!Number.isFinite(options.paletteMix) || options.paletteMix < 0 || options.paletteMix > 1) {
    throw new Error('--palette-mix must be a number between 0 and 1')
  }
  if (!Number.isFinite(options.traceBoost) || options.traceBoost <= 0) {
    throw new Error('--trace-boost must be a positive number')
  }

  return options
}

function nearestPaletteColor(r, g, b) {
  let best = PALETTE[0]
  let bestDistance = Infinity

  for (const color of PALETTE) {
    const dr = r - color[0]
    const dg = g - color[1]
    const db = b - color[2]
    const distance = dr * dr * 0.9 + dg * dg * 1.12 + db * db * 0.92
    if (distance < bestDistance) {
      bestDistance = distance
      best = color
    }
  }

  return best
}

function clamp(value) {
  return Math.max(0, Math.min(255, value))
}

function hash2(x, y, seed = 0) {
  let n = Math.imul(x + 0x9e3779b9, 0x85ebca6b)
  n ^= Math.imul(y + seed + 0xc2b2ae35, 0x27d4eb2f)
  n ^= n >>> 15
  n = Math.imul(n, 0x2c1b3c6d)
  n ^= n >>> 12
  n = Math.imul(n, 0x297a2d39)
  n ^= n >>> 15
  return (n >>> 0) / 0xffffffff
}

function mixChannel(a, b, amount) {
  return Math.round(a * (1 - amount) + b * amount)
}

function sourceLuma(data, width, height, channels, x, y) {
  const sx = Math.max(0, Math.min(width - 1, x))
  const sy = Math.max(0, Math.min(height - 1, y))
  const i = (sy * width + sx) * channels
  return data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722
}

function blendPixel(buffer, width, height, x, y, color, alpha) {
  if (x < 0 || x >= width || y < 0 || y >= height) return
  const i = (y * width + x) * 3
  buffer[i] = mixChannel(buffer[i], color[0], alpha)
  buffer[i + 1] = mixChannel(buffer[i + 1], color[1], alpha)
  buffer[i + 2] = mixChannel(buffer[i + 2], color[2], alpha)
}

const TRACE_COLOR = [18, 157, 119]
const TRACE_HALO_COLOR = [130, 195, 166]
const TRACE_DARK_COLOR = [34, 91, 76]

function stampTrace(buffer, width, height, x, y, radius, alpha, options = {}) {
  const trace = options.color ?? TRACE_COLOR
  const halo = options.halo ?? TRACE_HALO_COLOR
  const boostedAlpha = Math.min(1, alpha * (options.boost ?? 1))
  const cx = Math.round(x)
  const cy = Math.round(y)

  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance > radius) continue
      const falloff = 1 - distance / (radius + 0.001)
      blendPixel(buffer, width, height, cx + dx, cy + dy, halo, boostedAlpha * falloff * 0.62)
    }
  }

  blendPixel(buffer, width, height, cx, cy, trace, boostedAlpha)
}

function drawSegment(buffer, width, height, x1, y1, x2, y2, radius, alpha, options = {}) {
  const dx = x2 - x1
  const dy = y2 - y1
  const steps = Math.max(1, Math.ceil(Math.sqrt(dx * dx + dy * dy)))

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    stampTrace(
      buffer,
      width,
      height,
      x1 + dx * t,
      y1 + dy * t,
      radius,
      alpha,
      options,
    )
  }
}

function drawSmallDash(buffer, width, height, x, y, angle, length, radius, alpha, options = {}) {
  const half = length / 2
  const dx = Math.cos(angle) * half
  const dy = Math.sin(angle) * half
  drawSegment(buffer, width, height, x - dx, y - dy, x + dx, y + dy, radius, alpha, options)
}

function cubicBezier(points, t) {
  const inv = 1 - t
  return {
    x:
      inv * inv * inv * points[0][0] +
      3 * inv * inv * t * points[1][0] +
      3 * inv * t * t * points[2][0] +
      t * t * t * points[3][0],
    y:
      inv * inv * inv * points[0][1] +
      3 * inv * inv * t * points[1][1] +
      3 * inv * t * t * points[2][1] +
      t * t * t * points[3][1],
  }
}

const TRACE_CURVES = [
  [[158, 420], [330, 406], [488, 386], [684, 415]],
  [[684, 415], [820, 326], [944, 198], [1086, 162]],
  [[694, 423], [846, 384], [982, 386], [1128, 391]],
  [[700, 435], [858, 508], [998, 586], [1138, 604]],
]

function drawProgrammaticTraces(buffer, width, height, traceBoost) {
  const scaleX = width / 1440
  const scaleY = height / 810

  for (const curve of TRACE_CURVES) {
    const scaled = curve.map(([x, y]) => [x * scaleX, y * scaleY])
    let previousPoint = null
    for (let step = 0; step <= 320; step += 1) {
      const t = step / 320
      const point = cubicBezier(scaled, t)
      const jitter = (hash2(step, Math.round(point.y), 17) - 0.5) * 4
      const dash = Math.floor(t * 62) % 7
      const radius = hash2(step, Math.round(point.x), 31) > 0.7 ? 2 : 1
      const alpha = 0.28 + hash2(Math.round(point.x), step, 43) * 0.5

      if (previousPoint && dash <= 2) {
        drawSegment(
          buffer,
          width,
          height,
          previousPoint.x,
          previousPoint.y,
          point.x,
          point.y + jitter,
          radius,
          alpha,
          { boost: traceBoost },
        )
      }

      if (step % 20 === 0) {
        stampTrace(buffer, width, height, point.x, point.y + jitter, 3, 0.72, { boost: traceBoost })
      }

      if (step % 8 === 0) {
        stampTrace(
          buffer,
          width,
          height,
          point.x + (hash2(step, 3, 59) - 0.5) * 26,
          point.y + (hash2(step, 7, 61) - 0.5) * 26,
          1,
          alpha * 0.62,
          { boost: traceBoost },
        )
      }

      previousPoint = { x: point.x, y: point.y + jitter }
    }
  }
}

function addEdgeTraces(buffer, source, info, channels, traceBoost) {
  for (let y = 1; y < info.height - 1; y += 2) {
    for (let x = 1; x < info.width - 1; x += 2) {
      const l = sourceLuma(source, info.width, info.height, channels, x, y)
      const right = sourceLuma(source, info.width, info.height, channels, x + 2, y)
      const down = sourceLuma(source, info.width, info.height, channels, x, y + 2)
      const gx = right - l
      const gy = down - l
      const edge = Math.abs(gx) + Math.abs(gy)
      const darkEnough = l < 232
      const sparse = hash2(x, y, 101) < Math.min(0.072, edge / 980)

      if (edge > 16 && darkEnough && sparse) {
        const alpha = 0.18 + Math.min(0.36, edge / 160)
        const angle = Math.atan2(gy, gx) + Math.PI / 2
        const length = 3 + Math.min(7, edge / 18)
        drawSmallDash(buffer, info.width, info.height, x, y, angle, length, 1, alpha, {
          boost: traceBoost,
          color: hash2(x, y, 127) > 0.7 ? TRACE_DARK_COLOR : TRACE_COLOR,
        })
      }
    }
  }
}

function drawPacketField(buffer, width, height, traceBoost) {
  const bounds = {
    x1: Math.round(width * 0.23),
    x2: Math.round(width * 0.78),
    y1: Math.round(height * 0.2),
    y2: Math.round(height * 0.78),
  }

  for (let y = bounds.y1; y <= bounds.y2; y += 18) {
    for (let x = bounds.x1; x <= bounds.x2; x += 18) {
      const n = hash2(x, y, 211)
      if (n > 0.14) continue

      const angle = (hash2(x, y, 223) - 0.5) * 0.7
      const length = 4 + Math.round(hash2(x, y, 227) * 10)
      const radius = hash2(x, y, 229) > 0.86 ? 2 : 1
      const alpha = 0.12 + hash2(x, y, 233) * 0.26

      drawSmallDash(buffer, width, height, x, y, angle, length, radius, alpha, { boost: traceBoost })
    }
  }
}

async function processImage() {
  const {
    input,
    output,
    manifest,
    workWidth,
    outputWidth,
    strength,
    paletteMix,
    traceBoost,
    writeManifest,
  } = parseArgs()
  const inputBuffer = await readFile(input)
  const inputSha256 = createHash('sha256').update(inputBuffer).digest('hex')

  const { data, info } = await sharp(input)
    .resize({ width: workWidth, withoutEnlargement: true })
    .removeAlpha()
    .modulate({ saturation: 0.82, brightness: 1.01 })
    .linear(1.025, -3)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const channels = info.channels
  const processed = Buffer.alloc(info.width * info.height * 3)

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const sourceIndex = (y * info.width + x) * channels
      const targetIndex = (y * info.width + x) * 3
      const threshold = ((BAYER_8[(y % 8) * 8 + (x % 8)] / 63) - 0.5) * strength

      const r = clamp(data[sourceIndex] + threshold)
      const g = clamp(data[sourceIndex + 1] + threshold)
      const b = clamp(data[sourceIndex + 2] + threshold)
      const [pr, pg, pb] = nearestPaletteColor(r, g, b)

      processed[targetIndex] = mixChannel(data[sourceIndex], pr, paletteMix)
      processed[targetIndex + 1] = mixChannel(data[sourceIndex + 1], pg, paletteMix)
      processed[targetIndex + 2] = mixChannel(data[sourceIndex + 2], pb, paletteMix)
    }
  }

  addEdgeTraces(processed, data, info, channels, traceBoost)
  drawPacketField(processed, info.width, info.height, traceBoost)
  drawProgrammaticTraces(processed, info.width, info.height, traceBoost)

  await mkdir(path.dirname(output), { recursive: true })
  await sharp(processed, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 3,
    },
  })
    .resize({ width: outputWidth, kernel: sharp.kernel.nearest })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(output)

  if (writeManifest) {
    const outputBuffer = await readFile(output)
    const outputSha256 = createHash('sha256').update(outputBuffer).digest('hex')
    const manifestBody = {
      program: PROGRAM,
      storage: {
        source: DEFAULT_INPUT,
        output,
        manifest,
      },
      input: {
        path: input,
        sha256: inputSha256,
      },
      output: {
        path: output,
        sha256: outputSha256,
        width: outputWidth,
      },
      parameters: {
        workWidth,
        outputWidth,
        orderedMatrixStrength: strength,
        paletteMix,
        traceBoost,
        traceColor: TRACE_COLOR,
        traceHaloColor: TRACE_HALO_COLOR,
        traceDarkColor: TRACE_DARK_COLOR,
        edgeSampleStep: 2,
        edgeThreshold: 16,
        traceCurves: TRACE_CURVES,
      },
      stages: [
        'Normalize: resize the source to a stable working width, remove alpha, and apply light saturation/contrast normalization.',
        'Palette anchor: use an 8x8 ordered matrix to mix each pixel partway toward a constrained Talkie palette while preserving the original image.',
        'Edge sampling: derive sparse emerald dashes from local luminance differences so details look touched by a program, not globally filtered.',
        'Packet field: place deterministic short marks across the transformation zone, as if signal fragments are crossing the image.',
        'Signal routing: draw deterministic dashed Bezier lanes from the voice capsule toward the draft, task, and file artifacts.',
        'Store: write the processed PNG and this manifest next to the source artifact.',
      ],
    }

    await mkdir(path.dirname(manifest), { recursive: true })
    await writeFile(manifest, `${JSON.stringify(manifestBody, null, 2)}\n`)
  }

  console.log(`Processed ${input} -> ${output}`)
  if (writeManifest) console.log(`Manifest ${manifest}`)
}

processImage().catch((error) => {
  console.error(error)
  process.exit(1)
})
