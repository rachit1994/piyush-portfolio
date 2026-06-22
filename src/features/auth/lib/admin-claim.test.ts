import { describe, expect, it } from "vitest";

import { isAdminToken, readRoleFromToken } from "./admin-claim";

function tokenWith(claims: Record<string, unknown>): string {
  const body = btoa(JSON.stringify(claims))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `header.${body}.signature`;
}

describe("admin-claim", () => {
  it("reads an admin role claim from the token", () => {
    expect(readRoleFromToken(tokenWith({ user_role: "admin" }))).toBe("admin");
    expect(isAdminToken(tokenWith({ user_role: "admin" }))).toBe(true);
  });

  it("treats a missing or non-admin claim as not admin", () => {
    expect(readRoleFromToken(tokenWith({ sub: "x" }))).toBeNull();
    expect(isAdminToken(tokenWith({ user_role: "viewer" }))).toBe(false);
  });

  it("handles undefined and malformed tokens", () => {
    expect(readRoleFromToken(undefined)).toBeNull();
    expect(isAdminToken("not-a-jwt")).toBe(false);
  });
});
