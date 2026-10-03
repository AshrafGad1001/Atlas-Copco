import { test, expect } from '@playwright/test';

test('Logout successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="text"]', 'ashraf123');
  await page.fill('input[type="password"]', 'password@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/engineer\/profile/);
  await expect(page.getByTestId('engineer-profile-page')).toBeVisible();

  // Logout is the last item of the permanent drawer
  await page.locator('.MuiDrawer-docked .MuiListItemButton-root').last().click();
  await expect(page).toHaveURL(/\/login/);

  // Cannot go back to a protected page
  await page.goto('/engineer/profile');
  await expect(page).toHaveURL(/\/login/);
});
