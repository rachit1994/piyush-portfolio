import { describe, expect, it } from "vitest";

import { buildTransformUrl } from "./build-transform-url";

const BASE = "https://media.example.com";

describe("buildTransformUrl", () => {
  it("optimizes a relative R2 key with default auto format", () => {
    expect(
      buildTransformUrl(BASE, "originals/a.jpg", { width: 800, quality: 80 }),
    ).toBe(
      "https://media.example.com/cdn-cgi/image/width=800,quality=80,format=auto/originals/a.jpg",
    );
  });

  it("keeps an absolute source URL intact", () => {
    expect(
      buildTransformUrl(BASE, "https://cdn.test/a.png", { width: 480 }),
    ).toBe(
      "https://media.example.com/cdn-cgi/image/width=480,format=auto/https://cdn.test/a.png",
    );
  });

  it("trims a trailing base slash and a leading key slash", () => {
    expect(buildTransformUrl(`${BASE}/`, "/x.jpg")).toBe(
      "https://media.example.com/cdn-cgi/image/format=auto/x.jpg",
    );
  });
});
