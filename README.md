# coolloic.github.io

Personal CV site. Astro, no client-side framework, no runtime JavaScript.

Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100.

## Editing content

All content lives in `src/data/cv.ts`. Edit a fact there and it updates the
page, the JSON-LD structured data, the meta tags and the print view together.

## Outstanding

**Employment dates are reconstructed.** Only Datarock was dated in the source
CV; the rest come from a contiguous ordering Loic supplied and are deliberately
year-only, because month precision would imply a certainty the source does not
support. They should be checked against his actual record.

Two known conflicts are unresolved: the public LinkedIn shows BNZ starting
Aug 2018 and Aviat's ProVision Plus at Sep 2019, both later than the years
currently shown.

`formatRange` accepts `'YYYY'`, `'YYYY-MM'` or `'present'`, so tightening any
date to a real month is a one-value edit in `src/data/cv.ts`.

**Inferred values.** Anything marked `VERIFY:` in `src/data/cv.ts` was inferred
rather than sourced: the current city (guessed from Auckland-based roles) and
the languages list (LinkedIn showed English and Japanese only).

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Local dev server on :4321 |
| `pnpm build` | Type-check and build to `dist/` |
| `pnpm test` | Playwright suite, including axe accessibility checks |
| `pnpm check:dates` | Report any roles missing dates |

## Print

`Cmd+P` produces a well-formatted two-page A4 CV.

The printed CV is its own document — `src/components/PrintCv.astro` — rendered
from the same `src/data/cv.ts` as the screen page. Each medium hides the other,
so neither layout compromises for the other's needs. The printed version leads
with contact details and a Selected achievements block, and prints the strongest
outcome bullets per role rather than all of them; see `PRINT_BULLETS` in that
component to change how many.

## Site URL

`site` in `astro.config.mjs` is the single source. The canonical link, the
JSON-LD and `robots.txt` all derive from it, so moving hosts (a custom domain,
a different account) is a one-line change.

## Deployment

Pushing to `main` runs the test suite and deploys to GitHub Pages. Enable Pages
once under Settings → Pages → Source → GitHub Actions.
