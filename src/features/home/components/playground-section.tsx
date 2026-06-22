import Image from "next/image";

import { projects } from "@/features/home/home-data";

export function PlaygroundSection() {
  return (
    <section className="playground-section" id="playground">
      <div className="playground-grid">
        {[...projects, ...projects].map((project, index) => (
          <figure key={`${project.name}-${index}`}>
            <Image
              alt={`${project.name} visual experiment`}
              fill
              sizes="(max-width: 800px) 44vw, 18vw"
              src={project.image}
            />
          </figure>
        ))}
      </div>
      <h2>
        Piyush <span>Design</span>
        <br />
        Office
      </h2>
      <p>Make the meaning clear. Make the feeling undeniable.</p>
    </section>
  );
}
