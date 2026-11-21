import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { prefersMotion } from './motion';
import { initSmoothScroll } from './smooth-scroll';
import { runPreloader } from './preloader';
import { heroIntro, initScrollReveals } from './reveals';
import { initSectionCounter } from './section-counter';
import { initHero } from './hero';
import { initStable } from './stable';
import { initLessons } from './lessons';
import { initDay } from './day';
import { initHorses } from './horses';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

// Close the mobile menu after choosing a link.
document.querySelectorAll('header details a').forEach((a) =>
  a.addEventListener('click', () => a.closest('details')?.removeAttribute('open')),
);

async function main() {
  const motion = prefersMotion();
  initSectionCounter(motion);

  if (!motion) {
    initDay(false); // swipeable row + progress bar, no pin
    initHorses(false); // rows still open/close, no animation or floating portrait
    // Reduced motion: native scroll, no reveals, no preloader; stop the hidden loop videos.
    document.querySelectorAll<HTMLVideoElement>('video.motion-only').forEach((v) => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
    return;
  }

  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  const lenis = initSmoothScroll();
  initHero(); // starts loading frames 1–10 right away
  initLessons(); // pins are created before the reveals so positions below them are correct
  initDay(true);
  initHorses(true);
  lenis.stop();

  await document.fonts.ready; // split lines with the real font metrics
  const intro = heroIntro();
  initScrollReveals();
  initStable();

  await runPreloader(() => {
    intro.play();
    lenis.start();
    ScrollTrigger.sort(); // triggers come from several scripts; keep them in page order around the hero pin
    ScrollTrigger.refresh();
  });
}

main();
