/** Header "01 / 06" counter: shows the section currently in the middle of the screen. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE } from './motion';

export function initSectionCounter(motion: boolean): void {
  const el = document.querySelector<HTMLElement>('[data-section-current]');
  if (!el) return;
  let current = el.textContent?.trim() ?? '01';

  const show = (n: string) => {
    if (n === current) return;
    const dir = n > current ? 1 : -1;
    current = n;
    el.textContent = n;
    if (motion) {
      gsap.fromTo(
        el,
        { yPercent: 100 * dir, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: EASE, overwrite: true },
      );
    }
  };

  document.querySelectorAll<HTMLElement>('[data-section]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => self.isActive && show(section.dataset.section!),
    });
  });
}
