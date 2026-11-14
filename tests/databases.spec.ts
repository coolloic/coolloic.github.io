import { test, expect } from '@playwright/test';

test('data skills list Oracle, IBM Db2, MySQL and SQL Server', async ({ page }) => {
  await page.goto('/');
  const skills = page.locator('section[aria-labelledby="skills-heading"]');
  for (const db of ['Oracle', 'IBM Db2', 'MySQL', 'SQL Server']) {
    await expect(skills.getByText(db, { exact: true })).toBeVisible();
  }
});
