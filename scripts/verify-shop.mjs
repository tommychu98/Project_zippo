import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const categories = ['new', 'custom', 'armor', '540-color'];
const catalog = Object.fromEntries(await Promise.all(categories.map(async category => [category, JSON.parse(await fs.readFile(`src/data/shop/${category}.json`, 'utf8'))])));
const editorial = JSON.parse(await fs.readFile('src/data/shop/editorial.json', 'utf8'));
for (const category of categories) catalog[category] = [...editorial.filter(item => item.category === category), ...catalog[category]];
const categoryCount = category => catalog[category].length + (category === 'custom' ? products.length : 0);
const browser = await chromium.launch();
const report = [];
const errors = [];
await fs.mkdir('docs/screenshots', { recursive: true });
function track(page) {
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
}
async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(async image => {
      image.loading = 'eager';
      await image.decode().catch(() => {});
    }));
  });
}
async function geometry(page, label) {
  const result = await page.evaluate(() => ({
    width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
    broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
    clippedCaptions: [...document.querySelectorAll('.shop-card-caption')].filter(el => el.scrollWidth > el.clientWidth + 1).length,
  }));
  assert.equal(result.scrollWidth, result.width, `${label}: horizontal overflow`);
  assert.deepEqual(result.broken, [], `${label}: broken images`);
  assert.equal(result.clippedCaptions, 0, `${label}: clipped product name/price`);
  return result;
}
try {
  for (const width of [1920, 1440, 1024, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce', hasTouch: width === 390, isMobile: width === 390 });
    track(page);
    for (const category of categories) {
      await page.goto(`${origin}/shop?category=${category}`);
      await ready(page);
      await expect(page.locator('.shop-editorial-grid .shop-card')).toHaveCount(categoryCount(category));
      await expect(page.locator('.shop-sidebar a[aria-current]')).toHaveAttribute('href', `/shop?category=${category}`);
      report.push({ category, ...await geometry(page, `${category}/${width}`) });
      await page.screenshot({ path: `docs/screenshots/shop-${category}-${width}.png`, fullPage: true });
    }
    await page.locator('.shop-sort select').selectOption('low');
    const prices = await page.locator('.shop-editorial-grid .shop-price-sticker').allTextContents();
    const numbers = prices.map(price => Number(price.replace(/\D/g, '')));
    assert.deepEqual(numbers, [...numbers].sort((a, b) => a - b));
    await page.locator('.shop-sort select').selectOption('featured');
    const card = page.locator('.shop-editorial-grid .shop-card').first();
    if (width === 390) {
      assert.equal(await card.locator('.shop-quick-add').evaluate(el => getComputedStyle(el).opacity), '1');
    } else {
      await card.hover();
      await expect(card.locator('.shop-card-alternate')).toHaveCSS('opacity', '1');
      await expect(card.locator('.shop-card-default')).toHaveCSS('opacity', '0');
      await page.screenshot({ path: `docs/screenshots/shop-hover-${width}.png` });
      await page.mouse.move(0, 0);
      await card.locator('a').focus();
      await expect(card.locator('.shop-card-alternate')).toHaveCSS('opacity', '1');
    }
    await card.locator('.shop-card-link').click();
    await page.waitForURL('**/shop/product/*');
    await ready(page);
    await geometry(page, `product/${width}`);
    await page.screenshot({ path: `docs/screenshots/product-${width}.png`, fullPage: true });
    await page.getByRole('tab', { name: 'THE DETAILS' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'CARE & SERVICE' })).toBeFocused();
    await expect(page.getByRole('tab', { name: 'CARE & SERVICE' })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(page.getByRole('tab', { name: 'THE DETAILS' })).toBeFocused();
    const firstThumb = page.locator('.product-thumbnails button').first();
    await firstThumb.click();
    await expect(firstThumb).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: '제품 이미지 확대', exact: true }).click();
    await expect(page.locator('.product-zoom')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: '구매 수량 늘리기', exact: true }).click();
    await page.locator('.product-add').click();
    const cart = page.locator('.cart-dialog');
    await expect(cart).toBeVisible();
    await expect(cart.locator('.cart-heading')).toContainText('(2)');
    const selected = catalog['540-color'][0];
    await expect(cart.locator('.cart-line-price')).toHaveText(`₩${(selected.price * 2).toLocaleString('ko-KR')}`);
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    await cart.getByRole('button', { name: /수량 늘리기/ }).click();
    await expect(cart.locator('.cart-heading')).toContainText('(3)');
    await page.screenshot({ path: `docs/screenshots/cart-${width}.png` });
    assert.equal(await cart.evaluate(el => el.scrollWidth <= el.clientWidth + 1), true);
    await page.keyboard.press('Escape');
    await expect(cart).not.toBeVisible();
    await page.reload();
    await page.locator('.header-cart-button').click();
    await expect(cart.locator('.cart-heading')).toContainText('(3)');
    await cart.locator('.cart-delete').click();
    await expect(cart.locator('.cart-empty')).toBeVisible();
    await expect(cart.locator('.cart-heading')).toContainText('(0)');
    await cart.locator('.cart-recommendation').first().click();
    await expect(cart.locator('.cart-heading')).toContainText('(1)');
    await cart.locator('.cart-line-name a').click();
    await expect(cart).not.toBeVisible();
    await expect(page.locator('.page-curtain')).not.toBeVisible();
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  track(page);
  await page.goto(origin);
  await page.locator('.desktop-nav a').first().click();
  await page.waitForFunction(() => {
    const rect = document.querySelector('.page-curtain').getBoundingClientRect();
    return rect.width > 0 && Math.abs(rect.top) < 1;
  });
  assert.equal(await page.locator('.page-curtain').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 235, 0)');
  await page.screenshot({ path: 'docs/screenshots/shop-yellow-transition.png' });
  await expect(page.locator('.page-curtain')).not.toBeVisible();
  await expect(page).toHaveURL(`${origin}/shop`);
  await page.locator('.shop-sidebar a[href*="armor"]').click();
  await expect(page.locator('.page-curtain')).not.toBeVisible();
  await expect(page).toHaveURL(`${origin}/shop?category=armor`);
  await page.goBack();
  await expect(page.locator('.page-curtain')).not.toBeVisible();
  await expect(page).toHaveURL(`${origin}/shop`);
  await page.locator('.shop-card-link').first().click();
  await expect(page.locator('.page-curtain')).not.toBeVisible();
  await page.locator('.product-add').click();
  await expect(page.locator('.cart-dialog')).toBeVisible();
  await page.waitForTimeout(550);
  await page.locator('.cart-line-name a').click();
  await expect(page.locator('.cart-dialog')).not.toBeVisible();
  await page.locator('.header-cart-button').click();
  await page.waitForTimeout(550);
  await page.mouse.click(100, 500);
  await expect(page.locator('.cart-dialog')).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const selector of ['.product-card', '.campaign-hero a', '#explore-title a', ...categories.map(category => `.explore-row[href*="${category}"]`)]) {
    await page.goto(origin);
    await page.locator(selector).first().click();
    await expect(page).toHaveURL(/\/shop/);
    const category = new URL(page.url()).searchParams.get('category') || 'new';
    await expect(page.locator('.shop-editorial-grid .shop-card')).toHaveCount(categoryCount(category));
  }
  await page.goto(origin);
  for (const product of products) {
    const card = page.locator(`.product-${product.id}`);
    await expect(card.locator('.product-name')).toHaveText(product.name);
    await expect(card.locator('.product-badge')).toHaveText(`₩${product.price.toLocaleString('ko-KR')}`);
  }
  await page.goto(`${origin}/shop?category=custom`);
  for (const product of products) {
    const card = page.locator(`.shop-card-link[href="/shop/product/classic-${product.id}"]`);
    await expect(card.locator('.shop-card-default')).toHaveAttribute('src', `/images/${product.defaultImage}.webp`);
    await expect(card.locator('.shop-card-alternate')).toHaveAttribute('src', `/images/${product.hoverImage}.webp`);
  }
  await page.evaluate(() => localStorage.removeItem('zippo-cart-v1'));
  await page.goto(`${origin}/shop/product/classic-mint`);
  await ready(page);
  await expect(page.locator('#product-title')).toHaveText(products[0].name);
  await expect(page.locator('.product-price-note')).toBeVisible();
  await expect(page.locator('.product-official')).toHaveCount(0);
  await page.locator('.product-add').click();
  await expect(page.locator('.cart-line-name').filter({ hasText: products[0].name })).toBeVisible();
  await expect(page.locator('.cart-summary .shop-primary-button')).toHaveAttribute('href', 'https://zippo.co.kr/');
  await page.keyboard.press('Escape');
  await page.goto(`${origin}/shop/product/missing`);
  await expect(page.getByRole('heading', { name: 'NOT FOUND.' })).toBeVisible();
  await page.close();
  assert.deepEqual(errors, []);
  await fs.writeFile('docs/shop-verification.json', JSON.stringify({ report, errors, checks: ['40 official products + 4 studio products', 'category filtering', 'price sorting', 'hover/focus', 'touch', 'gallery/zoom', 'cart arithmetic', 'cart persistence/removal/recommendations', 'dialog dismissal', 'yellow transition', 'history', 'home entry links', '404'] }, null, 2));
  console.log('PASS: SHOP, four categories at five widths, product detail, cart, navigation, motion, images and runtime checks.');
} finally { await browser.close(); }
