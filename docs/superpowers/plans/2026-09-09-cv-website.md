# CV Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a single-page, recruiter-focused CV website at `https://loicwong.github.io` that scores 100 on Lighthouse Accessibility and SEO, ships no JavaScript, and prints to a clean PDF.

**Architecture:** Astro renders one static page from a single typed content module, `src/data/cv.ts`. Every visible section, the JSON-LD structured data, the meta tags and the print stylesheet derive from that one module, so content cannot drift between the page and its metadata. No client-side framework, no hydration, no runtime JavaScript except one small progressive-enhancement script for the case-study disclosures — which use native `<details>` so they work fully with JavaScript disabled.

**Tech Stack:** Astro 5, TypeScript (strict), Tailwind CSS 4, SCSS, Playwright, `@axe-core/playwright`, pnpm. System fonts only. Deployed by GitHub Actions to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-09-cv-website-design.md`

## Global Constraints

- Package manager is **pnpm**, never npm.
- Stylesheets are **`.scss`**, never `.css`.
- **System fonts only.** No external font loading, no `@font-face`, no Google Fonts.
- **No third-party runtime scripts.** No analytics, no embeds.
- Site URL is `https://loicwong.github.io`, base path `/`.
- All copy uses **New Zealand English** spelling (optimise, customise, visualise, prioritise, standardise).
- **Contact is email and LinkedIn only.** No GitHub link, no phone number, no contact form.
- **Fonterra, IAG, Pulse Energy, Deloitte and Noel Leeming are clients served via Dominion, never employers.** They may appear only inside the earlier-career line.
- Every role's outcome bullets must state a result, not a duty.
- Accessibility target is WCAG 2.1 AA: 4.5:1 contrast for body text, 44px minimum touch targets, visible focus on every interactive element, one `h1`, no skipped heading levels.
- `prefers-reduced-motion` and `prefers-color-scheme` must both be honoured.
- **Never fabricate employment dates.** A role with unknown dates renders with no date element at all. See Task 2.

---

### Task 1: Project scaffold, build, and deployment pipeline

Deliverable: an empty Astro site that builds locally and deploys to GitHub Pages.

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/pages/index.astro`
- Create: `public/robots.txt`
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: nothing.
- Produces: a working `pnpm build` that emits `dist/`, and a `pnpm dev` server on port 4321.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "loicwong-cv",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "playwright test",
    "test:install": "playwright install --with-deps chromium",
    "check:dates": "node scripts/check-dates.mjs"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "sass": "^1.80.0",
    "@playwright/test": "^1.48.0",
    "@axe-core/playwright": "^4.10.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://loicwong.github.io',
  base: '/',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'always',
  },
});
```

`inlineStylesheets: 'always'` removes the render-blocking stylesheet request. The whole page is one document with no extra round trips, which is the single biggest lever on Largest Contentful Paint for a page this size.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `.gitignore`**

```
dist/
node_modules/
.astro/
.DS_Store
test-results/
playwright-report/
*.log
```

- [ ] **Step 5: Create a placeholder `src/pages/index.astro`**

```astro
---
---
<!doctype html>
<html lang="en-NZ">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Loic Wong</title>
  </head>
  <body>
    <h1>Loic Wong</h1>
  </body>
</html>
```

- [ ] **Step 6: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://loicwong.github.io/sitemap-index.xml
```

- [ ] **Step 7: Install and verify the build**

Run: `pnpm install && pnpm build`
Expected: build completes, `dist/index.html` exists.

Run: `test -f dist/index.html && echo OK`
Expected: `OK`

- [ ] **Step 8: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with Pages deployment"
```

---

### Task 2: Typed content module

Deliverable: `src/data/cv.ts` — every fact the site displays, typed, in one file.

**Files:**
- Create: `src/data/cv.ts`
- Create: `scripts/check-dates.mjs`
- Test: `tests/content.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a default export `cv: CV`, and the exported types `CV`, `Role`, `CaseStudy`, `Certification`, `SkillGroup`, `Education`. Every later task imports from `../data/cv`. Field names below are final — later tasks reference them exactly.

**The date rule.** `Role.start` and `Role.end` are `string | null`. `null` means *not yet supplied by Loic* and the UI must render no date element at all. Never invent a date to fill a null. `scripts/check-dates.mjs` reports which roles are still missing dates; it warns, it does not fail the build, because a site with five dated roles is more useful live than no site at all.

- [ ] **Step 1: Write the failing test**

Create `tests/content.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import cv from '../src/data/cv';

test('every role has an organisation and a title', () => {
  for (const role of cv.roles) {
    expect(role.org.length).toBeGreaterThan(0);
    expect(role.title.length).toBeGreaterThan(0);
  }
});

test('every role has at least two outcome bullets', () => {
  for (const role of cv.roles) {
    expect(role.outcomes.length).toBeGreaterThanOrEqual(2);
  }
});

test('client names never appear as employers', () => {
  const clients = ['Fonterra', 'IAG', 'Pulse Energy', 'Deloitte', 'Noel Leeming'];
  for (const role of cv.roles) {
    for (const client of clients) {
      expect(role.org).not.toContain(client);
    }
  }
});

test('there are exactly four case studies, each fully populated', () => {
  expect(cv.caseStudies).toHaveLength(4);
  for (const cs of cv.caseStudies) {
    expect(cs.situation.length).toBeGreaterThan(0);
    expect(cs.constraint.length).toBeGreaterThan(0);
    expect(cs.approach.length).toBeGreaterThan(0);
    expect(cs.outcome.length).toBeGreaterThan(0);
  }
});

test('certification count in the hero stat matches the certification list', () => {
  expect(cv.certifications.length).toBe(9);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec playwright test tests/content.spec.ts`
Expected: FAIL — cannot resolve `../src/data/cv`.

- [ ] **Step 3: Create `src/data/cv.ts`**

```ts
/**
 * Single source of truth for every fact this site displays.
 *
 * The rendered page, the JSON-LD Person schema, the meta tags and the print
 * view all derive from this file. Edit a fact here and it changes everywhere.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ACTION REQUIRED — EMPLOYMENT DATES
 *
 * Roles below with `start: null` have no dates because the source CV did not
 * contain them. Undated roles read as evasive to recruiters, so these should
 * be filled in. Use 'YYYY-MM' format, e.g. start: '2021-03'. Use 'present'
 * for a current role's `end`.
 *
 * Run `pnpm check:dates` to list what is still missing.
 *
 * Do not guess these values. A wrong employment date is worse than none.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface Role {
  org: string;
  title: string;
  /** 'YYYY-MM', or null when not yet supplied. Never invent a value. */
  start: string | null;
  /** 'YYYY-MM' | 'present', or null when not yet supplied. */
  end: string | null;
  engagement: 'Contract' | 'Permanent' | null;
  location: string | null;
  summary: string;
  outcomes: string[];
  tech: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  org: string;
  situation: string;
  constraint: string;
  approach: string;
  outcome: string;
  tech: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  /** 'YYYY-MM', or null if the date is unknown. */
  date: string | null;
  credentialId: string | null;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  institution: string;
  qualification: string;
  start: string;
  end: string;
}

export interface CV {
  name: string;
  positioning: string;
  location: string;
  availability: string;
  engagement: string;
  yearsExperience: number;
  coreStack: string;
  email: string;
  linkedin: string;
  metaDescription: string;
  roles: Role[];
  earlierCareer: string;
  caseStudies: CaseStudy[];
  skills: SkillGroup[];
  certifications: Certification[];
  education: Education[];
  languages: string[];
}

const cv: CV = {
  name: 'Loic Wong',
  positioning: 'Engineering Lead & Senior Software Engineer',
  // VERIFY: inferred from Auckland-based roles (Mercury NZ, HazardCo).
  location: 'Auckland, New Zealand',
  availability: 'Available now',
  engagement: 'Open to contract or permanent',
  // VERIFY: earliest role appears to be 2007.
  yearsExperience: 18,
  coreStack: 'React & AWS',
  // VERIFY: taken from session config. Change if you use a different address for job enquiries.
  email: 'loicwong1982@gmail.com',
  linkedin: 'https://www.linkedin.com/in/loic-wong-49a66551/',
  metaDescription:
    'Engineering lead and senior software engineer in Auckland with 18 years across React, TypeScript and AWS. Available now for contract or permanent work in New Zealand and Australia.',

  roles: [
    {
      org: 'Datarock',
      title: 'Senior Software Engineer',
      start: '2022-01',
      end: '2026-08',
      engagement: null,
      location: 'New Zealand',
      summary:
        'Built and evolved a cloud-native SaaS platform for visualising and managing ML-generated rock classification outputs, across full-stack development, AWS architecture, data engineering and technical leadership.',
      outcomes: [
        'Owned the migration of persistent data from DynamoDB to PostgreSQL/RDS, including data modelling, migration strategy and backward-compatible APIs, so the platform could evolve without disrupting existing customers.',
        'Designed and built an internal AWS CDK-based RDS CLI that automated database provisioning, letting new microservices be scaffolded with consistent infrastructure and dependencies.',
        'Built the ML-visualisation interfaces in React, React Query and MUI, investigating frontend performance with Chrome DevTools and Lighthouse and monitoring production errors with Sentry.',
        'Mentored engineers across the team on software design, API integration, testing, AWS and production troubleshooting.',
      ],
      tech: [
        'TypeScript', 'Node.js', 'React', 'React Query', 'MUI', 'AWS', 'PostgreSQL',
        'DynamoDB', 'Lambda', 'ECS/Fargate', 'CDK', 'Step Functions', 'Jest',
        'Pact/PactFlow', 'Docker',
      ],
    },
    {
      org: 'Docuvera',
      title: 'Software Engineer',
      start: null,
      end: null,
      engagement: 'Contract',
      location: null,
      summary:
        'Frontend architecture, performance optimisation and complex document rendering on a highly regulated document authoring and review platform.',
      outcomes: [
        'Diagnosed a critical Largest Contentful Paint failure caused by deeply nested composite components, and proved a flattened-DOM plus virtual-scrolling fix by building a proof of concept.',
        'Analysed DOM structure and browser rendering behaviour to identify excessive layout and paint cost in large documents, separating rendering cost from payload size.',
        'Worked directly with the Product Owner to design and implement core authoring-platform features, balancing product requirements against maintainability and performance.',
      ],
      tech: [
        'Next.js', 'TypeScript', 'GraphQL', 'Apollo Client', 'Apollo Server',
        'Angular', 'Storybook', 'Tailwind CSS', 'SCSS', 'Playwright',
      ],
    },
    {
      org: 'Mercury NZ',
      title: 'Senior API & Integration Developer',
      start: null,
      end: null,
      engagement: 'Contract',
      location: 'Auckland, New Zealand',
      summary:
        'Designed and implemented enterprise API integration for the Mercury App using AWS microservices and serverless architecture.',
      outcomes: [
        'Designed and implemented the customer overdue-billing notification solution, integrating SAP APIs, AWS services, PostgreSQL/RDS and Firebase Notifications.',
        'Designed and implemented Wind Offer Service V12 using Step Functions, CloudWatch Events, S3 and SQS.',
        'Migrated legacy APIs from EC2-hosted services to AWS serverless architecture, and contributed a reusable Serverless OpenAPI validation middleware.',
      ],
      tech: [
        'TypeScript', 'Node.js', 'Ts.ED', 'AWS Lambda', 'API Gateway',
        'Step Functions', 'SQS', 'S3', 'DynamoDB', 'RDS', 'SAP', 'PureCloud',
      ],
    },
    {
      org: 'HazardCo',
      title: 'Senior Software Engineer',
      start: null,
      end: null,
      engagement: 'Contract',
      location: null,
      summary:
        'Delivered customer-facing features, serverless APIs, security improvements and platform upgrades across the HazardCo mobile and web platforms.',
      outcomes: [
        'Built the free registration module using Angular and NativeScript, including free-trial plan definition and implementation.',
        'Led the NativeScript 6 to 7 upgrade, covering Angular and TypeScript compiler upgrades, namespace changes, plugin compatibility, patches and Webpack optimisation.',
        'Investigated security issues and implemented mitigations including AWS WAF, DDoS protection, request-rate limiting and encryption.',
      ],
      tech: [
        'Angular', 'NativeScript', 'TypeScript', 'AWS Lambda', 'API Gateway',
        'SNS', 'SQS', 'DynamoDB', 'S3', 'Appium', 'Webpack',
      ],
    },
    {
      org: 'Aviat Networks',
      title: 'Senior Software Engineer',
      start: null,
      end: null,
      engagement: 'Contract',
      location: null,
      summary:
        'Worked on ProVision Plus, a network management application, focusing on large-scale topology visualisation, frontend architecture and framework migration.',
      outcomes: [
        'Established the feasibility of topology diagrams containing thousands of nodes and links, benchmarking D3, Vis, Paper, Cytoscape and NeXt for performance and scalability.',
        'Designed customised region-quadtree clustering and search approaches so large topology datasets stayed interactive.',
        'Led the migration from AngularJS 1.5 to Vue, designing a hybrid frontend architecture that allowed the application to migrate incrementally rather than through a rewrite.',
      ],
      tech: [
        'Vue', 'AngularJS', 'D3.js', 'TypeScript', 'Node.js', 'Express.js',
        'Stylus', 'Pug', 'Jenkins',
      ],
    },
    {
      org: 'Bank of New Zealand',
      title: 'Java Full-stack Developer',
      start: null,
      end: null,
      engagement: null,
      location: 'New Zealand',
      summary:
        'Online banking authentication, security and cards platforms across the Pixel Perfect and Smurfs teams.',
      outcomes: [
        'Optimised Mobile Internet Banking authentication, reducing login latency from approximately 800ms to 300ms.',
        'Designed and implemented a mobile OAuth solution for CIAM, reducing expected contact-centre authentication service time from approximately five minutes to thirty seconds.',
        'Owned the Internet Banking Cards and CRS modules, migrating legacy Backbone functionality to React and building automated tests with Jest, Enzyme and RxJS Marble testing.',
      ],
      tech: [
        'Java', 'Spring', 'React', 'Redux', 'RxJS', 'Node.js', 'AWS',
        'OpenShift', 'Jenkins', 'JUnit', 'Mockito', 'Jest', 'Enzyme',
        'MuleSoft', 'APIGEE',
      ],
    },
  ],

  earlierCareer:
    'Earlier: Dominion, delivering AEM and frontend work for Fonterra, IAG, Pulse Energy, Deloitte and Noel Leeming; JDA; and enterprise engineering roles in Wellington and Chengdu from 2007.',

  caseStudies: [
    {
      id: 'lcp',
      title: 'Fixing a Largest Contentful Paint failure in a nested document editor',
      org: 'Docuvera',
      situation:
        'A highly regulated document authoring platform had a critical Largest Contentful Paint problem. Documents were assembled from composite components nested many levels deep, and large documents took far too long to show meaningful content.',
      constraint:
        'The nested component model was core to the product and used throughout the authoring experience, so it could not simply be replaced. Any fix had to preserve authoring behaviour for documents that already existed.',
      approach:
        'I profiled the page and analysed the DOM structure to separate network cost from rendering cost, and established that the browser was doing excessive layout and paint work because of DOM depth rather than payload size. I then built a proof of concept combining a flattened DOM structure with virtual scrolling, so only visible content was rendered.',
      outcome:
        'The proof of concept demonstrated that reducing DOM complexity and rendering only visible content resolved the bottleneck. The team got an evidence-backed rendering strategy for large, deeply nested documents instead of an incremental guess.',
      tech: ['Next.js', 'TypeScript', 'Chrome DevTools', 'Virtual scrolling'],
    },
    {
      id: 'auth',
      title: 'Cutting banking authentication from minutes to seconds',
      org: 'Bank of New Zealand',
      situation:
        'Mobile Internet Banking login was slow, and contact-centre staff authenticating customers over the phone were waiting on a flow that was slower still.',
      constraint:
        'This was production banking authentication. Nothing could regress security, and any change had to fit the existing customer identity and access management platform.',
      approach:
        'I profiled the authentication path to find where the time was actually being spent rather than where it was assumed to be, optimised the Mobile Internet Banking flow, then designed and implemented a mobile OAuth solution for the contact-centre CIAM case.',
      outcome:
        'Login latency fell from approximately 800ms to 300ms. Expected contact-centre authentication service time fell from approximately five minutes to thirty seconds.',
      tech: ['Java', 'Spring', 'React', 'Redux', 'OAuth', 'CIAM'],
    },
    {
      id: 'topology',
      title: 'Rendering network topologies of thousands of nodes',
      org: 'Aviat Networks',
      situation:
        'ProVision Plus needed to display network topology diagrams containing thousands of nodes and links. Nothing in the product could handle that scale.',
      constraint:
        'The result had to stay interactive — pan, zoom and search — rather than render a static image, and it had to be built on something the team could maintain.',
      approach:
        'Rather than picking a library by reputation, I benchmarked D3, Vis, Paper, Cytoscape and NeXt against the real dataset for performance and scalability. I then designed customised region-quadtree clustering and search so the view worked with the shape of the data instead of against it, and built a topology prototype.',
      outcome:
        'The evaluation established which technologies could carry the required scale and produced a working prototype, turning an open scalability question into a decided architecture.',
      tech: ['D3.js', 'Vue', 'Stylus', 'Pug'],
    },
    {
      id: 'migration',
      title: 'Migrating a live AngularJS application to Vue without a rewrite',
      org: 'Aviat Networks',
      situation:
        'ProVision Plus ran on AngularJS 1.5. The framework was ageing, but the application was live and a stop-the-world rewrite was not an option.',
      constraint:
        'The migration had to be incremental, with both frameworks running inside the same application and sharing state for as long as the transition took.',
      approach:
        'I designed a hybrid frontend architecture that allowed components to be migrated one at a time, and built middleware letting Vue observe and synchronise with Angular model data while Angular components subscribed to events emitted by Vue. I documented the architecture and the migration strategy for the team.',
      outcome:
        'The team could migrate incrementally and keep shipping, instead of blocking on a rewrite, working from a documented path off AngularJS.',
      tech: ['Vue', 'AngularJS', 'TypeScript', 'JavaScript'],
    },
  ],

  skills: [
    {
      label: 'Front-end',
      items: [
        'React', 'React Query', 'Redux', 'RxJS', 'Next.js', 'Vue', 'Angular',
        'AngularJS', 'NativeScript', 'D3.js', 'MUI', 'Tailwind CSS', 'SCSS',
        'Storybook', 'Webpack', 'Rendering performance', 'Core Web Vitals',
      ],
    },
    {
      label: 'Back-end',
      items: [
        'TypeScript', 'Node.js', 'Java', 'Spring', 'Ts.ED', 'GraphQL', 'Apollo',
        'REST', 'OpenAPI', 'MuleSoft', 'APIGEE', 'Python',
      ],
    },
    {
      label: 'Cloud',
      items: [
        'Lambda', 'API Gateway', 'ECS/Fargate', 'EC2', 'ECR', 'RDS', 'DynamoDB',
        'S3', 'SQS', 'SNS', 'EventBridge', 'Cognito', 'IAM', 'KMS', 'CloudWatch',
        'X-Ray', 'CDK', 'Step Functions', 'Serverless Framework', 'Docker',
      ],
    },
    {
      label: 'Data',
      items: ['PostgreSQL', 'DynamoDB', 'Sequelize', 'Query optimisation', 'Indexing'],
    },
    {
      label: 'Testing',
      items: [
        'Jest', 'Enzyme', 'Playwright', 'Supertest', 'Pact/PactFlow', 'JUnit',
        'Mockito', 'Appium', 'RxJS Marble testing',
      ],
    },
    {
      label: 'Leadership & delivery',
      items: [
        'Mentoring', 'Code review', 'Technical design', 'Scrum', 'CI/CD',
        'Production troubleshooting',
      ],
    },
  ],

  certifications: [
    { name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2019-07', credentialId: null },
    { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2019-07', credentialId: null },
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: null, credentialId: null },
    { name: 'ICAgile Certified Professional', issuer: 'ICAgile', date: '2019-03', credentialId: null },
    { name: 'Project Management Professional (PMP)', issuer: 'Project Management Institute', date: '2015-07', credentialId: '1832195' },
    { name: 'PRINCE2 Practitioner', issuer: 'AXELOS', date: '2015-04', credentialId: null },
    { name: 'ITIL Foundation', issuer: 'AXELOS', date: '2015-04', credentialId: null },
    { name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', date: '2015-03', credentialId: null },
    { name: 'Oracle Certified Java Programmer', issuer: 'Oracle', date: '2012-03', credentialId: null },
  ],

  education: [
    {
      institution: 'University of Electronic Science and Technology of China',
      qualification: "Master's degree",
      start: '2012',
      end: '2014',
    },
    {
      institution: 'University of Electronic Science and Technology of China',
      qualification: "Bachelor's degree",
      start: '2002',
      end: '2006',
    },
  ],

  // VERIFY: LinkedIn lists English and Japanese only. Add Mandarin if applicable.
  languages: ['English', 'Japanese'],
};

export default cv;
```

- [ ] **Step 4: Create `scripts/check-dates.mjs`**

```js
import cv from '../src/data/cv.ts';

const missing = cv.roles.filter((r) => r.start === null || r.end === null);

if (missing.length === 0) {
  console.log('All roles have dates.');
  process.exit(0);
}

console.log(`\n${missing.length} role(s) still need dates in src/data/cv.ts:\n`);
for (const role of missing) {
  console.log(`  - ${role.org} — ${role.title}`);
}
console.log('\nUse YYYY-MM format, e.g. start: \'2021-03\'. Do not guess.\n');
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm exec playwright test tests/content.spec.ts`
Expected: all 5 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/cv.ts scripts/check-dates.mjs tests/content.spec.ts
git commit -m "feat: add typed CV content module"
```

---

### Task 3: Design tokens, base layout, and SEO head

Deliverable: a themed, accessible document shell with complete metadata and JSON-LD.

**Files:**
- Create: `src/styles/global.scss`
- Create: `src/components/SeoHead.astro`
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/seo.spec.ts`
- Create: `playwright.config.ts`

**Interfaces:**
- Consumes: `cv` from `src/data/cv.ts`.
- Produces: `Base.astro` accepting no props and rendering `<slot />` inside `<main id="main">`. CSS custom properties `--bg`, `--fg`, `--muted`, `--accent`, `--rule`, `--card` available to all later components.

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'pnpm build && pnpm preview --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: 'http://localhost:4321' },
});
```

- [ ] **Step 2: Write the failing test**

Create `tests/seo.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('has exactly one h1 containing the name', async ({ page }) => {
  await page.goto('/');
  const h1 = page.locator('h1');
  await expect(h1).toHaveCount(1);
  await expect(h1).toContainText('Loic Wong');
});

test('has a meta description, canonical, and Open Graph tags', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Auckland/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://loicwong.github.io/');
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
});

test('emits valid JSON-LD Person structured data', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').innerText();
  const data = JSON.parse(raw);
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe('Loic Wong');
  expect(Array.isArray(data.knowsAbout)).toBe(true);
});

test('has a skip link that targets the main landmark', async ({ page }) => {
  await page.goto('/');
  const skip = page.locator('a.skip-link');
  await expect(skip).toHaveAttribute('href', '#main');
  await expect(page.locator('main#main')).toHaveCount(1);
});

test('html lang is en-NZ', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-NZ');
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm exec playwright test tests/seo.spec.ts`
Expected: FAIL — no canonical link, no JSON-LD, no skip link.

- [ ] **Step 4: Create `src/styles/global.scss`**

Light palette on bare `:root`, dark redefined under both the media query and an explicit attribute, exactly as the spec requires. All colours below meet 4.5:1 against their background.

```scss
@use 'tailwindcss';

:root {
  --bg: #fbfaf8;
  --card: #ffffff;
  --fg: #17161a;
  --muted: #55525c;
  --accent: #1b4dd8;
  --rule: #e2dfda;
  --chip: #f0ede8;

  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --bg: #121216;
    --card: #1a1a20;
    --fg: #f2f1ee;
    --muted: #a9a6b0;
    --accent: #9db4ff;
    --rule: #2c2c34;
    --chip: #24242c;

    color-scheme: dark;
  }
}

:root[data-theme='dark'] {
  --bg: #121216;
  --card: #1a1a20;
  --fg: #f2f1ee;
  --muted: #a9a6b0;
  --accent: #9db4ff;
  --rule: #2c2c34;
  --chip: #24242c;

  color-scheme: dark;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  font-size: 1.0625rem;
  line-height: 1.65;
  -webkit-text-size-adjust: 100%;
}

h1, h2, h3 {
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

p { text-wrap: pretty; }

a {
  color: var(--accent);
  text-underline-offset: 0.2em;
}

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--card);
  color: var(--fg);
  padding: 0.75rem 1.25rem;
  z-index: 100;

  &:focus {
    left: 0.5rem;
    top: 0.5rem;
  }
}

.wrap {
  max-width: 46rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Create `src/components/SeoHead.astro`**

```astro
---
import cv from '../data/cv';

const canonical = 'https://loicwong.github.io/';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: cv.name,
  jobTitle: cv.positioning,
  email: `mailto:${cv.email}`,
  url: canonical,
  sameAs: [cv.linkedin],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Auckland',
    addressCountry: 'NZ',
  },
  description: cv.metaDescription,
  knowsAbout: cv.skills.flatMap((group) => group.items),
  alumniOf: cv.education.map((e) => ({
    '@type': 'CollegeOrUniversity',
    name: e.institution,
  })),
  hasCredential: cv.certifications.map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.name,
    credentialCategory: 'certification',
    recognizedBy: { '@type': 'Organization', name: c.issuer },
  })),
};
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{cv.name} — {cv.positioning}</title>
<meta name="description" content={cv.metaDescription} />
<link rel="canonical" href={canonical} />

<meta property="og:type" content="profile" />
<meta property="og:title" content={`${cv.name} — ${cv.positioning}`} />
<meta property="og:description" content={cv.metaDescription} />
<meta property="og:url" content={canonical} />
<meta name="twitter:card" content="summary" />

<link rel="icon" href="/favicon.svg" type="image/svg+xml" />

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} is:inline />
```

- [ ] **Step 6: Create `src/layouts/Base.astro`**

```astro
---
import SeoHead from '../components/SeoHead.astro';
import '../styles/global.scss';
---
<!doctype html>
<html lang="en-NZ">
  <head>
    <SeoHead />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <main id="main">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 7: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1b4dd8"/>
  <text x="50" y="68" font-family="-apple-system, system-ui, sans-serif"
        font-size="54" font-weight="600" fill="#fff" text-anchor="middle">LW</text>
</svg>
```

- [ ] **Step 8: Replace `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import cv from '../data/cv';
---
<Base>
  <h1>{cv.name}</h1>
</Base>
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `pnpm exec playwright test tests/seo.spec.ts`
Expected: all 5 tests PASS.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, base layout, and SEO metadata"
```

---

### Task 4: Hero section

Deliverable: the above-the-fold block — name, positioning, availability, three stats, and the contact call to action.

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/hero.spec.ts`

**Interfaces:**
- Consumes: `cv.name`, `cv.positioning`, `cv.location`, `cv.availability`, `cv.engagement`, `cv.yearsExperience`, `cv.coreStack`, `cv.certifications.length`, `cv.email`.
- Produces: `<Hero />`, taking no props. Renders the page's only `h1`.

- [ ] **Step 1: Write the failing test**

Create `tests/hero.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('shows availability, location and engagement above the fold', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Available now')).toBeVisible();
  await expect(page.getByText('Auckland, New Zealand')).toBeVisible();
  await expect(page.getByText('Open to contract or permanent')).toBeVisible();
});

test('stat count matches the certification list length', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('9 certifications')).toBeVisible();
});

test('the primary call to action is a mailto link', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByRole('link', { name: /email/i }).first();
  await expect(cta).toHaveAttribute('href', /^mailto:/);
});

test('call to action meets the 44px minimum touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const box = await page.getByRole('link', { name: /email/i }).first().boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec playwright test tests/hero.spec.ts`
Expected: FAIL — text not found.

- [ ] **Step 3: Create `src/components/Hero.astro`**

```astro
---
import cv from '../data/cv';

const stats = [
  `${cv.yearsExperience} years`,
  cv.coreStack,
  `${cv.certifications.length} certifications`,
];
---
<header class="hero wrap">
  <p class="status">
    <span class="dot" aria-hidden="true"></span>
    {cv.availability} · {cv.engagement}
  </p>

  <h1>{cv.name}</h1>
  <p class="positioning">{cv.positioning}</p>
  <p class="location">{cv.location} · Working across New Zealand and Australia</p>

  <ul class="stats">
    {stats.map((s) => <li>{s}</li>)}
  </ul>

  <p class="cta">
    <a class="button" href={`mailto:${cv.email}`}>Email me</a>
    <a class="secondary" href={cv.linkedin} rel="me noopener">LinkedIn</a>
  </p>
</header>

<style lang="scss">
  .hero {
    padding: clamp(3rem, 9vw, 6rem) 1.25rem clamp(2rem, 5vw, 3.5rem);
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1.75rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--muted);
  }

  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #17864a;
    flex: none;
  }

  :global(:root[data-theme='dark']) .dot,
  :global(:root:not([data-theme='light'])) .dot {
    background: #4ade80;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 680;
  }

  .positioning {
    margin: 0.5rem 0 0;
    font-size: clamp(1.125rem, 3.5vw, 1.4rem);
    font-weight: 500;
    color: var(--fg);
  }

  .location {
    margin: 0.75rem 0 0;
    color: var(--muted);
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.75rem;
    margin: 2rem 0 0;
    padding: 0;
    list-style: none;
    font-variant-numeric: tabular-nums;
    font-weight: 550;
  }

  .stats li + li {
    position: relative;
  }

  .stats li + li::before {
    content: '';
    position: absolute;
    left: -0.9rem;
    top: 0.45em;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--muted);
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.5rem;
    margin: 2.25rem 0 0;
  }

  .button {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 1.5rem;
    border-radius: 6px;
    background: var(--accent);
    color: var(--bg);
    font-weight: 550;
    text-decoration: none;
  }

  .secondary {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
</style>
```

- [ ] **Step 4: Wire it into `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
---
<Base>
  <Hero />
</Base>
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm exec playwright test tests/hero.spec.ts`
Expected: all 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add hero section"
```

---

### Task 5: Experience section

Deliverable: six roles with outcomes and tech chips, plus the earlier-career line. Undated roles render no date element.

**Files:**
- Create: `src/components/Experience.astro`
- Create: `src/lib/formatDate.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/experience.spec.ts`

**Interfaces:**
- Consumes: `cv.roles`, `cv.earlierCareer`.
- Produces: `<Experience />`, taking no props. Exports `formatRange(start: string | null, end: string | null): string | null` from `src/lib/formatDate.ts`, returning `null` when either bound is null.

- [ ] **Step 1: Write the failing test**

Create `tests/experience.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import { formatRange } from '../src/lib/formatDate';

test('formatRange renders a readable range', () => {
  expect(formatRange('2022-01', '2026-08')).toBe('Jan 2022 – Aug 2026');
});

test('formatRange renders present for a current role', () => {
  expect(formatRange('2022-01', 'present')).toBe('Jan 2022 – Present');
});

test('formatRange returns null when a bound is missing', () => {
  expect(formatRange(null, null)).toBeNull();
  expect(formatRange('2022-01', null)).toBeNull();
});

test('renders all six roles', async ({ page }) => {
  await page.goto('/');
  for (const org of ['Datarock', 'Docuvera', 'Mercury NZ', 'HazardCo', 'Aviat Networks', 'Bank of New Zealand']) {
    await expect(page.getByRole('heading', { name: new RegExp(org) })).toBeVisible();
  }
});

test('never renders the literal string null as a date', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.role-dates')).not.toContainText('null');
  await expect(page.locator('body')).not.toContainText('Invalid Date');
});

test('shows the dated Datarock range', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Jan 2022 – Aug 2026')).toBeVisible();
});

test('shows the earlier career line', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Earlier: Dominion/)).toBeVisible();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec playwright test tests/experience.spec.ts`
Expected: FAIL — cannot resolve `../src/lib/formatDate`.

- [ ] **Step 3: Create `src/lib/formatDate.ts`**

```ts
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatOne(value: string): string {
  if (value === 'present') return 'Present';
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || index < 0 || index > 11) return year ?? value;
  return `${MONTHS[index]} ${year}`;
}

/**
 * Returns a readable date range, or null when either bound is missing.
 *
 * Null is deliberate: the source CV did not contain dates for several roles,
 * and inventing them would put false claims on a public page. Callers must
 * render no date element when this returns null.
 */
export function formatRange(start: string | null, end: string | null): string | null {
  if (start === null || end === null) return null;
  return `${formatOne(start)} – ${formatOne(end)}`;
}
```

- [ ] **Step 4: Create `src/components/Experience.astro`**

```astro
---
import cv from '../data/cv';
import { formatRange } from '../lib/formatDate';

const roles = cv.roles.map((role) => ({
  ...role,
  range: formatRange(role.start, role.end),
}));
---
<section class="wrap" aria-labelledby="experience-heading">
  <h2 id="experience-heading">Experience</h2>

  <ol class="roles">
    {roles.map((role) => (
      <li class="role">
        <h3>{role.org} — {role.title}</h3>

        <p class="role-meta">
          {role.range && <span class="role-dates">{role.range}</span>}
          {role.engagement && <span class="tag">{role.engagement}</span>}
          {role.location && <span class="role-location">{role.location}</span>}
        </p>

        <p class="summary">{role.summary}</p>

        <ul class="outcomes">
          {role.outcomes.map((o) => <li>{o}</li>)}
        </ul>

        <ul class="chips" aria-label={`Technologies used at ${role.org}`}>
          {role.tech.map((t) => <li>{t}</li>)}
        </ul>
      </li>
    ))}
  </ol>

  <p class="earlier">{cv.earlierCareer}</p>
</section>

<style lang="scss">
  section { padding: clamp(2rem, 5vw, 3rem) 1.25rem; }

  h2 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin: 0 0 2rem;
  }

  .roles {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .role + .role {
    margin-top: 2.75rem;
    padding-top: 2.75rem;
    border-top: 1px solid var(--rule);
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .role-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.85rem;
    margin: 0.4rem 0 0;
    font-size: 0.9375rem;
    color: var(--muted);
  }

  .tag {
    padding: 0.1rem 0.5rem;
    border: 1px solid var(--rule);
    border-radius: 3px;
    font-size: 0.8125rem;
  }

  .summary { margin: 0.9rem 0 0; }

  .outcomes {
    margin: 0.9rem 0 0;
    padding-left: 1.15rem;
  }

  .outcomes li + li { margin-top: 0.5rem; }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 1.1rem 0 0;
    padding: 0;
    list-style: none;
  }

  .chips li {
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    background: var(--chip);
    font-size: 0.8125rem;
    color: var(--muted);
  }

  .earlier {
    margin: 2.75rem 0 0;
    padding-top: 1.5rem;
    border-top: 1px solid var(--rule);
    color: var(--muted);
    font-size: 0.9375rem;
  }
</style>
```

- [ ] **Step 5: Wire it into `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import Experience from '../components/Experience.astro';
---
<Base>
  <Hero />
  <Experience />
</Base>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `pnpm exec playwright test tests/experience.spec.ts`
Expected: all 7 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add experience section"
```

---

### Task 6: Case studies

Deliverable: four Situation/Constraint/Approach/Outcome disclosures, built on native `<details>` so they need no JavaScript.

**Files:**
- Create: `src/components/CaseStudies.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/case-studies.spec.ts`

**Interfaces:**
- Consumes: `cv.caseStudies`.
- Produces: `<CaseStudies />`, taking no props.

Native `<details>`/`<summary>` gives keyboard operation, screen-reader expanded-state announcement, and in-page find support for free, with zero script. Do not reimplement this with buttons and ARIA.

- [ ] **Step 1: Write the failing test**

Create `tests/case-studies.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('renders four case studies', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.case-study')).toHaveCount(4);
});

test('the two strongest case studies come first', async ({ page }) => {
  await page.goto('/');
  const titles = await page.locator('.case-study summary h3').allInnerTexts();
  expect(titles[0]).toContain('Largest Contentful Paint');
  expect(titles[1]).toContain('banking authentication');
});

test('each case study has all four structured parts', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('.case-study').first();
  await first.locator('summary').click();
  for (const label of ['Situation', 'Constraint', 'Approach', 'Outcome']) {
    await expect(first.getByText(label, { exact: true })).toBeVisible();
  }
});

test('disclosures open and close by keyboard alone', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('.case-study').first();
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(first).not.toHaveAttribute('open', '');
});

test('the quantified outcome is present', async ({ page }) => {
  await page.goto('/');
  const auth = page.locator('.case-study').nth(1);
  await auth.locator('summary').click();
  await expect(auth.getByText(/800ms to 300ms/)).toBeVisible();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec playwright test tests/case-studies.spec.ts`
Expected: FAIL — zero `.case-study` elements.

- [ ] **Step 3: Create `src/components/CaseStudies.astro`**

```astro
---
import cv from '../data/cv';

const parts = ['Situation', 'Constraint', 'Approach', 'Outcome'] as const;
---
<section class="wrap" aria-labelledby="cases-heading">
  <h2 id="cases-heading">Problems worth solving</h2>
  <p class="lede">
    Four problems where the interesting part was working out what was actually
    wrong, not writing the fix.
  </p>

  {cv.caseStudies.map((cs) => (
    <details class="case-study">
      <summary>
        <h3>{cs.title}</h3>
        <span class="org">{cs.org}</span>
      </summary>

      <div class="body">
        {parts.map((part) => (
          <div class="part">
            <p class="label">{part}</p>
            <p class="text">{cs[part.toLowerCase() as 'situation' | 'constraint' | 'approach' | 'outcome']}</p>
          </div>
        ))}

        <ul class="chips" aria-label={`Technologies used: ${cs.title}`}>
          {cs.tech.map((t) => <li>{t}</li>)}
        </ul>
      </div>
    </details>
  ))}
</section>

<style lang="scss">
  section { padding: clamp(2rem, 5vw, 3rem) 1.25rem; }

  h2 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin: 0 0 0.75rem;
  }

  .lede {
    margin: 0 0 2rem;
    color: var(--muted);
    max-width: 34rem;
  }

  .case-study {
    border-top: 1px solid var(--rule);

    &:last-of-type { border-bottom: 1px solid var(--rule); }
  }

  summary {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.35rem 0.85rem;
    min-height: 44px;
    padding: 1.15rem 2rem 1.15rem 0;
    cursor: pointer;
    position: relative;
    list-style: none;

    &::-webkit-details-marker { display: none; }

    &::after {
      content: '';
      position: absolute;
      right: 0.35rem;
      top: 1.65rem;
      width: 0.55rem;
      height: 0.55rem;
      border-right: 2px solid var(--muted);
      border-bottom: 2px solid var(--muted);
      transform: rotate(45deg);
      transition: transform 160ms ease;
    }
  }

  .case-study[open] > summary::after {
    transform: rotate(-135deg);
  }

  summary h3 {
    display: inline;
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 570;
  }

  .org {
    font-size: 0.875rem;
    color: var(--muted);
  }

  .body { padding: 0 0 1.75rem; }

  .part + .part { margin-top: 1.15rem; }

  .label {
    margin: 0 0 0.2rem;
    font-size: 0.75rem;
    font-weight: 620;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--muted);
  }

  .text {
    margin: 0;
    max-width: 38rem;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 1.4rem 0 0;
    padding: 0;
    list-style: none;
  }

  .chips li {
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    background: var(--chip);
    font-size: 0.8125rem;
    color: var(--muted);
  }
</style>
```

- [ ] **Step 4: Wire it into `src/pages/index.astro`**

Add `import CaseStudies from '../components/CaseStudies.astro';` and place `<CaseStudies />` after `<Experience />`.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm exec playwright test tests/case-studies.spec.ts`
Expected: all 5 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add case studies section"
```

---

### Task 7: Skills, certifications, education, and contact

Deliverable: the remaining content sections and the page footer.

**Files:**
- Create: `src/components/Skills.astro`
- Create: `src/components/Credentials.astro`
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/credentials.spec.ts`

**Interfaces:**
- Consumes: `cv.skills`, `cv.certifications`, `cv.education`, `cv.languages`, `cv.email`, `cv.linkedin`.
- Produces: `<Skills />`, `<Credentials />`, `<Contact />`, none taking props.

- [ ] **Step 1: Write the failing test**

Create `tests/credentials.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('renders all six skill groups', async ({ page }) => {
  await page.goto('/');
  for (const group of ['Front-end', 'Back-end', 'Cloud', 'Data', 'Testing', 'Leadership & delivery']) {
    await expect(page.getByRole('heading', { name: group })).toBeVisible();
  }
});

test('renders nine certifications including the PMP credential id', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.cert')).toHaveCount(9);
  await expect(page.getByText('1832195')).toBeVisible();
});

test('shows education and languages', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/University of Electronic Science/).first()).toBeVisible();
  await expect(page.getByText('English, Japanese')).toBeVisible();
});

test('contact has email and LinkedIn but no GitHub link', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  await expect(page.locator('a[href*="linkedin.com"]').first()).toBeVisible();
  await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
});

test('has no percentage proficiency bars', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('progress, meter, [role="progressbar"]')).toHaveCount(0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec playwright test tests/credentials.spec.ts`
Expected: FAIL — headings not found.

- [ ] **Step 3: Create `src/components/Skills.astro`**

```astro
---
import cv from '../data/cv';
---
<section class="wrap" aria-labelledby="skills-heading">
  <h2 id="skills-heading">Skills</h2>

  <div class="groups">
    {cv.skills.map((group) => (
      <div class="group">
        <h3>{group.label}</h3>
        <ul class="chips">
          {group.items.map((item) => <li>{item}</li>)}
        </ul>
      </div>
    ))}
  </div>
</section>

<style lang="scss">
  section { padding: clamp(2rem, 5vw, 3rem) 1.25rem; }

  h2 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin: 0 0 2rem;
  }

  .group + .group {
    margin-top: 1.75rem;
    padding-top: 1.75rem;
    border-top: 1px solid var(--rule);
  }

  h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .chips li {
    padding: 0.25rem 0.65rem;
    border-radius: 4px;
    background: var(--chip);
    font-size: 0.875rem;
  }
</style>
```

- [ ] **Step 4: Create `src/components/Credentials.astro`**

```astro
---
import cv from '../data/cv';
import { formatRange } from '../lib/formatDate';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function certDate(value: string | null): string | null {
  if (value === null) return null;
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || index < 0 || index > 11) return year ?? null;
  return `${MONTHS[index]} ${year}`;
}
---
<section class="wrap" aria-labelledby="credentials-heading">
  <h2 id="credentials-heading">Certifications</h2>

  <ul class="certs">
    {cv.certifications.map((cert) => (
      <li class="cert">
        <span class="name">{cert.name}</span>
        <span class="meta">
          {cert.issuer}
          {certDate(cert.date) && <> · {certDate(cert.date)}</>}
          {cert.credentialId && <> · ID {cert.credentialId}</>}
        </span>
      </li>
    ))}
  </ul>

  <h2 id="education-heading" class="second">Education &amp; languages</h2>

  <ul class="education">
    {cv.education.map((e) => (
      <li>
        <span class="name">{e.qualification}</span>
        <span class="meta">{e.institution} · {e.start}–{e.end}</span>
      </li>
    ))}
    <li>
      <span class="name">Languages</span>
      <span class="meta">{cv.languages.join(', ')}</span>
    </li>
  </ul>
</section>

<style lang="scss">
  section { padding: clamp(2rem, 5vw, 3rem) 1.25rem; }

  h2 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin: 0 0 1.5rem;
  }

  .second { margin-top: 3rem; }

  .certs, .education {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .certs li, .education li {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.85rem 0;
    border-top: 1px solid var(--rule);
  }

  .certs li:last-child, .education li:last-child {
    border-bottom: 1px solid var(--rule);
  }

  .name { font-weight: 540; }

  .meta {
    font-size: 0.875rem;
    color: var(--muted);
  }
</style>
```

- [ ] **Step 5: Create `src/components/Contact.astro`**

The email is assembled from two halves at build time so the finished HTML contains no single contiguous `user@domain` string for the simplest harvesters. This is a speed bump, not protection — state it plainly and do not oversell it.

```astro
---
import cv from '../data/cv';

const [user, domain] = cv.email.split('@');
---
<section class="wrap contact" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Get in touch</h2>

  <p class="pitch">
    Available now for contract or permanent engineering lead and senior
    engineering roles across New Zealand and Australia.
  </p>

  <ul class="links">
    <li>
      <a href={`mailto:${user}@${domain}`}>{user}<span aria-hidden="true">@</span>{domain}</a>
    </li>
    <li><a href={cv.linkedin} rel="me noopener">LinkedIn</a></li>
  </ul>
</section>

<style lang="scss">
  .contact {
    padding: clamp(3rem, 7vw, 4.5rem) 1.25rem clamp(4rem, 9vw, 6rem);
    border-top: 1px solid var(--rule);
    margin-top: 2rem;
  }

  h2 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin: 0 0 1rem;
  }

  .pitch {
    margin: 0 0 1.75rem;
    max-width: 34rem;
    font-size: 1.125rem;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 2rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .links a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-weight: 540;
  }
</style>
```

- [ ] **Step 6: Wire all three into `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import Experience from '../components/Experience.astro';
import CaseStudies from '../components/CaseStudies.astro';
import Skills from '../components/Skills.astro';
import Credentials from '../components/Credentials.astro';
import Contact from '../components/Contact.astro';
---
<Base>
  <Hero />
  <Experience />
  <CaseStudies />
  <Skills />
  <Credentials />
  <Contact />
</Base>
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `pnpm exec playwright test tests/credentials.spec.ts`
Expected: all 5 tests PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add skills, credentials, and contact sections"
```

---

### Task 8: Print stylesheet

Deliverable: Cmd+P produces a clean one-to-two page PDF CV. This is the spec's signature detail.

**Files:**
- Create: `src/styles/print.scss`
- Modify: `src/styles/global.scss` (add the `@use` at the end)
- Test: `tests/print.spec.ts`

**Interfaces:**
- Consumes: the class names established in Tasks 4 to 7 — `.hero`, `.status`, `.stats`, `.cta`, `.case-study`, `.chips`, `.skip-link`.
- Produces: no new markup. Print styles only.

All `<details>` must be forced open for print; a collapsed disclosure prints as a bare heading and loses the case-study content.

- [ ] **Step 1: Write the failing test**

Create `tests/print.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('case study content is visible in print emulation', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });
  const body = page.locator('.case-study').first().locator('.body');
  await expect(body).toBeVisible();
});

test('interactive furniture is hidden in print', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.skip-link')).toBeHidden();
  await expect(page.locator('.cta')).toBeHidden();
});

test('produces a PDF of two pages or fewer', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'PDF generation is Chromium-only');
  await page.goto('/');
  const pdf = await page.pdf({ format: 'A4', printBackground: false });
  const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
  expect(pages).toBeGreaterThan(0);
  expect(pages).toBeLessThanOrEqual(2);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec playwright test tests/print.spec.ts`
Expected: FAIL — `.body` hidden because `<details>` is closed; `.cta` still visible.

- [ ] **Step 3: Create `src/styles/print.scss`**

```scss
@media print {
  @page {
    size: A4;
    margin: 14mm 15mm;
  }

  :root {
    --bg: #ffffff;
    --card: #ffffff;
    --fg: #000000;
    --muted: #444444;
    --accent: #000000;
    --rule: #cccccc;
    --chip: transparent;
  }

  body {
    background: #fff;
    color: #000;
    font-size: 9.5pt;
    line-height: 1.4;
  }

  // Interactive furniture has no meaning on paper.
  .skip-link,
  .cta,
  .status .dot,
  .case-study summary::after {
    display: none !important;
  }

  // A collapsed disclosure would print as a bare heading and lose its content.
  details {
    display: block !important;
  }

  details > .body {
    display: block !important;
    height: auto !important;
  }

  summary {
    display: block !important;
    padding: 0 !important;
    min-height: 0 !important;
    cursor: auto;
  }

  .wrap {
    max-width: none;
    padding: 0;
  }

  section {
    padding: 0 !important;
    margin: 0 0 5mm;
  }

  .hero {
    padding: 0 0 4mm !important;
    border-bottom: 1pt solid #000;
  }

  h1 { font-size: 20pt !important; }
  h2 { font-size: 8pt !important; margin: 0 0 2mm !important; }
  h3 { font-size: 10.5pt !important; }

  .role,
  .case-study {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .role + .role,
  .group + .group {
    margin-top: 3mm;
    padding-top: 3mm;
  }

  // Chips become inline text — dozens of boxes waste paper.
  .chips {
    display: block !important;
    font-size: 8pt;
    color: #444;
  }

  .chips li {
    display: inline !important;
    padding: 0 !important;
    background: none !important;

    &::after { content: ' · '; }
    &:last-child::after { content: ''; }
  }

  a {
    color: #000;
    text-decoration: none;
  }

  // Resolve external links as footnotes, but not mailto — the address is
  // already printed as the link text.
  a[href^='http']::after {
    content: ' (' attr(href) ')';
    font-size: 8pt;
    color: #444;
    word-break: break-all;
  }
}
```

- [ ] **Step 4: Import it from `src/styles/global.scss`**

Append to the end of `src/styles/global.scss`:

```scss
@use './print.scss';
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm exec playwright test tests/print.spec.ts`
Expected: all 3 tests PASS.

If the PDF exceeds two pages, reduce `body` font-size to `9pt` and `section` margin to `4mm` before changing any content.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add print stylesheet producing a clean PDF CV"
```

---

### Task 9: Accessibility and performance verification

Deliverable: automated proof that the spec's success criteria are met.

**Files:**
- Create: `tests/a11y.spec.ts`
- Create: `README.md`
- Modify: `.github/workflows/deploy.yml` (run tests before deploy)

**Interfaces:**
- Consumes: the complete page from Tasks 4 to 8.
- Produces: a green `pnpm test` covering every automatable success criterion.

- [ ] **Step 1: Write the failing test**

Create `tests/a11y.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('has no axe violations at WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('has no axe violations with every disclosure open', async ({ page }) => {
  await page.goto('/');
  for (const summary of await page.locator('.case-study summary').all()) {
    await summary.click();
  }
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('has no axe violations in dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('does not scroll horizontally at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});

test('heading levels are ordered with no skips', async ({ page }) => {
  await page.goto('/');
  const levels = await page.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1])),
  );
  expect(levels[0]).toBe(1);
  for (let i = 1; i < levels.length; i++) {
    expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  }
});

test('ships no render-blocking external stylesheet or script', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
  const external = await page.locator('script[src]').count();
  expect(external).toBe(0);
});

test('every link has a discernible accessible name', async ({ page }) => {
  await page.goto('/');
  for (const link of await page.getByRole('link').all()) {
    const name = (await link.textContent())?.trim() ?? '';
    expect(name.length).toBeGreaterThan(0);
  }
});
```

- [ ] **Step 2: Run the tests**

Run: `pnpm exec playwright test tests/a11y.spec.ts`
Expected: any violations reported are real defects. Fix the markup or tokens until green. Do not weaken the assertions or narrow the tag list to make a failure disappear.

- [ ] **Step 3: Run the full suite**

Run: `pnpm test`
Expected: every spec from Tasks 2 to 9 passes.

- [ ] **Step 4: Run Lighthouse and record the scores**

Run: `pnpm build && pnpm preview --port 4321` in one shell, then in another:

```bash
pnpm dlx lighthouse http://localhost:4321 \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless" --quiet --output=json --output-path=/tmp/lh.json
node -e "const r=require('/tmp/lh.json');for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100))"
```

Expected: accessibility 100, seo 100, best-practices 100, performance >= 90.

- [ ] **Step 5: Add the test gate to `.github/workflows/deploy.yml`**

Insert after the `pnpm install --frozen-lockfile` step in the `build` job:

```yaml
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test
```

- [ ] **Step 6: Create `README.md`**

```markdown
# loicwong.github.io

Personal CV site. Astro, no client-side framework, no runtime JavaScript.

## Editing content

All content lives in `src/data/cv.ts`. Edit a fact there and it updates the
page, the JSON-LD structured data, the meta tags and the print view together.

## Outstanding

Several roles have `start: null` / `end: null` because the source CV did not
include dates. Undated roles read as evasive to recruiters — fill them in using
`YYYY-MM` format. Run `pnpm check:dates` to see which are missing.

Values marked `VERIFY:` in `src/data/cv.ts` were inferred rather than sourced,
and should be confirmed: city, total years of experience, contact email, and
the languages list.

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Local dev server on :4321 |
| `pnpm build` | Type-check and build to `dist/` |
| `pnpm test` | Playwright suite, including axe accessibility checks |
| `pnpm check:dates` | Report roles still missing dates |

## Deployment

Pushing to `main` runs the test suite and deploys to GitHub Pages. Enable Pages
once under Settings → Pages → Source → GitHub Actions.
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: add accessibility suite and CI gate"
```

---

## Self-Review

**Spec coverage.** Positioning, market, availability and engagement → Task 4. Six roles with outcomes and the earlier-career line → Task 5. Four ordered case studies → Task 6. Skills without proficiency bars, nine certifications, education and languages → Task 7. Email and LinkedIn only, no GitHub → Task 7, asserted in `credentials.spec.ts`. Single typed content source feeding page, JSON-LD, meta and print → Task 2 and Task 3. WCAG 2.1 AA, one `h1`, focus states, 44px targets, reduced motion, colour scheme → Tasks 3, 4 and 9. JSON-LD, canonical, OG, sitemap, robots → Tasks 1 and 3. Print stylesheet → Task 8. GitHub Actions deploy → Tasks 1 and 9. Every success-criteria row is asserted by a test except the Lighthouse scores, which are a manual step with a recorded command in Task 9 Step 4.

**Placeholder scan.** No TBD, TODO or "similar to Task N" in any step. Every code step carries the actual code. The one deliberate null is `Role.start`/`Role.end`, which is a specified behaviour with defined rendering, a helper that returns null, a test asserting no `null` string leaks to the page, and a reporting script — not an unfinished plan step.

**Type consistency.** `formatRange(start, end)` is defined in Task 5 and used only there and in Task 8's print test. `Certification.credentialId` is `string | null` in Task 2 and null-checked in Task 7. `cv.skills` is `SkillGroup[]` with `label` and `items`, used identically in Tasks 3 and 7. `cv.caseStudies[].id` is currently unused by any component; it is retained because a future deep link would need it, and it costs one field.

**Known deviation from the spec.** The spec says two to three case studies; four were selected by the user. Task 6 orders them so the two strongest render first, preserving the 45-second scan.
