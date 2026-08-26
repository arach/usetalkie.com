import fs from 'fs'
import path from 'path'

const root = process.cwd()
const dataRoot = path.join(root, 'data/comparison')
const read = relativePath => JSON.parse(fs.readFileSync(path.join(dataRoot, relativePath), 'utf8'))

const dimensions = read('dimensions.json')
const talkie = read('products/talkie.json')
const competitors = read('products/competitors.json')
const pages = read('pages.json')
const dimensionIds = new Set(dimensions.map(dimension => dimension.id))
const competitorBySlug = new Map(competitors.map(product => [product.slug, product]))
const errors = []
const warnings = []

function checkDate(product) {
  const checked = new Date(`${product.checkedAt}T00:00:00Z`)
  if (Number.isNaN(checked.getTime())) {
    errors.push(`${product.slug}: invalid checkedAt date`)
    return
  }

  const ageDays = Math.floor((Date.now() - checked.getTime()) / 86_400_000)
  if (ageDays > 120) warnings.push(`${product.slug}: evidence is ${ageDays} days old`)
}

function checkClaims(product, internal = false) {
  for (const [claimId, claim] of Object.entries(product.claims)) {
    if (!dimensionIds.has(claim.dimension)) {
      errors.push(`${product.slug}.${claimId}: unknown dimension ${claim.dimension}`)
    }
    if (!claim.value || !claim.maturity || !claim.confidence) {
      errors.push(`${product.slug}.${claimId}: missing value, maturity, or confidence`)
    }
    if (internal && claim.maturity === 'verified' && !(claim.evidence || []).length) {
      errors.push(`${product.slug}.${claimId}: verified Talkie claim has no repository evidence`)
    }
    if (internal && claim.maturity === 'planned' && !claim.publicValue) {
      errors.push(`${product.slug}.${claimId}: planned claim needs a non-roadmap publicValue`)
    }
    if (!internal) {
      for (const sourceId of claim.sourceIds || []) {
        if (!product.sources?.[sourceId]) {
          errors.push(`${product.slug}.${claimId}: unknown source ${sourceId}`)
        }
      }
      if (!(claim.sourceIds || []).length) {
        errors.push(`${product.slug}.${claimId}: competitor claim has no official source`)
      }
    }
  }
}

checkDate(talkie)
checkClaims(talkie, true)
for (const competitor of competitors) {
  checkDate(competitor)
  checkClaims(competitor)
}

const configured = new Set()
for (const page of pages) {
  const competitor = competitorBySlug.get(page.competitor)
  if (!competitor) {
    errors.push(`${page.competitor}: page references an unknown competitor`)
    continue
  }
  if (configured.has(page.competitor)) errors.push(`${page.competitor}: duplicate page configuration`)
  configured.add(page.competitor)
  if (!page.picks?.talkie?.title || !page.picks?.competitor?.title) {
    errors.push(`${page.competitor}: missing quick-pick summaries`)
  }
  if (page.picks?.talkie?.points?.length !== 3 || page.picks?.competitor?.points?.length !== 3) {
    errors.push(`${page.competitor}: each quick pick needs exactly three points`)
  }
  if (!page.rows?.length) errors.push(`${page.competitor}: no comparison rows`)
  if (page.rows?.length > 7) errors.push(`${page.competitor}: more than seven rows creates a scanning burden`)

  for (const row of page.rows || []) {
    const claimId = typeof row === 'string' ? row : row.claim
    if (claimId.startsWith('business.')) {
      errors.push(`${page.competitor}: business fact ${claimId} cannot render in the feature matrix`)
    }
    if (typeof row !== 'string' && (!row.label || !row.talkie || !row.competitor)) {
      errors.push(`${page.competitor}.${claimId}: compact row needs label and both display values`)
    }
    if (typeof row !== 'string' && (row.talkie.length > 40 || row.competitor.length > 40)) {
      errors.push(`${page.competitor}.${claimId}: compact cell exceeds 40 characters`)
    }
    if (!talkie.claims[claimId]) errors.push(`${page.competitor}: Talkie is missing ${claimId}`)
    if (!competitor.claims[claimId]) errors.push(`${page.competitor}: competitor is missing ${claimId}`)
  }
}

for (const competitor of competitors) {
  if (!configured.has(competitor.slug)) errors.push(`${competitor.slug}: no page configuration`)
}

for (const warning of warnings) console.warn(`warning: ${warning}`)
for (const error of errors) console.error(`error: ${error}`)

if (errors.length) process.exit(1)
console.log(`comparison data ok: ${competitors.length} competitors, ${Object.keys(talkie.claims).length} Talkie claims, ${pages.length} pages`)
