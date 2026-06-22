import type { HomeCategory } from "@/features/home/home-data";

import { MediaStripImage } from "./media-strip-image";

type MediaStripSlideProps = {
  category: HomeCategory;
  priority?: boolean;
};

export function MediaStripSlide({ category, priority }: MediaStripSlideProps) {
  return (
    <figure className="media-strip-item">
      <MediaStripImage
        alt={`${category.label} photography category`}
        priority={priority}
        source={category.image}
      />
      <figcaption className="media-strip-caption">{category.label}</figcaption>
    </figure>
  );
}
