import type { Page } from "@playwright/test";

// supabase-js persists the session in localStorage under sb-<ref>-auth-token.
// With no .env the client falls back to https://placeholder.supabase.co, so the
// ref is "placeholder". We inject a session whose access token decodes to the
// admin role, and stub Supabase REST/auth so no real network is needed.
const STORAGE_KEY = "sb-placeholder-auth-token";

function base64url(value: object): string {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function adminJwt(): string {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const header = base64url({ alg: "none", typ: "JWT" });
  const payload = base64url({
    sub: "test-admin",
    aud: "authenticated",
    user_role: "admin",
    exp,
  });
  return `${header}.${payload}.signature`;
}

function adminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  return {
    access_token: adminJwt(),
    refresh_token: "test-refresh",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: expiresAt,
    user: {
      id: "test-admin",
      aud: "authenticated",
      role: "authenticated",
      app_metadata: {},
      user_metadata: {},
      created_at: "2026-01-01T00:00:00.000Z",
    },
  };
}

export async function loginAsAdmin(page: Page): Promise<void> {
  const value = JSON.stringify(adminSession());
  await page.addInitScript(
    ([key, session]) => window.localStorage.setItem(key, session),
    [STORAGE_KEY, value] as const,
  );
  await page.route("**/auth/v1/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );
  await page.route("**/rest/v1/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
  );
}
