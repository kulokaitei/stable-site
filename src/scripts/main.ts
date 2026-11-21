import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { prefersMotion } from './motion';
import { initSmoothScroll } from './smooth-scroll';
import { runPreloader } from './preloader';
import { heroIntro, initScrollReveals } from './reveals';
import { initSectionCounter } from './section-counter';

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
  lenis.stop();

  await document.fonts.ready; // split lines with the real font metrics
  const intro = heroIntro();
  initScrollReveals();

  await runPreloader(() => {
    intro.play();
    lenis.start();
    ScrollTrigger.refresh();
  });
}

main();
