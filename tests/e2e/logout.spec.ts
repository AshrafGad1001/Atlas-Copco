import { test, expect } from '@playwright/test';

test('Logout successfully', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('input[type="text"]', 'ashraf123');
  await page.fill('input[type="password"]', 'password@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/engineer\/profile/);
  
  // Logout
  await page.locator('text=تسجيل الخروج').first().click();
  await expect(page).toHaveURL(/\/login/);
  // Ensure we can't go back
  await page.goto('/engineer/profile');
  await expect(page).toHaveURL(/\/login/);
});
