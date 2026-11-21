import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { prefersMotion, whenIdle } from './motion';
import { initSmoothScroll } from './smooth-scroll';
import { runPreloader } from './preloader';
import { heroIntro, initScrollReveals } from './reveals';
import { initSectionCounter } from './section-counter';
import { initHero } from './hero';
import { initStable } from './stable';
import { initLessons } from './lessons';
import { initDay } from './day';
import { initHorses } from './horses';
import { initContact } from './contact';
import { initTransitions } from './transitions';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

// Close the mobile menu after choosing a link.
document.querySelectorAll('header details a').forEach((a) =>
  a.addEventListener('click', () => a.closest('details')?.removeAttribute('open')),
);
// Escape closes the mobile menu and returns focus to its button.
document.addEventListener('keydown', (e) => {
  const menu = document.querySelector<HTMLDetailsElement>('header details[open]');
  if (e.key !== 'Escape' || !menu) return;
  menu.removeAttribute('open');
  menu.querySelector('summary')?.focus();
});

async function main() {
  const motion = prefersMotion();

  if (!motion) {
    initSectionCounter(false);
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
  initContact();
  // Created after the pins (in page order), so every trigger is measured correctly when it
  // is created — no costly full re-measure needed when the preloader hands over.
  initSectionCounter(true);
  lenis.stop();

  await document.fonts.ready; // split lines with the real font metrics
  const intro = heroIntro();

  await runPreloader(() => {
    intro.play();
    lenis.start();
    // Everything below the hero is 2000px+ of scrolling away: set it up in small idle tasks
    // after the page appears, instead of one long task that would block it (mobile TBT).
    whenIdle(() => {
      initScrollReveals();
      whenIdle(() => {
        initStable();
        initTransitions();
      });
    }); // after all pins exist and are measured; set up in small idle tasks
  });
}

main();
