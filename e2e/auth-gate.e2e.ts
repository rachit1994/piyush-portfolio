import { expect, test } from "@playwright/test";

// No session in storage, so the client guard must redirect away from the
// dashboard. This needs no Supabase/network mocking — it is the most robust
// guarantee that protected admin content never renders for anonymous users.
test.describe("admin auth gate", () => {
  test("redirects an anonymous visitor from /admin to the login route", async ({
    page,
  }) => {
    await page.goto("/admin/");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(
      page.getByRole("button", { name: /continue with google/i }),
    ).toBeVisible();
    await expect(page.getByText("Dashboard")).toHaveCount(0);
  });
});
