/**
 * Head-turn canvases (hero + contact) share one way of framing and drawing the frames.
 * Landscape: cover the canvas. Portrait (phones): keep the whole head in view, near the top.
 * The frames' pure black is turned into exactly the page background with 'lighten'.
 */
import { focusFrame, frameSource, isFocused, onFrameReady } from './frame-cache';
import { headFrameSize } from './head-frames';

const BG = '#050404';

export interface Layout {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/** Where a frame of size iw×ih goes on a cw×ch canvas. */
export function frameLayout(cw: number, ch: number, iw: number, ih: number): Layout {
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
  return { dx, dy, dw: iw * s, dh: ih * s };
}

/** Full draw (scale + blend) — used only before a prepared frame is available. */
export function drawFrame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: CanvasImageSource): void {
  const iw = img instanceof HTMLImageElement ? img.naturalWidth : (img as ImageBitmap).width;
  const ih = img instanceof HTMLImageElement ? img.naturalHeight : (img as ImageBitmap).height;
  const { dx, dy, dw, dh } = frameLayout(canvas.width, canvas.height, iw, ih);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighten';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.globalCompositeOperation = 'source-over';
}

/**
 * Canvas backing size: its CSS size × devicePixelRatio, but never more pixels than the
 * frames themselves have (more would only upscale them — same picture, more work).
 */
export function sizeCanvas(canvas: HTMLCanvasElement): void {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  const { width: iw, height: ih } = headFrameSize();
  const scaleAt1x = frameLayout(w, h, iw, ih).dw / iw; // how much a frame is scaled at 1 device pixel per CSS pixel
  const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.max(1, 1 / scaleAt1x));
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
}

/**
 * A canvas that shows head-turn frame `wantFrame()`. Call `draw()` whenever that may have
 * changed (e.g. on scroll) — it only repaints when there is something different to show —
 * and `focus()` while this canvas is the one in use, so the frames around it get prepared.
 */
export function framePlayer(canvas: HTMLCanvasElement, wantFrame: () => number) {
  const ctx = canvas.getContext('2d', { alpha: false })!; // opaque: cheaper to composite
  let shown: CanvasImageSource | null = null;
  let shownIndex = -1;
  let shownPrepared = false;

  const draw = (force = false) => {
    const best = frameSource(wantFrame(), canvas);
    if (!best || (!force && best.src === shown)) return;
    // Never do the slow (decode + scale) draw in the middle of a scroll: keep the current
    // picture until a prepared frame arrives (onFrameReady repaints then). The slow draw is
    // only for the very first picture, before anything is prepared.
    if (!best.prepared && shown && !force) return;
    shown = best.src;
    shownIndex = best.index;
    shownPrepared = best.prepared;
    if (best.prepared) {
      ctx.drawImage(best.src, 0, 0); // already scaled, positioned and blended: a 1:1 copy
    } else {
      drawFrame(canvas, ctx, best.src);
    }
  };

  // A frame became available: repaint if it is closer to the wanted frame than what is
  // shown, or it is the prepared version of the frame already shown.
  onFrameReady((i, forCanvas) => {
    if (forCanvas && forCanvas !== canvas) return;
    const want = wantFrame();
    if (shownIndex < 0 || Math.abs(i - want) < Math.abs(shownIndex - want) || (i === shownIndex && !shownPrepared)) {
      draw(true);
    }
  });

  new ResizeObserver(() => {
    const before = `${canvas.width}x${canvas.height}`;
    sizeCanvas(canvas);
    if (`${canvas.width}x${canvas.height}` !== before) {
      shown = null;
      if (isFocused(canvas)) focusFrame(wantFrame(), canvas, true); // prepared frames were for the old size
    }
    draw(true);
  }).observe(canvas);

  return { draw, focus: () => focusFrame(wantFrame(), canvas) };
}
