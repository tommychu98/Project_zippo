import fs from 'node:fs/promises';
import sharp from 'sharp';
const jobs = JSON.parse(await fs.readFile('docs/catalog-source/editorial-generated.json', 'utf8'));
for (const job of jobs) {
  const folder = `public/images/collections/${job.collection || (job.category === 'armor' ? 'emblem' : 'limited')}`;
  await fs.mkdir(folder, { recursive: true });
  await fs.copyFile(job.original, `${folder}/${job.id}-hover.png`);
  await sharp(job.original).webp({ quality: 95 }).toFile(`${folder}/${job.id}-hover.webp`);
  console.log(job.id, await sharp(`${folder}/${job.id}-hover.webp`).metadata());
}
