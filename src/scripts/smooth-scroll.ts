/**
 * Lenis smooth scroll driven by GSAP's ticker, so Lenis and ScrollTrigger share one RAF loop.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { easeOut3 } from './motion';

export function initSmoothScroll(): Lenis {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page links: smooth scroll, then move focus to the target (keeps the skip link accessible).
  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    const id = link?.getAttribute('href')?.slice(1); // '' for a bare "#" → ignored
    const target = id ? document.getElementById(id) : null;
    if (!link || !target) return;
    e.preventDefault();
    lenis.scrollTo(target, {
      duration: 1.4,
      easing: easeOut3,
      onComplete: () => {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      },
    });
    history.pushState(null, '', `#${id}`);
  });

  return lenis;
}
