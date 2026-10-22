import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const categories = ['new', 'custom', 'armor', '540-color'];
const products = (await Promise.all(categories.map(async category => JSON.parse(await fs.readFile(`src/data/shop/${category}.json`, 'utf8'))))).flat();
products.push(...JSON.parse(await fs.readFile('src/data/shop/editorial.json', 'utf8')));
const browser = await chromium.launch();
const page = await browser.newPage();
const report = [];
try {
  for (let offset = 0; offset < products.length; offset += 4) {
    const batch = await Promise.all(products.slice(offset, offset + 4).map(async product => {
      const response = await fetch(product.sourceUrl);
      assert.ok(response.ok, product.sourceUrl);
      return { product, html: await response.text() };
    }));
    for (const { product, html } of batch) {
      const actual = await page.evaluate(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return {
          name: doc.querySelector('.item_detail_tit h3')?.textContent.trim(),
          price: Number(doc.querySelector('.it_price_box strong strong')?.textContent.replaceAll(',', '')),
          basePrice: Number(doc.querySelector('[name="set_goods_price"]')?.value),
        };
      }, html);
      assert.equal(actual.name, product.sourceName, `Name mismatch: ${product.id}`);
      assert.equal(actual.price, product.price, `Price mismatch: ${product.id}`);
      assert.notEqual(product.defaultImage, product.hoverImage);
      await fs.access(`public${product.hoverImage}`);
      await fs.access(`public${product.defaultImage}`);
      for (const item of product.images) await fs.access(`public${item.src}`);
      report.push({ id: product.id, category: product.category, sourceUrl: product.sourceUrl, ...actual, verifiedAt: '2026-10-22' });
    }
  }
  await fs.writeFile('docs/catalog-source/verification.json', JSON.stringify(report, null, 2) + '\n');
  console.log(`PASS: ${report.length} official names/prices verified live; all local images exist.`);
} finally { await browser.close(); }
