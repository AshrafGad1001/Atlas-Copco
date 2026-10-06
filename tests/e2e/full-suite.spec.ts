import { test, expect } from '@playwright/test';

test.describe.serial('Full Playwright E2E Suite', () => {
  const ts = Date.now();
  const engUser = `eng_${ts}`;
  const compName1 = `Comp1_${ts}`;
  const compName2 = `Comp2_${ts}`;

  test('E1: Engineer login and sees Dashboard', async ({ page }) => {
    // Assuming we have a seed user or we rely on E7 later.
    // For now we use the default 'enga' / 'password123'
    await page.goto('/login');
    await page.fill('input[name="username"]', 'enga');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/engineer/);
    await expect(page.locator('text=ملخص الزيارات')).toBeVisible();
  });

  test('E2: Engineer tries to access /admin and redirects to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('E3: Add new company', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'enga');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('text=الشركات');
    await page.click('text=إضافة شركة');
    await page.fill('input[name="nameAr"]', compName1);
    await page.fill('input[name="nameEn"]', compName1);
    await page.click('button[type="submit"]');
    await expect(page.locator(`text=${compName1}`).first()).toBeVisible();
  });

  test('E4: Add visit to the company', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'enga');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('text=الزيارات');
    await page.click('text=إضافة زيارة');
    await page.selectOption('select[name="company"]', { label: compName1 });
    await page.fill('input[name="visitDate"]', new Date().toISOString().split('T')[0]);
    await page.selectOption('select[name="type"]', 'planned');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=تمت إضافة الزيارة بنجاح')).toBeVisible();
  });

  test('E5: Export CSV from Dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'enga');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Make sure data-testid="export-csv-btn" is added to the button in the dashboard!
    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-testid="export-csv-btn"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/.*\.csv/);
  });

  test('E6: Admin dashboard UI (overview, engineers, recent)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/admin/);

    await expect(page.locator('text=نظرة عامة')).toBeVisible();
    await expect(page.locator('text=أداء المهندسين')).toBeVisible();
    await expect(page.locator('text=أحدث الزيارات')).toBeVisible();
  });

  test('E7: Admin adds a new engineer in Region 1', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('text=المستخدمين');
    await page.click('text=إضافة مستخدم');
    await page.fill('input[name="fullName"]', `Engineer ${ts}`);
    await page.fill('input[name="username"]', engUser);
    await page.fill('input[name="email"]', `${engUser}@test.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.selectOption('select[name="role"]', 'engineer');
    // Assuming Region 1 is the first option
    await page.selectOption('select[name="region"]', { index: 1 });
    await page.click('button[type="submit"]');
    await expect(page.locator(`text=${engUser}`).first()).toBeVisible();
  });

  test('E8: Admin sees Companies and Visits', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('text=الشركات');
    await expect(page.locator('table')).toBeVisible();

    await page.click('text=الزيارات');
    await expect(page.locator('table')).toBeVisible();
  });

  test('E9: Admin changes engineer region to Region 2', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('text=المستخدمين');
    // Click edit on the engineer we just created
    await page.locator(`tr:has-text("${engUser}") >> [data-testid="edit-user-btn"]`).click();
    await page.selectOption('select[name="region"]', { index: 2 });
    await page.click('button[type="submit"]');
    await expect(page.locator('text=تم التحديث')).toBeVisible();
  });

  test('E10: Engineer logins and sees empty companies in Region 2', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', engUser);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('text=الشركات');
    // Should be empty table
    await expect(page.locator('tbody tr')).toHaveCount(0);
  });

  test('E11: Engineer adds new company in Region 2', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', engUser);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('text=الشركات');
    await page.click('text=إضافة شركة');
    await page.fill('input[name="nameAr"]', compName2);
    await page.fill('input[name="nameEn"]', compName2);
    await page.click('button[type="submit"]');
    await expect(page.locator(`text=${compName2}`).first()).toBeVisible();
  });

  test('E12: Admin sees old and new visits in regions', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('text=الزيارات');
    // We expect visits to exist.
    await expect(page.locator('table')).toBeVisible();
  });

  test('E13: Admin merges the new company with old', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('/admin/companies');
    // Click merge on compName2
    await page.locator(`tr:has-text("${compName2}") >> [data-testid="merge-company-btn"]`).click();
    await page.selectOption('select[name="targetCompany"]', { label: compName1 });
    await page.click('button[type="submit"]');
    await expect(page.locator('text=تم دمج الشركة')).toBeVisible();
  });
});
