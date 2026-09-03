"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Monitor, Mic, Cpu, Server } from 'lucide-react'
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
  { id: 'models', title: 'Models', level: 2 },
  { id: 'speech-to-text', title: 'Speech-to-text', level: 3 },
  { id: 'language-models', title: 'Language models', level: 3 },
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

      <h2 id="models">Models</h2>
      <p>
        Talkie keeps two catalogs. Speech-to-text engines turn recorded audio into text. Language models rewrite, summarize, and run workflows. They are not interchangeable. The Compose header picker is a language-model picker. Live dictation does not use it.
      </p>

      <h3 id="speech-to-text">Speech-to-text</h3>
      <p>
        Live dictation on Mac uses Parakeet v3 (FluidAudio) inside TalkieAgent. That path is on-device. The hotkey does not offer a model menu.
      </p>
      <p>
        Retranscribe, on a saved recording, offers a short menu. Apple Speech is a capture fallback, not the Mac hotkey engine. The engine can install other Whisper sizes; those sizes are not on the retranscribe menu.
      </p>

      <div className="my-6 overflow-x-auto not-prose">
        <table className="w-full text-sm border border-edge rounded-lg overflow-hidden">
          <thead className="bg-surface dark:bg-panel-bg-alt">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ink">Surface</th>
              <th className="px-4 py-3 text-left font-medium text-ink">Engine</th>
              <th className="px-4 py-3 text-left font-medium text-ink">Id</th>
              <th className="px-4 py-3 text-left font-medium text-ink">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Live dictation</td>
              <td className="px-4 py-3 text-ink-muted whitespace-nowrap">Parakeet v3</td>
              <td className="px-4 py-3 font-mono text-[13px] text-ink whitespace-nowrap">parakeet:v3</td>
              <td className="px-4 py-3 text-ink-muted">On-device. Locked for the Mac hotkey path.</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Retranscribe</td>
              <td className="px-4 py-3 text-ink-muted whitespace-nowrap">Parakeet v3</td>
              <td className="px-4 py-3 font-mono text-[13px] text-ink whitespace-nowrap">parakeet:v3</td>
              <td className="px-4 py-3 text-ink-muted">25 languages, fast. Default on the menu.</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Retranscribe</td>
              <td className="px-4 py-3 text-ink-muted whitespace-nowrap">Parakeet v2</td>
              <td className="px-4 py-3 font-mono text-[13px] text-ink whitespace-nowrap">parakeet:v2</td>
              <td className="px-4 py-3 text-ink-muted">English, most accurate Parakeet.</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Retranscribe</td>
              <td className="px-4 py-3 text-ink-muted whitespace-nowrap">Whisper Small</td>
              <td className="px-4 py-3 font-mono text-[13px] text-ink whitespace-nowrap">whisper:openai_whisper-small</td>
              <td className="px-4 py-3 text-ink-muted">On-device WhisperKit. Balanced.</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Retranscribe</td>
              <td className="px-4 py-3 text-ink-muted whitespace-nowrap">Whisper Large V3</td>
              <td className="px-4 py-3 font-mono text-[13px] text-ink whitespace-nowrap">whisper:distil-whisper_distil-large-v3</td>
              <td className="px-4 py-3 text-ink-muted">On-device. Best quality on the menu.</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">iPhone fallback</td>
              <td className="px-4 py-3 text-ink-muted whitespace-nowrap">Apple Speech</td>
              <td className="px-4 py-3 font-mono text-[13px] text-ink whitespace-nowrap">apple_speech</td>
              <td className="px-4 py-3 text-ink-muted">Used when Parakeet is not ready. Not the Mac hotkey engine.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Whisper Tiny and Base remain installable in the engine inventory. They are not on the retranscribe menu. Parakeet 110M and Parakeet JA are also installable; they are not on that menu either.
      </p>

      <h3 id="language-models">Language models</h3>
      <p>
        Compose, workflows, and other rewrite actions read the catalog in <code>LLMConfig.json</code>, plus Apple Intelligence when Foundation Models is available on the Mac. Cloud providers need an API key in Settings. The Compose header currently opens a nested macOS menu of these models, grouped by provider.
      </p>

      <div className="my-6 overflow-x-auto not-prose">
        <table className="w-full text-sm border border-edge rounded-lg overflow-hidden">
          <thead className="bg-surface dark:bg-panel-bg-alt">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ink">Provider</th>
              <th className="px-4 py-3 text-left font-medium text-ink">Recommended models</th>
              <th className="px-4 py-3 text-left font-medium text-ink">Default</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Apple Intelligence</td>
              <td className="px-4 py-3 text-ink-muted">Apple Intelligence (On-Device)</td>
              <td className="px-4 py-3 text-ink-muted">When Foundation Models is available</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">OpenAI</td>
              <td className="px-4 py-3 text-ink-muted">GPT-5.6 Sol, GPT-5.6 Terra, GPT-5.6 Luna</td>
              <td className="px-4 py-3 text-ink-muted">GPT-5.6 Sol</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Anthropic</td>
              <td className="px-4 py-3 text-ink-muted">Claude Sonnet 5, Claude Opus 5, Claude Fable 5.1, Claude Haiku 4.5</td>
              <td className="px-4 py-3 text-ink-muted">Claude Sonnet 5</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Google Gemini</td>
              <td className="px-4 py-3 text-ink-muted">Gemini 2.5 Flash, Gemini 2.5 Flash Lite, Gemini 2.5 Pro</td>
              <td className="px-4 py-3 text-ink-muted">Gemini 2.5 Flash</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">Groq</td>
              <td className="px-4 py-3 text-ink-muted">Llama 3.3 70B, Llama 3.1 8B Instant</td>
              <td className="px-4 py-3 text-ink-muted">Llama 3.1 8B Instant</td>
            </tr>
            <tr className="bg-canvas-alt">
              <td className="px-4 py-3 text-ink font-medium">OpenRouter</td>
              <td className="px-4 py-3 text-ink-muted">Dynamic model discovery (OpenAI, Anthropic, Gemini, DeepSeek, etc.)</td>
              <td className="px-4 py-3 text-ink-muted">Configurable</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Talkie also supports OpenRouter dynamic fetching and custom AI gateways for agents, as well as borrowing models through TalkieServer when the iPhone bridge is active.
      </p>

      {/* XPC Communication */}
      <h2 id="xpc">XPC Communication</h2>
      <p>
        XPC is Apple's process-to-process channel. Talkie uses it to talk to TalkieAgent (capture, dictation, bridge control) and TalkieSync (CloudKit memos). Transcription stays inside TalkieAgent.
      </p>

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
