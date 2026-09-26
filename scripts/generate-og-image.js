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
const mac = asset('screenshots/mac/current/talkie-home-light.webp', 'image/webp');
const phone = asset('screenshots/mobile/iphone-home-current.webp', 'image/webp');
const landscape = asset('backgrounds/talkie-listening-pavilion.webp', 'image/webp');
const cards = [
  { slug: 'home', label: 'MAC · IPHONE · APPLE WATCH', title: 'Context app<br>for your', emphasis: 'agents.', description: 'Dictate. Capture context.<br>Follow the result.', alt: 'Talkie with its light Mac app interface' },
  { slug: 'mac', label: 'TALKIE FOR MAC', title: 'Speak.<br>See it written.', emphasis: '', description: 'Local voice dictation.<br>For the apps you use.', alt: 'Talkie for Mac showing activity and recent captures' },
  { slug: 'mobile', label: 'IPHONE + APPLE WATCH', title: 'A thought.<br>A tap.', emphasis: 'Captured.', description: 'Voice capture, wherever you are.', alt: 'Talkie for iPhone showing the home screen' },
];

// Match the canonical Wordmark geometry; the font deliberately has a dotless i.
function wordmark() {
  const size = 37;
  const advances = [600, 600, 600, 600, 340, 600];
  const gap = 3340 * (1 - 0.92) / 5;
  const positions = [0];
  for (let i = 0; i < 5; i++) positions.push(positions[i] + advances[i] - gap - (i === 2 ? 24 : 0));
  const unit = size / 1000;
  const radius = 108 * unit / 2 * 1.4;
  return `<svg width="${(positions[5] + 600) * unit}" height="${size * 1.05}" role="img" aria-label="Talkie"><text x="${positions.map(x => x * unit).join(' ')}" y="${size * .82}" font-family="Talkie" font-size="${size}" font-weight="500" fill="currentColor">talkie</text><circle cx="${(positions[4] + 45) * unit}" cy="${size * .82 - 550 * unit - radius * 2.5}" r="${radius}" fill="#e88945"/></svg>`;
}

function template(card) {
  const mobile = card.slug === 'mobile';
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>${card.alt}</title><style>
  ${font('Talkie', 'Talkie-Medium.ttf')}${font('Display', 'Talkie-Display.ttf')}${font('Sans', 'Talkie-Sans.ttf')}${font('Mono', 'Talkie-Mono.ttf')}
  *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;background:#edf0f4;color:#202831;font-family:Sans}
  .scene{position:absolute;inset:0;background:url('${landscape}') center 58%/cover;opacity:.15}
  .wash{position:absolute;inset:0;background:linear-gradient(90deg,#f5f6f7 0%,rgba(245,246,247,.93) 32%,rgba(236,241,245,.28) 100%)}
  .orb{position:absolute;left:670px;top:-100px;width:650px;height:800px;background:radial-gradient(ellipse,#cdd6eb80,transparent 68%)}
  .brand{position:absolute;left:58px;top:42px;line-height:0}
  .label{font-family:Mono;font-size:12px;letter-spacing:1.7px;color:#58687b;margin-bottom:23px}
  .copy{position:absolute;left:58px;top:142px;z-index:2}
  h1{font-family:Display;font-size:66px;line-height:.99;font-weight:400;letter-spacing:-1.8px;margin:0}
  em{display:block;color:#657693;font-weight:400;margin-top:9px}
  .description{font-size:19px;line-height:1.5;color:#647080;margin-top:23px}
  footer{position:absolute;bottom:37px;left:58px;font-family:Mono;font-size:12px;color:#677382;letter-spacing:.7px}
  .window{position:absolute;width:650px;right:30px;top:58px;border-radius:11px;box-shadow:0 28px 60px #34476726,0 3px 10px #34476714;border:1px solid #fff;overflow:hidden;transform:perspective(1600px) rotateY(-5deg);transform-origin:right center}
  .window img{display:block;width:100%}
  .mobile{background:#f8f6ef;color:#302e29}.mobile .wash{background:linear-gradient(90deg,#f8f6ef 0%,#f8f6efed 40%,#f8f6ef40 100%)}
  .mobile .orb{background:radial-gradient(ellipse,#d6cbb270,transparent 68%)}.mobile h1{font-size:78px}.mobile em{color:#8a785c}.mobile .copy{top:153px}.mobile .description{margin-top:28px}
  .phone-section{position:absolute;left:600px;top:0;width:600px;height:630px;overflow:hidden;background:linear-gradient(145deg,#eeece4e8,#dedbcde0);border-left:1px solid #d8d4c680}.phone{position:absolute;left:100px;top:58px;width:400px;padding:9px;background:linear-gradient(135deg,#807c73,#242522 25%,#75736e 60%,#242522);border-radius:58px;box-shadow:0 28px 48px #3e392a30,0 0 0 1px #6a685d}
  .phone img{display:block;width:100%;border-radius:49px}.island{position:absolute;width:108px;height:29px;background:#181917;border-radius:20px;top:22px;left:calc(50% - 54px)}
  </style><body class="${mobile ? 'mobile' : card.slug}"><div class="scene"></div><div class="wash"></div><div class="orb"></div><div class="brand">${wordmark()}</div><div class="copy"><div class="label">${card.label}</div><h1>${card.title}${card.emphasis ? `<em>${card.emphasis}</em>` : ''}</h1><p class="description">${card.description}</p></div>${mobile ? `<div class="phone-section"><div class="phone"><img src="${phone}" alt="${card.alt}"><div class="island"></div></div></div>` : `<div class="window"><img src="${mac}" alt="${card.alt}"></div>`}<footer>usetalkie.com${card.slug === 'home' ? '' : `/${card.slug}`}</footer></body></html>`;
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
