import { test, expect } from '@playwright/test';

test('Engineer login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="text"]', 'ashraf123');
  await page.fill('input[type="password"]', 'password@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/engineer/);
  await expect(page.getByTestId('engineer-home-page')).toBeVisible();
});
