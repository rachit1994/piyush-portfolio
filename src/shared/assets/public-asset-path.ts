const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicAssetPath(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error("Public asset paths must start with '/'.");
  }
  return `${basePath}${path}`;
}
