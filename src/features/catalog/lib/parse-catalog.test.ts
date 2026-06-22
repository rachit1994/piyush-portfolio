import { describe, expect, it } from "vitest";

import { CATALOG_VERSION } from "./catalog-types";
import { parseCatalog } from "./parse-catalog";

const valid = {
  version: CATALOG_VERSION,
  publishedAt: "2026-06-20T00:00:00.000Z",
  categories: [{ slug: "weddings", title: "Weddings", kind: "photography" }],
  projects: [
    {
      slug: "a",
      title: "A",
      categories: ["weddings"],
      featured: false,
      media: [],
    },
  ],
};

describe("parseCatalog", () => {
  it("accepts a well-formed catalog", () => {
    expect(parseCatalog(valid)).toEqual(valid);
  });

  it("rejects a mismatched version", () => {
    expect(parseCatalog({ ...valid, version: 99 })).toBeNull();
  });

  it("rejects non-object input", () => {
    expect(parseCatalog("nope")).toBeNull();
  });

  it("rejects a project missing required fields", () => {
    expect(
      parseCatalog({ ...valid, projects: [{ title: "no slug" }] }),
    ).toBeNull();
  });
});
