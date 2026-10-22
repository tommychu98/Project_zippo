import fs from "node:fs/promises";
const path = new URL("../public/fonts/google-fonts.css", import.meta.url);
let css = await fs.readFile(path, "utf8");
const urls = [
  ...new Set([...css.matchAll(/url\((https[^)]+)\)/g)].map((m) => m[1])),
];
for (const [i, url] of urls.entries()) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font download failed: ${response.status}`);
  const name = `font-${i}.ttf`;
  await fs.writeFile(
    new URL("../public/fonts/" + name, import.meta.url),
    Buffer.from(await response.arrayBuffer()),
  );
  css = css.replaceAll(url, "/fonts/" + name);
}
await fs.writeFile(path, css);
console.log(`Localized ${urls.length} fonts.`);
