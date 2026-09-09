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
- languages (LinkedIn listed English and Japanese only).

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Local dev server on :4321 |
| `pnpm build` | Type-check and build to `dist/` |
| `pnpm test` | Playwright suite, including axe accessibility checks |
| `pnpm check:dates` | Report roles still missing dates |

## Print

`Cmd+P` produces a well-formatted two-page A4 CV.

The printed CV is its own document — `src/components/PrintCv.astro` — rendered
from the same `src/data/cv.ts` as the screen page. Each medium hides the other,
so neither layout compromises for the other's needs. The printed version leads
with contact details and a Selected achievements block, and prints the strongest
outcome bullets per role rather than all of them; see `PRINT_BULLETS` in that
component to change how many.

## Deployment

Pushing to `main` runs the test suite and deploys to GitHub Pages. Enable Pages
once under Settings → Pages → Source → GitHub Actions.
