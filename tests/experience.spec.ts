import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { formatRange } from '../src/lib/formatDate';

// Scoped to the screen section: the print document repeats this content, and
// an unscoped locator matches both copies.
const experience = (page: Page) =>
  page.locator('section[aria-labelledby="experience-heading"]');

test('formatRange renders a year-only range', () => {
  expect(formatRange('2022', '2026')).toBe('2022 – 2026');
});

test('formatRange still renders month precision when it is supplied', () => {
  expect(formatRange('2022-01', '2026-08')).toBe('Jan 2022 – Aug 2026');
});

test('formatRange collapses a range that starts and ends in one year', () => {
  expect(formatRange('2022', '2022')).toBe('2022');
});

test('formatRange handles mixed precision', () => {
  expect(formatRange('2022', '2026-08')).toBe('2022 – Aug 2026');
});

test('formatRange renders present for a current role', () => {
  expect(formatRange('2022', 'present')).toBe('2022 – Present');
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

test('every role now shows a date range', async ({ page }) => {
  await page.goto('/');
  await expect(experience(page).locator('.role-dates')).toHaveCount(6);
  await expect(experience(page).getByText('2022 – 2026')).toBeVisible();
  await expect(experience(page).getByText('2018 – 2019')).toBeVisible();
});

test('shows the earlier career line', async ({ page }) => {
  await page.goto('/');
  await expect(experience(page).getByText(/Earlier: Dominion/)).toBeVisible();
});
