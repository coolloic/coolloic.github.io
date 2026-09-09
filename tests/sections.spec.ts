import { test, expect } from '@playwright/test';
import cv from '../src/data/cv';

test('renders every domain with its organisations', async ({ page }) => {
  await page.goto('/');
  const domains = page.locator('.domain');
  await expect(domains).toHaveCount(cv.domains.length);
  await expect(page.getByRole('heading', { name: 'Mining & geoscience' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Supply chain & retail planning' })).toBeVisible();
  await expect(domains.first()).toContainText('Datarock');
});

test('domains appear before the experience section', async ({ page }) => {
  await page.goto('/');
  const order = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('main section[aria-labelledby]')]
      .map((s) => s.getAttribute('aria-labelledby'));
    return ids;
  });
  expect(order.indexOf('domains-heading')).toBeGreaterThan(-1);
  expect(order.indexOf('domains-heading')).toBeLessThan(order.indexOf('experience-heading'));
});

test('every role on the timeline shows a year marker', async ({ page }) => {
  await page.goto('/');
  const rail = page.locator('section[aria-labelledby="experience-heading"]');
  await expect(rail.locator('.role')).toHaveCount(6);
  await expect(rail.locator('.role-dates')).toHaveCount(6);
});

test('core skills are emphasised and match the data', async ({ page }) => {
  await page.goto('/');
  const core = page.locator('section[aria-labelledby="skills-heading"] .is-core');
  const count = await core.count();
  expect(count).toBeGreaterThan(0);
  for (const chip of await core.all()) {
    expect(cv.coreSkills).toContain((await chip.textContent())!.trim());
  }
});

test('every core skill actually appears in a skill group', async ({ page }) => {
  await page.goto('/');
  const rendered = await page
    .locator('section[aria-labelledby="skills-heading"] .is-core')
    .allInnerTexts();
  const trimmed = rendered.map((t) => t.trim());
  for (const skill of cv.coreSkills) {
    expect(trimmed, `core skill "${skill}" is emphasised nowhere`).toContain(skill);
  }
});

test('domain organisations are not styled as links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.domain a')).toHaveCount(0);
});

test('emphasised skill chips still meet the minimum touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const box = await page
    .locator('section[aria-labelledby="skills-heading"] .is-core')
    .first()
    .boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(24);
});
