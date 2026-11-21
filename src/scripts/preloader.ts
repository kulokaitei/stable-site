/**
 * 00 — Preloader.
 * The hairline fill, its dot and the "Saddling up — n" counter follow the real loading
 * progress of the first head-turn frames (the rest keep loading in the background).
 * Then the name moves up and fades, and the page is revealed.
 */
import { gsap } from 'gsap';
import { EASE } from './motion';
import { headFrames, whenLoaded, FIRST_BATCH } from './head-frames';

const TRACK_WIDTH = 200; // px, matches the markup
const MIN_TIME = 900; // ms — never flash
const MAX_TIME = 8000; // ms — never trap the visitor on a slow connection

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function runPreloader(onReveal: () => void): Promise<void> {
  const root = document.getElementById('preloader');
  if (!root) return onReveal();
  root.style.animation = 'none'; // cancel the CSS failsafe — the script is in charge now

  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const fill = q<HTMLElement>('[data-preloader-fill]');
  const dot = q<HTMLElement>('[data-preloader-dot]');
  const count = q<HTMLElement>('[data-preloader-count]');
  const name = q<HTMLElement>('[data-preloader-name]');
  const ui = q<HTMLElement>('[data-preloader-ui]');

  const state = { p: 0 };
  const render = () => {
    gsap.set(fill, { scaleX: state.p });
    gsap.set(dot, { x: state.p * TRACK_WIDTH });
    count.textContent = String(Math.round(state.p * 100));
  };
  const progressTo = (p: number) =>
    gsap.to(state, { p, duration: 0.8, ease: EASE, overwrite: true, onUpdate: render });

  // Frame 1 is what the visitor sees first, so it counts for more.
  const frames = headFrames().slice(0, FIRST_BATCH);
  const weights = frames.map((_, i) => (i === 0 ? 3 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let loaded = 0;
  const tasks = Promise.all(
    frames.map((img, i) =>
      whenLoaded(img).then(() => {
        loaded += weights[i];
        progressTo(Math.min(loaded / total, 0.99));
      }),
    ),
  );

  await Promise.all([Promise.race([tasks, wait(MAX_TIME)]), wait(MIN_TIME)]);
  await progressTo(1);

  // Exit: name moves up and fades, then the page reveals (1.2s).
  const tl = gsap.timeline({ onComplete: () => root.remove() });
  tl.to(ui, { opacity: 0, y: -8, duration: 0.8, ease: EASE })
    .to(name, { yPercent: -60, opacity: 0, duration: 1.2, ease: EASE }, 0)
    .add(onReveal, 0.5)
    .to(root, { opacity: 0, duration: 1.2, ease: EASE }, 0.5);
  await tl;
}
