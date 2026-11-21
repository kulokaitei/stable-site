/**
 * 05 — The horses. Each row is a <details>; clicking a name opens it and the portrait and
 * description fade + slide in. (The row opens to full height instantly — only opacity and
 * transform are animated.) Reduced motion: native open/close, no animation.
 */
import { gsap } from 'gsap';
import { EASE } from './motion';

export function initHorses(motion: boolean): void {
  const section = document.querySelector<HTMLElement>('[data-horses]');
  if (!section) return;
  const rows = gsap.utils.toArray<HTMLElement>('[data-horse]', section);

  // ---------- Expand / collapse ----------
  rows.forEach((row) => {
    const details = row.querySelector<HTMLDetailsElement>('[data-horse-details]')!;
    const summary = details.querySelector('summary')!;
    const panel = details.querySelector<HTMLElement>('[data-horse-panel]')!;
    const img = panel.querySelector<HTMLElement>('[data-horse-panel-img]');
    if (!motion) return; // native <details> behaviour, no animation

    summary.addEventListener('click', (e) => {
      if (!details.open) {
        // Opening: let it open, then bring the content in.
        requestAnimationFrame(() => {
          gsap.fromTo(
            panel.children,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.08, overwrite: true },
          );
          if (img) gsap.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: EASE, overwrite: true });
        });
      } else {
        // Closing: fade the content out first, then close.
        e.preventDefault();
        gsap.to(panel.children, {
          opacity: 0,
          y: -12,
          duration: 0.8,
          ease: EASE,
          overwrite: true,
          onComplete: () => {
            details.open = false;
            gsap.set(panel.children, { clearProps: 'opacity,transform' });
          },
        });
      }
    });
  });
}
