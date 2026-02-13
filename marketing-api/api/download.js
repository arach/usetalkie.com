/**
 * Download Proxy - Enables direct download of Vercel Blob assets
 *
 * GET /download?url=<blob-url>
 * Returns: File with Content-Disposition: attachment header
 */

export default async function handler(req, res) {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' })
  }

  // Validate URL is from Vercel Blob
  if (!url.includes('blob.vercel-storage.com') && !url.includes('public.blob.vercel-storage.com')) {
    return res.status(400).json({ error: 'Invalid URL - must be a Vercel Blob URL' })
  }

  try {
    // Fetch the file
    const response = await fetch(url)

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch file' })
    }

    // Extract filename from URL
    const urlPath = new URL(url).pathname
    const filename = urlPath.split('/').pop() || 'download.png'

    // Get content type from response
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    // Stream the response with download headers
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Cache-Control', 'no-cache')

    // Get the buffer and send
    const buffer = Buffer.from(await response.arrayBuffer())
    res.status(200).send(buffer)

  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Download failed', message: error.message })
  }
}
