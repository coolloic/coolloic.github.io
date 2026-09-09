# coolloic.github.io

Personal CV site. Astro, no client-side framework, no runtime JavaScript.

Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100.

## Editing content

All content lives in `src/data/cv.ts`. Edit a fact there and it updates the
page, the JSON-LD structured data, the meta tags and the print view together.

## Outstanding

**Employment dates are partly reconstructed.** Datarock is dated from the
source CV. BNZ and Aviat Networks are anchored on the public LinkedIn profile
(BNZ from Jun/Aug 2018, Aviat's ProVision Plus from Sep 2019; LinkedIn marks
both "Present", which is stale). The roles between them were shifted to stay
contiguous.

That compresses five roles into 2018-2022 as roughly year-long stints, which
fits four of them being contract engagements — but it is inference, not record,
and is worth checking. Dates are deliberately year-only: month precision would
imply a certainty the sources do not support.

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
