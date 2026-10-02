import { test, expect } from '@playwright/test';

test('Login page loads and validates', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toHaveText('تسجيل الدخول');
  
  // Submit empty form
  await page.click('button[type="submit"]');
  
  // Check validation messages
  await expect(page.getByText('اسم المستخدم مطلوب')).toBeVisible();
  await expect(page.getByText('كلمة المرور مطلوبة')).toBeVisible();
});
