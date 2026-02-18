import { list } from '@vercel/blob'
import Link from 'next/link'
import { LayoutDashboard, Image as ImageIcon, Upload, ExternalLink, Database } from 'lucide-react'
import { getMigrationStatus } from '@/lib/db/migrations'

const emptyStats = {
  uploadsCount: 0,
  mockupsCount: 0,
  totalSize: 0,
  recentMockups: [] as any[],
}

async function getStats() {
  // Vercel Blob throws synchronously if no token is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return emptyStats
  }

  try {
    const [uploads, mockups] = await Promise.all([
      list({ prefix: 'uploads/' }),
      list({ prefix: 'mockups/' }),
    ])

    const totalSize = [...uploads.blobs, ...mockups.blobs].reduce(
      (sum, b) => sum + (b.size || 0),
      0
    )

    return {
      uploadsCount: uploads.blobs.length,
      mockupsCount: mockups.blobs.length,
      totalSize,
      recentMockups: mockups.blobs
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 5),
    }
  } catch (error) {
    console.error('Failed to get stats:', error)
    return {
      uploadsCount: 0,
      mockupsCount: 0,
      totalSize: 0,
      recentMockups: [],
    }
  }
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default async function AdminDashboard() {
  const [stats, migrationStatus] = await Promise.all([
    getStats(),
    getMigrationStatus(),
  ])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400">Overview of your marketing performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm text-zinc-400">Total Mockups</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.mockupsCount}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-zinc-400">Total Uploads</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.uploadsCount}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm text-zinc-400">Storage Used</span>
          </div>
          <p className="text-3xl font-bold text-white">{formatBytes(stats.totalSize)}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Database className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="text-sm text-zinc-400">DB Migrations</span>
          </div>
          <p className="text-3xl font-bold text-white">{migrationStatus.totalApplied}</p>
          {migrationStatus.lastMigration && (
            <p className="text-xs text-zinc-500 mt-1">
              Last: {new Date(migrationStatus.lastMigration.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/assets"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg font-medium hover:bg-emerald-400 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            View Assets
          </Link>
          <a
            href="https://usetalkie.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Website
          </a>
        </div>
      </div>

      {/* Database Migrations */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Database Migrations</h2>
        {migrationStatus.migrations.length > 0 ? (
          <div className="space-y-2">
            {migrationStatus.migrations.map((migration) => (
              <div
                key={migration.id}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-white font-mono">
                      Migration #{migration.id}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono">
                      {migration.hash.substring(0, 12)}...
                    </p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400">
                  {new Date(migration.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No migrations applied yet</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Mockups</h2>
        {stats.recentMockups.length > 0 ? (
          <div className="space-y-3">
            {stats.recentMockups.map((mockup) => (
              <div
                key={mockup.url}
                className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg"
              >
                <img
                  src={mockup.url}
                  alt="Mockup"
                  className="w-16 h-16 object-contain bg-black rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {mockup.pathname.split('/').pop()}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(mockup.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No recent mockups</p>
        )}
      </div>
    </div>
  )
}
