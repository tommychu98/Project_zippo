import fs from 'node:fs/promises';
import sharp from 'sharp';

const selected = JSON.parse(await fs.readFile('docs/catalog-source/selected.json', 'utf8'));
const catalog = [];
// One-based gallery selections, visually checked against the official photos.
const imageSelections = {
  '1000000617': [3, 1], '1000000533': [1, 4], '1000000871': [1, 3],
  '1000000874': [1, 4], '1000000875': [2, 1], '1000000731': [1, 3],
  '1000001033': [1, 3], '1000001550': [1, 2],
  '1000002189': [2, 1], '1000001871': [2, 1], '1000001842': [1, 4],
  '1000001837': [2, 3], '1000001834': [2, 4], '1000001830': [1, 2],
  '1000001632': [3, 1], '1000001402': [2, 1],
  '1000001892': [3, 1], '1000001888': [3, 1], '1000001890': [2, 1],
  '1000001770': [2, 1], '1000001464': [1, 2], '1000001985': [2, 1],
  '1000001993': [2, 1], '1000002374': [2, 1],
};
for (const [category, products] of Object.entries(selected)) {
  for (const product of products) {
    const dir = `public/images/shop/${category}/${product.id}`;
    await fs.mkdir(`${dir}/originals`, { recursive: true });
    const html = await fs.readFile(`docs/catalog-source/${product.id}.html`, 'utf8');
    const images = [];
    for (const [i, url] of product.imageUrls.slice(0, 6).entries()) {
      const filename = `${String(i + 1).padStart(2, '0')}`;
      const original = `${dir}/originals/${filename}.jpg`;
      let buffer;
      try { buffer = await fs.readFile(original); } catch {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status} ${url}`);
        buffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(original, buffer);
      }
      const meta = await sharp(buffer).metadata();
      await sharp(buffer).webp({ quality: 94 }).toFile(`${dir}/${filename}.webp`);
      images.push({ src: `/images/shop/${category}/${product.id}/${filename}.webp`, source: url, width: meta.width, height: meta.height });
    }
    const [defaultIndex, hoverIndex] = imageSelections[product.id] || [2, 1];
    catalog.push({
      id: product.id, category,
      name: product.name.replace(/^\[사은품 오일증정\]\s*/, ''),
      sourceName: product.name,
      promotion: product.name.startsWith('[사은품 오일증정]') ? '사은품 오일증정' : '',
      sku: html.match(/SKU:\s*([^<]+)/)?.[1]?.trim() || product.name.match(/\b(\d{5})\b/)?.[1] || product.id,
      price: product.price, currency: 'KRW', sourceUrl: product.sourceUrl,
      capturedAt: '2026-10-22', images,
      defaultImage: images[defaultIndex - 1].src, hoverImage: images[hoverIndex - 1].src,
      hoverStyle: (category === 'new' || hoverIndex === 1 || product.id === '1000001550' || product.id === '1000001830' || product.id === '1000001464') ? 'scene' : 'detail',
    });
    console.log(category, product.id, images.length);
  }
}
await fs.mkdir('src/data/shop', { recursive: true });
for (const category of Object.keys(selected)) {
  await fs.writeFile(`src/data/shop/${category}.json`, JSON.stringify(catalog.filter(p => p.category === category), null, 2) + '\n');
}
await fs.writeFile('docs/catalog-source/manifest.json', JSON.stringify(catalog, null, 2));
const tiles = [];
for (const [i, p] of catalog.entries()) {
  for (let j = 0; j < 2; j++) {
    tiles.push({ input: await sharp(`public${p.images[j].src}`).resize(140, 170, { fit: 'contain', background: '#eee' }).png().toBuffer(), left: (i % 4) * 280 + j * 140, top: Math.floor(i / 4) * 200 });
  }
  tiles.push({ input: Buffer.from(`<svg width="280" height="30"><rect width="280" height="30" fill="white"/><text x="5" y="20" font-size="13">${p.category} / ${p.id}</text></svg>`), left: (i % 4) * 280, top: Math.floor(i / 4) * 200 + 170 });
}
await sharp({ create: { width: 1120, height: Math.ceil(catalog.length / 4) * 200, channels: 3, background: '#fff' } }).composite(tiles).png().toFile('docs/catalog-source/image-review.png');
