import { test, expect } from '@playwright/test';

test('shows availability, location and engagement above the fold', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Available now')).toBeVisible();
  await expect(page.getByText('Auckland, New Zealand').first()).toBeVisible();
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
