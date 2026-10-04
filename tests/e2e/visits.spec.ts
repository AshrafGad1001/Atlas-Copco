import { test, expect } from '@playwright/test';

test.describe('Visits and Regions Isolation', () => {
  let companyId: string;
  let companyName = `Test Company ${Date.now()}`;

  test('Engineer creates visit with attendees and verifies isolation', async ({ browser, request }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    // 1. eng1 logs in
    await page1.goto('http://localhost:3000/login');
    await page1.fill('input[type="text"]', 'visitEng');
    await page1.fill('input[type="password"]', 'password@123');
    await page1.click('button[type="submit"]');
    await expect(page1).toHaveURL(/\/engineer/);
    await page1.goto('http://localhost:3000/engineer/visits');

    // companyName is already defined at top as 'Test Company 1'
    const companyName = 'Test Company 1';
    
    // 3. eng1 adds a visit
    // Wait, get company ID
    const cookies1 = await context1.cookies();
    const token1 = cookies1.find(c => c.name === 'token');
    const companiesRes = await page1.request.get('http://localhost:5000/api/companies', { headers: { Cookie: `token=${token1?.value}` } });
    const companiesData = await companiesRes.json();
    console.log("COMPANIES DATA:", companiesData);
    companyId = companiesData.data?.companies?.[0]?._id || companiesData.data?.[0]?._id;
    await page1.goto('http://localhost:3000/engineer/visits/new');
    await page1.waitForSelector('text=تسجيل زيارة جديدة');
    // Select company
    await page1.getByLabel('الشركة').click();
    await page1.getByRole('option', { name: companyName }).click();
    
    // Fill notes
    await page1.getByLabel('ملاحظات الزيارة').fill('Test notes from eng1');
    
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
    await page2.fill('input[type="text"]', 'eng2');
    await page2.fill('input[type="password"]', 'password@123');
    await page2.click('button[type="submit"]');
    await page2.waitForURL('**/engineer/profile');
    await page2.goto('http://localhost:3000/engineer/visits');

    // 5. eng2 verifies they cannot see the company or visit
    // The visit table should not have companyName
    await expect(page2.locator('td', { hasText: companyName })).not.toBeVisible();
    
    const cookies2 = await context2.cookies();
    const tokenCookie2 = cookies2.find(c => c.name === 'token');
    
    // eng2 trying to fetch company attendees/history directly
    const attendeesRes = await page2.request.get(`http://localhost:5000/api/companies/${companyId}/attendees`, {
      headers: { 'Cookie': `token=${tokenCookie2?.value}` }
    });
    expect(attendeesRes.status()).toBe(403);
    
    const historyRes = await page2.request.get(`http://localhost:5000/api/companies/${companyId}/history`, {
      headers: { 'Cookie': `token=${tokenCookie2?.value}` }
    });
    expect(historyRes.status()).toBe(403);

    await context2.close();
  });
});
