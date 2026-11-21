/**
 * 02 — The stable. Text stays still; only the photos move.
 * - Reveal: a wipe from the bottom. Built from transforms (the frame rises while the
 *   photo inside counter-moves), which looks like a clip-path wipe but stays transform-only.
 * - Depth: each photo drifts at its own speed over the section's scroll (data-depth, max 15%).
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

  // Reveal: each photo wipes up from the bottom when it comes into view.
  figures.forEach((fig) => {
    const frame = fig.querySelector<HTMLElement>('[data-wipe]')!;
    const inner = fig.querySelector<HTMLElement>('[data-wipe-inner]')!;
    const img = inner.querySelector('img');
    gsap
      .timeline({ scrollTrigger: { trigger: fig, start: 'top 85%', once: true } })
      .fromTo(frame, { yPercent: 100 }, { yPercent: 0, duration: 1.4, ease: EASE }, 0)
      .fromTo(inner, { yPercent: -100 }, { yPercent: 0, duration: 1.4, ease: EASE }, 0)
      .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: EASE }, 0);
  });
}
