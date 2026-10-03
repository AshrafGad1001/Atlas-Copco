import { test, expect } from "@playwright/test";
import * as path from "path";
const exceljs = require("exceljs");

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
    await expect(page.locator("text=\u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629")).not.toBeVisible();

    // Search without Hamza using standard locator
    await page.locator("input[type=\"text\"]").first().fill("\u0634\u0631\u0643\u0629 \u0627\u062d\u0645\u062f"); // شركة احمد
    
    // Check if it exists in table
    await expect(page.locator("td", { hasText: "\u0634\u0631\u0643\u0629 \u0623\u062d\u0645\u062f" })).toBeVisible();
  });

  test("E2) Engineer adds similar company, accepts dialog, then tries duplicate and rejected", async ({ page }) => {
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
    await expect(page.locator("text=\u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629")).not.toBeVisible();

    // Add similar company
    const similarName = "\u0627\u0644\u0645\u062a\u062d\u062f\u0629 \u0644\u0644\u0628\u0646\u0627"; // المتحدة للبنا
    await page.click("button[data-testid=\"add-company-btn\"]");
    await page.fill("input[name=\"nameAr\"]", similarName);
    await page.click("button:has-text(\"\u062d\u0641\u0638\")");
    
    // Expect similar dialog
    await expect(page.getByTestId("similar-dialog")).toBeVisible();
    await page.getByTestId("similar-confirm").click();
    await expect(page.getByTestId("similar-dialog")).not.toBeVisible();
    await expect(page.locator("text=\u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629")).not.toBeVisible();

    // Try EXACT duplicate
    await page.click("button[data-testid=\"add-company-btn\"]");
    await page.fill("input[name=\"nameAr\"]", similarName);
    await page.click("button:has-text(\"\u062d\u0641\u0638\")");
    
    // Expect duplicate error alert without dialog
    await expect(page.getByTestId("duplicate-error")).toBeVisible();
  });

  test("E3) Admin imports excel file, previews toast", async ({ page }) => {
    // Generate excel in memory buffer
    const wb = new exceljs.Workbook();
    const ws = wb.addWorksheet("Sheet1");
    ws.addRow(["nameAr", "nameEn", "region", "address", "industry", "notes"]);
    ws.addRow(["New Excel Comp", "", "الشرقية", "Addr", "Ind", "Note"]); // Added valid region name
    const buffer = await wb.xlsx.writeBuffer();

    await page.goto("/login");
    await page.fill("input[type=\"text\"]", "admin");
    await page.fill("input[type=\"password\"]", "Admin12345");
    await page.click("button[type=\"submit\"]");
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    await page.goto("/admin/companies");
    
    // Open import modal
    await page.locator("button", { hasText: "Excel" }).click();
    
    // Upload file using object
    await page.locator("input[type=\"file\"]").setInputFiles({
      name: "companies.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: Buffer.from(buffer)
    });
    
    // Click preview
    await page.getByRole("dialog").locator("button", { hasText: "\u0645\u0639\u0627\u064a\u0646\u0629" }).click();
    
    // Wait for preview
    await expect(page.getByTestId("import-preview")).toBeVisible();

    // Setup dialog listener for the alert (since we used alert() in F5)
    let alertMessage = "";
    page.on("dialog", async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Click confirm
    await page.getByRole("dialog").locator("button", { hasText: "\u062a\u0623\u0643\u064a\u062f" }).click();

    // Wait for modal to close
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
