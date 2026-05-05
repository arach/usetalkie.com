"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Terminal } from 'lucide-react'
import DocsLayout from './DocsLayout'
import ComingSoonBanner from './ComingSoonBanner'

const sections = [
  { id: 'talkieserver', title: 'TalkieServer Endpoints', level: 2 },
  { id: 'health', title: 'Health Check', level: 3 },
  { id: 'pair', title: 'Pairing', level: 3 },
  { id: 'memos', title: 'Memos', level: 3 },
  { id: 'url-schemes', title: 'URL Schemes', level: 2 },
  { id: 'applescript', title: 'AppleScript', level: 2 },
  { id: 'shortcuts', title: 'Shortcuts', level: 2 },
  { id: 'navigation', title: 'Continue Reading', level: 2 },
]

const CodeBlock = ({ children, title }) => (
  <div className="rounded-lg border border-screen-edge overflow-hidden my-4 not-prose">
    {title && (
      <div className="px-4 py-2 bg-panel-bg-alt border-b border-screen-edge-dim">
        <span className="text-xs font-mono text-ink-muted">{title}</span>
      </div>
    )}
    <pre className="p-4 bg-panel-bg overflow-x-auto">
      <code className="text-sm font-mono text-screen-ink-dim">{children}</code>
    </pre>
  </div>
)

const EndpointCard = ({ method, path, description, response }) => {
  const methodColors = {
    GET: 'bg-emerald-100 dark:bg-amber/20 text-emerald-700 dark:text-amber',
    POST: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
    PUT: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
    DELETE: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  }

  return (
    <div className="p-4 rounded-lg border border-edge bg-canvas-alt not-prose">
      <div className="flex items-center gap-3 mb-2">
        <span className={`px-2 py-0.5 text-xs font-bold rounded ${methodColors[method]}`}>
          {method}
        </span>
        <code className="text-sm font-mono text-ink-dim dark:text-screen-ink-dim">{path}</code>
      </div>
      <p className="text-sm text-ink-muted mb-2">{description}</p>
      {response && (
        <pre className="mt-2 p-2 bg-surface dark:bg-panel-bg-alt rounded text-xs font-mono text-ink-muted overflow-x-auto">
          {response}
        </pre>
      )}
    </div>
  )
}

export default function ApiPage() {
  return (
    <DocsLayout
      title="API Reference"
      description="Integration points for developers. HTTP endpoints, URL schemes, and programmatic access to Talkie."
      badge="Reference"
      badgeColor="amber"
      sections={sections}
    >
      <ComingSoonBanner topic="API Reference" />

      {/* TalkieServer HTTP Endpoints */}
      <h2 id="talkieserver">TalkieServer HTTP Endpoints</h2>
      <p>
        TalkieServer runs locally on your Mac and exposes HTTP endpoints for iOS connectivity and local integrations. By default, it listens on <code>localhost:8765</code>.
      </p>
      <p>
        When paired with Tailscale, the same endpoints are accessible from your iPhone using your Mac's Tailscale IP address.
      </p>

      <h3 id="health">Health Check</h3>
      <div className="space-y-3 my-4">
        <EndpointCard
          method="GET"
          path="/health"
          description="Check if TalkieServer is running and get version info."
          response={`{ "status": "ok", "version": "1.0.0" }`}
        />
      </div>

      <h3 id="pair">Pairing</h3>
      <div className="space-y-3 my-4">
        <EndpointCard
          method="GET"
          path="/pair"
          description="Returns pairing information displayed as a QR code in Talkie settings."
          response={`{ "publicKey": "...", "ip": "100.x.x.x", "port": 8765 }`}
        />
        <EndpointCard
          method="POST"
          path="/pair/confirm"
          description="Confirms pairing from iOS device. Requires the shared secret from QR code."
        />
      </div>

      <h3 id="memos">Memos</h3>
      <div className="space-y-3 my-4">
        <EndpointCard
          method="POST"
          path="/memos"
          description="Upload a voice memo from iOS. Accepts multipart form data with audio file."
        />
        <EndpointCard
          method="GET"
          path="/memos"
          description="List recent memos for iOS sync. Returns last 50 memos by default."
          response={`{ "memos": [{ "id": "...", "title": "...", "createdAt": "..." }] }`}
        />
        <EndpointCard
          method="GET"
          path="/memos/:id"
          description="Get a specific memo by ID, including transcript and audio URL."
        />
      </div>

      {/* URL Schemes */}
      <h2 id="url-schemes">URL Schemes</h2>
      <p>
        Talkie registers URL schemes for deep linking and automation. Use these from Shortcuts, Alfred, Raycast, or any app that supports opening URLs.
      </p>

      <CodeBlock title="Supported URL Schemes">
{`talkie://                       # Open Talkie
talkie://record                 # Start recording immediately
talkie://stop                   # Stop current recording
talkie://memo/{id}              # Open a specific memo
talkie://settings               # Open settings window
talkie://settings/iphone        # Open iPhone sync settings
talkie://workflow/{id}          # Run a workflow manually`}
      </CodeBlock>

      <p>
        <strong>Example from Terminal:</strong>
      </p>
      <CodeBlock>
{`# Start a recording
open "talkie://record"

# Open a specific memo
open "talkie://memo/abc-123-def"`}
      </CodeBlock>

      {/* AppleScript */}
      <h2 id="applescript">AppleScript</h2>
      <p>
        Talkie is fully scriptable via AppleScript. This enables integration with Alfred, Keyboard Maestro, Raycast, and other automation tools.
      </p>

      <div className="p-4 rounded-lg border border-edge bg-canvas-alt my-4 not-prose">
        <div className="flex items-center gap-3 mb-3">
          <Terminal className="w-5 h-5 text-violet-500" />
          <span className="font-bold text-ink">Available Commands</span>
        </div>
        <ul className="text-sm text-ink-muted space-y-1">
          <li>• <code>start recording</code> — Begin a new voice recording</li>
          <li>• <code>stop recording</code> — Stop and save current recording</li>
          <li>• <code>get memos</code> — Returns list of recent memos</li>
          <li>• <code>get transcript of memo id "..."</code> — Get transcript text</li>
        </ul>
      </div>

      <CodeBlock title="Example: Record for 10 seconds">
{`tell application "Talkie"
    start recording
    delay 10
    stop recording
end tell`}
      </CodeBlock>

      <CodeBlock title="Example: Get latest transcript">
{`tell application "Talkie"
    set recentMemos to get memos
    set latestMemo to item 1 of recentMemos
    set transcriptText to transcript of latestMemo
    return transcriptText
end tell`}
      </CodeBlock>

      {/* Shortcuts */}
      <h2 id="shortcuts">Shortcuts Integration</h2>
      <p>
        Talkie exposes actions to the Shortcuts app for building voice-driven automations.
      </p>

      <div className="p-4 rounded-lg border border-edge bg-canvas-alt my-4 not-prose">
        <span className="font-bold text-ink block mb-3">Available Shortcut Actions</span>
        <ul className="text-sm text-ink-muted space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-32 text-ink-faint">Start Recording</span>
            Begin a new voice recording
          </li>
          <li className="flex items-center gap-2">
            <span className="w-32 text-ink-faint">Stop Recording</span>
            Stop and process current recording
          </li>
          <li className="flex items-center gap-2">
            <span className="w-32 text-ink-faint">Get Recent Memos</span>
            Returns list of recent memos
          </li>
          <li className="flex items-center gap-2">
            <span className="w-32 text-ink-faint">Run Workflow</span>
            Execute a workflow by name
          </li>
        </ul>
      </div>

      <p>
        Combine with Siri: "Hey Siri, run my 'Quick Note' shortcut" to trigger voice recording hands-free.
      </p>

      {/* Navigation */}
      <h2 id="navigation">Continue Reading</h2>
      <div className="flex flex-col sm:flex-row gap-4 not-prose">
        <Link
          href="/docs/workflows"
          className="group flex-1 flex items-center gap-4 p-4 rounded-lg border border-edge bg-canvas-alt hover:border-amber/40 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-ink-muted group-hover:text-indigo-500 group-hover:-translate-x-1 transition-all" />
          <div>
            <span className="text-xs text-ink-faint">Previous</span>
            <span className="block font-bold text-ink group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Workflows
            </span>
          </div>
        </Link>

        <Link
          href="/docs/extensibility"
          className="group flex-1 flex items-center justify-between p-4 rounded-lg border border-edge bg-canvas-alt hover:border-amber/40 transition-colors"
        >
          <div>
            <span className="text-xs text-ink-faint">Next</span>
            <span className="block font-bold text-ink group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              Extensibility
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </DocsLayout>
  )
}
