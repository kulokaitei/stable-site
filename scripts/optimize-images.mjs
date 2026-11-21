/**
 * Makes responsive WebP copies of the site photos (the original JPGs stay as they are).
 *   npm run images
 * Output sits next to each original: name-640.webp, name-1024.webp, …
 * The sizes must match WIDTHS in src/data/images.ts.
 */
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const jobs = [
  ...readdirSync('public/images/stable')
    .filter((f) => f.endsWith('.jpg'))
    .map((f) => ({ file: join('public/images/stable', f), widths: [640, 1024, 1600] })),
  { file: 'public/images/hero-still.jpg', widths: [480, 800, 1200] },
];

for (const { file, widths } of jobs) {
  for (const w of widths) {
    const out = file.replace(/\.jpg$/, `-${w}.webp`);
    const info = await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
    console.log(out, `${Math.round(info.size / 1024)} KB`);
  }
}
