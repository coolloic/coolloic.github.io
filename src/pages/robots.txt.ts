import type { APIRoute } from 'astro';

// Generated rather than static so the sitemap URL always matches astro.config's
// `site`. A stale host here silently breaks sitemap discovery.
export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site)}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
