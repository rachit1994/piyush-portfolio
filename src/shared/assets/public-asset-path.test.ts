import { afterEach, describe, expect, it, vi } from "vitest";

describe("publicAssetPath", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("prefixes paths when a base path is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/piyush-portfolio");
    const { publicAssetPath } = await import("./public-asset-path");
    expect(publicAssetPath("/media/northstar.jpg")).toBe(
      "/piyush-portfolio/media/northstar.jpg",
    );
  });

  it("leaves paths unchanged for local root hosting", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    const { publicAssetPath } = await import("./public-asset-path");
    expect(publicAssetPath("/media/northstar.jpg")).toBe(
      "/media/northstar.jpg",
    );
  });
});
