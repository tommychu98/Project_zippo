import fs from 'node:fs/promises';
import sharp from 'sharp';
const record = JSON.parse(await fs.readFile('docs/catalog-source/valkyrie-default-edit.json', 'utf8'));
await fs.copyFile(record.original, record.output.replace('.webp', '.png'));
await sharp(record.original).webp({ quality: 95 }).toFile(record.output);
console.log('Saved Valkyrie catalog image:', record.output);
