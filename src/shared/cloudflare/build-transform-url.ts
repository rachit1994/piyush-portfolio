export type TransformFormat = "auto" | "avif" | "webp";

export type TransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: TransformFormat;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
};

function serializeOptions(options: TransformOptions): string {
  const parts: string[] = [];
  if (options.width) parts.push(`width=${options.width}`);
  if (options.height) parts.push(`height=${options.height}`);
  if (options.quality) parts.push(`quality=${options.quality}`);
  parts.push(`format=${options.format ?? "auto"}`);
  if (options.fit) parts.push(`fit=${options.fit}`);
  return parts.join(",");
}

/**
 * Build a Cloudflare image-transformation URL. Optimization happens at the
 * edge because the static export cannot use the next/image optimizer. `source`
 * is an R2 object key or an absolute URL; `mediaBaseUrl` is the
 * Cloudflare-proxied media domain (required — transforms do not work on
 * *.pages.dev). At least one option is always emitted (format=auto).
 */
export function buildTransformUrl(
  mediaBaseUrl: string,
  source: string,
  options: TransformOptions = {},
): string {
  const base = mediaBaseUrl.replace(/\/$/, "");
  const target = /^https?:\/\//.test(source)
    ? source
    : source.replace(/^\//, "");
  return `${base}/cdn-cgi/image/${serializeOptions(options)}/${target}`;
}
