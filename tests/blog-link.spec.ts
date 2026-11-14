import { test, expect } from '@playwright/test';

const BLOG = 'https://coolloic.github.io/blog/';

test('hero links to the blog', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero').getByRole('link', { name: /blog/i })).toHaveAttribute('href', BLOG);
});

test('contact links to the blog', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('section[aria-labelledby="contact-heading"]');
  await expect(contact.getByRole('link', { name: /blog/i })).toHaveAttribute('href', BLOG);
});

test('structured data lists the blog in sameAs', async ({ page }) => {
  await page.goto('/');
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(ld!).sameAs).toContain(BLOG);
});
