import { test, expect } from '@playwright/test';

test('Unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/login/);
});
