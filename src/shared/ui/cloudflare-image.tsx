import { buildTransformUrl } from "@/shared/cloudflare/build-transform-url";

const WIDTHS = [480, 768, 1200, 1920];
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";

type CloudflareImageProps = {
  source: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

/**
 * Edge-optimized image. Emits a small fixed srcset (4 widths) to stay under
 * the free 5,000 unique-transform budget, with format=auto for AVIF/WebP.
 */
export function CloudflareImage({
  source,
  alt,
  width,
  height,
  sizes = "100vw",
  priority = false,
}: CloudflareImageProps) {
  const srcSet = WIDTHS.map(
    (w) =>
      `${buildTransformUrl(MEDIA_BASE, source, { width: w, quality: 80 })} ${w}w`,
  ).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element -- export build optimizes at Cloudflare, not next/image
    <img
      alt={alt}
      src={buildTransformUrl(MEDIA_BASE, source, { width: 1200, quality: 80 })}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
