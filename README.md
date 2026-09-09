# loicwong.github.io

Personal CV site. Astro, no client-side framework, no runtime JavaScript.

Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100.

## Editing content

All content lives in `src/data/cv.ts`. Edit a fact there and it updates the
page, the JSON-LD structured data, the meta tags and the print view together.

## Outstanding

**Employment dates.** Five roles have `start: null` / `end: null` because the
source CV did not include dates. Undated roles read as evasive to recruiters —
fill them in using `YYYY-MM` format. Run `pnpm check:dates` to list them.

**Inferred values.** Everything marked `VERIFY:` in `src/data/cv.ts` was
inferred rather than sourced, and should be confirmed:

- current city (guessed from Auckland-based roles),
- contact email (taken from local config),
- languages (LinkedIn listed English and Japanese only).

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Local dev server on :4321 |
| `pnpm build` | Type-check and build to `dist/` |
| `pnpm test` | Playwright suite, including axe accessibility checks |
| `pnpm check:dates` | Report roles still missing dates |

## Print

`Cmd+P` produces a three-page A4 CV. The print view deliberately carries less
than the screen where the screen version is a reading experience rather than CV
content: case studies collapse to their Outcome, role summaries give way to
their outcome bullets, and skill groups run as dense labelled lines.

## Deployment

Pushing to `main` runs the test suite and deploys to GitHub Pages. Enable Pages
once under Settings → Pages → Source → GitHub Actions.
