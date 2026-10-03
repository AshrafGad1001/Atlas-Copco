import { test, expect } from '@playwright/test';

test('Unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/login/);
});

test('Spoofed token with admin role but invalid signature is rejected', async ({ page }) => {
  await page.context().addCookies([{
    name: 'token',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVkYmY1ZDk4MzFiMWY5ZDcxMjM0NSIsInJvbGUiOiJhZG1pbiIsInR2IjowLCJpYXQiOjE2MjkyMTIzNDUsImV4cCI6MTkyOTIxMjM0NX0.invalidsignature',
    url: `http://localhost:3000`,
        httpOnly: false,
    secure: false
  }]);

  await page.goto('http://localhost:3000/admin/dashboard');
  
  await page.context().clearCookies();
  await page.waitForURL('**/login');
  await expect(page.locator(`form`)).toBeVisible();
});
