import { expect, test } from "@playwright/test";

import { loginAsAdmin } from "./fixtures/admin-session";

test.describe("admin dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("an admin session reaches the dashboard with navigation", async ({
    page,
  }) => {
    await page.goto("/admin/");
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
    const nav = page.getByRole("navigation", { name: "Admin" });
    for (const label of ["Categories", "Media", "Projects", "Settings"]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("an admin can open the settings panel and see its fields", async ({
    page,
  }) => {
    await page.goto("/admin/");
    await page
      .getByRole("navigation", { name: "Admin" })
      .getByRole("link", { name: "Settings" })
      .click();
    await expect(page).toHaveURL(/\/admin\/settings/);
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await expect(page.getByLabel("Agency name")).toBeVisible();
  });
});
