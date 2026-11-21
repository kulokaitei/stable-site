/** Shared motion settings (see "Motion rules" in CLAUDE.md). */
export const EASE = 'power3.out';
/** power3.out as a plain function, for Lenis. */
export const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);
export const prefersMotion = () => document.documentElement.classList.contains('js-motion');
