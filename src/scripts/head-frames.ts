/**
 * Head-turn image sequence (public/frames). Frame 1 = facing camera, 87 = profile.
 * One shared set of <img> objects: the preloader counts them, the hero canvas draws them.
 */
export const HEAD_FRAME_COUNT = 87;

let images: HTMLImageElement[] | null = null;

export function headFramePaths(): string[] {
  const dir = matchMedia('(max-width: 767px)').matches ? 'head-mobile' : 'head';
  return Array.from(
    { length: HEAD_FRAME_COUNT },
    (_, i) => `/frames/${dir}/${String(i + 1).padStart(3, '0')}.webp`,
  );
}

/** Starts loading all frames (in order) the first time it is called; returns the same images after that. */
export function headFrames(): HTMLImageElement[] {
  if (!images) {
    images = headFramePaths().map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      return img;
    });
  }
  return images;
}

/** Resolves once the image has loaded — or failed, so loading can never hang. */
export function whenLoaded(img: HTMLImageElement): Promise<void> {
  if (img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(), { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });
}
