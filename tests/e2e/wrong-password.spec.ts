import { test, expect } from '@playwright/test';

test('Login fails with wrong password', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'WrongPass123');
  await page.click('button[type="submit"]');
  await expect(page.getByTestId('login-error')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});
