import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const out = 'docs/screenshots/motion-references';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const metadata = [];
try {
  for (const ref of ['text-reveal-animation-oaksun-studio', 'heading-scroll-photo-mask-giulia-gartner', 'scroll-animation-oakley-crush-ordinary']) {
    const source = `https://www.awwwards.com/inspiration/${ref}`;
    const html = await (await fetch(source)).text();
    const url = html.match(/<source src="([^"]+\.mp4)"/)[1];
    const video = Buffer.from(await (await fetch(url)).arrayBuffer());
    await fs.writeFile(`${out}/${ref}.mp4`, video);
    const page = await browser.newPage();
    await page.setContent('<video muted></video>');
    const meta = await page.evaluate(async base64 => {
      const v = document.querySelector('video');
      v.src = 'data:video/mp4;base64,' + base64;
      await new Promise((resolve, reject) => { v.onloadedmetadata = resolve; v.onerror = reject; });
      return { duration: v.duration, width: v.videoWidth, height: v.videoHeight };
    }, video.toString('base64'));
    const composites = [];
    for (let i = 0; i < 20; i++) {
      const time = .05 + (meta.duration - .1) * i / 19;
      const data = await page.evaluate(async time => {
        const v = document.querySelector('video');
        await new Promise(resolve => { v.onseeked = resolve; v.currentTime = time; });
        const c = document.createElement('canvas');
        c.width = v.videoWidth; c.height = v.videoHeight;
        c.getContext('2d').drawImage(v, 0, 0);
        return c.toDataURL('image/png').split(',')[1];
      }, time);
      const frame = Buffer.from(data, 'base64');
      await fs.writeFile(`${out}/${ref}-${i}.png`, frame);
      composites.push({ input: await sharp(frame).resize(400, 250, { fit: 'contain', background: '#eee' }).png().toBuffer(), left: i % 4 * 400, top: Math.floor(i / 4) * 278 });
      composites.push({ input: Buffer.from(`<svg width="400" height="28"><rect width="400" height="28" fill="white"/><text x="10" y="20" font-size="16">${time.toFixed(2)}s</text></svg>`), left: i % 4 * 400, top: Math.floor(i / 4) * 278 + 250 });
    }
    await sharp({ create: { width: 1600, height: 1390, channels: 3, background: '#fff' } }).composite(composites).png().toFile(`${out}/${ref}.png`);
    metadata.push({ ref, source, url, ...meta });
    console.log(metadata.at(-1));
    await page.close();
  }
  await fs.writeFile(`${out}/metadata.json`, JSON.stringify(metadata, null, 2));
} finally { await browser.close(); }
