import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const products = JSON.parse(await fs.readFile('src/data/shop/editorial.json', 'utf8'));
const browser = await chromium.launch();
const errors = [];
try {
  for (const width of [1920, 1440, 1024, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
    await page.goto('http://127.0.0.1:5173');
    for (const collection of ['EMBLEM', 'LIMITED']) {
      const items = products.filter(item => item.collection === collection);
      await page.getByRole('tab', { name: collection, exact: true }).click();
      await expect(page.locator('.product-card')).toHaveCount(4);
      await page.locator('.product-carousel').evaluate(el => { el.scrollLeft = 0; });
      for (const item of items) {
        const card = page.locator(`.product-${item.id}`);
        await expect(card.locator('.product-name')).toHaveText(item.displayName);
        await expect(card.locator('.product-badge')).toHaveText(`₩${item.price.toLocaleString('ko-KR')}`);
        await card.evaluate(async el => { await Promise.all([...el.querySelectorAll('img')].map(async img => { img.loading = 'eager'; await img.decode(); })); });
        await page.keyboard.press('Tab');
        await card.focus();
        await expect(card.locator('.product-hover')).toHaveCSS('opacity', '1');
        assert.equal(await card.evaluate(el => { const n = el.querySelector('.product-name').getBoundingClientRect(), p = el.querySelector('.product-badge').getBoundingClientRect(); return n.right <= p.left + 1; }), true);
      }
      await page.locator('.product-card').first().focus();
      await page.locator('.product-carousel').evaluate(el => { el.scrollLeft = 0; });
      await page.locator('.collection-section').screenshot({ path: `docs/screenshots/collection-${collection.toLowerCase()}-${width}.png` });
      await page.locator('.product-card').first().click();
      await expect(page).toHaveURL(`http://127.0.0.1:5173/shop?category=${items[0].category}`);
      await expect(page.locator('.shop-editorial-grid .shop-card')).toHaveCount(12);
      await page.goto('http://127.0.0.1:5173');
    }
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const item of products) {
    await page.goto(`http://127.0.0.1:5173/shop/product/${item.id}`);
    await expect(page.locator('#product-title')).toHaveText(item.name);
    await expect(page.locator('.product-official')).toHaveAttribute('href', item.sourceUrl);
  }
  assert.deepEqual(errors, []);
  console.log('PASS: EMBLEM/LIMITED: 8 products, 5 widths, generated hover images, labels/prices, category navigation, official detail links.');
} finally { await browser.close(); }
