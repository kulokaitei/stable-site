/**
 * Responsive WebP copies made by `npm run images` (scripts/optimize-images.mjs).
 * Keep WIDTHS in sync with that script.
 */
const WIDTHS: Record<string, number[]> = {
  '/images/hero-still.jpg': [480, 800, 1200],
};
const DEFAULT_WIDTHS = [640, 1024, 1600]; // /images/stable/*.jpg
const HORSE_WIDTHS = [480, 800]; // /images/horses/*.jpg

export function webpSrcset(src: string): string | null {
  if (!src.endsWith('.jpg') || !src.startsWith('/images/')) return null;
  const widths = WIDTHS[src] ?? (src.startsWith('/images/horses/') ? HORSE_WIDTHS : DEFAULT_WIDTHS);
  return widths.map((w) => `${src.replace(/\.jpg$/, `-${w}.webp`)} ${w}w`).join(', ');
}
