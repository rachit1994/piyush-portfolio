import { describe, expect, it, vi } from "vitest";

import { readTheme, writeTheme } from "@/features/theme";

describe("theme storage", () => {
  it("uses light when storage has no valid theme", () => {
    const storage = { getItem: vi.fn(() => null) };

    expect(readTheme(storage)).toBe("light");
  });

  it("reads and writes a valid dark theme", () => {
    const reader = { getItem: vi.fn(() => "dark") };
    const writer = { setItem: vi.fn() };

    expect(readTheme(reader)).toBe("dark");
    writeTheme("dark", writer);
    expect(writer.setItem).toHaveBeenCalledWith("piyush-theme", "dark");
  });
});
