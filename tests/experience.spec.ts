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
  const dates = await page.locator('.role-dates').allInnerTexts();
  for (const d of dates) expect(d).not.toContain('null');
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
