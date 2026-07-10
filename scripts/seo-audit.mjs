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
  '/docs/api/',
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

function extractUrls(text) {
  return [...text.matchAll(/https?:\/\/[^\s)]+/g)].map((match) => match[0])
}

function outputPathForUrl(url) {
  const { pathname } = new URL(url)
  if (pathname.endsWith('/')) {
    return path.join(ROOT, 'out', pathname, 'index.html')
  }
  return path.join(ROOT, 'out', pathname)
}

function routePathForOutputHtml(filePath) {
  const relative = rel(filePath)
  if (!relative.startsWith(`out${path.sep}`) || path.basename(filePath) !== 'index.html') {
    return null
  }

  const routeDir = path.dirname(relative).replace(/^out($|\/)/, '')
  if (!routeDir || routeDir === '.') return '/'
  if (routeDir === '404' || routeDir === '_not-found') return null
  return `/${routeDir.replaceAll(path.sep, '/')}/`
}

async function walkOutputHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '_next') continue
      files.push(...await walkOutputHtmlFiles(entryPath))
      continue
    }
    if (entry.isFile() && entry.name === 'index.html') files.push(entryPath)
  }

  return files
}

function attributeValue(tag, attributeName) {
  const pattern = new RegExp(`${attributeName}\\s*=\\s*["']([^"']+)["']`, 'i')
  return tag.match(pattern)?.[1] ?? null
}

function canonicalHref(html) {
  const links = html.match(/<link\b[^>]*>/gi) ?? []
  for (const tag of links) {
    const relValue = attributeValue(tag, 'rel')
    if (!relValue) continue
    const rels = relValue.toLowerCase().split(/\s+/)
    if (rels.includes('canonical')) return attributeValue(tag, 'href')
  }
  return null
}

function metaContent(html, name) {
  const metas = html.match(/<meta\b[^>]*>/gi) ?? []
  for (const tag of metas) {
    const nameValue = attributeValue(tag, 'name') ?? attributeValue(tag, 'property')
    if (nameValue?.toLowerCase() === name.toLowerCase()) {
      return attributeValue(tag, 'content') ?? ''
    }
  }
  return ''
}

function robotsDirectives(html) {
  return new Set(
    metaContent(html, 'robots')
      .toLowerCase()
      .split(/[,\s]+/)
      .map((directive) => directive.trim())
      .filter(Boolean)
  )
}

function isNoindex(html) {
  return robotsDirectives(html).has('noindex')
}

function h1Count(html) {
  return (html.match(/<h1\b/gi) ?? []).length
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
  const sitemapUrls = new Set(extractSitemapUrls(sitemap))

  assertCheck(robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`), 'robots.txt points at the production sitemap')
  assertCheck(llms.includes(`Canonical site: ${SITE_ORIGIN}/`), 'llms.txt declares the canonical production site')

  for (const value of FORBIDDEN_STRINGS) {
    assertCheck(!robots.includes(value), `robots.txt does not contain ${value}`)
    assertCheck(!sitemap.includes(value), `sitemap.xml does not contain ${value}`)
    assertCheck(!llms.includes(value), `llms.txt does not contain ${value}`)
  }

  for (const url of extractUrls(llms)) {
    let parsed
    try {
      parsed = new URL(url)
    } catch {
      fail(`llms.txt URL is invalid: ${url}`)
      continue
    }

    if (parsed.origin !== SITE_ORIGIN) continue
    if (parsed.pathname.startsWith('/workflows/templates/') && parsed.pathname.endsWith('.json')) continue

    assertCheck(sitemapUrls.has(url), `llms.txt page URL is in sitemap: ${url}`)
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
    if (!await fileExists(expected)) continue

    const html = await readText(expected)
    const canonical = canonicalHref(html)

    assertCheck(!isNoindex(html), `sitemap URL is indexable in HTML: ${url}`)
    assertCheck(canonical === url, `sitemap URL has exact self-canonical: ${url}`)
    assertCheck(h1Count(html) > 0, `sitemap URL has an H1: ${url}`)
  }

  return urls
}

async function auditExportIndexingIntent(sitemapUrls) {
  const outDir = path.join(ROOT, 'out')
  if (!existsSync(outDir)) {
    fail('out/ is missing; run bunx next build before export indexing intent checks')
    return
  }

  const sitemapUrlSet = new Set(sitemapUrls)
  const htmlFiles = await walkOutputHtmlFiles(outDir)

  for (const file of htmlFiles) {
    const routePath = routePathForOutputHtml(file)
    if (!routePath) continue

    const url = `${SITE_ORIGIN}${routePath}`
    const html = await readText(file)
    const canonical = canonicalHref(html)

    if (isNoindex(html)) {
      assertCheck(!sitemapUrlSet.has(url), `noindex output route is absent from sitemap: ${routePath}`)
      continue
    }

    assertCheck(Boolean(canonical), `indexable output route declares a canonical: ${routePath}`)
    if (!canonical) continue

    const canonicalUrl = canonical.startsWith('/') ? `${SITE_ORIGIN}${canonical}` : canonical
    assertCheck(canonicalUrl.startsWith(`${SITE_ORIGIN}/`), `canonical stays on production origin: ${routePath}`)

    if (canonicalUrl === url) {
      assertCheck(sitemapUrlSet.has(url), `self-canonical output route is in sitemap: ${routePath}`)
    } else {
      assertCheck(!sitemapUrlSet.has(url), `canonicalized duplicate route is absent from sitemap: ${routePath}`)
      assertCheck(sitemapUrlSet.has(canonicalUrl), `canonical target is in sitemap: ${routePath} -> ${canonicalUrl}`)
    }
  }
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
  await auditExportIndexingIntent(urls)
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
