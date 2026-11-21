/**
 * Background worker: fetches a head-turn frame (from the browser cache), decodes it and
 * turns it into exactly what the canvas shows — scaled and positioned for the canvas, its
 * black blended into the page background ('lighten'), plus static film grain. All of this stays off the main
 * thread; the page then only copies the result 1:1.
 */
import { paintGrain } from './grain';

const BG = '#050404';

interface Job {
  id: number;
  url: string;
  width: number;
  height: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

self.onmessage = async (e: MessageEvent<Job>) => {
  const { id, url, width, height, dx, dy, dw, dh } = e.data;
  try {
    const blob = await (await fetch(url)).blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d', { alpha: false })!;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighten';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, dx, dy, dw, dh);
    bitmap.close();
    paintGrain(ctx, width, height);
    const out = canvas.transferToImageBitmap();
    (self as unknown as Worker).postMessage({ id, out }, [out]);
  } catch {
    (self as unknown as Worker).postMessage({ id, out: null });
  }
};
