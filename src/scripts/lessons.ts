/**
 * 03 — Lessons (CLAUDE.md "Section 03 — lessons").
 * - The walk loop plays at normal speed (1×) the whole time — never sped up.
 *   It loads only when the section is about one screen away, and pauses off screen.
 * - The ground's tick marks drift slowly right → left while the section is on screen.
 * - Desktop (1024px+): the section is pinned; the four levels change one at a time
 *   (fade + slide up) and the 01 / 04 counter follows. Mobile: no pin, levels stacked.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE } from './motion';

const SCROLL_PER_LEVEL = 0.75; // screens of scroll per level while pinned

export function initLessons(): void {
  const section = document.querySelector<HTMLElement>('[data-lessons]');
  if (!section) return;
  const video = section.querySelector<HTMLVideoElement>('[data-walk-video]');
  const ground = section.querySelector<HTMLElement>('[data-ground]');
  const levelCount = section.querySelectorAll('[data-level]').length;
  const desktop = matchMedia('(min-width: 1024px)');
  const pinDistance = () => (desktop.matches ? window.innerHeight * SCROLL_PER_LEVEL * levelCount : 0);

  // "On screen" range, including the extra scroll while the section is pinned.
  const whileVisible = (onToggle: (active: boolean) => void) =>
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: () => `+=${window.innerHeight + section.offsetHeight + pinDistance()}`,
      invalidateOnRefresh: true,
      onToggle: (self) => onToggle(self.isActive),
    });

  // ---------- Walk loop: load when near, play only while visible ----------
  if (video) {
    const play = () => {
      video.playbackRate = 1;
      video.play().catch(() => {});
    };
    ScrollTrigger.create({
      trigger: section,
      start: () => `top bottom+=${window.innerHeight}`, // one screen before it arrives
      once: true,
      onEnter: () => {
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
          video.preload = 'auto';
          video.load();
        }
      },
    });
    whileVisible((on) => (on ? play() : video.pause()));
  }

  // ---------- Ground: endless right → left drift ----------
  // A CSS animation (global.css, `.ground-drift`): it runs on the GPU with no per-frame
  // JavaScript. Here it is only switched on while the section is on screen.
  if (ground) {
    ground.classList.add('ground-drift');
    whileVisible((on) => ground.classList.toggle('is-walking', on));
  }

  // ---------- Desktop: pin + levels one at a time ----------
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const levels = gsap.utils.toArray<HTMLElement>('[data-level]', section);
    const counter = section.querySelector<HTMLElement>('[data-level-current]');
    let current = 0;

    // Opacity only (not visibility), so screen readers can still read every level.
    gsap.set(levels.slice(1), { opacity: 0, y: 32 });
    levels.forEach((li, i) => (li.style.pointerEvents = i === 0 ? '' : 'none'));

    const show = (next: number) => {
      if (next === current) return;
      const dir = next > current ? 1 : -1;
      levels.forEach((li, i) => {
        li.style.pointerEvents = i === next ? '' : 'none';
        if (i === next) {
          gsap.fromTo(
            li,
            { opacity: 0, y: 32 * dir },
            { opacity: 1, y: 0, duration: 1, ease: EASE, delay: 0.15, overwrite: true },
          );
        } else if (i === current) {
          gsap.to(li, { opacity: 0, y: -24 * dir, duration: 0.8, ease: EASE, overwrite: true });
        } else {
          gsap.set(li, { opacity: 0, overwrite: true });
        }
      });
      if (counter) {
        counter.textContent = String(next + 1).padStart(2, '0');
        gsap.fromTo(
          counter,
          { yPercent: 100 * dir, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8, ease: EASE, overwrite: true },
        );
      }
      current = next;
    };

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${pinDistance()}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => show(Math.min(levels.length - 1, Math.floor(self.progress * levels.length))),
    });

    return () => {
      levels.forEach((li) => (li.style.pointerEvents = ''));
      if (counter) counter.textContent = '01';
    };
  });
}
