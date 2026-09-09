import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Scoped to the screen section: the print document repeats this content, and
// an unscoped locator matches both copies.
const credentials = (page: Page) =>
  page.locator('section[aria-labelledby="credentials-heading"]');

test('renders all six skill groups', async ({ page }) => {
  await page.goto('/');
  for (const group of ['Front-end', 'Back-end', 'Cloud', 'Data', 'Testing', 'Leadership & delivery']) {
    await expect(page.getByRole('heading', { name: group, exact: true })).toBeVisible();
  }
});

test('renders nine certifications including the PMP credential id', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.cert')).toHaveCount(9);
  await expect(credentials(page).getByText(/1832195/)).toBeVisible();
});

test('shows education and languages', async ({ page }) => {
  await page.goto('/');
  await expect(credentials(page).getByText(/University of Electronic Science/).first()).toBeVisible();
  await expect(credentials(page).getByText('English, Japanese')).toBeVisible();
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
