// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Single source of the site URL: SeoHead and robots.txt both derive from
  // this via Astro.site, so changing hosts is a one-line edit.
  site: 'https://coolloic.github.io',
  base: '/',
  integrations: [sitemap()],
  build: {
    // Inline the stylesheet so the page is a single document with no
    // render-blocking round trip. Biggest LCP lever on a page this size.
    inlineStylesheets: 'always',
  },
});
