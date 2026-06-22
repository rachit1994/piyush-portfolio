import type { NextConfig } from "next";

const basePath = process.env.PAGES_BASE_PATH ?? "";

if (basePath && !basePath.startsWith("/")) {
  throw new Error("PAGES_BASE_PATH must be empty or begin with '/'.");
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
