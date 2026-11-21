/**
 * Fine, static film grain for the head-turn frames (hides any leftover AI smoothness, the
 * way photographers finish a print). The same seeded pattern is used for every frame, so
 * the grain never moves — the hero stays completely still until the visitor scrolls.
 * 'soft-light' leaves pure black untouched, so the background still matches the page.
 * Works in the page and in the frame worker.
 */
const TILE = 256;
const AMPLITUDE = 56; // ± around mid-grey
export const GRAIN_STRENGTH = 0.5;

type AnyCanvas = OffscreenCanvas | HTMLCanvasElement;
let tile: AnyCanvas | null = null;

function makeTile(): AnyCanvas {
  const c: AnyCanvas =
    typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(TILE, TILE) : Object.assign(document.createElement('canvas'), { width: TILE, height: TILE });
  const ctx = c.getContext('2d') as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
  const img = ctx.createImageData(TILE, TILE);
  let seed = 20261121; // fixed seed: identical grain everywhere
  for (let i = 0; i < img.data.length; i += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const v = 128 + ((seed / 0xffffffff) * 2 - 1) * AMPLITUDE;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

export function paintGrain(ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D, width: number, height: number): void {
  tile ??= makeTile();
  const pattern = ctx.createPattern(tile as CanvasImageSource, 'repeat');
  if (!pattern) return;
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = GRAIN_STRENGTH;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
