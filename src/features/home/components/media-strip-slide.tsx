import Image from "next/image";

import type { projects } from "@/features/home/home-data";

type MediaStripProject = (typeof projects)[number];

type MediaStripSlideProps = {
  index: number;
  project: MediaStripProject;
};

export function MediaStripSlide({ index, project }: MediaStripSlideProps) {
  return (
    <figure className={`media-strip-item media-strip-${index}`}>
      <Image
        alt={`${project.name} identity preview`}
        className="media-strip-image"
        fill
        sizes="(max-width: 800px) 75vw, 28vw"
        src={project.image}
      />
    </figure>
  );
}
