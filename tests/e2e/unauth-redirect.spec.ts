import { test, expect, Page } from '@playwright/test';

const BACKEND = 'http://localhost:5000';
const USER = 'ashraf123';
const PASS = 'password@123';
const TEMP_PASS = 'TempPass@456';

const uiLogin = async (page: Page, username: string, password: string) => {
  await page.goto('/login');
  await page.fill('input[type="text"]', username);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
};

test('Unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/login/);
});

test('Spoofed admin cookie ends on login with no admin content', async ({ page }) => {
  await page.context().addCookies([{
    name: 'token',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ3ODA2ZjRjZjAxYWJiYTNmYTBiMTA4ZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxOTU5NDMwMCwiZXhwIjoxNzE5NjgxMTAwfQ.Inval1dSignatur3_DoNotAccept',
    url: 'http://localhost:3000',
    httpOnly: false,
    secure: false,
    sameSite: 'Lax',
  }]);

  await page.goto('/admin/dashboard');
  await page.waitForURL('**/login?session=expired');
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/\/login\?session=expired/);
  await expect(page.getByTestId('session-expired-alert')).toBeVisible();
  await expect(page.getByTestId('admin-sidebar')).toHaveCount(0);
  await expect(page.getByTestId('admin-stat-card')).toHaveCount(0);
});

test('Real cookie invalidated elsewhere hits login once', async ({ browser }) => {
  // Session A: engineer logs in through the UI
  const ctxA = await browser.newContext();
  const pageA = await ctxA.newPage();
  await uiLogin(pageA, USER, PASS);
  await expect(pageA).toHaveURL(/\/engineer/);
  await expect(pageA.getByTestId('engineer-home-page')).toBeVisible();

  // Session B: same engineer changes password via API -> tokenVersion bump kills session A
  const ctxB = await browser.newContext();
  const loginB = await ctxB.request.post(`${BACKEND}/api/auth/login`, { data: { username: USER, password: PASS } });
  expect(loginB.status()).toBe(200);
  const change = await ctxB.request.put(`${BACKEND}/api/profile/update-password`, {
    data: { oldPassword: PASS, newPassword: TEMP_PASS },
  });
  expect(change.status()).toBe(200);

  // Restore the original password so later tests still work
  const loginB2 = await ctxB.request.post(`${BACKEND}/api/auth/login`, { data: { username: USER, password: TEMP_PASS } });
  expect(loginB2.status()).toBe(200);
  const restore = await ctxB.request.put(`${BACKEND}/api/profile/update-password`, {
    data: { oldPassword: TEMP_PASS, newPassword: PASS },
  });
  expect(restore.status()).toBe(200);
  await ctxB.close();

  // Session A visits a protected page with its now-stale cookie
  const loginHits: string[] = [];
  pageA.on('framenavigated', (frame) => {
    if (frame === pageA.mainFrame() && new URL(frame.url()).pathname === '/login') loginHits.push(frame.url());
  });
  await pageA.goto('/engineer');
  await pageA.waitForURL('**/login?session=expired');
  await pageA.waitForTimeout(3000);
  await expect(pageA).toHaveURL(/\/login\?session=expired/);
  await expect(pageA.getByTestId('session-expired-alert')).toBeVisible();
  expect(loginHits.length).toBe(1);
  await ctxA.close();
});
