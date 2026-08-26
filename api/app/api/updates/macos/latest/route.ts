import { NextResponse } from 'next/server'

const GITHUB_API_BASE_URL = 'https://api.github.com'
const LATEST_RELEASE_PATH = '/repos/arach/usetalkie.com/releases/latest'
const CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600'

interface GitHubReleaseAsset {
  name: string
  browser_download_url: string
}

interface GitHubRelease {
  tag_name: string
  name: string
  body: string | null
  html_url: string
  published_at: string
  draft: boolean
  prerelease: boolean
  assets: GitHubReleaseAsset[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isGitHubReleaseAsset(value: unknown): value is GitHubReleaseAsset {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.browser_download_url === 'string'
  )
}

function isGitHubRelease(value: unknown): value is GitHubRelease {
  return (
    isRecord(value) &&
    typeof value.tag_name === 'string' &&
    typeof value.name === 'string' &&
    (typeof value.body === 'string' || value.body === null) &&
    typeof value.html_url === 'string' &&
    typeof value.published_at === 'string' &&
    typeof value.draft === 'boolean' &&
    typeof value.prerelease === 'boolean' &&
    Array.isArray(value.assets) &&
    value.assets.every(isGitHubReleaseAsset)
  )
}

function releaseAsset(release: GitHubRelease): GitHubReleaseAsset | undefined {
  return (
    release.assets.find((asset) => asset.name === 'Talkie.dmg') ??
    release.assets.find(
      (asset) => asset.name.startsWith('Talkie-') && asset.name.endsWith('.dmg')
    ) ??
    release.assets.find(
      (asset) => asset.name.startsWith('Talkie') && asset.name.endsWith('.zip')
    )
  )
}

function releaseVersion(tagName: string): string {
  return tagName.startsWith('v') ? tagName.slice(1) : tagName
}

function buildNumber(release: GitHubRelease): number | null {
  const candidates = [release.tag_name, release.name]
  const patterns = [/-([0-9]+)$/, /\(([0-9]+)\)/, /build\s*([0-9]+)/i]

  for (const candidate of candidates) {
    for (const pattern of patterns) {
      const match = candidate.match(pattern)
      if (match) return Number(match[1])
    }
  }

  return null
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    }
  )
}

export async function GET() {
  const releaseURL = new URL(LATEST_RELEASE_PATH, GITHUB_API_BASE_URL)
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'usetalkie.com-update-feed',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  let response: Response
  try {
    response = await fetch(releaseURL, { headers })
  } catch (error) {
    console.error('Update feed request failed:', error)
    return errorResponse('The update feed is temporarily unavailable.', 503)
  }

  if (response.status === 404) {
    return errorResponse('No macOS release is available.', 404)
  }

  if (!response.ok) {
    console.error(`GitHub release request failed with status ${response.status}.`)
    return errorResponse('The update feed is temporarily unavailable.', 503)
  }

  const responseBody: unknown = await response.json()
  if (!isGitHubRelease(responseBody)) {
    console.error('GitHub release response did not match the expected schema.')
    return errorResponse('The update feed is temporarily unavailable.', 503)
  }

  const release = responseBody
  const asset = releaseAsset(release)

  if (release.draft || release.prerelease || !asset) {
    return errorResponse('No macOS release is available.', 404)
  }

  return NextResponse.json(
    {
      schemaVersion: 1,
      platform: 'macos',
      version: releaseVersion(release.tag_name),
      buildNumber: buildNumber(release),
      downloadURL: asset.browser_download_url,
      releaseNotes: release.body ?? '',
      publishedAt: release.published_at,
      htmlURL: release.html_url,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': CACHE_CONTROL,
      },
    }
  )
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': CACHE_CONTROL,
    },
  })
}
