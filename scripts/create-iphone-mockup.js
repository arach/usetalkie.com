/**
 * Create iPhone mockup with screenshot using Apple's official bezels
 *
 * Usage:
 *   node scripts/create-iphone-mockup.js <screenshot.png> [output.png] [options]
 *
 * Options:
 *   --model=17|17-pro|17-pro-max  (default: 17)
 *   --color=Black|Silver|etc      (depends on model)
 */

import sharp from 'sharp'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BEZELS_DIR = join(__dirname, '../public/images/bezels')

// Screen configs for different iPhone models
// Values are approximations - adjust as needed for pixel-perfect alignment
// deviceRadius is the outer corner radius of the device silhouette for masking
const MODELS = {
  '17': {
    name: 'iPhone 17',
    colors: ['Black', 'White', 'Lavender', 'Mist Blue', 'Sage'],
    defaultColor: 'Black',
    bezelSize: { width: 1350, height: 2760 },
    device: {
      top: 26,
      left: 19,
      width: 1311,
      height: 2708,
      radius: 72,
    },
    screen: {
      top: 62,
      left: 44,
      width: 1274,
      height: 2635,
      borderRadius: 105,
    }
  },
  '17-pro': {
    name: 'iPhone 17 Pro',
    colors: ['Silver', 'Deep Blue', 'Cosmic Orange'],
    defaultColor: 'Silver',
    bezelSize: { width: 1470, height: 3000 },
    device: {
      top: 26,
      left: 19,
      width: 1432,
      height: 2948,
      radius: 80,
    },
    screen: {
      top: 72,
      left: 36,
      width: 1398,
      height: 2856,
      borderRadius: 120,
    }
  },
  '17-pro-max': {
    name: 'iPhone 17 Pro Max',
    colors: ['Silver', 'Deep Blue', 'Cosmic Orange'],
    defaultColor: 'Silver',
    bezelSize: { width: 1470, height: 3000 },
    device: {
      top: 26,
      left: 19,
      width: 1432,
      height: 2948,
      radius: 80,
    },
    screen: {
      top: 72,
      left: 36,
      width: 1398,
      height: 2856,
      borderRadius: 120,
    }
  }
}

async function createMockup(screenshotPath, outputPath, modelKey = '17', color = null) {
  const model = MODELS[modelKey]
  if (!model) {
    console.error(`Unknown model: ${modelKey}`)
    console.log('Available models:', Object.keys(MODELS).join(', '))
    process.exit(1)
  }

  const selectedColor = color || model.defaultColor
  const bezelPath = join(BEZELS_DIR, `${model.name} - ${selectedColor} - Portrait.png`)

  if (!existsSync(bezelPath)) {
    console.error(`Bezel not found: ${bezelPath}`)
    console.log(`Available colors for ${model.name}:`, model.colors.join(', '))
    process.exit(1)
  }

  if (!existsSync(screenshotPath)) {
    console.error(`Screenshot not found: ${screenshotPath}`)
    process.exit(1)
  }

  const screen = model.screen

  try {
    console.log(`Model: ${model.name}`)
    console.log(`Color: ${selectedColor}`)
    console.log(`Screenshot: ${screenshotPath}`)
    console.log(`Screen area: ${screen.width}x${screen.height} at (${screen.left}, ${screen.top})`)

    // Load bezel
    const bezelBuffer = await sharp(bezelPath).png().toBuffer()
    const bezelMetadata = await sharp(bezelBuffer).metadata()

    // Resize screenshot to fit screen area (contain = no cropping)
    const resizedScreenshot = await sharp(screenshotPath)
      .resize(screen.width, screen.height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .png()
      .toBuffer()

    // Create rounded corner mask
    const mask = Buffer.from(
      `<svg width="${screen.width}" height="${screen.height}">
        <rect x="0" y="0" width="${screen.width}" height="${screen.height}"
              rx="${screen.borderRadius}" ry="${screen.borderRadius}"
              fill="white"/>
      </svg>`
    )

    // Apply rounded corners
    const roundedScreenshot = await sharp(resizedScreenshot)
      .composite([{
        input: await sharp(mask).png().toBuffer(),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer()

    // Composite: screenshot behind bezel
    const composited = await sharp({
      create: {
        width: bezelMetadata.width,
        height: bezelMetadata.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([
        { input: roundedScreenshot, top: screen.top, left: screen.left },
        { input: bezelBuffer, top: 0, left: 0 }
      ])
      .png()
      .toBuffer()

    // Create device silhouette mask to clip anything outside the phone shape
    const device = model.device
    const deviceMask = Buffer.from(
      `<svg width="${bezelMetadata.width}" height="${bezelMetadata.height}">
        <rect x="${device.left}" y="${device.top}"
              width="${device.width}" height="${device.height}"
              rx="${device.radius}" ry="${device.radius}"
              fill="white"/>
      </svg>`
    )

    // Apply device mask to clip outside edges
    const result = await sharp(composited)
      .composite([{
        input: await sharp(deviceMask).png().toBuffer(),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer()

    await sharp(result)
      .png()
      .toFile(outputPath)

    console.log(`\n✓ Created: ${outputPath}`)
    return outputPath

  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

// CLI
const args = process.argv.slice(2)
if (args.length < 1 || args[0] === '--help') {
  console.log(`
Create iPhone mockup with Apple's official bezels

Usage:
  node scripts/create-iphone-mockup.js <screenshot.png> [output.png] [options]

Options:
  --model=17|17-pro|17-pro-max  (default: 17)
  --color=Color                  (default: Black for 17, Silver for Pro)

Available:
  iPhone 17:         Black, White, Lavender, Mist Blue, Sage
  iPhone 17 Pro:     Silver, Deep Blue, Cosmic Orange
  iPhone 17 Pro Max: Silver, Deep Blue, Cosmic Orange

Examples:
  node scripts/create-iphone-mockup.js ./screenshot.png
  node scripts/create-iphone-mockup.js ./screenshot.png ./out.png --model=17 --color=Black
`)
  process.exit(0)
}

const screenshotPath = args[0]
let outputPath = `mockup-${basename(screenshotPath)}`
let model = '17'
let color = null

for (const arg of args.slice(1)) {
  if (arg.startsWith('--model=')) {
    model = arg.replace('--model=', '')
  } else if (arg.startsWith('--color=')) {
    color = arg.replace('--color=', '')
  } else if (!arg.startsWith('--')) {
    outputPath = arg
  }
}

createMockup(screenshotPath, outputPath, model, color)
