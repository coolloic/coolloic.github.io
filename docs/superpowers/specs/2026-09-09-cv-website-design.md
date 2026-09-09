# CV Website — Design Spec

**Date:** 2026-09-09
**Repo:** `coolloic.github.io` (GitHub Pages user site)
**Sources:** `CV.pdf` (10pp, authoritative) and the public LinkedIn profile
(supplementary — certifications, education, languages only)
**Status:** Approved design, pending implementation plan

## Purpose

A personal CV website whose single job is **recruiter conversion**: a hiring
manager or recruiter in Australia or New Zealand lands on the page, scans it for
about 45 seconds, and leaves able to decide whether to make contact.

Every decision below is subordinate to that goal. Visual craft appears as
restraint and polish, not spectacle, because a lead-level positioning is
undermined by decoration.

## Positioning

The site sells one role: **Engineering Lead / Senior Software Engineer**, with
front-end depth over an AWS-native back end.

- **Market:** Australia and New Zealand. Location and work rights appear above
  the fold, because AU recruiters filter on this before reading anything else.
- **Engagement:** open to both contract and permanent. Hero copy stays neutral
  between the two.
- **Availability:** immediate. The Datarock role ended August 2026, and stating
  availability plainly is worth more to a recruiter than any other single fact
  on the page.
- **Tone:** plain and confident. No US-style superlatives.

### A note on the front-end framing

The brief asked the site to present front-end skills, and the front-end evidence
is strong: React, React Query, Redux, RxJS, Next.js, Vue, Angular, AngularJS,
NativeScript, D3.js, plus genuine rendering-performance work.

But the CV's actual centre of gravity is broader than front-end — the Datarock
role is full-stack with heavy AWS architecture, data migration and technical
leadership. The positioning therefore leads with front-end depth without
claiming front-end exclusivity, because the AWS and back-end record is a
material part of the seniority argument and hiding it would weaken the page.

### Handling the contractor pattern

Five recent roles are contract engagements. The page frames this as deliberate
breadth — repeatedly dropped into unfamiliar stacks and productive quickly —
rather than leaving a permanent-role hiring manager to read it as instability.
The four-year Datarock tenure is positioned to answer that concern directly.

## Content structure

One page. Sections are ordered so that each answers a recruiter's next question,
and each section's first line carries its point.

### 1. Hero
- Name and positioning line.
- Location, work rights, availability, and openness to contract or permanent.
- Three stats, all derived from `src/data/cv.ts` so they cannot fall out of step
  with the content below: years of experience, core stack, certification count.
- Primary call to action (contact), reachable in one click from the top.

### 2. Domains

A grid of the industries the work spans — mining, banking, energy, supply
chain, telecommunications, construction safety, regulated content, insurance,
dairy — each naming what the work involved and which organisations it came
from.

Placed directly after the hero because breadth across regulated industries is
the fastest-registering differentiator on the page, and it is otherwise
invisible, buried inside individual role descriptions.

### 3. Experience
Roles from roughly 2018 onward, each with role, organisation, dates, two to
three **outcome** bullets, and technology chips. Bullets state what changed as a
result of the work, not what the duties were.

1. **Datarock** — Senior Software Engineer, New Zealand, 2022 – Aug 2026
2. **Docuvera** — Software Engineer (contract)
3. **Mercury NZ** — Senior API / Integration Developer (contract)
4. **HazardCo** — Senior Software Engineer (contract)
5. **Aviat Networks** — Senior Software Engineer (contract)
6. **Bank of New Zealand** — Java Full-stack Developer

BNZ is included in full despite its age because it holds the only quantified
outcomes in the record and anchors one of the case studies.

The section closes with one line covering Dominion (delivering to Fonterra, IAG,
Pulse Energy, Deloitte and Noel Leeming) and the earlier career from 2007.

**Correction carried from an earlier draft:** Fonterra was a *client* served via
Dominion, never an employer. It must never appear as a role. An earlier version
of this spec, drawn from LinkedIn, made that error.

### 4. Problem case studies
Four cards, each structured **Situation → Constraint → Approach → Outcome**,
ordered so the two strongest land first:

1. **Docuvera — LCP failure in a nested authoring platform.** Deeply nested
   composite components caused a critical Largest Contentful Paint problem.
   Analysed DOM structure and render cost, then designed and proved a
   flattened-DOM plus virtual-scrolling approach by POC.
2. **BNZ — authentication latency.** Mobile Internet Banking login reduced from
   approximately 800ms to 300ms. A mobile OAuth solution for CIAM cut expected
   contact-centre authentication service time from about five minutes to thirty
   seconds.
3. **Aviat Networks — topology visualisation at scale.** Diagrams of thousands
   of nodes and links. Benchmarked D3, Vis, Paper, Cytoscape and NeXt, then
   designed region-quadtree clustering and search to make the dataset tractable.
4. **Aviat Networks — AngularJS 1.5 to Vue migration.** Designed a hybrid
   frontend architecture permitting incremental migration, with middleware
   letting Vue observe Angular model data while Angular subscribed to events
   emitted by Vue.

This section carries the brief's requirements for demonstrated learning ability
and problem-solving attitude. Those claims are evidenced here rather than
asserted anywhere else — there is deliberately no learning timeline, no "how I
work" statement, and no build colophon.

The learning claim is further supported inside the experience bullets, where the
CV's own language is retained: rapidly learned AEM 6.2 for commercial work,
rapidly adopted ASP.NET Razor MVC, rapidly learned PHP and delivered to
timeline, led the NativeScript 6 to 7 upgrade, ran POCs for Python 3.11 to 3.13
and Serverless Framework 3 to 4.

### 5. Skills
Grouped and honestly levelled:

- **Front-end** — React, React Query, Redux, RxJS, Next.js, Vue, Angular,
  AngularJS, NativeScript, D3.js, MUI, Tailwind, SCSS, Storybook, Webpack,
  rendering performance and Core Web Vitals.
- **Back-end** — TypeScript, Node.js, Java, Spring, Ts.ED, GraphQL and Apollo,
  REST, OpenAPI, MuleSoft, APIGEE, Python.
- **Cloud** — Lambda, API Gateway, ECS/Fargate, EC2, ECR, RDS, DynamoDB, S3,
  SQS, SNS, EventBridge, Cognito, IAM, KMS, CloudWatch, X-Ray, CDK, Step
  Functions, Serverless Framework, Docker.
- **Data** — PostgreSQL, DynamoDB, Sequelize, query optimisation and indexing.
- **Testing** — Jest, Enzyme, Playwright, Supertest, Pact/PactFlow, JUnit,
  Mockito, Appium, RxJS Marble testing.
- **Leadership and delivery** — mentoring, code review, technical design, Scrum,
  CI/CD.

Roles are presented on a vertical timeline rail, with a marker and year label
per role and the current role's marker in the accent colour.

Skills carry two tiers of emphasis: the technologies in `coreSkills` render
larger and solid, the rest stay quiet but fully legible. This marks what he
leads with rather than ranking proficiency.

No percentage bars, and no conventional tag cloud. Size-varied clouds imply a
proficiency ranking the record does not support, and their smallest terms fail
contrast and target-size requirements.

### 6. Certifications
Compact grid with dates and credential IDs. Nine certifications: AWS Developer
Associate, AWS Solutions Architect Associate, AWS Cloud Practitioner, PMP,
PRINCE2 Practitioner, Certified ScrumMaster, ICAgile Certified Professional,
ITIL Foundation, Oracle Certified Java Programmer.

### 7. Education and languages
UESTC — MSc 2012–2014, BSc 2002–2006. English and Japanese.

### 8. Contact
**Email and LinkedIn only.** GitHub is deliberately excluded at the user's
request. The email address is rendered with light obfuscation against
naive scrapers, with no pretence that this defeats a determined one.

## The signature moment

The page gets exactly one memorable flourish, and it is the **printed CV**.

Pressing Cmd+P produces a well-formatted two-page A4 CV. Recruiters routinely
print or PDF a candidate page to forward to a hiring manager, almost no personal
site handles this well, and the quality only reveals itself to someone who tries
it.

It is a dedicated document rather than the screen page reshaped by CSS. The two
media want different things — the CV leads with contact details and a Selected
achievements block, carries the strongest outcome bullets rather than all of
them, and sets certifications in two columns — and reshaping one DOM into both
meant hiding content with fragile selectors. Both render from the same content
module, so they cannot disagree on any fact.

The cost is that the CV text appears twice in the HTML, once per medium. On a
page this small that is about 8KB, and Lighthouse SEO remains 100.

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
- `sitemap.xml` and a generated `robots.txt`.

The site URL is configured once, in `astro.config.mjs`. The canonical link,
the JSON-LD and `robots.txt` all derive from it, so a host change cannot leave
them disagreeing.

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
| Cmd+P output | clean, well-formatted 2-page A4 CV |

## Required input still outstanding

These values cannot be inferred and must be supplied before implementation
produces the content file.

1. **Employment dates.** Only Datarock is dated in the CV (2022 – Aug 2026).
   Docuvera, Mercury NZ, HazardCo, Aviat Networks, BNZ and Dominion have no
   dates, and LinkedIn's are contradictory. Month and year ranges are needed for
   each. Undated roles read as evasive to recruiters.
2. **Contact email.** To be confirmed explicitly, since publishing it to a
   public page is the user's decision to make.
3. **Current city**, for the location line.
4. **Total years of experience**, to confirm the hero stat. The earliest role
   appears to be around 2007, which would make it approximately 18 years.

## Out of scope

- A blog or article section.
- A contact form or any backend.
- Analytics.
- A GitHub link.
- A learning timeline, a "how I work" statement, or a build colophon — all
  considered and deliberately excluded in favour of the case studies.
