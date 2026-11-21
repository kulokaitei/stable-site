/**
 * Responsive WebP copies made by `npm run images` (scripts/optimize-images.mjs).
 * Keep WIDTHS in sync with that script.
 */
const WIDTHS: Record<string, number[]> = {
  '/images/hero-still.jpg': [480, 800, 1200],
};
const DEFAULT_WIDTHS = [640, 1024, 1600]; // /images/stable/*.jpg

export function webpSrcset(src: string): string | null {
  if (!src.endsWith('.jpg') || !src.startsWith('/images/')) return null;
  const widths = WIDTHS[src] ?? DEFAULT_WIDTHS;
  return widths.map((w) => `${src.replace(/\.jpg$/, `-${w}.webp`)} ${w}w`).join(', ');
}

/** A single mid-size WebP (e.g. for the floating horse portrait). */
export function webpAt(src: string, width: number): string {
  return src.endsWith('.jpg') ? src.replace(/\.jpg$/, `-${width}.webp`) : src;
}
