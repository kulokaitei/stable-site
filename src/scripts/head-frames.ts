/**
 * Head-turn image sequence (public/frames). Frame 1 = facing camera, 87 = profile.
 * One shared set of <img> objects: the preloader waits for the first batch,
 * the hero canvas draws them. The rest load in the background straight after.
 */
export const HEAD_FRAME_COUNT = 87;
/** Frames loaded before the preloader ends; the rest load in the background. */
export const FIRST_BATCH = 10;

let images: HTMLImageElement[] | null = null;

const small = () => matchMedia('(max-width: 767px)').matches;

/** Pixel size of the frame files in use (desktop or mobile set). */
export function headFrameSize(): { width: number; height: number } {
  return small() ? { width: 1200, height: 675 } : { width: 1920, height: 1080 };
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
