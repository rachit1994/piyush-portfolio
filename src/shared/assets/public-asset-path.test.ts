import { afterEach, describe, expect, it, vi } from "vitest";

describe("publicAssetPath", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("prefixes paths when a base path is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/piyush-portfolio");
    const { publicAssetPath } = await import("./public-asset-path");
    expect(publicAssetPath("/media/home-page-categories/fashion.webp")).toBe(
      "/piyush-portfolio/media/home-page-categories/fashion.webp",
    );
  });

  it("leaves paths unchanged for local root hosting", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    const { publicAssetPath } = await import("./public-asset-path");
    expect(publicAssetPath("/media/home-page-categories/fashion.webp")).toBe(
      "/media/home-page-categories/fashion.webp",
    );
  });
});
