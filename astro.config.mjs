// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  // Set this to the real domain once it is known (used for canonical URLs / sitemap).
  // site: 'https://example.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
