"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Monitor, Mic, Cpu, Server, MessageSquare } from 'lucide-react'
import DocsLayout from './DocsLayout'
import ArcDiagram from './ArcDiagram'
import architectureDiagram from './diagrams/architecture.diagram'

const sections = [
  { id: 'system-overview', title: 'System Overview', level: 2 },
  { id: 'components', title: 'Components', level: 2 },
  { id: 'talkie', title: 'Talkie', level: 3 },
  { id: 'talkieagent', title: 'TalkieAgent', level: 3 },
  { id: 'talkieserver', title: 'TalkieServer', level: 3 },
  { id: 'engine-runtime', title: 'TalkieEngineCore', level: 3 },
  { id: 'xpc', title: 'XPC Communication', level: 2 },
  { id: 'lifecycle', title: 'Process Lifecycle', level: 2 },
  { id: 'navigation', title: 'Continue Reading', level: 2 },
]

const ComponentCard = ({ id, icon: Icon, name, subtitle, responsibilities, color }) => (
  <div id={id} className="p-6 rounded-lg border border-edge bg-canvas-alt not-prose scroll-mt-20">
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-ink">{name}</h4>
        <p className="text-sm text-ink-faint mb-3">{subtitle}</p>
        <ul className="space-y-1">
          {responsibilities.map((item, i) => (
            <li key={i} className="text-sm text-ink-muted flex items-start gap-2">
              <span className="text-ink-muted dark:text-ink-faint">-</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

export default function ArchitecturePage() {
  return (
    <DocsLayout
      slug="architecture"
      title="Architecture"
      description="How Talkie's processes fit together. Each one does one job, which keeps capture, UI, and the iPhone bridge easy to reason about."
      badge="Technical"
      badgeColor="amber"
      sections={sections}
    >
      {/* System Overview */}
      <h2 id="system-overview">System Overview</h2>
      <p>
        Talkie splits work across a few processes so a crash in transcription does not take down the UI, microphone permission stays with the helper that records, and capture can keep running after you close the main window.
      </p>

      <ArcDiagram data={architectureDiagram} className="my-8" interactive={false} />

      <p>
        Talkie is the orchestrator: UI, workflows, and data. TalkieAgent is the always-on companion: mic, keyboard, and the local transcription runtime. TalkieServer is a Bun HTTP process that TalkieAgent supervises for the iPhone. There is no standalone TalkieEngine app.
      </p>

      {/* Components */}
      <h2 id="components">Components</h2>
      <p>
        Each component has a clear responsibility and communicates through well-defined interfaces.
      </p>

      <div className="space-y-4 my-6 not-prose">
        <ComponentCard
          id="talkie"
          icon={Monitor}
          name="Talkie"
          subtitle="Main Application (Swift/SwiftUI)"
          responsibilities={[
            "User interface and settings",
            "Workflow orchestration and execution",
            "Data management (GRDB database)",
            "Process lifecycle management for helpers",
          ]}
          color="bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
        />

        <ComponentCard
          id="talkieagent"
          icon={Mic}
          name="TalkieAgent"
          subtitle="Always-on capture + engine host (Swift)"
          responsibilities={[
            "Microphone capture and live dictation",
            "Keyboard insertion and global hotkeys",
            "In-process transcription via TalkieEngineCore",
            "Supervises TalkieServer when the iPhone bridge is on",
          ]}
          color="bg-emerald-100 dark:bg-amber/20 text-amber"
        />

        <ComponentCard
          id="talkieserver"
          icon={Server}
          name="TalkieServer"
          subtitle="iOS bridge (TypeScript/Bun)"
          responsibilities={[
            "HTTP API for the iPhone app",
            "Device pairing and authentication",
            "Voice recording ingest from iPhone and Apple Watch",
            "Tailscale or loopback transport, never a Talkie cloud",
          ]}
          color="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
        />

        <ComponentCard
          id="engine-runtime"
          icon={Cpu}
          name="TalkieEngineCore"
          subtitle="Embedded runtime (not a process)"
          responsibilities={[
            "Whisper and Parakeet transcription inside TalkieAgent",
            "Model download, cache, and Metal acceleration",
            "Caller-specified priority for live vs batch work",
            "Optional WebSocket bridge only when remote engine access is on",
          ]}
          color="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* XPC Communication */}
      <h2 id="xpc">XPC Communication</h2>
      <p>
        XPC is Apple's process-to-process channel. Talkie uses it to talk to TalkieAgent (capture, dictation, bridge control) and TalkieSync (CloudKit memos). Transcription stays inside TalkieAgent.
      </p>

      <div className="p-4 rounded-lg border border-edge bg-canvas-alt my-4 not-prose">
        <div className="flex items-center gap-3 mb-3">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-ink">Why XPC?</span>
        </div>
        <ul className="text-sm text-ink-muted space-y-1">
          <li>• <strong>Security</strong> — Each process runs with only the permissions it needs</li>
          <li>• <strong>Crash isolation</strong> — An Agent crash does not take down the main app</li>
          <li>• <strong>Lifecycle</strong> — launchd starts and restarts TalkieAgent independently of the UI</li>
          <li>• <strong>Type safety</strong> — Protocol-based messages with compile-time checks</li>
        </ul>
      </div>

      <p>
        When you start a dictation, TalkieAgent captures audio, transcribes it in-process with TalkieEngineCore, and inserts the text. The main app never needs microphone or accessibility permission for that path. Talkie hears about the new dictation over XPC (with a polling fallback if the connection drops).
      </p>

      {/* Process Lifecycle */}
      <h2 id="lifecycle">Process Lifecycle</h2>
      <p>
        launchd owns the helper processes. The important split:
      </p>
      <ul>
        <li><strong>TalkieAgent is always-on</strong> — KeepAlive, independent of the main window</li>
        <li><strong>TalkieServer follows Agent</strong> — starts and stops with the companion, not with Talkie.app</li>
        <li><strong>TalkieSync attaches to Talkie</strong> — CloudKit bridge for memos</li>
        <li><strong>Automatic restart</strong> — If Agent crashes, launchd brings it back</li>
      </ul>
      <p>
        In Activity Monitor you should see Talkie and TalkieAgent. TalkieServer appears when the iPhone bridge is on. You should not see a standalone TalkieEngine process.
      </p>

      {/* Navigation */}
      <h2 id="navigation">Continue Reading</h2>
      <div className="flex flex-col sm:flex-row gap-4 not-prose">
        <Link
          href="/docs/overview"
          className="group flex-1 flex items-center gap-4 p-4 rounded-lg border border-edge bg-canvas-alt hover:border-amber/40 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-ink-muted group-hover:text-violet-500 group-hover:-translate-x-1 transition-all" />
          <div>
            <span className="text-xs text-ink-faint">Previous</span>
            <span className="block font-bold text-ink group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              Overview
            </span>
          </div>
        </Link>

        <Link
          href="/docs/data"
          className="group flex-1 flex items-center justify-between p-4 rounded-lg border border-edge bg-canvas-alt hover:border-amber/40 transition-colors"
        >
          <div>
            <span className="text-xs text-ink-faint">Next</span>
            <span className="block font-bold text-ink group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Your Data
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </DocsLayout>
  )
}
