/**
 * Builds the hero head-turn frames from a video, with evenly paced motion.
 *
 *   npm run frames -- raw/video/head-turn-v2.mp4 [--count 120] [--no-denoise]
 *   npm run frames -- --analyze        (keep the current frames, only re-measure motion)
 *
 * 1. Extracts every frame (ffmpeg), with a light temporal denoise against AI flicker.
 * 2. Measures how much the picture changes between frames.
 * 3. Picks --count frames spaced by MOTION, not time, so every bit of scrolling turns the
 *    head by the same amount (no fast start / dead ending).
 * 4. Writes public/frames/head (desktop, up to 2560px) and head-mobile (1200px) as WebP,
 *    and src/data/frames.json (count, sizes, motion map) which the site reads.
 * Requires ffmpeg on the PATH (not needed for --analyze).
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, def) => (args.includes(name) ? args[args.indexOf(name) + 1] : def);
const DESKTOP_DIR = 'public/frames/head';
const MOBILE_DIR = 'public/frames/head-mobile';
const MOBILE_WIDTH = 1200;

/** Mean absolute difference between consecutive frames (small greyscale thumbnails). */
async function motionOf(files) {
  const thumbs = [];
  for (const f of files) thumbs.push(await sharp(f).greyscale().resize(192, 108, { fit: 'fill' }).raw().toBuffer());
  const diffs = [0];
  for (let i = 1; i < thumbs.length; i++) {
    let sum = 0;
    for (let j = 0; j < thumbs[i].length; j++) sum += Math.abs(thumbs[i][j] - thumbs[i - 1][j]);
    diffs.push(sum / thumbs[i].length);
  }
  return diffs;
}

/** Cumulative motion, normalised 0 → 1 (frame i has turned motion[i] of the way). */
function cumulative(diffs) {
  const out = [];
  let acc = 0;
  for (const d of diffs) out.push((acc += d));
  const total = acc || 1;
  return out.map((v) => +(v / total).toFixed(4));
}

async function writeJson(desktopFiles, mobileFiles) {
  const d = await sharp(desktopFiles[0]).metadata();
  const m = await sharp(mobileFiles[0]).metadata();
  const motion = cumulative(await motionOf(mobileFiles));
  const json = {
    count: desktopFiles.length,
    desktop: { width: d.width, height: d.height },
    mobile: { width: m.width, height: m.height },
    motion,
  };
  writeFileSync('src/data/frames.json', JSON.stringify(json) + '\n');
  const at = (q) => motion.findIndex((v) => v >= q) + 1;
  console.log(`frames.json: ${json.count} frames, desktop ${d.width}×${d.height}, mobile ${m.width}×${m.height}`);
  console.log(`motion done by frame: 25%→${at(0.25)}  50%→${at(0.5)}  75%→${at(0.75)}  90%→${at(0.9)}`);
}

const list = (dir) => readdirSync(dir).filter((f) => f.endsWith('.webp')).sort().map((f) => join(dir, f));

if (flag('--analyze')) {
  await writeJson(list(DESKTOP_DIR), list(MOBILE_DIR));
  process.exit(0);
}

const input = args.find((a) => !a.startsWith('--') && a !== opt('--count', null));
if (!input) {
  console.error('Usage: npm run frames -- <video> [--count 120] [--no-denoise]  |  npm run frames -- --analyze');
  process.exit(1);
}
const count = Number(opt('--count', 120));
const tmp = mkdtempSync(join(tmpdir(), 'frames-'));
try {
  const filters = flag('--no-denoise') ? [] : ['hqdn3d=1.5:1.5:6:6'];
  execFileSync('ffmpeg', ['-v', 'error', '-i', input, ...(filters.length ? ['-vf', filters.join(',')] : []), join(tmp, '%05d.png')], { stdio: 'inherit' });
  const all = readdirSync(tmp).sort().map((f) => join(tmp, f));
  console.log(`${input}: ${all.length} source frames`);

  // Pick frames evenly spaced by cumulative motion.
  const motion = cumulative(await motionOf(all));
  const picked = [];
  for (let k = 0; k < count; k++) {
    const target = k / (count - 1);
    let i = motion.findIndex((v) => v >= target);
    if (i < 0) i = all.length - 1;
    if (picked[picked.length - 1] !== i) picked.push(i);
  }
  console.log(`picked ${picked.length} frames (motion-spaced)`);

  const src = await sharp(all[0]).metadata();
  const desktopWidth = Math.max(1920, Math.min(2560, src.width));
  for (const dir of [DESKTOP_DIR, MOBILE_DIR]) {
    mkdirSync(dir, { recursive: true });
    for (const f of readdirSync(dir)) if (f.endsWith('.webp')) rmSync(join(dir, f));
  }
  let n = 0;
  for (const i of picked) {
    const name = `${String(++n).padStart(3, '0')}.webp`;
    await sharp(all[i]).resize({ width: desktopWidth, kernel: 'lanczos3' }).webp({ quality: 82, effort: 5 }).toFile(join(DESKTOP_DIR, name));
    await sharp(all[i]).resize({ width: MOBILE_WIDTH, kernel: 'lanczos3' }).webp({ quality: 80, effort: 5 }).toFile(join(MOBILE_DIR, name));
  }
  await writeJson(list(DESKTOP_DIR), list(MOBILE_DIR));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
