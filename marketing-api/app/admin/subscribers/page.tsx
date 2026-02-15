'use client'

import { useState, useEffect } from 'react'
import { Users, Mail, Loader2, UserCheck, Search, UserMinus, RefreshCw } from 'lucide-react'
import { useConsole } from '@/components/admin/ActivityConsole'

interface Contact {
  id: string
  email: string
  status: 'contact' | 'active' | 'churned'
  firstName: string | null
  lastName: string | null
  useCase: string | null
  source: string | null
  clerkUserId: string | null
  emailUnsubscribed: boolean
  createdAt: string
  convertedAt: string | null
}

interface Stats {
  total: number
  contact: number
  active: number
  churned: number
}

const STATUS_CONFIG = {
  contact: { label: 'Contact', color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  active: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
  churned: { label: 'Churned', color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
}

export default function SubscribersPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, contact: 0, active: 0, churned: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { log } = useConsole()

  function handleSync() {
    setSyncing(true)
    log('Starting Resend sync...')
    fetch('/api/subscribers/sync', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          log(`Resend sync failed: ${data.error}`, 'error')
        } else {
          log(`Resend sync complete: ${data.total} contacts (${data.imported} new, ${data.updated} updated)`, 'success')
          setRefreshKey((k) => k + 1)
        }
      })
      .catch(() => log('Resend sync failed: network error', 'error'))
      .finally(() => setSyncing(false))
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)

    const url = `/api/subscribers${params.toString() ? `?${params}` : ''}`

    setLoading(true)
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setContacts(data.contacts || [])
          setStats(data.stats || { total: 0, contact: 0, active: 0, churned: 0 })
        }
      })
      .catch(() => setError('Failed to load subscribers'))
      .finally(() => setLoading(false))
  }, [search, statusFilter, refreshKey])

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers</h1>
          <p className="text-zinc-400">Manage your contact database</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-white disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from Resend'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-zinc-700/30 rounded-lg">
              <Users className="w-4 h-4 text-zinc-400" />
            </div>
            <span className="text-sm text-zinc-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Mail className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-sm text-zinc-400">Contacts</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.contact}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-sm text-zinc-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <UserMinus className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-sm text-zinc-400">Churned</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.churned}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700"
        >
          <option value="">All statuses</option>
          <option value="contact">Contact</option>
          <option value="active">Active</option>
          <option value="churned">Churned</option>
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : (
        /* Contacts table */
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {contacts.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500">
                {search || statusFilter ? 'No results found' : 'No subscribers yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Source</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Use Case</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Signed Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {contacts.map((contact) => {
                    const statusCfg = STATUS_CONFIG[contact.status] || STATUS_CONFIG.contact
                    return (
                      <tr key={contact.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-sm text-white">{contact.email}</span>
                            {contact.clerkUserId && (
                              <span className="ml-2 text-xs text-zinc-500" title="Linked to Clerk">
                                linked
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusCfg.color} ${statusCfg.bg} px-2 py-0.5 rounded-full`}>
                            <span className={`w-1.5 h-1.5 ${statusCfg.dot} rounded-full`} />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-zinc-400">{contact.source || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-zinc-400">{contact.useCase || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-zinc-500">
                            {new Date(contact.createdAt).toLocaleDateString('en-US', {
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
