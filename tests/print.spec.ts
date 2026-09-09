import { test, expect } from '@playwright/test';

test.describe('print', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });
  });

  test('the printed CV carries contact details in its header', async ({ page }) => {
    const header = page.locator('.print-cv .pc-header');
    await expect(header).toBeVisible();
    await expect(header).toContainText('Loic Wong');
    await expect(header).toContainText('loic.wong@hotmail.com');
    await expect(header).toContainText('Auckland, New Zealand');
    await expect(header).toContainText('Available now');
  });

  test('selected achievements appear near the top with the quantified result', async ({ page }) => {
    const block = page.locator('.print-cv .pc-achievements');
    await expect(block).toBeVisible();
    await expect(block.locator('li')).toHaveCount(4);
    await expect(block).toContainText(/800ms to 300ms/);
  });

  test('all six roles are listed, each with a date range', async ({ page }) => {
    await expect(page.locator('.print-cv .pc-role')).toHaveCount(6);
    await expect(page.locator('.print-cv .pc-role-dates')).toHaveCount(6);
    await expect(page.locator('.print-cv')).toContainText('2022 – 2026');
  });

  test('never prints the literal string null', async ({ page }) => {
    await expect(page.locator('.print-cv')).not.toContainText('null');
    await expect(page.locator('.print-cv')).not.toContainText('undefined');
  });

  test('screen sections are hidden when printing', async ({ page }) => {
    await expect(page.locator('.hero')).toBeHidden();
    await expect(page.locator('#cases-heading')).toBeHidden();
    await expect(page.locator('.skip-link')).toBeHidden();
  });

  test('certifications and education are present', async ({ page }) => {
    await expect(page.locator('.print-cv .pc-cert')).toHaveCount(9);
    await expect(page.locator('.print-cv')).toContainText('English, Japanese');
  });

  test('produces a PDF of two pages or fewer', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'PDF generation is Chromium-only');
    const pdf = await page.pdf({ format: 'A4', printBackground: false });
    const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
    expect(pages).toBeGreaterThan(0);
    expect(pages).toBeLessThanOrEqual(2);
  });
});

test('the print document is hidden on screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.print-cv')).toBeHidden();
});
