import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const groups = [
  { collection: 'EMBLEM', category: 'armor', code: '001008', matches: ['Valkyrie Gold Emblem', 'Wolf Emblem Design', 'Lucky Wings Brass Antique', '46856'] },
  { collection: 'LIMITED', category: '540-color', code: '001014', matches: ['47239', '47104', '47193', '47250'] },
];
const browser = await chromium.launch();
const page = await browser.newPage();
const products = [];
try {
  for (const group of groups) {
    const listUrl = `https://zippo.co.kr/goods/goods_list.php?cateCd=${group.code}`;
    const html = await (await fetch(listUrl)).text();
    await fs.writeFile(`docs/catalog-source/${group.collection.toLowerCase()}.html`, html);
    const items = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return [...doc.querySelectorAll('.item_cont')].map(el => ({
        id: el.querySelector('a[href*="goodsNo="]')?.getAttribute('href').match(/goodsNo=(\d+)/)?.[1],
        name: el.querySelector('.item_name')?.textContent.trim(),
      }));
    }, html);
    for (const match of group.matches) {
      const item = items.find(item => item.name?.includes(match));
      if (!item) throw new Error(`Missing ${match}`);
      const sourceUrl = `https://zippo.co.kr/goods/goods_view.php?goodsNo=${item.id}`;
      const detail = await (await fetch(sourceUrl)).text();
      await fs.writeFile(`docs/catalog-source/${item.id}.html`, detail);
      const data = await page.evaluate(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return { sourceName: doc.querySelector('.item_detail_tit h3').textContent.trim(), price: Number(doc.querySelector('.it_price_box strong strong').textContent.replaceAll(',', '')) };
      }, detail);
      const urls = [...new Set(detail.match(/https?:[^\s"<>\\]+\/image\/detail\/[^\s"<>\\]+\.(?:jpg|png)/g) || [])].filter(url => !url.includes('/thumb/')).slice(0, 6);
      const dir = `public/images/shop/${group.category}/${item.id}`;
      await fs.mkdir(`${dir}/originals`, { recursive: true });
      const images = [];
      for (const [index, url] of urls.entries()) {
        const number = String(index + 1).padStart(2, '0');
        const response = await fetch(url);
        if (!response.ok) throw new Error(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(`${dir}/originals/${number}.jpg`, buffer);
        const meta = await sharp(buffer).metadata();
        await sharp(buffer).webp({ quality: 94 }).toFile(`${dir}/${number}.webp`);
        images.push({ src: `/${dir.replace('public/', '')}/${number}.webp`, source: url, width: meta.width, height: meta.height });
      }
      const name = data.sourceName.replace(/^\[사은품 오일\s*증정\]\s*/, '');
      products.push({ id: item.id, category: group.category, collection: group.collection, name, ...data, promotion: data.sourceName.startsWith('[사은품') ? '사은품 오일증정' : '', sku: detail.match(/SKU:\s*([^<]+)/)?.[1]?.trim() || name.match(/\b\d{5}\b/)?.[0] || item.id, currency: 'KRW', sourceUrl, sourceCategoryUrl: listUrl, capturedAt: '2026-10-22', images });
      console.log(group.collection, item.id, name, data.price, images.length);
    }
  }
  await fs.writeFile('docs/catalog-source/editorial-selected.json', JSON.stringify(products, null, 2));
  const tiles = [];
  for (const [row, product] of products.entries()) {
    for (const [col, img] of product.images.entries()) tiles.push({ input: await sharp(`public${img.src}`).resize(160, 190, { fit: 'contain', background: '#eee' }).png().toBuffer(), left: col * 160, top: row * 220 });
    tiles.push({ input: Buffer.from(`<svg width="960" height="30"><rect width="960" height="30" fill="white"/><text x="8" y="21" font-size="16">${product.collection} / ${product.id}: images 1-6</text></svg>`), left: 0, top: row * 220 + 190 });
  }
  await sharp({ create: { width: 960, height: products.length * 220, channels: 3, background: '#fff' } }).composite(tiles).png().toFile('docs/catalog-source/editorial-review.png');
} finally { await browser.close(); }
