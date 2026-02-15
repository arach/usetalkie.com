'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Mail,
  Send,
  Inbox,
  FileText,
  Eye,
  Loader2,
  ChevronRight,
  ArrowLeft,
  FlaskConical,
} from 'lucide-react'
import { useConsole } from '@/components/admin/ActivityConsole'

type Tab = 'templates' | 'sent' | 'inbox'

interface TemplateMeta {
  slug: string
  name: string
  description: string
  subject: string
  variables: string[]
}

interface SentEmail {
  id: string
  to: string | string[]
  subject: string
  last_event: string
  created_at: string
}

interface InboxEmail {
  id: string
  from: string
  subject: string
  created_at: string
  text?: string
  html?: string
}

const TAB_CONFIG: { key: Tab; label: string; icon: typeof Mail }[] = [
  { key: 'templates', label: 'Templates', icon: FileText },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'inbox', label: 'Inbox', icon: Inbox },
]

const STATUS_COLORS: Record<string, string> = {
  delivered: 'text-emerald-400 bg-emerald-500/10',
  opened: 'text-blue-400 bg-blue-500/10',
  clicked: 'text-purple-400 bg-purple-500/10',
  bounced: 'text-red-400 bg-red-500/10',
  complained: 'text-red-400 bg-red-500/10',
  sent: 'text-zinc-400 bg-zinc-500/10',
}

// --- Templates Tab ---

function TemplatesTab() {
  const [templates, setTemplates] = useState<TemplateMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [previewSlug, setPreviewSlug] = useState<string | null>(null)
  const [sendSlug, setSendSlug] = useState<string | null>(null)
  const [sendTo, setSendTo] = useState('')
  const [sending, setSending] = useState(false)
  const { log } = useConsole()

  useEffect(() => {
    fetch('/api/emails/templates')
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => log('Failed to load templates', 'error'))
      .finally(() => setLoading(false))
  }, [log])

  function handleSend(slug: string, overrideTo?: string) {
    const recipient = overrideTo || sendTo.trim()
    if (!recipient) return
    setSending(true)
    log(`Sending "${slug}" to ${recipient}...`)
    fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateSlug: slug, to: recipient }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          log(`Send failed: ${d.error}`, 'error')
        } else {
          log(`Email sent to ${recipient} (id: ${d.id})`, 'success')
          setSendSlug(null)
          setSendTo('')
        }
      })
      .catch(() => log('Send failed: network error', 'error'))
      .finally(() => setSending(false))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4">
        {templates.map((t) => (
          <div
            key={t.slug}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium">{t.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">{t.description}</p>
                <p className="text-xs text-zinc-500 mt-2 font-mono">
                  Subject: {t.subject}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <button
                  onClick={() => setPreviewSlug(previewSlug === t.slug ? null : t.slug)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => {
                    setSendSlug(t.slug)
                    setSendTo('hey@usetalkie.com')
                    handleSend(t.slug, 'hey@usetalkie.com')
                  }}
                  disabled={sending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  Send Test
                </button>
                <button
                  onClick={() => setSendSlug(sendSlug === t.slug ? null : t.slug)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </div>
            </div>

            {/* Inline send form */}
            {sendSlug === t.slug && (
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(t.slug)}
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
                <button
                  onClick={() => handleSend(t.slug)}
                  disabled={sending || !sendTo.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            )}

            {/* Preview iframe */}
            {previewSlug === t.slug && (
              <div className="mt-4 rounded-lg overflow-hidden border border-zinc-700">
                <iframe
                  src={`/api/emails/preview?template=${t.slug}`}
                  className="w-full bg-white"
                  style={{ minHeight: 200 }}
                  title={`Preview: ${t.name}`}
                  onLoad={(e) => {
                    const iframe = e.currentTarget
                    try {
                      const height = iframe.contentDocument?.documentElement?.scrollHeight
                      if (height) iframe.style.height = `${height}px`
                    } catch {
                      // cross-origin fallback
                      iframe.style.height = '800px'
                    }
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {templates.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <FileText className="w-8 h-8 mx-auto mb-3 text-zinc-600" />
            No templates defined
          </div>
        )}
      </div>
    </>
  )
}

// --- Sent Tab ---

function SentTab() {
  const [emails, setEmails] = useState<SentEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const { log } = useConsole()

  const loadEmails = useCallback(
    (after?: string) => {
      const isMore = !!after
      if (isMore) setLoadingMore(true)
      else setLoading(true)

      const params = new URLSearchParams({ limit: '50' })
      if (after) params.set('after', after)

      fetch(`/api/emails/sent?${params}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.error) {
            log(`Failed to load sent emails: ${d.error}`, 'error')
            return
          }
          const items = d.data || []
          if (isMore) {
            setEmails((prev) => [...prev, ...items])
          } else {
            setEmails(items)
          }
          // If we got a full page, there might be more
          setHasMore(items.length >= 50)
          if (items.length > 0) {
            setCursor(items[items.length - 1].id)
          }
        })
        .catch(() => log('Failed to load sent emails', 'error'))
        .finally(() => {
          setLoading(false)
          setLoadingMore(false)
        })
    },
    [log]
  )

  useEffect(() => {
    loadEmails()
  }, [loadEmails])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {emails.length === 0 ? (
        <div className="p-12 text-center">
          <Send className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No sent emails yet</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {emails.map((email) => {
                  const to = Array.isArray(email.to) ? email.to.join(', ') : email.to
                  const status = email.last_event || 'sent'
                  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.sent
                  return (
                    <tr key={email.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-white max-w-[200px] truncate">
                        {to}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-300 max-w-[300px] truncate">
                        {email.subject}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">
                        {new Date(email.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div className="p-4 border-t border-zinc-800 text-center">
              <button
                onClick={() => cursor && loadEmails(cursor)}
                disabled={loadingMore}
                className="text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// --- Inbox Tab ---

function InboxTab() {
  const [emails, setEmails] = useState<InboxEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const [replying, setReplying] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const { log } = useConsole()

  useEffect(() => {
    fetch('/api/emails/inbox')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          log(`Failed to load inbox: ${d.error}`, 'error')
          return
        }
        setEmails(d.data || [])
      })
      .catch(() => log('Failed to load inbox', 'error'))
      .finally(() => setLoading(false))
  }, [log])

  function openEmail(id: string) {
    setSelectedId(id)
    setLoadingDetail(true)
    setShowReply(false)
    setReplyBody('')
    fetch(`/api/emails/inbox/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          log(`Failed to load email: ${d.error}`, 'error')
          return
        }
        setSelectedEmail(d)
      })
      .catch(() => log('Failed to load email detail', 'error'))
      .finally(() => setLoadingDetail(false))
  }

  function handleReply() {
    if (!selectedEmail || !replyBody.trim()) return
    setReplying(true)
    const subject = selectedEmail.subject?.startsWith('Re:')
      ? selectedEmail.subject
      : `Re: ${selectedEmail.subject}`
    log(`Replying to ${selectedEmail.from}...`)
    fetch('/api/emails/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: selectedEmail.from,
        subject,
        body: replyBody.trim(),
        inReplyTo: selectedEmail.id,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          log(`Reply failed: ${d.error}`, 'error')
        } else {
          log(`Reply sent to ${selectedEmail.from}`, 'success')
          setReplyBody('')
          setShowReply(false)
        }
      })
      .catch(() => log('Reply failed: network error', 'error'))
      .finally(() => setReplying(false))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    )
  }

  // Detail view
  if (selectedId && selectedEmail) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedId(null)
              setSelectedEmail(null)
            }}
            className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">
              {selectedEmail.subject || '(no subject)'}
            </h3>
            <p className="text-xs text-zinc-500">
              From: {selectedEmail.from} ·{' '}
              {new Date(selectedEmail.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setShowReply(!showReply)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Reply
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
          </div>
        ) : (
          <div className="p-5">
            {selectedEmail.html ? (
              <iframe
                srcDoc={selectedEmail.html}
                className="w-full bg-white rounded-lg"
                style={{ height: 400 }}
                title="Email body"
              />
            ) : (
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                {selectedEmail.text || '(empty body)'}
              </pre>
            )}
          </div>
        )}

        {showReply && (
          <div className="p-4 border-t border-zinc-800">
            <textarea
              placeholder="Write your reply..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleReply}
                disabled={replying || !replyBody.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                {replying ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // List view
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {emails.length === 0 ? (
        <div className="p-12 text-center">
          <Inbox className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No inbound emails yet</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/50">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => openEmail(email.id)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/30 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium truncate">
                    {email.from}
                  </span>
                  <span className="text-xs text-zinc-500 shrink-0">
                    {new Date(email.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 truncate mt-0.5">
                  {email.subject || '(no subject)'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// --- Main Page ---

export default function EmailsPage() {
  const [tab, setTab] = useState<Tab>('templates')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Emails</h1>
        <p className="text-zinc-400">Manage templates, view sent emails, and handle inbox</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
        {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'templates' && <TemplatesTab />}
      {tab === 'sent' && <SentTab />}
      {tab === 'inbox' && <InboxTab />}
    </div>
  )
}
