// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://loicwong.github.io',
  base: '/',
  integrations: [sitemap()],
  build: {
    // Inline the stylesheet so the page is a single document with no
    // render-blocking round trip. Biggest LCP lever on a page this size.
    inlineStylesheets: 'always',
  },
});
