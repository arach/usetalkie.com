#!/usr/bin/env node
/**
 * Post-build script - Runs after Next.js build completes
 * 1. Runs database migrations (if any pending)
 * 2. Other post-build tasks as needed
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function postBuild() {
  console.log('🔧 Running post-build tasks...\n')

  try {
    // Step 1: Run database migrations
    console.log('📦 Step 1/1: Running database migrations...\n')
    const { stdout, stderr } = await execAsync('npm run db:run-migrations')

    if (stdout) console.log(stdout.trim())
    if (stderr) console.error(stderr.trim())

    // Step 2: Add other post-build tasks here
    // - Warm caches
    // - Generate static assets
    // - Pre-compute expensive operations

    console.log('\n✅ Post-build complete!')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Post-build failed:', error.message)
    process.exit(1)
  }
}

postBuild()
