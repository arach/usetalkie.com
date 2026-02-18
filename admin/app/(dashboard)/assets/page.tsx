'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check, Download, Trash2, ImageIcon, Upload, Loader2 } from 'lucide-react'

interface Asset {
  url: string
  pathname: string
  uploadedAt: string
  size: number
  info: {
    date: string
    model: string
    color: string | null
  }
}

interface GroupedAssets {
  date: string
  items: Asset[]
}

function parseAssetInfo(pathname: string) {
  const filename = pathname.split('/').pop() || ''
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})T[\d-]+Z?-?(\d+(?:-pro(?:-max)?)?)?-?([\w\s]+)?\.png$/i)
  if (match) {
    return {
      date: match[1],
      model: match[2] || 'unknown',
      color: match[3] || null,
    }
  }
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/)
  return {
    date: dateMatch ? dateMatch[1] : 'unknown',
    model: 'upload',
    color: null,
  }
}

function formatDate(dateStr: string) {
  if (dateStr === 'unknown') return 'Unknown Date'
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (dateStr === today.toISOString().split('T')[0]) return 'Today'
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function groupByDate(assets: Asset[]): GroupedAssets[] {
  const groups: Record<string, Asset[]> = {}
  for (const asset of assets) {
    const date = asset.info.date
    if (!groups[date]) groups[date] = []
    groups[date].push(asset)
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }))
}

export default function AssetsPage() {
  const [tab, setTab] = useState<'mockups' | 'uploads'>('mockups')
  const [assets, setAssets] = useState<{ mockups: Asset[]; uploads: Asset[] }>({
    mockups: [],
    uploads: [],
  })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  async function fetchAssets() {
    setLoading(true)
    try {
      const res = await fetch('/api/assets')
      const data = await res.json()

      const mockups = data.mockups.map((b: any) => ({
        ...b,
        info: parseAssetInfo(b.pathname),
      }))
      const uploads = data.uploads.map((b: any) => ({
        ...b,
        info: parseAssetInfo(b.pathname),
      }))

      setAssets({ mockups, uploads })
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    }
    setLoading(false)
  }

  const currentAssets = tab === 'mockups' ? assets.mockups : assets.uploads
  const groupedAssets = groupByDate(currentAssets)

  function toggleSelect(url: string) {
    const newSelected = new Set(selected)
    if (newSelected.has(url)) {
      newSelected.delete(url)
    } else {
      newSelected.add(url)
    }
    setSelected(newSelected)
  }

  function selectAll() {
    if (selected.size === currentAssets.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(currentAssets.map((a) => a.url)))
    }
  }

  function selectGroup(date: string) {
    const groupUrls = currentAssets
      .filter((a) => a.info.date === date)
      .map((a) => a.url)
    const allSelected = groupUrls.every((url) => selected.has(url))

    const newSelected = new Set(selected)
    if (allSelected) {
      groupUrls.forEach((url) => newSelected.delete(url))
    } else {
      groupUrls.forEach((url) => newSelected.add(url))
    }
    setSelected(newSelected)
  }

  async function downloadSelected() {
    for (const url of selected) {
      const a = document.createElement('a')
      a.href = `/api/download?url=${encodeURIComponent(url)}`
      a.download = ''
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      await new Promise((r) => setTimeout(r, 300))
    }
  }

  async function deleteSelected() {
    if (!confirm(`Delete ${selected.size} asset(s)? This cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: Array.from(selected) }),
      })

      if (res.ok) {
        setSelected(new Set())
        fetchAssets()
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Assets</h1>
        <p className="text-zinc-400">Manage mockups and uploaded images</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('mockups')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tab === 'mockups'
              ? 'bg-emerald-500 text-black'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4 inline mr-2" />
          Mockups ({assets.mockups.length})
        </button>
        <button
          onClick={() => setTab('uploads')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tab === 'uploads'
              ? 'bg-emerald-500 text-black'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Uploads ({assets.uploads.length})
        </button>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
        <span className="text-sm text-zinc-400">{selected.size} selected</span>
        <button
          onClick={selectAll}
          className="px-3 py-1.5 text-sm bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700"
        >
          {selected.size === currentAssets.length ? 'Deselect All' : 'Select All'}
        </button>
        <button
          onClick={downloadSelected}
          disabled={selected.size === 0}
          className="px-3 py-1.5 text-sm bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={deleteSelected}
          disabled={selected.size === 0}
          className="px-3 py-1.5 text-sm bg-zinc-800 text-zinc-300 rounded-lg hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Asset Grid */}
      {groupedAssets.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">No assets yet.</div>
      ) : (
        groupedAssets.map((group) => (
          <div key={group.date} className="mb-8">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                {formatDate(group.date)}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-500">{group.items.length} items</span>
                <button
                  onClick={() => selectGroup(group.date)}
                  className="text-xs text-zinc-500 hover:text-white"
                >
                  Select group
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.items.map((asset) => (
                <div
                  key={asset.url}
                  className={`relative bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selected.has(asset.url)
                      ? 'border-emerald-500 ring-1 ring-emerald-500'
                      : 'border-transparent hover:border-zinc-700'
                  }`}
                  onClick={() => toggleSelect(asset.url)}
                >
                  {/* Checkbox */}
                  <div
                    className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center z-10 ${
                      selected.has(asset.url)
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'bg-black/50 border-zinc-500'
                    }`}
                  >
                    {selected.has(asset.url) && <Check className="w-3 h-3 text-black" />}
                  </div>

                  {/* Image */}
                  <div
                    className="aspect-square bg-black flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightbox(asset.url)
                    }}
                  >
                    <img
                      src={asset.url}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs text-zinc-500">
                      {new Date(asset.uploadedAt).toLocaleTimeString()}
                    </p>
                    {asset.info.model !== 'upload' && (
                      <p className="text-xs text-emerald-500 font-medium">
                        {asset.info.model} {asset.info.color}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  )
}
