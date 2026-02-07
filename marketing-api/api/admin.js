/**
 * Admin API - Browse uploads and mockups from Vercel Blob storage
 *
 * GET /admin - Returns HTML gallery
 * GET /admin?json=1 - Returns JSON list
 * GET /admin?tab=uploads - Show uploads tab
 * GET /admin?tab=mockups - Show mockups tab (default)
 */

import { list } from '@vercel/blob'

export default async function handler(req, res) {
  // Simple auth check via query param (replace with proper auth for production)
  const authKey = req.query.key
  if (authKey !== process.env.ADMIN_KEY && process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Fetch both uploads and mockups
    const [uploadsResult, mockupsResult] = await Promise.all([
      list({ prefix: 'uploads/' }),
      list({ prefix: 'mockups/' }),
    ])

    const uploads = uploadsResult.blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    const mockups = mockupsResult.blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))

    // JSON response
    if (req.query.json === '1') {
      return res.status(200).json({
        uploads: {
          count: uploads.length,
          items: uploads.map(b => ({
            url: b.url,
            filename: b.pathname,
            size: b.size,
            uploaded: b.uploadedAt,
          }))
        },
        mockups: {
          count: mockups.length,
          items: mockups.map(b => ({
            url: b.url,
            filename: b.pathname,
            size: b.size,
            uploaded: b.uploadedAt,
          }))
        }
      })
    }

    const tab = req.query.tab || 'mockups'
    const items = tab === 'uploads' ? uploads : mockups

    // HTML gallery
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Asset Gallery</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #111;
      color: #fff;
      padding: 20px;
      margin: 0;
    }
    h1 { margin-bottom: 10px; }
    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .tab {
      padding: 10px 20px;
      background: #222;
      border-radius: 8px;
      color: #888;
      text-decoration: none;
      transition: all 0.2s;
    }
    .tab:hover { background: #333; }
    .tab.active {
      background: #4af;
      color: #000;
    }
    .tab .count {
      font-size: 12px;
      opacity: 0.7;
      margin-left: 5px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .card {
      background: #222;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s;
    }
    .card:hover { transform: scale(1.02); }
    .card img {
      width: 100%;
      height: auto;
      display: block;
      max-height: 400px;
      object-fit: contain;
      background: #000;
    }
    .card-info {
      padding: 10px;
      font-size: 12px;
      color: #888;
    }
    .card a {
      color: #4af;
      text-decoration: none;
    }
    .empty {
      text-align: center;
      padding: 60px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>Asset Gallery</h1>

  <div class="tabs">
    <a href="?tab=mockups" class="tab ${tab === 'mockups' ? 'active' : ''}">
      Mockups <span class="count">(${mockups.length})</span>
    </a>
    <a href="?tab=uploads" class="tab ${tab === 'uploads' ? 'active' : ''}">
      Uploads <span class="count">(${uploads.length})</span>
    </a>
  </div>

  ${items.length === 0 ? '<p class="empty">No assets yet.</p>' : ''}

  <div class="grid">
    ${items.map(b => `
      <div class="card">
        <a href="${b.url}" target="_blank">
          <img src="${b.url}" alt="Asset" loading="lazy" />
        </a>
        <div class="card-info">
          ${new Date(b.uploadedAt).toLocaleString()}<br>
          <a href="${b.url}" download>Download</a>
          ${tab === 'uploads' ? `
            <br><br>
            <strong>Regenerate:</strong><br>
            <a href="/regenerate?source=${encodeURIComponent(b.url)}&model=17&color=Black">iPhone 17 Black</a> |
            <a href="/regenerate?source=${encodeURIComponent(b.url)}&model=17&color=White">White</a>
          ` : ''}
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`

    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(html)

  } catch (error) {
    console.error('Admin error:', error)
    res.status(500).json({
      error: 'Failed to list assets',
      message: error.message,
    })
  }
}
