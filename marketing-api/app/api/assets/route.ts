import { NextResponse } from 'next/server'
import { list, del } from '@vercel/blob'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [uploads, mockups] = await Promise.all([
      list({ prefix: 'uploads/' }),
      list({ prefix: 'mockups/' }),
    ])

    return NextResponse.json({
      uploads: uploads.blobs.sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      ),
      mockups: mockups.blobs.sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      ),
    })
  } catch (error) {
    console.error('Failed to list assets:', error)
    return NextResponse.json({ error: 'Failed to list assets' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 })
    }

    await Promise.all(urls.map((url: string) => del(url)))

    return NextResponse.json({ success: true, deleted: urls.length })
  } catch (error) {
    console.error('Failed to delete assets:', error)
    return NextResponse.json({ error: 'Failed to delete assets' }, { status: 500 })
  }
}
