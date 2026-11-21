/**
 * Draws one head-turn frame onto a canvas the same way everywhere (hero + contact).
 * Landscape: cover the canvas. Portrait (phones): keep the whole head in view, near the top.
 * The frames' pure black is turned into exactly the page background with 'lighten'.
 */
const BG = '#050404';

export function drawFrame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement): void {
  const { width: cw, height: ch } = canvas;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  let s: number, dx: number, dy: number;
  if (cw >= ch) {
    s = Math.max(cw / iw, ch / ih);
    dx = (cw - iw * s) / 2;
    dy = (ch - ih * s) / 2;
  } else {
    s = cw / (iw * 0.55);
    dx = cw / 2 - iw * 0.53 * s;
    dy = ch * 0.08;
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighten';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, dx, dy, iw * s, ih * s);
}

/** Canvas sized to its box × devicePixelRatio (max 2). Returns the new size. */
export function sizeCanvas(canvas: HTMLCanvasElement): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
}

/** The loaded frame closest to `i` (frames may still be loading). */
export function nearestReady(images: HTMLImageElement[], i: number): HTMLImageElement | null {
  const ok = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0;
  for (let d = 0; d < images.length; d++) {
    if (ok(images[i - d])) return images[i - d];
    if (ok(images[i + d])) return images[i + d];
  }
  return null;
}
