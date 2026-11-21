/**
 * Head-turn image sequence (public/frames). Frame 1 = facing camera, 87 = profile.
 * Loaded once by the preloader; the scroll-driven canvas reuses the cache.
 */
export const HEAD_FRAME_COUNT = 87;

let cache: HTMLImageElement[] | null = null;

export function headFramePaths(): string[] {
  const dir = matchMedia('(max-width: 767px)').matches ? 'head-mobile' : 'head';
  return Array.from(
    { length: HEAD_FRAME_COUNT },
    (_, i) => `/frames/${dir}/${String(i + 1).padStart(3, '0')}.webp`,
  );
}

/** Resolves when the image is decoded — or failed, so loading can never hang. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  return img.decode().then(
    () => img,
    () => img,
  );
}

export function preloadHeadFrames(onEach: () => void): Promise<HTMLImageElement[]> {
  return Promise.all(
    headFramePaths().map((src) =>
      loadImage(src).then((img) => {
        onEach();
        return img;
      }),
    ),
  ).then((imgs) => (cache = imgs));
}

export const getHeadFrames = () => cache;
