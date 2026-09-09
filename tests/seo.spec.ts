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
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://coolloic.github.io/');
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
});

test('emits valid JSON-LD Person structured data', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw!);
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

test('robots.txt advertises the sitemap on the same host as the canonical', async ({ page, request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('https://coolloic.github.io/sitemap-index.xml');
});

test('html lang is en-NZ', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-NZ');
});
