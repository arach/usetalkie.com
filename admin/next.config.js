import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const config = {
  // Admin dashboard is server-rendered (not static)
  reactStrictMode: true,

  // Allow imports from shared folder (parent directory)
  webpack: (config) => {
    config.resolve.alias['@shared'] = path.join(__dirname, '../shared')
    return config
  },

  // Trace shared dependencies
  outputFileTracingRoot: path.join(__dirname, '../'),
}

export default config
