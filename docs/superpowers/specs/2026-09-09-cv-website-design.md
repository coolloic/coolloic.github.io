# CV Website — Design Spec

**Date:** 2026-09-09
**Repo:** `loicwong.github.io` (GitHub Pages user site)
**Status:** Approved design, pending implementation plan

## Purpose

A personal CV website whose single job is **recruiter conversion**: a hiring
manager or recruiter in Australia or New Zealand lands on the page, scans it for
about 45 seconds, and leaves able to decide whether to make contact.

Every decision below is subordinate to that goal. Visual craft appears as
restraint and polish, not spectacle, because a lead-level positioning is
undermined by decoration.

## Positioning

The site sells one role: **Engineering Lead / Senior Front-End Engineer**.

The record supports two readings — the certifications (PMP, PRINCE2, ITIL, CSM,
ICAgile) suggest delivery management, while the recent work (React, Redux, RxJS,
Spring, Mulesoft) suggests a hands-on senior engineer. The site commits to the
combination: someone who both writes the hard code and leads its delivery. A
page that hedges between the two reads as indecision.

- **Market:** Australia and New Zealand. Location and work rights appear above
  the fold, because AU recruiters filter on this before reading anything else.
- **Tone:** plain and confident. No US-style superlatives.
- **History depth:** the recent roles carry the page. Earlier career is
  represented by a single line so that the seniority claim stays credible
  without adding scan weight.

## Content structure

One page. Sections are ordered so that each answers a recruiter's next question,
and each section's first line carries its point.

### 1. Hero
- Name and positioning line.
- Location and availability (Auckland; open to AU + NZ).
- Three stats: 15+ years · React & Spring · 8 certifications.
- Primary call to action (contact), reachable in one click from the top.

### 2. Experience
Recent roles only — BNZ, Fonterra, Mercury NZ. Each entry carries role,
organisation, dates, two to three **outcome** bullets, and technology chips.
Bullets state what changed as a result of the work, not what the duties were.

The section closes with one line: *"Earlier: Wellington & Chengdu, 2007–2016."*

### 3. Problem case studies
Two to three cards, each structured **Situation → Constraint → Approach →
Outcome**. The Backbone-to-React migration is the anchor case.

This section carries the brief's requirements for demonstrated learning ability
and problem-solving attitude. Those claims are evidenced here rather than
asserted anywhere else on the page — there is deliberately no learning timeline,
no "how I work" statement, and no build colophon.

### 4. Skills
Grouped and honestly levelled: front-end lead, back-end, cloud, delivery.

No percentage bars or numeric proficiency scores. They carry no real information
and read as junior.

### 5. Certifications
Compact grid with dates and credential IDs.

### 6. Education and languages
Two lines.

### 7. Contact
Email, LinkedIn, GitHub.

## The signature moment

The page gets exactly one memorable flourish, and it is the **print stylesheet**.

Pressing Cmd+P produces a clean, properly typeset one-to-two page PDF CV:
identical content, no navigation furniture, links resolved as footnotes.
Recruiters routinely print or PDF a candidate page to forward to a hiring
manager, almost no personal site handles this well, and the quality only reveals
itself to someone who tries it.

On-screen interaction stays minimal: editorial typography throughout, and the
case studies presented as accessible disclosures.

## Architecture

**Stack:** Astro 5, TypeScript (strict), Tailwind CSS, SCSS, system fonts, pnpm.

Astro was chosen because it ships zero JavaScript by default. For a page that is
almost entirely static text, that makes the performance and accessibility
targets the default state rather than an optimisation exercise. A React-based
static export would spend the performance budget on a runtime the page does not
need.

### Single source of content

All CV content lives in one typed file, `src/data/cv.ts`. The rendered page, the
JSON-LD `Person` schema, the meta and Open Graph tags, and the print view all
derive from it.

This means the visible page and the SEO metadata cannot drift apart, and
updating a role is a single edit in one place.

### Accessibility

Target: WCAG 2.1 AA.

- Semantic landmarks and a skip link.
- One `h1`, correct heading order, no skipped levels.
- Visible focus states on every interactive element.
- Contrast at 4.5:1 minimum for body text.
- Touch targets at 44px minimum.
- `prefers-reduced-motion` honoured.
- Disclosures fully operable by keyboard and announced correctly to screen
  readers.

### SEO

- JSON-LD `Person` structured data.
- Canonical URL, Open Graph and Twitter card metadata.
- `sitemap.xml` and `robots.txt`.

### Other

- `prefers-color-scheme` respected for dark mode.
- Deployment by GitHub Actions to GitHub Pages on push to `main`.

## Success criteria

The work is verified against these before it is called done.

| Check | Target |
|---|---|
| Lighthouse Performance | >= 90 |
| Lighthouse Accessibility | 100 |
| Lighthouse SEO | 100 |
| Lighthouse Best Practices | 100 |
| axe-core violations | 0 |
| Keyboard-only traversal | whole page reachable, focus always visible |
| Rendering at 320px width | no horizontal scroll |
| Cmd+P output | clean 1–2 page PDF |

## Dependency: source content

The structure above is complete, but the values that populate `src/data/cv.ts`
are not yet available.

The public LinkedIn profile yielded only partial data: a truncated About
section, no dates for the Mercury NZ roles, and no achievements or outcomes for
any role. The CV PDF at `~/Downloads/cv.pdf` cannot be read — macOS privacy
protection (TCC) denies this terminal access to the `~/Downloads` directory
entirely, which is not a sandbox setting that can be overridden from here.

Implementation cannot produce the experience bullets or the case studies without
it. The file needs to be copied somewhere readable, or its text supplied
directly.

## Out of scope

- A blog or article section.
- A contact form or any backend.
- Analytics.
- A learning timeline, a "how I work" statement, or a build colophon — all
  considered and deliberately excluded in favour of the case studies.
