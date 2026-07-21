import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveBrowserLaunchOptions() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  ].filter(Boolean);

  const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
  return executablePath ? { executablePath } : {};
}

const html = `
<!DOCTYPE html>
<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #F4EFE6;
    }
    .container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      background-color: #F4EFE6;
      position: relative;
    }
    .grid, .corner { display: none; }
    .content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      z-index: 1;
      padding: 0 300px 0 88px;
    }
    .hero-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      border-top: 1px solid #CFC0A7;
      padding: 12px 0 0;
      margin-bottom: 24px;
    }
    .hero-badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #FF5346;
    }
    .hero-badge-text {
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      letter-spacing: 0.22em;
      color: #0E0D0A;
      text-transform: uppercase;
    }
    h1 {
      font-size: 88px;
      font-weight: 800;
      color: #0E0D0A;
      letter-spacing: -0.065em;
      text-transform: none;
      line-height: 0.92;
    }
    h1 .muted {
      color: #7A6E5C;
    }
    h1 .accent {
      color: #FF5346;
    }
    .tagline {
      font-size: 17px;
      color: #4B4237;
      margin-top: 30px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 500;
      max-width: 700px;
      line-height: 1.55;
      text-transform: none;
      letter-spacing: 0.02em;
    }
    .tagline .sep {
      color: #CFC0A7;
      margin: 0 8px;
    }
    .tagline-sub {
      font-size: 13px;
      color: #7A6E5C;
      margin-top: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 400;
      letter-spacing: 0.02em;
    }
    .tagline-sub .highlight {
      color: #4B4237;
    }
    .lock-icon {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: 6px;
      color: #71717a;
    }
    .lock-icon.lock-right {
      margin-right: 0;
      margin-left: 6px;
    }
    .badge {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 206px;
      background: #0E0D0A;
      padding: 74px 0 0 38px;
    }
    .badge span {
      font-size: 21px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      color: #F4EFE6;
      letter-spacing: -0.02em;
    }
    .capture-label {
      margin-top: 58px;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.16em;
      color: #F4EFE6;
    }
    .capture-wave {
      height: 74px;
      margin-top: 18px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .capture-wave i { width: 4px; background: #FF5346; border-radius: 2px; display: block; }
    .capture-frame {
      width: 112px;
      height: 82px;
      margin-top: 26px;
      border: 1px solid rgba(244,239,230,0.48);
      padding: 16px 12px;
      position: relative;
    }
    .capture-frame .selection {
      width: 70px;
      height: 43px;
      margin-left: 14px;
      border: 1px dashed #F4EFE6;
      background: rgba(244,239,230,0.10);
      position: relative;
    }
    .capture-frame .handle {
      position: absolute;
      width: 5px;
      height: 5px;
      background: #F4EFE6;
    }
    .capture-frame .top-left { top: -3px; left: -3px; }
    .capture-frame .top-right { top: -3px; right: -3px; }
    .capture-frame .bottom-left { bottom: -3px; left: -3px; }
    .capture-frame .bottom-right { bottom: -3px; right: -3px; }
    .camera {
      width: 66px;
      height: 54px;
      border: 1px solid #F4EFE6;
      border-radius: 27px;
      margin: 34px 0 0 22px;
      position: relative;
    }
    .camera::before {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      border: 4px solid #F4EFE6;
      border-radius: 50%;
      top: 15px;
      left: 22px;
    }
    .camera::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: #FF5346;
      border-radius: 50%;
      top: 8px;
      right: 9px;
    }
    .capture-time {
      position: absolute;
      bottom: 76px;
      left: 38px;
      font: 11px 'JetBrains Mono', monospace;
      letter-spacing: 0.08em;
      color: #F4EFE6;
    }
    .bottom {
      position: absolute;
      bottom: 58px;
      left: 88px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .bottom span {
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 500;
      color: #7A6E5C;
    }
    .bottom .sep { color: #CFC0A7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="grid"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="badge">
      <span>;) Talkie</span>
      <div class="capture-label">LIVE CAPTURE</div>
      <div class="capture-wave"><i style="height:22px"></i><i style="height:44px"></i><i style="height:76px"></i><i style="height:36px"></i><i style="height:96px"></i><i style="height:58px"></i><i style="height:28px"></i><i style="height:72px"></i></div>
      <div class="capture-frame"><div class="selection"><i class="handle top-left"></i><i class="handle top-right"></i><i class="handle bottom-left"></i><i class="handle bottom-right"></i></div></div>
      <div class="camera"></div>
      <div class="capture-time">00:18</div>
    </div>
    <div class="content">
      <div class="hero-badge">
        <div class="hero-badge-dot"></div>
        <span class="hero-badge-text">Voice capture for Mac, iPhone & Watch</span>
      </div>
      <h1><span class="muted">Talk to your</span><br><span class="accent">Mac.</span></h1>
      <p class="tagline">Capture a thought. Shape a draft. Search what you said. Run a workflow.</p>
      <p class="tagline-sub">Local-first voice capture for the apps you already use</p>
    </div>
    <div class="bottom">
      <span style="letter-spacing: 0.1em;">macOS + iOS + watchOS</span>
      <span class="sep">•</span>
      <span>usetalkie.com</span>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch(resolveBrowserLaunchOptions());
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 500));

  const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
  await page.screenshot({ path: outputPath, type: 'png' });

  console.log(`Generated: ${outputPath}`);
  await browser.close();
})();
