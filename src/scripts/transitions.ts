/**
 * Scroll transitions — something reacts to every scroll (inspired by fojcikdominik.com,
 * kept elegant: transform + opacity only, nothing bouncy). Motion-enabled visitors only.
 *
 * 1. Hand-offs: each section sits on a "stage". As the next stage rises over it, the old
 *    one shrinks slightly, dims and lags behind, like a card sliding under the next.
 *    (The hero sinks deeper into the dark.) Styles are set by hand and cleared at rest,
 *    because a leftover transform on a stage would break the pinned sections inside it.
 * 2. Scroll-speed lean: titles and photos lean very slightly with fast scrolling, then
 *    settle (eased back to zero; nothing runs while the page is still).
 * 3. Numerals: a huge faint section number drifts behind sections 02–05 at its own depth.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE } from './motion';

const LEAN_MAX = 2.2; // degrees
const LEAN_PER_PX_S = 1 / 900; // degrees per px/s of scroll speed

/**
 * Set up after the page has appeared, one feature per task: none of this is needed in the
 * first second (it only matters once the visitor scrolls down), and doing it all at once
 * would block the page for a moment on slower phones.
 */
export function initTransitions(): void {
  const later = (fn: () => void) =>
    'requestIdleCallback' in window ? requestIdleCallback(() => fn(), { timeout: 1000 }) : setTimeout(fn, 50);
  later(() => {
    initHandoffs();
    later(() => {
      initNumerals();
      later(initLean);
    });
  });
}

function initHandoffs(): void {
  const stages = gsap.utils.toArray<HTMLElement>('[data-stage]');
  const phone = matchMedia('(max-width: 767px)');
  const items: { apply: (p: number) => void; st: ScrollTrigger }[] = [];

  stages.forEach((stage, i) => {
    const next = stages[i + 1];
    if (!next) return;
    const hero = i === 0;
    const apply = (p: number) => {
      if (p <= 0.001) {
        stage.style.transform = '';
        stage.style.opacity = '';
        stage.style.willChange = '';
        return;
      }
      const e = gsap.parseEase('power1.in')(p);
      const shrink = hero ? 0.1 : phone.matches ? 0.04 : 0.06;
      const scale = 1 - e * shrink;
      const y = e * window.innerHeight * (hero ? 0.35 : 0.25);
      // GPU layer only while it is moving; once fully covered it stays put.
      stage.style.willChange = p >= 0.999 ? '' : 'transform, opacity';
      stage.style.transformOrigin = '50% 100%';
      stage.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
      stage.style.opacity = (1 - e * (hero ? 0.85 : 0.6)).toFixed(3);
    };
    const st = ScrollTrigger.create({
      trigger: next,
      start: 'top bottom',
      end: 'top top',
      onUpdate: (self) => apply(self.progress),
      onLeaveBack: () => apply(0),
    });
    items.push({ apply, st });
  });

  // Measure with clean stages, then restore.
  ScrollTrigger.addEventListener('refreshInit', () => items.forEach((it) => it.apply(0)));
  ScrollTrigger.addEventListener('refresh', () => items.forEach((it) => it.apply(it.st.progress)));
}

function initLean(): void {
  const els = gsap.utils.toArray<HTMLElement>('[data-lean]');
  if (!els.length) return;
  // Only elements on (or near) the screen are updated; others are reset once and left alone.
  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(el);
        else if (visible.delete(el)) gsap.set(el, { skewY: 0 });
      }),
    { rootMargin: '20% 0px' },
  );
  els.forEach((el) => io.observe(el));

  let target = 0;
  let current = 0;
  let applied = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      target = gsap.utils.clamp(-LEAN_MAX, LEAN_MAX, self.getVelocity() * LEAN_PER_PX_S);
    },
  });

  gsap.ticker.add(() => {
    const r = gsap.ticker.deltaRatio(60);
    target *= Math.pow(0.88, r); // speed fades when scrolling slows
    current += (target - current) * (1 - Math.pow(1 - 0.1, r));
    const next = Math.abs(current) < 0.02 ? 0 : Math.round(current * 20) / 20; // 0.05° steps
    if (next === applied) return; // nothing visible would change
    applied = next;
    visible.forEach((el) => gsap.set(el, { skewY: next }));
  });
}

function initNumerals(): void {
  gsap.utils.toArray<HTMLElement>('[data-numeral]').forEach((el) => {
    const section = el.closest('section');
    if (!section) return;
    // Whole time the section is on screen, including the extra scroll while it is pinned.
    const span = () => {
      const host = section.parentElement?.classList.contains('pin-spacer') ? section.parentElement : section;
      return host.offsetHeight + window.innerHeight;
    };
    gsap.fromTo(
      el,
      { yPercent: 30 },
      {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: () => `+=${span()}`, scrub: true, invalidateOnRefresh: true },
      },
    );
    gsap.to(el, {
      opacity: 1,
      duration: 1.4,
      ease: EASE,
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  });
}
