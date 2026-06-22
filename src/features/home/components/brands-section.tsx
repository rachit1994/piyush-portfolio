import { brandLogoRows } from "@/features/home/brands-data";

import { BrandsRow } from "./brands-row";

export function BrandsSection() {
  return (
    <section aria-label="Brand partners" className="brands">
      <div className="brands-shell">
        <div className="brands-grid">
          {brandLogoRows.map((row, rowIndex) => (
            <BrandsRow brands={row} key={`brand-row-${rowIndex}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
