/**
 * iPhone Mockup API - Generate device mockups from screenshots
 *
 * POST /mockup
 * Body: { image: "base64-encoded-image", model?: "17", color?: "Black" }
 * Returns: PNG image
 */

import sharp from 'sharp'
import { put } from '@vercel/blob'

// Bezels are served from the same deployment's public folder
const BEZEL_BASE_URL = 'https://marketing.usetalkie.com/bezels'

// Screen configs for different iPhone models
// deviceRadius is the outer corner radius of the device silhouette
const MODELS = {
  '17': {
    name: 'iPhone 17',
    colors: ['Black', 'White', 'Lavender', 'Mist Blue', 'Sage'],
    defaultColor: 'Black',
    bezelSize: { width: 1350, height: 2760 },
    // Device silhouette within the bezel image (for masking)
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

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).set(corsHeaders).end()
    return
  }

  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    // Try to extract image from various formats
    let image = null
    let model = '17'
    let color = null
    const contentType = req.headers['content-type'] || ''

    // Format 1: JSON body with { image: "base64" }
    if (req.body?.image) {
      image = req.body.image
      model = req.body.model || '17'
      color = req.body.color || null
    }
    // Format 2: Raw base64 string as body
    else if (typeof req.body === 'string' && req.body.length > 100) {
      image = req.body
    }
    // Format 3: Body is the base64 directly (parsed as object with weird keys)
    else if (req.body && typeof req.body === 'object') {
      const keys = Object.keys(req.body)
      // Check if first key looks like base64 data
      if (keys.length > 0 && keys[0].length > 100) {
        image = keys[0]
      }
    }

    if (!image) {
      return res.status(400).json({
        error: 'Missing image',
        hint: 'Send JSON { image: "base64" } or raw base64 string',
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

    // Decode base64 image
    const imageBuffer = Buffer.from(image, 'base64')

    // Save original upload to blob storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    let uploadUrl = null
    try {
      const uploadBlob = await put(`uploads/${timestamp}.png`, imageBuffer, {
        access: 'public',
        contentType: 'image/png',
      })
      uploadUrl = uploadBlob.url
    } catch (e) {
      console.error('Upload save failed:', e.message)
    }

    // Fetch bezel from public folder
    const bezelFileName = `${modelConfig.name} - ${selectedColor} - Portrait.png`
    const bezelUrl = `${BEZEL_BASE_URL}/${encodeURIComponent(bezelFileName)}`
    const bezelResponse = await fetch(bezelUrl)

    if (!bezelResponse.ok) {
      // List available bezels
      const availableBezels = ['Black'] // Currently only Black is available
      return res.status(400).json({
        error: `Bezel not available: ${selectedColor}`,
        availableColors: availableBezels,
        bezelUrl,
        status: bezelResponse.status,
        hint: 'Only Black bezel is currently available. Set color=Black to continue.',
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

    // Fetch pixel-perfect device silhouette mask (pre-generated from bezel)
    const maskUrl = `${BEZEL_BASE_URL}/${encodeURIComponent(`${modelConfig.name} - Mask.png`)}`
    const maskResponse = await fetch(maskUrl)

    let result
    if (maskResponse.ok) {
      // Use pixel-perfect mask
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

    // Save mockup to Vercel Blob storage (same timestamp as upload)
    const mockupFilename = `mockups/${timestamp}-${model}-${selectedColor}.png`

    let mockupUrl = null
    try {
      const blob = await put(mockupFilename, result, {
        access: 'public',
        contentType: 'image/png',
      })
      mockupUrl = blob.url
    } catch (e) {
      console.error('Mockup save failed:', e.message)
    }

    // Return PNG image with metadata headers
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', 'inline; filename="mockup.png"')
    if (uploadUrl) {
      res.setHeader('X-Upload-Url', uploadUrl)
    }
    if (mockupUrl) {
      res.setHeader('X-Mockup-Url', mockupUrl)
    }
    res.status(200).send(result)

  } catch (error) {
    console.error('Mockup error:', error)
    res.status(500).json({
      error: 'Failed to generate mockup',
      message: error.message,
    })
  }
}
