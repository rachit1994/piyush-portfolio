import { ProjectCase } from "@/features/home/components/project-case";
import { projects } from "@/features/home/home-data";

export function WorkSection() {
  return (
    <section className="work-section" id="work">
      <h2>
        Here&apos;s what the <em>shortcut</em> looks like.
      </h2>
      {projects.map((project) => (
        <ProjectCase {...project} key={project.name} />
      ))}
    </section>
  );
}
