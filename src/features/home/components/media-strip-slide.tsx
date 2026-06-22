import Image from "next/image";

import type { HomeCategory } from "@/features/home/home-data";

type MediaStripSlideProps = {
  category: HomeCategory;
};

export function MediaStripSlide({ category }: MediaStripSlideProps) {
  return (
    <figure className="media-strip-item">
      <Image
        alt={`${category.label} photography category`}
        className="media-strip-image"
        fill
        sizes="(max-width: 800px) 72vw, 28vw"
        src={category.image}
      />
      <figcaption className="media-strip-caption">{category.label}</figcaption>
    </figure>
  );
}
