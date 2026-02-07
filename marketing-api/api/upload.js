/**
 * Upload API - Upload image directly to Blob storage
 * Returns URL that can be used with /mockup?source=<url>
 *
 * POST /upload
 * Body: raw image data (not base64)
 * Returns: { url: "blob-url" }
 */

import { put } from '@vercel/blob'

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw data
  },
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' })
  }

  try {
    // Collect raw body
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Empty body' })
    }

    // Upload to blob
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const blob = await put(`uploads/${timestamp}.png`, buffer, {
      access: 'public',
      contentType: 'image/png',
    })

    res.status(200).json({
      url: blob.url,
      size: buffer.length,
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      error: 'Upload failed',
      message: error.message,
    })
  }
}
