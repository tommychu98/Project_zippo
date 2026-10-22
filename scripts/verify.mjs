import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({ headless: true });
await fs.mkdir("docs/screenshots", { recursive: true });
const report = [];
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
for (const width of [1920, 1440, 1024, 768, 390]) {
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) {
      image.loading = "eager";
      await image.decode().catch(() => {});
    }
  });
  const geometry = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    broken: [...document.images]
      .filter((i) => !i.complete || !i.naturalWidth)
      .map((i) => i.src),
    sections: [
      ...document.querySelectorAll("main>section,.footer-nav,.site-footer"),
    ].map((e) => ({
      name: e.className,
      top: e.offsetTop,
      height: e.offsetHeight,
    })),
    images: [...document.querySelectorAll("picture")].map((p) => {
      const i = p.querySelector("img"),
        r = p.getBoundingClientRect();
      return {
        name: i.getAttribute("src"),
        natural: [i.naturalWidth, i.naturalHeight],
        rendered: [Math.round(r.width), Math.round(r.height)],
      };
    }),
  }));
  assert.equal(geometry.scrollWidth, width, `Horizontal overflow at ${width}`);
  assert.deepEqual(geometry.broken, []);
  await page.screenshot({
    path: `docs/screenshots/home-${width}.png`,
    fullPage: true,
  });
  await page.getByRole("tab", { name: "EMBLEM", exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(4);
  await expect(page.locator('.product-card').first()).toContainText('Valkyrie Gold Emblem');
  await page.getByRole('tab', { name: 'LIMITED', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(4);
  await expect(page.locator('.product-card').first()).toContainText('Pink Floyd');
  await page.getByRole("tab", { name: "CLASSIC", exact: true }).click();
  const carousel = page.locator(".product-carousel");
  await page.getByRole("button", { name: "다음 제품", exact: true }).click();
  await page.waitForTimeout(100);
  assert.ok(
    (await carousel.evaluate((e) => e.scrollLeft)) > 0,
    "Carousel moves forward",
  );
  await page.getByRole("button", { name: "이전 제품", exact: true }).click();
  const card = page.locator(".product-card").first();
  await page.locator(".collection-tabs button").last().focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".product-hover")).opacity ===
      "1",
  );
  assert.equal(
    await card
      .locator(".product-hover")
      .evaluate((e) => getComputedStyle(e).opacity),
    "1",
  );
  await card.click();
  await page.waitForURL('**/shop?category=custom');
  await page.locator('.shop-editorial-grid').waitFor();
  await page.goBack();
  await page.locator('.campaign-form').waitFor();
  const form = page.locator(".campaign-form");
  await form.getByRole("button", { name: "JOIN", exact: true }).click();
  await form.getByRole("status").filter({ hasText: "올바른 이메일" }).waitFor();
  await form.getByRole("textbox").fill("review@example.com");
  await form.getByRole("button", { name: "JOIN", exact: true }).click();
  await form
    .getByRole("status")
    .filter({ hasText: "저장되지 않습니다" })
    .waitFor();
  if (width <= 768) {
    await page.getByRole("button", { name: "MENU +", exact: true }).click();
    await page
      .getByRole("navigation", { name: "모바일 메뉴" })
      .getByRole("link", { name: "ABOUT" })
      .click();
    assert.equal(await page.locator(".mobile-nav").count(), 0);
  }
  assert.deepEqual(errors, []);
  report.push({
    ...geometry,
    errors,
    interactions:
      "tabs, carousel, focus image, shop navigation, newsletter validation" +
      (width <= 768 ? ", mobile menu" : ""),
  });
  await page.close();
}
await fs.writeFile("docs/verification.json", JSON.stringify(report, null, 2));
await browser.close();
console.log(
  "PASS: 1920 / 1440 / 1024 / 768 / 390, all images, no overflow or console errors, interactions.",
);
