import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const out = 'docs/screenshots/motion';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const report = [];
const errors = [];
const baseline = await fs.readFile('docs/screenshots/motion-baseline.json', 'utf8').then(JSON.parse).catch(() => null);

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
async function inspectTriggers(page) {
  // Import the exact Vite module already used by the application, avoiding a
  // second ScrollTrigger instance. This also exercises the StrictMode cleanup.
  await page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').map(entry => entry.name).find(url => url.includes('/gsap_ScrollTrigger.js?'));
    window.motionTriggers = (await import(url)).ScrollTrigger;
  });
}
async function geometry(page, width) {
  const result = await page.evaluate(() => ({
    width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
    broken: [...document.images].filter(image => !image.naturalWidth).map(image => image.src),
    sections: Object.fromEntries([...document.querySelectorAll('main > section,.footer-nav,.site-footer,.story-panel,.story-content h3,.story-content > p,.hero-copy,.campaign-hero,.campaign-copy,.gallery-grid,.gallery-stack')].map(element => [element.className || element.tagName, {
      x: element.offsetLeft, y: element.offsetTop, w: element.offsetWidth, h: element.offsetHeight,
    }])),
  }));
  assert.equal(result.scrollWidth, result.width, 'No horizontal overflow');
  assert.deepEqual(result.broken, [], 'No broken images');
  if (baseline?.[width]) {
    for (const [name, rect] of Object.entries(result.sections)) {
      for (const key of ['x', 'y', 'w', 'h']) assert.ok(Math.abs(rect[key] - baseline[width][name][key]) <= 1, `${width}/${name}/${key}: layout preserved`);
    }
  }
  return result;
}
async function scroll(page, top) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
  await page.waitForTimeout(80);
}
async function visitAll(page) {
  const { height, viewport } = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, viewport: innerHeight }));
  for (let y = 0; y < height; y += viewport * .65) await scroll(page, y);
  await page.waitForTimeout(1200);
}
async function assertRevealed(page) {
  const hidden = await page.evaluate(() => [...document.querySelectorAll('.reveal-line,.story-word,.product-reveal,.explore-label,.explore-detail,.footer-newsletter,.footer-columns,.footer-brand,.footer-bottom')].filter(element => Number(getComputedStyle(element).opacity) < .99).map(element => ({ class: element.className, text: element.textContent })));
  assert.deepEqual(hidden, [], 'All visited content is visible');
  assert.equal(await page.locator('.image-mask[style*="clip-path"]').count(), 0, 'Finished photo masks are cleared');
  assert.equal(await page.locator('.image-zoom[style*="transform"]').count(), 0, 'Image zoom settles');
}
async function assertPersistentTriggers(page) {
  const counts = await page.evaluate(() => {
    const all = motionTriggers.getAll();
    return { photos: all.filter(trigger => trigger.vars.id === 'home-photo-parallax').length, campaign: all.filter(trigger => trigger.vars.id === 'home-campaign-expand').length, total: all.length };
  });
  assert.equal(counts.photos, 4, 'Exactly four parallax triggers');
  assert.equal(counts.campaign, 1, 'Exactly one campaign expansion');
  return counts;
}

try {
  for (const width of [1920, 1440, 1024, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, hasTouch: width === 390 });
    track(page);
    await page.goto(origin);
    await ready(page);
    await inspectTriggers(page);
    const layout = await geometry(page, width);
    const initial = await assertPersistentTriggers(page);
    assert.equal(await page.locator('.story-word .story-word').count(), 0, 'No nested text splitting');

    // Sample the campaign before, during and after expansion.
    const { start, end } = await page.evaluate(() => {
      const trigger = motionTriggers.getById('home-campaign-expand');
      return { start: trigger.start, end: trigger.end };
    });
    const clips = [];
    for (const [name, y] of [['small', start], ['half', (start + end) / 2], ['full', end + 10]]) {
      await scroll(page, y);
      await page.waitForTimeout(name === 'full' ? 1100 : 550);
      clips.push(await page.locator('.campaign-visual').evaluate(element => getComputedStyle(element).clipPath));
      if (name !== 'full') {
        assert.equal(await page.locator('#campaign-title .reveal-line').first().evaluate(element => getComputedStyle(element).opacity), '0', 'Campaign copy waits for expansion');
      }
      if ([1440, 390].includes(width)) await page.screenshot({ path: `${out}/campaign-${width}-${name}.png` });
    }
    assert.notEqual(clips[0], clips[1]);
    assert.match(clips[2], /^inset\(0%/);
    await expect(page.locator('#campaign-title')).toBeVisible();

    // Scroll backwards after an instant skip, then walk through every section.
    await scroll(page, 0);
    await scroll(page, 100000);
    await page.waitForTimeout(1300);
    await assertRevealed(page);
    await scroll(page, 0);
    await visitAll(page);
    await assertRevealed(page);
    const final = await assertPersistentTriggers(page);
    const stable = await geometry(page, width);
    assert.deepEqual(stable.sections, layout.sections, 'Animation does not move layout');
    await page.screenshot({ path: `${out}/home-${width}.png`, fullPage: true });

    // Refresh at a restored middle position and let fonts/images settle again.
    await page.locator('#story').evaluate(element => window.scrollTo({ top: element.offsetTop + 150, behavior: 'instant' }));
    await page.reload();
    await ready(page);
    await inspectTriggers(page);
    await page.waitForTimeout(1200);
    await assertPersistentTriggers(page);
    await visitAll(page);
    await assertRevealed(page);

    // Repeat actual client navigation and browser history. Home scopes must be
    // gone in SHOP and rebuilt exactly once when mounted again.
    for (let trip = 0; trip < 2; trip++) {
      await page.locator('.footer-nav a').first().click();
      await page.waitForURL('**/shop');
      await page.waitForTimeout(900);
      assert.equal(await page.evaluate(() => motionTriggers.getAll().filter(trigger => trigger.vars.id?.startsWith('home-')).length), 0, 'Home scroll triggers cleaned up in SHOP');
      if (trip === 0) await page.locator('.footer-nav a').filter({ hasText: 'ABOUT' }).click();
      else await page.goBack();
      await page.waitForURL(url => url.origin === origin && url.pathname === '/');
      await page.waitForTimeout(1100);
      await assertPersistentTriggers(page);
      assert.equal(await page.locator('#campaign-title .reveal-line').first().evaluate(element => getComputedStyle(element).opacity), '0', 'Returning from SHOP does not reveal campaign copy early');
      assert.equal(await page.locator('.reveal-line-mask .reveal-line-mask').count(), 0);
      assert.equal(await page.locator('.story-word').count(), 26);
    }
    await page.locator('#collection').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1100);
    for (const tab of ['EMBLEM', 'LIMITED', 'CLASSIC']) {
      await page.getByRole('tab', { name: tab, exact: true }).click();
      await page.waitForTimeout(900);
      assert.equal(await page.locator('.product-reveal').count(), 4);
      assert.equal(await page.locator('.product-reveal[style*="opacity"]').count(), 0);
    }
    const card = page.locator('.product-card').first();
    await page.locator('.collection-tabs button[aria-selected="true"]').focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(card.locator('.product-hover')).toHaveCSS('opacity', '1');
    await page.locator('.collection-tabs button').first().focus();
    if (width > 768) {
      await card.hover();
      await expect(card.locator('.product-hover')).toHaveCSS('opacity', '1');
      await page.mouse.move(0, 0);
      await expect(card.locator('.product-hover')).toHaveCSS('opacity', '0');
    }

    // Changing the media query must revert running animations immediately.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => motionTriggers.getAll().length), 0);
    assert.equal(await page.locator('.story-word').count(), 0);
    assert.equal(await page.locator('.campaign-visual').evaluate(element => getComputedStyle(element).clipPath), 'none');
    await assertRevealed(page);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(200);
    await assertPersistentTriggers(page);
    await page.setViewportSize({ width: width > 768 ? 390 : 1440, height: 844 });
    await page.waitForTimeout(300);
    await assertPersistentTriggers(page);
    await visitAll(page);
    await assertRevealed(page);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width > 768 ? 390 : 1440);

    report.push({ width, initial, final, clips, checks: ['layout comparison', 'campaign order', 'instant jumps', 'normal scroll', 'middle reload', 'SHOP return x2', 'tabs', 'focus/hover', 'live reduced motion', 'breakpoint resize'] });
    console.log(`PASS motion ${width}`);
    await page.close();
  }
  // Initial reduced-motion render: no hidden setup state even for offscreen content.
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    track(page);
    await page.goto(origin + '/#footer');
    await ready(page);
    await inspectTriggers(page);
    assert.equal(await page.evaluate(() => motionTriggers.getAll().length), 0);
    await assertRevealed(page);
    await geometry(page, width);
    await page.close();
  }
  assert.deepEqual(errors, [], 'No runtime or HTTP errors');
  await fs.writeFile(`${out}/verification.json`, JSON.stringify({ report, errors }, null, 2));
  console.log('PASS: all motion checks, reduced motion, no duplicate triggers or runtime errors.');
} finally { await browser.close(); }
