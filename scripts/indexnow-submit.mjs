import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const SITE_ORIGIN = 'https://usetalkie.com'
const DEFAULT_ENDPOINT = 'https://api.indexnow.org/indexnow'
const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/
const IGNORED_TEXT_FILES = new Set(['llms.txt', 'robots.txt'])

function usage() {
  return `Usage:
  bun scripts/indexnow-submit.mjs --all [--dry-run]
  bun scripts/indexnow-submit.mjs https://usetalkie.com/changed-page/ [...]

Options:
  --all              Submit every URL in public/sitemap.xml
  --dry-run          Print the request without sending it
  --skip-key-check   Do not verify the key file is live before submitting

Environment:
  INDEXNOW_ENDPOINT  Override the endpoint, default ${DEFAULT_ENDPOINT}
  INDEXNOW_KEY_FILE  Override the key file, default auto-detect public/{key}.txt`
}

function parseArgs(argv) {
  const flags = new Set()
  const urls = []

  for (const arg of argv) {
    if (arg.startsWith('--')) flags.add(arg)
    else urls.push(arg)
  }

  return {
    all: flags.has('--all'),
    dryRun: flags.has('--dry-run'),
    skipKeyCheck: flags.has('--skip-key-check'),
    urls,
    unknownFlags: [...flags].filter((flag) => !['--all', '--dry-run', '--skip-key-check'].includes(flag)),
  }
}

function extractSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
}

async function readSitemapUrls() {
  const sitemapPath = path.join(ROOT, 'public', 'sitemap.xml')
  return extractSitemapUrls(await readFile(sitemapPath, 'utf8'))
}

async function findIndexNowKeyFile() {
  if (process.env.INDEXNOW_KEY_FILE) return path.resolve(ROOT, process.env.INDEXNOW_KEY_FILE)

  const publicDir = path.join(ROOT, 'public')
  const candidates = []

  for (const file of await readdir(publicDir)) {
    if (!file.endsWith('.txt') || IGNORED_TEXT_FILES.has(file)) continue

    const key = file.slice(0, -'.txt'.length)
    if (!KEY_PATTERN.test(key)) continue

    const filePath = path.join(publicDir, file)
    const content = (await readFile(filePath, 'utf8')).trim()
    if (content === key) candidates.push(filePath)
  }

  if (candidates.length !== 1) {
    throw new Error(`Expected exactly one public/{IndexNow key}.txt file, found ${candidates.length}.`)
  }

  return candidates[0]
}

async function readIndexNowKey() {
  const keyFile = await findIndexNowKeyFile()
  const key = (await readFile(keyFile, 'utf8')).trim()
  const fileName = path.basename(keyFile)

  if (!KEY_PATTERN.test(key)) throw new Error(`Invalid IndexNow key in ${path.relative(ROOT, keyFile)}.`)
  if (fileName !== `${key}.txt`) {
    throw new Error(`IndexNow key file must be named ${key}.txt, got ${fileName}.`)
  }

  return {
    key,
    keyFile,
    keyLocation: `${SITE_ORIGIN}/${fileName}`,
  }
}

function normalizeAndValidateUrls(urls) {
  const normalized = []
  const seen = new Set()

  for (const value of urls) {
    const url = new URL(value, SITE_ORIGIN)
    if (url.origin !== SITE_ORIGIN) {
      throw new Error(`URL does not belong to ${SITE_ORIGIN}: ${value}`)
    }
    if (url.hash || url.search) {
      throw new Error(`IndexNow URL must not include query or hash: ${value}`)
    }
    const href = url.href
    if (!seen.has(href)) {
      seen.add(href)
      normalized.push(href)
    }
  }

  return normalized
}

async function verifyLiveKeyFile(key, keyLocation) {
  const response = await fetch(keyLocation, { cache: 'no-store' })
  const text = await response.text()

  if (!response.ok || text.trim() !== key) {
    throw new Error(
      `Live IndexNow key check failed for ${keyLocation}: HTTP ${response.status}, content ${
        text.trim() === key ? 'matched' : 'did not match'
      }. Deploy the key file before submitting.`
    )
  }
}

async function submitIndexNow({ key, keyLocation, urls, dryRun, skipKeyCheck }) {
  const endpoint = process.env.INDEXNOW_ENDPOINT || DEFAULT_ENDPOINT
  const payload = {
    host: new URL(SITE_ORIGIN).host,
    key,
    keyLocation,
    urlList: urls,
  }

  if (dryRun) {
    console.log(JSON.stringify({ endpoint, payload }, null, 2))
    return
  }

  if (!skipKeyCheck) await verifyLiveKeyFile(key, keyLocation)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })
  const body = await response.text()

  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow submission failed: HTTP ${response.status}${body ? `\n${body}` : ''}`)
  }

  console.log(`IndexNow accepted ${urls.length} URL${urls.length === 1 ? '' : 's'} with HTTP ${response.status}.`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.unknownFlags.length > 0) {
    console.error(`Unknown option: ${options.unknownFlags.join(', ')}`)
    console.error(usage())
    process.exit(1)
  }
  if (options.all && options.urls.length > 0) {
    console.error('Use either --all or explicit URLs, not both.')
    console.error(usage())
    process.exit(1)
  }
  if (!options.all && options.urls.length === 0) {
    console.error(usage())
    process.exit(1)
  }

  const urls = normalizeAndValidateUrls(options.all ? await readSitemapUrls() : options.urls)
  const keyInfo = await readIndexNowKey()

  await submitIndexNow({
    ...keyInfo,
    urls,
    dryRun: options.dryRun,
    skipKeyCheck: options.skipKeyCheck,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
