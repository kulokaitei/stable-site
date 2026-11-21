/**
 * Makes the site's photos from the originals (never edits the originals).
 *   npm run images
 *
 * - Stable photos: raw/images/stable-v2/<name>.png → public/images/stable/<name>.jpg
 * - Horse portraits: raw/images/horses/<slug>.png → public/images/horses/<slug>.jpg
 * - Then a responsive WebP set next to each JPG (name-<width>.webp), plus the hero still.
 * - Writes src/data/image-sizes.json (which widths exist for each photo), read by
 *   src/data/images.ts to build exact srcsets.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const jobs = []; // { file: public jpg path, widths: [...] }

async function fromRaw(rawDir, outDir, maxWidth, quality) {
  if (!existsSync(rawDir)) return;
  mkdirSync(outDir, { recursive: true });
  for (const f of readdirSync(rawDir).filter((f) => f.endsWith('.png')).sort()) {
    const jpg = join(outDir, f.replace(/\.png$/, '.jpg'));
    const info = await sharp(join(rawDir, f))
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toFile(jpg);
    const portrait = info.height > info.width;
    const sizes = portrait ? [480, 960] : [640, 1024, 1536];
    jobs.push({ file: jpg, widths: [...new Set(sizes.map((w) => Math.min(w, info.width)))] });
    console.log(jpg, `${info.width}×${info.height}`);
  }
}

await fromRaw('raw/images/stable-v2', 'public/images/stable', 1536, 84);
await fromRaw('raw/images/horses', 'public/images/horses', 800, 82);
jobs.push({ file: 'public/images/hero-still.jpg', widths: [480, 800, 1200] });

const manifest = {};
for (const { file, widths } of jobs) {
  for (const w of widths) {
    const out = file.replace(/\.jpg$/, `-${w}.webp`);
    const info = await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
    console.log('  ', out, `${Math.round(info.size / 1024)} KB`);
  }
  manifest[file.replace(/^public/, '')] = widths;
}
writeFileSync('src/data/image-sizes.json', JSON.stringify(manifest, null, 2) + '\n');
