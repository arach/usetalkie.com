import { existsSync } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const SITE_ORIGIN = 'https://usetalkie.com'
const FORBIDDEN_STRINGS = [['talkie', 'arach.dev'].join('.')]
const LIVE_TIMEOUT_MS = Number(process.env.SEO_AUDIT_TIMEOUT_MS || 8000)
const LIVE_CONCURRENCY = Number(process.env.SEO_AUDIT_CONCURRENCY || 8)
const IMPORTANT_JSONLD_PATHS = [
  '/',
  '/workflows/',
  '/workflows/templates/',
  '/workflows/dictate-to-claude/',
  '/docs/cli/',
]
const TEXT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.md',
  '.mdx',
  '.txt',
  '.xml',
  '.json',
  '.html',
  '.css',
])
const SKIP_DIRS = new Set([
  '.git',
  '.claude',
  '.next',
  'node_modules',
  'out',
  'api/node_modules',
  'admin/node_modules',
])

const checks = []

function pass(message) {
  checks.push({ ok: true, message })
}

function fail(message) {
  checks.push({ ok: false, message })
}

function assertCheck(condition, message) {
  if (condition) pass(message)
  else fail(message)
}

function rel(filePath) {
  return path.relative(ROOT, filePath)
}

async function readText(filePath) {
  return readFile(filePath, 'utf8')
}

function extractSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
}

function outputPathForUrl(url) {
  const { pathname } = new URL(url)
  if (pathname.endsWith('/')) {
    return path.join(ROOT, 'out', pathname, 'index.html')
  }
  return path.join(ROOT, 'out', pathname)
}

async function fileExists(filePath) {
  try {
    const details = await stat(filePath)
    return details.isFile()
  } catch {
    return false
  }
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    const relative = rel(entryPath)

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || SKIP_DIRS.has(relative)) continue
      files.push(...await walkFiles(entryPath))
      continue
    }

    if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

function jsonLdScripts(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
}

async function auditStaticFiles() {
  const robotsPath = path.join(ROOT, 'public', 'robots.txt')
  const sitemapPath = path.join(ROOT, 'public', 'sitemap.xml')
  const llmsPath = path.join(ROOT, 'public', 'llms.txt')

  assertCheck(existsSync(robotsPath), 'public/robots.txt exists')
  assertCheck(existsSync(sitemapPath), 'public/sitemap.xml exists')
  assertCheck(existsSync(llmsPath), 'public/llms.txt exists')

  const robots = await readText(robotsPath)
  const sitemap = await readText(sitemapPath)
  const llms = await readText(llmsPath)

  assertCheck(robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`), 'robots.txt points at the production sitemap')
  assertCheck(llms.includes(`Canonical site: ${SITE_ORIGIN}/`), 'llms.txt declares the canonical production site')

  for (const value of FORBIDDEN_STRINGS) {
    assertCheck(!robots.includes(value), `robots.txt does not contain ${value}`)
    assertCheck(!sitemap.includes(value), `sitemap.xml does not contain ${value}`)
    assertCheck(!llms.includes(value), `llms.txt does not contain ${value}`)
  }
}

async function auditSitemap() {
  const sitemapPath = path.join(ROOT, 'public', 'sitemap.xml')
  const sitemap = await readText(sitemapPath)
  const urls = extractSitemapUrls(sitemap)
  const uniqueUrls = new Set(urls)

  assertCheck(urls.length > 0, `sitemap has ${urls.length} URLs`)
  assertCheck(urls.length === uniqueUrls.size, 'sitemap URLs are unique')

  for (const url of urls) {
    let parsed
    try {
      parsed = new URL(url)
    } catch {
      fail(`sitemap URL is invalid: ${url}`)
      continue
    }

    assertCheck(parsed.origin === SITE_ORIGIN, `sitemap URL uses production origin: ${url}`)
    assertCheck(parsed.hash === '' && parsed.search === '', `sitemap URL has no query or hash: ${url}`)
  }

  const outDir = path.join(ROOT, 'out')
  if (!existsSync(outDir)) {
    fail('out/ is missing; run bunx next build before static sitemap output checks')
    return urls
  }

  for (const url of urls) {
    const expected = outputPathForUrl(url)
    assertCheck(await fileExists(expected), `sitemap URL exists in out/: ${url}`)
  }

  return urls
}

async function auditLiveUrls(urls) {
  const baseUrl = process.env.SEO_AUDIT_BASE_URL
  if (!baseUrl) {
    pass('live URL checks skipped; set SEO_AUDIT_BASE_URL to enable')
    return
  }

  const base = new URL(baseUrl)
  for (let index = 0; index < urls.length; index += LIVE_CONCURRENCY) {
    const batch = urls.slice(index, index + LIVE_CONCURRENCY)
    await Promise.all(batch.map(async (url) => {
      const { pathname } = new URL(url)
      const target = new URL(pathname, base)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), LIVE_TIMEOUT_MS)

      try {
        const response = await fetch(target, {
          method: 'HEAD',
          signal: controller.signal,
        })
        assertCheck(response.ok, `live sitemap URL returns ${response.status}: ${target}`)
      } catch (error) {
        fail(`live sitemap URL failed: ${target} (${error.name === 'AbortError' ? `${LIVE_TIMEOUT_MS}ms timeout` : error.message})`)
      } finally {
        clearTimeout(timeout)
      }
    }))
  }
}

async function auditRecipeJson() {
  const templateDir = path.join(ROOT, 'public', 'workflows', 'templates')
  assertCheck(existsSync(templateDir), 'workflow template JSON directory exists')
  if (!existsSync(templateDir)) return

  const files = (await readdir(templateDir)).filter((file) => file.endsWith('.json')).sort()
  assertCheck(files.length >= 6, `workflow template directory has ${files.length} JSON files`)

  for (const file of files) {
    const filePath = path.join(templateDir, file)
    let parsed
    try {
      parsed = JSON.parse(await readText(filePath))
    } catch (error) {
      fail(`${rel(filePath)} parses as JSON: ${error.message}`)
      continue
    }

    assertCheck(parsed.schema === `${SITE_ORIGIN}/workflows/templates/schema/v1`, `${rel(filePath)} uses the template schema URL`)
    assertCheck(Boolean(parsed.id), `${rel(filePath)} has an id`)
    assertCheck(Boolean(parsed.name), `${rel(filePath)} has a name`)
    assertCheck(Array.isArray(parsed.steps) && parsed.steps.length > 0, `${rel(filePath)} has workflow steps`)
    assertCheck(Boolean(parsed.privacy), `${rel(filePath)} declares a privacy boundary`)
  }
}

async function auditJsonLd() {
  const outDir = path.join(ROOT, 'out')
  if (!existsSync(outDir)) {
    fail('out/ is missing; run bunx next build before JSON-LD checks')
    return
  }

  for (const routePath of IMPORTANT_JSONLD_PATHS) {
    const htmlPath = path.join(ROOT, 'out', routePath, 'index.html')
    assertCheck(await fileExists(htmlPath), `${routePath} exists in out/ for JSON-LD audit`)
    if (!await fileExists(htmlPath)) continue

    const scripts = jsonLdScripts(await readText(htmlPath))
    assertCheck(scripts.length > 0, `${routePath} has JSON-LD`)

    for (const [index, source] of scripts.entries()) {
      try {
        JSON.parse(source)
        pass(`${routePath} JSON-LD script ${index + 1} parses`)
      } catch (error) {
        fail(`${routePath} JSON-LD script ${index + 1} does not parse: ${error.message}`)
      }
    }
  }
}

async function auditForbiddenStrings() {
  const files = await walkFiles(ROOT)
  const matches = []

  for (const file of files) {
    const text = await readText(file)
    for (const value of FORBIDDEN_STRINGS) {
      if (text.includes(value)) {
        matches.push(`${rel(file)} contains ${value}`)
      }
    }
  }

  assertCheck(matches.length === 0, `source text has no forbidden production-domain references`)
  for (const match of matches) fail(match)
}

function printSummary() {
  const failures = checks.filter((check) => !check.ok)
  const successes = checks.length - failures.length

  for (const check of checks) {
    const prefix = check.ok ? 'ok' : 'FAIL'
    console.log(`${prefix} ${check.message}`)
  }

  console.log('')
  console.log(`${successes}/${checks.length} checks passed`)

  if (failures.length > 0) {
    process.exitCode = 1
  }
}

async function main() {
  await auditStaticFiles()
  const urls = await auditSitemap()
  await auditLiveUrls(urls)
  await auditRecipeJson()
  await auditJsonLd()
  await auditForbiddenStrings()
  printSummary()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
