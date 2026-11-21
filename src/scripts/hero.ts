/**
 * 01 — Hero.
 * - Before scrolling the horse is completely still on frame 1 (no video, no cursor movement).
 * - Pinned for 2000px: scroll position picks the head-turn frame (1 → 87), exactly in step
 *   with the scroll, so scrolling back up plays the turn back at the same speed.
 * - The headline rises and fades during the first 30% of the pin; then three short captions
 *   take turns bottom-left, with a hairline that fills over the rest of the turn.
 * - Reduced motion: nothing here runs; CSS shows hero-still.jpg and nothing is pinned.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { frameAt } from './head-frames';
import { EASE, prefersMotion } from './motion';
import { framePlayer } from './frame-draw';

const PIN_DISTANCE = 2000; // px of scroll
const COPY_FADE_END = 0.3; // headline gone by 30%

export function initHero(): void {
  const section = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = section?.querySelector<HTMLCanvasElement>('[data-head-canvas]');
  const copy = section?.querySelector<HTMLElement>('[data-hero-copy]');
  if (!section || !canvas || !copy || !prefersMotion()) return;

  gsap.registerPlugin(ScrollTrigger);
  const state = { progress: 0 };
  const player = framePlayer(canvas, () => frameAt(state.progress));
  player.focus(); // decode the first frames now (they are loaded during the preloader)
  player.draw(true);

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
        player.focus();
        player.draw();
      },
    },
  });
  tl.to(copy, { autoAlpha: 0, y: -80, ease: 'none', duration: COPY_FADE_END }, 0).set({}, {}, 1); // timeline length = 1

  // Captions: once the headline has gone, three short lines take turns in the dark space
  // while the head turns; a hairline under them fills with the rest of the turn.
  const captions = gsap.utils.toArray<HTMLElement>('[data-hero-caption]', section);
  const progress = section.querySelector<HTMLElement>('[data-hero-progress]');
  const fill = section.querySelector<HTMLElement>('[data-hero-progress-fill]');
  const slot = (1 - COPY_FADE_END) / Math.max(captions.length, 1);
  if (progress && fill) {
    tl.fromTo(progress, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.05 }, COPY_FADE_END);
    tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 - COPY_FADE_END }, COPY_FADE_END);
  }
  captions.forEach((caption, i) => {
    const start = COPY_FADE_END + i * slot;
    tl.fromTo(caption, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: EASE, duration: slot * 0.35 }, start + 0.01);
    if (i < captions.length - 1) {
      tl.to(caption, { opacity: 0, y: -30, ease: 'none', duration: slot * 0.22 }, start + slot * 0.74);
    }
  });
}
