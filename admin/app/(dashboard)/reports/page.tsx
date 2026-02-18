'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bug, AlertCircle, Loader2, Search, Calendar, Cpu } from 'lucide-react'

interface Report {
  id: string
  source: string
  userDescription: string | null
  systemInfo: {
    os: string
    osVersion: string
    chip: string
    memory: string
  }
  contextInfo: {
    lastError?: string
  }
  createdAt: string
}

interface Stats {
  total: number
  withErrors: number
  today: number
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, withErrors: 0, today: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchReports()
  }, [search])

  async function fetchReports() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const res = await fetch(`/api/reports?${params}`)
      const data = await res.json()

      if (data.error) {
        console.error(data.error)
      } else {
        setReports(data.reports || [])
        setStats(data.stats || { total: 0, withErrors: 0, today: 0 })
      }
    } catch (error) {
      console.error('Failed to load reports:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Bug Reports</h1>
        <p className="text-zinc-400">Diagnostic reports from Talkie apps</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-zinc-700/30 rounded-lg">
              <Bug className="w-4 h-4 text-zinc-400" />
            </div>
            <span className="text-sm text-zinc-400">Total Reports</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-sm text-zinc-400">With Errors</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.withErrors}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-sm text-zinc-400">Today</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.today}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by ID or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
        />
      </div>

      {/* Reports table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-12 text-center">
              <Bug className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500">
                {search ? 'No reports found' : 'No bug reports yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      System
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {reports.map((report) => {
                    const hasError = report.contextInfo.lastError
                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/reports/${report.id}`}
                            className="text-sm font-mono text-emerald-400 hover:text-emerald-300"
                          >
                            {report.id.substring(0, 8)}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white">{report.source}</span>
                            {hasError && (
                              <AlertCircle className="w-3.5 h-3.5 text-red-400" title="Has error" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-sm text-zinc-400">
                              {report.systemInfo.os} {report.systemInfo.osVersion}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-zinc-400 line-clamp-1">
                            {report.userDescription || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-zinc-500">
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
