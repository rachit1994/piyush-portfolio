import {
  buildCategorySrc,
  buildCategorySrcSet,
  categoryImageSizes,
} from "@/features/home/lib/category-image-srcset";

type MediaStripImageProps = {
  source: string;
  alt: string;
  priority?: boolean;
};

export function MediaStripImage({
  source,
  alt,
  priority = false,
}: MediaStripImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-sized responsive asset (Cloudflare edge when configured), not next/image in a static export
    <img
      alt={alt}
      className="media-strip-image"
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
      sizes={categoryImageSizes}
      src={buildCategorySrc(source)}
      srcSet={buildCategorySrcSet(source)}
    />
  );
}
