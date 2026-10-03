import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test.describe("Companies Module E2E", () => {
  test("E1) Engineer searches with Arabic variation without hamza", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[type=\"text\"]", "ashraf123");
    await page.fill("input[type=\"password\"]", "password@123");
    await page.click("button[type=\"submit\"]");
    await expect(page).toHaveURL(/\/engineer\/profile/);

    await page.goto("/engineer/companies");
    
    // Add company with Hamza
    await page.click("button[data-testid=\"add-company-btn\"]");
    await page.fill("input[name=\"nameAr\"]", "\u0634\u0631\u0643\u0629 \u0623\u062d\u0645\u062f"); // شركة أحمد
    await page.click("button:has-text(\"\u062d\u0641\u0638\")");
    
    // Wait for modal to close
    await expect(page.locator("text=\u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629")).not.toBeVisible({ timeout: 10000 });

    // Search without Hamza using standard locator
    await page.locator("input[type=\"text\"]").first().fill("\u0634\u0631\u0643\u0629 \u0627\u062d\u0645\u062f"); // شركة احمد
    
    // Check if it exists in table
    await page.waitForTimeout(1000); // Wait for debounce
    await expect(page.locator("td:has-text(\"\u0634\u0631\u0643\u0629 \u0623\u062d\u0645\u062f\")")).toBeVisible();
  });

  test("E2) Engineer adds similar company, accepts dialog, then tries duplicate and rejected", async ({ page }) => {
    page.on("dialog", async (d) => { await d.accept(); }); // ACCEPT ALERTS!

    await page.goto("/login");
    await page.fill("input[type=\"text\"]", "ashraf123");
    await page.fill("input[type=\"password\"]", "password@123");
    await page.click("button[type=\"submit\"]");
    await expect(page).toHaveURL(/\/engineer\/profile/);

    await page.goto("/engineer/companies");

    // Add initial company
    const compName = "\u0627\u0644\u0645\u062a\u062d\u062f\u0629 \u0644\u0644\u0628\u0646\u0627\u0621"; // المتحدة للبناء
    await page.click("button[data-testid=\"add-company-btn\"]");
    await page.fill("input[name=\"nameAr\"]", compName);
    await page.click("button:has-text(\"\u062d\u0641\u0638\")");
    await expect(page.locator("text=\u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629")).not.toBeVisible({ timeout: 10000 });

    // Add similar company
    const similarName = "\u0627\u0644\u0645\u062a\u062d\u062f\u0629 \u0644\u0644\u0628\u0646\u0627"; // المتحدة للبنا
    await page.click("button[data-testid=\"add-company-btn\"]");
    await page.fill("input[name=\"nameAr\"]", similarName);
    await page.click("button:has-text(\"\u062d\u0641\u0638\")");
    
    // Expect dialog
    await expect(page.locator("button:has-text(\"\u0645\u062a\u0623\u0643\u062f\")")).toBeVisible({ timeout: 10000 });
    await page.click("button:has-text(\"\u0645\u062a\u0623\u0643\u062f\")");
    await expect(page.locator("text=\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0625\u0636\u0627\u0641\u0629")).not.toBeVisible({ timeout: 10000 });

    // Try EXACT duplicate
    await page.click("button[data-testid=\"add-company-btn\"]");
    await page.fill("input[name=\"nameAr\"]", similarName);
    await page.click("button:has-text(\"\u062d\u0641\u0638\")");
    
    // Expect error alert
    await expect(page.locator("text=\u0634\u0631\u0643\u0629 \u0645\u0643\u0631\u0631\u0629")).toBeVisible({ timeout: 10000 });
  });

  test("E3) Admin imports excel file, previews toast", async ({ page }) => {
    // Generate excel
    const testExcelPath = path.join(__dirname, "test_import.xlsx");
    const exceljs = require("exceljs");
    const wb = new exceljs.Workbook();
    const ws = wb.addWorksheet("Sheet1");
    ws.addRow(["nameAr", "nameEn", "region", "address", "industry", "notes"]);
    ws.addRow(["New Excel Comp", "", "Region 1", "Addr", "Ind", "Note"]);
    await wb.xlsx.writeFile(testExcelPath);

    await page.goto("/login");
    await page.fill("input[type=\"text\"]", "admin");
    await page.fill("input[type=\"password\"]", "Admin12345");
    await page.click("button[type=\"submit\"]");
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    await page.goto("/admin/companies");
    
    // Open import modal
    await page.locator("button", { hasText: "Excel" }).click();
    
    // Upload file using input
    await page.locator("input[type=\"file\"]").setInputFiles(testExcelPath);
    
    // Setup dialog listener for the alert (since we used alert() in F5)
    let alertMessage = "";
    page.on("dialog", async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Instead of nth(1), use a more specific selector inside the dialog!
    await page.locator(".MuiDialog-root button", { hasText: "\u0627\u0633\u062a\u064a\u0631\u0627\u062f" }).click({ force: true });
    
    // Wait for import to finish
    await page.waitForTimeout(2000);
    expect(alertMessage).toContain("\u062a\u0645 \u0625\u0636\u0627\u0641\u0629");

    if (fs.existsSync(testExcelPath)) fs.unlinkSync(testExcelPath);
  });
});
