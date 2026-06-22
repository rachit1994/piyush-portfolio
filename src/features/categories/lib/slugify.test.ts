import { describe, expect, it } from "vitest";

import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and turns spaces into dashes", () => {
    expect(slugify("Wedding Films")).toBe("wedding-films");
  });

  it("strips characters outside [a-z0-9-]", () => {
    expect(slugify("Brand & Co. 2026!")).toBe("brand-co-2026");
  });

  it("collapses repeated dashes and trims edges", () => {
    expect(slugify("  --Studio   Portraits--  ")).toBe("studio-portraits");
  });

  it("returns an empty string when nothing remains", () => {
    expect(slugify("***")).toBe("");
  });
});
