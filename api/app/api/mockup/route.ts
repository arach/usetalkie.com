/**
 * iPhone Mockup API - Generate device mockups from screenshots
 *
 * POST /api/mockup
 * Body: { image: "base64-encoded-image", model?: "17", color?: "Black" }
 * Returns: PNG image
 */

import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { put } from '@vercel/blob'

const BEZEL_BASE_URL = 'https://marketing.usetalkie.com/bezels'

const MODELS: Record<string, {
  name: string
  colors: string[]
  defaultColor: string
  bezelSize: { width: number; height: number }
  device: { top: number; left: number; width: number; height: number; radius: number }
  screen: { top: number; left: number; width: number; height: number; borderRadius: number }
}> = {
  '17': {
    name: 'iPhone 17',
    colors: ['Black', 'White', 'Lavender', 'Mist Blue', 'Sage'],
    defaultColor: 'Black',
    bezelSize: { width: 1350, height: 2760 },
    device: { top: 26, left: 19, width: 1311, height: 2708, radius: 72 },
    screen: { top: 62, left: 44, width: 1274, height: 2635, borderRadius: 105 },
  },
  '17-pro': {
    name: 'iPhone 17 Pro',
    colors: ['Silver', 'Deep Blue', 'Cosmic Orange'],
    defaultColor: 'Silver',
    bezelSize: { width: 1470, height: 3000 },
    device: { top: 26, left: 19, width: 1432, height: 2948, radius: 80 },
    screen: { top: 72, left: 36, width: 1398, height: 2856, borderRadius: 120 },
  },
  '17-pro-max': {
    name: 'iPhone 17 Pro Max',
    colors: ['Silver', 'Deep Blue', 'Cosmic Orange'],
    defaultColor: 'Silver',
    bezelSize: { width: 1470, height: 3000 },
    device: { top: 26, left: 19, width: 1432, height: 2948, radius: 80 },
    screen: { top: 72, left: 36, width: 1398, height: 2856, borderRadius: 120 },
  },
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    let image: string | null = null
    let model = '17'
    let color: string | null = null

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      if (body?.image) {
        image = body.image
        model = body.model || '17'
        color = body.color || null
      }
    } else {
      // Raw base64 string body
      const text = await request.text()
      if (text.length > 100) {
        image = text
      }
    }

    if (!image) {
      return NextResponse.json(
        { error: 'Missing image', hint: 'Send JSON { image: "base64" } or raw base64 string', models: Object.keys(MODELS) },
        { status: 400, headers: corsHeaders },
      )
    }

    const modelConfig = MODELS[model]
    if (!modelConfig) {
      return NextResponse.json(
        { error: `Unknown model: ${model}`, availableModels: Object.keys(MODELS) },
        { status: 400, headers: corsHeaders },
      )
    }

    const selectedColor = color || modelConfig.defaultColor
    if (!modelConfig.colors.includes(selectedColor)) {
      return NextResponse.json(
        { error: `Invalid color: ${selectedColor}`, availableColors: modelConfig.colors },
        { status: 400, headers: corsHeaders },
      )
    }

    const imageBuffer = Buffer.from(image, 'base64')

    // Save original upload to blob storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    let uploadUrl: string | null = null
    try {
      const uploadBlob = await put(`uploads/${timestamp}.png`, imageBuffer, {
        access: 'public',
        contentType: 'image/png',
      })
      uploadUrl = uploadBlob.url
    } catch (e) {
      console.error('Upload save failed:', (e as Error).message)
    }

    // Fetch bezel from public folder
    const bezelFileName = `${modelConfig.name} - ${selectedColor} - Portrait.png`
    const bezelUrl = `${BEZEL_BASE_URL}/${encodeURIComponent(bezelFileName)}`
    const bezelResponse = await fetch(bezelUrl)

    if (!bezelResponse.ok) {
      return NextResponse.json(
        {
          error: `Bezel not available: ${selectedColor}`,
          bezelUrl,
          status: bezelResponse.status,
          hint: 'Only Black bezel is currently available. Set color=Black to continue.',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    const bezelBuffer = Buffer.from(await bezelResponse.arrayBuffer())
    const bezelMetadata = await sharp(bezelBuffer).metadata()

    const screen = modelConfig.screen

    // Resize screenshot to fit screen area
    const resizedScreenshot = await sharp(imageBuffer)
      .resize(screen.width, screen.height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .png()
      .toBuffer()

    // Create rounded corner mask
    const mask = Buffer.from(
      `<svg width="${screen.width}" height="${screen.height}">
        <rect x="0" y="0" width="${screen.width}" height="${screen.height}"
              rx="${screen.borderRadius}" ry="${screen.borderRadius}"
              fill="white"/>
      </svg>`,
    )

    const roundedScreenshot = await sharp(resizedScreenshot)
      .composite([{ input: await sharp(mask).png().toBuffer(), blend: 'dest-in' }])
      .png()
      .toBuffer()

    // Composite: screenshot behind bezel
    const composited = await sharp({
      create: {
        width: bezelMetadata.width!,
        height: bezelMetadata.height!,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        { input: roundedScreenshot, top: screen.top, left: screen.left },
        { input: bezelBuffer, top: 0, left: 0 },
      ])
      .png()
      .toBuffer()

    // Fetch pixel-perfect device silhouette mask
    const deviceMaskUrl = `${BEZEL_BASE_URL}/${encodeURIComponent(`${modelConfig.name} - Mask.png`)}`
    const maskResponse = await fetch(deviceMaskUrl)

    let result: Buffer
    if (maskResponse.ok) {
      const deviceMask = Buffer.from(await maskResponse.arrayBuffer())
      result = await sharp(composited)
        .composite([{ input: deviceMask, blend: 'dest-in' }])
        .png()
        .toBuffer()
    } else {
      // Fallback to SVG rounded rect mask
      const device = modelConfig.device
      const deviceMaskSvg = Buffer.from(
        `<svg width="${bezelMetadata.width}" height="${bezelMetadata.height}">
          <rect x="${device.left}" y="${device.top}"
                width="${device.width}" height="${device.height}"
                rx="${device.radius}" ry="${device.radius}"
                fill="white"/>
        </svg>`,
      )
      result = await sharp(composited)
        .composite([{ input: await sharp(deviceMaskSvg).png().toBuffer(), blend: 'dest-in' }])
        .png()
        .toBuffer()
    }

    // Save mockup to Vercel Blob
    let mockupUrl: string | null = null
    try {
      const blob = await put(`mockups/${timestamp}-${model}-${selectedColor}.png`, result, {
        access: 'public',
        contentType: 'image/png',
      })
      mockupUrl = blob.url
    } catch (e) {
      console.error('Mockup save failed:', (e as Error).message)
    }

    const responseHeaders: Record<string, string> = {
      ...corsHeaders,
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="mockup.png"',
    }
    if (uploadUrl) responseHeaders['X-Upload-Url'] = uploadUrl
    if (mockupUrl) responseHeaders['X-Mockup-Url'] = mockupUrl

    return new NextResponse(new Uint8Array(result), { status: 200, headers: responseHeaders })
  } catch (error) {
    console.error('Mockup error:', error)
    return NextResponse.json(
      { error: 'Failed to generate mockup', message: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}
