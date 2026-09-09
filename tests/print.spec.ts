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

// Three pages, not two: six roles, four case studies, nine certifications and
// six skill groups do not fit two A4 pages without deleting real CV content.
test('produces a PDF of three pages or fewer', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'PDF generation is Chromium-only');
  await page.goto('/');
  const pdf = await page.pdf({ format: 'A4', printBackground: false });
  const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
  expect(pages).toBeGreaterThan(0);
  expect(pages).toBeLessThanOrEqual(3);
});
