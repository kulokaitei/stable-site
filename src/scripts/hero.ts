/**
 * 01 — Hero.
 * - Before scrolling: the idle breathing loop plays behind the headline.
 * - Pinned for 2000px. Over the first 5% the video fades out and the canvas takes over;
 *   scroll progress picks the head-turn frame (1 → 87). The headline rises and fades in the first 30%.
 * - Desktop, at rest: the cursor's X position gently turns the head (frames 1–12), lerp 0.08.
 * - Reduced motion: nothing here runs; CSS shows hero-still.jpg and nothing is pinned.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { headFrames, HEAD_FRAME_COUNT } from './head-frames';
import { EASE, prefersMotion } from './motion';

const PIN_DISTANCE = 2000; // px of scroll
const VIDEO_FADE_END = 0.05; // video → canvas over the first 5%
const COPY_FADE_END = 0.3; // headline gone by 30%
const GLANCE_FRAMES = 12; // mouse range: frames 1–12
const GLANCE_LERP = 0.08;
// Where on screen the glance starts. 0.5 = cursor left of centre → he looks at you,
// cursor towards the right edge → he turns towards it (the frames only turn to the right).
const GLANCE_FROM = 0.5;
const BG = '#050404';

export function initHero(): void {
  const section = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = section?.querySelector<HTMLCanvasElement>('[data-head-canvas]');
  const video = section?.querySelector<HTMLVideoElement>('[data-hero-video]');
  const copy = section?.querySelector<HTMLElement>('[data-hero-copy]');
  if (!section || !canvas || !video || !copy || !prefersMotion()) return;

  gsap.registerPlugin(ScrollTrigger);
  const ctx = canvas.getContext('2d')!;
  const images = headFrames();

  const state = {
    progress: 0, // 0–1 through the pin
    glance: 0, // smoothed mouse frame offset
    glanceTarget: 0,
    lookingAtYou: 1, // 1 = idle video, 0 = canvas (tweened when the glance starts/ends)
  };

  // ---------- Drawing ----------
  const isReady = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0;
  // While frames are still loading, use the closest one that is ready.
  const nearestReady = (i: number) => {
    for (let d = 0; d < HEAD_FRAME_COUNT; d++) {
      if (isReady(images[i - d])) return images[i - d];
      if (isReady(images[i + d])) return images[i + d];
    }
    return null;
  };

  let drawnImg: HTMLImageElement | null = null;
  const draw = (force = false) => {
    const atRest = 1 - Math.min(state.progress / VIDEO_FADE_END, 1);
    const frame = state.progress * (HEAD_FRAME_COUNT - 1) + state.glance * atRest;
    const img = nearestReady(Math.round(Math.min(Math.max(frame, 0), HEAD_FRAME_COUNT - 1)));
    if (!img || (!force && img === drawnImg)) return;
    drawnImg = img;

    // Cover fit (same framing as the video's object-fit: cover).
    const { width: cw, height: ch } = canvas;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    // 'lighten' turns the frames' pure black into exactly the page background.
    ctx.globalCompositeOperation = 'lighten';
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    draw(true);
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  // ---------- Scroll: pin, frames, video fade, headline ----------
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${PIN_DISTANCE}`,
      pin: true,
      scrub: true, // frames follow the (Lenis-smoothed) scroll exactly, both directions
      anticipatePin: 1,
      onUpdate: (self) => (state.progress = self.progress),
    },
  });
  tl.to(copy, { autoAlpha: 0, y: -80, ease: 'none', duration: COPY_FADE_END }, 0).set({}, {}, 1); // timeline length = 1

  // ---------- Mouse glance (desktop only) ----------
  const desktop = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
  let videoWanted = true;
  const setLookingAtYou = (yes: boolean) => {
    if (yes === videoWanted) return;
    videoWanted = yes;
    gsap.to(state, { lookingAtYou: yes ? 1 : 0, duration: 0.8, ease: EASE, overwrite: true });
  };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !desktop.matches) return;
    const x = (e.clientX / window.innerWidth - GLANCE_FROM) / (1 - GLANCE_FROM);
    state.glanceTarget = Math.min(Math.max(x, 0), 1) * (GLANCE_FRAMES - 1);
  });
  document.documentElement.addEventListener('mouseleave', () => (state.glanceTarget = 0));

  // ---------- One loop (shared GSAP ticker) ----------
  gsap.ticker.add(() => {
    if (section.getBoundingClientRect().bottom <= 0) return; // hero off screen: do nothing

    // Frame-rate independent lerp (0.08 per 60fps frame).
    const k = 1 - Math.pow(1 - GLANCE_LERP, gsap.ticker.deltaRatio(60));
    state.glance += (state.glanceTarget - state.glance) * k;
    if (Math.abs(state.glanceTarget - state.glance) < 0.01) state.glance = state.glanceTarget;

    // The idle video only fits while he looks straight at you.
    setLookingAtYou(state.glanceTarget === 0 && state.glance < 0.5);

    const videoOpacity = state.lookingAtYou * (1 - Math.min(state.progress / VIDEO_FADE_END, 1));
    gsap.set(video, { opacity: videoOpacity });
    gsap.set(canvas, { opacity: 1 - videoOpacity });
    if (videoOpacity === 0 && !video.paused) video.pause();
    else if (videoOpacity > 0 && video.paused) video.play().catch(() => {});

    draw();
  });
}
