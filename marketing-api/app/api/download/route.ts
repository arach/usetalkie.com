import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  // Validate URL is from our blob storage
  if (!url.includes('blob.vercel-storage.com')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
    }

    const filename = new URL(url).pathname.split('/').pop() || 'download'
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
