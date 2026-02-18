'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle, Cpu, Clock, Terminal } from 'lucide-react'

interface Report {
  id: string
  source: string
  userDescription: string | null
  systemInfo: {
    os: string
    osVersion: string
    chip: string
    memory: string
    locale?: string
  }
  appsInfo: Record<string, {
    running: boolean
    pid?: number
    version?: string
    uptime?: number
    memoryMB?: number
  }>
  contextInfo: {
    source: string
    connectionState?: string
    lastError?: string
    userDescription?: string
  }
  logs: string[]
  performance: Record<string, string> | null
  createdAt: string
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [params.id])

  async function fetchReport() {
    try {
      const res = await fetch(`/api/reports/${params.id}`)
      const data = await res.json()

      if (data.error) {
        console.error(data.error)
      } else {
        setReport(data)
      }
    } catch (error) {
      console.error('Failed to load report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Report not found</p>
        <button
          onClick={() => router.push('/reports')}
          className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Back to Reports
        </button>
      </div>
    )
  }

  const hasError = report.contextInfo.lastError

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/reports')}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white font-mono">
                {report.id.substring(0, 16)}...
              </h1>
              {hasError && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  Has Error
                </span>
              )}
            </div>
            <p className="text-zinc-400">
              From {report.source} • {new Date(report.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* User Description */}
      {report.userDescription && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-white mb-3">User Description</h2>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap">
            {report.userDescription}
          </p>
        </div>
      )}

      {/* Last Error */}
      {hasError && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-red-400">Last Error</h2>
          </div>
          <p className="text-sm text-red-300 font-mono">
            {report.contextInfo.lastError}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* System Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">System Information</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-400">OS</dt>
              <dd className="text-white">{report.systemInfo.os} {report.systemInfo.osVersion}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-400">Chip</dt>
              <dd className="text-white">{report.systemInfo.chip}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-400">Memory</dt>
              <dd className="text-white">{report.systemInfo.memory}</dd>
            </div>
            {report.systemInfo.locale && (
              <div className="flex justify-between">
                <dt className="text-zinc-400">Locale</dt>
                <dd className="text-white">{report.systemInfo.locale}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Applications */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">Applications</h2>
          </div>
          <dl className="space-y-3 text-sm">
            {Object.entries(report.appsInfo).map(([name, app]) => (
              <div key={name}>
                <dt className="text-zinc-400 mb-1">{name}</dt>
                <dd className="text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${app.running ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                  {app.running ? 'Running' : 'Not Running'}
                  {app.version && <span className="text-zinc-500">v{app.version}</span>}
                  {app.memoryMB && <span className="text-zinc-500">{app.memoryMB}MB</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Performance Metrics */}
      {report.performance && Object.keys(report.performance).length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">Performance Metrics</h2>
          </div>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {Object.entries(report.performance).map(([key, value]) => (
              <div key={key}>
                <dt className="text-zinc-400 mb-1">{key}</dt>
                <dd className="text-white font-mono">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Logs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">
          Recent Logs ({report.logs.length} lines)
        </h2>
        <div className="bg-black/30 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
          <pre className="text-xs text-zinc-300 font-mono">
            {report.logs.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  )
}
