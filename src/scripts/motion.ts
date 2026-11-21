/** Shared motion settings (see "Motion rules" in CLAUDE.md). */
export const EASE = 'power3.out';
/** power3.out as a plain function, for Lenis. */
export const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);
/** Run `fn` when the browser is idle (soon after, at the latest), as its own small task. */
export const whenIdle = (fn: () => void) =>
  'requestIdleCallback' in window ? requestIdleCallback(() => fn(), { timeout: 1000 }) : setTimeout(fn, 50);

export const prefersMotion = () => document.documentElement.classList.contains('js-motion');
