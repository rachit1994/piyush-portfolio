import { buildTransformUrl } from "@/shared/cloudflare/build-transform-url";

// Today (GitHub Pages) we serve pre-generated widths from `r/`; once
// NEXT_PUBLIC_MEDIA_BASE_URL points at the Cloudflare media domain the same
// component resizes at the edge instead. Slots are ~28vw desktop / ~72vw mobile.
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";
const WIDTHS = [480, 800, 1080] as const;

export const categoryImageSizes = "(max-width: 809px) 72vw, 28vw";

function localVariant(source: string, width: number) {
  if (width >= 1080) return source;
  const slash = source.lastIndexOf("/");
  const dot = source.lastIndexOf(".");
  const base = source.slice(slash + 1, dot);
  return `${source.slice(0, slash)}/r/${base}-${width}${source.slice(dot)}`;
}

function variantUrl(source: string, width: number) {
  return MEDIA_BASE
    ? buildTransformUrl(MEDIA_BASE, source, { width, quality: 78 })
    : localVariant(source, width);
}

export function buildCategorySrc(source: string) {
  return variantUrl(source, 800);
}

export function buildCategorySrcSet(source: string) {
  return WIDTHS.map((width) => `${variantUrl(source, width)} ${width}w`).join(
    ", ",
  );
}
