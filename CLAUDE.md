# Stable site — project brief

Single-page website for [stable name], an equestrian centre in [location] offering riding lessons, training and livery.

## Stack
- Astro + Tailwind CSS v4 + GSAP (ScrollTrigger) + Lenis smooth scroll
- No Three.js. Static output, deployed from GitHub (Vercel or Cloudflare Pages)

## Design
Elegant, cinematic, dark. Structure inspired by fojcikdominik.com (numbered sections, hairline details, a 01 / 06 counter) but luxurious — never pixelated or "retro".

Tokens:
- background `#050404`, text `#EDE6DA`, muted `#8E8579`, accent champagne `#C9A978`
- hairlines: `1px solid rgba(237,230,218,0.14)`
- display font: Cormorant Garamond 300; italic accent words in the accent colour
- UI/labels: Manrope; labels 11px, uppercase, letter-spacing 0.2em
- buttons: pill shape, 1px accent border, uppercase label

## Motion rules
- Slow and smooth: 0.8–1.4s, ease `power3.out`. Nothing bouncy.
- Animate only transform and opacity.
- Respect `prefers-reduced-motion` (show still images, no pinning).

## Quality
Mobile-first, Lighthouse 90+, semantic HTML, alt text on every image, skip link.

## Sections (scroll story)
00 preloader → 01 hero (horse is completely still on frame 1; scrolling scrubs the head turn 1:1, scrolling up plays it back at the same speed; no idle video, no mouse movement) → 02 the stable (parallax photos) → 03 lessons (one walk loop, the lesson levels change beside it) → 04 a day at the stable (horizontal scroll timeline 06:00–21:00) → 05 the horses (names list, portrait follows cursor) → 06 contact (the head turns back to face you).

## Section 03 — lessons (walk clip only)
Pin the section. The walk loop plays at normal speed the whole time — never speed it up to fake other gaits.
As you scroll, four lesson levels change beside the horse, one at a time (fade + slide up):
01 First steps · 02 Confidence · 03 Training · 04 Competition — titles and details are [placeholders] in content.ts.
Under the horse, a thin hairline "ground" with small tick marks scrolls slowly from right to left, so the horse
looks like he is walking through the section. A small counter shows 01 / 04.

## Assets (already prepared — use these, don't regenerate)
- `public/frames/head/001–087.webp` — head-turn image sequence, 1280px (desktop). Frame 1 = facing camera, 87 = profile facing right.
- `public/frames/head-mobile/001–087.webp` — same, 720px, for screens under 768px.
- `public/video/idle.mp4` — NOT used: the hero must stay still until the visitor scrolls.
- `public/video/walk.mp4` (+ poster) — 9s seamless walk loop, side view, horse walks in place. The ONLY gait clip: there will be no trot, canter or gallop videos.
- `public/images/hero-still.jpg` — reduced-motion fallback for the hero.
- `public/images/stable/` — 5 photos: aisle (section 02), 06:00 morning feed, 09:00 arena lesson, 14:00 paddock, 21:00 tack room. The paddock photo is brighter than the rest: darken it slightly in CSS.
- `raw/` — originals. Never link to these from the site.

All copy lives in `src/data/content.ts`. It is finished SAMPLE copy for a fictional stable, "Ashgrove Stables" near Vilnius — no [placeholders] on the site. Lines marked SAMPLE (name, numbers, prices, horse names, contact details) get replaced with the real stable's facts before launch.

## Video backgrounds
Videos and frames have pure black backgrounds. They must blend into the page: use `.blend-bg` (mix-blend-mode: lighten) on a parent with `bg-bg`, and `.edge-fade` for soft edges. The hero canvas fills #050404 and draws frames with 'lighten'.

## SEO (keep it intact)
- `site` in astro.config.mjs and the Sitemap line in public/robots.txt = the live URL (change both when a custom domain is added).
- Base.astro handles title, description, canonical, Open Graph/Twitter (public/og-image.jpg, 1200×630), icons and LocalBusiness JSON-LD (data in `seo` in content.ts).
- One h1 per page, descriptive alt text, width/height on images, sitemap via @astrojs/sitemap.

## Privacy
`/privacy/` is the privacy & cookie policy (linked in the footer). The site sets NO cookies and has no analytics, so there is no cookie banner. If analytics or any third-party embed is ever added, add a consent banner first and update the policy.
