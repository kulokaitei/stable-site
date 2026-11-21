/**
 * 05 — The horses.
 * - Desktop with a mouse (and motion allowed): hovering a row shows that horse's portrait,
 *   which follows the cursor softly (lerp) and scales in slightly.
 * - Every device: each row is a <details>; opening it fades + slides the photo in.
 *   (The row opens to full height instantly — only opacity/transform are animated.)
 */
import { gsap } from 'gsap';
import { EASE } from './motion';

const FOLLOW_LERP = 0.1;

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

  // ---------- Cursor-following portrait ----------
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');
  const portrait = section.querySelector<HTMLElement>('[data-horse-portrait]');
  if (!motion || !portrait || !canHover.matches) return; // touch devices: rows only
  const imgs = gsap.utils.toArray<HTMLImageElement>('[data-horse-portrait-img]', portrait);

  const pos = { x: 0, y: 0 }; // where the portrait is
  const target = { x: 0, y: 0 }; // where the cursor is
  let active = -1;
  let shown = false;
  let loaded = false;

  portrait.classList.remove('hidden');
  gsap.set(portrait, { xPercent: -50, yPercent: -50, scale: 0.9, opacity: 0 });

  const loadImages = () => {
    if (loaded) return;
    loaded = true;
    imgs.forEach((img) => img.dataset.src && (img.src = img.dataset.src));
  };

  const show = (index: number) => {
    if (index === active) return;
    if (active >= 0) gsap.to(imgs[active], { opacity: 0, duration: 0.8, ease: EASE, overwrite: true });
    if (index >= 0) gsap.to(imgs[index], { opacity: 1, duration: 0.8, ease: EASE, overwrite: true });
    active = index;

    const visible = index >= 0;
    if (visible === shown) return;
    shown = visible;
    if (visible) {
      pos.x = target.x; // appear at the cursor, then follow softly
      pos.y = target.y;
    }
    gsap.to(portrait, {
      opacity: visible ? 1 : 0,
      scale: visible ? 1 : 0.9,
      duration: visible ? 1 : 0.8,
      ease: EASE,
      overwrite: 'auto',
    });
  };

  // Which row is under the pointer (also re-checked on scroll, when the rows move under a still cursor).
  const hitTest = () => {
    if (!canHover.matches) return show(-1);
    const el = document.elementFromPoint(target.x, target.y);
    const row = el?.closest<HTMLElement>('[data-horse]');
    const open = row?.querySelector<HTMLDetailsElement>('[data-horse-details]')?.open;
    show(row && section.contains(row) && !open ? Number(row.dataset.index) : -1);
  };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    target.x = e.clientX;
    target.y = e.clientY;
    if (section.contains(e.target as Node)) loadImages();
    hitTest();
  });
  window.addEventListener('scroll', () => shown && hitTest(), { passive: true });
  document.documentElement.addEventListener('mouseleave', () => show(-1));
  section.addEventListener('toggle', hitTest, true); // opening a row hides the floating copy

  gsap.ticker.add(() => {
    if (!shown && Number(gsap.getProperty(portrait, 'opacity')) === 0) return;
    const k = 1 - Math.pow(1 - FOLLOW_LERP, gsap.ticker.deltaRatio(60));
    pos.x += (target.x - pos.x) * k;
    pos.y += (target.y - pos.y) * k;
    gsap.set(portrait, { x: pos.x, y: pos.y });
  });
}
