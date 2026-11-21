/**
 * 04 — A day at the stable.
 * - Desktop (1024px+) with motion: the section is pinned and vertical scroll moves the row
 *   sideways, 1px across for every 1px down.
 * - Otherwise: the row is a native swipeable scroller (snap points, no pin).
 * - Either way the hairline progress bar fills. Dots are evenly spaced; the fill is remapped
 *   so it reaches each dot exactly when that panel's centre reaches the middle of the screen.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE } from './motion';

export function initDay(motion: boolean): void {
  const section = document.querySelector<HTMLElement>('[data-day]');
  if (!section) return;
  const viewport = section.querySelector<HTMLElement>('[data-day-viewport]')!;
  const track = section.querySelector<HTMLElement>('[data-day-track]')!;
  const panels = gsap.utils.toArray<HTMLElement>('[data-day-panel]', section);
  const fill = section.querySelector<HTMLElement>('[data-day-fill]')!;
  const dots = gsap.utils.toArray<HTMLElement>('[data-day-dot]', section);
  const dotsOn = dots.map((d) => d.querySelector<HTMLElement>('[data-day-dot-on]')!);

  const maxShift = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  // Progress (0–1) at which each panel's centre sits in the middle of the viewport.
  let marks: number[] = [];
  const measure = () => {
    const max = maxShift() || 1;
    marks = panels.map((p) =>
      gsap.utils.clamp(0, 1, (p.offsetLeft + p.offsetWidth / 2 - viewport.clientWidth / 2) / max),
    );
    marks[marks.length - 1] = 1; // the last time lights up at the very end
  };

  // Scroll progress → bar position, so that progress marks[i] lands on dot i (at i / (n - 1)).
  const toBar = (p: number) => {
    const last = marks.length - 1;
    for (let k = 0; k < last; k++) {
      if (p <= marks[k + 1]) {
        const span = marks[k + 1] - marks[k];
        const t = span > 0 ? (p - marks[k]) / span : 1;
        return (k + gsap.utils.clamp(0, 1, t)) / last;
      }
    }
    return 1;
  };

  const lit = dots.map(() => false);
  const setProgress = (p: number) => {
    gsap.set(fill, { scaleX: toBar(p) });
    marks.forEach((m, i) => {
      const on = p >= m - 0.002;
      if (on === lit[i]) return;
      lit[i] = on;
      if (motion) gsap.to(dotsOn[i], { opacity: on ? 1 : 0, duration: 0.8, ease: EASE, overwrite: true });
      else gsap.set(dotsOn[i], { opacity: on ? 1 : 0 });
    });
  };

  // Native scroller (mobile, reduced motion, or desktop before the pin takes over).
  let native = true;
  viewport.addEventListener(
    'scroll',
    () => native && setProgress(maxShift() ? viewport.scrollLeft / maxShift() : 0),
    { passive: true },
  );
  measure();
  setProgress(0);
  new ResizeObserver(() => {
    measure();
    if (native) setProgress(maxShift() ? viewport.scrollLeft / maxShift() : 0);
  }).observe(viewport);

  if (!motion) return;

  // Desktop: pin and drive the row with vertical scroll.
  gsap.matchMedia().add('(min-width: 1024px)', () => {
    native = false;
    viewport.scrollLeft = 0;
    measure();
    gsap.to(track, {
      x: () => -maxShift(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${maxShift()}`,
        pin: true,
        scrub: true, // Lenis already smooths the scroll
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: measure,
        onUpdate: (self) => setProgress(self.progress),
      },
    });
    return () => {
      native = true;
      measure();
    };
  });
}
