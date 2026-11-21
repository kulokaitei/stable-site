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
  const photos = panels.map((p) => p.querySelector<HTMLElement>('[data-day-photo]')?.closest('[data-lean]') ?? null);

  // Curved rail: the panel in the middle faces you; panels towards the edges turn slightly
  // away in 3D, shrink a little and their photos fade. Positions are computed from cached offsets — no
  // layout reads while scrolling.
  let centers: number[] = [];
  let shiftX = 0;
  const rail = () => {
    if (!motion) return;
    const half = viewport.clientWidth / 2 || 1;
    panels.forEach((panel, i) => {
      const d = gsap.utils.clamp(-1.6, 1.6, (centers[i] + shiftX - half) / half);
      const a = Math.min(Math.abs(d), 1);
      gsap.set(panel, { transformPerspective: 1600, rotationY: d * 14, scale: 1 - a * 0.08 });
      // Only the photo fades — the time and text stay fully legible (contrast).
      if (photos[i]) gsap.set(photos[i], { opacity: 1 - a * 0.5 });
    });
  };

  // Progress (0–1) at which each panel's centre sits in the middle of the viewport.
  let marks: number[] = [];
  const measure = () => {
    const max = maxShift() || 1;
    marks = panels.map((p) =>
      gsap.utils.clamp(0, 1, (p.offsetLeft + p.offsetWidth / 2 - viewport.clientWidth / 2) / max),
    );
    marks[marks.length - 1] = 1; // the last time lights up at the very end
    centers = panels.map((p) => p.offsetLeft + p.offsetWidth / 2);
    rail();
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
    () => {
      if (!native) return;
      setProgress(maxShift() ? viewport.scrollLeft / maxShift() : 0);
      shiftX = -viewport.scrollLeft;
      rail();
    },
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
        onUpdate: (self) => {
          setProgress(self.progress);
          shiftX = -maxShift() * self.progress;
          rail();
        },
      },
    });
    return () => {
      native = true;
      measure();
    };
  });
}
