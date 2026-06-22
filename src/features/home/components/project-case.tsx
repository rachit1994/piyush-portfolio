import { categoryColors } from "@/features/home/home-data";
import { ProjectGallery } from "@/features/home/components/project-gallery";
import { Pill } from "@/shared/ui";

type ProjectCaseProps = {
  image: string;
  name: string;
  summary: string;
  tags: readonly string[];
};

export function ProjectCase({ image, name, summary, tags }: ProjectCaseProps) {
  return (
    <article className="project-case">
      <div className="project-meta">
        <div>
          <h3>{name}</h3>
          <div className="pill-row">
            {tags.map((tag) => (
              <Pill dot={categoryColors[tag]} key={tag}>
                {tag}
              </Pill>
            ))}
          </div>
        </div>
        <p>{summary}</p>
      </div>
      <ProjectGallery image={image} name={name} />
    </article>
  );
}
