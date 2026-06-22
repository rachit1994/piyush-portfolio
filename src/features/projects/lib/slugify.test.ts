import { describe, expect, it } from "vitest";

import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Spring Wedding Shoot")).toBe("spring-wedding-shoot");
  });

  it("strips punctuation and accents", () => {
    expect(slugify("Café & Co.")).toBe("cafe-co");
  });

  it("collapses repeats and trims edge hyphens", () => {
    expect(slugify("  Hello---World!!  ")).toBe("hello-world");
  });

  it("returns empty string for symbol-only input", () => {
    expect(slugify("***")).toBe("");
  });
});
