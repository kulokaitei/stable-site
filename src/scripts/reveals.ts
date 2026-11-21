/**
 * Text reveals: headings rise line by line from behind a mask, labels fade in,
 * hairlines (.rule) draw left → right. Transform and opacity only.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { EASE } from './motion';

const LINE = { yPercent: 110, duration: 1.2, ease: EASE, stagger: 0.12 };

function splitHeading(el: HTMLElement, animate: (lines: Element[]) => gsap.core.Animation) {
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true, // re-split on resize / font load; the returned tween is kept in sync
    onSplit: (self) => animate(self.lines),
  });
}

/** Hero intro — built paused (elements start hidden) and played when the preloader leaves. */
export function heroIntro(): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });
  tl.from('[data-header]', { opacity: 0, duration: 1.2, ease: EASE }, 0.2);
  const hero = document.getElementById('top');
  if (!hero) return tl; // pages without the hero (privacy, 404)
  const h1 = hero.querySelector<HTMLElement>('[data-split]');

  tl.from('[data-hero-media]', { scale: 1.06, duration: 1.4, ease: EASE }, 0)
    .from(hero.querySelectorAll('.label'), { opacity: 0, duration: 1, ease: EASE, stagger: 0.1 }, 0.3)
    .fromTo(hero.querySelectorAll('.rule'), { '--draw': 0 }, { '--draw': 1, duration: 1.4, ease: EASE }, 0.5)
    .from(hero.querySelectorAll('.rule p, .rule .btn'), { opacity: 0, y: 16, duration: 1, ease: EASE, stagger: 0.1 }, 0.7);

  if (h1) {
    splitHeading(h1, (lines) => {
      const t = gsap.from(lines, { ...LINE, paused: true });
      tl.add(t.play(), 0.15);
      return t;
    });
  }
  return tl;
}

/** Scroll-triggered reveals for everything below the hero. */
export function initScrollReveals(): void {
  const hero = document.getElementById('top');
  const outsideHero = (el: Element) => !hero?.contains(el);

  // Headings, line by line
  gsap.utils
    .toArray<HTMLElement>('[data-split]')
    .filter(outsideHero)
    .forEach((el) =>
      splitHeading(el, (lines) =>
        gsap.from(lines, {
          ...LINE,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
      ),
    );

  // Labels fade in
  const labels = gsap.utils
    .toArray<HTMLElement>('main .label, footer .label')
    .filter(outsideHero)
    .filter((el) => !el.closest('[data-horse-panel]')); // inside closed rows: animated on open instead
  gsap.set(labels, { opacity: 0 });
  ScrollTrigger.batch(labels, {
    start: 'clamp(top 92%)',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 1, ease: EASE, stagger: 0.08 }),
  });

  // Hairlines draw left → right
  const rules = gsap.utils.toArray<HTMLElement>('main .rule, footer .rule').filter(outsideHero);
  gsap.set(rules, { '--draw': 0 });
  ScrollTrigger.batch(rules, {
    start: 'clamp(top 92%)',
    once: true,
    onEnter: (batch) => gsap.to(batch, { '--draw': 1, duration: 1.4, ease: EASE, stagger: 0.1 }),
  });
}
