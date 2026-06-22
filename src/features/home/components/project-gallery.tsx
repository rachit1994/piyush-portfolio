import Image from "next/image";

type ProjectGalleryProps = {
  image: string;
  name: string;
};

export function ProjectGallery({ image, name }: ProjectGalleryProps) {
  return (
    <div className="project-gallery">
      {[0, 1, 2].map((item) => (
        <figure className={`project-image project-image-${item}`} key={item}>
          <Image
            alt={`${name} case study view ${item + 1}`}
            fill
            sizes="(max-width: 800px) 100vw, 32vw"
            src={image}
          />
        </figure>
      ))}
    </div>
  );
}
