// Run after generate-wordmark.py to export transparent, high-resolution PNGs.
import sharp from 'sharp'

for (const variant of ['dark', 'light']) {
  await sharp(`public/brand/talkie-wordmark-${variant}.svg`, { density: 96 })
    .resize({ width: 2844 })
    .png()
    .toFile(`public/brand/talkie-wordmark-${variant}.png`)
}
