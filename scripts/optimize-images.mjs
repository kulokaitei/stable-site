/**
 * Makes responsive WebP copies of the site photos (the original JPGs stay as they are).
 *   npm run images
 * Output sits next to each original: name-640.webp, name-1024.webp, …
 * Horse portraits are read from raw/images/horses/*.png.
 * The sizes must match WIDTHS in src/data/images.ts.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const jobs = [
  ...readdirSync('public/images/stable')
    .filter((f) => f.endsWith('.jpg'))
    .map((f) => ({ file: join('public/images/stable', f), widths: [640, 1024, 1600] })),
  { file: 'public/images/hero-still.jpg', widths: [480, 800, 1200] },
];

// Horse portraits: raw/images/horses/<slug>.png → public/images/horses/<slug>.jpg (fallback)
// plus the WebP sizes above. (raw/ is never linked from the site.)
if (existsSync('raw/images/horses')) {
  mkdirSync('public/images/horses', { recursive: true });
  for (const f of readdirSync('raw/images/horses').filter((f) => f.endsWith('.png'))) {
    const jpg = join('public/images/horses', f.replace(/\.png$/, '.jpg'));
    await sharp(join('raw/images/horses', f)).resize({ width: 800 }).jpeg({ quality: 82, mozjpeg: true }).toFile(jpg);
    console.log(jpg);
    jobs.push({ file: jpg, widths: [480, 800] });
  }
}

for (const { file, widths } of jobs) {
  for (const w of widths) {
    const out = file.replace(/\.jpg$/, `-${w}.webp`);
    const info = await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
    console.log(out, `${Math.round(info.size / 1024)} KB`);
  }
}
