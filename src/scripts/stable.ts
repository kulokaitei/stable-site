/**
 * 02 — The stable. Text stays still; only the photos move.
 * - The aisle photo opens from a thin slit as you scroll in from the hero.
 * - The smaller photos wipe up from the bottom (the frame rises while the photo inside
 *   counter-moves: looks like a clip-path wipe but stays transform-only).
 * - Depth: each photo drifts at its own speed over the section's scroll (data-depth, max 15%).
 * - Focus: every photo scales from slightly enlarged to exactly framed as it crosses the screen.
 */
import { gsap } from 'gsap';
import { EASE } from './motion';

const MAX_DEPTH = 0.15;

export function initStable(): void {
  const gallery = document.querySelector<HTMLElement>('[data-stable-gallery]');
  if (!gallery) return;
  const figures = gsap.utils.toArray<HTMLElement>('[data-depth]', gallery);

  // Depth: from +half to -half of the travel while the gallery crosses the screen.
  figures.forEach((fig) => {
    const travel = Math.min(Number(fig.dataset.depth) || 0, MAX_DEPTH) * 100;
    gsap.fromTo(
      fig,
      { yPercent: travel / 2 },
      {
        yPercent: -travel / 2,
        ease: 'none',
        scrollTrigger: { trigger: gallery, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  const [aisle, ...small] = figures;

  // The aisle photo opens from a thin horizontal slit in its middle as you scroll — the step
  // from the hero's dark into the stable. Two page-coloured curtains slide apart (transform
  // only); they are added here, so without JS / with reduced motion the photo simply shows.
  if (aisle) {
    const frame = aisle.querySelector<HTMLElement>('[data-wipe]')!;
    frame.classList.add('relative');
    const curtain = (edge: 'top' | 'bottom') => {
      const c = document.createElement('div');
      c.className = `pointer-events-none absolute inset-x-0 ${edge}-0 h-1/2 bg-bg`;
      c.setAttribute('aria-hidden', 'true');
      frame.appendChild(c);
      return c;
    };
    const top = curtain('top');
    const bottom = curtain('bottom');
    gsap
      .timeline({ scrollTrigger: { trigger: aisle, start: 'top 92%', end: 'top 30%', scrub: true } })
      .fromTo(top, { yPercent: 0 }, { yPercent: -101, ease: 'power2.inOut' }, 0)
      .fromTo(bottom, { yPercent: 0 }, { yPercent: 101, ease: 'power2.inOut' }, 0);
  }

  // The smaller photos wipe up from the bottom when they come into view.
  small.forEach((fig) => {
    const frame = fig.querySelector<HTMLElement>('[data-wipe]')!;
    const inner = fig.querySelector<HTMLElement>('[data-wipe-inner]')!;
    gsap
      .timeline({ scrollTrigger: { trigger: fig, start: 'top 85%', once: true } })
      .fromTo(frame, { yPercent: 100 }, { yPercent: 0, duration: 1.4, ease: EASE }, 0)
      .fromTo(inner, { yPercent: -100 }, { yPercent: 0, duration: 1.4, ease: EASE }, 0);
  });

  // Every photo comes into focus as it crosses the screen: from slightly enlarged to
  // exactly framed by the time it reaches the middle.
  figures.forEach((fig) => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(
      img,
      { scale: 1.16 },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'center center', scrub: true } },
    );
  });
}
