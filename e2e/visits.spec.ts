import { test, expect } from '@playwright/test';

test.describe('Visits and Regions Isolation', () => {
  let companyId: string;
  let companyName = `Test Company ${Date.now()}`;

  test('Engineer creates visit with attendees and verifies isolation', async ({ browser, request }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    // 1. eng1 logs in
    await page1.goto('http://localhost:3000/login');
    await page1.fill('input[name="username"]', 'eng1');
    await page1.fill('input[name="password"]', 'password123');
    await page1.click('button[type="submit"]');
    await page1.waitForURL('**/engineer/visits');

    // 2. eng1 adds a company using API (since no UI for companies is built yet)
    // Wait, Playwright context has the cookies! We can use page1.request
    const createCompanyRes = await page1.request.post('http://localhost:5000/api/companies', {
      data: {
        name: companyName,
      }
    });
    expect(createCompanyRes.ok()).toBeTruthy();
    const companyData = await createCompanyRes.json();
    companyId = companyData.data._id;

    // 3. eng1 adds a visit
    await page1.goto('http://localhost:3000/engineer/visits/new');
    await page1.waitForSelector('text=تسجيل زيارة جديدة');
    
    // Select company
    await page1.click('div[role="combobox"]:has-text("الشركة")');
    await page1.click(`li[role="option"]:has-text("${companyName}")`);
    
    // Fill notes
    await page1.fill('textarea:has-text("ملاحظات")', 'Test notes from eng1');
    
    // Add attendees
    await page1.click('button:has-text("إضافة شخص")');
    const names = page1.getByLabel('الاسم');
    const titles = page1.getByLabel('المسمى الوظيفي');
    const phones = page1.getByLabel('الموبايل');
    
    await names.nth(0).fill('Ahmed');
    await titles.nth(0).fill('Manager');
    await phones.nth(0).fill('01011111111');

    await page1.click('button:has-text("إضافة شخص")');
    
    await names.nth(1).fill('Mohamed');
    await titles.nth(1).fill('Engineer');
    await phones.nth(1).fill('01022222222');

    // Submit
    await page1.click('button:has-text("حفظ الزيارة")');
    
    // Wait for redirect to visits list
    await page1.waitForURL('**/engineer/visits');
    await expect(page1.locator('td', { hasText: companyName })).toBeVisible();
    await expect(page1.locator('td', { hasText: 'Ahmed (+1)' })).toBeVisible();
    
    await context1.close();

    // 4. eng2 logs in
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    
    await page2.goto('http://localhost:3000/login');
    await page2.fill('input[name="username"]', 'eng2');
    await page2.fill('input[name="password"]', 'password123');
    await page2.click('button[type="submit"]');
    await page2.waitForURL('**/engineer/visits');

    // 5. eng2 verifies they cannot see the company or visit
    // The visit table should not have companyName
    await expect(page2.locator('td', { hasText: companyName })).not.toBeVisible();
    
    // eng2 trying to fetch company attendees/history directly
    const attendeesRes = await page2.request.get(`http://localhost:5000/api/companies/${companyId}/attendees`);
    expect(attendeesRes.status()).toBe(403);
    
    const historyRes = await page2.request.get(`http://localhost:5000/api/companies/${companyId}/history`);
    expect(historyRes.status()).toBe(403);

    await context2.close();
  });
});
