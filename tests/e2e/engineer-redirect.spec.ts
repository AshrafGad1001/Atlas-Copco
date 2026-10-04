import { test, expect } from '@playwright/test';

test('Engineer is redirected away from admin routes', async ({ page }) => {
  // Login as engineer
  await page.goto('/login');
  await page.fill('input[type="text"]', 'ashraf123');
  await page.fill('input[type="password"]', 'password@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/engineer/);
  
  // Try admin route
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/engineer/);
});
