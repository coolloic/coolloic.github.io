/**
 * Single source of truth for every fact this site displays.
 *
 * The rendered page, the JSON-LD Person schema, the meta tags and the print
 * view all derive from this file. Edit a fact here and it changes everywhere.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EMPLOYMENT DATES — YEAR GRANULARITY, RECONSTRUCTED
 *
 * Only Datarock was dated in the source CV. The rest were reconstructed from
 * a contiguous ordering Loic supplied, and are deliberately year-only: month
 * precision would imply a certainty the source does not support.
 *
 * They should still be checked against his actual record. Two known conflicts
 * remain unresolved — his public LinkedIn shows BNZ starting Aug 2018 and
 * Aviat's ProVision Plus at Sep 2019, both later than the years below.
 *
 * `formatRange` accepts 'YYYY', 'YYYY-MM' or 'present', so tightening any of
 * these to a real month is a one-value edit.
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
  /**
   * One-line form for the printed CV's Selected achievements block. Written
   * separately because the web narrative below is paced for reading, and
   * reusing it on a CV produces passive, wordy lines.
   */
  achievement: string;
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

export interface Domain {
  label: string;
  /** What the work actually involved in this domain. */
  detail: string;
  /** Organisations the domain experience comes from. */
  orgs: string[];
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
  domains: Domain[];
  caseStudies: CaseStudy[];
  skills: SkillGroup[];
  /**
   * Technologies rendered with visual emphasis in the skills section. This is
   * "what he leads with", not a proficiency ranking — there is no evidence
   * base for ranking, and inventing one would be worse than not emphasising.
   */
  coreSkills: string[];
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
  yearsExperience: 18,
  coreStack: 'React & AWS',
  email: 'loic.wong@hotmail.com',
  linkedin: 'https://www.linkedin.com/in/loic-wong-49a66551/',
  metaDescription:
    'Engineering lead and senior software engineer in Auckland with 18 years across React, TypeScript and AWS. Available now for contract or permanent work in New Zealand and Australia.',

  roles: [
    {
      org: 'Datarock',
      title: 'Senior Software Engineer',
      start: '2022',
      end: '2026',
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
      start: '2021',
      end: '2022',
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
      start: '2020',
      end: '2021',
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
      start: '2019',
      end: '2020',
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
      start: '2017',
      end: '2019',
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
      start: '2016',
      end: '2017',
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
      achievement:
        'Diagnosed a critical Largest Contentful Paint failure in a deeply nested document editor, and proved the fix — a flattened DOM with virtual scrolling — by proof of concept.',
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
      achievement:
        'Cut Mobile Internet Banking login latency from approximately 800ms to 300ms, and contact-centre authentication from about five minutes to thirty seconds.',
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
      achievement:
        'Made interactive topology diagrams of thousands of nodes viable, benchmarking five visualisation libraries and designing region-quadtree clustering.',
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
      achievement:
        'Enabled a live AngularJS 1.5 application to migrate to Vue incrementally, through a hybrid architecture and middleware bridging both frameworks.',
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

  domains: [
    {
      label: 'Mining & geoscience',
      detail: 'Machine-learning rock classification and imagery workflows.',
      orgs: ['Datarock'],
    },
    {
      label: 'Banking & fintech',
      detail: 'Online banking, authentication, CIAM and cards.',
      orgs: ['Bank of New Zealand'],
    },
    {
      label: 'Energy & utilities',
      detail: 'Billing notifications, wind offer services and SAP integration.',
      orgs: ['Mercury NZ', 'Pulse Energy', 'Just Energy'],
    },
    {
      label: 'Supply chain & retail planning',
      detail: 'Enterprise supply-chain and retail planning systems.',
      orgs: ['JDA', 'NZMP', 'Noel Leeming'],
    },
    {
      label: 'Telecommunications',
      detail: 'Network management and large-scale topology visualisation.',
      orgs: ['Aviat Networks'],
    },
    {
      label: 'Construction health & safety',
      detail: 'Mobile and web platforms for on-site safety and compliance.',
      orgs: ['HazardCo'],
    },
    {
      label: 'Regulated content & compliance',
      detail: 'Highly regulated document authoring and review.',
      orgs: ['Docuvera'],
    },
    {
      label: 'Insurance',
      detail: 'Customer-facing web delivery and interactive visualisations.',
      orgs: ['IAG'],
    },
    {
      label: 'Dairy & FMCG',
      detail: 'AEM platforms and interactive brand experiences.',
      orgs: ['Fonterra'],
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
        'AWS', 'Lambda', 'API Gateway', 'ECS/Fargate', 'EC2', 'ECR', 'RDS', 'DynamoDB',
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

  coreSkills: [
    'React', 'TypeScript', 'Node.js', 'AWS', 'Java', 'Spring', 'PostgreSQL',
  ],

  certifications: [
    { name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2019-07', credentialId: null },
    { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2019-07', credentialId: null },
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2019-06', credentialId: null },
    { name: 'ICAgile Certified Professional', issuer: 'ICAgile', date: '2019-03', credentialId: null },
    { name: 'Project Management Professional (PMP)', issuer: 'Project Management Institute', date: '2015-07', credentialId: '1832195' },
    { name: 'PRINCE2 Practitioner', issuer: 'AXELOS', date: '2015-04', credentialId: '03016516-01-C4X2' },
    { name: 'ITIL Foundation', issuer: 'AXELOS', date: '2015-04', credentialId: '5331125.20387405' },
    { name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', date: '2015-03', credentialId: '000401223' },
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
