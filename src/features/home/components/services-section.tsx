import { ProcessBoard } from "@/features/home/components/process-board";
import { ServicesCopy } from "@/features/home/components/services-copy";
import { ValueTags } from "@/features/home/components/value-tags";

export function ServicesSection() {
  return (
    <section className="services-section">
      <ValueTags />
      <div className="services-grid">
        <ServicesCopy />
        <ProcessBoard />
      </div>
    </section>
  );
}
