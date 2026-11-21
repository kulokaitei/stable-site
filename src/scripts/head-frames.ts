/**
 * Head-turn image sequence (public/frames). Frame 1 = facing camera, 87 = profile.
 * One shared set of <img> objects: the preloader waits for the first batch,
 * the hero canvas draws them. The rest load in the background straight after.
 */
import frames from '../data/frames.json';

/** Written by `npm run frames` (scripts/make-frames.mjs): count, file sizes, motion map. */
export const HEAD_FRAME_COUNT: number = frames.count;
/** Frames loaded before the preloader ends; the rest load in the background. */
export const FIRST_BATCH = 10;

let images: HTMLImageElement[] | null = null;

const small = () => matchMedia('(max-width: 767px)').matches;

/** Pixel size of the frame files in use (desktop or mobile set). */
export function headFrameSize(): { width: number; height: number } {
  return small() ? frames.mobile : frames.desktop;
}

/**
 * Frame index (0-based) for a turn progress 0 → 1, paced by MOTION rather than by frame
 * number: frames.json records how far the head has turned at each frame, so equal scroll
 * distances always turn the head by equal amounts (no fast start, no dead ending).
 */
export function frameAt(progress: number): number {
  const m: number[] = frames.motion;
  const p = Math.min(Math.max(progress, 0), 1);
  let i = 1;
  while (i < m.length - 1 && m[i] < p) i++;
  const lo = m[i - 1];
  const hi = m[i];
  return hi > lo ? Math.round(i - 1 + (p - lo) / (hi - lo)) : i;
}

export function headFramePaths(): string[] {
  const dir = small() ? 'head-mobile' : 'head';
  return Array.from(
    { length: HEAD_FRAME_COUNT },
    (_, i) => `/frames/${dir}/${String(i + 1).padStart(3, '0')}.webp`,
  );
}

/** Resolves once the image has loaded — or failed, so loading can never hang. */
export function whenLoaded(img: HTMLImageElement): Promise<void> {
  if (img.src && img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(), { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });
}

/**
 * Creates the frames the first time it is called and returns the same array after that.
 * Frames 1–10 start loading at once; 11–87 start as soon as those are in.
 */
export function headFrames(): HTMLImageElement[] {
  if (!images) {
    const paths = headFramePaths();
    const imgs = paths.map(() => {
      const img = new Image();
      img.decoding = 'async';
      return img;
    });
    imgs.slice(0, FIRST_BATCH).forEach((img, i) => (img.src = paths[i]));
    Promise.all(imgs.slice(0, FIRST_BATCH).map(whenLoaded)).then(() =>
      imgs.forEach((img, i) => i >= FIRST_BATCH && (img.src = paths[i])),
    );
    images = imgs;
  }
  return images;
}
