import { test, expect } from '@playwright/test';

test('Login page loads and validates', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toBeVisible();

  // Submit empty form: stays on /login and fields are flagged invalid
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('input[type="text"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('input[type="password"]')).toHaveAttribute('aria-invalid', 'true');
});
