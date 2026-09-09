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
