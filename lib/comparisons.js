import fs from 'fs'
import path from 'path'

const comparisonDirectory = path.join(process.cwd(), 'data/comparison')

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(comparisonDirectory, relativePath), 'utf8'))
}

function publicClaim(claim) {
  if (claim.maturity === 'planned') {
    return {
      ...claim,
      value: claim.publicValue || 'Not currently a published product capability.',
      publicStatus: 'not-current',
    }
  }

  return claim
}

export function hasEvidenceComparison(competitorSlug) {
  const competitors = readJson('products/competitors.json')
  const pages = readJson('pages.json')
  return competitors.some(product => product.slug === competitorSlug)
    && pages.some(page => page.competitor === competitorSlug)
}

export function getEvidenceComparison(competitorSlug) {
  const dimensions = readJson('dimensions.json')
  const talkie = readJson('products/talkie.json')
  const competitors = readJson('products/competitors.json')
  const pages = readJson('pages.json')

  const competitor = competitors.find(product => product.slug === competitorSlug)
  const page = pages.find(entry => entry.competitor === competitorSlug)

  if (!competitor || !page) {
    throw new Error(`Unknown evidence comparison: ${competitorSlug}`)
  }

  const dimensionById = new Map(dimensions.map(dimension => [dimension.id, dimension]))
  const rows = page.rows.map(rowConfig => {
    const claimId = typeof rowConfig === 'string' ? rowConfig : rowConfig.claim
    const talkieClaim = talkie.claims[claimId]
    const competitorClaim = competitor.claims[claimId]

    if (!talkieClaim || !competitorClaim) {
      throw new Error(`Missing ${claimId} claim for Talkie vs ${competitorSlug}`)
    }

    return {
      id: claimId,
      label: rowConfig.label || competitorClaim.label || talkieClaim.label,
      dimension: dimensionById.get(competitorClaim.dimension || talkieClaim.dimension),
      talkie: publicClaim(talkieClaim),
      competitor: publicClaim(competitorClaim),
      talkieDisplay: rowConfig.talkie || publicClaim(talkieClaim).value,
      competitorDisplay: rowConfig.competitor || publicClaim(competitorClaim).value,
    }
  })

  const usedSourceIds = new Set(
    page.rows.flatMap(rowConfig => {
      const claimId = typeof rowConfig === 'string' ? rowConfig : rowConfig.claim
      return competitor.claims[claimId].sourceIds || []
    }),
  )
  const sources = [...usedSourceIds]
    .map(sourceId => competitor.sources[sourceId])
    .filter(Boolean)

  return { talkie, competitor, page, rows, sources }
}
