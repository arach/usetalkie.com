/**
 * Admin API - Browse uploads and mockups from Vercel Blob storage
 *
 * GET /admin - Returns HTML gallery with enhanced features
 * GET /admin?json=1 - Returns JSON list
 * GET /admin?tab=uploads - Show uploads tab
 * GET /admin?tab=mockups - Show mockups tab (default)
 */

import { list, del } from '@vercel/blob'

// Parse version info from filename like "2026-02-06T10-30-00-000Z-17-Black.png"
function parseAssetInfo(pathname) {
  const filename = pathname.split('/').pop()
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})T[\d-]+Z?-?(\d+(?:-pro(?:-max)?)?)?-?([\w\s]+)?\.png$/i)
  if (match) {
    return {
      date: match[1],
      model: match[2] || 'unknown',
      color: match[3] || 'unknown',
    }
  }
  // Fallback for uploads without model info
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/)
  return {
    date: dateMatch ? dateMatch[1] : 'unknown',
    model: 'upload',
    color: null,
  }
}

// Group assets by date
function groupByDate(blobs) {
  const groups = {}
  for (const blob of blobs) {
    const info = parseAssetInfo(blob.pathname)
    const date = info.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push({ ...blob, info })
  }
  // Sort groups by date descending
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }))
}

export default async function handler(req, res) {
  // Simple auth check
  const authKey = req.query.key
  if (authKey !== process.env.ADMIN_KEY && process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Handle DELETE action
  if (req.method === 'POST' && req.body?.action === 'delete') {
    try {
      const urls = req.body.urls || []
      if (urls.length === 0) {
        return res.status(400).json({ error: 'No URLs provided' })
      }
      await Promise.all(urls.map(url => del(url)))
      return res.status(200).json({ success: true, deleted: urls.length })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  try {
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
          groups: groupByDate(uploads),
        },
        mockups: {
          count: mockups.length,
          groups: groupByDate(mockups),
        }
      })
    }

    const tab = req.query.tab || 'mockups'
    const items = tab === 'uploads' ? uploads : mockups
    const groupedItems = groupByDate(items)

    // HTML gallery with enhanced features
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Asset Gallery</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #fff;
      padding: 20px;
      margin: 0;
    }
    h1 { margin-bottom: 10px; font-size: 24px; }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .tabs {
      display: flex;
      gap: 10px;
    }
    .tab {
      padding: 10px 20px;
      background: #1a1a1a;
      border-radius: 8px;
      color: #888;
      text-decoration: none;
      transition: all 0.2s;
      border: 1px solid #333;
    }
    .tab:hover { background: #222; border-color: #444; }
    .tab.active {
      background: #10b981;
      color: #000;
      border-color: #10b981;
      font-weight: 600;
    }
    .tab .count {
      font-size: 12px;
      opacity: 0.7;
      margin-left: 5px;
    }

    .actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .action-btn {
      padding: 8px 16px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #888;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }
    .action-btn:hover:not(:disabled) {
      background: #222;
      border-color: #444;
      color: #fff;
    }
    .action-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .action-btn.danger:hover:not(:disabled) {
      background: #dc2626;
      border-color: #dc2626;
      color: #fff;
    }
    .action-btn.primary {
      background: #10b981;
      border-color: #10b981;
      color: #000;
      font-weight: 600;
    }
    .action-btn.primary:hover:not(:disabled) {
      background: #059669;
      border-color: #059669;
    }

    .selection-info {
      font-size: 12px;
      color: #888;
      padding: 6px 12px;
      background: #1a1a1a;
      border-radius: 6px;
    }

    .date-group {
      margin-bottom: 32px;
    }
    .date-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #222;
    }
    .date-title {
      font-size: 14px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .date-count {
      font-size: 12px;
      color: #444;
    }
    .select-group {
      font-size: 11px;
      color: #666;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .select-group:hover {
      background: #222;
      color: #fff;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
    .card {
      background: #141414;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.2s;
      border: 2px solid transparent;
      position: relative;
    }
    .card:hover {
      transform: translateY(-2px);
      border-color: #333;
    }
    .card.selected {
      border-color: #10b981;
      box-shadow: 0 0 0 1px #10b981;
    }
    .card-checkbox {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 20px;
      height: 20px;
      background: rgba(0,0,0,0.6);
      border: 2px solid #444;
      border-radius: 4px;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .card-checkbox:hover {
      border-color: #10b981;
    }
    .card.selected .card-checkbox {
      background: #10b981;
      border-color: #10b981;
    }
    .card.selected .card-checkbox::after {
      content: '✓';
      color: #000;
      font-size: 12px;
      font-weight: bold;
    }
    .card img {
      width: 100%;
      height: auto;
      display: block;
      max-height: 320px;
      object-fit: contain;
      background: #000;
      cursor: pointer;
    }
    .card-info {
      padding: 10px;
      font-size: 11px;
      color: #666;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .card-version {
      font-size: 10px;
      color: #10b981;
      font-weight: 500;
    }
    .card-actions {
      display: flex;
      gap: 8px;
    }
    .card a {
      color: #10b981;
      text-decoration: none;
      font-size: 11px;
    }
    .card a:hover {
      text-decoration: underline;
    }

    .empty {
      text-align: center;
      padding: 60px;
      color: #444;
    }

    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: #10b981;
      color: #000;
      border-radius: 8px;
      font-weight: 500;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s;
      z-index: 1000;
    }
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    .toast.error {
      background: #dc2626;
      color: #fff;
    }

    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.95);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      cursor: zoom-out;
    }
    .lightbox.show { display: flex; }
    .lightbox img {
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
    }
    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 32px;
      color: #fff;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(255,255,255,0.1);
    }
    .lightbox-close:hover { background: rgba(255,255,255,0.2); }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Asset Gallery</h1>
      <div class="tabs">
        <a href="?tab=mockups" class="tab ${tab === 'mockups' ? 'active' : ''}">
          Mockups <span class="count">(${mockups.length})</span>
        </a>
        <a href="?tab=uploads" class="tab ${tab === 'uploads' ? 'active' : ''}">
          Uploads <span class="count">(${uploads.length})</span>
        </a>
      </div>
    </div>
    <div class="actions">
      <span class="selection-info" id="selectionInfo">0 selected</span>
      <button class="action-btn" id="selectAllBtn" onclick="selectAll()">Select All</button>
      <button class="action-btn primary" id="downloadBtn" onclick="downloadSelected()" disabled>
        ⬇ Download
      </button>
      <button class="action-btn danger" id="deleteBtn" onclick="deleteSelected()" disabled>
        🗑 Delete
      </button>
    </div>
  </div>

  ${groupedItems.length === 0 ? '<p class="empty">No assets yet.</p>' : ''}

  ${groupedItems.map(group => `
    <div class="date-group" data-date="${group.date}">
      <div class="date-header">
        <span class="date-title">${formatDate(group.date)}</span>
        <div style="display: flex; gap: 12px; align-items: center;">
          <span class="date-count">${group.items.length} items</span>
          <span class="select-group" onclick="selectGroup('${group.date}')">Select group</span>
        </div>
      </div>
      <div class="grid">
        ${group.items.map(b => `
          <div class="card" data-url="${b.url}" data-date="${group.date}">
            <div class="card-checkbox" onclick="toggleSelect(this.parentElement, event)"></div>
            <img src="${b.url}" alt="Asset" loading="lazy" onclick="showLightbox('${b.url}')" />
            <div class="card-info">
              <div class="card-meta">
                <span>${new Date(b.uploadedAt).toLocaleTimeString()}</span>
                ${b.info.model !== 'upload' ? `<span class="card-version">${b.info.model} ${b.info.color || ''}</span>` : ''}
              </div>
              <div class="card-actions">
                <a href="/api/download?url=${encodeURIComponent(b.url)}" download>Download</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}

  <div class="lightbox" id="lightbox" onclick="hideLightbox()">
    <span class="lightbox-close">×</span>
    <img id="lightboxImg" src="" alt="Preview" />
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const selected = new Set();

    function updateUI() {
      document.getElementById('selectionInfo').textContent = selected.size + ' selected';
      document.getElementById('downloadBtn').disabled = selected.size === 0;
      document.getElementById('deleteBtn').disabled = selected.size === 0;

      document.querySelectorAll('.card').forEach(card => {
        card.classList.toggle('selected', selected.has(card.dataset.url));
      });
    }

    function toggleSelect(card, e) {
      e && e.stopPropagation();
      const url = card.dataset.url;
      if (selected.has(url)) {
        selected.delete(url);
      } else {
        selected.add(url);
      }
      updateUI();
    }

    function selectAll() {
      const cards = document.querySelectorAll('.card');
      const allSelected = selected.size === cards.length;
      if (allSelected) {
        selected.clear();
      } else {
        cards.forEach(card => selected.add(card.dataset.url));
      }
      updateUI();
    }

    function selectGroup(date) {
      const cards = document.querySelectorAll('.card[data-date="' + date + '"]');
      const groupUrls = Array.from(cards).map(c => c.dataset.url);
      const allInGroup = groupUrls.every(url => selected.has(url));

      if (allInGroup) {
        groupUrls.forEach(url => selected.delete(url));
      } else {
        groupUrls.forEach(url => selected.add(url));
      }
      updateUI();
    }

    async function downloadSelected() {
      if (selected.size === 0) return;

      showToast('Starting downloads...');

      for (const url of selected) {
        const a = document.createElement('a');
        a.href = '/api/download?url=' + encodeURIComponent(url);
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        await new Promise(r => setTimeout(r, 300)); // Small delay between downloads
      }

      showToast('Downloads started!');
    }

    async function deleteSelected() {
      if (selected.size === 0) return;

      if (!confirm('Delete ' + selected.size + ' asset(s)? This cannot be undone.')) {
        return;
      }

      showToast('Deleting...');

      try {
        const res = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', urls: Array.from(selected) })
        });

        if (res.ok) {
          showToast('Deleted ' + selected.size + ' asset(s)');
          setTimeout(() => location.reload(), 1000);
        } else {
          throw new Error('Delete failed');
        }
      } catch (e) {
        showToast('Error: ' + e.message, true);
      }
    }

    function showLightbox(url) {
      document.getElementById('lightboxImg').src = url;
      document.getElementById('lightbox').classList.add('show');
    }

    function hideLightbox() {
      document.getElementById('lightbox').classList.remove('show');
    }

    function showToast(msg, isError) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.className = 'toast show' + (isError ? ' error' : '');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        selectAll();
      }
    });
  </script>
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

// Helper to format date nicely
function formatDate(dateStr) {
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
    day: 'numeric'
  })
}
