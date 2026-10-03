
import { test, expect } from "@playwright/test";

test("Unauthenticated user is redirected to login", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/.*\/login/);
});

test("Spoofed token with admin role but invalid signature is rejected", async ({ page }) => {
  await page.context().addCookies([{
    name: "token",
    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ3ODA2ZjRjZjAxYWJiYTNmYTBiMTA4ZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxOTU5NDMwMCwiZXhwIjoxNzE5NjgxMTAwfQ.Inval1dSignatur3_DoNotAccept",
    url: "http://localhost:3000",
    httpOnly: false,
    secure: false,
    sameSite: "Lax"
  }]);

  await page.goto("http://localhost:3000/admin/dashboard");
  await page.waitForURL("**/login?session=expired");
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/.*\/login\?session=expired/);
});

test("Valid token invalidated via API causes redirect loop break", async ({ page, request }) => {
  const adminRes = await request.post("http://localhost:5000/api/auth/login", {
    data: { username: "admin", password: "Admin12345" }
  });
  const adminCookies = adminRes.headers()["set-cookie"];
  
  await page.goto("/login");
  await page.fill("input[type=\"text\"]", "ashraf123");
  await page.fill("input[type=\"password\"]", "password@123");
  await page.click("button[type=\"submit\"]");
  await page.waitForURL("**/engineer/profile");
  
  const usersRes = await request.get("http://localhost:5000/api/users", {
    headers: { Cookie: adminCookies }
  });
  const users = await usersRes.json();
  const eng = users.data.find((u: any) => u.username === "ashraf123");
  
  await request.put(`http://localhost:5000/api/users/${eng._id}`, {
    headers: { Cookie: adminCookies },
    data: { ...eng, password: "newPassword123" }
  });
  
  await page.goto("/engineer/profile");
  await page.waitForURL("**/login?session=expired");
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/.*\/login\?session=expired/);
  await expect(page.locator("text=????? ??????? ???? ?????? ?? ????").first()).toBeVisible();
});
