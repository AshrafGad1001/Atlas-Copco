import { test, expect } from '@playwright/test';

test('Admin login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'Admin12345');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.locator('text=لوحة التحكم').first()).toBeVisible();
});
