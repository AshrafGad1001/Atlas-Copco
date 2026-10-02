import { test, expect } from '@playwright/test';

test('Engineer login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="text"]', 'ashraf123');
  await page.fill('input[type="password"]', 'password@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/engineer\/profile/);
  await expect(page.locator('text=الملف الشخصي').first()).toBeVisible();
});
