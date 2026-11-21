/**
 * 06 — Contact. Bookend to the hero.
 * - As the section scrolls in (its top from the bottom of the screen to near the top),
 *   the canvas plays the head-turn frames in reverse, 87 → 1: he turns back to face you.
 *   Scrubbed, so scrolling back up turns him away again.
 * - Once he faces you, "Come and meet him." rises line by line, then the intro and
 *   booking button, the hairline and the address / phone / email / hours.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { headFrames, HEAD_FRAME_COUNT } from './head-frames';
import { drawFrame, nearestReady, sizeCanvas } from './frame-draw';
import { EASE } from './motion';

const TURN_END = 'top 15%'; // the turn is complete when the section's top reaches 15% from the top

export function initContact(): void {
  const section = document.querySelector<HTMLElement>('[data-contact]');
  const canvas = section?.querySelector<HTMLCanvasElement>('[data-contact-canvas]');
  if (!section || !canvas) return;
  const ctx = canvas.getContext('2d')!;
  const images = headFrames(); // the same images the hero uses — already loaded by now

  // ---------- Reverse head turn ----------
  let progress = 0;
  let drawnImg: HTMLImageElement | null = null;
  const draw = (force = false) => {
    const frame = Math.round((1 - progress) * (HEAD_FRAME_COUNT - 1)); // 87 → 1
    const img = nearestReady(images, frame);
    if (!img || (!force && img === drawnImg)) return;
    drawnImg = img;
    drawFrame(canvas, ctx, img);
  };
  new ResizeObserver(() => {
    sizeCanvas(canvas);
    draw(true);
  }).observe(canvas);
  images.forEach((img) => img.addEventListener('load', () => draw(true)));

  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: TURN_END,
    scrub: true,
    onUpdate: (self) => {
      progress = self.progress;
      draw();
    },
  });

  // ---------- Reveal once he faces you ----------
  const title = section.querySelector<HTMLElement>('[data-split]');
  const intro = section.querySelector<HTMLElement>('[data-contact-intro]');
  const rule = section.querySelector<HTMLElement>('.rule');
  const items = gsap.utils.toArray<HTMLElement>('[data-contact-item]', section);
  const meta = section.querySelectorAll('.label');

  const tl = gsap.timeline({ paused: true });
  tl.from(meta, { opacity: 0, duration: 1, ease: EASE }, 0);
  if (title) {
    SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) => {
        const t = gsap.from(self.lines, { yPercent: 110, duration: 1.2, ease: EASE, stagger: 0.12 });
        tl.add(t, 0.1);
        return t;
      },
    });
  }
  if (intro) tl.from(intro.children, { opacity: 0, y: 24, duration: 1, ease: EASE, stagger: 0.1 }, 0.5);
  if (rule) tl.fromTo(rule, { '--draw': 0 }, { '--draw': 1, duration: 1.4, ease: EASE }, 0.6);
  tl.from(items, { opacity: 0, y: 16, duration: 1, ease: EASE, stagger: 0.08 }, 0.8);

  ScrollTrigger.create({
    trigger: section,
    start: TURN_END,
    once: true,
    onEnter: () => tl.play(),
  });
}
