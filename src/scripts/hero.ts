/**
 * 01 — Hero.
 * - Before scrolling the horse is completely still on frame 1 (no video, no cursor movement).
 * - Pinned for 2000px: scroll position picks the head-turn frame (1 → 87), exactly in step
 *   with the scroll, so scrolling back up plays the turn back at the same speed.
 * - The headline rises and fades during the first 30% of the pin.
 * - Reduced motion: nothing here runs; CSS shows hero-still.jpg and nothing is pinned.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { headFrames, HEAD_FRAME_COUNT } from './head-frames';
import { prefersMotion } from './motion';

const PIN_DISTANCE = 2000; // px of scroll
const COPY_FADE_END = 0.3; // headline gone by 30%
const BG = '#050404';

export function initHero(): void {
  const section = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = section?.querySelector<HTMLCanvasElement>('[data-head-canvas]');
  const copy = section?.querySelector<HTMLElement>('[data-hero-copy]');
  if (!section || !canvas || !copy || !prefersMotion()) return;

  gsap.registerPlugin(ScrollTrigger);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const images = headFrames();
  const state = { progress: 0 };

  const isReady = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0;
  // While frames are still loading, use the closest one that is ready.
  const nearestReady = (i: number) => {
    for (let d = 0; d < HEAD_FRAME_COUNT; d++) {
      if (isReady(images[i - d])) return images[i - d];
      if (isReady(images[i + d])) return images[i + d];
    }
    return null;
  };

  let drawnImg: HTMLImageElement | null = null;
  const draw = (force = false) => {
    const frame = Math.round(state.progress * (HEAD_FRAME_COUNT - 1));
    const img = nearestReady(frame);
    if (!img || (!force && img === drawnImg)) return;
    drawnImg = img;

    const { width: cw, height: ch } = canvas;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    let s: number, dx: number, dy: number;
    if (cw >= ch) {
      // Landscape: cover the screen.
      s = Math.max(cw / iw, ch / ih);
      dx = (cw - iw * s) / 2;
      dy = (ch - ih * s) / 2;
    } else {
      // Portrait (phones): keep the whole head in view, near the top.
      s = cw / (iw * 0.55);
      dx = cw / 2 - iw * 0.53 * s;
      dy = ch * 0.08;
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    // 'lighten' turns the frames' pure black into exactly the page background.
    ctx.globalCompositeOperation = 'lighten';
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, iw * s, ih * s);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    draw(true);
  };
  new ResizeObserver(resize).observe(canvas);

  // Redraw as frames arrive (the first frame may land after the first resize).
  images.forEach((img) => img.addEventListener('load', () => draw(true)));
  resize();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${PIN_DISTANCE}`,
      pin: true,
      scrub: true, // frames follow the (Lenis-smoothed) scroll exactly, both directions
      anticipatePin: 1,
      onUpdate: (self) => {
        state.progress = self.progress;
        draw();
      },
    },
  });
  tl.to(copy, { autoAlpha: 0, y: -80, ease: 'none', duration: COPY_FADE_END }, 0).set({}, {}, 1); // timeline length = 1
}
