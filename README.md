# stable-site

Website for [stable name]. See CLAUDE.md for the brief.

- `raw/` original images and videos (not used by the site)
- `public/` web-ready assets: head-turn frames, loop videos, photos
- `src/data/content.ts` all site copy (placeholders in [brackets])
- `src/components/` one file per section (Hero, Stable, Lessons, Day, Horses, Contact) + Header, Footer, Preloader

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Stack: Astro, Tailwind CSS v4 (via `@tailwindcss/vite`), GSAP, Lenis. Fonts are self-hosted via Fontsource.
