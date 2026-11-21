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
import { drawFrame, nearestReady, sizeCanvas } from './frame-draw';

const PIN_DISTANCE = 2000; // px of scroll
const COPY_FADE_END = 0.3; // headline gone by 30%

export function initHero(): void {
  const section = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = section?.querySelector<HTMLCanvasElement>('[data-head-canvas]');
  const copy = section?.querySelector<HTMLElement>('[data-hero-copy]');
  if (!section || !canvas || !copy || !prefersMotion()) return;

  gsap.registerPlugin(ScrollTrigger);
  const ctx = canvas.getContext('2d')!;
  const images = headFrames();
  const state = { progress: 0 };

  let drawnImg: HTMLImageElement | null = null;
  const draw = (force = false) => {
    const frame = Math.round(state.progress * (HEAD_FRAME_COUNT - 1));
    const img = nearestReady(images, frame);
    if (!img || (!force && img === drawnImg)) return;
    drawnImg = img;
    drawFrame(canvas, ctx, img);
  };

  const resize = () => {
    sizeCanvas(canvas);
    draw(true);
  };
  new ResizeObserver(resize).observe(canvas);

  // Redraw as frames arrive (the first frame may land after the first resize).
  // A frame just arrived: redraw only if it is closer to the wanted frame than the one shown
  // (avoids ~87 full-canvas redraws while the sequence loads).
  images.forEach((img, i) =>
    img.addEventListener('load', () => {
      const want = Math.round(state.progress * (HEAD_FRAME_COUNT - 1));
      const shown = drawnImg ? images.indexOf(drawnImg) : -1;
      if (shown < 0 || Math.abs(i - want) < Math.abs(shown - want)) draw(true);
    }),
  );
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
