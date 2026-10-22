import fs from "node:fs/promises";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
const root = new URL("../public/images/", import.meta.url);
const names = (await fs.readdir(root)).filter(
  (name) => name.endsWith(".png") && !name.startsWith("candidate-"),
);
const manifest = [];
for (const name of names) {
  const file = new URL(name, root);
  const metadata = await sharp(fileURLToPath(file)).metadata();
  await sharp(fileURLToPath(file))
    .webp({ quality: 96, effort: 6 })
    .toFile(fileURLToPath(new URL(name.replace(".png", ".webp"), root)));
  manifest.push({
    file: name,
    width: metadata.width,
    height: metadata.height,
    bytes: (await fs.stat(file)).size,
  });
}
await fs.writeFile(
  new URL("../docs/asset-manifest.json", import.meta.url),
  JSON.stringify(manifest, null, 2),
);
console.log(
  `Prepared ${manifest.length} full-resolution WebP assets; originals preserved.`,
);
