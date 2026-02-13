/**
 * Regenerate API - Create new mockup from existing upload
 *
 * GET /regenerate?source=<url>&model=17&color=Black
 * Returns: Redirects to new mockup or returns PNG
 */

import sharp from 'sharp'
import { put } from '@vercel/blob'

const BEZEL_BASE_URL = 'https://marketing.usetalkie.com/bezels'

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

export default async function handler(req, res) {
  const { source, model = '17', color } = req.query

  if (!source) {
    return res.status(400).json({
      error: 'Missing source URL',
      usage: '/regenerate?source=<upload-url>&model=17&color=Black',
      models: Object.keys(MODELS),
    })
  }

  const modelConfig = MODELS[model]
  if (!modelConfig) {
    return res.status(400).json({
      error: `Unknown model: ${model}`,
      availableModels: Object.keys(MODELS),
    })
  }

  const selectedColor = color || modelConfig.defaultColor
  if (!modelConfig.colors.includes(selectedColor)) {
    return res.status(400).json({
      error: `Invalid color: ${selectedColor}`,
      availableColors: modelConfig.colors,
    })
  }

  try {
    // Fetch the source image
    const sourceResponse = await fetch(source)
    if (!sourceResponse.ok) {
      return res.status(400).json({ error: 'Failed to fetch source image' })
    }
    const imageBuffer = Buffer.from(await sourceResponse.arrayBuffer())

    // Fetch bezel
    const bezelFileName = `${modelConfig.name} - ${selectedColor} - Portrait.png`
    const bezelUrl = `${BEZEL_BASE_URL}/${encodeURIComponent(bezelFileName)}`
    const bezelResponse = await fetch(bezelUrl)

    if (!bezelResponse.ok) {
      // List available bezels
      const availableBezels = ['Black'] // Currently only Black is available
      return res.status(400).json({
        error: `Bezel not available: ${selectedColor}`,
        availableColors: availableBezels,
        hint: `Try: /regenerate?source=${encodeURIComponent(source)}&model=${model}&color=Black`,
      })
    }

    const bezelBuffer = Buffer.from(await bezelResponse.arrayBuffer())
    const bezelMetadata = await sharp(bezelBuffer).metadata()

    const screen = modelConfig.screen

    // Resize screenshot to fit screen area
    const resizedScreenshot = await sharp(imageBuffer)
      .resize(screen.width, screen.height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
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

    // Fetch pixel-perfect device silhouette mask
    const maskUrl = `${BEZEL_BASE_URL}/${encodeURIComponent(`${modelConfig.name} - Mask.png`)}`
    const maskResponse = await fetch(maskUrl)

    let result
    if (maskResponse.ok) {
      const deviceMask = Buffer.from(await maskResponse.arrayBuffer())
      result = await sharp(composited)
        .composite([{
          input: deviceMask,
          blend: 'dest-in'
        }])
        .png()
        .toBuffer()
    } else {
      // Fallback to SVG rounded rect mask
      const device = modelConfig.device
      const deviceMask = Buffer.from(
        `<svg width="${bezelMetadata.width}" height="${bezelMetadata.height}">
          <rect x="${device.left}" y="${device.top}"
                width="${device.width}" height="${device.height}"
                rx="${device.radius}" ry="${device.radius}"
                fill="white"/>
        </svg>`
      )
      result = await sharp(composited)
        .composite([{
          input: await sharp(deviceMask).png().toBuffer(),
          blend: 'dest-in'
        }])
        .png()
        .toBuffer()
    }

    // Save to blob
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    let mockupUrl = null
    try {
      const blob = await put(`mockups/${timestamp}-${model}-${selectedColor}.png`, result, {
        access: 'public',
        contentType: 'image/png',
      })
      mockupUrl = blob.url
    } catch (e) {
      console.error('Blob save failed:', e.message)
    }

    // Redirect to the new mockup or return it
    if (mockupUrl && req.query.redirect !== '0') {
      res.redirect(302, mockupUrl)
    } else {
      res.setHeader('Content-Type', 'image/png')
      if (mockupUrl) {
        res.setHeader('X-Mockup-Url', mockupUrl)
      }
      res.status(200).send(result)
    }

  } catch (error) {
    console.error('Regenerate error:', error)
    res.status(500).json({
      error: 'Failed to regenerate mockup',
      message: error.message,
    })
  }
}
