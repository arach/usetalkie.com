import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || ''
const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const config = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: projectRoot },
  // For GitHub Pages with a project path, set BASE_PATH env to "/<repo>"
  // For custom domain (e.g., usetalkie.com), leave BASE_PATH empty
}

if (basePath) {
  config.basePath = basePath
  config.assetPrefix = `${basePath}/`
}

export default config
