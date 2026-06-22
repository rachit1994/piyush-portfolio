import { describe, expect, it, vi } from "vitest";

import { readTheme, writeTheme } from "@/features/theme";

describe("theme storage", () => {
  it("uses dark when storage has no saved theme", () => {
    const storage = { getItem: vi.fn(() => null) };

    expect(readTheme(storage)).toBe("dark");
  });

  it("reads and writes a valid light theme", () => {
    const reader = { getItem: vi.fn(() => "light") };
    const writer = { setItem: vi.fn() };

    expect(readTheme(reader)).toBe("light");
    writeTheme("light", writer);
    expect(writer.setItem).toHaveBeenCalledWith("piyush-theme", "light");
  });

  it("reads and writes a valid dark theme", () => {
    const reader = { getItem: vi.fn(() => "dark") };
    const writer = { setItem: vi.fn() };

    expect(readTheme(reader)).toBe("dark");
    writeTheme("dark", writer);
    expect(writer.setItem).toHaveBeenCalledWith("piyush-theme", "dark");
  });
});
