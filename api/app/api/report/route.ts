import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'

const resend = new Resend(process.env.RESEND_API_KEY)

interface TalkieReport {
  id: string
  timestamp: string
  system: {
    os: string
    osVersion: string
    chip: string
    memory: string
    locale?: string
  }
  apps: Record<string, {
    running: boolean
    pid?: number
    version?: string
    uptime?: number
    memoryMB?: number
  }>
  context: {
    source: string
    connectionState?: string
    lastError?: string
    userDescription?: string
  }
  logs: string[]
  performance?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    const report: TalkieReport = await request.json()

    // Validate required fields
    if (!report.id || !report.timestamp || !report.system || !report.context) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store report in database
    await db.insert(reports).values({
      id: report.id,
      source: report.context.source,
      userDescription: report.context.userDescription || null,
      systemInfo: report.system as any,
      appsInfo: report.apps as any,
      contextInfo: report.context as any,
      logs: report.logs as any,
      performance: report.performance as any || null,
    })

    // Send email notification
    const userDesc = report.context.userDescription || 'No description provided'
    const hasError = report.context.lastError
    const subject = hasError
      ? `🐛 Bug Report: ${report.context.lastError?.substring(0, 50)}`
      : `📋 Feedback from ${report.context.source}`

    await resend.emails.send({
      from: 'Talkie Reports <reports@mail.usetalkie.com>',
      to: 'arach@usetalkie.com',
      subject,
      html: generateReportEmail(report),
    })

    return NextResponse.json({
      success: true,
      id: report.id,
      key: report.id.substring(0, 8), // Short reference key
    })
  } catch (error) {
    console.error('Report submission error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit report'
      },
      { status: 500 }
    )
  }
}

function generateReportEmail(report: TalkieReport): string {
  const userDesc = report.context.userDescription || 'No description provided'
  const hasError = report.context.lastError

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0; padding: 20px; }
    .header { background: ${hasError ? '#fee' : '#f0f9ff'}; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid ${hasError ? '#ef4444' : '#10b981'}; }
    .section { background: #f9fafb; padding: 16px; margin: 16px 0; border-radius: 8px; }
    .label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .value { font-size: 14px; color: #111827; }
    .code { background: #f3f4f6; padding: 12px; border-radius: 4px; font-family: 'SF Mono', monospace; font-size: 12px; overflow-x: auto; }
    .logs { max-height: 400px; overflow-y: auto; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
    td:first-child { font-weight: 600; color: #6b7280; width: 140px; }
  </style>
</head>
<body>
  <div class="header">
    <h2 style="margin: 0; color: ${hasError ? '#dc2626' : '#10b981'};">
      ${hasError ? '🐛 Bug Report' : '📋 Feedback Report'}
    </h2>
    <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px;">
      Report ID: <code>${report.id}</code> • ${new Date(report.timestamp).toLocaleString()}
    </p>
  </div>

  <div class="section">
    <div class="label">User Description</div>
    <div class="value" style="white-space: pre-wrap; margin-top: 8px;">${userDesc}</div>
  </div>

  ${hasError ? `
  <div class="section" style="background: #fee;">
    <div class="label">Last Error</div>
    <div class="value" style="color: #dc2626; margin-top: 8px;">${report.context.lastError}</div>
  </div>
  ` : ''}

  <div class="section">
    <div class="label">System Information</div>
    <table style="margin-top: 8px;">
      <tr><td>OS</td><td>${report.system.os} ${report.system.osVersion}</td></tr>
      <tr><td>Chip</td><td>${report.system.chip}</td></tr>
      <tr><td>Memory</td><td>${report.system.memory}</td></tr>
      ${report.system.locale ? `<tr><td>Locale</td><td>${report.system.locale}</td></tr>` : ''}
    </table>
  </div>

  <div class="section">
    <div class="label">Applications</div>
    <table style="margin-top: 8px;">
      ${Object.entries(report.apps).map(([name, app]) => `
        <tr>
          <td>${name}</td>
          <td>
            ${app.running ? '🟢 Running' : '⚫ Not Running'}
            ${app.version ? ` • v${app.version}` : ''}
            ${app.pid ? ` • PID ${app.pid}` : ''}
            ${app.memoryMB ? ` • ${app.memoryMB}MB` : ''}
          </td>
        </tr>
      `).join('')}
    </table>
  </div>

  ${report.context.connectionState ? `
  <div class="section">
    <div class="label">Connection State</div>
    <div class="value" style="margin-top: 8px;">${report.context.connectionState}</div>
  </div>
  ` : ''}

  ${report.performance ? `
  <div class="section">
    <div class="label">Performance Metrics</div>
    <table style="margin-top: 8px;">
      ${Object.entries(report.performance).map(([key, value]) => `
        <tr><td>${key}</td><td>${value}</td></tr>
      `).join('')}
    </table>
  </div>
  ` : ''}

  <div class="section logs">
    <div class="label">Recent Logs (${report.logs.length} lines)</div>
    <div class="code" style="margin-top: 8px;">
      ${report.logs.slice(-50).join('\n')}
    </div>
  </div>

  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
    <p>View full report in admin dashboard: <a href="https://admin.usetalkie.com/reports/${report.id}">admin.usetalkie.com/reports/${report.id}</a></p>
  </div>
</body>
</html>
  `.trim()
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
