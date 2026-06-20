import { describe, expect, it, vi } from "vitest";

import {
  DEMO_AUTH_STORAGE_KEY,
  isDemoAuthenticated,
  signInDemo,
  signOutDemo,
} from "@/lib/demo-auth";

describe("demo authentication storage", () => {
  it("reports signed-out when the storage marker is missing", () => {
    const storage = {
      getItem: vi.fn(() => null),
    };

    expect(isDemoAuthenticated(storage)).toBe(false);
    expect(storage.getItem).toHaveBeenCalledWith(DEMO_AUTH_STORAGE_KEY);
  });

  it("reports signed-in only for the expected storage marker", () => {
    const storage = {
      getItem: vi.fn(() => "authenticated"),
    };

    expect(isDemoAuthenticated(storage)).toBe(true);
  });

  it("writes and removes the authentication marker", () => {
    const storage = {
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    signInDemo(storage);
    signOutDemo(storage);

    expect(storage.setItem).toHaveBeenCalledWith(
      DEMO_AUTH_STORAGE_KEY,
      "authenticated",
    );
    expect(storage.removeItem).toHaveBeenCalledWith(DEMO_AUTH_STORAGE_KEY);
  });
});
