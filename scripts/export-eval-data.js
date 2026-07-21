/**
 * Export the local intelligence card data to JSON for use by the Python eval harness.
 * Run with: node scripts/export-eval-data.js
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { localIntelligenceCards } from '../components/blog/local-intelligence-cards-data.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

mkdirSync(join(root, 'evals/fixtures'), { recursive: true })

const outPath = join(root, 'evals/fixtures/cards.json')
writeFileSync(outPath, JSON.stringify(localIntelligenceCards, null, 2))

console.log(`✓ Exported ${localIntelligenceCards.length} cards → ${outPath}`)

const tiers = {}
for (const card of localIntelligenceCards) {
  tiers[card.tier] = (tiers[card.tier] ?? 0) + 1
}
for (const [tier, count] of Object.entries(tiers)) {
  console.log(`  ${tier}: ${count} cards`)
}
