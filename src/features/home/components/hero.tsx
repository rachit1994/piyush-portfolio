import { categories } from "@/features/home/home-data";
import { Pill } from "@/shared/ui";

export function Hero() {
  return (
    <section className="hero">
      <h1>
        Exceptional Results
        <br />
        with
        <br />
        Consistency
      </h1>
      <div className="hero-meta">
        <p>for teams that believes in streamlining their processes</p>
        <div className="pill-row">
          {categories.map(([label, color]) => (
            <Pill dot={color} key={label}>
              {label}
            </Pill>
          ))}
        </div>
      </div>
    </section>
  );
}
