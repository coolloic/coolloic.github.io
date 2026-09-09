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
console.log("\nUse YYYY-MM format, e.g. start: '2021-03'. Do not guess.\n");
