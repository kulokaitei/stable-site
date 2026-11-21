/**
 * Prepared head-turn frames, so scrolling never waits on image work.
 *
 * Drawing an <img> onto a canvas makes the browser decode it (often again and again) and
 * scale + blend it on the main thread: 25–70 ms per frame on a mid-range phone, which made
 * the head turn stutter. Here a worker fetches each frame (from the browser cache), decodes
 * it and scales, positions and blends it for the canvas, so showing it on the main thread
 * is a 1:1 copy. (Browsers without workers/OffscreenCanvas decode with createImageBitmap.)
 *
 * Only a window of frames around the one being shown is kept (sized to a memory budget);
 * frames further away are released as the visitor scrolls. Both canvases share the cache;
 * only one is in use at a time (the hero at the top, contact at the bottom).
 */
import { headFramePaths, headFrameSize, headFrames, whenLoaded } from './head-frames';
import { frameLayout } from './frame-draw';

const BUDGET_BYTES = 150 * 1024 * 1024;
const IN_FLIGHT = 4;
const canDecode = typeof createImageBitmap === 'function';
const canPrepare = canDecode && typeof OffscreenCanvas === 'function' && typeof Worker === 'function';

// Created on first use, so pages / visitors that never animate the head never load it.
let worker: Worker | null = null;
let workerTried = false;
function getWorker(): Worker | null {
  if (!workerTried && canPrepare) {
    workerTried = true;
    try {
      worker = new Worker(new URL('./frame-worker.ts', import.meta.url), { type: 'module' });
      worker.addEventListener('message', onWorkerMessage);
    } catch {
      worker = null;
    }
  }
  return worker;
}

const frames = new Map<number, ImageBitmap>(); // prepared for `target`
const pending = new Set<number>();
const waitingForLoad = new Set<number>();
const listeners: ((index: number, canvas: HTMLCanvasElement | null) => void)[] = [];
let target: HTMLCanvasElement | null = null;
let center = 0;
let gen = 0; // bumps when the target canvas or its size changes
let radius = 6;
let nextJob = 0;
const jobs = new Map<number, { index: number; gen: number }>();

const notify = (i: number) => listeners.forEach((f) => f(i, target));
const isLoaded = (img: HTMLImageElement) => img.complete && img.naturalWidth > 0;

function clear(): void {
  frames.forEach((bm) => bm.close());
  frames.clear();
  pending.clear();
  gen++;
}

function store(index: number, bm: ImageBitmap): void {
  pending.delete(index);
  if (Math.abs(index - center) > radius + 1) {
    bm.close();
  } else {
    frames.get(index)?.close();
    frames.set(index, bm);
    notify(index);
  }
  pump();
}

function onWorkerMessage(e: MessageEvent<{ id: number; out: ImageBitmap | null }>): void {
  const job = jobs.get(e.data.id);
  jobs.delete(e.data.id);
  if (!e.data.out) {
    if (job) pending.delete(job.index);
    return;
  }
  if (!job || job.gen !== gen) {
    e.data.out.close(); // made for an old canvas size
    return;
  }
  store(job.index, e.data.out);
}

function prepare(index: number, img: HTMLImageElement): void {
  pending.add(index);
  const jobGen = gen;
  if (getWorker() && target) {
    // Everything (fetch from cache, decode, scale, blend) happens in the worker.
    const { width, height } = target;
    const size = headFrameSize();
    const id = nextJob++;
    jobs.set(id, { index, gen: jobGen });
    worker!.postMessage({
      id,
      url: new URL(headFramePaths()[index], location.href).href,
      width,
      height,
      ...frameLayout(width, height, size.width, size.height),
    });
    return;
  }
  // No worker: decode only; the canvas then draws it with scaling.
  createImageBitmap(img).then(
    (bm) => (jobGen !== gen ? bm.close() : store(index, bm)),
    () => pending.delete(index),
  );
}

function pump(): void {
  if (!canDecode || !target) return;
  const images = headFrames();
  for (const [i, bm] of frames) {
    if (Math.abs(i - center) > radius + 1) {
      bm.close();
      frames.delete(i);
    }
  }
  for (let d = 0; d <= radius && pending.size < IN_FLIGHT; d++) {
    for (const i of d === 0 ? [center] : [center + d, center - d]) {
      if (i < 0 || i >= images.length || frames.has(i) || pending.has(i) || pending.size >= IN_FLIGHT) continue;
      if (isLoaded(images[i])) {
        prepare(i, images[i]);
      } else if (!waitingForLoad.has(i)) {
        waitingForLoad.add(i);
        whenLoaded(images[i]).then(() => {
          waitingForLoad.delete(i);
          notify(i); // the plain image can be shown until it is prepared
          pump();
        });
      }
    }
  }
}

/** The canvas in use and the frame it shows: frames around it get prepared for it. */
export function focusFrame(index: number, canvas: HTMLCanvasElement, sizeChanged = false): void {
  if (canvas !== target || sizeChanged) {
    clear();
    target = canvas;
    const perFrame = Math.max(1, canvas.width * canvas.height * 4);
    radius = Math.max(2, Math.min(8, Math.floor((BUDGET_BYTES / perFrame - 3) / 2)));
  } else if (index === center && (frames.size || pending.size)) {
    return;
  }
  center = index;
  pump();
}

/** Whether `canvas` is the one frames are currently prepared for. */
export const isFocused = (canvas: HTMLCanvasElement) => canvas === target;

export function onFrameReady(listener: (index: number, canvas: HTMLCanvasElement | null) => void): void {
  listeners.push(listener);
}

/**
 * What to draw for frame `index` on `canvas`: the prepared frame, else the nearest
 * prepared neighbour (at most a frame or two off during a very fast scroll), else the
 * plain image (drawn the slow way, only until frames are prepared).
 */
export function frameSource(
  index: number,
  canvas: HTMLCanvasElement,
): { src: CanvasImageSource; index: number; prepared: boolean } | null {
  if (canvas === target && frames.size) {
    // Prepared = made by the worker for this exact canvas size (1:1 copy). Without a worker,
    // frames are only decoded and still need the full (scaling) draw.
    const prepared = !!getWorker();
    for (let d = 0; d <= radius + 1; d++) {
      for (const i of d === 0 ? [index] : [index + d, index - d]) {
        const bm = frames.get(i);
        if (bm) return { src: bm, index: i, prepared };
      }
    }
  }
  const images = headFrames();
  for (let d = 0; d < images.length; d++) {
    for (const i of d === 0 ? [index] : [index - d, index + d]) {
      if (images[i] && isLoaded(images[i])) return { src: images[i], index: i, prepared: false };
    }
  }
  return null;
}
