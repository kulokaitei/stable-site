/**
 * Responsive WebP copies made by `npm run images` (scripts/optimize-images.mjs), which also
 * writes image-sizes.json: the widths that exist for each photo.
 */
import sizes from './image-sizes.json';

const manifest = sizes as Record<string, number[]>;

export function webpSrcset(src: string): string | null {
  const widths = manifest[src];
  if (!widths) return null;
  return widths.map((w) => `${src.replace(/\.jpg$/, `-${w}.webp`)} ${w}w`).join(', ');
}
