// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  // Inline the (small) CSS into the page: no render-blocking stylesheet request.
  build: { inlineStylesheets: 'always' },
  // Live address of the site. Change this (and public/robots.txt) when the real domain is connected.
  site: 'https://stable-site-seven.vercel.app',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
