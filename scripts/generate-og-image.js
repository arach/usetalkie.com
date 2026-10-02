import puppeteer from 'puppeteer';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Custom HTML social cards. Render the actual product assets and owned fonts
// locally so regeneration does not depend on a running site or remote fonts.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const asset = (file, mime) => `data:${mime};base64,${fs.readFileSync(path.join(root, 'public', file)).toString('base64')}`;
const font = (name, file) => `@font-face{font-family:${name};src:url('${asset(`fonts/${file}`, 'font/ttf')}')}`;
const img = file => asset(file, 'image/webp');
const cards = [
  { slug: 'home', line: 'Talk to your apps.', scene: img('backgrounds/talkie-listening-pavilion.webp'), shot: img('screenshots/mac/current/talkie-home-light.webp'), alt: 'Talkie for Mac floating over a lakeside pavilion at golden hour' },
  { slug: 'mac', line: 'Speak. It’s written.', scene: img('backgrounds/talkie-listening-pavilion-night.webp'), shot: img('screenshots/mac/current/talkie-editor-light.webp'), alt: 'The Talkie for Mac editor over a lakeside pavilion at night' },
  { slug: 'mobile', line: 'A thought, a tap.', scene: img('backgrounds/talkie-coast.webp'), shot: img('screenshots/mobile/iphone-recording-current.webp'), alt: 'Talkie for iPhone recording, over a sunlit coast' },
];

// Match the canonical Wordmark geometry; the font deliberately has a dotless i.
function wordmark() {
  const size = 46;
  const advances = [600, 600, 600, 600, 340, 600];
  const gap = 3340 * (1 - 0.92) / 5;
  const positions = [0];
  for (let i = 0; i < 5; i++) positions.push(positions[i] + advances[i] - gap - (i === 2 ? 24 : 0));
  const unit = size / 1000;
  const radius = 108 * unit / 2 * 1.4;
  return `<svg width="${(positions[5] + 600) * unit}" height="${size * 1.05}" role="img" aria-label="Talkie"><text x="${positions.map(x => x * unit).join(' ')}" y="${size * .82}" font-family="Talkie" font-size="${size}" font-weight="500" fill="currentColor">talkie</text><circle cx="${(positions[4] + 45) * unit}" cy="${size * .82 - 550 * unit - radius * 2.5}" r="${radius}" fill="#e88945"/></svg>`;
}

function template(card) {
  const phone = card.slug === 'mobile';
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>${card.alt}</title><style>
  ${font('Talkie', 'Talkie-Medium.ttf')}${font('Display', 'Talkie-Display.ttf')}
  *{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;position:relative;color:#fff;background:#1c2a44}
  .scene{position:absolute;inset:0;background:url('${card.scene}') center 70%/cover}
  .shade{position:absolute;inset:0;background:linear-gradient(100deg,#0d1a3373 0%,#0d1a3326 38%,transparent 60%)}
  .copy{position:absolute;left:64px;top:60px;text-shadow:0 2px 24px #0b16304d}
  .brand{line-height:0;filter:drop-shadow(0 2px 14px #0b163059)}
  h1{font-family:Display;font-weight:400;font-style:italic;font-size:48px;line-height:1.05;letter-spacing:-.8px;margin-top:22px;max-width:420px}
  .window{position:absolute;left:520px;top:132px;width:800px;border-radius:14px;overflow:hidden;box-shadow:0 40px 90px #08122a66,0 6px 18px #08122a33,0 0 0 1px #ffffff55}
  .window img{display:block;width:100%}
  .phone{position:absolute;left:770px;top:52px;width:300px;padding:8px;border-radius:52px;background:linear-gradient(135deg,#8a857a,#262622 25%,#77746d 60%,#262622);box-shadow:0 40px 80px #08122a70,0 0 0 1px #00000040}
  .phone img{display:block;width:100%;border-radius:44px}
  .island{position:absolute;width:86px;height:24px;background:#141413;border-radius:14px;top:20px;left:calc(50% - 43px)}
  </style><body><div class="scene"></div><div class="shade"></div><div class="copy"><div class="brand">${wordmark()}</div><h1>${card.line}</h1></div>${phone ? `<div class="phone"><img src="${card.shot}" alt=""><div class="island"></div></div>` : `<div class="window"><img src="${card.shot}" alt=""></div>`}</body></html>`;
}

const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium'].find(p => p && fs.existsSync(p));
const browser = await puppeteer.launch(executablePath ? { executablePath } : {});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  fs.mkdirSync(path.join(root, 'public/og'), { recursive: true });
  for (const card of cards) {
    await page.setContent(template(card), { waitUntil: 'load' });
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
    const buffer = await page.screenshot({ type: 'png' });
    const output = path.join(root, `public/og/${card.slug}.png`);
    await sharp(buffer).png({ compressionLevel: 9 }).toFile(output);
    console.log(`Generated ${output}`);
  }
} finally {
  await browser.close();
}
